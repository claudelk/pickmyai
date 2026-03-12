"use client"

import type { EvaluationCriterion } from "@/lib/tournament"

interface AssessmentCriteriaProps {
  criteria: EvaluationCriterion[]
}

export function AssessmentCriteria({ criteria }: AssessmentCriteriaProps) {
  return (
    <div className="w-full max-w-4xl mx-auto mb-6">
      <p className="text-xs font-medium text-warm-400 uppercase tracking-wider mb-3">
        What to look for
      </p>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {criteria.map((c) => (
          <div
            key={c.label}
            className="rounded-lg border border-warm-150 bg-warm-50/50 p-3"
          >
            <p className="text-sm font-medium text-warm-700">{c.label}</p>
            <p className="text-xs text-warm-400 mt-1">{c.description}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
