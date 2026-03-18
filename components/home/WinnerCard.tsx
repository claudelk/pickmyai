"use client"

import { ExternalLink, RotateCcw, Trophy } from "lucide-react"
import { PLATFORMS } from "@/lib/constants"
import { PlatformLogo } from "./PlatformLogo"
import type { VoteState, TournamentMode } from "@/lib/tournament"
import { getTotalVotingRounds } from "@/lib/tournament"
import type { CategoryConfig } from "@/lib/categories"

interface WinnerCardProps {
  winnerId: string
  voteState: VoteState
  mode: TournamentMode
  selectedCategories: CategoryConfig[]
  onRestart: () => void
}

export function WinnerCard({ winnerId, voteState, mode, selectedCategories, onRestart }: WinnerCardProps) {
  const winner = PLATFORMS.find((p) => p.id === winnerId)
  if (!winner) return null

  const survivors = voteState.survivors.length > 0 ? voteState.survivors : [winnerId]
  const maxVotes = getTotalVotingRounds(mode, selectedCategories.length)

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-64px)] px-6 py-12">
      <div className="max-w-lg w-full text-center space-y-8">
        {/* Winner announcement */}
        <div className="space-y-4">
          <p className="text-sm font-medium text-accent-500 uppercase tracking-wider">
            Your best match
          </p>
          <div className="flex items-center justify-center gap-3">
            <PlatformLogo platformId={winner.id} size={32} />
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

        {/* Per-category breakdown */}
        {selectedCategories.length > 1 && Object.keys(voteState.categoryWinners).length > 0 && (
          <div className="rounded-xl border border-warm-200 bg-white p-5 space-y-3">
            <p className="text-xs font-medium text-warm-400 uppercase tracking-wider">
              Category winners
            </p>
            <div className="space-y-2">
              {selectedCategories.map((cat) => {
                const catWinnerId = voteState.categoryWinners[cat.id]
                const catWinner = PLATFORMS.find((p) => p.id === catWinnerId)
                if (!catWinner) return null

                return (
                  <div key={cat.id} className="flex items-center justify-between px-3 py-2 rounded-lg bg-warm-50">
                    <span className="text-sm text-warm-600">{cat.name}</span>
                    <div className="flex items-center gap-2">
                      <PlatformLogo platformId={catWinner.id} size={14} />
                      <span className={`text-sm font-medium ${catWinnerId === winnerId ? "text-accent-600" : "text-warm-700"}`}>
                        {catWinner.displayName}
                      </span>
                      {catWinnerId === winnerId && <Trophy size={12} className="text-accent-500" />}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}

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
                      <PlatformLogo platformId={platform.id} size={16} />
                      <span className={`text-sm ${isWinner ? "font-medium text-warm-800" : "text-warm-500"}`}>
                        {platform.displayName}
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      {[...Array(maxVotes)].map((_, i) => (
                        <div
                          key={i}
                          className={`w-2 h-2 rounded-full ${
                            i < votes ? "bg-accent-500" : "bg-warm-150"
                          }`}
                        />
                      ))}
                      <span className="text-xs text-warm-400 ml-1 tabular-nums">{votes}/{maxVotes}</span>
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
              className="inline-flex items-center gap-1.5 text-sm text-warm-400 hover:text-warm-600 transition-colors duration-200 min-h-[44px]"
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
