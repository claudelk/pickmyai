"use client"

import { TIEBREAKER_QUESTIONS } from "@/lib/tournament"

interface TiebreakerFlowProps {
  answers: Record<string, "a" | "b">
  onAnswer: (questionId: string, answer: "a" | "b") => void
  onComplete: () => void
}

export function TiebreakerFlow({ answers, onAnswer, onComplete }: TiebreakerFlowProps) {
  const allAnswered = TIEBREAKER_QUESTIONS.every((q) => answers[q.id])

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-64px)] px-6 py-12">
      <div className="max-w-lg w-full space-y-8">
        <div className="text-center space-y-3">
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-warm-800">
            It&apos;s a close race!
          </h2>
          <p className="text-sm text-warm-500">
            Answer a few quick preference questions to break the tie.
          </p>
        </div>

        <div className="space-y-6">
          {TIEBREAKER_QUESTIONS.map((q) => (
            <div key={q.id} className="space-y-3">
              <p className="text-sm font-medium text-warm-700">{q.question}</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button
                  onClick={() => onAnswer(q.id, "a")}
                  className={`px-4 py-3 rounded-xl border text-sm text-left transition-all duration-200 ${
                    answers[q.id] === "a"
                      ? "border-accent-400 bg-accent-50 ring-2 ring-accent-200 text-accent-700 font-medium"
                      : "border-warm-200 bg-white hover:border-accent-300 text-warm-600"
                  }`}
                >
                  {q.optionA.label}
                </button>
                <button
                  onClick={() => onAnswer(q.id, "b")}
                  className={`px-4 py-3 rounded-xl border text-sm text-left transition-all duration-200 ${
                    answers[q.id] === "b"
                      ? "border-accent-400 bg-accent-50 ring-2 ring-accent-200 text-accent-700 font-medium"
                      : "border-warm-200 bg-white hover:border-accent-300 text-warm-600"
                  }`}
                >
                  {q.optionB.label}
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center pt-4">
          <button
            onClick={onComplete}
            disabled={!allAnswered}
            className="px-8 py-3 bg-accent-500 text-white text-sm font-medium rounded-xl hover:bg-accent-600 transition-colors duration-200 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Find my best match
          </button>
        </div>
      </div>
    </div>
  )
}
