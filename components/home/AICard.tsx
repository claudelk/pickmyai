"use client"

import { useRef, useState, useEffect } from "react"
import { ExternalLink } from "lucide-react"
import { RecommendationBadge } from "./RecommendationBadge"
import type { Platform } from "@/lib/constants"

export interface AICardResult {
  platform: string
  status: "success" | "error" | "timeout" | "loading"
  response: string
  latencyMs: number
  model: string
  tokensUsed: number
  errorMessage?: string
}

interface AICardProps {
  platform: Platform
  result: AICardResult | null
  isRecommended: boolean
  devMode: boolean
  /** Vote mode visual states */
  selectable?: boolean
  selected?: boolean
  pickNumber?: number
  onSelect?: () => void
}

export function AICard({
  platform,
  result,
  isRecommended,
  devMode,
  selectable,
  selected,
  pickNumber,
  onSelect,
}: AICardProps) {
  const isLoading = !result || result.status === "loading"
  const isError = result?.status === "error" || result?.status === "timeout"
  const scrollRef = useRef<HTMLDivElement>(null)
  const [showScrollIndicator, setShowScrollIndicator] = useState(false)

  // Check for overflow to show scroll indicator
  useEffect(() => {
    const el = scrollRef.current
    if (!el) return

    function check() {
      if (el) {
        setShowScrollIndicator(el.scrollHeight > el.clientHeight + 8)
      }
    }

    check()
    // Re-check when content changes
    const observer = new MutationObserver(check)
    observer.observe(el, { childList: true, subtree: true, characterData: true })
    return () => observer.disconnect()
  }, [result])

  // Hide scroll indicator when user scrolls near bottom
  function handleScroll() {
    const el = scrollRef.current
    if (!el) return
    const nearBottom = el.scrollHeight - el.scrollTop - el.clientHeight < 20
    if (nearBottom) setShowScrollIndicator(false)
  }

  return (
    <div
      onClick={selectable ? onSelect : undefined}
      className={`relative rounded-xl border p-5 transition-all duration-200 ${
        selectable ? "cursor-pointer" : ""
      } ${
        selected
          ? "border-accent-400 bg-accent-50/50 ring-2 ring-accent-200 shadow-md"
          : isError
            ? "border-red-200 bg-red-50/50"
            : "border-warm-200 bg-white hover:border-warm-300 hover:shadow-md hover:shadow-warm-100/50"
      } ${selectable && !selected ? "hover:border-accent-300 hover:bg-accent-50/30" : ""}`}
    >
      {/* Pick number badge */}
      {selected && pickNumber != null && (
        <span className="absolute -top-2.5 -right-2.5 w-7 h-7 rounded-full bg-accent-500 text-white text-xs font-bold flex items-center justify-center shadow-sm z-10">
          {pickNumber}
        </span>
      )}

      {isRecommended && !isLoading && !isError && !selectable && <RecommendationBadge />}

      {/* Header */}
      <div className="flex items-center gap-2 mb-3">
        <div
          className="w-3 h-3 rounded-full flex-shrink-0"
          style={{ backgroundColor: platform.color }}
        />
        <h3 className="font-semibold text-sm text-warm-800">{platform.displayName}</h3>
        <span className="text-xs text-warm-400">{platform.company}</span>
      </div>

      <p className="text-xs text-warm-400 italic mb-3">{platform.tagline}</p>

      {/* Response area with scroll indicator */}
      <div className="relative">
        <div
          ref={scrollRef}
          onScroll={handleScroll}
          className="min-h-[120px] max-h-[300px] overflow-y-auto mb-3"
        >
          {isLoading ? (
            <div className="space-y-2">
              <div className="h-3 bg-warm-100 rounded animate-pulse w-full" />
              <div className="h-3 bg-warm-100 rounded animate-pulse w-5/6" />
              <div className="h-3 bg-warm-100 rounded animate-pulse w-4/6" />
              <div className="h-3 bg-warm-100 rounded animate-pulse w-full" />
              <div className="h-3 bg-warm-100 rounded animate-pulse w-3/6" />
            </div>
          ) : isError ? (
            <p className="text-sm text-red-400">
              Could not reach {platform.displayName} right now.
            </p>
          ) : (
            <p className="text-sm text-warm-600 leading-relaxed whitespace-pre-wrap">
              {result.response}
            </p>
          )}
        </div>

        {/* Scroll indicator fade + arrow */}
        {showScrollIndicator && !isLoading && !isError && (
          <div className="absolute bottom-3 left-0 right-0 pointer-events-none">
            <div className="h-8 bg-gradient-to-t from-white to-transparent" />
            <div className="flex justify-center -mt-1">
              <svg
                width="16"
                height="16"
                viewBox="0 0 16 16"
                className="text-warm-300 animate-bounce"
              >
                <path
                  d="M4 6l4 4 4-4"
                  stroke="currentColor"
                  strokeWidth="2"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between pt-3 border-t border-warm-100">
        {result && !isLoading && !isError && (
          <span className="text-xs text-warm-400 tabular-nums">
            {(result.latencyMs / 1000).toFixed(1)}s
          </span>
        )}
        <a
          href={platform.signupUrl}
          target="_blank"
          rel="noopener noreferrer"
          onClick={(e) => e.stopPropagation()}
          className="inline-flex items-center gap-1 text-xs font-medium text-accent-500 hover:text-accent-700 transition-colors duration-200"
        >
          Try it free
          <ExternalLink size={12} />
        </a>
      </div>

      {/* Developer mode extras */}
      {devMode && result && !isLoading && (
        <div className="mt-3 pt-3 border-t border-warm-100 space-y-1">
          <p className="text-xs text-warm-400">
            <span className="font-medium">Model:</span> {result.model}
          </p>
          <p className="text-xs text-warm-400">
            <span className="font-medium">Tokens:</span> {result.tokensUsed}
          </p>
          <p className="text-xs text-warm-400">
            <span className="font-medium">Latency:</span> {result.latencyMs}ms
          </p>
          <a
            href={platform.pricingUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="text-xs text-accent-500 hover:underline"
          >
            View pricing
          </a>
        </div>
      )}
    </div>
  )
}
