"use client"

import Link from "next/link"
import { ArrowRight } from "lucide-react"

interface NudgeButtonProps {
  text: string
  href?: string
  promptPreFill?: string
}

export function NudgeButton({ text, href = "/", promptPreFill = "" }: NudgeButtonProps) {
  const url = promptPreFill ? `${href}?prompt=${encodeURIComponent(promptPreFill)}` : href

  return (
    <Link
      href={url}
      className="inline-flex items-center gap-2 px-6 py-3 bg-accent-500 text-white text-sm font-medium rounded-xl hover:bg-accent-600 transition-colors duration-200 focus:ring-2 focus:ring-accent-400 focus:ring-offset-2"
    >
      {text}
      <ArrowRight size={16} />
    </Link>
  )
}
