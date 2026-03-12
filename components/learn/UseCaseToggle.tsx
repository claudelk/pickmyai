"use client"

interface UseCaseToggleProps {
  mode: "individual" | "business"
  onToggle: (mode: "individual" | "business") => void
}

export function UseCaseToggle({ mode, onToggle }: UseCaseToggleProps) {
  return (
    <div className="inline-flex rounded-lg border border-slate-200 p-1" role="tablist">
      <button
        role="tab"
        aria-selected={mode === "individual"}
        onClick={() => onToggle("individual")}
        className={`px-4 py-2 text-sm font-medium rounded-md transition-colors duration-200 ${
          mode === "individual"
            ? "bg-[#2563EB] text-white"
            : "text-slate-500 hover:text-slate-700"
        }`}
      >
        For individuals
      </button>
      <button
        role="tab"
        aria-selected={mode === "business"}
        onClick={() => onToggle("business")}
        className={`px-4 py-2 text-sm font-medium rounded-md transition-colors duration-200 ${
          mode === "business"
            ? "bg-[#2563EB] text-white"
            : "text-slate-500 hover:text-slate-700"
        }`}
      >
        For businesses
      </button>
    </div>
  )
}
