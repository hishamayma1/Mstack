"use client"

import { useEffect, useRef, useState } from "react"
import type { BlogTocItem } from "@/lib/cms/blog"
import { useReadingProgress } from "@/components/sections/blog/use-reading-progress"
import { Checklist, ProgressRing } from "@/components/sections/blog/reading-checklist"

// The reading checklist below lg: a sticky bar under the nav showing the
// current section and progress, expanding into the full checklist.

export function MobileReadingBar({ items, articleId }: { items: BlogTocItem[]; articleId: string }) {
  const { active, percent } = useReadingProgress(items, articleId)
  const [open, setOpen] = useState(false)
  const panelRef = useRef<HTMLDivElement>(null)
  const read = Math.max(0, Math.min(active, items.length))
  const current = active >= 0 && active < items.length ? items[active].text : active >= items.length ? "Finished" : "Introduction"

  // Close on Escape or a tap outside, like any disclosure.
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false)
    const onDown = (e: PointerEvent) => {
      if (!panelRef.current?.contains(e.target as Node)) setOpen(false)
    }
    window.addEventListener("keydown", onKey)
    window.addEventListener("pointerdown", onDown)
    return () => {
      window.removeEventListener("keydown", onKey)
      window.removeEventListener("pointerdown", onDown)
    }
  }, [open])

  return (
    <div ref={panelRef} className="lg:hidden sticky top-[5.25rem] z-30 mb-10">
      <div
        className="rounded-2xl border border-glass-border overflow-hidden"
        style={{ background: "var(--glass-bg)", backdropFilter: "blur(16px)", WebkitBackdropFilter: "blur(16px)", boxShadow: "var(--shadow-glass)" }}
      >
        <button
          type="button"
          aria-expanded={open}
          aria-controls="mobile-reading-list"
          onClick={() => setOpen((v) => !v)}
          className="w-full flex items-center gap-3 px-3 py-2.5 text-left"
        >
          <ProgressRing percent={percent} size={32} />
          <span className="flex-1 min-w-0">
            <span className="block text-[10px] tracking-widest text-muted-foreground">
              {read >= items.length ? "ALL SECTIONS READ" : `SECTION ${Math.max(1, active + 1)} OF ${items.length}`}
            </span>
            <span className="block text-sm text-foreground truncate">{current}</span>
          </span>
          <span aria-hidden="true" className={`shrink-0 text-muted-foreground transition-transform duration-300 ${open ? "rotate-180" : ""}`}>
            ↓
          </span>
        </button>
        {open ? (
          <div id="mobile-reading-list" className="px-3 pb-3 max-h-[60vh] overflow-y-auto animate-[fade-up_0.25s_cubic-bezier(0.16,1,0.3,1)]">
            <Checklist items={items} active={active} onPick={() => setOpen(false)} />
          </div>
        ) : null}
      </div>
    </div>
  )
}
