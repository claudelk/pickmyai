"use client"

import { getRoundConfig } from "@/lib/tournament"
import type { RoundNumber } from "@/lib/tournament"

interface TournamentProgressProps {
  currentRound: RoundNumber
  /** Whether the round is in voting phase (results shown) */
  isVoting?: boolean
}

export function TournamentProgress({ currentRound, isVoting }: TournamentProgressProps) {
  const config = getRoundConfig(currentRound)

  return (
    <div className="w-full max-w-2xl mx-auto mb-8">
      {/* Round label */}
      <div className="flex items-center justify-between mb-3">
        <p className="text-sm font-medium text-warm-600">
          Round {currentRound} of 3 — {config.category}
        </p>
        <p className="text-xs text-warm-400">
          {isVoting ? "Vote now" : currentRound === 1 ? "6 AIs competing" : "3 AIs remaining"}
        </p>
      </div>

      {/* Progress bar */}
      <div className="flex gap-2">
        {[1, 2, 3].map((r) => (
          <div
            key={r}
            className={`h-2 flex-1 rounded-full transition-colors duration-300 ${
              r < currentRound
                ? "bg-accent-500"
                : r === currentRound
                  ? "bg-accent-400"
                  : "bg-warm-150"
            }`}
          />
        ))}
      </div>
    </div>
  )
}
