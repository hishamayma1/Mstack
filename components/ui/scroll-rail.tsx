"use client"

import { useCallback, useEffect, useRef, useState, type ReactNode } from "react"
import styles from "./scroll-rail.module.css"

const DRAG_THRESHOLD = 6 // px of pointer travel before a press counts as a drag

// A single-line, horizontally scrolling row (filter chips, tabs) that works
// with every input:
//
//   touch      native swipe with momentum — the browser does it
//   mouse      drag to scroll; a drag never fires the chip under the pointer
//   wheel      a vertical wheel/trackpad scroll moves the row sideways while
//              the row still has room to move, then hands back to the page
//   keyboard   Tab into a chip and the browser scrolls it into view
//
// The scrollbar is hidden; edge fades and ← → buttons show which way there is
// more. `activeKey` scrolls the matching child (data-rail-key) into view when
// it changes, so a chip picked elsewhere on the page is never off-screen.
export function ScrollRail({
  children,
  label,
  activeKey,
  className = "",
  trackClassName = "",
}: {
  children: ReactNode
  /** Accessible name for the group. */
  label: string
  activeKey?: string
  className?: string
  trackClassName?: string
}) {
  const trackRef = useRef<HTMLDivElement>(null)
  const [edges, setEdges] = useState({ start: false, end: false })
  const [dragging, setDragging] = useState(false)
  const suppressClick = useRef(false)

  const measure = useCallback(() => {
    const el = trackRef.current
    if (!el) return
    const start = el.scrollLeft > 2
    const end = el.scrollLeft + el.clientWidth < el.scrollWidth - 2
    setEdges((prev) => (prev.start === start && prev.end === end ? prev : { start, end }))
  }, [])

  // Edges: re-measure on scroll (rAF-throttled) and whenever the track or its
  // content changes size — chips re-render with new counts as you search.
  useEffect(() => {
    const el = trackRef.current
    if (!el) return
    let frame = 0
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(() => ((frame = 0), measure()))
    }
    measure()
    el.addEventListener("scroll", onScroll, { passive: true })
    const ro = new ResizeObserver(onScroll)
    ro.observe(el)
    for (const child of Array.from(el.children)) ro.observe(child)
    return () => {
      el.removeEventListener("scroll", onScroll)
      ro.disconnect()
      if (frame) cancelAnimationFrame(frame)
    }
  }, [measure, children])

  // Vertical wheel → horizontal scroll, only while the row can still move in
  // that direction; at either end the page scrolls normally. Needs a
  // non-passive listener to be allowed to preventDefault.
  useEffect(() => {
    const el = trackRef.current
    if (!el) return
    const onWheel = (e: WheelEvent) => {
      if (Math.abs(e.deltaY) <= Math.abs(e.deltaX)) return // already horizontal
      if (el.scrollWidth <= el.clientWidth) return
      const atStart = el.scrollLeft <= 0 && e.deltaY < 0
      const atEnd = el.scrollLeft + el.clientWidth >= el.scrollWidth - 1 && e.deltaY > 0
      if (atStart || atEnd) return
      e.preventDefault()
      el.scrollLeft += e.deltaY
    }
    el.addEventListener("wheel", onWheel, { passive: false })
    return () => el.removeEventListener("wheel", onWheel)
  }, [])

  // Keep the active chip visible.
  useEffect(() => {
    const el = trackRef.current
    if (!el || activeKey === undefined) return
    const target = el.querySelector<HTMLElement>(`[data-rail-key="${CSS.escape(activeKey)}"]`)
    if (!target) return
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    const left = target.offsetLeft - (el.clientWidth - target.offsetWidth) / 2
    el.scrollTo({ left: Math.max(0, left), behavior: reduced ? "auto" : "smooth" })
  }, [activeKey])

  // Mouse drag. Touch and pen are left to the browser's native scrolling.
  const drag = useRef<{ x: number; left: number; id: number; active: boolean } | null>(null)

  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.pointerType !== "mouse" || e.button !== 0) return
    const el = trackRef.current
    if (!el || el.scrollWidth <= el.clientWidth) return
    drag.current = { x: e.clientX, left: el.scrollLeft, id: e.pointerId, active: false }
    suppressClick.current = false
  }

  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const d = drag.current
    const el = trackRef.current
    if (!d || !el) return
    const dx = e.clientX - d.x
    if (!d.active) {
      if (Math.abs(dx) < DRAG_THRESHOLD) return
      d.active = true
      setDragging(true)
      suppressClick.current = true
      el.setPointerCapture(d.id)
    }
    el.scrollLeft = d.left - dx
  }

  const endDrag = () => {
    const d = drag.current
    drag.current = null
    if (d && trackRef.current?.hasPointerCapture(d.id)) trackRef.current.releasePointerCapture(d.id)
    setDragging(false)
  }

  const page = (dir: 1 | -1) => {
    const el = trackRef.current
    if (!el) return
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    el.scrollBy({ left: dir * el.clientWidth * 0.7, behavior: reduced ? "auto" : "smooth" })
  }

  return (
    <div
      className={`${styles.rail} ${edges.start ? styles.fadeStart : ""} ${edges.end ? styles.fadeEnd : ""} ${className}`}
    >
      <button
        type="button"
        data-side="start"
        className={styles.arrow}
        hidden={!edges.start}
        onClick={() => page(-1)}
        aria-label="Scroll left"
        tabIndex={-1}
      >
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M15 18l-6-6 6-6" />
        </svg>
      </button>

      <div
        ref={trackRef}
        role="group"
        aria-label={label}
        className={`${styles.track} ${dragging ? styles.dragging : ""} ${trackClassName}`}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
        onLostPointerCapture={endDrag}
        // A drag that ends over a chip must not also select it.
        onClickCapture={(e) => {
          if (suppressClick.current) {
            e.preventDefault()
            e.stopPropagation()
            suppressClick.current = false
          }
        }}
      >
        {children}
      </div>

      <button
        type="button"
        data-side="end"
        className={styles.arrow}
        hidden={!edges.end}
        onClick={() => page(1)}
        aria-label="Scroll right"
        tabIndex={-1}
      >
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M9 18l6-6-6-6" />
        </svg>
      </button>
    </div>
  )
}
