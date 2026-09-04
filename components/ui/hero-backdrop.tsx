"use client"

import dynamic from "next/dynamic"
import { useEffect, useState } from "react"
import { useTheme } from "next-themes"

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

const DARK_GRADIENT = ["#1D4ED8", "#3B82F6", "#60A5FA"]

// Light mode gets its own, airier stops (sky-200/300/400) rather than reusing
// DARK_GRADIENT's deeper blue-700/500/400 — that mix reads fine glowing on a
// black backdrop but feels heavy against white.
const LIGHT_GRADIENT = ["#BAE6FD", "#7DD3FC", "#38BDF8"]

// The RGB complement (255-r, 255-g, 255-b) of LIGHT_GRADIENT, channel by
// channel. CSS `invert(1)` is an exact per-channel 1-x, so feeding the shader
// these and inverting the canvas lands back on precisely LIGHT_GRADIENT's
// colors — unlike stacking `invert` with a `hue-rotate`, which approximates a
// 180° hue turn in HSL space and visibly drifts saturated blues toward
// purple/pink instead of restoring them.
const LIGHT_GRADIENT_PREIMAGE = ["#451902", "#822C03", "#C74207"]

export function HeroBackdrop() {
  const [show, setShow] = useState(false)
  const [mounted, setMounted] = useState(false)
  const { resolvedTheme } = useTheme()

  useEffect(() => setMounted(true), [])

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

  // `mounted` gates the theme read so the server-rendered markup (always
  // dark, the site's default) matches the client's first paint before
  // hydration picks up whatever theme is actually stored.
  const isLight = mounted && resolvedTheme === "light"

  // The shader paints bright lines on an opaque black canvas; `mix-blend-mode:
  // screen` is what makes the black read as transparent against a dark page
  // background (screen of black-with-anything is a no-op). Screened onto a
  // *light* background it does the opposite — screen-with-white is always
  // white, so the whole animation disappears. `invert` + `multiply` reproduces
  // the same "black disappears, color shows" trick for light mode (multiply-
  // with-white is also a no-op) — paired with LIGHT_GRADIENT_PREIMAGE so the
  // inversion lands back on exactly the same blues instead of an approximate
  // one.
  return (
    <div
      className={
        isLight ? "w-full h-full invert mix-blend-multiply opacity-45" : "w-full h-full mix-blend-screen"
      }
    >
      <FloatingLines linesGradient={isLight ? LIGHT_GRADIENT_PREIMAGE : DARK_GRADIENT} mixBlendMode="normal" />
    </div>
  )
}
