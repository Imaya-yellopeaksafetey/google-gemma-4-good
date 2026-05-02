from __future__ import annotations

import hashlib
import json
import os
import time
import urllib.error
import urllib.request
from pathlib import Path
from typing import Any


DEFAULT_API_BASE = "http://localhost:8000/v1"
DEFAULT_MODEL_NAME = "google/gemma-4-31B-it"
DEFAULT_LOCAL_API_KEY = "imayaisanawesomehumanbeignWtihGoodIntellect"


def stable_json(payload: Any) -> str:
    return json.dumps(payload, ensure_ascii=False, sort_keys=True, separators=(",", ":"))


def sha256_text(text: str) -> str:
    return hashlib.sha256(text.encode("utf-8")).hexdigest()


def extract_json_object(text: str) -> dict[str, Any]:
    stripped = text.strip()
    try:
        parsed = json.loads(stripped)
        if isinstance(parsed, dict):
            return parsed
    except json.JSONDecodeError:
        pass

    start = stripped.find("{")
    end = stripped.rfind("}")
    if start == -1 or end == -1 or end <= start:
        raise ValueError("No JSON object found in model response")
    parsed = json.loads(stripped[start : end + 1])
    if not isinstance(parsed, dict):
        raise ValueError("Model response did not decode to a JSON object")
    return parsed


class OpenAICompatibleClient:
    def __init__(
        self,
        *,
        api_base: str = DEFAULT_API_BASE,
        api_key: str | None = None,
        model_name: str = DEFAULT_MODEL_NAME,
        timeout_s: int = 120,
        cache_dir: Path | None = None,
        response_dir: Path | None = None,
    ) -> None:
        self.api_base = api_base
        self.api_key = api_key or self.resolve_api_key(api_base)
        self.model_name = model_name
        self.timeout_s = timeout_s
        self.cache_dir = cache_dir
        self.response_dir = response_dir
        if self.cache_dir is not None:
            self.cache_dir.mkdir(parents=True, exist_ok=True)
        if self.response_dir is not None:
            self.response_dir.mkdir(parents=True, exist_ok=True)

    @staticmethod
    def resolve_api_key(api_base: str) -> str | None:
        explicit = os.environ.get("OPENAI_API_KEY")
        if explicit:
            return explicit
        if api_base.rstrip("/") == DEFAULT_API_BASE:
            return DEFAULT_LOCAL_API_KEY
        return None

    def _cache_path(self, stage_name: str, cache_key: str) -> Path | None:
        if self.cache_dir is None:
            return None
        return self.cache_dir / f"{stage_name}_{cache_key}.json"

    def _response_path(self, stage_name: str, cache_key: str) -> Path | None:
        if self.response_dir is None:
            return None
        return self.response_dir / f"{stage_name}_{cache_key}.json"

    def probe(self, timeout_s: int = 10) -> dict[str, Any]:
        request = urllib.request.Request(
            f"{self.api_base.rstrip('/')}/models",
            headers={
                "Content-Type": "application/json",
                **({"Authorization": f"Bearer {self.api_key}"} if self.api_key else {}),
            },
            method="GET",
        )
        with urllib.request.urlopen(request, timeout=timeout_s) as response:
            body = json.loads(response.read().decode("utf-8"))
        return body

    def chat_json(
        self,
        *,
        stage_name: str,
        system_prompt: str,
        user_payload: dict[str, Any],
        temperature: float = 0.0,
        max_retries: int = 3,
    ) -> dict[str, Any]:
        payload_json = stable_json(user_payload)
        cache_key = sha256_text(
            "|".join(
                [
                    stage_name,
                    self.model_name,
                    self.api_base.rstrip("/"),
                    system_prompt,
                    payload_json,
                ]
            )
        )
        cache_path = self._cache_path(stage_name, cache_key)
        if cache_path is not None and cache_path.exists():
            return json.loads(cache_path.read_text(encoding="utf-8"))["parsed_json"]

        raw_text = ""
        last_error: Exception | None = None
        request_payload = {
            "model": self.model_name,
            "temperature": temperature,
            "messages": [
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": json.dumps(user_payload, ensure_ascii=False, indent=2)},
            ],
        }
        request = urllib.request.Request(
            f"{self.api_base.rstrip('/')}/chat/completions",
            data=json.dumps(request_payload).encode("utf-8"),
            headers={
                "Content-Type": "application/json",
                **({"Authorization": f"Bearer {self.api_key}"} if self.api_key else {}),
            },
            method="POST",
        )

        for attempt in range(1, max_retries + 1):
            try:
                with urllib.request.urlopen(request, timeout=self.timeout_s) as response:
                    body = json.loads(response.read().decode("utf-8"))
                raw_text = body["choices"][0]["message"]["content"].strip()
                parsed = extract_json_object(raw_text)
                record = {
                    "stage_name": stage_name,
                    "model_name": self.model_name,
                    "api_base": self.api_base,
                    "user_payload": user_payload,
                    "raw_response": raw_text,
                    "parsed_json": parsed,
                }
                if cache_path is not None:
                    cache_path.write_text(json.dumps(record, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
                response_path = self._response_path(stage_name, cache_key)
                if response_path is not None:
                    response_path.write_text(json.dumps(record, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
                return parsed
            except (urllib.error.URLError, json.JSONDecodeError, ValueError, KeyError) as exc:
                last_error = exc
                if attempt == max_retries:
                    break
                time.sleep(min(2 * attempt, 5))
        raise RuntimeError(f"{stage_name} model call failed after {max_retries} attempts: {last_error}")
