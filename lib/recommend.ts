import type { UseCaseTag } from "./constants"

const USE_CASE_TO_PLATFORM: Record<string, string> = {
  writing: "claude",
  research: "chatgpt",
  creative: "gemini",
  coding: "meta",
  business: "claude",
  default: "chatgpt",
}

export function getRecommendedPlatform(useCaseTag?: UseCaseTag | string): string {
  if (!useCaseTag) return USE_CASE_TO_PLATFORM.default
  return USE_CASE_TO_PLATFORM[useCaseTag] ?? USE_CASE_TO_PLATFORM.default
}

export function mapQ2ToUseCaseTag(answer: string): UseCaseTag {
  const mapping: Record<string, UseCaseTag> = {
    "Writing and emails": "writing",
    "Research and learning": "research",
    "Creative work": "creative",
    "Coding or technical tasks": "coding",
    "Managing a business or team": "business",
  }
  return mapping[answer] ?? "research"
}
