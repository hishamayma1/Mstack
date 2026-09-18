import type { ReactNode } from "react"
import Image from "next/image"
import motion from "@/components/ui/motion.module.css"
import { stagger } from "@/lib/motion"

// ── Bento cards ─────────────────────────────────────────────────────────────
//
// A card whose picture is not *inside* it. The media panel is inset from three
// edges and then pushed past the fourth, so it runs off the card and is cut by
// the card's own radius. That single move is what separates a bento grid from
// a wall of equal boxes: each cell reads as a window onto something larger
// rather than a finished tile, and the cut edge tells the eye which direction
// the grid is flowing.
//
// `media` decides which edge the picture escapes through:
//   "bottom" — text on top, picture falls out of the bottom (the common case)
//   "top"    — picture enters from the top, text sits under it
//
// Every panel is a placeholder until `src` is given, so the layout can be
// signed off before a single asset exists and the images can be dropped in
// later without touching a class name.
//
// Server components: no state, no handlers.

export function BentoGrid({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={`grid gap-4 md:grid-cols-12 md:gap-5 ${className}`}>{children}</div>
}

/** The inset-then-overflowing picture panel. Clipped by the card around it. */
function Media({
  src,
  alt,
  label,
  edge,
  className = "",
}: {
  src?: string
  alt?: string
  label?: string
  edge: "top" | "bottom"
  className?: string
}) {
  // Pushed past one edge and the right-hand one, so the panel is cut on two
  // sides. Cutting only the bottom reads as a cropped photo; cutting the
  // corner reads as a surface continuing underneath the card.
  const bleed = edge === "bottom" ? "-mb-px mt-8 -mr-px rounded-tl-2xl" : "-mt-px mb-8 -mr-px rounded-bl-2xl"

  return (
    <div
      className={`relative ml-6 flex-1 overflow-hidden border-l border-t border-border bg-card ${bleed} ${className}`}
    >
      {src ? (
        <Image src={src} alt={alt ?? ""} fill sizes="(max-width: 768px) 100vw, 50vw" className="object-cover object-left-top" />
      ) : (
        <>
          {/* Placeholder: a faint grid and a caption naming what belongs here,
              so an unfinished cell still looks deliberate in review. */}
          <span
            aria-hidden="true"
            className="absolute inset-0 opacity-[0.35]"
            style={{
              backgroundImage:
                "linear-gradient(rgba(var(--fg-rgb),0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(var(--fg-rgb),0.05) 1px, transparent 1px)",
              backgroundSize: "28px 28px",
            }}
          />
          <span
            aria-hidden="true"
            className="absolute inset-0 bg-[radial-gradient(120%_100%_at_20%_0%,rgba(37,99,235,0.16),transparent_70%),radial-gradient(90%_80%_at_100%_100%,rgba(8,145,178,0.12),transparent_70%)]"
          />
          {label ? (
            <span className="absolute bottom-5 left-5 font-ibm-plex text-[10px] uppercase tracking-[0.2em] text-muted-foreground/70">
              {label}
            </span>
          ) : null}
        </>
      )}
    </div>
  )
}

export function BentoCard({
  title,
  desc,
  meta,
  /** Column span on the 12-column desktop grid. */
  span = 6,
  /** Which edge the picture runs off through. */
  media = "bottom",
  src,
  alt,
  /** Caption shown while the panel is still a placeholder. */
  mediaLabel,
  minH = "min-h-[380px]",
  order = 0,
}: {
  title: string
  desc?: string
  meta?: ReactNode
  span?: 4 | 5 | 6 | 7 | 8
  media?: "top" | "bottom"
  src?: string
  alt?: string
  mediaLabel?: string
  minH?: string
  order?: number
}) {
  const SPAN: Record<number, string> = {
    4: "md:col-span-4",
    5: "md:col-span-5",
    6: "md:col-span-6",
    7: "md:col-span-7",
    8: "md:col-span-8",
  }

  const copy = (
    <div className="px-6 pt-6 md:px-8 md:pt-8">
      <div className="flex items-start justify-between gap-4">
        <h3 className="text-[1.0625rem] font-light leading-snug text-foreground">{title}</h3>
        {meta}
      </div>
      {desc ? <p className="mt-3 max-w-[46ch] text-[0.9375rem] leading-[1.7] text-muted-foreground">{desc}</p> : null}
    </div>
  )

  return (
    <article
      className={`${motion.rise} ${SPAN[span]} ${minH} group relative flex flex-col overflow-hidden rounded-2xl border border-border bg-card transition-colors duration-300 hover:border-accent`}
      style={stagger(order)}
    >
      {media === "top" ? (
        <>
          <Media src={src} alt={alt} label={mediaLabel} edge="top" />
          <div className="pb-6 md:pb-8">{copy}</div>
        </>
      ) : (
        <>
          {copy}
          <Media src={src} alt={alt} label={mediaLabel} edge="bottom" />
        </>
      )}
    </article>
  )
}
