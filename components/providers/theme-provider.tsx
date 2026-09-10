"use client"

import { useEffect } from "react"
import { ThemeProvider as NextThemeProvider } from "next-themes"

// Wraps next-themes: class-based (.dark on <html>, matching the token setup
// in globals.css), defaults to light for first-time visitors, and persists
// whatever the visitor picks in localStorage from then on.
export function ThemeProvider({ children }: { children: React.ReactNode }) {
  return (
    <NextThemeProvider attribute="class" defaultTheme="light" enableSystem={false} disableTransitionOnChange={false}>
      <ThemeReadyGate />
      {children}
    </NextThemeProvider>
  )
}

// The CSS-driven cross-theme fade (globals.css) is gated behind
// [data-theme-ready] on <html>, set only after mount — this keeps next-themes'
// initial script-based class assignment (light/dark, read from storage before
// hydration) from being visible as an animated flash on first paint. Every
// toggle after that is a real user action, so it's fine for it to be a real
// user-visible fade.
function ThemeReadyGate() {
  useEffect(() => {
    const id = requestAnimationFrame(() => {
      document.documentElement.setAttribute("data-theme-ready", "")
    })
    return () => cancelAnimationFrame(id)
  }, [])

  return null
}
