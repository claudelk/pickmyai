"use client"

import { useState, useCallback, useRef } from "react"
import type { AICardResult } from "@/components/home/AICard"
import type { CategoryConfig } from "./categories"
import {
  ALL_PLATFORM_IDS,
  checkForWinner,
  resolveTiebreaker,
  isEliminationSubRound,
  getPlatformsForRound,
  isLastVote,
  categoryToRoundConfig,
} from "./tournament"
import type { TournamentPhase, TournamentMode, VoteState } from "./tournament"

export interface TournamentState {
  phase: TournamentPhase
  mode: TournamentMode
  selectedCategories: CategoryConfig[]

  // Tracking position
  currentCategoryIndex: number
  currentSubRound: number // 0, 1, or 2 within a category (deep mode only; always 0 in fast)

  // Votes
  voteState: VoteState

  results: Record<string, AICardResult>
  /** Cached results per category (for deep mode reuse) */
  categoryResults: Record<string, Record<string, AICardResult>>
  isLoading: boolean
  rateLimited: boolean
  suggestedPrompt: string
  winner: string | null
  tiebreakerAnswers: Record<string, "a" | "b">
  roundPrompts: Record<string, string> // categoryId → prompt used
}

const INITIAL_STATE: TournamentState = {
  phase: "gate",
  mode: "fast",
  selectedCategories: [],
  currentCategoryIndex: 0,
  currentSubRound: 0,
  voteState: {
    votes: {},
    survivors: [...ALL_PLATFORM_IDS],
    categoryPicks: {},
    categoryWinners: {},
  },
  results: {},
  categoryResults: {},
  isLoading: false,
  rateLimited: false,
  suggestedPrompt: "",
  winner: null,
  tiebreakerAnswers: {},
  roundPrompts: {},
}

export function useTournament(initialPrompt = "") {
  const stateRef = useRef<TournamentState>(null!)
  const [state, setState] = useState<TournamentState>({
    ...INITIAL_STATE,
    phase: initialPrompt ? "category_select" : "gate",
    suggestedPrompt: initialPrompt,
  })
  stateRef.current = state

  // ─── Gate ────────────────────────────────────────────────────────

  const handlePathSelect = useCallback((path: "a" | "b") => {
    setState((prev) => ({
      ...prev,
      mode: path === "a" ? "fast" : "deep",
      phase: "category_select",
    }))
  }, [])

  // ─── Category Selection ────────────────────────────────────────

  const handleCategorySelect = useCallback((categories: CategoryConfig[]) => {
    setState((prev) => ({
      ...prev,
      selectedCategories: categories,
      currentCategoryIndex: 0,
      currentSubRound: 0,
      phase: "round_prompt",
    }))
  }, [])

  // ─── Prompt Submission & API ─────────────────────────────────────

  const handleCompare = useCallback(async (prompt: string) => {
    const current = stateRef.current
    const { mode, currentCategoryIndex, currentSubRound, selectedCategories } = current
    const catId = selectedCategories[currentCategoryIndex]?.id ?? ""

    // In deep mode sub-rounds 1-2, reuse cached results (no new API call)
    if (mode === "deep" && currentSubRound > 0 && current.categoryResults[catId]) {
      const cachedResults = current.categoryResults[catId]
      // Filter to only show survivors
      const survivorResults: Record<string, AICardResult> = {}
      for (const s of current.voteState.survivors) {
        if (cachedResults[s]) survivorResults[s] = cachedResults[s]
      }
      setState((prev) => ({
        ...prev,
        results: survivorResults,
        isLoading: false,
        phase: "round_vote",
        roundPrompts: { ...prev.roundPrompts, [catId]: prompt },
      }))
      return
    }

    const isElimination = isEliminationSubRound(mode, currentCategoryIndex, currentSubRound)
    const platforms = isElimination ? ALL_PLATFORM_IDS : current.voteState.survivors

    // Set loading
    const loadingResults: Record<string, AICardResult> = {}
    for (const p of platforms) {
      loadingResults[p] = {
        platform: p,
        status: "loading",
        response: "",
        latencyMs: 0,
        model: "",
        tokensUsed: 0,
      }
    }

    setState((prev) => ({
      ...prev,
      isLoading: true,
      rateLimited: false,
      results: loadingResults,
      phase: "round_results",
      roundPrompts: { ...prev.roundPrompts, [catId]: prompt },
    }))

    try {
      const response = await fetch("/api/compare", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt,
          platforms,
          platformCount: platforms.length,
        }),
      })

      if (response.status === 429) {
        setState((prev) => ({
          ...prev,
          rateLimited: true,
          results: {},
          isLoading: false,
        }))
        return
      }

      const reader = response.body?.getReader()
      const decoder = new TextDecoder()

      if (reader) {
        let buffer = ""
        let receivedCount = 0

        while (true) {
          const { done, value } = await reader.read()
          if (done) break

          buffer += decoder.decode(value, { stream: true })
          const lines = buffer.split("\n\n")
          buffer = lines.pop() ?? ""

          for (const line of lines) {
            const data = line.replace(/^data: /, "").trim()
            if (!data || data === "[DONE]") continue

            try {
              const result: AICardResult = JSON.parse(data)
              receivedCount++
              setState((prev) => ({
                ...prev,
                results: { ...prev.results, [result.platform]: result },
              }))
            } catch {
              // Skip malformed events
            }
          }
        }

        if (receivedCount === 0) {
          throw new Error("No results received")
        }
      }
    } catch {
      setState((prev) => {
        const errorResults: Record<string, AICardResult> = {}
        const ps = isElimination ? ALL_PLATFORM_IDS : prev.voteState.survivors
        for (const p of ps) {
          errorResults[p] = {
            platform: p,
            status: "error",
            response: "",
            latencyMs: 0,
            model: "",
            tokensUsed: 0,
            errorMessage: "Network error",
          }
        }
        return { ...prev, results: errorResults }
      })
    }

    // Cache results for deep mode reuse and transition to vote
    setState((prev) => ({
      ...prev,
      isLoading: false,
      phase: "round_vote",
      categoryResults: { ...prev.categoryResults, [catId]: prev.results },
    }))
  }, [])

  // ─── Voting ──────────────────────────────────────────────────────

  /**
   * Elimination vote: user picks top 3 in order. #1 gets a vote. All 3 advance.
   */
  const handleEliminationVote = useCallback((picks: string[]) => {
    setState((prev) => {
      const { mode, currentCategoryIndex, selectedCategories } = prev
      const catId = selectedCategories[currentCategoryIndex]?.id ?? ""
      const newVotes = { ...prev.voteState.votes }
      // #1 pick gets 1 vote
      newVotes[picks[0]] = (newVotes[picks[0]] ?? 0) + 1

      const newCategoryPicks = { ...prev.voteState.categoryPicks }
      newCategoryPicks[catId] = [...(newCategoryPicks[catId] ?? []), picks]

      const newVoteState: VoteState = {
        ...prev.voteState,
        votes: newVotes,
        survivors: picks,
        categoryPicks: newCategoryPicks,
      }

      // Determine next phase
      if (mode === "fast") {
        // Fast mode: after elimination (cat 0), move to cat 1 prompt
        if (currentCategoryIndex < selectedCategories.length - 1) {
          return {
            ...prev,
            voteState: newVoteState,
            currentCategoryIndex: currentCategoryIndex + 1,
            currentSubRound: 0,
            phase: "round_transition" as TournamentPhase,
          }
        }
        // Only one category? Check winner
        const { winner, needsTiebreaker } = checkForWinner(newVotes, mode, selectedCategories.length)
        return {
          ...prev,
          voteState: newVoteState,
          phase: needsTiebreaker ? "tiebreaker" : "winner",
          winner,
        }
      }

      // Deep mode: after elimination (sub-round 0), show same results for sub-round 1
      return {
        ...prev,
        voteState: newVoteState,
        currentSubRound: 1,
        phase: "round_prompt" as TournamentPhase,
      }
    })
  }, [])

  /**
   * Single-pick vote: user picks 1 favorite, gets 1 vote.
   * Used in fast mode (cats 2-N) and deep mode (sub-rounds 1-2).
   */
  const handleSingleVote = useCallback((pick: string) => {
    setState((prev) => {
      const { mode, currentCategoryIndex, currentSubRound, selectedCategories } = prev
      const catId = selectedCategories[currentCategoryIndex]?.id ?? ""
      const newVotes = { ...prev.voteState.votes }
      newVotes[pick] = (newVotes[pick] ?? 0) + 1

      const newCategoryPicks = { ...prev.voteState.categoryPicks }
      newCategoryPicks[catId] = [...(newCategoryPicks[catId] ?? []), [pick]]

      // Track category winner (platform with most picks in this category)
      const newCategoryWinners = { ...prev.voteState.categoryWinners }

      const newVoteState: VoteState = {
        ...prev.voteState,
        votes: newVotes,
        categoryPicks: newCategoryPicks,
        categoryWinners: newCategoryWinners,
      }

      const lastVote = isLastVote(mode, currentCategoryIndex, currentSubRound, selectedCategories.length)

      if (lastVote) {
        // Compute category winner for last category
        newCategoryWinners[catId] = computeCategoryWinner(newCategoryPicks[catId] ?? [], newVotes, prev.voteState.survivors)
        newVoteState.categoryWinners = newCategoryWinners

        const { winner, needsTiebreaker } = checkForWinner(newVotes, mode, selectedCategories.length)
        return {
          ...prev,
          voteState: newVoteState,
          phase: needsTiebreaker ? "tiebreaker" : "winner",
          winner,
        }
      }

      if (mode === "fast") {
        // Fast mode: move to next category
        // Compute category winner for current category
        newCategoryWinners[catId] = pick
        newVoteState.categoryWinners = newCategoryWinners

        return {
          ...prev,
          voteState: newVoteState,
          currentCategoryIndex: currentCategoryIndex + 1,
          currentSubRound: 0,
          phase: "round_transition" as TournamentPhase,
        }
      }

      // Deep mode: advance sub-round within category
      if (currentSubRound < 2) {
        return {
          ...prev,
          voteState: newVoteState,
          currentSubRound: currentSubRound + 1,
          phase: "round_prompt" as TournamentPhase,
        }
      }

      // Deep mode: last sub-round of this category, move to next category
      newCategoryWinners[catId] = computeCategoryWinner(newCategoryPicks[catId] ?? [], newVotes, prev.voteState.survivors)
      newVoteState.categoryWinners = newCategoryWinners

      return {
        ...prev,
        voteState: newVoteState,
        currentCategoryIndex: currentCategoryIndex + 1,
        currentSubRound: 0,
        phase: "round_transition" as TournamentPhase,
      }
    })
  }, [])

  // ─── Transition ─────────────────────────────────────────────────

  const handleTransitionComplete = useCallback(() => {
    setState((prev) => ({ ...prev, phase: "round_prompt" }))
  }, [])

  // ─── Tiebreaker ─────────────────────────────────────────────────

  const handleTiebreakerAnswer = useCallback((questionId: string, answer: "a" | "b") => {
    setState((prev) => ({
      ...prev,
      tiebreakerAnswers: { ...prev.tiebreakerAnswers, [questionId]: answer },
    }))
  }, [])

  const handleTiebreakerComplete = useCallback(() => {
    setState((prev) => {
      const winner = resolveTiebreaker(prev.voteState.votes, prev.tiebreakerAnswers)
      return { ...prev, winner, phase: "winner" }
    })
  }, [])

  // ─── Navigation Helpers ─────────────────────────────────────────

  const handleBackToGate = useCallback(() => {
    setState((prev) => ({ ...prev, phase: "gate" }))
  }, [])

  const handleRestart = useCallback(() => {
    setState({ ...INITIAL_STATE })
  }, [])

  // ─── Derived helpers ────────────────────────────────────────────

  const getCurrentCategory = (): CategoryConfig | null => {
    return state.selectedCategories[state.currentCategoryIndex] ?? null
  }

  const getCurrentRoundConfig = () => {
    const cat = getCurrentCategory()
    if (!cat) return null
    return categoryToRoundConfig(cat, state.currentCategoryIndex)
  }

  const isElimination = isEliminationSubRound(
    state.mode,
    state.currentCategoryIndex,
    state.currentSubRound
  )

  const currentPlatforms = getPlatformsForRound(
    state.mode,
    state.currentCategoryIndex,
    state.currentSubRound,
    state.voteState.survivors
  )

  return {
    state,
    getCurrentCategory,
    getCurrentRoundConfig,
    isElimination,
    currentPlatforms,
    handlePathSelect,
    handleCategorySelect,
    handleCompare,
    handleEliminationVote,
    handleSingleVote,
    handleTransitionComplete,
    handleTiebreakerAnswer,
    handleTiebreakerComplete,
    handleBackToGate,
    handleRestart,
  }
}

// ─── Internal Helpers ──────────────────────────────────────────────

function computeCategoryWinner(
  picks: string[][],
  votes: Record<string, number>,
  survivors: string[]
): string {
  // Count how many times each platform was picked in this category
  const catVotes: Record<string, number> = {}
  for (const pickSet of picks) {
    for (const p of pickSet) {
      catVotes[p] = (catVotes[p] ?? 0) + 1
    }
  }

  let best = survivors[0] ?? ""
  let bestScore = -1
  for (const [platform, score] of Object.entries(catVotes)) {
    if (score > bestScore) {
      bestScore = score
      best = platform
    }
  }
  return best
}
