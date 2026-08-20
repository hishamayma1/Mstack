"use client"

import { useRef, useState, type KeyboardEvent } from "react"
import Link from "next/link"
import { Chevron } from "@/components/ui/chevron"
import { INDUSTRIES } from "@/lib/content/site"

// The interactive half of the industries section — the only part that needs
// a client boundary, kept in its own file so the section's heading and copy
// stay on the server.
//
// The old version advanced itself every 3.2 seconds. That is the single most
// common complaint about a panel like this: the visitor starts reading, the
// text is replaced, and the CTA they were about to click has become a
// different sector's CTA. It also needed an IntersectionObserver, a pause ref,
// a progress bar to apologise for the movement, and a "the user took over"
// flag — a lot of machinery in service of a behaviour nobody asked for.
//
// This is a plain tab list. It moves when the visitor moves it, supports the
// standard arrow-key contract, and needs none of that.
export function IndustryTabs() {
  const [active, setActive] = useState(0)
  const tabsRef = useRef<(HTMLButtonElement | null)[]>([])

  function onKeyDown(e: KeyboardEvent<HTMLDivElement>) {
    const last = INDUSTRIES.length - 1
    let next: number | null = null

    if (e.key === "ArrowDown" || e.key === "ArrowRight") next = active === last ? 0 : active + 1
    else if (e.key === "ArrowUp" || e.key === "ArrowLeft") next = active === 0 ? last : active - 1
    else if (e.key === "Home") next = 0
    else if (e.key === "End") next = last

    if (next === null) return
    e.preventDefault()
    setActive(next)
    tabsRef.current[next]?.focus()
  }

  const industry = INDUSTRIES[active]

  return (
    <div className="grid gap-3 lg:grid-cols-12 lg:items-start">
      <div
        role="tablist"
        aria-label="Industries"
        aria-orientation="vertical"
        onKeyDown={onKeyDown}
        className="flex flex-col gap-1 lg:col-span-4"
      >
        {INDUSTRIES.map((s, i) => {
          const isActive = active === i
          return (
            <button
              key={s.num}
              ref={(el) => {
                tabsRef.current[i] = el
              }}
              role="tab"
              id={`industry-tab-${s.num}`}
              aria-selected={isActive}
              aria-controls="industry-panel"
              tabIndex={isActive ? 0 : -1}
              onClick={() => setActive(i)}
              className={`group flex items-center gap-3 rounded-lg px-4 py-3 text-left transition-colors ${
                isActive
                  ? "bg-blue-500/[0.12] text-white"
                  : "text-white/55 hover:bg-white/[0.04] hover:text-white/85"
              }`}
            >
              <span
                aria-hidden="true"
                className={`font-ibm-plex text-[11px] tabular-nums tracking-[0.15em] transition-colors ${
                  isActive ? "text-blue-300/90" : "text-white/25"
                }`}
              >
                {s.num}
              </span>
              <span className="text-[0.9375rem] font-light">{s.title}</span>
              <Chevron
                className={`ml-auto shrink-0 transition-all ${
                  isActive
                    ? "translate-x-0 text-blue-300/90 opacity-100"
                    : "-translate-x-1 opacity-0 group-hover:translate-x-0 group-hover:opacity-60"
                }`}
              />
            </button>
          )
        })}
      </div>

      {/* Fixed minimum height so switching sectors never jumps the page. */}
      <div
        role="tabpanel"
        id="industry-panel"
        aria-labelledby={`industry-tab-${industry.num}`}
        tabIndex={-1}
        className="flex min-h-[340px] flex-col justify-center rounded-2xl border border-white/[0.07] bg-white/[0.02] p-8 md:p-10 lg:col-span-8"
      >
        <p className="font-ibm-plex text-[11px] uppercase tracking-[0.2em] text-blue-300/70">
          {industry.num} / {String(INDUSTRIES.length).padStart(2, "0")}
        </p>
        <h3 className="mt-4 text-[1.75rem] font-light leading-tight tracking-tight md:text-[2rem]">
          {industry.title}
        </h3>
        <p className="mt-5 max-w-[58ch] text-[0.9375rem] leading-[1.8] text-white/55">{industry.desc}</p>

        <Link
          href={industry.slug ? `/industries/${industry.slug}` : "/industries"}
          className="group mt-8 inline-flex w-fit items-center gap-2 rounded-xl bg-blue-600 px-6 py-3 text-sm font-medium tracking-wide text-white transition-colors hover:bg-blue-500"
        >
          {industry.slug ? `${industry.title} solutions` : "Browse all sectors"}
          <Chevron className="transition-transform group-hover:translate-x-0.5" />
        </Link>
      </div>
    </div>
  )
}
