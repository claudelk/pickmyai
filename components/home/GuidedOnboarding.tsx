"use client"

import { useState } from "react"
import { ArrowLeft } from "lucide-react"
import type { UseCaseTag } from "@/lib/constants"
import { mapQ2ToUseCaseTag } from "@/lib/recommend"

interface GuidedOnboardingProps {
  onComplete: (useCaseTag: UseCaseTag, freeText: string) => void
  onBack: () => void
}

const QUESTIONS = [
  {
    text: "Have you ever chatted with an AI before, like ChatGPT, Siri, or a chatbot on a website?",
    type: "single" as const,
    options: ["Yes, a few times", "Once or twice", "Never tried one"],
  },
  {
    text: "What do you spend the most time on during your day?",
    type: "single" as const,
    options: [
      "Writing and emails",
      "Research and learning",
      "Creative work",
      "Coding or technical tasks",
      "Managing a business or team",
    ],
  },
  {
    text: "What is one thing that takes way longer than it should in your daily life or work?",
    type: "freetext" as const,
    options: [],
  },
]

export function GuidedOnboarding({ onComplete, onBack }: GuidedOnboardingProps) {
  const [step, setStep] = useState(0)
  const [answers, setAnswers] = useState<string[]>(["", "", ""])

  const question = QUESTIONS[step]

  function handleSelect(option: string) {
    const newAnswers = [...answers]
    newAnswers[step] = option
    setAnswers(newAnswers)

    if (step < 2) {
      setStep(step + 1)
    }
  }

  function handleFreeTextSubmit() {
    const useCaseTag = mapQ2ToUseCaseTag(answers[1])
    onComplete(useCaseTag, answers[2])
  }

  function handleBack() {
    if (step === 0) {
      onBack()
    } else {
      setStep(step - 1)
    }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-64px)] px-6">
      <div className="max-w-lg w-full space-y-8">
        {/* Progress */}
        <div className="flex items-center gap-4">
          <button
            onClick={handleBack}
            className="p-2 rounded-lg hover:bg-slate-100 transition-colors duration-200 focus:ring-2 focus:ring-blue-500"
            aria-label="Go back"
          >
            <ArrowLeft size={20} className="text-slate-500" />
          </button>
          <div className="flex-1">
            <div className="flex gap-2">
              {[0, 1, 2].map((i) => (
                <div
                  key={i}
                  className={`h-1.5 flex-1 rounded-full transition-colors duration-200 ${
                    i <= step ? "bg-[#2563EB]" : "bg-slate-200"
                  }`}
                />
              ))}
            </div>
            <p className="text-xs text-slate-400 mt-2">Step {step + 1} of 3</p>
          </div>
        </div>

        {/* Question */}
        <h2 className="text-xl font-semibold text-slate-900 leading-relaxed">
          {question.text}
        </h2>

        {/* Options or free text */}
        {question.type === "single" ? (
          <div className="space-y-3">
            {question.options.map((option) => (
              <button
                key={option}
                onClick={() => handleSelect(option)}
                className={`w-full text-left px-5 py-4 rounded-lg border text-sm font-medium transition-colors duration-200 focus:ring-2 focus:ring-blue-500 ${
                  answers[step] === option
                    ? "border-[#2563EB] bg-blue-50 text-[#2563EB]"
                    : "border-slate-200 text-slate-700 hover:border-slate-300 hover:bg-slate-50"
                }`}
              >
                {option}
              </button>
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            <textarea
              value={answers[2]}
              onChange={(e) => {
                const newAnswers = [...answers]
                newAnswers[2] = e.target.value.slice(0, 200)
                setAnswers(newAnswers)
              }}
              placeholder="e.g. writing meeting summaries, replying to emails, researching topics..."
              className="w-full h-28 px-4 py-3 rounded-lg border border-slate-200 text-sm text-slate-900 placeholder:text-slate-400 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              maxLength={200}
            />
            <div className="flex justify-between items-center">
              <span className="text-xs text-slate-400">
                {answers[2].length}/200
              </span>
              <button
                onClick={handleFreeTextSubmit}
                disabled={answers[2].length === 0}
                className="px-6 py-2.5 bg-[#2563EB] text-white text-sm font-medium rounded-lg hover:bg-[#1E40AF] transition-colors duration-200 disabled:opacity-40 disabled:cursor-not-allowed focus:ring-2 focus:ring-blue-500"
              >
                See my comparison
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
