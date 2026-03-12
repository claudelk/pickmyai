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
    <div className="rounded-lg border border-slate-200 overflow-hidden" style={{ boxShadow: "0 1px 2px 0 rgb(0 0 0 / 0.05)" }}>
      <button
        onClick={() => setManualToggle(!expanded)}
        className="w-full flex items-center justify-between p-5 text-left hover:bg-slate-50 transition-colors duration-200 focus:ring-2 focus:ring-blue-500 focus:ring-inset"
        aria-expanded={expanded}
      >
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h3 className="font-semibold text-base text-slate-900">{benchmark.title}</h3>
            <span className="text-xs text-slate-400 font-mono">{benchmark.fullName}</span>
          </div>
          <p className="text-sm text-slate-500">{benchmark.tagline}</p>
        </div>
        {expanded ? (
          <ChevronUp size={20} className="text-slate-400 flex-shrink-0" />
        ) : (
          <ChevronDown size={20} className="text-slate-400 flex-shrink-0" />
        )}
      </button>

      {expanded && (
        <div className="px-5 pb-5 space-y-4 border-t border-slate-100 pt-4">
          <div className="space-y-1">
            <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">What it tests</p>
            <p className="text-sm text-slate-700">{content.whatItTests}</p>
          </div>
          <div className="space-y-1">
            <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">In plain English</p>
            <p className="text-sm text-slate-700">{content.plainEnglish}</p>
          </div>
          <div className="space-y-1">
            <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Real example</p>
            <p className="text-sm text-slate-700 italic">{content.realExample}</p>
          </div>
          <NudgeButton text={benchmark.nudgeLabel} promptPreFill={benchmark.nudgePrompt} />
        </div>
      )}
    </div>
  )
}
