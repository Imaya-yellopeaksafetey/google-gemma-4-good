from __future__ import annotations

from .config import FAMILY_POLICY_OVERRIDES, STRONG_DEMO_SAFE_FAMILIES, WEAK_GUARDED_FAMILIES


class ResponsePlanner:
    def build_plan(self, family: dict) -> dict:
        family_id = family["scenario_family_id"]
        override = FAMILY_POLICY_OVERRIDES.get(family_id, {})
        if family_id in STRONG_DEMO_SAFE_FAMILIES:
            family_strength = "strong_demo_safe"
        elif family_id in WEAK_GUARDED_FAMILIES:
            family_strength = "weak_guarded"
        else:
            family_strength = override.get("family_strength", "weak_guarded")

        required_action_slots = [action["step_id"] for action in family["canonical_actions"]]
        required_do_not_slots = [f"dn{i+1}" for i, _ in enumerate(family.get("do_not_do", []))]
        required_escalation_slots = [f"es{i+1}" for i, _ in enumerate(family.get("escalation_triggers", []))]
        guarded_subset = override.get("allowed_guarded_subset", required_action_slots[: max(1, len(required_action_slots) - 1)])

        return {
            "family_id": family_id,
            "family_strength": family_strength,
            "required_action_slots": required_action_slots,
            "required_do_not_slots": required_do_not_slots,
            "required_escalation_slots": required_escalation_slots,
            "allowed_guarded_subset": guarded_subset,
            "blocked_detail_categories": override.get("blocked_detail_categories", []),
            "default_guarded_mode": override.get("default_guarded_mode", "guarded_minimum_response"),
            "require_do_not_for_full_release": bool(required_do_not_slots),
            "require_escalation_for_full_release": bool(required_escalation_slots),
        }
