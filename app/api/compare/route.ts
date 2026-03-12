import { NextRequest } from "next/server"
import { checkRateLimit } from "@/lib/ratelimit"
import { queryOpenAI } from "@/lib/ai/openai"
import { queryAnthropic } from "@/lib/ai/anthropic"
import { queryGemini } from "@/lib/ai/gemini"
import { queryMistral } from "@/lib/ai/mistral"
import { queryGrok } from "@/lib/ai/grok"
import { queryMeta } from "@/lib/ai/meta"

interface CompareResult {
  platform: string
  status: "success" | "error" | "timeout"
  response: string
  latencyMs: number
  model: string
  tokensUsed: number
  errorMessage?: string
}

// Mock responses for when API keys are not configured
const MOCK_RESPONSES: Record<string, string> = {
  chatgpt: "This is a mock response from ChatGPT (gpt-4o-mini). In production, this would be a real AI-generated response to your prompt. ChatGPT excels at everyday tasks, summarizing content, and maintaining natural conversations.",
  claude: "This is a mock response from Claude (claude-haiku-4-5). In production, this would be a real AI-generated response to your prompt. Claude is known for careful reasoning, long-form writing, and handling sensitive topics with nuance.",
  gemini: "This is a mock response from Gemini (gemini-1.5-flash). In production, this would be a real AI-generated response to your prompt. Gemini shines with visual content, Google Workspace integration, and multimodal tasks.",
  mistral: "This is a mock response from Mistral (mistral-small-latest). In production, this would be a real AI-generated response to your prompt. Mistral is valued for its speed, privacy focus, and European data compliance.",
  grok: "This is a mock response from Grok (grok-2-latest). In production, this would be a real AI-generated response to your prompt. Grok stands out for real-time web access, current events coverage, and its informal conversational tone.",
  meta: "This is a mock response from Meta AI (llama-3.3-70b-versatile). In production, this would be a real AI-generated response to your prompt. Meta AI leverages open-source Llama models, great for coding and customizable deployments.",
}

const MOCK_MODELS: Record<string, string> = {
  chatgpt: "gpt-4o-mini",
  claude: "claude-haiku-4-5",
  gemini: "gemini-1.5-flash",
  mistral: "mistral-small-latest",
  grok: "grok-2-latest",
  meta: "llama-3.3-70b-versatile",
}

function isMockKey(key: string | undefined): boolean {
  return !key || key.startsWith("mock-") || key.startsWith("sk-mock-") || key.startsWith("sk-ant-mock-")
}

async function queryPlatform(platform: string, prompt: string): Promise<CompareResult> {
  const start = Date.now()

  // Check if we should use mock responses
  const keyMap: Record<string, string | undefined> = {
    chatgpt: process.env.OPENAI_API_KEY,
    claude: process.env.ANTHROPIC_API_KEY,
    gemini: process.env.GOOGLE_AI_API_KEY,
    mistral: process.env.MISTRAL_API_KEY,
    grok: process.env.GROK_API_KEY,
    meta: process.env.META_AI_API_KEY,
  }

  if (isMockKey(keyMap[platform])) {
    // Simulate varied latency for mock responses
    const mockLatency = 500 + Math.random() * 2000
    await new Promise((resolve) => setTimeout(resolve, mockLatency))

    return {
      platform,
      status: "success",
      response: MOCK_RESPONSES[platform] ?? "Mock response",
      latencyMs: Math.round(mockLatency),
      model: MOCK_MODELS[platform] ?? "unknown",
      tokensUsed: Math.round(50 + Math.random() * 100),
    }
  }

  try {
    const queryFn: Record<string, (p: string) => Promise<{ response: string; model: string; tokensUsed: number }>> = {
      chatgpt: queryOpenAI,
      claude: queryAnthropic,
      gemini: queryGemini,
      mistral: queryMistral,
      grok: queryGrok,
      meta: queryMeta,
    }

    const fn = queryFn[platform]
    if (!fn) throw new Error(`Unknown platform: ${platform}`)

    // 10 second timeout
    const result = await Promise.race([
      fn(prompt),
      new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error("timeout")), 10000)
      ),
    ])

    return {
      platform,
      status: "success",
      response: result.response,
      latencyMs: Date.now() - start,
      model: result.model,
      tokensUsed: result.tokensUsed,
    }
  } catch (error) {
    const isTimeout = error instanceof Error && error.message === "timeout"
    return {
      platform,
      status: isTimeout ? "timeout" : "error",
      response: "",
      latencyMs: Date.now() - start,
      model: MOCK_MODELS[platform] ?? "unknown",
      tokensUsed: 0,
      errorMessage: error instanceof Error ? error.message : "Unknown error",
    }
  }
}

export async function POST(request: NextRequest) {
  // Rate limiting
  const ip = request.headers.get("x-forwarded-for") ?? request.headers.get("x-real-ip") ?? "127.0.0.1"
  const { success, remaining } = await checkRateLimit(ip)

  if (!success) {
    return Response.json(
      { error: "Rate limit exceeded. You have used all three free comparisons for today." },
      { status: 429, headers: { "X-RateLimit-Remaining": String(remaining) } }
    )
  }

  // Parse and validate
  let body: { prompt?: string; useCaseTag?: string }
  try {
    body = await request.json()
  } catch {
    return Response.json({ error: "Invalid request body" }, { status: 400 })
  }

  const prompt = body.prompt?.trim()
  if (!prompt) {
    return Response.json({ error: "Prompt is required" }, { status: 400 })
  }
  if (prompt.length > 500) {
    return Response.json({ error: "Prompt must be 500 characters or fewer" }, { status: 400 })
  }

  // Query all 6 platforms in parallel
  const platforms = ["chatgpt", "claude", "gemini", "mistral", "grok", "meta"]
  const results = await Promise.allSettled(
    platforms.map((p) => queryPlatform(p, prompt))
  )

  const responses: CompareResult[] = results.map((result, i) => {
    if (result.status === "fulfilled") return result.value
    return {
      platform: platforms[i],
      status: "error" as const,
      response: "",
      latencyMs: 0,
      model: MOCK_MODELS[platforms[i]] ?? "unknown",
      tokensUsed: 0,
      errorMessage: "Request failed",
    }
  })

  return Response.json(
    { results: responses, remaining },
    { headers: { "X-RateLimit-Remaining": String(remaining) } }
  )
}
