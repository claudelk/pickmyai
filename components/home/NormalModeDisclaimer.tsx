"use client"

import { Info } from "lucide-react"

export function NormalModeDisclaimer() {
  return (
    <div className="w-full max-w-4xl mx-auto mb-6">
      <div className="flex items-start gap-2 px-4 py-3 rounded-lg bg-warm-50 border border-warm-150">
        <Info size={14} className="text-warm-400 mt-0.5 flex-shrink-0" />
        <p className="text-xs text-warm-400 leading-relaxed">
          Comparing standard chat mode — not deep research, deep thinking, code interpreter, or image/video generation.
        </p>
      </div>
    </div>
  )
}
