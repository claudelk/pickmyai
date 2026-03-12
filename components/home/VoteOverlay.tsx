"use client"

import { useState } from "react"
import { PLATFORMS } from "@/lib/constants"
import type { RoundNumber } from "@/lib/tournament"

interface VoteOverlayProps {
  round: RoundNumber
  platforms: string[]
  onVoteRound1: (picks: string[]) => void
  onVoteSingle: (pick: string) => void
}

export function VoteOverlay({ round, platforms, onVoteRound1, onVoteSingle }: VoteOverlayProps) {
  const [picks, setPicks] = useState<string[]>([])

  const isRound1 = round === 1

  function handleCardClick(platformId: string) {
    if (isRound1) {
      // Toggle or reorder picks (max 3)
      if (picks.includes(platformId)) {
        setPicks(picks.filter((p) => p !== platformId))
      } else if (picks.length < 3) {
        setPicks([...picks, platformId])
      }
    } else {
      // Single pick for rounds 2-3
      onVoteSingle(platformId)
    }
  }

  function handleConfirmRound1() {
    if (picks.length === 3) {
      onVoteRound1(picks)
    }
  }

  const getPickIndex = (id: string) => picks.indexOf(id)

  return (
    <div className="w-full max-w-4xl mx-auto">
      {/* Instruction */}
      <div className="text-center mb-6">
        <h2 className="text-lg font-serif font-semibold text-warm-800 mb-1">
          {isRound1 ? "Pick your top 3" : "Pick your favorite"}
        </h2>
        <p className="text-sm text-warm-400">
          {isRound1
            ? "Tap the cards in order of preference. #1 scores a point, all three advance."
            : "Tap the response you liked best. It scores a point."}
        </p>
      </div>

      {/* Selectable platform pills */}
      <div className={`grid gap-3 mb-6 ${isRound1 ? "grid-cols-2 sm:grid-cols-3 lg:grid-cols-6" : "grid-cols-1 sm:grid-cols-3"}`}>
        {platforms.map((id) => {
          const platform = PLATFORMS.find((p) => p.id === id)
          if (!platform) return null
          const pickIdx = getPickIndex(id)
          const isSelected = pickIdx >= 0

          return (
            <button
              key={id}
              onClick={() => handleCardClick(id)}
              className={`relative flex items-center gap-2 px-4 py-3 rounded-xl border text-left transition-all duration-200 ${
                isSelected
                  ? "border-accent-400 bg-accent-50 shadow-sm ring-2 ring-accent-200"
                  : "border-warm-200 bg-white hover:border-accent-300 hover:bg-accent-50/50"
              }`}
            >
              {/* Selection number badge (round 1 only) */}
              {isRound1 && isSelected && (
                <span className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-accent-500 text-white text-xs font-bold flex items-center justify-center">
                  {pickIdx + 1}
                </span>
              )}

              <div
                className="w-3 h-3 rounded-full flex-shrink-0"
                style={{ backgroundColor: platform.color }}
              />
              <div>
                <p className="text-sm font-medium text-warm-800">{platform.displayName}</p>
                <p className="text-xs text-warm-400">{platform.company}</p>
              </div>
            </button>
          )
        })}
      </div>

      {/* Confirm button (round 1 only) */}
      {isRound1 && (
        <div className="text-center">
          <button
            onClick={handleConfirmRound1}
            disabled={picks.length !== 3}
            className="px-8 py-3 bg-accent-500 text-white text-sm font-medium rounded-xl hover:bg-accent-600 transition-colors duration-200 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Confirm top 3 ({picks.length}/3 selected)
          </button>
        </div>
      )}
    </div>
  )
}
