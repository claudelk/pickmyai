import OpenAI from "openai"

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

export async function queryOpenAI(prompt: string): Promise<{ response: string; model: string; tokensUsed: number }> {
  const completion = await client.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [{ role: "user", content: prompt }],
    max_tokens: 300,
  })

  return {
    response: completion.choices[0]?.message?.content ?? "",
    model: "gpt-4o-mini",
    tokensUsed: completion.usage?.total_tokens ?? 0,
  }
}
