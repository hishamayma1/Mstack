import type { ReactNode } from "react"
import motion from "@/components/ui/motion.module.css"
import { stagger } from "@/lib/motion"

// ── Feature bento ───────────────────────────────────────────────────────────
//
// Aceternity's BentoGrid / BentoGridItem, rebuilt on this page's tokens.
//
// The structure is the original's and it is the part that matters: a fixed
// row height, cells that span one or two columns, and inside each cell a
// visual on top with the icon, title and copy pushed to the bottom by
// `justify-between`. The signature interaction is kept too — on hover the
// whole text block slides right a notch while the visual reacts on its own.
//
// What changed: no `motion/react` and no `@tabler/icons-react`. Every movement
// in the original demo is an x-translate, a rotate or a width — things CSS
// transitions do natively off `group-hover`, with no client boundary and no
// two new dependencies. The palette is this site's, and the light-mode half of
// every class is gone, since this page has no light mode.

export function FeatureGrid({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <div className={`grid grid-cols-1 gap-4 md:auto-rows-[19rem] md:grid-cols-3 ${className}`}>
      {children}
    </div>
  )
}

export function FeatureCard({
  title,
  desc,
  icon,
  /** The animated panel that fills the top of the cell. */
  visual,
  /** Columns to span on the 3-column desktop grid. */
  span = 1,
  order = 0,
}: {
  title: string
  desc: string
  icon: ReactNode
  visual: ReactNode
  span?: 1 | 2
  order?: number
}) {
  return (
    // `bento-cell` is the hover hook a cell's visual keys its own animations
    // off — see differentiator-visuals.module.css.
    <div
      className={`${motion.rise} bento-cell group/cell flex flex-col justify-between gap-4 overflow-hidden rounded-2xl border border-border bg-card p-4 transition-colors duration-300 hover:border-blue-400/20 hover:bg-accent/40 ${
        span === 2 ? "md:col-span-2" : "md:col-span-1"
      }`}
      style={stagger(order, 4)}
    >
      {visual}

      {/* The original slides this block right on hover. It is the one thing
          that tells you the whole cell is a unit rather than a picture with a
          caption under it, so it stays. */}
      <div className="transition-transform duration-300 group-hover/cell:translate-x-1.5">
        <span className="mb-3 flex h-9 w-9 items-center justify-center rounded-lg border border-blue-500/25 bg-blue-500/10 text-blue-300/90 transition-colors duration-300 group-hover/cell:border-blue-400/45">
          {icon}
        </span>
        <h3 className="text-[1.0625rem] font-light leading-snug text-foreground">{title}</h3>
        <p className="mt-2 max-w-[46ch] text-[0.9375rem] leading-[1.7] text-muted-foreground">{desc}</p>
      </div>
    </div>
  )
}
