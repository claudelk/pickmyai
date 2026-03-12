"use client"

import { ImagePlaceholder } from "@/components/ui/ImagePlaceholder"
import { BenchmarkCard } from "./BenchmarkCard"
import { BENCHMARKS } from "@/lib/constants"

interface Chapter3Props {
  mode: "individual" | "business"
}

export function Chapter3({ mode }: Chapter3Props) {
  return (
    <section id="chapter-3" className="space-y-10">
      <div className="space-y-4">
        <h2 className="font-serif text-3xl sm:text-4xl font-bold text-warm-800 leading-tight">
          Benchmarks, decoded
        </h2>
        <ImagePlaceholder
          id="ch3-benchmarks"
          label="A friendly scoreboard with everyday objects"
          aspectRatio="aspect-[4/3]"
        />
      </div>

      <div className="space-y-4">
        <p className="text-base text-warm-700 leading-relaxed">
          Benchmarks are tests that researchers use to measure how good an AI is.
          The problem is they are usually presented as bar charts full of acronyms.
          Here is what they actually mean for you.
        </p>
        <p className="text-xs text-warm-400">
          Benchmark data last reviewed: March 2026
        </p>
      </div>

      <div className="space-y-4">
        {BENCHMARKS.map((benchmark) => (
          <BenchmarkCard
            key={benchmark.id}
            benchmark={benchmark}
            mode={mode}
          />
        ))}
      </div>
    </section>
  )
}
