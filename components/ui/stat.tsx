import type { CSSProperties } from "react"
import motion from "@/components/ui/motion.module.css"
import { stagger } from "@/lib/motion"

// A single proof figure: the number large and light, the label small and quiet
// under it. Four of them carry the proof band on their own.
//
// `countTo` makes the figure count up as the band scrolls into view, in pure
// CSS — a registered `<integer>` custom property is animatable, and counter()
// renders it. See the @property block in motion.module.css.
//
// The fallback is the part worth knowing about: --m-count-to is also the
// property's resting value, so a browser that can't run scroll-driven
// animations (Firefox today) simply prints the final number. It never shows a
// zero that fails to move, which is the usual failure mode of a JS counter
// that never fires.
//
// Figures that aren't numbers — the star rating — just pass `value` and skip
// the count entirely.
export function Stat({
  value,
  label,
  countTo,
  suffix = "",
  order = 0,
}: {
  /** Rendered as-is when `countTo` is absent. */
  value?: string
  label: string
  /** Count from 0 to this on entry. */
  countTo?: number
  /** Printed after the counted number, e.g. "+". */
  suffix?: string
  order?: number
}) {
  return (
    <div className={motion.rise} style={stagger(order, 5)}>
      <dd className="font-ibm-plex text-[2.25rem] font-light leading-none tracking-tight text-[#F3F5FA] md:text-[2.75rem]">
        {countTo !== undefined ? (
          <>
            {/* The digits are generated content in ::after. Hidden from
                assistive tech — a live counter would otherwise be announced as
                a stream of changing numbers — with the settled figure given
                once, in text, alongside it. */}
            <span aria-hidden="true">
              <span className={motion.count} style={{ "--m-count-to": countTo } as CSSProperties} />
              {suffix}
            </span>
            <span className="sr-only">
              {countTo}
              {suffix}
            </span>
          </>
        ) : (
          value
        )}
      </dd>
      <dt className="mt-3 text-[11px] uppercase tracking-[0.18em] text-white/40">{label}</dt>
    </div>
  )
}
