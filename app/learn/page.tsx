"use client"

import { useState } from "react"
import { ChapterNav } from "@/components/learn/ChapterNav"
import { UseCaseToggle } from "@/components/learn/UseCaseToggle"
import { Chapter1 } from "@/components/learn/Chapter1"
import { Chapter2 } from "@/components/learn/Chapter2"
import { Chapter3 } from "@/components/learn/Chapter3"
import { Chapter4 } from "@/components/learn/Chapter4"
import { Chapter5 } from "@/components/learn/Chapter5"

export default function LearnPage() {
  const [mode, setMode] = useState<"individual" | "business">("individual")

  return (
    <div className="min-h-screen">
      <div className="max-w-6xl mx-auto px-6 py-12">
        {/* Hero */}
        <div className="text-center space-y-4 mb-12">
          <h1 className="font-serif text-4xl sm:text-5xl font-bold text-warm-800 leading-tight">
            AI 101
          </h1>
          <p className="text-lg text-warm-500 max-w-xl mx-auto">
            Plain-English guides to what AI is, what it can do for you, and how to read benchmarks without a computer science degree.
          </p>

          <div className="flex justify-center pt-4">
            <UseCaseToggle mode={mode} onToggle={setMode} />
          </div>
        </div>

        {/* Content with sidebar */}
        <div className="flex gap-12">
          <ChapterNav />

          <div className="flex-1 min-w-0 space-y-24">
            <Chapter1 />
            <Chapter2 mode={mode} />
            <Chapter3 mode={mode} />
            <Chapter4 mode={mode} />
            <Chapter5 />
          </div>
        </div>
      </div>
    </div>
  )
}
