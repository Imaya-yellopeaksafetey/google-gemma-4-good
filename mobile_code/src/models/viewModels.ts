import type { SupportedLanguage } from "@/api/types";

export type ChemicalOptionViewModel = {
  chemicalId: string;
  qrValue: string;
  shortLabel: string;
  localizedName: string;
};

export type ResponseModeViewModel = {
  key: string;
  label: string;
  tone: "safe" | "warn" | "critical";
};

export type ResponseMetaViewModel = {
  detectedLanguage: SupportedLanguage;
  queryMode: "emergency_incident" | "preventive_handling" | "unclear";
  familyId: string | null;
  familyConfidence: string | null;
  routeReason: string | null;
};

export type OperatingModeViewModel = "online_full" | "offline_guarded" | "cloud_unavailable_limited";

export type RouteProvenanceViewModel = {
  routeKey: "cloud_controller" | "hybrid_local_then_cloud" | "local_guarded_offline" | "local_clarify" | "local_preventive_limited";
  operatingMode: OperatingModeViewModel;
  explanation: string;
  localModelUsed: boolean;
  cloudUsed: boolean;
  backendReachable: boolean;
  localModelAvailable: boolean;
};

export type RuntimeStateViewModel = {
  backendReachable: boolean;
  localCatalogSource: "backend" | "embedded_local";
  localModelAvailable: boolean;
  localModelInitialized: boolean;
  localModelError: string | null;
  operatingMode: OperatingModeViewModel;
};

export type EmergencyResponseViewModel = {
  kind: "emergency";
  requestId: string;
  chemicalId: string;
  incidentSummary: string;
  mode: ResponseModeViewModel;
  immediateActions: string[];
  doNotDo: string[];
  escalateInstruction: string;
  fallbackReason: string | null;
  evidenceLabel: string | null;
  meta: ResponseMetaViewModel;
  provenance: RouteProvenanceViewModel;
};

export type PreventiveResponseViewModel = {
  kind: "preventive";
  requestId: string;
  chemicalId: string;
  guidanceSummary: string;
  mode: ResponseModeViewModel;
  recommendedActions: string[];
  avoidActions: string[];
  followUpNote: string | null;
  evidenceLabel: string | null;
  meta: ResponseMetaViewModel;
  provenance: RouteProvenanceViewModel;
};

export type ClarifyResponseViewModel = {
  kind: "clarify";
  requestId: string;
  chemicalId: string;
  clarificationPrompt: string;
  mode: ResponseModeViewModel;
  suggestedOptions: string[];
  evidenceLabel: string | null;
  meta: ResponseMetaViewModel;
  provenance: RouteProvenanceViewModel;
};

export type AppResponseViewModel =
  | EmergencyResponseViewModel
  | PreventiveResponseViewModel
  | ClarifyResponseViewModel;
