import { GoogleGenerativeAI } from "@google/generative-ai"

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY ?? "")

export async function queryGemini(prompt: string): Promise<{ response: string; model: string; tokensUsed: number }> {
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" })
  const result = await model.generateContent({
    contents: [{ role: "user", parts: [{ text: prompt }] }],
    generationConfig: { maxOutputTokens: 300 },
  })

  const response = result.response
  const text = response.text()
  const usage = response.usageMetadata

  return {
    response: text,
    model: "gemini-1.5-flash",
    tokensUsed: (usage?.totalTokenCount) ?? 0,
  }
}
