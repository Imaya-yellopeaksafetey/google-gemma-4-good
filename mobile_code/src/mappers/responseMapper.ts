import type { AppRespondResponseDto, CatalogChemicalDto, SupportedLanguage } from "@/api/types";
import type { AppResponseViewModel, ChemicalOptionViewModel, ResponseMetaViewModel, RouteProvenanceViewModel } from "@/models/viewModels";
import { getStrings } from "@/i18n/strings";

export function mapChemicalOption(chemical: CatalogChemicalDto, language: SupportedLanguage): ChemicalOptionViewModel {
  return {
    chemicalId: chemical.chemical_id,
    qrValue: chemical.qr_value,
    shortLabel: chemical.short_label,
    localizedName: chemical.names[language] ?? chemical.names.english
  };
}

function mapMeta(response: AppRespondResponseDto): ResponseMetaViewModel {
  return {
    detectedLanguage: response.meta.detected_language,
    queryMode: response.meta.query_mode,
    familyId: response.meta.family_id ?? null,
    familyConfidence: response.meta.family_confidence ?? null,
    routeReason: response.meta.route_reason ?? null
  };
}

export function mapAppResponse(
  response: AppRespondResponseDto,
  language: SupportedLanguage,
  provenance: RouteProvenanceViewModel
): AppResponseViewModel {
  const strings = getStrings(language);

  if (response.response_kind === "preventive_guidance") {
    return {
      kind: "preventive",
      requestId: response.request_id,
      chemicalId: response.chemical_id,
      guidanceSummary: response.guidance_summary,
      mode: {
        key: "preventive_guidance",
        label: strings.responseModeLabels.preventive_guidance,
        tone: "safe"
      },
      recommendedActions: response.recommended_actions.map((item) => item.instruction),
      avoidActions: response.avoid_actions.map((item) => item.instruction),
      followUpNote: response.follow_up_note,
      evidenceLabel: response.evidence_basis[0]?.label ?? null,
      meta: mapMeta(response),
      provenance,
      upgrade: null
    };
  }

  if (response.response_kind === "clarify_query") {
    return {
      kind: "clarify",
      requestId: response.request_id,
      chemicalId: response.chemical_id,
      clarificationPrompt: response.clarification_prompt,
      mode: {
        key: "clarify_needed",
        label: strings.responseModeLabels.clarify_needed,
        tone: "warn"
      },
      suggestedOptions: response.suggested_options,
      evidenceLabel: response.evidence_basis[0]?.label ?? null,
      meta: mapMeta(response),
      provenance,
      upgrade: null
    };
  }

  const modeMap = {
    full_guided_response: {
      key: "full_guided_response",
      label: strings.responseModeLabels.full_guided_response,
      tone: "safe"
    },
    guarded_minimum_response: {
      key: "guarded_minimum_response",
      label: strings.responseModeLabels.guarded_minimum_response,
      tone: "warn"
    },
    guarded_escalate_now: {
      key: "guarded_escalate_now",
      label: strings.responseModeLabels.guarded_escalate_now,
      tone: "critical"
    }
  } as const;

  return {
    kind: "emergency",
    requestId: response.request_id,
    chemicalId: response.chemical_id,
    incidentSummary: response.incident_summary,
    mode: modeMap[response.response_mode],
    immediateActions: response.immediate_actions.map((item) => item.instruction),
    doNotDo: response.do_not_do.map((item) => item.instruction),
    escalateInstruction: response.escalate_now.instruction,
    fallbackReason: response.fallback_reason,
    evidenceLabel: response.evidence_basis[0]?.label ?? null,
    meta: mapMeta(response),
    provenance,
    upgrade: null
  };
}
