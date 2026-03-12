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
          ? "bg-warm-800 text-white border-warm-800"
          : "bg-white text-warm-500 border-warm-200 hover:border-warm-300 hover:text-warm-600"
      }`}
      aria-pressed={enabled}
    >
      <Settings size={14} />
      Developer mode
    </button>
  )
}
