"use client"

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
}

export function AICard({ platform, result, isRecommended, devMode }: AICardProps) {
  const isLoading = !result || result.status === "loading"
  const isError = result?.status === "error" || result?.status === "timeout"

  return (
    <div
      className={`relative rounded-xl border p-5 transition-all duration-200 ${
        isError
          ? "border-red-200 bg-red-50/50"
          : "border-warm-200 bg-white hover:border-warm-300 hover:shadow-md hover:shadow-warm-100/50"
      }`}
    >
      {isRecommended && !isLoading && !isError && <RecommendationBadge />}

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

      {/* Response area */}
      <div className="min-h-[120px] max-h-[300px] overflow-y-auto mb-3">
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
            className="text-xs text-accent-500 hover:underline"
          >
            View pricing
          </a>
        </div>
      )}
    </div>
  )
}
