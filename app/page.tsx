"use client"

import { Suspense, useState, useCallback, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { EntryGate } from "@/components/home/EntryGate"
import { CategorySelector } from "@/components/home/CategorySelector"
import { CategoryBackground } from "@/components/home/CategoryBackground"
import { PromptInput } from "@/components/home/PromptInput"
import { ResultsGrid } from "@/components/home/ResultsGrid"
import { RateLimitBanner } from "@/components/ui/RateLimitBanner"
import { TournamentProgress } from "@/components/home/TournamentProgress"
import { AssessmentCriteria } from "@/components/home/AssessmentCriteria"
import { TiebreakerFlow } from "@/components/home/TiebreakerFlow"
import { WinnerCard } from "@/components/home/WinnerCard"
import { RoundTransition } from "@/components/home/RoundTransition"
import { useTournament } from "@/lib/useTournament"

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
    handleRestart,
  } = useTournament(urlPrompt)

  const {
    phase,
    mode,
    selectedCategories,
    currentCategoryIndex,
    currentSubRound,
    voteState,
    results,
    isLoading,
    rateLimited,
    winner,
    tiebreakerAnswers,
  } = state

  // ─── Show video background on gate + category_select ────────
  const showVideoBg = phase === "gate" || phase === "category_select"

  useEffect(() => {
    if (showVideoBg) {
      document.body.classList.add("has-category-bg")
    } else {
      document.body.classList.remove("has-category-bg")
    }
    return () => document.body.classList.remove("has-category-bg")
  }, [showVideoBg])

  // ─── Sync URL path to current phase ─────────────────────────
  useEffect(() => {
    const phaseToPath: Record<string, string> = {
      gate: "/",
      category_select: "/choose-category",
      round_prompt: "/round",
      round_results: "/round",
      round_vote: "/round/vote",
      round_transition: "/round",
      tiebreaker: "/tiebreaker",
      winner: "/winner",
    }
    const targetPath = phaseToPath[phase] ?? "/"
    const qs = window.location.search
    const newUrl = `${targetPath}${qs}`
    if (window.location.pathname !== targetPath) {
      window.history.replaceState(null, "", newUrl)
    }
  }, [phase])

  const currentCategory = getCurrentCategory()
  const roundConfig = getCurrentRoundConfig()

  // ─── Vote card selection (integrated into results grid) ──────

  const [eliminationPicks, setEliminationPicks] = useState<string[]>([])

  const handleCardSelect = useCallback(
    (platformId: string) => {
      if (phase !== "round_vote") return

      if (isElimination) {
        setEliminationPicks((prev) => {
          if (prev.includes(platformId)) {
            return prev.filter((p) => p !== platformId)
          }
          if (prev.length < 3) {
            return [...prev, platformId]
          }
          return prev
        })
      } else {
        handleSingleVote(platformId)
      }
    },
    [phase, isElimination, handleSingleVote]
  )

  const confirmElimination = useCallback(() => {
    if (eliminationPicks.length === 3) {
      handleEliminationVote(eliminationPicks)
      setEliminationPicks([])
    }
  }, [eliminationPicks, handleEliminationVote])

  // ─── Determine what to show ──────────────────────────────────

  const isPromptPhase = phase === "round_prompt"
  const isResultsPhase = phase === "round_results"
  const isVotePhase = phase === "round_vote"
  const showResults = isResultsPhase || isVotePhase

  const catId = currentCategory?.id ?? ""
  const currentPrompt = state.roundPrompts[catId] ?? ""
  const gridPlatforms = currentPlatforms

  // Should we show the category background image?
  const showCategoryBg = isPromptPhase || showResults
  const categoryImage = currentCategory?.image ?? ""

  // ─── Shared frosted glass classes ────────────────────────────
  const glass = "bg-white/80 backdrop-blur-2xl border border-white/40 shadow-xl"
  const glassDark = "bg-black/30 backdrop-blur-2xl border border-white/15 shadow-xl"

  // ─── Render ──────────────────────────────────────────────────

  return (
    <div className="min-h-screen">
      {/* ─── Shared video background for gate + category select ── */}
      {showVideoBg && (
        <div className="relative min-h-[calc(100vh-64px)] -mt-16 pt-16 overflow-hidden">
          <video
            autoPlay
            muted
            loop
            playsInline
            className="absolute inset-0 w-full h-full object-cover"
            poster=""
          >
            <source src="/hero-bg.mp4" type="video/mp4" />
          </video>
          <div className={`absolute inset-0 transition-colors duration-500 ${
            phase === "category_select" ? "bg-black/60" : "bg-black/50"
          }`} />

          {phase === "gate" && <EntryGate onSelectPath={handlePathSelect} />}
          {phase === "category_select" && (
            <CategorySelector onConfirm={handleCategorySelect} mode={mode} />
          )}
        </div>
      )}

      {/* ─── Tournament Phases (with category background) ── */}
      {showCategoryBg && categoryImage && (
        <CategoryBackground imageSrc={categoryImage}>
          {/* ─── Prompt Input ─────────────────────────────── */}
          {isPromptPhase && roundConfig && (
            <div className="flex flex-col items-center justify-center px-6 min-h-[calc(100vh-64px)]">
              {/* Progress bar — frosted glass */}
              <div className={`w-full max-w-3xl rounded-2xl px-6 py-4 mb-5 ${glassDark}`}>
                <TournamentProgress
                  categories={selectedCategories}
                  currentCategoryIndex={currentCategoryIndex}
                  currentSubRound={currentSubRound}
                  mode={mode}
                  isElimination={isElimination}
                />
              </div>

              {/* Disclaimer */}
              <div className={`w-full max-w-3xl rounded-xl px-4 py-2.5 mb-5 ${glassDark}`}>
                <p className="text-sm text-white/70 flex items-center gap-2">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" className="text-white/50 flex-shrink-0">
                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.5" />
                    <path d="M12 7v6M12 16v.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                  </svg>
                  Comparing standard chat mode, not deep research, deep thinking, code interpreter, or image/video generation.
                </p>
              </div>

              {/* Prompt input */}
              <div className={`w-full max-w-3xl rounded-2xl px-4 sm:px-8 py-6 sm:py-8 ${glassDark}`}>
                <PromptInput
                  key={`cat-${catId}-sub-${currentSubRound}`}
                  onSubmit={handleCompare}
                  initialPrompt={
                    mode === "deep" && currentSubRound > 0
                      ? currentPrompt
                      : currentCategoryIndex === 0 && currentSubRound === 0
                        ? state.suggestedPrompt
                        : ""
                  }
                  isLoading={isLoading}
                  roundConfig={roundConfig}
                />
              </div>
            </div>
          )}

          {/* ─── Results + Vote ────────────────────────────── */}
          {showResults && (
            <>
              {rateLimited ? (
                <div className="flex items-center justify-center min-h-[calc(100vh-64px)] px-6">
                  <div className={`rounded-2xl px-8 py-6 ${glass}`}>
                    <RateLimitBanner />
                  </div>
                </div>
              ) : (
                <div className="pb-8">
                  {/* Progress bar — frosted */}
                  <div className="max-w-6xl mx-auto px-6 pt-6">
                    <div className={`rounded-2xl px-5 py-4 ${glassDark}`}>
                      <TournamentProgress
                        categories={selectedCategories}
                        currentCategoryIndex={currentCategoryIndex}
                        currentSubRound={currentSubRound}
                        mode={mode}
                        isVoting={isVotePhase}
                        isElimination={isElimination}
                      />
                    </div>
                  </div>

                  {/* Prompt used — frosted */}
                  {currentPrompt && (
                    <div className="max-w-6xl mx-auto px-6 mt-4">
                      <div className={`rounded-xl px-4 py-3 ${glassDark}`}>
                        <p className="text-xs font-medium text-white/50 uppercase tracking-wider mb-1">Prompt</p>
                        <p className="text-sm text-white/80 leading-relaxed">{currentPrompt}</p>
                      </div>
                    </div>
                  )}

                  {/* Assessment criteria */}
                  {isVotePhase && roundConfig && (
                    <div className="max-w-6xl mx-auto px-6 mt-4">
                      <div className={`rounded-2xl px-5 py-4 ${glassDark}`}>
                        <AssessmentCriteria
                          criteria={roundConfig.criteria}
                          voteInstruction={
                            isElimination
                              ? "Tap cards in order of preference. #1 scores a point, all 3 advance."
                              : "Tap the response you liked best. It scores a point."
                          }
                          confirmButton={
                            isElimination ? (
                              <button
                                onClick={confirmElimination}
                                disabled={eliminationPicks.length !== 3}
                                className={`group w-14 h-14 rounded-full flex items-center justify-center transition-all duration-300 ${
                                  eliminationPicks.length === 3
                                    ? "bg-accent-500 hover:bg-accent-600 shadow-lg shadow-accent-200/50 scale-100"
                                    : "bg-white/50 cursor-not-allowed scale-90"
                                }`}
                                title={eliminationPicks.length === 3 ? "Confirm top 3" : `${eliminationPicks.length}/3 selected`}
                              >
                                <svg
                                  width="24"
                                  height="24"
                                  viewBox="0 0 24 24"
                                  fill="none"
                                  className={`transition-all duration-300 ${
                                    eliminationPicks.length === 3
                                      ? "text-white translate-x-0.5"
                                      : "text-warm-300"
                                  }`}
                                >
                                  <path d="M6 4l12 8-12 8V4z" fill="currentColor" />
                                </svg>
                                <svg className="absolute inset-0" width="56" height="56" viewBox="0 0 56 56">
                                  <circle
                                    cx="28" cy="28" r="26" fill="none"
                                    stroke={eliminationPicks.length === 3 ? "#3b82f6" : "#e5e7eb"}
                                    strokeWidth="2"
                                    strokeDasharray={`${(eliminationPicks.length / 3) * 163.4} 163.4`}
                                    strokeLinecap="round"
                                    className="transition-all duration-500"
                                    transform="rotate(-90 28 28)"
                                  />
                                </svg>
                              </button>
                            ) : undefined
                          }
                        />
                      </div>
                    </div>
                  )}

                  {/* Results grid — cards already have their own bg, but wrap for spacing */}
                  <div className="mt-4">
                    <ResultsGrid
                      results={results}
                      isLoading={isLoading}
                      platforms={gridPlatforms}
                      selectable={isVotePhase}
                      selectedPlatforms={isElimination ? eliminationPicks : []}
                      onCardSelect={handleCardSelect}
                    />
                  </div>
                </div>
              )}
            </>
          )}
        </CategoryBackground>
      )}

      {/* ─── Round Transition ──────────────────────────────── */}
      {phase === "round_transition" && currentCategoryIndex < selectedCategories.length && (
        <RoundTransition
          completedCategory={selectedCategories[currentCategoryIndex - 1] ?? selectedCategories[0]}
          nextCategory={selectedCategories[currentCategoryIndex]}
          completedCategoryIndex={currentCategoryIndex - 1}
          totalCategories={selectedCategories.length}
          onComplete={handleTransitionComplete}
        />
      )}

      {/* ─── Tiebreaker ──────────────────────────────────── */}
      {phase === "tiebreaker" && (
        <TiebreakerFlow
          answers={tiebreakerAnswers}
          onAnswer={handleTiebreakerAnswer}
          onComplete={handleTiebreakerComplete}
        />
      )}

      {/* ─── Winner ──────────────────────────────────────── */}
      {phase === "winner" && winner && (
        <WinnerCard
          winnerId={winner}
          voteState={voteState}
          mode={mode}
          selectedCategories={selectedCategories}
          onRestart={handleRestart}
        />
      )}
    </div>
  )
}
