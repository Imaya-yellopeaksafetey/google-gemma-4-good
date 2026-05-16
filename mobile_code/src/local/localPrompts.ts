import type { SupportedLanguage } from "@/api/types";

function languageLabel(language: SupportedLanguage): string {
  switch (language) {
    case "malay":
      return "Malay";
    case "bangla":
      return "Bangla";
    case "bahasa_indonesia":
      return "Bahasa Indonesia";
    default:
      return "English";
  }
}

export function routePrompt(): string {
  return 'Classify the worker query as one of: emergency_incident, preventive_handling, unclear. Reply with JSON only: {"mode":"...","reason":"..."}.';
}

export function canonicalizationPrompt(): string {
  return 'Map the worker report to the safest supported canonical exposure bucket. Allowed buckets: eye_exposure, skin_exposure, inhalation_exposure, ingestion_exposure, unclear. Reply with JSON only: {"bucket":"...","reason":"...","normalized_query":"..."}.'; 
}

export function clarificationPrompt(language: SupportedLanguage): string {
  return `The query is ambiguous. Ask one short clarification question in ${languageLabel(language)}. Keep it under 18 words.`;
}

export function guardedPrompt(language: SupportedLanguage): string {
  return `You are an offline guarded plantation chemical first-aid assistant. Write in ${languageLabel(language)}. Give a short limited response with exactly three sections labeled Immediate:, Avoid:, Escalate:. Do not claim full SDS grounding. Keep it under 70 words.`;
}
