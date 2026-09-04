import type { CSSProperties, ReactNode } from "react"
import { RevealText } from "@/components/ui/reveal-text"
import motion from "@/components/ui/motion.module.css"
import { stagger } from "@/lib/motion"

// Re-exported so a section file can pull its whole vocabulary from one place.
export { Chevron } from "@/components/ui/chevron"

// ── The homepage's structural vocabulary ────────────────────────────────────
//
// Every section on the page used to open with the same recipe — a hairline
// border, py-32, an animated icon, a Tag, a 5xl heading, a card wall. Twelve
// of them in a row read as one undifferentiated scroll.
//
// These primitives replace that. A section declares a *tone* (which surface it
// sits on) and a *size* (how much air it gets), and the alternation between
// tones is what separates one idea from the next — the way the reference sites
// do it — rather than a 1px line doing all the work.

type Tone = "base" | "raised" | "accent"
type Size = "sm" | "md" | "lg"

const TONE: Record<Tone, string> = {
  // The page's own ground — transparent, not an opaque fill, so the body's
  // background (a flat color in dark mode, a soft blue gradient in light
  // mode; see --page-gradient in globals.css) shows through every "base"
  // section instead of being painted over by a same-color solid.
  base: "",
  // One step up, with hairlines top and bottom. Used for every other band.
  raised: "bg-card border-y border-border",
  // The two bands that ask for something: proof, and the offer.
  accent: "border-y border-border bg-accent/30",
}

const SIZE: Record<Size, string> = {
  sm: "py-12 md:py-14",
  md: "py-20 md:py-28",
  lg: "py-24 md:py-32",
}

export function Section({
  id,
  tone = "base",
  size = "md",
  className = "",
  innerClassName = "",
  // Slow-drifting glow behind the content. Only for bands the reader dwells
  // on — proof and the health-check offer. Anywhere else it is just noise.
  aurora = false,
  children,
}: {
  id?: string
  tone?: Tone
  size?: Size
  className?: string
  innerClassName?: string
  aurora?: boolean
  children: ReactNode
}) {
  // `overflow-hidden` is applied only when there is an aurora to clip. An
  // ancestor with `overflow: hidden` silently kills `position: sticky` in
  // every descendant, so it stays off unless the band actually needs it.
  const clip = aurora ? "overflow-hidden" : ""

  return (
    <section
      id={id}
      className={`relative ${clip} ${TONE[tone]} ${SIZE[size]} px-6 md:px-10 lg:px-12 ${className}`}
    >
      {/* The band announces itself: a light line draws across the top edge as
          the section enters. Sits over the border, so `base` sections (which
          have none) get the same signal. */}
      {tone !== "base" ? (
        <span
          aria-hidden="true"
          className={`${motion.topLine} pointer-events-none absolute inset-x-0 top-0 h-px bg-[linear-gradient(90deg,transparent,rgba(96,165,250,0.45),transparent)]`}
        />
      ) : null}

      {aurora ? (
        <span
          aria-hidden="true"
          className={`${motion.aurora} pointer-events-none absolute left-1/2 top-1/2 -z-0 h-[130%] w-[80%] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-70 blur-3xl`}
          style={{
            background:
              "radial-gradient(closest-side, rgba(37,99,235,0.16), rgba(37,99,235,0.05) 55%, transparent 75%)",
          }}
        />
      ) : null}

      <div className={`relative z-10 mx-auto w-full max-w-6xl ${innerClassName}`}>{children}</div>
    </section>
  )
}

// Kicker above a section heading. Replaces the grey Tag pill — a coloured caps
// line is quieter and puts the emphasis on the heading under it, which is what
// every reference site does.
//
// The leading rule draws itself in as the heading arrives, which ties the
// eyebrow to the band's own top line.
export function Eyebrow({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <p className={`flex items-center gap-3 ${className}`}>
      <span
        aria-hidden="true"
        className={`${motion.drawX} h-px w-8 shrink-0 bg-blue-400/50`}
        style={{ "--m-end": "50%" } as CSSProperties}
      />
      <span className="text-[11px] font-medium uppercase tracking-[0.2em] text-blue-600 dark:text-blue-300/75">
        {children}
      </span>
    </p>
  )
}

// Eyebrow + heading + optional lead, at one fixed rhythm.
//
// The type scale is deliberately smaller than the old 4xl/5xl: at 5xl a
// heading and its body copy were only two steps apart, so nothing looked
// primary. Here the heading is ~2.5rem and body is 15px, which is the ratio
// the reference sites read comfortably at.
//
// The three parts arrive in reading order — rule, heading words, lead — so the
// block assembles itself top to bottom rather than appearing all at once.
export function SectionIntro({
  eyebrow,
  title,
  lead,
  align = "left",
  className = "",
  children,
}: {
  eyebrow?: string
  title: string
  lead?: string
  align?: "left" | "center"
  className?: string
  children?: ReactNode
}) {
  const centered = align === "center"
  return (
    <div className={`${centered ? "mx-auto max-w-2xl text-center" : "max-w-2xl"} ${className}`}>
      {eyebrow ? (
        <Eyebrow className={`${motion.fade} ${centered ? "justify-center" : ""}`}>{eyebrow}</Eyebrow>
      ) : null}
      <RevealText
        stagger={2}
        className={`${eyebrow ? "mt-4" : ""} text-[2rem] md:text-[2.5rem] font-light leading-[1.12] tracking-tight text-foreground`}
      >
        {title}
      </RevealText>
      {lead ? (
        <p
          className={`${motion.rise} mt-5 text-[0.975rem] leading-[1.75] text-muted-foreground ${centered ? "mx-auto" : ""} max-w-[52ch]`}
          style={stagger(2)}
        >
          {lead}
        </p>
      ) : null}
      {children}
    </div>
  )
}
