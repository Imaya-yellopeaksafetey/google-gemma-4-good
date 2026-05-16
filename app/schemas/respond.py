from __future__ import annotations

from typing import Annotated, Literal

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
    query_mode: Literal["emergency_incident", "preventive_handling", "unclear"]
    family_id: str | None = None
    family_confidence: str | None = None
    route_reason: str | None = None


class AppEmergencyResponse(BaseModel):
    response_kind: Literal["emergency_guidance"]
    request_id: str
    chemical_id: str
    response_mode: Literal["full_guided_response", "guarded_minimum_response", "guarded_escalate_now"]
    incident_summary: str
    immediate_actions: list[AppInstruction]
    do_not_do: list[AppInstruction]
    escalate_now: AppInstruction
    fallback_reason: str | None
    evidence_basis: list[AppEvidenceBasis]
    meta: AppMeta


class AppPreventiveResponse(BaseModel):
    response_kind: Literal["preventive_guidance"]
    request_id: str
    chemical_id: str
    response_mode: Literal["preventive_guidance"]
    guidance_summary: str
    recommended_actions: list[AppInstruction]
    avoid_actions: list[AppInstruction]
    follow_up_note: str | None
    evidence_basis: list[AppEvidenceBasis]
    meta: AppMeta


class AppClarifyResponse(BaseModel):
    response_kind: Literal["clarify_query"]
    request_id: str
    chemical_id: str
    response_mode: Literal["clarify_needed"]
    clarification_prompt: str
    suggested_options: list[str]
    evidence_basis: list[AppEvidenceBasis]
    meta: AppMeta


AppRespondResponse = Annotated[
    AppEmergencyResponse | AppPreventiveResponse | AppClarifyResponse,
    Field(discriminator="response_kind"),
]
