"use client"

import type { EvaluationCriterion } from "@/lib/tournament"

interface AssessmentCriteriaProps {
  criteria: EvaluationCriterion[]
  /** Vote instruction text */
  voteInstruction?: string
  /** Confirm button for round 1 */
  confirmButton?: React.ReactNode
}

export function AssessmentCriteria({ criteria, voteInstruction, confirmButton }: AssessmentCriteriaProps) {
  return (
    <div className="w-full max-w-6xl mx-auto mb-5">
      {/* Framework header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="w-1 h-4 rounded-full bg-accent-400" />
          <p className="text-xs font-semibold text-white/70 uppercase tracking-wider">
            Evaluation framework
          </p>
        </div>
        <p className="text-[11px] text-white/30 italic hidden sm:block">
          A guide. Trust your own feel above all
        </p>
      </div>

      {/* Connected criteria pipeline + action */}
      <div className="flex flex-col sm:flex-row items-stretch gap-3">
        {/* Criteria pipeline */}
        <div className="flex-1 grid grid-cols-2 sm:flex sm:items-stretch rounded-xl border border-white/15 bg-white/5 overflow-hidden">
          {criteria.map((c, i) => (
            <div
              key={c.label}
              className={`sm:flex-1 px-4 py-3 flex flex-col justify-center ${
                i < criteria.length - 1 ? "sm:border-r border-white/10" : ""
              } ${i < 2 ? "border-b sm:border-b-0 border-white/10" : ""}`}
            >
              <div className="flex items-center gap-1.5 mb-1">
                <span className="w-5 h-5 rounded-full bg-accent-500/20 text-accent-300 text-[10px] font-bold flex items-center justify-center flex-shrink-0">
                  {i + 1}
                </span>
                <p className="text-xs font-semibold text-white/90">{c.label}</p>
              </div>
              <p className="text-[11px] text-white/40 leading-snug hidden sm:block">{c.description}</p>
            </div>
          ))}
        </div>

        {/* Action area */}
        {(voteInstruction || confirmButton) && (
          <div className="flex flex-row sm:flex-col items-center justify-center gap-2 sm:pl-1">
            {voteInstruction && (
              <p className="text-xs sm:text-[11px] text-white/60 text-center leading-snug sm:max-w-[140px]">
                {voteInstruction}
              </p>
            )}
            {confirmButton}
          </div>
        )}
      </div>

      {/* Mobile discretion note */}
      <p className="text-[11px] text-white/30 italic mt-2 sm:hidden text-center">
        A guide. Trust your own feel above all
      </p>
    </div>
  )
}
