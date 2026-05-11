import type { SupportedLanguage } from "@/api/types";

export type ChemicalOptionViewModel = {
  chemicalId: string;
  qrValue: string;
  shortLabel: string;
  localizedName: string;
};

export type EmergencyResponseViewModel = {
  requestId: string;
  chemicalId: string;
  incidentSummary: string;
  mode: {
    key: "full_guided_response" | "guarded_minimum_response" | "guarded_escalate_now";
    label: string;
    tone: "safe" | "warn" | "critical";
  };
  immediateActions: string[];
  doNotDo: string[];
  escalateInstruction: string;
  fallbackReason: string | null;
  evidenceLabel: string | null;
  meta: {
    detectedLanguage: SupportedLanguage;
    familyId: string;
    familyConfidence: string;
  };
};
