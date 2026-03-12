"use client"

import { NudgeButton } from "./NudgeButton"

export function Chapter5() {
  return (
    <section id="chapter-5" className="scroll-mt-24 space-y-8">
      <div className="space-y-3">
        <p className="text-xs font-medium text-accent-500 uppercase tracking-wider">Chapter 5</p>
        <h2 className="font-serif text-2xl sm:text-3xl font-bold text-warm-800">
          Making AI your own
        </h2>
        <p className="text-warm-500 leading-relaxed max-w-2xl">
          Every AI starts out generic. The real magic happens when you shape it to match the way you think, write, and work.
        </p>
      </div>

      {/* Personalization section */}
      <div className="rounded-xl border border-warm-200 bg-white p-6 space-y-5">
        <h3 className="text-lg font-semibold text-warm-800">AI is generic at first — but personalizable</h3>
        <p className="text-sm text-warm-500 leading-relaxed">
          When you first open ChatGPT, Claude, or any other AI, it responds in a default style — helpful but impersonal. That is the baseline, and it is what our comparison tool tests. But most platforms let you customize:
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="rounded-lg bg-warm-50 p-4 space-y-2">
            <p className="text-sm font-medium text-warm-700">Tone & style</p>
            <p className="text-xs text-warm-400">
              Tell it to be concise, formal, casual, or humorous. Most platforms remember your preference.
            </p>
          </div>
          <div className="rounded-lg bg-warm-50 p-4 space-y-2">
            <p className="text-sm font-medium text-warm-700">Verbosity</p>
            <p className="text-xs text-warm-400">
              Some people want bullet points, others want detailed explanations. You can set this explicitly.
            </p>
          </div>
          <div className="rounded-lg bg-warm-50 p-4 space-y-2">
            <p className="text-sm font-medium text-warm-700">Personality</p>
            <p className="text-xs text-warm-400">
              ChatGPT has custom instructions. Claude has project knowledge. Gemini integrates with your Google data.
            </p>
          </div>
          <div className="rounded-lg bg-warm-50 p-4 space-y-2">
            <p className="text-sm font-medium text-warm-700">Memory</p>
            <p className="text-xs text-warm-400">
              Over time, many platforms learn from your conversations and adapt to your preferences automatically.
            </p>
          </div>
        </div>

        <p className="text-sm text-warm-500 leading-relaxed">
          The AI you pick today will feel different in a month — not because it changed, but because you shaped it. Start with the one that matches your baseline needs, then make it yours.
        </p>
      </div>

      {/* Normal mode disclaimer */}
      <div className="rounded-xl border border-accent-100 bg-accent-50/50 p-6 space-y-3">
        <h3 className="text-lg font-semibold text-warm-800">What our comparison tests</h3>
        <p className="text-sm text-warm-500 leading-relaxed">
          Our tournament compares <span className="font-medium text-warm-700">standard chat mode</span> — the free, default experience you get when you sign up for any platform. This means:
        </p>
        <ul className="space-y-2 text-sm text-warm-500">
          <li className="flex items-start gap-2">
            <span className="text-accent-500 mt-1">-</span>
            <span>No deep research or deep thinking modes</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-accent-500 mt-1">-</span>
            <span>No code interpreter or data analysis</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-accent-500 mt-1">-</span>
            <span>No image, video, or music generation</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-accent-500 mt-1">-</span>
            <span>No web browsing or real-time data (except Grok)</span>
          </li>
        </ul>
        <p className="text-sm text-warm-500 leading-relaxed">
          These advanced features vary widely by platform and pricing tier. Our goal is to help you find the best <span className="italic">starting point</span> — the AI whose default personality and writing style clicks with you.
        </p>
      </div>

      <NudgeButton
        text="Find your best match now"
        href="/"
      />
    </section>
  )
}
