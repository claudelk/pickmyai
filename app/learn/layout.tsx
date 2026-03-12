import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "AI 101 - Learn what AI is and which one to choose | PickMyAI",
  description:
    "Plain-English guides to what AI is, what it can do for you, and how to read benchmarks without a computer science degree.",
}

export default function LearnLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
