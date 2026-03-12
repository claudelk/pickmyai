"use client"

import { useState, useCallback, useRef } from "react"
import type { AICardResult } from "@/components/home/AICard"
import type { UseCaseTag } from "@/lib/constants"
import {
  ALL_PLATFORM_IDS,
  getRoundConfig,
  checkForWinner,
  resolveTiebreaker,
} from "./tournament"
import type { TournamentStage, RoundNumber, VoteState } from "./tournament"

export interface TournamentState {
  stage: TournamentStage
  currentRound: RoundNumber
  voteState: VoteState
  results: Record<string, AICardResult>
  isLoading: boolean
  rateLimited: boolean
  useCaseTag: UseCaseTag | undefined
  suggestedPrompt: string
  /** The winning platform id */
  winner: string | null
  /** Tiebreaker answers collected so far */
  tiebreakerAnswers: Record<string, "a" | "b">
  /** The prompts the user actually used per round */
  roundPrompts: Record<number, string>
}

export function useTournament(initialPrompt = "") {
  const stateRef = useRef<TournamentState>(null!)
  const [state, setState] = useState<TournamentState>({
    stage: initialPrompt ? "round1_prompt" : "gate",
    currentRound: 1,
    voteState: {
      votes: {},
      survivors: [...ALL_PLATFORM_IDS],
      round1Picks: [],
      round2Pick: null,
      round3Pick: null,
    },
    results: {},
    isLoading: false,
    rateLimited: false,
    useCaseTag: undefined,
    suggestedPrompt: initialPrompt,
    winner: null,
    tiebreakerAnswers: {},
    roundPrompts: {},
  })
  stateRef.current = state

  // ─── Gate ────────────────────────────────────────────────────────

  const handlePathSelect = useCallback((path: "a" | "b") => {
    setState((prev) => ({
      ...prev,
      stage: path === "a" ? "round1_prompt" : "onboarding",
    }))
  }, [])

  const handleOnboardingComplete = useCallback((tag: UseCaseTag, freeText: string) => {
    setState((prev) => ({
      ...prev,
      useCaseTag: tag,
      suggestedPrompt: freeText || "",
      stage: "round1_prompt",
    }))
  }, [])

  // ─── Prompt Submission & API ─────────────────────────────────────

  const handleCompare = useCallback(async (prompt: string) => {
    // Read current state synchronously via ref before any async work
    const current = stateRef.current
    const round = current.currentRound
    const platforms = round === 1 ? ALL_PLATFORM_IDS : current.voteState.survivors

    // Set loading results
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

    const resultsStage: TournamentStage =
      round === 1
        ? "round1_results"
        : round === 2
          ? "round2_results"
          : "round3_results"

    setState((prev) => ({
      ...prev,
      isLoading: true,
      rateLimited: false,
      results: loadingResults,
      stage: resultsStage,
      roundPrompts: { ...prev.roundPrompts, [round]: prompt },
    }))

    try {
      const response = await fetch("/api/compare", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt,
          platforms,
          tournamentRound: round,
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
        const ps = prev.currentRound === 1 ? ALL_PLATFORM_IDS : prev.voteState.survivors
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

    setState((prev) => {
      const voteStage: TournamentStage =
        prev.currentRound === 1
          ? "round1_vote"
          : prev.currentRound === 2
            ? "round2_vote"
            : "round3_vote"
      return { ...prev, isLoading: false, stage: voteStage }
    })
  }, [])

  // ─── Voting ──────────────────────────────────────────────────────

  /** Round 1: user picks top 3 in order. #1 gets a vote. All 3 advance. */
  const handleRound1Vote = useCallback((picks: string[]) => {
    setState((prev) => {
      const newVotes = { ...prev.voteState.votes }
      // #1 pick gets 1 vote
      newVotes[picks[0]] = (newVotes[picks[0]] ?? 0) + 1

      return {
        ...prev,
        voteState: {
          ...prev.voteState,
          votes: newVotes,
          survivors: picks,
          round1Picks: picks,
        },
        stage: "round2_prompt",
        currentRound: 2 as RoundNumber,
      }
    })
  }, [])

  /** Rounds 2-3: user picks 1 favorite, gets 1 vote. */
  const handleRoundVote = useCallback((pick: string) => {
    setState((prev) => {
      const newVotes = { ...prev.voteState.votes }
      newVotes[pick] = (newVotes[pick] ?? 0) + 1

      const isRound2 = prev.currentRound === 2
      const newVoteState = {
        ...prev.voteState,
        votes: newVotes,
        ...(isRound2 ? { round2Pick: pick } : { round3Pick: pick }),
      }

      if (isRound2) {
        // Move to round 3
        return {
          ...prev,
          voteState: newVoteState,
          stage: "round3_prompt" as TournamentStage,
          currentRound: 3 as RoundNumber,
        }
      }

      // After round 3, check for winner
      const { winner, needsTiebreaker } = checkForWinner(newVotes)

      return {
        ...prev,
        voteState: newVoteState,
        stage: needsTiebreaker ? "tiebreaker" : "winner",
        winner: winner,
      }
    })
  }, [])

  // ─── Tiebreaker ──────────────────────────────────────────────────

  const handleTiebreakerAnswer = useCallback((questionId: string, answer: "a" | "b") => {
    setState((prev) => ({
      ...prev,
      tiebreakerAnswers: { ...prev.tiebreakerAnswers, [questionId]: answer },
    }))
  }, [])

  const handleTiebreakerComplete = useCallback(() => {
    setState((prev) => {
      const winner = resolveTiebreaker(prev.voteState.votes, prev.tiebreakerAnswers)
      return { ...prev, winner, stage: "winner" }
    })
  }, [])

  // ─── Navigation Helpers ──────────────────────────────────────────

  const handleBackToGate = useCallback(() => {
    setState((prev) => ({ ...prev, stage: "gate" }))
  }, [])

  const handleRestart = useCallback(() => {
    setState({
      stage: "gate",
      currentRound: 1,
      voteState: {
        votes: {},
        survivors: [...ALL_PLATFORM_IDS],
        round1Picks: [],
        round2Pick: null,
        round3Pick: null,
      },
      results: {},
      isLoading: false,
      rateLimited: false,
      useCaseTag: undefined,
      suggestedPrompt: "",
      winner: null,
      tiebreakerAnswers: {},
      roundPrompts: {},
    })
  }, [])

  return {
    state,
    handlePathSelect,
    handleOnboardingComplete,
    handleCompare,
    handleRound1Vote,
    handleRoundVote,
    handleTiebreakerAnswer,
    handleTiebreakerComplete,
    handleBackToGate,
    handleRestart,
  }
}
