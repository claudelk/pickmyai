"use client"

interface UseCaseToggleProps {
  mode: "individual" | "business"
  onToggle: (mode: "individual" | "business") => void
}

export function UseCaseToggle({ mode, onToggle }: UseCaseToggleProps) {
  return (
    <div className="inline-flex rounded-xl border border-warm-200 p-1 bg-white" role="tablist">
      <button
        role="tab"
        aria-selected={mode === "individual"}
        onClick={() => onToggle("individual")}
        className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors duration-200 ${
          mode === "individual"
            ? "bg-accent-500 text-white"
            : "text-warm-500 hover:text-warm-700"
        }`}
      >
        For individuals
      </button>
      <button
        role="tab"
        aria-selected={mode === "business"}
        onClick={() => onToggle("business")}
        className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors duration-200 ${
          mode === "business"
            ? "bg-accent-500 text-white"
            : "text-warm-500 hover:text-warm-700"
        }`}
      >
        For businesses
      </button>
    </div>
  )
}
