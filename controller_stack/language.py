from __future__ import annotations

import re

from .config import (
    EXACT_TRANSLATIONS,
    INCIDENT_LABELS,
    LANGUAGE_MARKERS,
    REASON_TEXT,
    SUPPRESSED_DETAIL_NOTE,
)


def normalize_text(text: str) -> str:
    return re.sub(r"\s+", " ", text.strip().lower())


def detect_language(text: str) -> str:
    if re.search(r"[\u0980-\u09ff]", text):
        return "bangla"

    lowered = normalize_text(text)
    malay_score = sum(marker in lowered for marker in LANGUAGE_MARKERS["malay"])
    indo_score = sum(marker in lowered for marker in LANGUAGE_MARKERS["bahasa_indonesia"])
    english_score = sum(marker in lowered for marker in LANGUAGE_MARKERS["english"])

    if malay_score > indo_score and malay_score >= 1:
        return "malay"
    if indo_score > malay_score and indo_score >= 1:
        return "bahasa_indonesia"
    if english_score >= 1:
        return "english"
    return "english"


def incident_summary(language: str, chemical_name: str, incident_type: str) -> str:
    if language == "english":
        return f"Likely {chemical_name} {INCIDENT_LABELS[language][incident_type]}."
    if language == "malay":
        return f"Kemungkinan {INCIDENT_LABELS[language][incident_type]} melibatkan {chemical_name}."
    if language == "bangla":
        return f"সম্ভবত {chemical_name} এর {INCIDENT_LABELS[language][incident_type]}।"
    return f"Kemungkinan {INCIDENT_LABELS[language][incident_type]} melibatkan {chemical_name}."


def translate_exact(text: str, language: str) -> str:
    return EXACT_TRANSLATIONS.get(text, {}).get(language, text)


def fallback_reason_text(reason: str, language: str) -> str:
    return REASON_TEXT[language][reason]


def suppressed_detail_note(language: str) -> str:
    return SUPPRESSED_DETAIL_NOTE[language]
