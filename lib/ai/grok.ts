import OpenAI from "openai"

// Grok uses an OpenAI-compatible API
const client = new OpenAI({
  apiKey: process.env.GROK_API_KEY,
  baseURL: "https://api.x.ai/v1",
})

export async function queryGrok(prompt: string): Promise<{ response: string; model: string; tokensUsed: number }> {
  const completion = await client.chat.completions.create({
    model: "grok-2-latest",
    messages: [{ role: "user", content: prompt }],
    max_tokens: 300,
  })

  return {
    response: completion.choices[0]?.message?.content ?? "",
    model: "grok-2-latest",
    tokensUsed: completion.usage?.total_tokens ?? 0,
  }
}
