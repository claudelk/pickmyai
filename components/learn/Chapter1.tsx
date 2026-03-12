"use client"

import { useState, useEffect } from "react"
import { ImagePlaceholder } from "@/components/ui/ImagePlaceholder"
import { NudgeButton } from "./NudgeButton"

export function Chapter1() {
  return (
    <section id="chapter-1" className="space-y-12">
      {/* Hero */}
      <div className="space-y-6">
        <ImagePlaceholder
          id="ch1-library"
          label="A human figure inside a vast circular library"
          aspectRatio="aspect-[4/3]"
        />
        <h2 className="font-serif text-3xl sm:text-4xl font-bold text-warm-800 leading-tight">
          You have heard the word a thousand times.
        </h2>
        <p className="text-lg text-warm-500">Here is what it actually means.</p>
      </div>

      {/* Illustrated sequence */}
      <div className="flex gap-6 overflow-x-auto pb-4 -mx-4 px-4 sm:mx-0 sm:px-0 sm:grid sm:grid-cols-3 sm:overflow-visible">
        <div className="min-w-[260px] sm:min-w-0 space-y-3">
          <ImagePlaceholder
            id="ch1-library"
            label="A vast library of all human knowledge"
            aspectRatio="aspect-square"
          />
          <p className="text-sm text-warm-600">
            Start with a library. Every book, article, and conversation ever written.
          </p>
        </div>
        <div className="min-w-[260px] sm:min-w-0 space-y-3">
          <ImagePlaceholder
            id="ch1-brain"
            label="A brain made of interconnected dots and lines"
            aspectRatio="aspect-square"
          />
          <p className="text-sm text-warm-600">
            Add a brain that reads all of it and learns to recognize patterns.
          </p>
        </div>
        <div className="min-w-[260px] sm:min-w-0 space-y-3">
          <ImagePlaceholder
            id="ch1-conversation"
            label="A person having a conversation with a glowing orb"
            aspectRatio="aspect-square"
          />
          <p className="text-sm text-warm-600">
            Now it can finish your sentences, answer your questions, and help you think.
          </p>
        </div>
      </div>

      {/* Interactive autocomplete demo */}
      <AutocompleteDemo />

      {/* Closing */}
      <p className="text-base text-warm-700 leading-relaxed">
        That is what all of these AI assistants are doing every time you talk to them.
      </p>

      <NudgeButton
        text="See them in action. Run a comparison."
        href="/"
      />
    </section>
  )
}

function AutocompleteDemo() {
  const [typed, setTyped] = useState("")
  const [showAdvanced, setShowAdvanced] = useState(false)
  const fullText = "How do I save money on"
  const basicCompletion = "...groceries?"
  const advancedCompletion = "groceries without sacrificing meal quality? Here are five strategies tailored to your household size and local store options."

  // Auto-type effect
  useEffect(() => {
    if (typed.length < fullText.length) {
      const timer = setTimeout(() => {
        setTyped(fullText.slice(0, typed.length + 1))
      }, 80)
      return () => clearTimeout(timer)
    } else {
      const timer = setTimeout(() => setShowAdvanced(true), 800)
      return () => clearTimeout(timer)
    }
  }, [typed])

  return (
    <div className="bg-white rounded-xl border border-warm-200 p-6 space-y-4">
      <p className="text-sm font-medium text-warm-700">See it in action</p>

      <div className="space-y-3">
        {/* Input display */}
        <div className="px-4 py-3 bg-warm-50 rounded-lg text-sm text-warm-800 font-mono">
          {typed}
          <span className="animate-pulse">|</span>
        </div>

        {/* Basic completion */}
        {typed.length >= fullText.length && (
          <div className="px-4 py-2 bg-warm-100 rounded-lg text-sm text-warm-500">
            Basic autocomplete: <span className="italic">{basicCompletion}</span>
          </div>
        )}

        {/* Advanced AI completion */}
        {showAdvanced && (
          <div className="px-4 py-3 bg-accent-50 border border-accent-100 rounded-lg text-sm text-warm-700 transition-opacity duration-500">
            AI response: <span className="italic">{advancedCompletion}</span>
          </div>
        )}
      </div>

      {showAdvanced && (
        <p className="text-xs text-warm-500">
          That jump, from guessing the next word to understanding your intent, is what makes Claude, ChatGPT, and Gemini different.
        </p>
      )}
    </div>
  )
}
