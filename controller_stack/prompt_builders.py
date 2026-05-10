from __future__ import annotations

import json
from pathlib import Path

from .config import CHEMICAL_ALIASES


PROMPTS_DIR = Path(__file__).resolve().parent / "prompts"


def load_prompt(name: str) -> str:
    return (PROMPTS_DIR / name).read_text(encoding="utf-8")


def family_catalog_payload(family_index: dict[str, dict]) -> list[dict]:
    catalog = []
    for family_id, family in sorted(family_index.items()):
        chemical_key = family_id.split("_")[1] if "_" in family_id else family_id
        catalog.append(
            {
                "family_id": family_id,
                "chemical_name": family["chemical_name"],
                "incident_type": family["incident_type"],
                "aliases": CHEMICAL_ALIASES.get(chemical_key, []),
            }
        )
    return catalog


def normalizer_payload(worker_prompt: str, target_language: str | None, family_index: dict[str, dict]) -> dict:
    return {
        "task": "incident_normalization",
        "worker_prompt": worker_prompt,
        "target_language_hint": target_language,
        "allowed_languages": ["english", "malay", "bangla", "bahasa_indonesia"],
        "candidate_families": family_catalog_payload(family_index),
        "required_output_keys": [
            "detected_language",
            "incident_type_guess",
            "chemical_guess",
            "family_id_guess",
            "family_confidence",
            "normalized_incident_summary",
            "ambiguity_flags",
        ],
        "critical_disambiguation_rules": [
            "If the worker says the chemical went into the mouth, was swallowed, or was taken orally, treat that as ingestion, not skin exposure.",
            "In Bangla, phrases like 'মুখে গেছে', 'মুখে ঢুকে গেছে', or 'গিলে ফেলেছে' point to ingestion unless the prompt explicitly says the chemical only touched the outside of the mouth or face.",
            "Do not choose skin exposure just because the word for mouth appears.",
        ],
    }


def strong_composer_payload(family: dict, plan: dict, normalization: dict, language: str) -> dict:
    return {
        "task": "strong_lane_response",
        "language": language,
        "normalized_incident_summary": normalization["normalized_incident_summary"],
        "family_id": family["scenario_family_id"],
        "family_strength": plan["family_strength"],
        "chemical_name": family["chemical_name"],
        "incident_type": family["incident_type"],
        "canonical_actions": [
            {"slot": action["step_id"], "instruction": action["instruction"], "priority": action["priority"]}
            for action in family["canonical_actions"]
        ],
        "do_not_do": [
            {"slot": f"dn{i+1}", "instruction": item["instruction"]}
            for i, item in enumerate(family.get("do_not_do", []))
        ],
        "escalation": {
            "slot": "es1",
            "instruction": family.get("escalation_triggers", [{}])[0].get("required_action", "Seek medical attention."),
            "condition": family.get("escalation_triggers", [{}])[0].get("condition", ""),
            "mode": plan["escalation_mode"],
        },
        "blocked_detail_categories": plan["blocked_detail_categories"],
        "release_constraints": {
            "action_order_must_match_slots": plan["required_action_slots"],
            "escalation_must_not_strengthen_source_condition": plan["escalation_mode"] == "conditional",
            "escalation_must_not_weaken_source_condition": True,
        },
        "required_output_shape": {
            "incident_summary": "string",
            "immediate_actions": [{"slot": "string", "instruction": "string"}],
            "do_not_do": [{"slot": "string", "instruction": "string"}],
            "escalate_now": {"instruction": "string", "reason": "string"},
        },
    }


def guarded_composer_payload(
    family: dict,
    plan: dict,
    normalization: dict,
    language: str,
    fallback_reason: str,
    response_mode: str,
) -> dict:
    allowed_slots = set(plan["allowed_guarded_subset"])
    return {
        "task": "guarded_lane_response",
        "language": language,
        "response_mode": response_mode,
        "fallback_reason_key": fallback_reason,
        "normalized_incident_summary": normalization["normalized_incident_summary"],
        "family_id": family["scenario_family_id"],
        "family_strength": plan["family_strength"],
        "chemical_name": family["chemical_name"],
        "incident_type": family["incident_type"],
        "allowed_guarded_actions": [
            {"slot": action["step_id"], "instruction": action["instruction"], "priority": action["priority"]}
            for action in family["canonical_actions"]
            if action["step_id"] in allowed_slots
        ],
        "do_not_do": [
            {"slot": f"dn{i+1}", "instruction": item["instruction"]}
            for i, item in enumerate(family.get("do_not_do", []))
        ],
        "escalation": {
            "slot": "es1",
            "instruction": family.get("escalation_triggers", [{}])[0].get("required_action", "Seek medical attention."),
            "condition": family.get("escalation_triggers", [{}])[0].get("condition", ""),
            "mode": plan["escalation_mode"],
        },
        "blocked_detail_categories": plan["blocked_detail_categories"],
        "guarded_constraints": {
            "all_allowed_actions_mandatory": True,
            "allowed_action_order_must_match_slots": plan["allowed_guarded_subset"],
            "keep_prohibition_slots_as_steps": True,
            "never_reinterpret_ingestion_as_skin_or_clothing_decontamination": family["incident_type"] == "ingestion",
            "never_hide_doctor_or_poison_control_contact_inside_only_conditional_escalation": family["scenario_family_id"] == "sf_paraquat_inhalation_01",
        },
        "required_output_shape": {
            "incident_summary": "string",
            "immediate_actions": [{"slot": "string", "instruction": "string"}],
            "do_not_do": [{"slot": "string", "instruction": "string"}],
            "escalate_now": {"instruction": "string", "reason": "string"},
        },
    }
