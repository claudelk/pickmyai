import type { Metadata } from "next"
import { Inter, Lora } from "next/font/google"
import { Analytics } from "@vercel/analytics/react"
import { Navbar } from "@/components/ui/Navbar"
import "./globals.css"

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
})

const lora = Lora({
  variable: "--font-lora",
  subsets: ["latin"],
})

export const metadata: Metadata = {
  title: "PickMyAI - Find the AI that fits your life",
  description:
    "Compare ChatGPT, Claude, Gemini, Mistral, Grok and Meta AI side by side. No account needed. Find which AI is right for you in minutes.",
  openGraph: {
    title: "PickMyAI - Find the AI that fits your life",
    description:
      "Compare 6 AI assistants with one prompt. No signup. No benchmarks. Just clear answers.",
    url: "https://pickmyai.ai",
    siteName: "PickMyAI",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "PickMyAI",
    description:
      "Compare ChatGPT, Claude, Gemini and more side by side. Free, no login.",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${lora.variable} font-sans antialiased text-warm-800`}>
        <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-[60] focus:px-4 focus:py-2 focus:bg-white focus:text-accent-600 focus:rounded-lg">
          Skip to main content
        </a>
        <Navbar />
        <main id="main-content">
          {children}
        </main>
        <Analytics />
      </body>
    </html>
  )
}
