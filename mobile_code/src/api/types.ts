export type SupportedLanguage = "english" | "malay" | "bangla" | "bahasa_indonesia";

export type CatalogChemicalDto = {
  chemical_id: string;
  qr_value: string;
  short_label: string;
  names: Record<SupportedLanguage, string>;
};

export type CatalogResponseDto = {
  chemicals: CatalogChemicalDto[];
};

export type HealthResponseDto = {
  status: string;
  gateway: string;
  vllm: string;
  model?: string | null;
  controller_version?: string | null;
};

export type QRResolveRequestDto = {
  qr_value: string;
};

export type QRResolveResponseDto = {
  chemical_id: string;
  resolved: boolean;
};

export type RespondRequestDto = {
  chemical_id: string;
  worker_query: string;
  target_language: SupportedLanguage;
};

export type EmergencyInstructionDto = {
  instruction: string;
};

export type EmergencyEvidenceDto = {
  label: string;
  source_section_id?: string | null;
  source_span_id?: string | null;
};

export type EmergencyMetaDto = {
  detected_language: SupportedLanguage;
  query_mode: "emergency_incident" | "preventive_handling" | "unclear";
  family_id?: string | null;
  family_confidence?: "high" | "medium" | "low" | null;
  route_reason?: string | null;
};

export type EmergencyResponseDto = {
  response_kind: "emergency_guidance";
  request_id: string;
  chemical_id: string;
  response_mode: "full_guided_response" | "guarded_minimum_response" | "guarded_escalate_now";
  incident_summary: string;
  immediate_actions: EmergencyInstructionDto[];
  do_not_do: EmergencyInstructionDto[];
  escalate_now: EmergencyInstructionDto;
  fallback_reason: string | null;
  evidence_basis: EmergencyEvidenceDto[];
  meta: EmergencyMetaDto;
};

export type PreventiveResponseDto = {
  response_kind: "preventive_guidance";
  request_id: string;
  chemical_id: string;
  response_mode: "preventive_guidance";
  guidance_summary: string;
  recommended_actions: EmergencyInstructionDto[];
  avoid_actions: EmergencyInstructionDto[];
  follow_up_note: string | null;
  evidence_basis: EmergencyEvidenceDto[];
  meta: EmergencyMetaDto;
};

export type ClarifyResponseDto = {
  response_kind: "clarify_query";
  request_id: string;
  chemical_id: string;
  response_mode: "clarify_needed";
  clarification_prompt: string;
  suggested_options: string[];
  evidence_basis: EmergencyEvidenceDto[];
  meta: EmergencyMetaDto;
};

export type AppRespondResponseDto = EmergencyResponseDto | PreventiveResponseDto | ClarifyResponseDto;

export type ErrorResponseDto = {
  error: {
    code: string;
    message: string;
  };
};
