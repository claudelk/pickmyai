"use client"

import { useState } from "react"
import { AICard } from "./AICard"
import type { AICardResult } from "./AICard"
import { PromptInput } from "./PromptInput"
import { DeveloperModeToggle } from "@/components/ui/DeveloperModeToggle"
import { PLATFORMS } from "@/lib/constants"

interface ResultsGridProps {
  results: Record<string, AICardResult>
  recommendedPlatform: string
  onNewPrompt: (prompt: string) => void
  isLoading: boolean
}

export function ResultsGrid({ results, recommendedPlatform, onNewPrompt, isLoading }: ResultsGridProps) {
  const [devMode, setDevMode] = useState(false)

  // Find recommended platform for mobile sticky bar
  const recommended = PLATFORMS.find((p) => p.id === recommendedPlatform)

  return (
    <div className="w-full max-w-6xl mx-auto px-6 py-8">
      {/* Developer mode toggle */}
      <div className="flex justify-end mb-6">
        <DeveloperModeToggle enabled={devMode} onToggle={() => setDevMode(!devMode)} />
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {PLATFORMS.map((platform) => (
          <AICard
            key={platform.id}
            platform={platform}
            result={results[platform.id] ?? null}
            isRecommended={platform.id === recommendedPlatform}
            devMode={devMode}
          />
        ))}
      </div>

      {/* Try another prompt */}
      <div className="mt-12 pt-8 border-t border-slate-200">
        <p className="text-center text-sm text-slate-500 mb-6">
          Want to try a different prompt?
        </p>
        <PromptInput onSubmit={onNewPrompt} isLoading={isLoading} />
      </div>

      {/* Mobile sticky bar */}
      {recommended && (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 p-4 sm:hidden z-40">
          <div className="flex items-center justify-between max-w-lg mx-auto">
            <p className="text-sm text-slate-700">
              <span className="font-medium">{recommended.displayName}</span> looks like your best match.
            </p>
            <a
              href={recommended.signupUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 bg-[#2563EB] text-white text-xs font-medium rounded-lg hover:bg-[#1E40AF] transition-colors duration-200"
            >
              Try it free
            </a>
          </div>
        </div>
      )}
    </div>
  )
}
