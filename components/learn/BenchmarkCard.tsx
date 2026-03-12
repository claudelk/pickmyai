"use client"

import { useState, useSyncExternalStore } from "react"
import { ChevronDown, ChevronUp } from "lucide-react"
import { NudgeButton } from "./NudgeButton"
import type { BenchmarkData } from "@/lib/constants"

interface BenchmarkCardProps {
  benchmark: BenchmarkData
  mode: "individual" | "business"
}

function subscribeToDesktop(callback: () => void) {
  const mql = window.matchMedia("(min-width: 1024px)")
  mql.addEventListener("change", callback)
  return () => mql.removeEventListener("change", callback)
}

function getIsDesktop() {
  return window.matchMedia("(min-width: 1024px)").matches
}

function getIsDesktopServer() {
  return false
}

export function BenchmarkCard({ benchmark, mode }: BenchmarkCardProps) {
  const isDesktop = useSyncExternalStore(subscribeToDesktop, getIsDesktop, getIsDesktopServer)
  const [manualToggle, setManualToggle] = useState<boolean | null>(null)

  // If user has manually toggled, respect that. Otherwise use viewport default.
  const expanded = manualToggle !== null ? manualToggle : isDesktop
  const content = mode === "individual" ? benchmark.individual : benchmark.business

  return (
    <div className="rounded-xl border border-warm-200 bg-white overflow-hidden hover:border-warm-300 transition-colors duration-200">
      <button
        onClick={() => setManualToggle(!expanded)}
        className="w-full flex items-center justify-between p-5 text-left hover:bg-warm-50 transition-colors duration-200 focus:ring-2 focus:ring-accent-400 focus:ring-inset"
        aria-expanded={expanded}
      >
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h3 className="font-semibold text-base text-warm-800">{benchmark.title}</h3>
            <span className="text-xs text-warm-400 font-mono">{benchmark.fullName}</span>
          </div>
          <p className="text-sm text-warm-500">{benchmark.tagline}</p>
        </div>
        {expanded ? (
          <ChevronUp size={20} className="text-warm-400 flex-shrink-0" />
        ) : (
          <ChevronDown size={20} className="text-warm-400 flex-shrink-0" />
        )}
      </button>

      {expanded && (
        <div className="px-5 pb-5 space-y-4 border-t border-warm-100 pt-4">
          <div className="space-y-1">
            <p className="text-xs font-medium text-warm-500 uppercase tracking-wider">What it tests</p>
            <p className="text-sm text-warm-700">{content.whatItTests}</p>
          </div>
          <div className="space-y-1">
            <p className="text-xs font-medium text-warm-500 uppercase tracking-wider">In plain English</p>
            <p className="text-sm text-warm-700">{content.plainEnglish}</p>
          </div>
          <div className="space-y-1">
            <p className="text-xs font-medium text-warm-500 uppercase tracking-wider">Real example</p>
            <p className="text-sm text-warm-700 italic">{content.realExample}</p>
          </div>
          <NudgeButton text={benchmark.nudgeLabel} promptPreFill={benchmark.nudgePrompt} />
        </div>
      )}
    </div>
  )
}
