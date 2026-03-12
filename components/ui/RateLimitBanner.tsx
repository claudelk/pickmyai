export function RateLimitBanner() {
  return (
    <div className="w-full max-w-2xl mx-auto p-4 bg-accent-50 border border-accent-200 rounded-xl text-center">
      <p className="text-sm text-accent-800">
        You have used all three free comparisons for today. Come back tomorrow, or{" "}
        <span className="text-accent-400 cursor-default">create a free account</span>{" "}
        to unlock more.
      </p>
    </div>
  )
}
