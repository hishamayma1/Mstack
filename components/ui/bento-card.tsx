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
}: {
  children: ReactNode
  className?: string
  delay?: number
}) {
  // ~500ms of stagger compresses into ~24% of the entry range, which reads
  // the same on screen. Capped so a long grid's last card still animates.
  const start = Math.min(delay / 20, 24)

  return (
    <div
      className={`${styles.reveal} group relative rounded-2xl border border-white/[0.08] bg-[#10141f] overflow-hidden transition-colors duration-300 hover:border-blue-500/30 hover:bg-[#131a29] ${className}`}
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
        style={{ background: "radial-gradient(400px circle at var(--mouse-x, 50%) var(--mouse-y, 50%), rgba(59,130,246,0.12), transparent 60%)" }}
      />
      {children}
    </div>
  )
}
