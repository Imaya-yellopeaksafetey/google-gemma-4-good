import type { CatalogChemicalDto, EmergencyResponseDto, SupportedLanguage } from "@/api/types";
import type { ChemicalOptionViewModel, EmergencyResponseViewModel } from "@/models/viewModels";

export function mapChemicalOption(chemical: CatalogChemicalDto, language: SupportedLanguage): ChemicalOptionViewModel {
  return {
    chemicalId: chemical.chemical_id,
    qrValue: chemical.qr_value,
    shortLabel: chemical.short_label,
    localizedName: chemical.names[language] ?? chemical.names.english
  };
}

export function mapEmergencyResponse(response: EmergencyResponseDto): EmergencyResponseViewModel {
  const modeMap: Record<EmergencyResponseDto["response_mode"], EmergencyResponseViewModel["mode"]> = {
    full_guided_response: {
      key: "full_guided_response",
      label: "Full guided response",
      tone: "safe"
    },
    guarded_minimum_response: {
      key: "guarded_minimum_response",
      label: "Guarded minimum response",
      tone: "warn"
    },
    guarded_escalate_now: {
      key: "guarded_escalate_now",
      label: "Guarded escalate-now response",
      tone: "critical"
    }
  };

  return {
    requestId: response.request_id,
    chemicalId: response.chemical_id,
    incidentSummary: response.incident_summary,
    mode: modeMap[response.response_mode],
    immediateActions: response.immediate_actions.map((item) => item.instruction),
    doNotDo: response.do_not_do.map((item) => item.instruction),
    escalateInstruction: response.escalate_now.instruction,
    fallbackReason: response.fallback_reason,
    evidenceLabel: response.evidence_basis[0]?.label ?? null,
    meta: {
      detectedLanguage: response.meta.detected_language,
      familyId: response.meta.family_id,
      familyConfidence: response.meta.family_confidence
    }
  };
}
