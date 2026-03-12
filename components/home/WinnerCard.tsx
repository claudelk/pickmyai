"use client"

import { ExternalLink, RotateCcw } from "lucide-react"
import { PLATFORMS } from "@/lib/constants"
import type { VoteState } from "@/lib/tournament"

interface WinnerCardProps {
  winnerId: string
  voteState: VoteState
  onRestart: () => void
}

export function WinnerCard({ winnerId, voteState, onRestart }: WinnerCardProps) {
  const winner = PLATFORMS.find((p) => p.id === winnerId)
  if (!winner) return null

  // Build vote breakdown for all survivors
  const survivors = voteState.survivors.length > 0 ? voteState.survivors : [winnerId]

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-64px)] px-6 py-12">
      <div className="max-w-lg w-full text-center space-y-8">
        {/* Winner announcement */}
        <div className="space-y-4">
          <p className="text-sm font-medium text-accent-500 uppercase tracking-wider">
            Your best match
          </p>
          <div className="flex items-center justify-center gap-3">
            <div
              className="w-5 h-5 rounded-full"
              style={{ backgroundColor: winner.color }}
            />
            <h1 className="font-serif text-3xl sm:text-4xl font-bold text-warm-800">
              {winner.displayName}
            </h1>
          </div>
          <p className="text-warm-500 italic">{winner.tagline}</p>
        </div>

        {/* Strengths */}
        <div className="space-y-3">
          <p className="text-xs font-medium text-warm-400 uppercase tracking-wider">Known for</p>
          <div className="flex flex-wrap justify-center gap-2">
            {winner.strengths.map((s) => (
              <span
                key={s}
                className="px-3 py-1.5 text-xs font-medium rounded-lg bg-accent-50 text-accent-600 border border-accent-100"
              >
                {s}
              </span>
            ))}
          </div>
        </div>

        {/* Vote breakdown */}
        <div className="rounded-xl border border-warm-200 bg-white p-5 space-y-3">
          <p className="text-xs font-medium text-warm-400 uppercase tracking-wider">
            Tournament results
          </p>
          <div className="space-y-2">
            {survivors
              .sort((a, b) => (voteState.votes[b] ?? 0) - (voteState.votes[a] ?? 0))
              .map((id) => {
                const platform = PLATFORMS.find((p) => p.id === id)
                if (!platform) return null
                const votes = voteState.votes[id] ?? 0
                const isWinner = id === winnerId

                return (
                  <div
                    key={id}
                    className={`flex items-center justify-between px-3 py-2 rounded-lg ${
                      isWinner ? "bg-accent-50" : ""
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <div
                        className="w-2.5 h-2.5 rounded-full"
                        style={{ backgroundColor: platform.color }}
                      />
                      <span className={`text-sm ${isWinner ? "font-medium text-warm-800" : "text-warm-500"}`}>
                        {platform.displayName}
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      {[...Array(3)].map((_, i) => (
                        <div
                          key={i}
                          className={`w-2 h-2 rounded-full ${
                            i < votes ? "bg-accent-500" : "bg-warm-150"
                          }`}
                        />
                      ))}
                      <span className="text-xs text-warm-400 ml-1 tabular-nums">{votes}/3</span>
                    </div>
                  </div>
                )
              })}
          </div>
        </div>

        {/* CTA */}
        <div className="space-y-3">
          <a
            href={winner.signupUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-8 py-3 bg-accent-500 text-white text-sm font-medium rounded-xl hover:bg-accent-600 transition-colors duration-200"
          >
            Try {winner.displayName} free
            <ExternalLink size={14} />
          </a>

          <div>
            <button
              onClick={onRestart}
              className="inline-flex items-center gap-1.5 text-sm text-warm-400 hover:text-warm-600 transition-colors duration-200"
            >
              <RotateCcw size={14} />
              Start a new tournament
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
