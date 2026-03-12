"use client"

import { useState, useEffect, useCallback } from "react"
import { ROTATING_PLACEHOLDERS, EXAMPLE_PROMPTS, USE_CASE_TAGS } from "@/lib/constants"
import type { UseCaseTag } from "@/lib/constants"
import type { RoundConfig } from "@/lib/tournament"

interface PromptInputProps {
  onSubmit: (prompt: string) => void
  initialPrompt?: string
  isLoading?: boolean
  /** When in tournament mode, show round-specific UI */
  roundConfig?: RoundConfig
}

export function PromptInput({ onSubmit, initialPrompt = "", isLoading = false, roundConfig }: PromptInputProps) {
  const [prompt, setPrompt] = useState(initialPrompt || roundConfig?.defaultPrompt || "")
  const [placeholderIndex, setPlaceholderIndex] = useState(0)

  useEffect(() => {
    if (roundConfig) return // No rotating placeholders in tournament mode
    const interval = setInterval(() => {
      setPlaceholderIndex((prev) => (prev + 1) % ROTATING_PLACEHOLDERS.length)
    }, 4000)
    return () => clearInterval(interval)
  }, [roundConfig])

  // Pre-fill default prompt when roundConfig changes
  useEffect(() => {
    if (roundConfig?.defaultPrompt && !initialPrompt) {
      setPrompt(roundConfig.defaultPrompt)
    }
  }, [roundConfig, initialPrompt])

  const handleSubmit = useCallback(() => {
    const trimmed = prompt.trim()
    if (trimmed && !isLoading) {
      onSubmit(trimmed)
    }
  }, [prompt, isLoading, onSubmit])

  function handleChipClick(tag: UseCaseTag) {
    setPrompt(EXAMPLE_PROMPTS[tag])
  }

  const chipLabels: Record<UseCaseTag, string> = {
    writing: "Writing",
    research: "Research",
    creative: "Creative",
    coding: "Coding",
    business: "Business",
  }

  return (
    <div className="w-full max-w-2xl mx-auto space-y-4">
      {/* Round-specific header */}
      {roundConfig ? (
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent-50 border border-accent-100">
            <span className="text-xs font-medium text-accent-600">
              Round {roundConfig.round}: {roundConfig.category}
            </span>
          </div>
          <p className="text-sm text-warm-400 italic">
            {roundConfig.hint}
          </p>
        </div>
      ) : (
        <label className="block text-sm font-medium text-warm-600">
          Type anything. A question, a task, a creative challenge.
        </label>
      )}

      <div className="relative">
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value.slice(0, 500))}
          placeholder={roundConfig ? roundConfig.defaultPrompt : ROTATING_PLACEHOLDERS[placeholderIndex]}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault()
              handleSubmit()
            }
          }}
          className="w-full h-32 px-4 py-3 rounded-xl border border-warm-200 text-sm text-warm-800 placeholder:text-warm-300 resize-none focus:outline-none focus:ring-2 focus:ring-accent-400 focus:border-transparent bg-white"
          maxLength={500}
        />
        {prompt.length >= 400 && (
          <span className="absolute bottom-3 right-3 text-xs text-warm-400">
            {prompt.length}/500
          </span>
        )}
      </div>

      <button
        onClick={handleSubmit}
        disabled={prompt.trim().length === 0 || isLoading}
        className="w-full py-3 bg-accent-500 text-white text-sm font-medium rounded-xl hover:bg-accent-600 transition-colors duration-200 disabled:opacity-40 disabled:cursor-not-allowed focus:ring-2 focus:ring-accent-400"
      >
        {isLoading
          ? "Comparing..."
          : roundConfig
            ? `Start Round ${roundConfig.round}`
            : "Compare all 6 AIs"}
      </button>

      {/* Example chips — only in non-tournament mode */}
      {!roundConfig && (
        <div className="flex flex-wrap gap-2 justify-center pt-2">
          {USE_CASE_TAGS.map((tag) => (
            <button
              key={tag}
              onClick={() => handleChipClick(tag)}
              className="px-3 py-1.5 text-xs font-medium rounded-lg border border-warm-200 text-warm-500 hover:border-accent-300 hover:bg-accent-50 hover:text-accent-600 transition-colors duration-200 focus:ring-2 focus:ring-accent-400"
            >
              {chipLabels[tag]}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
