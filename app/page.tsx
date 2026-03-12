"use client"

import { Suspense, useState, useCallback } from "react"
import { useSearchParams } from "next/navigation"
import { EntryGate } from "@/components/home/EntryGate"
import { GuidedOnboarding } from "@/components/home/GuidedOnboarding"
import { PromptInput } from "@/components/home/PromptInput"
import { ResultsGrid } from "@/components/home/ResultsGrid"
import { RateLimitBanner } from "@/components/ui/RateLimitBanner"
import { TournamentProgress } from "@/components/home/TournamentProgress"
import { AssessmentCriteria } from "@/components/home/AssessmentCriteria"
import { TiebreakerFlow } from "@/components/home/TiebreakerFlow"
import { WinnerCard } from "@/components/home/WinnerCard"
import { NormalModeDisclaimer } from "@/components/home/NormalModeDisclaimer"
import { useTournament } from "@/lib/useTournament"
import { getRoundConfig } from "@/lib/tournament"

export default function Home() {
  return (
    <Suspense>
      <HomeContent />
    </Suspense>
  )
}

function HomeContent() {
  const searchParams = useSearchParams()
  const urlPrompt = searchParams.get("prompt") ?? ""

  const {
    state,
    handlePathSelect,
    handleOnboardingComplete,
    handleCompare,
    handleRound1Vote,
    handleRoundVote,
    handleTiebreakerAnswer,
    handleTiebreakerComplete,
    handleRestart,
  } = useTournament(urlPrompt)

  const { stage, currentRound, voteState, results, isLoading, rateLimited, winner, tiebreakerAnswers } = state

  const roundConfig = getRoundConfig(currentRound)

  // ─── Vote card selection (integrated into results grid) ──────

  const [round1Picks, setRound1Picks] = useState<string[]>([])

  const handleCardSelect = useCallback(
    (platformId: string) => {
      if (stage === "round1_vote") {
        setRound1Picks((prev) => {
          if (prev.includes(platformId)) {
            return prev.filter((p) => p !== platformId)
          }
          if (prev.length < 3) {
            return [...prev, platformId]
          }
          return prev
        })
      } else if (stage === "round2_vote" || stage === "round3_vote") {
        handleRoundVote(platformId)
      }
    },
    [stage, handleRoundVote]
  )

  const confirmRound1 = useCallback(() => {
    if (round1Picks.length === 3) {
      handleRound1Vote(round1Picks)
      setRound1Picks([])
    }
  }, [round1Picks, handleRound1Vote])

  // ─── Determine what to show ──────────────────────────────────

  const isPromptStage = stage === "round1_prompt" || stage === "round2_prompt" || stage === "round3_prompt"
  const isResultsStage = stage === "round1_results" || stage === "round2_results" || stage === "round3_results"
  const isVoteStage = stage === "round1_vote" || stage === "round2_vote" || stage === "round3_vote"
  const showResults = isResultsStage || isVoteStage

  // Platforms to display in grid
  const gridPlatforms = currentRound === 1
    ? ["chatgpt", "claude", "gemini", "mistral", "grok", "meta"]
    : voteState.survivors

  return (
    <div className="min-h-screen">
      {/* ─── Gate ─────────────────────────────────────────── */}
      {stage === "gate" && <EntryGate onSelectPath={handlePathSelect} />}

      {/* ─── Onboarding ──────────────────────────────────── */}
      {stage === "onboarding" && (
        <GuidedOnboarding
          onComplete={handleOnboardingComplete}
          onBack={() => handlePathSelect("a")}
        />
      )}

      {/* ─── Prompt Input (per round) ────────────────────── */}
      {isPromptStage && (
        <div className="flex flex-col items-center justify-center min-h-[calc(100vh-64px)] px-6">
          <TournamentProgress currentRound={currentRound} />
          <NormalModeDisclaimer />
          <PromptInput
            key={`round-${currentRound}`}
            onSubmit={handleCompare}
            initialPrompt={currentRound === 1 ? state.suggestedPrompt : ""}
            isLoading={isLoading}
            roundConfig={roundConfig}
          />
        </div>
      )}

      {/* ─── Results + Vote ──────────────────────────────── */}
      {showResults && (
        <>
          {rateLimited ? (
            <div className="flex items-center justify-center min-h-[calc(100vh-64px)] px-6">
              <RateLimitBanner />
            </div>
          ) : (
            <div>
              {/* Progress bar */}
              <div className="px-6 pt-6">
                <TournamentProgress currentRound={currentRound} isVoting={isVoteStage} />
              </div>

              {/* Assessment criteria */}
              {isVoteStage && (
                <div className="px-6">
                  <AssessmentCriteria criteria={roundConfig.criteria} />
                </div>
              )}

              {/* Results grid */}
              <ResultsGrid
                results={results}
                isLoading={isLoading}
                platforms={gridPlatforms}
                selectable={isVoteStage}
                selectedPlatforms={stage === "round1_vote" ? round1Picks : []}
                onCardSelect={handleCardSelect}
              />

              {/* Vote instructions & confirm button */}
              {isVoteStage && (
                <div className="text-center px-6 py-6 space-y-4">
                  {stage === "round1_vote" ? (
                    <>
                      <p className="text-sm text-warm-500">
                        Tap the cards in order of preference. #1 scores a point, all three advance.
                      </p>
                      <button
                        onClick={confirmRound1}
                        disabled={round1Picks.length !== 3}
                        className="px-8 py-3 bg-accent-500 text-white text-sm font-medium rounded-xl hover:bg-accent-600 transition-colors duration-200 disabled:opacity-40 disabled:cursor-not-allowed"
                      >
                        Confirm top 3 ({round1Picks.length}/3 selected)
                      </button>
                    </>
                  ) : (
                    <p className="text-sm text-warm-500">
                      Tap the response you liked best. It scores a point.
                    </p>
                  )}
                </div>
              )}
            </div>
          )}
        </>
      )}

      {/* ─── Tiebreaker ──────────────────────────────────── */}
      {stage === "tiebreaker" && (
        <TiebreakerFlow
          answers={tiebreakerAnswers}
          onAnswer={handleTiebreakerAnswer}
          onComplete={handleTiebreakerComplete}
        />
      )}

      {/* ─── Winner ──────────────────────────────────────── */}
      {stage === "winner" && winner && (
        <WinnerCard
          winnerId={winner}
          voteState={voteState}
          onRestart={handleRestart}
        />
      )}
    </div>
  )
}
