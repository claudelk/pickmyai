"use client"

import { Settings } from "lucide-react"

interface DeveloperModeToggleProps {
  enabled: boolean
  onToggle: () => void
}

export function DeveloperModeToggle({ enabled, onToggle }: DeveloperModeToggleProps) {
  return (
    <button
      onClick={onToggle}
      className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors duration-200 border ${
        enabled
          ? "bg-slate-900 text-white border-slate-900"
          : "bg-white text-slate-500 border-slate-200 hover:border-slate-300"
      }`}
      aria-pressed={enabled}
    >
      <Settings size={14} />
      Developer mode
    </button>
  )
}
