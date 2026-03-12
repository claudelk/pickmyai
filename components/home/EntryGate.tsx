"use client"

import { Lightbulb, Compass, ArrowRight } from "lucide-react"

interface EntryGateProps {
  onSelectPath: (path: "a" | "b") => void
}

export function EntryGate({ onSelectPath }: EntryGateProps) {
  return (
    <div className="flex flex-col items-center min-h-[calc(100vh-64px)] px-6 py-12 sm:py-16">
      {/* Headline */}
      <div className="max-w-2xl w-full text-center space-y-4 mb-12">
        <h1 className="font-serif text-4xl sm:text-5xl font-bold text-warm-800 leading-tight">
          Not sure which AI to use?
        </h1>
        <p className="text-lg text-warm-500">
          Try them all at once. No account needed.
        </p>
      </div>

      {/* How it works — above tiles */}
      <div className="max-w-2xl w-full mb-14">
        <div className="grid grid-cols-3 gap-6 text-center">
          <div className="space-y-2">
            <div className="w-10 h-10 mx-auto rounded-full bg-accent-100 flex items-center justify-center">
              <span className="text-sm font-bold text-accent-600">1</span>
            </div>
            <h3 className="text-sm font-medium text-warm-700">Choose</h3>
            <p className="text-xs text-warm-400 leading-relaxed">Tell us what you need help with.</p>
          </div>
          <div className="space-y-2">
            <div className="w-10 h-10 mx-auto rounded-full bg-accent-100 flex items-center justify-center">
              <span className="text-sm font-bold text-accent-600">2</span>
            </div>
            <h3 className="text-sm font-medium text-warm-700">Three rounds</h3>
            <p className="text-xs text-warm-400 leading-relaxed">Watch six AIs compete across editing, reasoning, and creativity.</p>
          </div>
          <div className="space-y-2">
            <div className="w-10 h-10 mx-auto rounded-full bg-accent-100 flex items-center justify-center">
              <span className="text-sm font-bold text-accent-600">3</span>
            </div>
            <h3 className="text-sm font-medium text-warm-700">Your winner</h3>
            <p className="text-xs text-warm-400 leading-relaxed">Get a personalized recommendation based on your votes.</p>
          </div>
        </div>
      </div>

      {/* Large illustrated tiles */}
      <div className="max-w-3xl w-full grid grid-cols-1 sm:grid-cols-2 gap-6">
        {/* Tile A: I know AI */}
        <button
          onClick={() => onSelectPath("a")}
          className="group relative overflow-hidden rounded-2xl border border-warm-200 bg-white p-8 sm:p-10 text-left transition-all duration-300 hover:border-accent-300 hover:shadow-lg hover:shadow-accent-100/50 hover:-translate-y-1 focus:ring-2 focus:ring-accent-400 focus:outline-none"
        >
          {/* Decorative warm gradient blob */}
          <div className="absolute -top-8 -right-8 w-32 h-32 rounded-full bg-gradient-to-br from-accent-100 to-accent-200/50 transition-transform duration-500 group-hover:scale-125" />

          <div className="relative space-y-5">
            {/* Illustration area */}
            <div className="w-16 h-16 rounded-2xl bg-accent-50 border border-accent-100 flex items-center justify-center transition-colors duration-300 group-hover:bg-accent-100">
              <Lightbulb size={28} className="text-accent-500 transition-colors duration-300 group-hover:text-accent-600" />
            </div>

            <div className="space-y-2">
              <h2 className="text-xl font-semibold text-warm-800 transition-colors duration-300 group-hover:text-accent-700">
                I know AI
              </h2>
              <p className="text-sm text-warm-400 leading-relaxed">
                Jump straight to comparing all six platforms with your own prompt.
              </p>
            </div>

            <div className="flex items-center gap-1.5 text-sm font-medium text-accent-500 transition-all duration-300 group-hover:text-accent-600 group-hover:gap-3">
              Get started
              <ArrowRight size={16} className="transition-transform duration-300 group-hover:translate-x-1" />
            </div>
          </div>
        </button>

        {/* Tile B: I am new to AI */}
        <button
          onClick={() => onSelectPath("b")}
          className="group relative overflow-hidden rounded-2xl border border-warm-200 bg-white p-8 sm:p-10 text-left transition-all duration-300 hover:border-accent-300 hover:shadow-lg hover:shadow-accent-100/50 hover:-translate-y-1 focus:ring-2 focus:ring-accent-400 focus:outline-none"
        >
          {/* Decorative warm gradient blob */}
          <div className="absolute -top-8 -right-8 w-32 h-32 rounded-full bg-gradient-to-br from-warm-100 to-accent-100/50 transition-transform duration-500 group-hover:scale-125" />

          <div className="relative space-y-5">
            {/* Illustration area */}
            <div className="w-16 h-16 rounded-2xl bg-warm-100 border border-warm-200 flex items-center justify-center transition-colors duration-300 group-hover:bg-accent-50">
              <Compass size={28} className="text-warm-500 transition-colors duration-300 group-hover:text-accent-500" />
            </div>

            <div className="space-y-2">
              <h2 className="text-xl font-semibold text-warm-800 transition-colors duration-300 group-hover:text-accent-700">
                I am new to AI
              </h2>
              <p className="text-sm text-warm-400 leading-relaxed">
                Answer three quick questions and we will suggest the best AI for you.
              </p>
            </div>

            <div className="flex items-center gap-1.5 text-sm font-medium text-accent-500 transition-all duration-300 group-hover:text-accent-600 group-hover:gap-3">
              Guide me
              <ArrowRight size={16} className="transition-transform duration-300 group-hover:translate-x-1" />
            </div>
          </div>
        </button>
      </div>
    </div>
  )
}
