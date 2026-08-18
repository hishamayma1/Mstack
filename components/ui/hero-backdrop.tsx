"use client"

import dynamic from "next/dynamic"
import { useEffect, useState } from "react"

// FloatingLines pulls in three.js — the single heaviest bundle on the site.
// `ssr: false` keeps it out of the server render, and the mount is deferred
// to browser idle time so the WebGL context and its JS never compete with
// first paint or hydration of the hero copy above it.
//
// It is also skipped entirely for users who prefer reduced motion, and on
// devices reporting few cores, where a continuous WebGL loop costs more than
// the decoration is worth.
const FloatingLines = dynamic(() => import("@/components/ui/floating-lines"), {
  ssr: false,
})

export function HeroBackdrop() {
  const [show, setShow] = useState(false)

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return
    if (typeof navigator !== "undefined" && (navigator.hardwareConcurrency ?? 8) <= 4) return

    // requestIdleCallback isn't in Safari; fall back to a short timeout.
    const ric = window.requestIdleCallback
    if (typeof ric === "function") {
      const handle = ric(() => setShow(true), { timeout: 2000 })
      return () => window.cancelIdleCallback?.(handle)
    }

    const handle = window.setTimeout(() => setShow(true), 600)
    return () => window.clearTimeout(handle)
  }, [])

  if (!show) return null

  return <FloatingLines linesGradient={["#1D4ED8", "#3B82F6", "#60A5FA"]} />
}
