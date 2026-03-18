"use client"

import { useState, useEffect, useCallback } from "react"
import { Sparkles } from "lucide-react"
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
  const [prompt, setPrompt] = useState(initialPrompt || "")
  const [placeholderIndex, setPlaceholderIndex] = useState(0)
  const [usedDefault, setUsedDefault] = useState(false)

  useEffect(() => {
    if (roundConfig) return
    const interval = setInterval(() => {
      setPlaceholderIndex((prev) => (prev + 1) % ROTATING_PLACEHOLDERS.length)
    }, 4000)
    return () => clearInterval(interval)
  }, [roundConfig])

  const handleSubmit = useCallback(() => {
    const trimmed = prompt.trim()
    if (trimmed && !isLoading) {
      onSubmit(trimmed)
    }
  }, [prompt, isLoading, onSubmit])

  const handleUseDefault = useCallback(() => {
    if (roundConfig?.defaultPrompt) {
      setPrompt(roundConfig.defaultPrompt)
      setUsedDefault(true)
      // Auto-submit after a brief moment so user sees it filled
      setTimeout(() => {
        onSubmit(roundConfig.defaultPrompt)
      }, 300)
    }
  }, [roundConfig, onSubmit])

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
    <div className="w-full mx-auto space-y-4">
      {/* Round-specific header */}
      {roundConfig ? (
        <div className="space-y-3">
          <p className="text-sm text-white/80 font-medium">
            {roundConfig.hint}
          </p>

          {/* Use suggested prompt button */}
          <button
            onClick={handleUseDefault}
            disabled={isLoading || usedDefault}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl border border-accent-400/30 bg-accent-500/10 text-left hover:bg-accent-500/20 hover:border-accent-400/50 transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed group"
          >
            <Sparkles size={16} className="text-accent-400 flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-accent-300 mb-0.5">Use suggested prompt</p>
              <p className="text-xs text-white/50 line-clamp-2">{roundConfig.defaultPrompt}</p>
            </div>
          </button>

          <div className="flex items-center gap-3">
            <div className="flex-1 h-px bg-white/15" />
            <span className="text-sm font-medium text-white/40">or write your own</span>
            <div className="flex-1 h-px bg-white/15" />
          </div>
        </div>
      ) : (
        <label className="block text-sm font-medium text-warm-600">
          Type anything. A question, a task, a creative challenge.
        </label>
      )}

      <div className="relative">
        <textarea
          value={prompt}
          onChange={(e) => { setPrompt(e.target.value.slice(0, 500)); setUsedDefault(false) }}
          placeholder={roundConfig ? "Write your own prompt..." : ROTATING_PLACEHOLDERS[placeholderIndex]}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault()
              handleSubmit()
            }
          }}
          className={`w-full h-28 px-4 py-3 rounded-xl border text-sm resize-none focus:outline-none focus:ring-2 focus:ring-accent-400 focus:border-transparent ${
            roundConfig
              ? "border-white/15 text-white placeholder:text-white/30 bg-white/10"
              : "border-warm-300 text-warm-800 placeholder:text-warm-400 bg-white/90"
          }`}
          maxLength={500}
        />
        {prompt.length >= 400 && (
          <span className={`absolute bottom-3 right-3 text-xs ${roundConfig ? "text-white/40" : "text-warm-400"}`}>
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
            ? `Compare ${roundConfig.category}`
            : "Compare all 6 AIs"}
      </button>

      {/* Example chips — only in non-tournament mode */}
      {!roundConfig && (
        <div className="flex flex-wrap gap-2 justify-center pt-2">
          {USE_CASE_TAGS.map((tag) => (
            <button
              key={tag}
              onClick={() => handleChipClick(tag)}
              className="px-4 py-2.5 text-xs font-medium rounded-lg border border-warm-200 text-warm-500 hover:border-accent-300 hover:bg-accent-50 hover:text-accent-600 transition-colors duration-200 focus:ring-2 focus:ring-accent-400"
            >
              {chipLabels[tag]}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
