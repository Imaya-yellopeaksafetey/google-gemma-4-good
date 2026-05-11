from __future__ import annotations

from pydantic import BaseModel, Field


class AppRespondRequest(BaseModel):
    chemical_id: str = Field(..., min_length=1)
    worker_query: str = Field(..., min_length=1)
    target_language: str = Field(..., pattern="^(english|malay|bangla|bahasa_indonesia)$")


class AppInstruction(BaseModel):
    instruction: str


class AppEvidenceBasis(BaseModel):
    label: str
    source_section_id: str | None = None
    source_span_id: str | None = None


class AppMeta(BaseModel):
    detected_language: str
    family_id: str
    family_confidence: str


class AppEmergencyResponse(BaseModel):
    request_id: str
    chemical_id: str
    response_mode: str
    incident_summary: str
    immediate_actions: list[AppInstruction]
    do_not_do: list[AppInstruction]
    escalate_now: AppInstruction
    fallback_reason: str | None
    evidence_basis: list[AppEvidenceBasis]
    meta: AppMeta
