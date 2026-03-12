interface ImagePlaceholderProps {
  id: string
  label: string
  aspectRatio: string
  className?: string
}

export function ImagePlaceholder({ id, label, aspectRatio, className }: ImagePlaceholderProps) {
  return (
    <div
      className={`${aspectRatio} w-full rounded-2xl bg-accent-50 border-2 border-dashed border-accent-200 flex flex-col items-center justify-center gap-2 ${className ?? ""}`}
      aria-label={`Illustration placeholder: ${label}`}
    >
      <span className="text-3xl" aria-hidden="true">🎨</span>
      <span className="text-sm font-medium text-accent-700 text-center px-4">{label}</span>
      <span className="text-xs text-accent-500 text-center px-4 font-mono">{id}</span>
    </div>
  )
}
