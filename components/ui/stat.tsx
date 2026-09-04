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
// the count entirely. Those want `mark` as well: a five-star run set at the
// numeral size is roughly 180px wide, which is wider than a stat column on
// any phone, so it used to spill over the figure beside it. Set smaller and
// tracked out, it fits its column and still reads as the same rank of thing.
//
// `srValue` is what a screen reader hears instead of the raw glyphs, which it
// would otherwise announce one "black star" at a time.
export function Stat({
  value,
  label,
  countTo,
  suffix = "",
  order = 0,
  mark = false,
  srValue,
}: {
  /** Rendered as-is when `countTo` is absent. */
  value?: string
  label: string
  /** Count from 0 to this on entry. */
  countTo?: number
  /** Printed after the counted number, e.g. "+". */
  suffix?: string
  order?: number
  /** The value is a run of glyphs, not a number — set it smaller. */
  mark?: boolean
  /** Spoken in place of `value`. */
  srValue?: string
}) {
  return (
    <div className={motion.rise} style={stagger(order, 5)}>
      <dd
        className={`flex min-h-[2.25rem] items-center font-ibm-plex font-light leading-none text-foreground md:min-h-[2.75rem] ${
          mark
            ? "text-[1.375rem] tracking-[0.14em] text-blue-600 dark:text-blue-300/90 md:text-[1.625rem]"
            : "text-[2.25rem] tracking-tight md:text-[2.75rem]"
        }`}
      >
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
        ) : srValue ? (
          <>
            <span aria-hidden="true">{value}</span>
            <span className="sr-only">{srValue}</span>
          </>
        ) : (
          value
        )}
      </dd>
      {/* `text-balance` keeps a two-word label from leaving one word alone on
          the second line, which is what made the row of figures look ragged
          at the widths where "Years on Microsoft 365" has to wrap. */}
      <dt className="mt-3 text-balance text-[11px] uppercase leading-[1.5] tracking-[0.16em] text-muted-foreground">
        {label}
      </dt>
    </div>
  )
}
