from __future__ import annotations

from .llm_client import OpenAICompatibleClient
from .language import fallback_reason_text, suppressed_detail_note, translate_exact
from .prompt_builders import guarded_composer_payload, load_prompt, strong_composer_payload


class LaneComposer:
    def __init__(
        self,
        rendering_index: dict[str, dict[str, dict[str, dict]]],
        llm_client: OpenAICompatibleClient | None = None,
        *,
        allow_fallback: bool = True,
    ):
        self.rendering_index = rendering_index
        self.llm_client = llm_client
        self.allow_fallback = allow_fallback
        self.last_strong_method = "uninitialized"
        self.last_guarded_method = "uninitialized"

    def _action_renderings(self, family_id: str, language: str) -> list[str]:
        variants = self.rendering_index[family_id][language]
        row = variants.get("formal_direct") or next(iter(variants.values()))
        return row["answer_rendering"]

    def _deterministic_compose_strong(
        self,
        *,
        family: dict,
        plan: dict,
        normalization: dict,
        language: str,
    ) -> dict:
        action_renderings = self._action_renderings(family["scenario_family_id"], language)
        immediate_actions = []
        for action, rendered in zip(family["canonical_actions"], action_renderings):
            immediate_actions.append(
                {
                    "slot": action["step_id"],
                    "instruction": rendered,
                    "source_support": "direct",
                    "required": True,
                }
            )

        do_not_do = [
            {
                "slot": f"dn{i+1}",
                "instruction": translate_exact(item["instruction"], language),
                "source_support": "direct",
            }
            for i, item in enumerate(family.get("do_not_do", []))
        ]
        escalation_item = family.get("escalation_triggers", [{}])[0]
        escalation_instruction = translate_exact(escalation_item.get("required_action", "Seek medical attention."), language)
        return {
            "response_mode": "full_guided_response",
            "family_id": family["scenario_family_id"],
            "family_strength": plan["family_strength"],
            "family_confidence": normalization["family_confidence"],
            "language": language,
            "incident_summary": normalization["normalized_incident_summary"],
            "immediate_actions": immediate_actions,
            "do_not_do": do_not_do,
            "escalate_now": {
                "required": True,
                "instruction": escalation_instruction,
                "reason": "direct_sds_first_aid",
            },
            "evidence_basis": {
                "chemical_name": family["chemical_name"],
                "incident_type": family["incident_type"],
                "source_section_id": family["source_section_id"],
                "source_span_id": family["source_span_id"],
            },
            "fallback_reason": None,
            "suppressed_detail_note": None,
            "slot_verification": {
                "status": "pass",
                "missing_required_slots": [],
                "blocked_unsupported_slots": [],
            },
        }

    def _deterministic_compose_guarded(
        self,
        *,
        family: dict,
        plan: dict,
        normalization: dict,
        language: str,
        fallback_reason: str,
        response_mode: str,
    ) -> dict:
        action_renderings = self._action_renderings(family["scenario_family_id"], language)
        action_map = {action["step_id"]: rendered for action, rendered in zip(family["canonical_actions"], action_renderings)}
        immediate_actions = []
        for action in family["canonical_actions"]:
            if action["step_id"] not in plan["allowed_guarded_subset"]:
                continue
            immediate_actions.append(
                {
                    "slot": action["step_id"],
                    "instruction": action_map[action["step_id"]],
                    "source_support": "direct",
                    "required": action["step_id"] in plan["required_action_slots"],
                }
            )

        do_not_do = [
            {
                "slot": f"dn{i+1}",
                "instruction": translate_exact(item["instruction"], language),
                "source_support": "direct",
            }
            for i, item in enumerate(family.get("do_not_do", []))
        ]
        escalation_item = family.get("escalation_triggers", [{}])[0]
        escalation_instruction = translate_exact(escalation_item.get("required_action", "Seek medical attention."), language)

        return {
            "response_mode": response_mode,
            "family_id": family["scenario_family_id"],
            "family_strength": plan["family_strength"],
            "family_confidence": normalization["family_confidence"],
            "language": language,
            "incident_summary": normalization["normalized_incident_summary"],
            "immediate_actions": immediate_actions,
            "do_not_do": do_not_do,
            "escalate_now": {
                "required": True,
                "instruction": escalation_instruction,
                "reason": "guarded_release",
            },
            "evidence_basis": {
                "chemical_name": family["chemical_name"],
                "incident_type": family["incident_type"],
                "source_section_id": family["source_section_id"],
                "source_span_id": family["source_span_id"],
            },
            "fallback_reason": fallback_reason_text(fallback_reason, language),
            "suppressed_detail_note": suppressed_detail_note(language) if plan["blocked_detail_categories"] else None,
            "slot_verification": {
                "status": "fail",
                "missing_required_slots": [],
                "blocked_unsupported_slots": [],
            },
        }

    def _compose_model_fields(
        self,
        *,
        stage_name: str,
        system_prompt_file: str,
        payload: dict,
    ) -> dict:
        if self.llm_client is None:
            raise RuntimeError("No llm_client configured for model-driven composition")
        result = self.llm_client.chat_json(
            stage_name=stage_name,
            system_prompt=load_prompt(system_prompt_file),
            user_payload=payload,
            temperature=0.0,
        )
        required = {"incident_summary", "immediate_actions", "do_not_do", "escalate_now"}
        missing = required - set(result)
        if missing:
            raise RuntimeError(f"{stage_name} result missing keys: {sorted(missing)}")
        return result

    def _assemble_response(
        self,
        *,
        family: dict,
        plan: dict,
        normalization: dict,
        language: str,
        model_fields: dict,
        response_mode: str,
        fallback_reason: str | None,
        suppressed_note: str | None,
    ) -> dict:
        immediate_actions = [
            {
                "slot": item.get("slot", ""),
                "instruction": item.get("instruction", "").strip(),
                "source_support": "direct",
                "required": item.get("slot") in plan["required_action_slots"],
            }
            for item in model_fields.get("immediate_actions", [])
            if item.get("instruction")
        ]
        do_not_do = [
            {
                "slot": item.get("slot", ""),
                "instruction": item.get("instruction", "").strip(),
                "source_support": "direct",
            }
            for item in model_fields.get("do_not_do", [])
            if item.get("instruction")
        ]
        escalation = model_fields.get("escalate_now", {}) if isinstance(model_fields.get("escalate_now"), dict) else {}
        return {
            "response_mode": response_mode,
            "family_id": family["scenario_family_id"],
            "family_strength": plan["family_strength"],
            "family_confidence": normalization["family_confidence"],
            "language": language,
            "incident_summary": model_fields.get("incident_summary", normalization["normalized_incident_summary"]).strip(),
            "immediate_actions": immediate_actions,
            "do_not_do": do_not_do,
            "escalate_now": {
                "required": True,
                "instruction": escalation.get("instruction", "").strip(),
                "reason": escalation.get("reason", "model_generated"),
            },
            "evidence_basis": {
                "chemical_name": family["chemical_name"],
                "incident_type": family["incident_type"],
                "source_section_id": family["source_section_id"],
                "source_span_id": family["source_span_id"],
            },
            "fallback_reason": fallback_reason,
            "suppressed_detail_note": suppressed_note,
            "slot_verification": {
                "status": "pass" if response_mode == "full_guided_response" else "fail",
                "missing_required_slots": [],
                "blocked_unsupported_slots": [],
            },
        }

    def compose_strong(
        self,
        *,
        family: dict,
        plan: dict,
        normalization: dict,
        language: str,
    ) -> dict:
        if self.llm_client is not None:
            try:
                fields = self._compose_model_fields(
                    stage_name="strong_lane",
                    system_prompt_file="strong_lane_system_v2.md",
                    payload=strong_composer_payload(family, plan, normalization, language),
                )
                response = self._assemble_response(
                    family=family,
                    plan=plan,
                    normalization=normalization,
                    language=language,
                    model_fields=fields,
                    response_mode="full_guided_response",
                    fallback_reason=None,
                    suppressed_note=None,
                )
                self.last_strong_method = "gemma"
                return response
            except Exception:
                if not self.allow_fallback:
                    raise
        self.last_strong_method = "deterministic_fallback"
        return self._deterministic_compose_strong(
            family=family,
            plan=plan,
            normalization=normalization,
            language=language,
        )

    def compose_guarded(
        self,
        *,
        family: dict,
        plan: dict,
        normalization: dict,
        language: str,
        fallback_reason: str,
        response_mode: str,
    ) -> dict:
        if self.llm_client is not None:
            try:
                fields = self._compose_model_fields(
                    stage_name="guarded_lane",
                    system_prompt_file="guarded_lane_system_v2.md",
                    payload=guarded_composer_payload(
                        family,
                        plan,
                        normalization,
                        language,
                        fallback_reason,
                        response_mode,
                    ),
                )
                response = self._assemble_response(
                    family=family,
                    plan=plan,
                    normalization=normalization,
                    language=language,
                    model_fields=fields,
                    response_mode=response_mode,
                    fallback_reason=fallback_reason_text(fallback_reason, language),
                    suppressed_note=suppressed_detail_note(language) if plan["blocked_detail_categories"] else None,
                )
                self.last_guarded_method = "gemma"
                return response
            except Exception:
                if not self.allow_fallback:
                    raise
        self.last_guarded_method = "deterministic_fallback"
        return self._deterministic_compose_guarded(
            family=family,
            plan=plan,
            normalization=normalization,
            language=language,
            fallback_reason=fallback_reason,
            response_mode=response_mode,
        )
