"use client"

import { Mail, Search, Calendar, Palette, Languages, GraduationCap, FileText, Headphones, Code, BarChart3, Scale, Users } from "lucide-react"
import { ImagePlaceholder } from "@/components/ui/ImagePlaceholder"
import { NudgeButton } from "./NudgeButton"
import type { LucideIcon } from "lucide-react"

interface UseCaseCard {
  title: string
  description: string
  example: string
  icon: LucideIcon
}

const INDIVIDUAL_CASES: UseCaseCard[] = [
  { title: "Writing and editing", description: "Draft, rewrite, or polish anything", example: "Turn messy bullet points into a professional email to your landlord", icon: Mail },
  { title: "Research and learning", description: "Clear answers to complex questions", example: "Understand your medical test results without Googling for an hour", icon: Search },
  { title: "Daily planning", description: "Think through decisions and organize", example: "Plan a 7-day trip to Japan with a realistic budget", icon: Calendar },
  { title: "Creative projects", description: "Co-write, brainstorm, get unstuck", example: "Write the first chapter of the novel you have been putting off", icon: Palette },
  { title: "Language and translation", description: "Translate and adapt text for any reader", example: "Translate a French lease and explain the tricky clauses", icon: Languages },
  { title: "Learning new skills", description: "Patient, personalized explanations", example: "Learn how to read a stock chart in plain English", icon: GraduationCap },
]

const BUSINESS_CASES: UseCaseCard[] = [
  { title: "Content and communications", description: "Generate and scale written content", example: "Draft a month of social posts from one product brief", icon: FileText },
  { title: "Customer support", description: "Handle routine queries instantly", example: "Answer the same 50 FAQ questions consistently, 24 hours a day", icon: Headphones },
  { title: "Coding and development", description: "Write, review, and debug code faster", example: "Build a data export script from a plain-English description", icon: Code },
  { title: "Data analysis", description: "Summarize and interpret data clearly", example: "Turn a spreadsheet of sales figures into a readable weekly summary", icon: BarChart3 },
  { title: "Legal and compliance", description: "First-pass review of documents", example: "Flag unusual clauses in a vendor agreement before it reaches legal", icon: Scale },
  { title: "HR and recruitment", description: "Screen and draft hiring workflows", example: "Write tailored job descriptions from a short role brief", icon: Users },
]

interface Chapter2Props {
  mode: "individual" | "business"
}

export function Chapter2({ mode }: Chapter2Props) {
  const cases = mode === "individual" ? INDIVIDUAL_CASES : BUSINESS_CASES

  return (
    <section id="chapter-2" className="space-y-10">
      <div className="space-y-4">
        <h2 className="font-serif text-3xl sm:text-4xl font-bold text-warm-800 leading-tight">
          What can it do for you?
        </h2>
        <p className="text-lg text-warm-500">
          Real tasks, real examples. Not hypotheticals.
        </p>
      </div>

      <ImagePlaceholder
        id={mode === "individual" ? "ch2-individual" : "ch2-business"}
        label={mode === "individual" ? "A person relaxing with AI-assisted tasks floating around" : "A small team collaborating with AI insights"}
        aspectRatio="aspect-[16/9]"
      />

      {/* Use case cards with alternating layout: one wide, then two side by side */}
      <div className="space-y-4">
        {(() => {
          const elements: React.ReactNode[] = []
          for (let i = 0; i < cases.length; i += 3) {
            elements.push(
              <UseCaseCardComponent key={cases[i].title} useCase={cases[i]} wide />
            )
            if (i + 1 < cases.length && i + 2 < cases.length) {
              elements.push(
                <div key={`pair-${i}`} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <UseCaseCardComponent useCase={cases[i + 1]} />
                  <UseCaseCardComponent useCase={cases[i + 2]} />
                </div>
              )
            } else if (i + 1 < cases.length) {
              elements.push(
                <UseCaseCardComponent key={cases[i + 1].title} useCase={cases[i + 1]} />
              )
            }
          }
          return elements
        })()}
      </div>

      <NudgeButton
        text={mode === "individual" ? "Try an AI on a writing task" : "Try an AI on a business task"}
        promptPreFill={
          mode === "individual"
            ? "Write a short thank-you email to a colleague who helped me through a tough project"
            : "Summarize the key risks in a new vendor contract for a non-legal reader"
        }
      />
    </section>
  )
}

function UseCaseCardComponent({ useCase }: { useCase: UseCaseCard; wide?: boolean }) {
  const Icon = useCase.icon
  return (
    <div className="rounded-xl border border-warm-200 bg-white p-5 space-y-2 hover:border-warm-300 transition-colors duration-200">
      <div className="flex items-center gap-2">
        <Icon size={18} className="text-accent-500 flex-shrink-0" />
        <h3 className="font-semibold text-sm text-warm-800">{useCase.title}</h3>
      </div>
      <p className="text-sm text-warm-600">{useCase.description}</p>
      <p className="text-sm text-warm-400 italic">{useCase.example}</p>
    </div>
  )
}
