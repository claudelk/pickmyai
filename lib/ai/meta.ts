import Groq from "groq-sdk"

// Meta's Llama is accessed via Groq for fast inference
const client = new Groq({ apiKey: process.env.META_AI_API_KEY })

export async function queryMeta(prompt: string): Promise<{ response: string; model: string; tokensUsed: number }> {
  const completion = await client.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    messages: [{ role: "user", content: prompt }],
    max_tokens: 300,
  })

  return {
    response: completion.choices[0]?.message?.content ?? "",
    model: "llama-3.3-70b-versatile",
    tokensUsed: completion.usage?.total_tokens ?? 0,
  }
}
