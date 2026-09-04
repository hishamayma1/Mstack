"use client"

import { useState, useEffect, useRef, type CSSProperties } from "react"
import Link from "next/link"
import { SectionCTA } from "@/components/ui/section-cta"
import { useIndustryIndex, useUIActions, useUIStore } from "@/lib/store"
import { INDUSTRIES } from "@/lib/content/site"
import styles from "./industries-section.module.css"

const ADVANCE_MS = 3200

export function IndustriesSection() {
  const active = useIndustryIndex()
  const { setIndustryIndex } = useUIActions()
  const [visible, setVisible] = useState(true)
  // Once the visitor picks a sector, stop moving it under them.
  const [userPicked, setUserPicked] = useState(false)
  const sectionRef = useRef<HTMLElement>(null)
  const activeRowRef = useRef<HTMLButtonElement>(null)
  // Held in a ref, not state: the interval reads it without needing to be torn
  // down and rebuilt every time the pointer crosses the panel.
  const pausedRef = useRef(false)

  function selectIndustry(i: number) {
    if (i === active) return
    setUserPicked(true)
    setVisible(false)
    setTimeout(() => {
      setIndustryIndex(i)
      setVisible(true)
    }, 180)
  }

  // Auto-advance every 3.2s — but only while the section is actually on
  // screen and the visitor hasn't chosen a sector themselves. This used to
  // be an unconditional setInterval, which meant a timer and a re-render
  // every 3.2 seconds for the entire session no matter where the user was
  // on the page.
  useEffect(() => {
    if (userPicked) return
    const el = sectionRef.current
    if (!el) return

    let timer: ReturnType<typeof setInterval> | undefined

    const start = () => {
      if (timer) return
      timer = setInterval(() => {
        // Don't rotate the panel — and its CTA — out from under a pointer or a
        // keyboard focus that's about to click it.
        if (pausedRef.current) return
        setVisible(false)
        setTimeout(() => {
          // Read the live value straight off the store rather than closing
          // over `active`, so the effect doesn't need to re-subscribe (and
          // tear down its observer) on every tick.
          const current = useUIStore.getState().industryIndex
          setIndustryIndex((current + 1) % INDUSTRIES.length)
          setVisible(true)
        }, 180)
      }, ADVANCE_MS)
    }
    const stop = () => {
      clearInterval(timer)
      timer = undefined
    }

    const observer = new IntersectionObserver(
      ([entry]) => (entry.isIntersecting ? start() : stop()),
      { threshold: 0.2 }
    )
    observer.observe(el)

    return () => {
      observer.disconnect()
      stop()
    }
  }, [userPicked, setIndustryIndex])

  // The rail only shows five or six rows at a time, so an auto-advance past the
  // fold used to highlight a sector nobody could see. Keep the active row in
  // view — `nearest` so it only scrolls when it actually has to.
  useEffect(() => {
    activeRowRef.current?.scrollIntoView({ block: "nearest" })
  }, [active])

  const industry = INDUSTRIES[active]

  return (
    <section ref={sectionRef} id="industries" className="py-32 px-6 md:px-12 lg:px-20 border-t border-border">
      <div className="max-w-6xl mx-auto">
        <div className="mb-16">
          <div className="mt-4 inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-accent/40 border border-border text-[10px] tracking-widest text-muted-foreground uppercase">
            M365 Solutions Tailored to Your Sector
          </div>
          <h2 className="mt-5 text-4xl md:text-5xl font-light tracking-tight leading-[1.05]">
            Built for<br />Your Industry.
          </h2>
        </div>

        <div
          className={`${styles.deck} grid grid-cols-1 lg:grid-cols-3 gap-3 items-stretch`}
          onMouseEnter={() => (pausedRef.current = true)}
          onMouseLeave={() => (pausedRef.current = false)}
          onFocusCapture={() => (pausedRef.current = true)}
          onBlurCapture={() => (pausedRef.current = false)}
        >
          {/* Left — the sector rail. Scrollable, but styled as part of the
              design rather than left to the OS: see industries-section.module.css. */}
          <div
            aria-label="Industries"
            className={`${styles.rail} flex flex-col gap-1.5 max-h-[420px] pr-2 py-1`}
          >
            {INDUSTRIES.map((s, i) => {
              const isActive = active === i
              return (
                <button
                  key={s.num}
                  ref={isActive ? activeRowRef : undefined}
                  aria-pressed={isActive}
                  onClick={() => selectIndustry(i)}
                  className={`relative overflow-hidden text-left rounded-xl border px-4 py-3 shrink-0 transition-all duration-200 group ${
                    isActive
                      ? "border-blue-400/35 bg-blue-500/[0.12]"
                      : "border-border bg-card hover:border-foreground/20 hover:bg-accent/60"
                  }`}
                >
                  <div className="flex gap-3 items-center">
                    <span
                      className={`flex items-center justify-center w-7 h-7 rounded-lg text-[11px] font-light shrink-0 transition-colors duration-200 ${
                        isActive ? "bg-blue-500/25 text-foreground/90" : "bg-accent/60 text-muted-foreground"
                      }`}
                    >
                      {s.num}
                    </span>
                    <p
                      className={`text-sm font-light transition-colors duration-200 ${
                        isActive ? "text-foreground/95" : "text-muted-foreground group-hover:text-foreground/85"
                      }`}
                    >
                      {s.title}
                    </p>
                    <svg
                      aria-hidden="true"
                      width="12"
                      height="12"
                      viewBox="0 0 12 12"
                      fill="none"
                      className={`ml-auto shrink-0 transition-all duration-200 ${
                        isActive
                          ? "text-blue-300/90 opacity-100"
                          : "text-muted-foreground opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0"
                      }`}
                    >
                      <path
                        d="M4 2l4 4-4 4"
                        stroke="currentColor"
                        strokeWidth="1.4"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>

                  {/* Countdown to the next auto-advance — the rail explains its
                      own movement instead of jumping unannounced. Keyed on the
                      index so it restarts each time, and dropped entirely once
                      the visitor takes over. */}
                  {isActive && !userPicked ? (
                    <span
                      key={active}
                      aria-hidden="true"
                      className={styles.progress}
                      style={{ "--advance-ms": `${ADVANCE_MS}ms` } as CSSProperties}
                    />
                  ) : null}
                </button>
              )
            })}
          </div>

          {/* Right — fixed-size description panel */}
          <div
            className="lg:col-span-2 rounded-2xl border border-border p-8 flex flex-col justify-center bg-card"
            style={{
              boxShadow: "0 1px 3px rgba(0,0,0,0.2)",
              minHeight: "360px",
            }}
          >
            <div
              style={{
                opacity: visible ? 1 : 0,
                filter: visible ? "blur(0px)" : "blur(6px)",
                transform: visible ? "translateY(0)" : "translateY(6px)",
                transition: "opacity 220ms cubic-bezier(0.16,1,0.3,1), filter 220ms cubic-bezier(0.16,1,0.3,1), transform 220ms cubic-bezier(0.16,1,0.3,1)",
              }}
            >
              <span className="text-[10px] tracking-widest uppercase text-blue-400/80 font-mono">{industry.num} / {INDUSTRIES.length.toString().padStart(2, "0")}</span>
              <h3 className="mt-3 text-2xl md:text-3xl font-light mb-5">{industry.title}</h3>
              <p className="text-base text-muted-foreground leading-relaxed max-w-xl">{industry.desc}</p>

              {/* The way out of the carousel: every sector gets its own button
                  to its own page. The two sectors without a page yet (slug:
                  null in INDUSTRIES) point at the hub rather than a 404. */}
              <Link
                href={industry.slug ? `/industries/${industry.slug}` : "/industries"}
                className="mt-7 inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-blue-600 text-white text-sm font-medium tracking-wide hover:bg-blue-500 transition-colors"
              >
                {industry.slug
                  ? `See Our ${industry.title} Solutions`
                  : "Browse All Sectors"}
                <span aria-hidden="true">→</span>
              </Link>
            </div>
          </div>
        </div>

        <SectionCTA
          text="Every sector page lists the exact Microsoft tools we deploy there and why it needs them."
          primaryLabel="Explore Your Industry"
          primaryHref="/industries"
          secondaryLabel="Book a Free Call"
          secondaryHref="/contact"
        />

        <p className="mt-8 text-xs text-muted-foreground leading-relaxed max-w-2xl">
          *PCI and HIPAA policy compliance requires additional, out-of-scope labour. Reach out for more information.
        </p>
      </div>
    </section>
  )
}
