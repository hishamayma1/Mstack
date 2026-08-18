import type { ReactNode } from "react"

// Pure presentational pill — no hooks, no "use client", so server sections
// can render it without pulling in a client boundary of their own.
export function Tag({ children }: { children: ReactNode }) {
  return (
    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] tracking-widest font-sans text-white/50 bg-white/[0.06]">
      {children}
    </span>
  )
}
