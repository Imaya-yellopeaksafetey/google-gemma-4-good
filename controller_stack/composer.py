from __future__ import annotations

from .language import fallback_reason_text, suppressed_detail_note, translate_exact


class LaneComposer:
    def __init__(self, rendering_index: dict[str, dict[str, dict[str, dict]]]):
        self.rendering_index = rendering_index

    def _action_renderings(self, family_id: str, language: str) -> list[str]:
        variants = self.rendering_index[family_id][language]
        row = variants.get("formal_direct") or next(iter(variants.values()))
        return row["answer_rendering"]

    def compose_strong(
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
