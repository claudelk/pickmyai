"use client"

import { useSearchParams } from "next/navigation"
import { Suspense } from "react"
import { ArrowRight, ChevronRight } from "lucide-react"

const GLASS_MASK = "linear-gradient(to bottom, rgba(0,0,0,0.02) 0%, rgba(0,0,0,0.04) 15%, rgba(0,0,0,0.07) 30%, rgba(0,0,0,0.12) 45%, rgba(0,0,0,0.2) 55%, rgba(0,0,0,0.32) 65%, rgba(0,0,0,0.5) 75%, rgba(0,0,0,0.7) 85%, rgba(0,0,0,0.88) 93%, rgba(0,0,0,1) 100%)"
const GLASS_MASK_STYLE = { maskImage: GLASS_MASK, WebkitMaskImage: GLASS_MASK } as React.CSSProperties

interface EntryGateProps {
  onSelectPath: (path: "a" | "b") => void
}

export function EntryGate(props: EntryGateProps) {
  return (
    <Suspense>
      <EntryGateInner {...props} />
    </Suspense>
  )
}

function EntryGateInner({ onSelectPath }: EntryGateProps) {
  const searchParams = useSearchParams()
  const tilesVariant = (searchParams.get("tiles") as "1" | "2" | "3") || "1"

  const steps = [
    { n: "1", label: "Choose your speed", short: "Choose speed" },
    { n: "2", label: "Pick categories", short: "Categories" },
    { n: "3", label: "Compare & vote", short: "Compare" },
  ]

  return (
    <div className="relative z-10 flex flex-col items-center justify-between px-6 pt-12 sm:pt-16 pb-10 sm:pb-14 min-h-[calc(100vh-64px)]">
        {/* Top: Headline + how it works */}
        <div className="w-full flex flex-col items-center">
          <div className="max-w-2xl w-full text-center space-y-4 mb-8 sm:mb-10">
            <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-white leading-tight drop-shadow-lg">
              Unsure which AI subscription is right for you?
            </h1>
            <p className="text-base sm:text-lg text-white/80 drop-shadow-md">
              Compare their free versions all at once. No account needed.
            </p>
          </div>

          {/* How it works — steps 1-3 as process, step 4 as outcome */}
          <div className="max-w-3xl w-full mb-8 sm:mb-12">
            {/* Desktop */}
            <div className="hidden sm:flex items-center justify-center gap-0">
              {steps.map((step, i) => (
                <div key={step.n} className="flex items-center">
                  {i > 0 && <div className="w-6 h-px bg-white/25 mx-1" />}
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center flex-shrink-0">
                      <span className="text-xs font-bold text-white">{step.n}</span>
                    </div>
                    <span className="text-sm text-white/70">{step.label}</span>
                  </div>
                </div>
              ))}
              {/* Step 4 — outcome, visually distinct */}
              <div className="flex items-center ml-2">
                <ChevronRight size={16} className="text-accent-400 mx-1" />
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-accent-500/20 border border-accent-400/30">
                  <span className="text-sm font-medium text-accent-300">Your best match</span>
                </div>
              </div>
            </div>
            {/* Mobile */}
            <div className="flex sm:hidden items-center justify-center gap-0 flex-wrap">
              {steps.map((step, i) => (
                <div key={step.n} className="flex items-center">
                  {i > 0 && <div className="w-3 h-px bg-white/25 mx-0.5" />}
                  <div className="flex items-center gap-1">
                    <div className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
                      <span className="text-[9px] font-bold text-white">{step.n}</span>
                    </div>
                    <span className="text-[11px] text-white/60">{step.short}</span>
                  </div>
                </div>
              ))}
              <div className="flex items-center ml-1">
                <ChevronRight size={12} className="text-accent-400 mx-0.5" />
                <span className="text-[11px] font-medium text-accent-300">Best match</span>
              </div>
            </div>
          </div>
        </div>

        {/* ─── Tile variants ─── */}

        {tilesVariant === "1" && <TilesV1 onSelectPath={onSelectPath} />}
        {tilesVariant === "2" && <TilesV2 onSelectPath={onSelectPath} />}
        {tilesVariant === "3" && <TilesV3 onSelectPath={onSelectPath} />}
    </div>
  )
}

/* ━━━ V1: Parallelogram tiles with diagonal gap between them ━━━ */
function TilesV1({ onSelectPath }: { onSelectPath: (p: "a" | "b") => void }) {
  // skewX(-3deg) gives a subtle parallelogram shape; content is un-skewed inside
  const skewAngle = -3

  return (
    <div className="w-full max-w-5xl flex-1 flex flex-col sm:flex-row gap-3 sm:gap-4 min-h-[280px] sm:min-h-[380px]">
      {/* Left tile — parallelogram */}
      <button
        onClick={() => onSelectPath("a")}
        className="group relative flex-1 overflow-hidden transition-all duration-300 hover:shadow-2xl focus:outline-none focus:ring-2 focus:ring-accent-400"
        style={{
          transform: `skewX(${skewAngle}deg)`,
          borderRadius: "1.25rem",
        }}
      >
        {/* Glass + border layer with gradient mask */}
        <div
          className="absolute inset-0 bg-white/[0.1] backdrop-blur-xl border border-white/15 transition-colors duration-300 group-hover:bg-white/[0.18] group-hover:border-white/30"
          style={{ borderRadius: "1.25rem", ...GLASS_MASK_STYLE }}
        />
        <div
          className="relative h-full flex flex-col justify-end p-8 sm:p-10 lg:p-12 text-left"
          style={{ transform: `skewX(${-skewAngle}deg)` }}
        >
          <p className="text-xs font-semibold text-white/35 uppercase tracking-[0.2em] mb-4">Fast track</p>
          <div className="space-y-3">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white tracking-tight">
              Quick compare
            </h2>
            <p className="text-base sm:text-lg text-white/50 leading-relaxed max-w-sm">
              Six AIs, one prompt, your pick. Done in minutes.
            </p>
            <div className="flex items-center gap-2 text-base font-medium text-accent-300 transition-all duration-300 group-hover:text-accent-200 group-hover:gap-4 pt-2">
              Get started
              <ArrowRight size={18} className="transition-transform duration-300 group-hover:translate-x-1" />
            </div>
          </div>
        </div>
      </button>

      {/* Right tile — parallelogram (same skew, so they're parallel) */}
      <button
        onClick={() => onSelectPath("b")}
        className="group relative flex-1 overflow-hidden transition-all duration-300 hover:shadow-2xl focus:outline-none focus:ring-2 focus:ring-accent-400"
        style={{
          transform: `skewX(${skewAngle}deg)`,
          borderRadius: "1.25rem",
        }}
      >
        {/* Glass + border layer with gradient mask */}
        <div
          className="absolute inset-0 bg-white/[0.1] backdrop-blur-xl border border-white/15 transition-colors duration-300 group-hover:bg-white/[0.18] group-hover:border-white/30"
          style={{ borderRadius: "1.25rem", ...GLASS_MASK_STYLE }}
        />
        <div
          className="relative h-full flex flex-col justify-end p-8 sm:p-10 lg:p-12 text-left"
          style={{ transform: `skewX(${-skewAngle}deg)` }}
        >
          <p className="text-xs font-semibold text-white/35 uppercase tracking-[0.2em] mb-4">Thorough</p>
          <div className="space-y-3">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white tracking-tight">
              Deep dive
            </h2>
            <p className="text-base sm:text-lg text-white/50 leading-relaxed max-w-sm">
              Same prompt, more chances to compare. Worth it if you&apos;re undecided.
            </p>
            <div className="flex items-center gap-2 text-base font-medium text-accent-300 transition-all duration-300 group-hover:text-accent-200 group-hover:gap-4 pt-2">
              Let&apos;s go
              <ArrowRight size={18} className="transition-transform duration-300 group-hover:translate-x-1" />
            </div>
          </div>
        </div>
      </button>
    </div>
  )
}

/* ━━━ V2: "OR" separator — one joined unit split down the middle ━━━ */
function TilesV2({ onSelectPath }: { onSelectPath: (p: "a" | "b") => void }) {
  return (
    <div className="w-full max-w-5xl flex-1 relative rounded-3xl overflow-hidden">
      {/* Glass + border layer with gradient mask */}
      <div
        className="absolute inset-0 bg-white/[0.08] backdrop-blur-xl border border-white/15 rounded-3xl"
        style={GLASS_MASK_STYLE}
      />
      <div className="absolute inset-0 flex flex-col sm:flex-row">
        {/* Left tile */}
        <button
          onClick={() => onSelectPath("a")}
          className="group relative flex-1 text-left overflow-hidden transition-all duration-300 hover:bg-white/[0.08] focus:outline-none"
        >
          <div className="relative h-full flex flex-col justify-end p-8 sm:p-12 lg:p-14">
            <p className="text-sm font-medium text-white/40 uppercase tracking-widest mb-4">Option A</p>
            <div className="space-y-3">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white tracking-tight">
                Quick compare
              </h2>
              <p className="text-base sm:text-lg text-white/55 leading-relaxed max-w-sm">
                Six AIs, one prompt, your pick. Done in minutes.
              </p>
              <div className="flex items-center gap-2 text-base font-medium text-accent-300 transition-all duration-300 group-hover:text-accent-200 group-hover:gap-4 pt-2">
                Get started
                <ArrowRight size={18} className="transition-transform duration-300 group-hover:translate-x-1" />
              </div>
            </div>
          </div>
        </button>

        {/* Divider line */}
        <div
          className="h-px sm:h-auto sm:w-px bg-white/15 flex-shrink-0"
          style={GLASS_MASK_STYLE}
        />

        {/* Right tile */}
        <button
          onClick={() => onSelectPath("b")}
          className="group relative flex-1 text-left overflow-hidden transition-all duration-300 hover:bg-white/[0.06] focus:outline-none"
        >
          <div className="relative h-full flex flex-col justify-end p-8 sm:p-12 lg:p-14">
            <p className="text-sm font-medium text-white/40 uppercase tracking-widest mb-4">Option B</p>
            <div className="space-y-3">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white tracking-tight">
                Deep dive
              </h2>
              <p className="text-base sm:text-lg text-white/55 leading-relaxed max-w-sm">
                Same prompt, more chances to compare. Worth it if you&apos;re undecided.
              </p>
              <div className="flex items-center gap-2 text-base font-medium text-accent-300 transition-all duration-300 group-hover:text-accent-200 group-hover:gap-4 pt-2">
                Let&apos;s go
                <ArrowRight size={18} className="transition-transform duration-300 group-hover:translate-x-1" />
              </div>
            </div>
          </div>
        </button>
      </div>

      {/* "or" badge — centered horizontally, aligned with content zone */}
      <div className="absolute left-1/2 bottom-[45%] -translate-x-1/2 translate-y-1/2 z-20 pointer-events-none">
        <div className="w-14 h-14 rounded-full bg-black/40 backdrop-blur-xl border border-white/25 flex items-center justify-center shadow-2xl">
          <span className="text-sm font-semibold text-white/80 uppercase tracking-wide">or</span>
        </div>
      </div>
    </div>
  )
}

/* ━━━ V3: Full-bleed halves — each side tinted, no card borders ━━━ */
function TilesV3({ onSelectPath }: { onSelectPath: (p: "a" | "b") => void }) {
  return (
    <div className="w-full flex-1 min-h-[340px] sm:min-h-[380px] -mx-6 relative">
      <div className="absolute inset-0 flex flex-col sm:flex-row">
        {/* Left half — warm tint */}
        <button
          onClick={() => onSelectPath("a")}
          className="group relative flex-1 text-left overflow-hidden transition-all duration-500 focus:outline-none"
        >
          <div
            className="absolute inset-0 bg-gradient-to-r from-amber-900/30 to-transparent transition-opacity duration-500 group-hover:from-amber-900/45"
            style={GLASS_MASK_STYLE}
          />
          <div className="relative h-full flex flex-col justify-end p-8 sm:p-14 lg:p-20">
            <div className="space-y-3 max-w-md">
              <p className="text-xs font-semibold text-white/40 uppercase tracking-[0.2em] mb-1">Fast track</p>
              <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white tracking-tight leading-none">
                Quick compare
              </h2>
              <p className="text-base sm:text-lg text-white/50 leading-relaxed">
                Six AIs, one prompt, your pick. Done in minutes.
              </p>
              <div className="flex items-center gap-2 text-base font-medium text-white/80 transition-all duration-300 group-hover:text-white group-hover:gap-4 pt-3">
                Get started
                <ArrowRight size={18} className="transition-transform duration-300 group-hover:translate-x-1" />
              </div>
            </div>
          </div>
        </button>

        {/* Center divider */}
        <div className="hidden sm:flex items-center justify-center w-px relative z-10">
          <div className="absolute inset-0 bg-white/20" style={GLASS_MASK_STYLE} />
          <div className="relative w-12 h-12 rounded-full bg-black/40 backdrop-blur-xl border border-white/20 flex items-center justify-center">
            <span className="text-xs font-semibold text-white/70 uppercase">or</span>
          </div>
        </div>
        {/* Mobile divider */}
        <div className="flex sm:hidden items-center justify-center h-px relative z-10">
          <div className="absolute inset-0 bg-white/20" style={GLASS_MASK_STYLE} />
          <div className="relative w-10 h-10 rounded-full bg-black/40 backdrop-blur-xl border border-white/20 flex items-center justify-center">
            <span className="text-xs font-semibold text-white/70 uppercase">or</span>
          </div>
        </div>

        {/* Right half — cool tint */}
        <button
          onClick={() => onSelectPath("b")}
          className="group relative flex-1 text-left overflow-hidden transition-all duration-500 focus:outline-none"
        >
          <div
            className="absolute inset-0 bg-gradient-to-l from-blue-900/30 to-transparent transition-opacity duration-500 group-hover:from-blue-900/45"
            style={GLASS_MASK_STYLE}
          />
          <div className="relative h-full flex flex-col justify-end p-8 sm:p-14 lg:p-20">
            <div className="space-y-3 max-w-md">
              <p className="text-xs font-semibold text-white/40 uppercase tracking-[0.2em] mb-1">Thorough</p>
              <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white tracking-tight leading-none">
                Deep dive
              </h2>
              <p className="text-base sm:text-lg text-white/50 leading-relaxed">
                Same prompt, more chances to compare. Worth it if you&apos;re undecided.
              </p>
              <div className="flex items-center gap-2 text-base font-medium text-white/80 transition-all duration-300 group-hover:text-white group-hover:gap-4 pt-3">
                Let&apos;s go
                <ArrowRight size={18} className="transition-transform duration-300 group-hover:translate-x-1" />
              </div>
            </div>
          </div>
        </button>
      </div>
    </div>
  )
}
