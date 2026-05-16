import type { SupportedLanguage } from "@/api/types";
import { completeLocally, type LocalCompletion } from "@/local/cactusNative";

export type LocalQueryMode = "emergency_incident" | "preventive_handling" | "unclear";
export type CanonicalBucket = "eye_exposure" | "skin_exposure" | "inhalation_exposure" | "ingestion_exposure" | "unclear";

export type LocalRouteResult = {
  mode: LocalQueryMode;
  reason: string;
  confidence: "high" | "medium" | "low";
  rawConfidence: number;
  metrics: LocalCompletion;
};

export type LocalCanonicalizationResult = {
  bucket: CanonicalBucket;
  reason: string;
  normalizedQuery: string;
  confidence: "high" | "medium" | "low";
  rawConfidence: number;
  metrics: LocalCompletion;
};

export type LocalClarifyResult = {
  prompt: string;
  confidence: "high" | "medium" | "low";
  rawConfidence: number;
  metrics: LocalCompletion;
};

export type LocalGuardedSections = {
  kind: "guarded" | "clarify";
  clarificationPrompt: string | null;
  incidentSummary: string;
  immediate: string[];
  avoid: string[];
  escalate: string;
  reason: string;
  rawText: string;
  confidence: "high" | "medium" | "low";
  rawConfidence: number;
  metrics: LocalCompletion;
};

function sanitizeModelText(text: string): string {
  return text.replace(/^```json\s*/i, "").replace(/^```\s*/i, "").replace(/\s*```$/i, "").trim();
}

function parseJsonObject<T>(text: string): T | null {
  const cleaned = sanitizeModelText(text);
  try {
    return JSON.parse(cleaned) as T;
  } catch {
    return null;
  }
}

function mapConfidence(score: number): "high" | "medium" | "low" {
  if (score >= 0.97) {
    return "high";
  }

  if (score >= 0.92) {
    return "medium";
  }

  return "low";
}

function parseSections(text: string): { immediate: string[]; avoid: string[]; escalate: string } {
  const cleaned = sanitizeModelText(text);
  const lines = cleaned.split(/\n+/).map((line) => line.trim()).filter(Boolean);
  const sections = {
    immediate: [] as string[],
    avoid: [] as string[],
    escalate: ""
  };

  for (const line of lines) {
    if (line.toLowerCase().startsWith("immediate:")) {
      sections.immediate.push(line.slice("Immediate:".length).trim());
      continue;
    }

    if (line.toLowerCase().startsWith("avoid:")) {
      sections.avoid.push(line.slice("Avoid:".length).trim());
      continue;
    }

    if (line.toLowerCase().startsWith("escalate:")) {
      sections.escalate = line.slice("Escalate:".length).trim();
      continue;
    }

    if (!sections.escalate && sections.avoid.length) {
      sections.avoid[sections.avoid.length - 1] = `${sections.avoid[sections.avoid.length - 1]} ${line}`.trim();
      continue;
    }

    if (!sections.avoid.length && sections.immediate.length) {
      sections.immediate[sections.immediate.length - 1] = `${sections.immediate[sections.immediate.length - 1]} ${line}`.trim();
    }
  }

  return sections;
}

function parseGuardedEnvelope(text: string): {
  kind: "guarded" | "clarify";
  clarification_prompt: string;
  incident_summary: string;
  immediate: string[];
  avoid: string[];
  escalate: string;
  reason: string;
} | null {
  const parsed = parseJsonObject<{
    kind?: "guarded" | "clarify";
    clarification_prompt?: string;
    incident_summary?: string;
    immediate?: string[];
    avoid?: string[];
    escalate?: string;
    reason?: string;
  }>(text);

  if (!parsed) {
    return null;
  }

  return {
    kind: parsed.kind === "clarify" ? "clarify" : "guarded",
    clarification_prompt: parsed.clarification_prompt?.trim() || "",
    incident_summary: parsed.incident_summary?.trim() || "",
    immediate: Array.isArray(parsed.immediate) ? parsed.immediate.map((item) => `${item}`.trim()).filter(Boolean) : [],
    avoid: Array.isArray(parsed.avoid) ? parsed.avoid.map((item) => `${item}`.trim()).filter(Boolean) : [],
    escalate: parsed.escalate?.trim() || "",
    reason: parsed.reason?.trim() || ""
  };
}

export async function routeQuery(query: string): Promise<LocalRouteResult> {
  const metrics = await completeLocally(
    [
      {
        role: "system",
        content: 'Classify the worker query as one of: emergency_incident, preventive_handling, unclear. Reply with JSON only: {"mode":"...","reason":"..."}.' 
      },
      { role: "user", content: query }
    ],
    50
  );

  const parsed = parseJsonObject<{ mode?: LocalQueryMode; reason?: string }>(metrics.response);

  return {
    mode: parsed?.mode ?? "unclear",
    reason: parsed?.reason ?? "local_classifier_fallback",
    confidence: mapConfidence(metrics.confidence ?? 0),
    rawConfidence: metrics.confidence ?? 0,
    metrics
  };
}

export async function canonicalizeIncident(query: string): Promise<LocalCanonicalizationResult> {
  const metrics = await completeLocally(
    [
      {
        role: "system",
        content: 'Map the worker report to the safest supported canonical exposure bucket. Allowed buckets: eye_exposure, skin_exposure, inhalation_exposure, ingestion_exposure, unclear. Reply with JSON only: {"bucket":"...","reason":"...","normalized_query":"..."}.' 
      },
      { role: "user", content: query }
    ],
    80
  );

  const parsed = parseJsonObject<{ bucket?: CanonicalBucket; reason?: string; normalized_query?: string }>(metrics.response);

  return {
    bucket: parsed?.bucket ?? "unclear",
    reason: parsed?.reason ?? "local_canonicalization_fallback",
    normalizedQuery: parsed?.normalized_query ?? query,
    confidence: mapConfidence(metrics.confidence ?? 0),
    rawConfidence: metrics.confidence ?? 0,
    metrics
  };
}

export async function clarifyQuery(query: string, language: SupportedLanguage): Promise<LocalClarifyResult> {
  const prompt = language === "english"
    ? "The query is ambiguous. Ask one short clarification question only. Keep it under 18 words."
    : `The query is ambiguous. Ask one short clarification question in ${
      language === "malay" ? "Malay" : language === "bangla" ? "Bangla" : "Bahasa Indonesia"
    }. Keep it under 18 words.`;

  const metrics = await completeLocally(
    [
      { role: "system", content: prompt },
      { role: "user", content: query }
    ],
    40
  );

  return {
    prompt: sanitizeModelText(metrics.response),
    confidence: mapConfidence(metrics.confidence ?? 0),
    rawConfidence: metrics.confidence ?? 0,
    metrics
  };
}

export async function buildOfflineGuardedResponse(query: string, language: SupportedLanguage): Promise<LocalGuardedSections> {
  const prompt = language === "english"
    ? 'You are an offline guarded plantation chemical first-aid assistant. The worker is already on an incident screen, so assume this is an emergency incident unless the report is too ambiguous to act on safely. Perform body-location canonicalization internally. For near-eye or face phrasing, use the safest supported exposure wording. Reply with JSON only. If you can answer, use: {"kind":"guarded","reason":"...","incident_summary":"...","immediate":["..."],"avoid":["..."],"escalate":"..."}. If the report is too ambiguous to act on safely, use: {"kind":"clarify","reason":"...","clarification_prompt":"..."}. Keep the answer short and limited. Do not claim full SDS grounding.'
    : `You are an offline guarded plantation chemical first-aid assistant. Write in ${
      language === "malay" ? "Malay" : language === "bangla" ? "Bangla" : "Bahasa Indonesia"
    }. The worker is already on an incident screen, so assume this is an emergency incident unless the report is too ambiguous to act on safely. Perform body-location canonicalization internally. For near-eye or face phrasing, use the safest supported exposure wording. Reply with JSON only. If you can answer, use: {"kind":"guarded","reason":"...","incident_summary":"...","immediate":["..."],"avoid":["..."],"escalate":"..."}. If the report is too ambiguous to act on safely, use: {"kind":"clarify","reason":"...","clarification_prompt":"..."}. Keep the answer short and limited. Do not claim full SDS grounding.`;

  const metrics = await completeLocally(
    [
      { role: "system", content: prompt },
      { role: "user", content: query }
    ],
    90
  );

  const structured = parseGuardedEnvelope(metrics.response);
  const sections = parseSections(metrics.response);

  return {
    kind: structured?.kind ?? "guarded",
    clarificationPrompt: structured?.clarification_prompt || null,
    incidentSummary: structured?.incident_summary || query,
    immediate: structured?.immediate?.length ? structured.immediate : sections.immediate,
    avoid: structured?.avoid?.length ? structured.avoid : sections.avoid,
    escalate: structured?.escalate || sections.escalate,
    reason: structured?.reason || "offline_guarded_single_call",
    rawText: sanitizeModelText(metrics.response),
    confidence: mapConfidence(metrics.confidence ?? 0),
    rawConfidence: metrics.confidence ?? 0,
    metrics
  };
}
