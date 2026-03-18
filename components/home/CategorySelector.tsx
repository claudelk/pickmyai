"use client"

import { Suspense, useState, useCallback } from "react"
import { useSearchParams } from "next/navigation"
import Image from "next/image"
import { Check, Lock, Lightbulb, ArrowRight } from "lucide-react"
import { CATEGORIES, BEGINNER_PRESET_IDS } from "@/lib/categories"
import type { CategoryConfig } from "@/lib/categories"

interface CategorySelectorProps {
  onConfirm: (categories: CategoryConfig[]) => void
  mode: "fast" | "deep"
}

export function CategorySelector(props: CategorySelectorProps) {
  return (
    <Suspense>
      <CategorySelectorInner {...props} />
    </Suspense>
  )
}

function CategorySelectorInner({ onConfirm, mode }: CategorySelectorProps) {
  const searchParams = useSearchParams()
  const layoutVariant = (searchParams.get("layout") as "1" | "2") || "1"
  const [selectedIds, setSelectedIds] = useState<string[]>([])

  const availableCategories = CATEGORIES.filter((c) => c.status === "available")
  const comingSoonCategories = CATEGORIES.filter((c) => c.status === "coming_soon")

  const toggleCategory = useCallback((id: string) => {
    setSelectedIds((prev) => {
      if (prev.includes(id)) return prev.filter((s) => s !== id)
      if (prev.length >= 5) return prev
      return [...prev, id]
    })
  }, [])

  const applyPreset = useCallback(() => {
    setSelectedIds([...BEGINNER_PRESET_IDS])
  }, [])

  const handleConfirm = useCallback(() => {
    const selected = CATEGORIES.filter((c) => selectedIds.includes(c.id))
    onConfirm(selected)
  }, [selectedIds, onConfirm])

  if (layoutVariant === "2") {
    return (
      <LayoutV2
        availableCategories={availableCategories}
        comingSoonCategories={comingSoonCategories}
        selectedIds={selectedIds}
        toggleCategory={toggleCategory}
        applyPreset={applyPreset}
        handleConfirm={handleConfirm}
        mode={mode}
      />
    )
  }

  return (
    <LayoutV1
      availableCategories={availableCategories}
      comingSoonCategories={comingSoonCategories}
      selectedIds={selectedIds}
      toggleCategory={toggleCategory}
      applyPreset={applyPreset}
      handleConfirm={handleConfirm}
      mode={mode}
    />
  )
}

/* ━━━ Shared types ━━━ */
interface LayoutProps {
  availableCategories: CategoryConfig[]
  comingSoonCategories: CategoryConfig[]
  selectedIds: string[]
  toggleCategory: (id: string) => void
  applyPreset: () => void
  handleConfirm: () => void
  mode: "fast" | "deep"
}

/* ━━━ V1: Original stacked layout (tiles above, actions below) ━━━ */
function LayoutV1({ availableCategories, comingSoonCategories, selectedIds, toggleCategory, applyPreset, handleConfirm, mode }: LayoutProps) {
  return (
    <div className="relative z-10 flex flex-col items-center px-6 pt-12 sm:pt-16 pb-12 sm:pb-16 min-h-[calc(100vh-64px)]">
        {/* Header */}
        <div className="max-w-3xl w-full text-center space-y-3 mb-12">
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-white drop-shadow-lg">
            What matters to you?
          </h1>
          <p className="text-lg text-white/70">
            Pick 2–5 categories to test.{" "}
            {mode === "deep"
              ? "Each category gets 3 voting rounds for a thorough comparison."
              : "One round per category for a quick comparison."}
          </p>
        </div>

        {/* Available Categories — large 2-column grid */}
        <div className="max-w-5xl w-full grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
          {availableCategories.map((cat) => {
            const isSelected = selectedIds.includes(cat.id)

            return (
              <button
                key={cat.id}
                onClick={() => toggleCategory(cat.id)}
                className={`relative group rounded-2xl border-2 text-left transition-all duration-300 overflow-hidden aspect-[16/10] ${
                  isSelected
                    ? "border-accent-400 shadow-xl shadow-accent-100/50 -translate-y-1 ring-2 ring-accent-300"
                    : "border-transparent shadow-md hover:shadow-xl hover:-translate-y-1"
                }`}
              >
                <Image
                  src={cat.image}
                  alt={cat.name}
                  fill
                  className={`object-cover transition-all duration-500 ${
                    isSelected
                      ? "scale-105 brightness-90"
                      : "group-hover:scale-105 brightness-[0.85] group-hover:brightness-75"
                  }`}
                  sizes="(max-width: 640px) 100vw, 50vw"
                />

                <div className={`absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent transition-opacity duration-300 ${
                  isSelected ? "opacity-90" : "opacity-80 group-hover:opacity-90"
                }`} />

                {isSelected && (
                  <div className="absolute top-4 right-4 w-10 h-10 rounded-full bg-accent-500 shadow-lg flex items-center justify-center z-10 animate-in zoom-in duration-200">
                    <Check size={22} className="text-white" strokeWidth={3} />
                  </div>
                )}

                {isSelected && (
                  <div className="absolute top-4 left-4 px-3 py-1 rounded-full bg-white/90 backdrop-blur-sm shadow-sm z-10">
                    <span className="text-xs font-bold text-accent-600">
                      #{selectedIds.indexOf(cat.id) + 1}
                    </span>
                  </div>
                )}

                <div className="absolute bottom-0 left-0 right-0 p-6 z-10">
                  <h3 className="text-xl sm:text-2xl font-bold text-white mb-1.5 drop-shadow-md">
                    {cat.name}
                  </h3>
                  <p className="text-sm text-white/80 leading-relaxed drop-shadow-sm">
                    {cat.criteria.map((c) => c.label).join("  ·  ")}
                  </p>
                </div>
              </button>
            )
          })}
        </div>

        {/* Coming Soon */}
        <div className="max-w-5xl w-full grid grid-cols-2 sm:grid-cols-3 gap-4 mb-10">
          {comingSoonCategories.map((cat) => (
            <div
              key={cat.id}
              className="relative rounded-xl overflow-hidden aspect-[16/9] cursor-not-allowed"
            >
              {cat.image ? (
                <Image
                  src={cat.image}
                  alt={cat.name}
                  fill
                  className="object-cover grayscale brightness-50"
                  sizes="33vw"
                />
              ) : (
                <div className={`absolute inset-0 bg-gradient-to-br ${cat.gradient}`} />
              )}

              <div className="absolute inset-0 bg-black/50" />

              <div className="absolute inset-0 flex flex-col items-center justify-center z-10">
                <Lock size={18} className="text-white/50 mb-2" />
                <p className="text-sm font-semibold text-white/70">{cat.name}</p>
                <p className="text-xs text-white/40 mt-0.5">Coming soon</p>
              </div>
            </div>
          ))}
        </div>

        {/* Not sure? Preset button */}
        <button
          onClick={applyPreset}
          className="flex items-center gap-2 text-sm text-white/50 hover:text-accent-300 transition-colors duration-200 mb-8 py-3"
        >
          <Lightbulb size={16} />
          Not sure? Start with our picks
        </button>

        {/* Confirm button */}
        <button
          onClick={handleConfirm}
          disabled={selectedIds.length < 2}
          className={`px-10 py-3.5 rounded-xl text-sm font-medium transition-all duration-300 ${
            selectedIds.length >= 2
              ? "bg-accent-500 text-white hover:bg-accent-600 shadow-lg shadow-accent-200/50"
              : "bg-white/10 text-white/40 cursor-not-allowed border border-white/10"
          }`}
        >
          {selectedIds.length < 2
            ? `Select at least ${2 - selectedIds.length} more`
            : `Start Tournament · ${selectedIds.length} ${selectedIds.length === 1 ? "category" : "categories"} selected`}
        </button>
    </div>
  )
}

/* ━━━ V2: Side-panel layout — compact tiles left, actions right with divider ━━━ */
function LayoutV2({ availableCategories, comingSoonCategories, selectedIds, toggleCategory, applyPreset, handleConfirm, mode }: LayoutProps) {
  const maxSelectable = availableCategories.length

  return (
    <div className="relative z-10 flex flex-col px-6 min-h-[calc(100vh-64px)]">
      {/* Header */}
      <div className="max-w-6xl w-full mx-auto text-center space-y-2 pt-8 sm:pt-10 pb-6">
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-white drop-shadow-lg">
          What matters to you?
        </h1>
        <p className="text-base sm:text-lg text-white/70">
          Pick 2–{Math.min(5, maxSelectable)} categories to test.{" "}
          {mode === "deep"
            ? "Each category gets 3 voting rounds for a thorough comparison."
            : "One round per category for a quick comparison."}
        </p>
      </div>

      {/* Main content: vertically centered in remaining space */}
      <div className="flex-1 flex flex-col items-center justify-center pb-6">
        {/* Tiles + divider + START row */}
        <div className="max-w-6xl w-full flex flex-col lg:flex-row">
          {/* Left — Category tiles */}
          <div className="flex-1 min-w-0 lg:pr-8">
            {/* Available — 2×2 grid */}
            <div className="grid grid-cols-2 gap-3 mb-3">
              {availableCategories.map((cat) => {
                const isSelected = selectedIds.includes(cat.id)

                return (
                  <button
                    key={cat.id}
                    onClick={() => toggleCategory(cat.id)}
                    className={`relative group rounded-xl border-2 text-left transition-all duration-300 overflow-hidden aspect-[16/10] ${
                      isSelected
                        ? "border-accent-400 shadow-xl shadow-accent-100/30 ring-2 ring-accent-300"
                        : "border-transparent shadow-md hover:shadow-lg hover:-translate-y-0.5"
                    }`}
                  >
                    <Image
                      src={cat.image}
                      alt={cat.name}
                      fill
                      className={`object-cover transition-all duration-500 ${
                        isSelected
                          ? "scale-105 brightness-90"
                          : "group-hover:scale-105 brightness-[0.85] group-hover:brightness-75"
                      }`}
                      sizes="(max-width: 1024px) 50vw, 33vw"
                    />

                    <div className={`absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent transition-opacity duration-300 ${
                      isSelected ? "opacity-90" : "opacity-80 group-hover:opacity-90"
                    }`} />

                    {isSelected && (
                      <div className="absolute top-3 right-3 w-8 h-8 rounded-full bg-accent-500 shadow-lg flex items-center justify-center z-10 animate-in zoom-in duration-200">
                        <Check size={16} className="text-white" strokeWidth={3} />
                      </div>
                    )}

                    {isSelected && (
                      <div className="absolute top-3 left-3 px-2 py-0.5 rounded-full bg-white/90 backdrop-blur-sm shadow-sm z-10">
                        <span className="text-[10px] font-bold text-accent-600">
                          #{selectedIds.indexOf(cat.id) + 1}
                        </span>
                      </div>
                    )}

                    <div className="absolute bottom-0 left-0 right-0 p-4 z-10">
                      <h3 className="text-base sm:text-lg font-bold text-white mb-0.5 drop-shadow-md">
                        {cat.name}
                      </h3>
                      <p className="text-xs text-white/70 leading-relaxed drop-shadow-sm line-clamp-1">
                        {cat.criteria.map((c) => c.label).join("  ·  ")}
                      </p>
                    </div>
                  </button>
                )
              })}
            </div>

            {/* Coming Soon — small compact row */}
            <div className="grid grid-cols-3 gap-2">
              {comingSoonCategories.map((cat) => (
                <div
                  key={cat.id}
                  className="relative rounded-lg overflow-hidden aspect-[3/1] cursor-not-allowed"
                >
                  {cat.image ? (
                    <Image
                      src={cat.image}
                      alt={cat.name}
                      fill
                      className="object-cover grayscale brightness-50"
                      sizes="20vw"
                    />
                  ) : (
                    <div className={`absolute inset-0 bg-gradient-to-br ${cat.gradient}`} />
                  )}

                  <div className="absolute inset-0 bg-black/50" />

                  <div className="absolute inset-0 flex items-center justify-center gap-2 z-10">
                    <Lock size={11} className="text-white/50" />
                    <p className="text-[11px] font-semibold text-white/60">{cat.name}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Not sure? Preset — centered below categories */}
            <button
              onClick={applyPreset}
              className="w-full flex items-center justify-center gap-2 text-sm text-white/50 hover:text-accent-300 transition-colors duration-200 mt-4 py-2"
            >
              <Lightbulb size={15} />
              Not sure? Start with our picks
            </button>
          </div>

          {/* Vertical divider (desktop) / horizontal divider (mobile) */}
          <div className="hidden lg:block w-px bg-white/20 flex-shrink-0 self-stretch" />
          <div className="lg:hidden h-px bg-white/20 my-8" />

          {/* Right — Action panel, vertically centered */}
          <div className="lg:w-56 flex-shrink-0 lg:pl-8 flex items-center justify-center">
            <div className="flex flex-col items-center gap-5">
              {/* START button */}
              <button
                onClick={handleConfirm}
                disabled={selectedIds.length < 2}
                className={`relative group w-36 h-36 rounded-full flex items-center justify-center transition-all duration-500 ${
                  selectedIds.length >= 2
                    ? "bg-gradient-to-br from-accent-400 via-accent-500 to-accent-700 shadow-[0_0_40px_rgba(59,130,246,0.4)] hover:shadow-[0_0_60px_rgba(59,130,246,0.6)] hover:scale-105 active:scale-95"
                    : "bg-white/10 border border-white/15 cursor-not-allowed"
                }`}
              >
                {selectedIds.length >= 2 && (
                  <div className="absolute inset-0 rounded-full bg-gradient-to-br from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                )}
                <span className={`relative text-lg font-bold tracking-widest uppercase transition-colors duration-300 ${
                  selectedIds.length >= 2
                    ? "text-white"
                    : "text-white/30"
                }`}>
                  {selectedIds.length >= 2 ? "Start" : `${2 - selectedIds.length} more`}
                </span>
              </button>

              {/* Selection count */}
              <p className="text-xs text-white/40">
                {selectedIds.length} of {Math.min(5, maxSelectable)} selected
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}
