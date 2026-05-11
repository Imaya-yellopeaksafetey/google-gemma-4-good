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
  family_id: string;
  family_confidence: "high" | "medium" | "low";
};

export type EmergencyResponseDto = {
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

export type ErrorResponseDto = {
  error: {
    code: string;
    message: string;
  };
};
