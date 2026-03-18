"use client"

interface LogoProps {
  variant?: "a" | "d"
  className?: string
}

/**
 * Variant A: Weight-contrast wordmark
 *   "pick" light, "my" regular, "AI" bold — clean Inter sans-serif
 *
 * Variant D: Inline SVG icon + wordmark
 *   Two overlapping circles (comparison) + clean wordmark
 */
export function Logo({ variant = "a", className = "" }: LogoProps) {
  if (variant === "d") {
    return (
      <span className={`inline-flex items-center gap-2 ${className}`}>
        {/* Two overlapping circles — representing comparison/choice */}
        <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg" className="flex-shrink-0">
          <circle cx="10.5" cy="14" r="8.5" stroke="currentColor" strokeWidth="1.8" opacity="0.5" />
          <circle cx="17.5" cy="14" r="8.5" stroke="currentColor" strokeWidth="1.8" />
          {/* Subtle checkmark in the overlap zone */}
          <path d="M12 14.5l1.5 1.5 3-3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        <span className="text-[19px] tracking-tight leading-none">
          <span className="font-light">pick</span>
          <span className="font-normal">my</span>
          <span className="font-bold">ai</span>
        </span>
      </span>
    )
  }

  // Variant A: Weight-contrast wordmark
  return (
    <span className={`text-xl tracking-tight leading-none ${className}`}>
      <span className="font-light">pick</span>
      <span className="font-normal">my</span>
      <span className="font-bold uppercase text-[1.05em]">AI</span>
    </span>
  )
}
