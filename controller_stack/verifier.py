from __future__ import annotations

from .config import CONDITIONAL_ESCALATION_MARKERS, GENERIC_CHAT_PATTERNS, IMMEDIATE_ESCALATION_MARKERS, UNSUPPORTED_DETAIL_PATTERNS
from .language import normalize_text


REQUIRED_TOP_LEVEL_FIELDS = {
    "response_mode",
    "family_id",
    "family_strength",
    "family_confidence",
    "language",
    "incident_summary",
    "immediate_actions",
    "do_not_do",
    "escalate_now",
    "evidence_basis",
    "fallback_reason",
    "suppressed_detail_note",
    "slot_verification",
}


class SlotVerifier:
    def verify(self, response: dict, plan: dict, verification_target: str = "full") -> dict:
        missing_required_slots: list[str] = []
        blocked_unsupported_slots: list[str] = []
        schema_issues: list[str] = []

        for field in REQUIRED_TOP_LEVEL_FIELDS:
            if field not in response:
                schema_issues.append(f"missing_field:{field}")

        immediate_slots = [item.get("slot") for item in response.get("immediate_actions", [])]
        do_not_slots = [item.get("slot") for item in response.get("do_not_do", [])]
        required_action_slots = plan["required_action_slots"] if verification_target == "full" else plan["allowed_guarded_subset"]
        required_do_not_slots = plan["required_do_not_slots"] if verification_target == "full" and plan["require_do_not_for_full_release"] else []

        for slot in required_action_slots:
            if slot not in immediate_slots:
                missing_required_slots.append(slot)
        for slot in required_do_not_slots:
            if slot not in do_not_slots:
                missing_required_slots.append(slot)

        escalation = response.get("escalate_now", {})
        escalation_text = normalize_text(escalation.get("instruction", ""))
        language = response.get("language", "english")
        urgent_markers = IMMEDIATE_ESCALATION_MARKERS.get(language, IMMEDIATE_ESCALATION_MARKERS["english"])
        conditional_markers = CONDITIONAL_ESCALATION_MARKERS.get(language, CONDITIONAL_ESCALATION_MARKERS["english"])
        if plan["require_escalation_for_full_release"] and not escalation_text:
            missing_required_slots.append("escalate_now")
        if escalation_text and any(marker in escalation_text for marker in conditional_markers) and not any(
            marker in escalation_text for marker in urgent_markers
        ):
            blocked_unsupported_slots.append("weakened_escalation")

        combined_text = " ".join(
            [response.get("incident_summary", "")]
            + [item.get("instruction", "") for item in response.get("immediate_actions", [])]
            + [item.get("instruction", "") for item in response.get("do_not_do", [])]
            + [response.get("escalate_now", {}).get("instruction", "")]
        )
        lowered = normalize_text(combined_text)

        for pattern in UNSUPPORTED_DETAIL_PATTERNS:
            if pattern in lowered:
                blocked_unsupported_slots.append(f"unsupported_pattern:{pattern}")
        for pattern in GENERIC_CHAT_PATTERNS:
            if pattern in lowered:
                blocked_unsupported_slots.append(f"generic_chat:{pattern}")

        allowed_slots = set(plan["required_action_slots"]) | set(plan["allowed_guarded_subset"])
        extra_slots = [slot for slot in immediate_slots if slot and slot not in allowed_slots]
        blocked_unsupported_slots.extend(f"unknown_slot:{slot}" for slot in extra_slots)

        issues = schema_issues + missing_required_slots + blocked_unsupported_slots
        status = "pass" if not issues else "fail"
        return {
            "status": status,
            "missing_required_slots": sorted(set(missing_required_slots)),
            "blocked_unsupported_slots": sorted(set(blocked_unsupported_slots + schema_issues)),
            "downgrade_required": status == "fail",
        }
