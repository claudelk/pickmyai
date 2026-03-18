import type { CategoryConfig, EvaluationCriterion } from "./categories"

// ─── Tournament Types ───────────────────────────────────────────────

export type TournamentPhase =
  | "gate"
  | "category_select"
  | "round_prompt"
  | "round_results"
  | "round_vote"
  | "round_transition"
  | "tiebreaker"
  | "winner"

export type TournamentMode = "fast" | "deep"

export interface VoteState {
  /** platform id → cumulative votes */
  votes: Record<string, number>
  /** current 3 survivors (set after first elimination) */
  survivors: string[]
  /** categoryId → picked platform IDs per sub-round */
  categoryPicks: Record<string, string[][]>
  /** categoryId → platform that won most votes in that category */
  categoryWinners: Record<string, string>
}

export interface TiebreakerQuestion {
  id: string
  question: string
  optionA: { label: string; platforms: string[] }
  optionB: { label: string; platforms: string[] }
}

// Re-export for backward compatibility
export type { EvaluationCriterion } from "./categories"

// ─── Tiebreaker Questions ───────────────────────────────────────────

export const TIEBREAKER_QUESTIONS: TiebreakerQuestion[] = [
  {
    id: "speed",
    question: "Do you prefer speed or thoroughness?",
    optionA: { label: "Speed — give me a quick answer", platforms: ["mistral", "grok", "chatgpt"] },
    optionB: { label: "Thoroughness — take your time", platforms: ["claude", "gemini", "meta"] },
  },
  {
    id: "tone",
    question: "Do you prefer formal or casual tone?",
    optionA: { label: "Formal and polished", platforms: ["claude", "chatgpt"] },
    optionB: { label: "Casual and conversational", platforms: ["grok", "meta", "mistral", "gemini"] },
  },
  {
    id: "privacy",
    question: "Is data privacy especially important to you?",
    optionA: { label: "Yes — I prefer open-source or privacy-focused", platforms: ["mistral", "meta"] },
    optionB: { label: "Not a dealbreaker", platforms: [] },
  },
  {
    id: "ecosystem",
    question: "Which ecosystem do you use most?",
    optionA: { label: "Google (Docs, Gmail, Drive)", platforms: ["gemini"] },
    optionB: { label: "Microsoft or neither", platforms: ["chatgpt", "claude"] },
  },
]

// ─── Tiebreaker Resolver ────────────────────────────────────────────

export function resolveTiebreaker(
  votes: Record<string, number>,
  tiebreakerAnswers: Record<string, "a" | "b">
): string {
  const scores: Record<string, number> = { ...votes }

  for (const q of TIEBREAKER_QUESTIONS) {
    const answer = tiebreakerAnswers[q.id]
    if (!answer) continue

    const platforms = answer === "a" ? q.optionA.platforms : q.optionB.platforms
    for (const p of platforms) {
      scores[p] = (scores[p] ?? 0) + 0.5
    }
  }

  let best = ""
  let bestScore = -1
  for (const [platform, score] of Object.entries(scores)) {
    if (score > bestScore) {
      bestScore = score
      best = platform
    }
  }

  return best || "chatgpt"
}

// ─── Helpers ────────────────────────────────────────────────────────

export const ALL_PLATFORM_IDS = ["chatgpt", "claude", "gemini", "mistral", "grok", "meta"]

/**
 * Check if the current sub-round is an elimination round (6 AIs → pick 3).
 * - Fast mode: only the first category (index 0) is elimination
 * - Deep mode: sub-round 0 of every category is elimination
 */
export function isEliminationSubRound(
  mode: TournamentMode,
  currentCategoryIndex: number,
  currentSubRound: number
): boolean {
  if (mode === "fast") return currentCategoryIndex === 0
  return currentSubRound === 0
}

/**
 * Get the platforms that should compete in the current round.
 */
export function getPlatformsForRound(
  mode: TournamentMode,
  currentCategoryIndex: number,
  currentSubRound: number,
  survivors: string[]
): string[] {
  if (isEliminationSubRound(mode, currentCategoryIndex, currentSubRound)) {
    return [...ALL_PLATFORM_IDS]
  }
  return [...survivors]
}

/**
 * Check if this is the last vote of the tournament.
 */
export function isLastVote(
  mode: TournamentMode,
  currentCategoryIndex: number,
  currentSubRound: number,
  totalCategories: number
): boolean {
  const isLastCategory = currentCategoryIndex === totalCategories - 1
  if (mode === "fast") return isLastCategory
  return isLastCategory && currentSubRound === 2
}

/**
 * Get total number of voting rounds for winner detection thresholds.
 */
export function getTotalVotingRounds(mode: TournamentMode, totalCategories: number): number {
  if (mode === "fast") return totalCategories
  return totalCategories * 3
}

/**
 * Check if there's a clear winner or if a tiebreaker is needed.
 * - Fast track: needs > runner-up AND >= 2 votes
 * - Deep dive: needs > runner-up AND >= ceil(totalSubRounds / 2) votes
 */
export function checkForWinner(
  votes: Record<string, number>,
  mode: TournamentMode,
  totalCategories: number
): {
  winner: string | null
  needsTiebreaker: boolean
} {
  const entries = Object.entries(votes).sort((a, b) => b[1] - a[1])
  if (entries.length === 0) return { winner: null, needsTiebreaker: true }

  const [topPlatform, topScore] = entries[0]
  const secondScore = entries[1]?.[1] ?? 0

  const totalRounds = getTotalVotingRounds(mode, totalCategories)
  const minVotes = mode === "fast" ? 2 : Math.ceil(totalRounds / 2)

  if (topScore >= minVotes && topScore > secondScore) {
    return { winner: topPlatform, needsTiebreaker: false }
  }

  return { winner: null, needsTiebreaker: true }
}

// ─── Legacy compatibility ───────────────────────────────────────────
// Keep RoundConfig shape compatible for PromptInput
export interface RoundConfig {
  round: number
  category: string
  defaultPrompt: string
  hint: string
  criteria: EvaluationCriterion[]
}

/**
 * Convert a CategoryConfig + indices into a RoundConfig for PromptInput.
 */
export function categoryToRoundConfig(
  cat: CategoryConfig,
  categoryIndex: number,
): RoundConfig {
  return {
    round: categoryIndex + 1,
    category: cat.name,
    defaultPrompt: cat.defaultPrompt,
    hint: cat.hint,
    criteria: cat.criteria,
  }
}
