"use client"

import type { CategoryConfig } from "@/lib/categories"
import type { TournamentMode } from "@/lib/tournament"

interface TournamentProgressProps {
  categories: CategoryConfig[]
  currentCategoryIndex: number
  currentSubRound: number
  mode: TournamentMode
  isVoting?: boolean
  isElimination?: boolean
}

export function TournamentProgress({
  categories,
  currentCategoryIndex,
  currentSubRound,
  mode,
  isVoting,
  isElimination,
}: TournamentProgressProps) {
  const currentCat = categories[currentCategoryIndex]
  const totalCats = categories.length

  const statusText = isVoting
    ? "Vote now"
    : isElimination
      ? "6 AIs competing"
      : "3 AIs remaining"

  const subRoundLabel = mode === "deep"
    ? ` · Pass ${currentSubRound + 1} of 3`
    : ""

  return (
    <div className="w-full mx-auto">
      {/* Round label */}
      <div className="flex items-center justify-between mb-3">
        <p className="text-sm font-medium text-white drop-shadow-sm">
          Category {currentCategoryIndex + 1} of {totalCats} · {currentCat?.name ?? ""}
          {mode === "deep" && (
            <span className="text-white/70 font-normal">{subRoundLabel}</span>
          )}
        </p>
        <p className="text-xs text-white/70 drop-shadow-sm">{statusText}</p>
      </div>

      {/* Progress bar — one segment per category */}
      <div className="flex gap-2">
        {categories.map((cat, i) => {
          let fillClass: string
          if (i < currentCategoryIndex) {
            fillClass = "bg-accent-400"
          } else if (i === currentCategoryIndex) {
            fillClass = "bg-accent-300"
          } else {
            fillClass = "bg-white/25"
          }

          return (
            <div key={cat.id} className="flex-1 flex flex-col gap-1">
              <div className={`h-2 rounded-full transition-colors duration-300 ${fillClass} overflow-hidden`}>
                {mode === "deep" && i === currentCategoryIndex && (
                  <div className="h-full rounded-full bg-accent-500 transition-all duration-500"
                    style={{ width: `${((currentSubRound + (isVoting ? 0.5 : 0)) / 3) * 100}%` }}
                  />
                )}
              </div>
              <p className={`text-[10px] text-center truncate hidden sm:block ${
                i === currentCategoryIndex ? "text-white font-medium" : "text-white/50"
              }`}>
                {cat.name}
              </p>
            </div>
          )
        })}
      </div>
    </div>
  )
}
