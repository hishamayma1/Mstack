"use client"

import { useEffect, useState } from "react"
import type { BlogTocItem } from "@/lib/cms/blog"

// Headings count as "reached" once their top passes this line — just under
// the fixed nav, where the reader's eye actually is.
const READ_LINE = 140

export type ReadingProgress = {
  /** Index of the section being read, -1 before the first heading. */
  active: number
  /** 0–100 through the article body. */
  percent: number
}

// Shared by the desktop "On this page" sidebar and the mobile reading bar.
//
// One rAF-throttled, passive scroll listener. It reads layout and never
// writes it, and it only sets state when a value actually changes, so the
// checklist re-renders a handful of times per article, not once per frame.
export function useReadingProgress(items: BlogTocItem[], articleId: string): ReadingProgress {
  const [active, setActive] = useState(-1)
  const [percent, setPercent] = useState(0)

  useEffect(() => {
    const headings = items
      .map((item) => document.getElementById(item.id))
      .filter((el): el is HTMLElement => el !== null)
    const article = document.getElementById(articleId)
    let frame = 0

    const measure = () => {
      frame = 0
      let current = -1
      for (let i = 0; i < headings.length; i++) {
        if (headings[i].getBoundingClientRect().top <= READ_LINE) current = i
        else break
      }

      let next = 0
      if (article) {
        const rect = article.getBoundingClientRect()
        const total = rect.height - window.innerHeight * 0.5
        const read = total > 0 ? (window.innerHeight * 0.5 - rect.top) / total : 1
        next = Math.round(Math.min(1, Math.max(0, read)) * 100)
      }
      // At the very end every section counts as read, even a short last one
      // whose heading never reaches the read line.
      if (next >= 100) current = headings.length

      setActive((prev) => (prev === current ? prev : current))
      setPercent((prev) => (prev === next ? prev : next))
    }

    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(measure)
    }

    measure()
    window.addEventListener("scroll", onScroll, { passive: true })
    window.addEventListener("resize", onScroll, { passive: true })
    return () => {
      window.removeEventListener("scroll", onScroll)
      window.removeEventListener("resize", onScroll)
      if (frame) cancelAnimationFrame(frame)
    }
  }, [items, articleId])

  return { active, percent }
}

/** Scroll to a heading, honouring reduced motion, and keep the URL in sync. */
export function jumpTo(id: string) {
  const el = document.getElementById(id)
  if (!el) return
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches
  el.scrollIntoView({ behavior: reduced ? "auto" : "smooth", block: "start" })
  history.replaceState(null, "", `#${id}`)
}
