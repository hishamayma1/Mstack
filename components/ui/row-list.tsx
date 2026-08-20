import type { ReactNode } from "react"
import Link from "next/link"
import { Chevron } from "@/components/ui/chevron"
import motion from "@/components/ui/motion.module.css"
import { stagger } from "@/lib/motion"

// ── Hairline row lists ──────────────────────────────────────────────────────
//
// The homepage kept rendering sets of five and six items as walls of bordered
// cards. Six cards of equal weight force the eye to compare them; a divided
// list lets it scan them. The reference sites use exactly this for anything
// that is a *sequence* or a *menu* rather than a set of peers — which covers
// the problem list and the service levels.
//
// Motion does two jobs here. On entry the rows arrive in order, one after the
// next, which reinforces that the list is ordered. On hover a link row grows
// an accent bar and washes blue from the left — a list row is a large target
// with no border to light up, so without that it gives no feedback at all.
//
// Server components: no state, no handlers.

export function RowList({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <ul className={`divide-y divide-white/[0.07] border-y border-white/[0.07] ${className}`}>
      {children}
    </ul>
  )
}

// One row. `href` turns the whole row into a link (with the chevron and the
// hover treatment); without it the row is static content.
//
// The index is rendered as a monospaced ordinal rather than a filled badge —
// it orders the list without competing with the title for attention.
export function Row({
  index,
  title,
  desc,
  meta,
  href,
  accent,
  // Position in the list, so the row knows when its turn to arrive is.
  order = 0,
  children,
}: {
  index?: string
  title: string
  desc?: string
  /** Right-hand column: a price, a chip, a duration. */
  meta?: ReactNode
  href?: string
  /** Optional coloured dot before the title — used to code rows by category. */
  accent?: string
  order?: number
  children?: ReactNode
}) {
  const body = (
    <div className="flex flex-col gap-3 py-6 sm:flex-row sm:items-baseline sm:gap-8">
      {index ? (
        <span className="shrink-0 pt-0.5 font-ibm-plex text-[11px] tabular-nums tracking-[0.2em] text-white/25 transition-colors duration-300 group-hover:text-blue-300/80 sm:w-10">
          {index}
        </span>
      ) : null}

      <div className="min-w-0 flex-1">
        <h3 className="flex items-center gap-2.5 text-[1.0625rem] font-light leading-snug text-[#F3F5FA]">
          {accent ? (
            <span
              aria-hidden="true"
              className={`h-1.5 w-1.5 shrink-0 rounded-full transition-transform duration-300 group-hover:scale-150 ${accent}`}
            />
          ) : null}
          <span className={href ? "transition-colors duration-300 group-hover:text-blue-300" : undefined}>
            {title}
          </span>
        </h3>
        {desc ? <p className="mt-2 max-w-[62ch] text-[0.9375rem] leading-[1.7] text-white/50">{desc}</p> : null}
        {children}
      </div>

      {meta || href ? (
        <div className="flex shrink-0 items-center gap-4 sm:justify-end">
          {meta}
          {href ? (
            <Chevron className="text-white/25 transition-all duration-300 group-hover:translate-x-1 group-hover:text-blue-300" />
          ) : null}
        </div>
      ) : null}
    </div>
  )

  // Static rows still get the hover wash — they are wide enough that the
  // pointer needs somewhere to land — but no accent bar or chevron, since
  // there is nowhere to go.
  if (!href) {
    return (
      <li className={`${motion.rise} ${motion.row} ${motion.rowQuiet} group -mx-4 px-4`} style={stagger(order)}>
        {body}
      </li>
    )
  }

  return (
    <li className={motion.rise} style={stagger(order)}>
      <Link
        href={href}
        className={`${motion.row} group -mx-4 block rounded-xl px-4 transition-colors hover:bg-white/[0.02] focus-visible:bg-white/[0.03] focus-visible:outline-none`}
      >
        {body}
      </Link>
    </li>
  )
}
