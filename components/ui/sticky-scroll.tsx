"use client"

import { useEffect, useRef, useState } from "react"
import type { ReactNode } from "react"
import Link from "next/link"
import { AppLogo } from "@/components/ui/app-logo"
import type { AppLogoSlug } from "@/lib/content/app-logos"
import motion from "@/components/ui/motion.module.css"

// ── Sticky scroll reveal ────────────────────────────────────────────────────
//
// The Aceternity pattern, rebuilt on this page's own vocabulary: a column of
// entries scrolls past on the left while a single panel on the right stays
// pinned and swaps its contents to whichever entry currently owns the middle
// of the screen.
//
// Two deliberate departures from the original:
//
//   No animation library. The original drives everything from framer-motion's
//   scroll progress; all that is actually needed is "which entry is in the
//   middle", which one IntersectionObserver answers, and the swap itself is
//   the `swap` keyframe this page already uses for the industries panel. That
//   keeps the dependency list where it is.
//
//   It stops being sticky below `lg`. A pinned panel needs a viewport wide
//   enough to hold it beside the text; on a phone there is no beside, and the
//   usual result is a panel that eats the screen while the list scrolls under
//   it. So on small screens each entry carries its own detail inline and the
//   panel is not rendered at all.

export type StickyScrollItem = {
  id: string
  /** Ordinal shown as the big figure, e.g. "01". */
  index: string
  title: string
  desc: string
  /** Product marks for this entry, shown large in the panel. */
  logos?: AppLogoSlug[]
  /** Supporting detail — a price, a duration. */
  meta?: ReactNode
  href?: string
  /** Link text. */
  cta?: string
  /** A service accent (lib/service-theme.ts). Omitted, the brand blue. */
  theme?: string
}

export function StickyScroll({ items, ariaLabel }: { items: StickyScrollItem[]; ariaLabel: string }) {
  const [active, setActive] = useState(0)
  const refs = useRef<(HTMLLIElement | null)[]>([])

  useEffect(() => {
    // A thin band across the middle of the viewport: an entry becomes active
    // the moment it crosses it. Choosing the "most visible" entry instead
    // makes the panel flicker between two of them whenever one is only half
    // on screen, which is most of the time on a tall entry.
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue
          const i = refs.current.indexOf(entry.target as HTMLLIElement)
          if (i !== -1) setActive(i)
        }
      },
      { rootMargin: "-48% 0px -48% 0px", threshold: 0 },
    )

    for (const el of refs.current) if (el) observer.observe(el)
    return () => observer.disconnect()
  }, [items.length])

  const current = items[active] ?? items[0]
  if (!current) return null

  return (
    <div className="grid gap-10 lg:grid-cols-12 lg:gap-14">
      {/* ── The scrolling column ─────────────────────────────────────────── */}
      <ol aria-label={ariaLabel} className="lg:col-span-6 xl:col-span-5">
        {items.map((item, i) => {
          const on = i === active
          return (
            <li
              key={item.id}
              ref={(el) => {
                refs.current[i] = el
              }}
              data-svc={item.theme}
              className="relative border-l border-border pl-6 md:pl-8"
            >
              {/* The lit segment travels down the rail, which is the only
                  progress indicator the section needs. It wears the entry's
                  own accent, so the colour changes as you move down. */}
              <span
                aria-hidden="true"
                className={`absolute -left-px top-0 h-full w-0.5 origin-top bg-linear-to-b from-svc to-svc-2/15 transition-transform duration-500 ease-out ${
                  on ? "scale-y-100" : "scale-y-0"
                }`}
              />

              <div className="py-9 md:py-12 lg:py-16">
                <div className="flex items-baseline gap-4">
                  <span
                    className={`font-ibm-plex text-[11px] tabular-nums tracking-[0.2em] transition-colors duration-500 ${
                      on ? "text-svc-ink" : "text-muted-foreground"
                    }`}
                  >
                    {item.index}
                  </span>
                  {/* Dimmed only from `lg` up. Below that there is no panel
                      showing the active entry, so dimming the others would
                      just be four fifths of the section made hard to read. */}
                  <h3
                    className={`text-[1.25rem] font-light leading-snug text-foreground transition-colors duration-500 md:text-[1.5rem] ${
                      on ? "" : "lg:text-muted-foreground"
                    }`}
                  >
                    {item.title}
                  </h3>
                </div>

                <p
                  className={`mt-3 max-w-[46ch] text-[0.9375rem] leading-[1.7] text-muted-foreground transition-colors duration-500 ${
                    on ? "" : "lg:text-muted-foreground/60"
                  }`}
                >
                  {item.desc}
                </p>

                {item.meta ? <div className="mt-4 text-[0.8125rem] text-muted-foreground">{item.meta}</div> : null}

                {/* Small screens get the detail inline, since there is no
                    panel to put it in. */}
                <div className="lg:hidden">
                  <Detail item={item} compact />
                </div>
              </div>
            </li>
          )
        })}
      </ol>

      {/* ── The pinned panel ─────────────────────────────────────────────── */}
      <div className="hidden lg:col-span-6 lg:block xl:col-span-7">
        <div className="sticky top-28">
          {/* The panel takes on the active entry's accent, so scrolling from
              one level to the next visibly changes the room you're in. */}
          <div
            data-svc={current.theme}
            className="relative overflow-hidden rounded-2xl border border-svc/25 bg-card p-8 transition-colors duration-500 xl:p-10"
          >
            <span
              aria-hidden="true"
              className="pointer-events-none absolute inset-x-0 top-0 h-1 bg-linear-to-r from-svc to-svc-2"
            />
            <span
              aria-hidden="true"
              className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full bg-[radial-gradient(closest-side,color-mix(in_oklch,var(--svc)_28%,transparent),transparent)] blur-2xl"
            />
            <span
              aria-hidden="true"
              className="pointer-events-none absolute -bottom-20 -left-10 h-56 w-56 rounded-full bg-[radial-gradient(closest-side,color-mix(in_oklch,var(--svc-2)_20%,transparent),transparent)] blur-2xl"
            />

            {/* Re-keyed on the active entry, so the swap keyframe replays on
                every change rather than only on first mount. */}
            <div key={current.id} className={`${motion.swap} relative`}>
              <span
                aria-hidden="true"
                className="block bg-linear-to-br from-svc to-svc-2 bg-clip-text font-ibm-plex text-[3.5rem] font-light leading-none tracking-tight text-transparent"
              >
                {current.index}
              </span>

              <h4 className="mt-6 text-[1.75rem] font-light leading-tight tracking-tight text-foreground xl:text-[2rem]">
                {current.title}
              </h4>
              <p className="mt-4 max-w-[48ch] text-[0.9375rem] leading-[1.75] text-muted-foreground">
                {current.desc}
              </p>

              <Detail item={current} />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// The half of an entry that appears either in the panel (desktop) or under the
// entry itself (small screens): the products it deploys, and the way through.
//
// In the panel each mark is a named tile, because there is room for the name
// and a stranger cannot be expected to recognise a Purview icon. Inline, the
// same marks run bare and small — they are a reminder there, not a legend.
function Detail({ item, compact = false }: { item: StickyScrollItem; compact?: boolean }) {
  return (
    <>
      {item.logos?.length ? (
        <ul
          aria-label={`Products included in ${item.title}`}
          className={`flex flex-wrap items-center ${compact ? "mt-5 gap-2" : "mt-8 gap-2.5"}`}
        >
          {item.logos.map((slug) => (
            <li
              key={slug}
              className={
                compact
                  ? undefined
                  : "flex items-center gap-2.5 rounded-xl border border-border bg-card px-3 py-2 transition-colors duration-300 hover:border-svc/30"
              }
            >
              <AppLogo slug={slug} size={compact ? 22 : 28} showName={!compact} />
            </li>
          ))}
        </ul>
      ) : null}

      {item.href ? (
        <Link
          href={item.href}
          className={`${motion.link} group inline-flex items-center gap-2 text-[0.875rem] tracking-wide text-svc-ink transition-opacity hover:opacity-80 ${
            compact ? "mt-5" : "mt-8"
          }`}
        >
          {item.cta ?? "Learn more"}
          <svg
            aria-hidden="true"
            viewBox="0 0 16 16"
            className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
          >
            <path d="M6 3.5 10.5 8 6 12.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </Link>
      ) : null}
    </>
  )
}
