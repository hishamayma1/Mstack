"use client"

import { Suspense, useEffect, useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"

// Sticky bottom-right action stack: a persistent "Contact us" pill and a
// back-to-top button that only appears once the visitor has scrolled past a
// screen's worth of content.
//
// Client-only because both behaviours need the scroll position and the current
// route; it is deliberately the *only* client component below the fold, so the
// pages themselves stay server-rendered.

const SHOW_TOP_AFTER = 600 // px scrolled before the top button fades in

export function FloatingActions() {
  const [showTop, setShowTop] = useState(false)

  useEffect(() => {
    let frame = 0

    const onScroll = () => {
      // rAF-throttled: scroll fires far more often than we need to re-render.
      if (frame) return
      frame = requestAnimationFrame(() => {
        frame = 0
        setShowTop(window.scrollY > SHOW_TOP_AFTER)
      })
    }

    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => {
      window.removeEventListener("scroll", onScroll)
      if (frame) cancelAnimationFrame(frame)
    }
  }, [])

  const scrollToTop = () => {
    // Honour the OS reduced-motion setting — smooth scrolling a long page is
    // exactly the kind of movement that setting exists to suppress.
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    window.scrollTo({ top: 0, behavior: reduced ? "auto" : "smooth" })
  }

  return (
    // data-floating-actions is the hook MobileMenu's stylesheet uses to fade
    // this cluster out while the mobile sheet is open (they overlap on phones).
    <div
      data-floating-actions
      className="fixed bottom-5 right-5 md:bottom-7 md:right-7 z-50 flex flex-col items-end gap-3 print:hidden"
    >
      <button
        type="button"
        onClick={scrollToTop}
        aria-label="Back to top"
        tabIndex={showTop ? 0 : -1}
        aria-hidden={!showTop}
        className={`flex items-center justify-center w-11 h-11 rounded-xl border border-glass-border text-muted-foreground hover:text-foreground hover:border-foreground/25 hover:bg-accent/60 transition-all duration-300 ${
          showTop ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2 pointer-events-none"
        }`}
        style={{
          backdropFilter: "blur(16px)",
          WebkitBackdropFilter: "blur(16px)",
          background: "var(--glass-bg)",
          boxShadow: "var(--shadow-fab)",
        }}
      >
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
          <path
            d="M8 13V3M8 3L3.5 7.5M8 3l4.5 4.5"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      {/* The pill reads the pathname, which can't be resolved while Next
          prerenders the shell of a route with dynamic params (/industries/[slug]
          and friends all render this component through PageShell). Suspense keeps
          that read from blocking the prerender — see the Cache Components notes
          in next/docs .../04-functions/use-pathname.md. */}
      <Suspense fallback={null}>
        <ContactPill />
      </Suspense>
    </div>
  )
}

function ContactPill() {
  // On /contact the pill would link to the page you're already on.
  const pathname = usePathname()
  if (pathname === "/contact") return null

  return (
    <Link
      href="/contact"
      className="flex items-center gap-2 px-4 py-3 md:px-5 rounded-xl border border-teal/40 text-teal text-[11px] tracking-widest hover:text-foreground hover:border-teal hover:bg-teal/20 transition-all duration-200"
      style={{
        backdropFilter: "blur(16px)",
        WebkitBackdropFilter: "blur(16px)",
        background: "var(--glass-bg)",
        boxShadow: "var(--shadow-fab)",
        fontFamily: "system-ui, -apple-system, sans-serif",
      }}
    >
      <svg width="15" height="15" viewBox="0 0 16 16" fill="none" aria-hidden="true">
        <path
          d="M2.5 4.5h11v8h-11z"
          stroke="currentColor"
          strokeWidth="1.3"
          strokeLinejoin="round"
        />
        <path
          d="m2.5 5 5.5 4 5.5-4"
          stroke="currentColor"
          strokeWidth="1.3"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      <span className="hidden sm:inline">CONTACT US</span>
      <span className="sr-only sm:hidden">Contact us</span>
    </Link>
  )
}
