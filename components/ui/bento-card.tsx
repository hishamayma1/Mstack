import type { CSSProperties, ReactNode } from "react"
import styles from "./reveal.module.css"

// Scroll-reveal card shell used across every section grid.
//
// Server component: the reveal is a native scroll-driven CSS animation, so
// this ships no JavaScript at all. It previously ran an IntersectionObserver
// per card, which made every grid on the site a client boundary.
//
// `delay` keeps its old meaning (a stagger in ms) but now maps onto the
// animation's scroll range rather than a time offset, so cards still cascade
// as the grid enters the viewport.
export function BentoCard({
  children,
  className = "",
  delay = 0,
  theme,
}: {
  children: ReactNode
  className?: string
  delay?: number
  /** A service accent (lib/service-theme.ts) — tints the hover border and glow. */
  theme?: string
}) {
  // ~500ms of stagger compresses into ~24% of the entry range, which reads
  // the same on screen. Capped so a long grid's last card still animates.
  const start = Math.min(delay / 20, 24)

  return (
    <div
      data-svc={theme}
      className={`${styles.reveal} group relative isolate rounded-2xl border border-border bg-card overflow-hidden transition-colors duration-300 hover:border-svc/35 hover:bg-accent/40 ${className}`}
      style={
        {
          "--reveal-start": `${start}%`,
          "--reveal-end": `${start + 42}%`,
        } as CSSProperties
      }
    >
      {/* Hover glow spot — follows the pointer via CSS vars set by MouseGlowGrid */}
      <div
        className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{ background: "radial-gradient(400px circle at var(--mouse-x, 50%) var(--mouse-y, 50%), color-mix(in oklch, var(--svc) 14%, transparent), transparent 60%)" }}
      />
      {children}
    </div>
  )
}
