"use client"

import dynamic from "next/dynamic"
import { useEffect, useState } from "react"
import { useTheme } from "next-themes"

// FloatingLines is a WebGL shader. `ssr: false` keeps it out of the server
// render, and the mount is deferred until the intro curtain lifts and the
// browser is idle, so the WebGL context and its shader compile never compete
// with first paint or hydration of the hero copy above it.
//
// It is also skipped entirely for users who prefer reduced motion, and on
// devices reporting few cores, where a continuous WebGL loop costs more than
// the decoration is worth.
const FloatingLines = dynamic(() => import("@/components/ui/floating-lines"), {
  ssr: false,
})

// When IntroAnimation's curtain starts to fade (its `curtainOut` delay).
const CURTAIN_LIFT_MS = 1700

// Third stop lands on the palette's teal rather than another blue, so the
// line sweep reads as brand-blue-to-teal instead of a flat monochrome fade.
const DARK_GRADIENT = ["#1D4ED8", "#3B82F6", "#22D3EE"]

// Light mode gets its own, airier stops (sky-200/300 into a soft cyan) rather
// than reusing DARK_GRADIENT's deeper blue-700/500 — that mix reads fine
// glowing on a black backdrop but feels heavy against white.
const LIGHT_GRADIENT = ["#BAE6FD", "#7DD3FC", "#67E8F9"]

// The RGB complement (255-r, 255-g, 255-b) of LIGHT_GRADIENT, channel by
// channel. CSS `invert(1)` is an exact per-channel 1-x, so feeding the shader
// these and inverting the canvas lands back on precisely LIGHT_GRADIENT's
// colors — unlike stacking `invert` with a `hue-rotate`, which approximates a
// 180° hue turn in HSL space and visibly drifts saturated blues toward
// purple/pink instead of restoring them.
const LIGHT_GRADIENT_PREIMAGE = ["#451902", "#822C03", "#981706"]

export function HeroBackdrop() {
  const [show, setShow] = useState(false)
  const [mounted, setMounted] = useState(false)
  const { resolvedTheme } = useTheme()

  useEffect(() => setMounted(true), [])

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return
    if (typeof navigator !== "undefined" && (navigator.hardwareConcurrency ?? 8) <= 4) return

    // The intro curtain covers the hero until it starts lifting at 1.7s (see
    // intro-animation.module.css), so starting WebGL any earlier only
    // competes with loading and hydration for something nobody can see yet.
    // Wait for the curtain, then take the next idle slot. When the intro has
    // already played this session there is no curtain (IntroAnimation marks
    // <html>), so only the idle wait applies.
    const delay = document.documentElement.hasAttribute("data-intro-seen") ? 0 : CURTAIN_LIFT_MS
    let idle = 0
    const timer = window.setTimeout(() => {
      // requestIdleCallback isn't in Safari; there the timer alone is enough.
      const ric = window.requestIdleCallback
      if (typeof ric === "function") idle = ric(() => setShow(true), { timeout: 1000 })
      else setShow(true)
    }, delay)

    return () => {
      window.clearTimeout(timer)
      if (idle) window.cancelIdleCallback?.(idle)
    }
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
