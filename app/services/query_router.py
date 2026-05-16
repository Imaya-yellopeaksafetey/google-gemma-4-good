from __future__ import annotations

import re
from dataclasses import dataclass


def _normalize(text: str) -> str:
    lowered = text.casefold()
    lowered = re.sub(r"[^a-z0-9\u0980-\u09ff\s]+", " ", lowered)
    return re.sub(r"\s+", " ", lowered).strip()


def _contains_pattern(normalized_text: str, pattern: str) -> bool:
    normalized_pattern = _normalize(pattern)
    haystack = f" {normalized_text} "
    needle = f" {normalized_pattern} "
    return haystack == needle or needle in haystack


@dataclass(frozen=True)
class QueryModeDecision:
    mode: str
    rewritten_query: str
    route_reason: str
    canonical_incident_type: str | None = None


PREVENTIVE_PATTERNS = (
    "ppe",
    "protective equipment",
    "what should i wear",
    "what to wear",
    "while spraying",
    "precaution",
    "precautions",
    "handling",
    "handle this",
    "safe handling",
    "storage",
    "store",
    "spraying safely",
    "spray safely",
    "gloves",
    "goggles",
    "mask",
    "respirator",
    "boots",
    "apron",
    "face shield",
    "sarung tangan",
    "pelitup",
    "masker",
    "kacamata",
    "penyimpanan",
    "penanganan",
    "langkah berjaga",
    "apa yang perlu dipakai",
    "কি পরব",
    "সতর্কতা",
    "পিপিই",
    "গ্লাভস",
    "মাস্ক",
    "সংরক্ষণ",
)

EMERGENCY_PATTERNS = (
    "went in",
    "got in",
    "splashed",
    "spray went",
    "spray got",
    "touched",
    "burning",
    "burns",
    "exposed",
    "entered",
    "in my eye",
    "in the eye",
    "in my ear",
    "side of my face",
    "cheek",
    "around my eye",
    "around the eye",
    "on my face",
    "on my skin",
    "inhaled",
    "breathed",
    "mouth",
    "swallowed",
    "mulut",
    "mata",
    "kulit",
    "চোখ",
    "কানে",
    "মুখে",
    "ত্বকে",
)

AROUND_EYE_PATTERNS = (
    "around eye",
    "around my eye",
    "around the eye",
    "near eye",
    "near my eye",
    "eyelid",
    "kelopak",
    "চোখের পাশ",
    "চোখের চারপাশ",
)

FACE_SURFACE_PATTERNS = (
    "ear",
    "my ear",
    "in my ear",
    "face",
    "side of my face",
    "cheek",
    "jaw",
    "chin",
    "nose",
    "outer ear",
    "muka",
    "pipi",
    "telinga",
    "মুখের পাশে",
    "গালে",
    "কানে",
)

SKIN_SURFACE_PATTERNS = (
    "skin",
    "hand",
    "arm",
    "shirt",
    "clothes",
    "clothing",
    "glove",
    "kulit",
    "tangan",
    "lengan",
    "baju",
    "ত্বক",
    "হাত",
    "জামা",
)


class QueryModeRouter:
    def route(self, worker_query: str) -> QueryModeDecision:
        normalized = _normalize(worker_query)
        if not normalized:
            return QueryModeDecision(
                mode="unclear",
                rewritten_query=worker_query.strip(),
                route_reason="empty_query",
            )

        if any(_contains_pattern(normalized, pattern) for pattern in EMERGENCY_PATTERNS):
            rewritten_query, reason, canonical_incident_type = self._canonicalize_emergency(worker_query, normalized)
            return QueryModeDecision(
                mode="emergency_incident",
                rewritten_query=rewritten_query,
                route_reason=reason,
                canonical_incident_type=canonical_incident_type,
            )

        if any(_contains_pattern(normalized, pattern) for pattern in PREVENTIVE_PATTERNS):
            return QueryModeDecision(
                mode="preventive_handling",
                rewritten_query=worker_query.strip(),
                route_reason="preventive_keyword_match",
            )

        return QueryModeDecision(
            mode="unclear",
            rewritten_query=worker_query.strip(),
            route_reason="no_safe_route_match",
        )

    def _canonicalize_emergency(self, worker_query: str, normalized: str) -> tuple[str, str, str | None]:
        if any(_contains_pattern(normalized, pattern) for pattern in AROUND_EYE_PATTERNS):
            return (
                f"{worker_query.strip()}\nSupported incident interpretation: treat this as eye exposure near or around the eye area.",
                "around_eye_variant_to_eye_exposure",
                "eye_exposure",
            )

        if any(_contains_pattern(normalized, pattern) for pattern in FACE_SURFACE_PATTERNS):
            return (
                f"{worker_query.strip()}\nSupported incident interpretation: treat this as skin exposure on the face or outer ear area.",
                "face_or_ear_variant_to_skin_exposure",
                "skin_exposure",
            )

        if any(_contains_pattern(normalized, pattern) for pattern in SKIN_SURFACE_PATTERNS):
            return (
                f"{worker_query.strip()}\nSupported incident interpretation: treat this as skin exposure.",
                "skin_surface_variant_to_skin_exposure",
                "skin_exposure",
            )

        return worker_query.strip(), "direct_emergency_match", None
