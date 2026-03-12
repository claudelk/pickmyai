import { Ratelimit } from "@upstash/ratelimit"
import { Redis } from "@upstash/redis"

// At MVP with mock keys, this will fail gracefully.
// Replace UPSTASH env vars with real ones for production.
let ratelimit: Ratelimit | null = null

try {
  ratelimit = new Ratelimit({
    redis: Redis.fromEnv(),
    limiter: Ratelimit.slidingWindow(3, "24 h"),
    analytics: true,
  })
} catch {
  // Silently fail in dev when Upstash keys are mock
  console.warn("Upstash rate limiting not configured. Skipping rate limit.")
}

export async function checkRateLimit(ip: string): Promise<{ success: boolean; remaining: number }> {
  if (!ratelimit) {
    return { success: true, remaining: 3 }
  }

  try {
    const result = await ratelimit.limit(ip)
    return { success: result.success, remaining: result.remaining }
  } catch {
    // If rate limiting fails, allow the request
    return { success: true, remaining: 3 }
  }
}
