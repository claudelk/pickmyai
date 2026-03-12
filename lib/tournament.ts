// ─── Tournament Types ───────────────────────────────────────────────

export type TournamentStage =
  | "gate"
  | "onboarding"
  | "round1_prompt"
  | "round1_results"
  | "round1_vote"
  | "round2_prompt"
  | "round2_results"
  | "round2_vote"
  | "round3_prompt"
  | "round3_results"
  | "round3_vote"
  | "tiebreaker"
  | "winner"

export type RoundNumber = 1 | 2 | 3

export interface RoundConfig {
  round: RoundNumber
  category: string
  defaultPrompt: string
  hint: string
  criteria: EvaluationCriterion[]
}

export interface EvaluationCriterion {
  label: string
  description: string
}

export interface VoteState {
  /** platform id → total vote points */
  votes: Record<string, number>
  /** platforms that survived each round */
  survivors: string[]
  /** ordered picks from round 1 (index 0 = #1 pick) */
  round1Picks: string[]
  /** single pick from round 2 */
  round2Pick: string | null
  /** single pick from round 3 */
  round3Pick: string | null
}

export interface TiebreakerQuestion {
  id: string
  question: string
  optionA: { label: string; platforms: string[] }
  optionB: { label: string; platforms: string[] }
}

// ─── Round Configs ──────────────────────────────────────────────────

export const ROUND_CONFIGS: RoundConfig[] = [
  {
    round: 1,
    category: "Rewriting & Editing",
    defaultPrompt:
      "Rewrite this paragraph to sound more professional while keeping the same meaning: 'Hey team, just wanted to flag that the project is kinda behind schedule. We probably need to figure out what went wrong and get things back on track ASAP. Let me know what you think.'",
    hint: "This prompt is designed to test rewriting and editing skills. Feel free to use it or write your own.",
    criteria: [
      { label: "Tone", description: "Does it sound professional without being robotic?" },
      { label: "Clarity", description: "Is the message easy to understand?" },
      { label: "Structure", description: "Is it well-organized and logical?" },
      { label: "Conciseness", description: "Does it say more with fewer words?" },
    ],
  },
  {
    round: 2,
    category: "Analysis & Reasoning",
    defaultPrompt:
      "A small startup (8 people) is debating whether to stay fully remote or move to a hybrid office model. The CEO wants in-person collaboration, but 3 key engineers prefer remote. Lay out the strongest arguments for each side and suggest a compromise.",
    hint: "This prompt is designed to test analysis and reasoning. Feel free to use it or write your own.",
    criteria: [
      { label: "Depth", description: "Does it go beyond surface-level arguments?" },
      { label: "Logical flow", description: "Are the arguments well-structured?" },
      { label: "Completeness", description: "Does it cover both sides fairly?" },
      { label: "Nuance", description: "Does it acknowledge trade-offs and gray areas?" },
    ],
  },
  {
    round: 3,
    category: "Creative Writing",
    defaultPrompt:
      "Write the opening paragraph of a short story about someone who discovers that every book in their local library has had its last page removed.",
    hint: "This prompt is designed to test creative writing. Feel free to use it or write your own.",
    criteria: [
      { label: "Creativity", description: "Is the approach original and surprising?" },
      { label: "Voice", description: "Does it have a distinct style or personality?" },
      { label: "Engagement", description: "Does it make you want to keep reading?" },
      { label: "Originality", description: "Does it avoid clichés and predictable setups?" },
    ],
  },
]

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
  // Start with vote scores
  const scores: Record<string, number> = { ...votes }

  for (const q of TIEBREAKER_QUESTIONS) {
    const answer = tiebreakerAnswers[q.id]
    if (!answer) continue

    const platforms = answer === "a" ? q.optionA.platforms : q.optionB.platforms
    for (const p of platforms) {
      scores[p] = (scores[p] ?? 0) + 0.5
    }
  }

  // Return platform with highest combined score
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

export function getRoundConfig(round: RoundNumber): RoundConfig {
  return ROUND_CONFIGS[round - 1]
}

/**
 * Check if there's a clear winner (2+ votes) among survivors,
 * or if a tiebreaker is needed.
 */
export function checkForWinner(votes: Record<string, number>): {
  winner: string | null
  needsTiebreaker: boolean
} {
  const entries = Object.entries(votes).sort((a, b) => b[1] - a[1])
  if (entries.length === 0) return { winner: null, needsTiebreaker: true }

  const [topPlatform, topScore] = entries[0]
  const secondScore = entries[1]?.[1] ?? 0

  if (topScore >= 2 && topScore > secondScore) {
    return { winner: topPlatform, needsTiebreaker: false }
  }

  return { winner: null, needsTiebreaker: true }
}
