import { NextRequest } from "next/server"
import { getRecommendedPlatform } from "@/lib/recommend"

export async function POST(request: NextRequest) {
  let body: { useCaseTag?: string }
  try {
    body = await request.json()
  } catch {
    return Response.json({ error: "Invalid request body" }, { status: 400 })
  }

  const recommended = getRecommendedPlatform(body.useCaseTag)
  return Response.json({ recommended })
}
