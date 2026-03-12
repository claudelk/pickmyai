import { Mistral } from "@mistralai/mistralai"

const client = new Mistral({ apiKey: process.env.MISTRAL_API_KEY })

export async function queryMistral(prompt: string): Promise<{ response: string; model: string; tokensUsed: number }> {
  const result = await client.chat.complete({
    model: "mistral-small-latest",
    messages: [{ role: "user", content: prompt }],
    maxTokens: 300,
  })

  return {
    response: result.choices?.[0]?.message?.content?.toString() ?? "",
    model: "mistral-small-latest",
    tokensUsed: (result.usage?.totalTokens) ?? 0,
  }
}
