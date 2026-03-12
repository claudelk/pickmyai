"use client"

import { Suspense, useState, useCallback } from "react"
import { useSearchParams } from "next/navigation"
import { EntryGate } from "@/components/home/EntryGate"
import { GuidedOnboarding } from "@/components/home/GuidedOnboarding"
import { PromptInput } from "@/components/home/PromptInput"
import { ResultsGrid } from "@/components/home/ResultsGrid"
import { RateLimitBanner } from "@/components/ui/RateLimitBanner"
import { getRecommendedPlatform } from "@/lib/recommend"
import type { AICardResult } from "@/components/home/AICard"
import type { UseCaseTag } from "@/lib/constants"
import { EXAMPLE_PROMPTS } from "@/lib/constants"

export default function Home() {
  return (
    <Suspense>
      <HomeContent />
    </Suspense>
  )
}

type Stage = "gate" | "onboarding" | "prompt" | "results"

function HomeContent() {
  const searchParams = useSearchParams()
  const urlPrompt = searchParams.get("prompt") ?? ""

  const [stage, setStage] = useState<Stage>(urlPrompt ? "prompt" : "gate")
  const [useCaseTag, setUseCaseTag] = useState<UseCaseTag | undefined>()
  const [results, setResults] = useState<Record<string, AICardResult>>({})
  const [isLoading, setIsLoading] = useState(false)
  const [rateLimited, setRateLimited] = useState(false)
  const [suggestedPrompt, setSuggestedPrompt] = useState(urlPrompt)

  const handlePathSelect = useCallback((path: "a" | "b") => {
    if (path === "a") {
      setStage("prompt")
    } else {
      setStage("onboarding")
    }
  }, [])

  const handleOnboardingComplete = useCallback((tag: UseCaseTag, freeText: string) => {
    setUseCaseTag(tag)
    const basePrompt = EXAMPLE_PROMPTS[tag] ?? ""
    const suggestion = freeText ? freeText : basePrompt
    setSuggestedPrompt(suggestion)
    setStage("prompt")
  }, [])

  const handleCompare = useCallback(async (prompt: string) => {
    setIsLoading(true)
    setRateLimited(false)
    setStage("results")

    const platforms = ["chatgpt", "claude", "gemini", "mistral", "grok", "meta"]
    const loadingResults: Record<string, AICardResult> = {}
    for (const p of platforms) {
      loadingResults[p] = {
        platform: p,
        status: "loading",
        response: "",
        latencyMs: 0,
        model: "",
        tokensUsed: 0,
      }
    }
    setResults(loadingResults)

    try {
      const response = await fetch("/api/compare", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt, useCaseTag }),
      })

      if (response.status === 429) {
        setRateLimited(true)
        setResults({})
        setIsLoading(false)
        return
      }

      // Read SSE stream, updating cards as each platform responds
      const reader = response.body?.getReader()
      const decoder = new TextDecoder()

      if (reader) {
        let buffer = ""
        let receivedCount = 0

        while (true) {
          const { done, value } = await reader.read()
          if (done) break

          buffer += decoder.decode(value, { stream: true })
          const lines = buffer.split("\n\n")
          buffer = lines.pop() ?? ""

          for (const line of lines) {
            const data = line.replace(/^data: /, "").trim()
            if (!data || data === "[DONE]") continue

            try {
              const result: AICardResult = JSON.parse(data)
              receivedCount++
              setResults((prev) => ({ ...prev, [result.platform]: result }))
            } catch {
              // Skip malformed events
            }
          }
        }

        if (receivedCount === 0) {
          throw new Error("No results received")
        }
      }
    } catch {
      const errorResults: Record<string, AICardResult> = {}
      for (const p of platforms) {
        errorResults[p] = {
          platform: p,
          status: "error",
          response: "",
          latencyMs: 0,
          model: "",
          tokensUsed: 0,
          errorMessage: "Network error",
        }
      }
      setResults(errorResults)
    }

    setIsLoading(false)
  }, [useCaseTag])

  const recommendedPlatform = getRecommendedPlatform(useCaseTag)

  return (
    <div className="min-h-screen">
      {stage === "gate" && <EntryGate onSelectPath={handlePathSelect} />}

      {stage === "onboarding" && (
        <GuidedOnboarding
          onComplete={handleOnboardingComplete}
          onBack={() => setStage("gate")}
        />
      )}

      {stage === "prompt" && (
        <div className="flex flex-col items-center justify-center min-h-[calc(100vh-64px)] px-6">
          <PromptInput
            key={suggestedPrompt}
            onSubmit={handleCompare}
            initialPrompt={suggestedPrompt}
            isLoading={isLoading}
          />
        </div>
      )}

      {stage === "results" && (
        <>
          {rateLimited ? (
            <div className="flex items-center justify-center min-h-[calc(100vh-64px)] px-6">
              <RateLimitBanner />
            </div>
          ) : (
            <ResultsGrid
              results={results}
              recommendedPlatform={recommendedPlatform}
              onNewPrompt={handleCompare}
              isLoading={isLoading}
            />
          )}
        </>
      )}
    </div>
  )
}
