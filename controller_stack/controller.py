from __future__ import annotations

import json
from pathlib import Path
from typing import Any

from .composer import LaneComposer
from .config import BENCHMARK_DIR
from .llm_client import DEFAULT_API_BASE, DEFAULT_MODEL_NAME, OpenAICompatibleClient
from .language import fallback_reason_text
from .loaders import benchmark_rows_by_family_language, load_jsonl, scenario_family_index
from .normalizer import IncidentNormalizer
from .planner import ResponsePlanner
from .selector import ReleaseSelector
from .verifier import SlotVerifier


class ChemicalEmergencyController:
    def __init__(
        self,
        scenario_families_path: Path | None = None,
        benchmark_rows_path: Path | None = None,
        *,
        api_base: str = DEFAULT_API_BASE,
        api_key: str | None = None,
        model_name: str = DEFAULT_MODEL_NAME,
        timeout_s: int = 120,
        llm_cache_dir: Path | None = None,
        llm_response_dir: Path | None = None,
        enable_model_stages: bool = True,
        allow_stage_fallback: bool = True,
    ) -> None:
        scenario_families_path = scenario_families_path or (BENCHMARK_DIR / "scenario_families_v0.json")
        benchmark_rows_path = benchmark_rows_path or (BENCHMARK_DIR / "benchmark_core_v0.jsonl")
        self.family_index = scenario_family_index(scenario_families_path)
        self.rows = load_jsonl(benchmark_rows_path)
        self.row_index = benchmark_rows_by_family_language(self.rows)
        self.llm_client = (
            OpenAICompatibleClient(
                api_base=api_base,
                api_key=api_key,
                model_name=model_name,
                timeout_s=timeout_s,
                cache_dir=llm_cache_dir,
                response_dir=llm_response_dir,
            )
            if enable_model_stages
            else None
        )
        self.allow_stage_fallback = allow_stage_fallback
        self.normalizer = IncidentNormalizer(
            self.family_index,
            llm_client=self.llm_client,
            allow_fallback=allow_stage_fallback,
        )
        self.planner = ResponsePlanner()
        self.composer = LaneComposer(
            self.row_index,
            llm_client=self.llm_client,
            allow_fallback=allow_stage_fallback,
        )
        self.verifier = SlotVerifier()
        self.selector = ReleaseSelector()

    def run_with_trace(
        self,
        *,
        worker_prompt: str,
        target_language: str | None = None,
        family_id_override: str | None = None,
    ) -> dict[str, Any]:
        normalization = self.normalizer.normalize(worker_prompt, target_language=target_language)
        family_id = family_id_override or normalization["family_id_guess"]
        family = self.family_index[family_id]
        plan = self.planner.build_plan(family)
        language = target_language or normalization["detected_language"]

        strong_candidate = None
        verification = None
        if plan["family_strength"] == "strong_demo_safe" and normalization["family_confidence"] == "high":
            strong_candidate = self.composer.compose_strong(
                family=family,
                plan=plan,
                normalization=normalization,
                language=language,
            )
            verification = self.verifier.verify(strong_candidate, plan, verification_target="full")

        fallback_reason = "weak_family_guardrail"
        if plan["family_strength"] == "strong_demo_safe" and normalization["family_confidence"] != "high":
            fallback_reason = "classification_not_confident"
        elif verification and verification["missing_required_slots"]:
            fallback_reason = "missing_required_slots"
        elif verification and verification["blocked_unsupported_slots"]:
            fallback_reason = "unsupported_detail_risk"

        guarded_mode = "guarded_escalate_now" if plan["default_guarded_mode"] == "guarded_escalate_now" or normalization["family_confidence"] == "low" else "guarded_minimum_response"
        guarded_candidate = self.composer.compose_guarded(
            family=family,
            plan=plan,
            normalization=normalization,
            language=language,
            fallback_reason=fallback_reason,
            response_mode=guarded_mode,
        )
        final_response = self.selector.select(
            normalization=normalization,
            plan=plan,
            strong_candidate=strong_candidate,
            guarded_candidate=guarded_candidate,
            verification=verification,
        )
        if final_response.get("fallback_reason_key"):
            final_response["fallback_reason"] = fallback_reason_text(final_response.pop("fallback_reason_key"), language)

        return {
            "normalization": normalization,
            "plan": plan,
            "strong_candidate": strong_candidate,
            "guarded_candidate": guarded_candidate,
            "verification": verification,
            "stage_methods": {
                "normalizer": self.normalizer.last_method,
                "strong_composer": self.composer.last_strong_method,
                "guarded_composer": self.composer.last_guarded_method,
            },
            "final_response": final_response,
        }

    def render_response_text(self, response: dict[str, Any]) -> str:
        lines = [response["incident_summary"]]
        for index, action in enumerate(response["immediate_actions"], start=1):
            lines.append(f"STEP {index}: {action['instruction']}")
        for item in response.get("do_not_do", []):
            lines.append(f"DO NOT: {item['instruction']}")
        lines.append(f"ESCALATE: {response['escalate_now']['instruction']}")
        if response.get("fallback_reason"):
            lines.append(f"MODE: {response['fallback_reason']}")
        return "\n".join(lines)


def main() -> int:
    controller = ChemicalEmergencyController()
    sample = controller.run_with_trace(worker_prompt="Paraquat went in my eye. Burning bad. Fast please.", target_language="english")
    print(json.dumps(sample["final_response"], ensure_ascii=False, indent=2))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
