import Anthropic from "@anthropic-ai/sdk"

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

export async function queryAnthropic(prompt: string): Promise<{ response: string; model: string; tokensUsed: number }> {
  const message = await client.messages.create({
    model: "claude-haiku-4-5-20251001",
    max_tokens: 300,
    messages: [{ role: "user", content: prompt }],
  })

  const text = message.content
    .filter((block): block is Anthropic.TextBlock => block.type === "text")
    .map((block) => block.text)
    .join("")

  return {
    response: text,
    model: "claude-haiku-4-5",
    tokensUsed: (message.usage?.input_tokens ?? 0) + (message.usage?.output_tokens ?? 0),
  }
}
