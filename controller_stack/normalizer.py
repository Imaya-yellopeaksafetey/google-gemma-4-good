from __future__ import annotations

from dataclasses import dataclass
import re

from .config import CHEMICAL_ALIASES, INCIDENT_HINTS
from .llm_client import OpenAICompatibleClient
from .language import detect_language, incident_summary, normalize_text
from .prompt_builders import load_prompt, normalizer_payload


def chemical_key_for_family(family_id: str) -> str:
    parts = family_id.split("_")
    return parts[1] if len(parts) > 1 else family_id


@dataclass
class RankedFamily:
    family_id: str
    score: int
    chemical_hits: int
    incident_hits: int


class IncidentNormalizer:
    def __init__(
        self,
        family_index: dict[str, dict],
        llm_client: OpenAICompatibleClient | None = None,
        *,
        allow_fallback: bool = True,
    ):
        self.family_index = family_index
        self.llm_client = llm_client
        self.allow_fallback = allow_fallback
        self.last_method = "uninitialized"

    @staticmethod
    def _marker_present(prompt: str, marker: str) -> bool:
        lowered_marker = normalize_text(marker)
        if re.fullmatch(r"[a-z0-9,\- ]+", lowered_marker):
            pattern = r"(?<![a-z0-9])" + re.escape(lowered_marker) + r"(?![a-z0-9])"
            return re.search(pattern, prompt) is not None
        return lowered_marker in prompt

    def _deterministic_normalize(self, worker_prompt: str, target_language: str | None = None) -> dict:
        detected_language = target_language or detect_language(worker_prompt)
        prompt = normalize_text(worker_prompt)
        ranked: list[RankedFamily] = []

        for family_id, family in self.family_index.items():
            chemical_key = chemical_key_for_family(family_id)
            aliases = CHEMICAL_ALIASES.get(chemical_key, []) + [family["chemical_name"].lower()]
            chemical_hits = sum(1 for alias in aliases if alias and self._marker_present(prompt, alias))
            incident_hits = sum(1 for hint in INCIDENT_HINTS.get(family["incident_type"], []) if self._marker_present(prompt, hint))
            score = (chemical_hits * 4) + incident_hits
            ranked.append(RankedFamily(family_id=family_id, score=score, chemical_hits=chemical_hits, incident_hits=incident_hits))

        ranked.sort(key=lambda item: (item.score, item.chemical_hits, item.incident_hits), reverse=True)
        top = ranked[0]
        second = ranked[1] if len(ranked) > 1 else RankedFamily("", 0, 0, 0)
        family = self.family_index[top.family_id]

        ambiguity_flags: list[str] = []
        if top.chemical_hits == 0:
            ambiguity_flags.append("missing_explicit_chemical_identity")
        if top.incident_hits == 0:
            ambiguity_flags.append("missing_explicit_incident_signal")
        if second.score == top.score and second.score > 0:
            ambiguity_flags.append("multiple_family_candidates")
        if top.score <= 1:
            ambiguity_flags.append("low_signal_prompt")

        if (
            top.chemical_hits >= 1
            and top.incident_hits >= 1
            and top.score >= 5
            and (top.score > second.score or second.incident_hits == 0)
        ):
            confidence = "high"
        elif top.score >= 3 and top.score > second.score:
            confidence = "medium"
        else:
            confidence = "low"

        return {
            "detected_language": detected_language,
            "incident_type_guess": family["incident_type"],
            "chemical_guess": family["chemical_name"],
            "family_id_guess": top.family_id,
            "family_confidence": confidence,
            "normalized_incident_summary": incident_summary(
                detected_language,
                family["chemical_name"],
                family["incident_type"],
            ),
            "ambiguity_flags": ambiguity_flags,
            "candidate_rankings": [
                {
                    "family_id": item.family_id,
                    "score": item.score,
                    "chemical_hits": item.chemical_hits,
                    "incident_hits": item.incident_hits,
                }
                for item in ranked[:5]
            ],
        }

    def _model_normalize(self, worker_prompt: str, target_language: str | None = None) -> dict:
        if self.llm_client is None:
            raise RuntimeError("No llm_client configured for model-driven normalization")
        payload = normalizer_payload(worker_prompt, target_language, self.family_index)
        result = self.llm_client.chat_json(
            stage_name="normalizer",
            system_prompt=load_prompt("normalizer_system_v2.md"),
            user_payload=payload,
            temperature=0.0,
        )
        required_keys = {
            "detected_language",
            "incident_type_guess",
            "chemical_guess",
            "family_id_guess",
            "family_confidence",
            "normalized_incident_summary",
            "ambiguity_flags",
        }
        missing = required_keys - set(result)
        if missing:
            raise RuntimeError(f"Normalizer result missing keys: {sorted(missing)}")
        if result["family_id_guess"] not in self.family_index:
            raise RuntimeError(f"Normalizer returned unknown family_id_guess: {result['family_id_guess']}")
        if result["family_confidence"] not in {"high", "medium", "low"}:
            raise RuntimeError(f"Normalizer returned invalid family_confidence: {result['family_confidence']}")
        if result["detected_language"] not in {"english", "malay", "bangla", "bahasa_indonesia"}:
            raise RuntimeError(f"Normalizer returned invalid detected_language: {result['detected_language']}")
        family = self.family_index[result["family_id_guess"]]
        result.setdefault("candidate_rankings", [])
        result["incident_type_guess"] = family["incident_type"]
        result["chemical_guess"] = family["chemical_name"]
        if not isinstance(result["ambiguity_flags"], list):
            result["ambiguity_flags"] = []
        return result

    def normalize(self, worker_prompt: str, target_language: str | None = None) -> dict:
        if self.llm_client is not None:
            try:
                result = self._model_normalize(worker_prompt, target_language=target_language)
                self.last_method = "gemma"
                return result
            except Exception:
                if not self.allow_fallback:
                    raise
        self.last_method = "deterministic_fallback"
        return self._deterministic_normalize(worker_prompt, target_language=target_language)
