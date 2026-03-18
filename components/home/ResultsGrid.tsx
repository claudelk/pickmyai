"use client"

import { useState } from "react"
import { Settings } from "lucide-react"
import { AICard } from "./AICard"
import type { AICardResult } from "./AICard"
import { DeveloperModeToggle } from "@/components/ui/DeveloperModeToggle"
import { PLATFORMS } from "@/lib/constants"

interface ResultsGridProps {
  results: Record<string, AICardResult>
  recommendedPlatform?: string
  isLoading: boolean
  /** When provided, only show these platforms (tournament rounds 2-3) */
  platforms?: string[]
  /** Vote mode: cards are selectable */
  selectable?: boolean
  /** Currently selected platform IDs (in order for round 1) */
  selectedPlatforms?: string[]
  /** Called when a card is clicked in selectable mode */
  onCardSelect?: (platformId: string) => void
}

export function ResultsGrid({
  results,
  recommendedPlatform,
  isLoading,
  platforms: platformFilter,
  selectable,
  selectedPlatforms = [],
  onCardSelect,
}: ResultsGridProps) {
  const [devMode, setDevMode] = useState(false)

  const displayPlatforms = platformFilter
    ? PLATFORMS.filter((p) => platformFilter.includes(p.id))
    : PLATFORMS

  const gridCols = displayPlatforms.length <= 3
    ? "grid-cols-1 sm:grid-cols-3"
    : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"

  return (
    <div className="w-full max-w-6xl mx-auto px-6 py-2">
      {/* Dev mode panel — only show when active */}
      {devMode && (
        <div className="flex justify-end mb-2">
          <DeveloperModeToggle enabled={devMode} onToggle={() => setDevMode(false)} />
        </div>
      )}

      {/* Floating gear button — bottom right, always available */}
      {!devMode && (
        <button
          onClick={() => setDevMode(true)}
          className="fixed bottom-20 sm:bottom-6 right-6 z-40 w-11 h-11 sm:w-9 sm:h-9 rounded-full bg-white/80 backdrop-blur-sm border border-warm-200 flex items-center justify-center hover:bg-warm-50 hover:border-warm-300 transition-colors duration-200 focus:ring-2 focus:ring-accent-400"
          aria-label="Enable developer mode"
          title="Developer mode"
        >
          <Settings size={14} className="text-warm-400" />
        </button>
      )}

      {/* Grid */}
      <div className={`grid ${gridCols} gap-4`}>
        {displayPlatforms.map((platform) => {
          const pickIdx = selectedPlatforms.indexOf(platform.id)

          return (
            <AICard
              key={platform.id}
              platform={platform}
              result={results[platform.id] ?? null}
              isRecommended={!selectable && platform.id === recommendedPlatform}
              devMode={devMode}
              selectable={selectable}
              selected={pickIdx >= 0}
              pickNumber={pickIdx >= 0 ? pickIdx + 1 : undefined}
              onSelect={() => onCardSelect?.(platform.id)}
            />
          )
        })}
      </div>
    </div>
  )
}
