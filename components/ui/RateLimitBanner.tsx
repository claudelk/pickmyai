export function RateLimitBanner() {
  return (
    <div className="w-full max-w-2xl mx-auto p-4 bg-amber-50 border border-amber-200 rounded-lg text-center">
      <p className="text-sm text-amber-800">
        You have used all three free comparisons for today. Come back tomorrow, or{" "}
        <span className="text-amber-400 cursor-default">create a free account</span>{" "}
        to unlock more.
      </p>
    </div>
  )
}
