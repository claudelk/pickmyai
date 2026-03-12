"use client"

import { ImagePlaceholder } from "@/components/ui/ImagePlaceholder"
import { NudgeButton } from "./NudgeButton"
import { PLATFORMS, PLATFORM_NUDGE_PROMPTS } from "@/lib/constants"

interface Chapter4Props {
  mode: "individual" | "business"
}

export function Chapter4({ mode }: Chapter4Props) {
  return (
    <section id="chapter-4" className="space-y-10">
      <div className="space-y-4">
        <h2 className="font-serif text-3xl sm:text-4xl font-bold text-slate-900 leading-tight">
          Which AI is known for what?
        </h2>
        <ImagePlaceholder
          id="ch4-personalities"
          label="Six distinct characters with unique personalities"
          aspectRatio="aspect-[16/9]"
        />
      </div>

      <p className="text-base text-slate-700 leading-relaxed">
        Every AI has a personality. Here is what each one is known for,
        without the bar charts.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {PLATFORMS.map((platform) => (
          <div
            key={platform.id}
            className="rounded-lg border border-slate-200 p-5 space-y-3"
            style={{ boxShadow: "0 1px 2px 0 rgb(0 0 0 / 0.05)" }}
          >
            <div className="flex items-center gap-2">
              <div
                className="w-3 h-3 rounded-full flex-shrink-0"
                style={{ backgroundColor: platform.color }}
              />
              <h3 className="font-semibold text-sm text-slate-900">{platform.displayName}</h3>
            </div>
            <p className="text-sm text-slate-500 italic">{platform.tagline}</p>

            <div className="space-y-1">
              <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Known for</p>
              <ul className="space-y-1">
                {platform.strengths.map((s) => (
                  <li key={s} className="text-sm text-slate-700 flex items-start gap-2">
                    <span className="text-[#7C3AED] mt-1 text-xs">&#x2022;</span>
                    {s}
                  </li>
                ))}
              </ul>
            </div>

            <p className="text-sm text-slate-600">
              <span className="font-medium">Best for individuals:</span> {platform.bestForIndividual}
            </p>

            {mode === "business" && (
              <p className="text-sm text-slate-600">
                <span className="font-medium">Best for businesses:</span> {platform.bestForBusiness}
              </p>
            )}

            <NudgeButton
              text={`Try ${platform.displayName}`}
              promptPreFill={PLATFORM_NUDGE_PROMPTS[platform.id]}
            />
          </div>
        ))}
      </div>
    </section>
  )
}
