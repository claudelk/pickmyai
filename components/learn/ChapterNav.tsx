"use client"

import { useEffect, useState } from "react"

const CHAPTERS = [
  { id: "chapter-1", label: "What is AI, really?" },
  { id: "chapter-2", label: "What can it do for you?" },
  { id: "chapter-3", label: "Benchmarks, decoded" },
  { id: "chapter-4", label: "Which AI is known for what?" },
]

export function ChapterNav() {
  const [active, setActive] = useState("chapter-1")

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActive(entry.target.id)
          }
        }
      },
      { rootMargin: "-20% 0px -60% 0px" }
    )

    for (const chapter of CHAPTERS) {
      const el = document.getElementById(chapter.id)
      if (el) observer.observe(el)
    }

    return () => observer.disconnect()
  }, [])

  function scrollTo(id: string) {
    const el = document.getElementById(id)
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" })
    }
  }

  return (
    <>
      {/* Desktop sidebar */}
      <nav className="hidden lg:block sticky top-20 w-52 flex-shrink-0 self-start">
        <ul className="space-y-2">
          {CHAPTERS.map((ch) => (
            <li key={ch.id}>
              <button
                onClick={() => scrollTo(ch.id)}
                className={`text-sm text-left w-full px-3 py-2 rounded-lg transition-colors duration-200 ${
                  active === ch.id
                    ? "bg-[#7C3AED]/10 text-[#7C3AED] font-medium"
                    : "text-slate-500 hover:text-slate-700 hover:bg-slate-100"
                }`}
              >
                {ch.label}
              </button>
            </li>
          ))}
        </ul>
      </nav>

      {/* Mobile pills */}
      <nav className="lg:hidden sticky top-16 z-30 bg-[#FDFAF5] border-b border-slate-200 -mx-6 px-6 py-3 overflow-x-auto">
        <div className="flex gap-2 min-w-max">
          {CHAPTERS.map((ch) => (
            <button
              key={ch.id}
              onClick={() => scrollTo(ch.id)}
              className={`text-xs font-medium px-3 py-1.5 rounded-full whitespace-nowrap transition-colors duration-200 ${
                active === ch.id
                  ? "bg-[#7C3AED] text-white"
                  : "bg-white text-slate-500 border border-slate-200"
              }`}
            >
              {ch.label}
            </button>
          ))}
        </div>
      </nav>
    </>
  )
}
