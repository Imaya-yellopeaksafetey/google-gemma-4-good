from __future__ import annotations

import json
import time
import urllib.error
import urllib.request
from typing import Any


class VLLMClientError(Exception):
    pass


class VLLMUpstreamUnavailable(VLLMClientError):
    pass


class VLLMTimeoutError(VLLMClientError):
    pass


class VLLMResponseError(VLLMClientError):
    pass


class VLLMClient:
    def __init__(
        self,
        *,
        upstream_url: str,
        model_name: str,
        api_key: str | None,
        timeout_s: int,
        retries: int = 1,
    ) -> None:
        self.upstream_url = upstream_url.rstrip("/")
        self.model_name = model_name
        self.api_key = api_key
        self.timeout_s = timeout_s
        self.retries = retries

    def _headers(self) -> dict[str, str]:
        headers = {"Content-Type": "application/json"}
        if self.api_key:
            headers["Authorization"] = f"Bearer {self.api_key}"
        return headers

    def health(self) -> dict[str, Any]:
        request = urllib.request.Request(
            f"{self.upstream_url}/health",
            headers=self._headers(),
            method="GET",
        )
        try:
            with urllib.request.urlopen(request, timeout=min(self.timeout_s, 10)) as response:
                body = response.read().decode("utf-8").strip()
        except urllib.error.HTTPError as exc:
            raise VLLMUpstreamUnavailable(f"vLLM health check failed with HTTP {exc.code}") from exc
        except urllib.error.URLError as exc:
            if isinstance(getattr(exc, "reason", None), TimeoutError):
                raise VLLMTimeoutError("vLLM health check timed out") from exc
            raise VLLMUpstreamUnavailable("vLLM health endpoint is unreachable") from exc

        if not body:
            return {"status": "ok"}
        try:
            parsed = json.loads(body)
            if isinstance(parsed, dict):
                return parsed
        except json.JSONDecodeError:
            pass
        return {"status": body}

    def chat_completions(
        self,
        *,
        messages: list[dict[str, str]],
        temperature: float = 0.0,
    ) -> dict[str, Any]:
        payload = {
            "model": self.model_name,
            "temperature": temperature,
            "messages": messages,
        }
        request = urllib.request.Request(
            f"{self.upstream_url}/v1/chat/completions",
            data=json.dumps(payload).encode("utf-8"),
            headers=self._headers(),
            method="POST",
        )
        last_error: Exception | None = None
        for attempt in range(self.retries + 1):
            try:
                with urllib.request.urlopen(request, timeout=self.timeout_s) as response:
                    body = json.loads(response.read().decode("utf-8"))
                if "choices" not in body:
                    raise VLLMResponseError("vLLM response missing choices field")
                return body
            except urllib.error.HTTPError as exc:
                last_error = exc
                if exc.code >= 500 and attempt < self.retries:
                    time.sleep(min(2 * (attempt + 1), 3))
                    continue
                raise VLLMUpstreamUnavailable(f"vLLM completion failed with HTTP {exc.code}") from exc
            except urllib.error.URLError as exc:
                last_error = exc
                if isinstance(getattr(exc, "reason", None), TimeoutError):
                    if attempt < self.retries:
                        time.sleep(min(2 * (attempt + 1), 3))
                        continue
                    raise VLLMTimeoutError("vLLM completion timed out") from exc
                if attempt < self.retries:
                    time.sleep(min(2 * (attempt + 1), 3))
                    continue
                raise VLLMUpstreamUnavailable("vLLM completion endpoint is unreachable") from exc
            except json.JSONDecodeError as exc:
                last_error = exc
                raise VLLMResponseError("vLLM returned malformed JSON") from exc
        raise VLLMResponseError(f"vLLM completion failed: {last_error}")
