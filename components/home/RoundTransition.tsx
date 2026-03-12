"use client"

import { useEffect, useState } from "react"
import { getRoundConfig } from "@/lib/tournament"
import type { RoundNumber } from "@/lib/tournament"

interface RoundTransitionProps {
  completedRound: RoundNumber
  onComplete: () => void
}

export function RoundTransition({ completedRound, onComplete }: RoundTransitionProps) {
  const [visible, setVisible] = useState(true)
  const nextRound = (completedRound + 1) as RoundNumber
  const nextConfig = getRoundConfig(nextRound)

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false)
      setTimeout(onComplete, 300)
    }, 2000)
    return () => clearTimeout(timer)
  }, [onComplete])

  return (
    <div
      className={`flex flex-col items-center justify-center min-h-[calc(100vh-64px)] px-6 transition-opacity duration-300 ${
        visible ? "opacity-100" : "opacity-0"
      }`}
    >
      <div className="text-center space-y-4">
        <div className="w-12 h-12 mx-auto rounded-full bg-accent-100 flex items-center justify-center mb-2">
          <span className="text-lg font-bold text-accent-600">✓</span>
        </div>
        <h2 className="font-serif text-2xl font-bold text-warm-800">
          Round {completedRound} complete
        </h2>
        <p className="text-warm-500">
          Moving to <span className="font-medium text-warm-700">{nextConfig.category}</span>...
        </p>
        <div className="flex gap-2 justify-center mt-4">
          {[1, 2, 3].map((r) => (
            <div
              key={r}
              className={`w-3 h-3 rounded-full ${
                r <= completedRound ? "bg-accent-500" : "bg-warm-200"
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
