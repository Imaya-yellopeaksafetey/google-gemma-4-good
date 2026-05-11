from __future__ import annotations

import json
import uuid
from typing import Any

from controller_stack.controller import ChemicalEmergencyController

from .catalog_service import CatalogService
from .vllm_client import VLLMClient, VLLMClientError


class ControllerGatewayError(Exception):
    pass


class ControllerOutputError(ControllerGatewayError):
    pass


class ControllerLLMAdapter:
    def __init__(self, vllm_client: VLLMClient) -> None:
        self.vllm_client = vllm_client
        self.model_name = vllm_client.model_name
        self.api_base = vllm_client.upstream_url

    def probe(self, timeout_s: int = 10) -> dict[str, Any]:
        health = self.vllm_client.health()
        return {"data": [{"id": self.model_name}], "health": health, "timeout_s": timeout_s}

    def chat_json(
        self,
        *,
        stage_name: str,
        system_prompt: str,
        user_payload: dict[str, Any],
        temperature: float = 0.0,
        max_retries: int = 3,
    ) -> dict[str, Any]:
        del stage_name, max_retries
        body = self.vllm_client.chat_completions(
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": json.dumps(user_payload, ensure_ascii=False, indent=2)},
            ],
            temperature=temperature,
        )
        try:
            raw_text = body["choices"][0]["message"]["content"].strip()
        except (KeyError, IndexError, TypeError) as exc:
            raise ControllerOutputError("vLLM returned an invalid chat completion shape") from exc
        try:
            parsed = json.loads(raw_text)
            if isinstance(parsed, dict):
                return parsed
        except json.JSONDecodeError:
            pass
        start = raw_text.find("{")
        end = raw_text.rfind("}")
        if start == -1 or end == -1 or end <= start:
            raise ControllerOutputError("Controller stage returned no JSON object")
        return json.loads(raw_text[start : end + 1])


class ControllerService:
    def __init__(
        self,
        *,
        catalog_service: CatalogService,
        vllm_client: VLLMClient,
        controller_version: str,
    ) -> None:
        self.catalog_service = catalog_service
        self.vllm_client = vllm_client
        self.controller_version = controller_version
        adapter = ControllerLLMAdapter(vllm_client)
        self.controller = ChemicalEmergencyController(
            enable_model_stages=False,
            allow_stage_fallback=False,
        )
        self.controller.llm_client = adapter
        self.controller.normalizer.llm_client = adapter
        self.controller.normalizer.allow_fallback = False
        self.controller.composer.llm_client = adapter
        self.controller.composer.allow_fallback = False

    @staticmethod
    def _build_worker_prompt(worker_query: str, chemical_record: dict, target_language: str) -> str:
        preferred_name = chemical_record["names"].get(target_language) or chemical_record["names"]["english"]
        controller_name = chemical_record["controller_context"]["chemical_name"]
        return (
            f"{worker_query.strip()}\n"
            f"Chemical/product: {preferred_name} ({controller_name})."
        )

    def _map_response(self, *, chemical_id: str, trace: dict[str, Any]) -> dict[str, Any]:
        final = trace["final_response"]
        normalization = trace["normalization"]
        if not final.get("incident_summary") or not final.get("escalate_now", {}).get("instruction"):
            raise ControllerOutputError("Controller returned incomplete emergency response")
        return {
            "request_id": f"req_{uuid.uuid4().hex[:12]}",
            "chemical_id": chemical_id,
            "response_mode": final["response_mode"],
            "incident_summary": final["incident_summary"],
            "immediate_actions": [{"instruction": item["instruction"]} for item in final.get("immediate_actions", [])],
            "do_not_do": [{"instruction": item["instruction"]} for item in final.get("do_not_do", [])],
            "escalate_now": {"instruction": final["escalate_now"]["instruction"]},
            "fallback_reason": final.get("fallback_reason"),
            "evidence_basis": [
                {
                    "label": "SDS-grounded guidance",
                    "source_section_id": final["evidence_basis"].get("source_section_id"),
                    "source_span_id": final["evidence_basis"].get("source_span_id"),
                }
            ],
            "meta": {
                "detected_language": normalization["detected_language"],
                "family_id": final["family_id"],
                "family_confidence": normalization["family_confidence"],
            },
        }

    def health(self) -> dict[str, Any]:
        health = self.vllm_client.health()
        vllm_state = "ok" if str(health.get("status", "ok")).lower() in {"ok", "healthy"} else "degraded"
        return {
            "status": "ok" if vllm_state == "ok" else "degraded",
            "gateway": "ok",
            "vllm": vllm_state,
            "model": self.vllm_client.model_name,
            "controller_version": self.controller_version,
        }

    def respond(self, *, chemical_id: str, worker_query: str, target_language: str) -> dict[str, Any]:
        chemical_record = self.catalog_service.get_chemical(chemical_id)
        worker_prompt = self._build_worker_prompt(worker_query, chemical_record, target_language)
        try:
            trace = self.controller.run_with_trace(worker_prompt=worker_prompt, target_language=target_language)
        except VLLMClientError:
            raise
        except Exception as exc:
            raise ControllerGatewayError("Controller flow failed") from exc
        return self._map_response(chemical_id=chemical_id, trace=trace)
