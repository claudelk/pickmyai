"use client"

import { useState } from "react"
import { ArrowLeft, MessageCircle, Briefcase, PenTool } from "lucide-react"
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
    icon: MessageCircle,
    color: "accent",
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
    icon: Briefcase,
    color: "warm",
  },
  {
    text: "What is one thing that takes way longer than it should in your daily life or work?",
    type: "freetext" as const,
    options: [],
    icon: PenTool,
    color: "accent",
  },
]

export function GuidedOnboarding({ onComplete, onBack }: GuidedOnboardingProps) {
  const [step, setStep] = useState(0)
  const [answers, setAnswers] = useState<string[]>(["", "", ""])
  const [isPersonalizing, setIsPersonalizing] = useState(false)

  const question = QUESTIONS[step]
  const IconComponent = question.icon

  function handleSelect(option: string) {
    const newAnswers = [...answers]
    newAnswers[step] = option
    setAnswers(newAnswers)

    if (step < 2) {
      setStep(step + 1)
    }
  }

  function handleFreeTextSubmit() {
    setIsPersonalizing(true)
    setTimeout(() => {
      const useCaseTag = mapQ2ToUseCaseTag(answers[1])
      onComplete(useCaseTag, answers[2])
    }, 1500)
  }

  function handleBack() {
    if (step === 0) {
      onBack()
    } else {
      setStep(step - 1)
    }
  }

  if (isPersonalizing) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-64px)] px-6">
        <div className="text-center space-y-4">
          <div className="flex justify-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-accent-400 animate-pulse" />
            <div className="w-2.5 h-2.5 rounded-full bg-accent-400 animate-pulse [animation-delay:200ms]" />
            <div className="w-2.5 h-2.5 rounded-full bg-accent-400 animate-pulse [animation-delay:400ms]" />
          </div>
          <p className="text-sm text-warm-500">Personalizing your comparison...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-64px)] px-6">
      <div className="max-w-lg w-full space-y-8">
        {/* Progress */}
        <div className="flex items-center gap-4">
          <button
            onClick={handleBack}
            className="p-2 rounded-lg hover:bg-warm-100 transition-colors duration-200 focus:ring-2 focus:ring-accent-400"
            aria-label="Go back"
          >
            <ArrowLeft size={20} className="text-warm-400" />
          </button>
          <div className="flex-1">
            <div className="flex gap-2">
              {[0, 1, 2].map((i) => (
                <div
                  key={i}
                  className={`h-1.5 flex-1 rounded-full transition-colors duration-300 ${
                    i <= step ? "bg-accent-400" : "bg-warm-200"
                  }`}
                />
              ))}
            </div>
            <p className="text-xs text-warm-400 mt-2">Step {step + 1} of 3</p>
          </div>
        </div>

        {/* Question illustration */}
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-accent-50 border border-accent-100 flex items-center justify-center flex-shrink-0">
            <IconComponent size={22} className="text-accent-500" />
          </div>
          <h2 className="text-xl font-semibold text-warm-800 leading-relaxed">
            {question.text}
          </h2>
        </div>

        {/* Options or free text */}
        {question.type === "single" ? (
          <div className="space-y-3">
            {question.options.map((option) => (
              <button
                key={option}
                onClick={() => handleSelect(option)}
                className={`w-full text-left px-5 py-4 rounded-xl border text-sm font-medium transition-all duration-200 focus:ring-2 focus:ring-accent-400 ${
                  answers[step] === option
                    ? "border-accent-400 bg-accent-50 text-accent-700"
                    : "border-warm-200 text-warm-600 hover:border-warm-300 hover:bg-warm-50"
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
              className="w-full h-28 px-4 py-3 rounded-xl border border-warm-200 text-sm text-warm-800 placeholder:text-warm-300 resize-none focus:outline-none focus:ring-2 focus:ring-accent-400 focus:border-transparent bg-white"
              maxLength={200}
            />
            <div className="flex justify-between items-center">
              <span className="text-xs text-warm-400">
                {answers[2].length}/200
              </span>
              <button
                onClick={handleFreeTextSubmit}
                disabled={answers[2].length === 0}
                className="px-6 py-2.5 bg-accent-500 text-white text-sm font-medium rounded-xl hover:bg-accent-600 transition-colors duration-200 disabled:opacity-40 disabled:cursor-not-allowed focus:ring-2 focus:ring-accent-400"
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
