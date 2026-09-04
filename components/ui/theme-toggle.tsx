"use client"

import { useEffect, useState } from "react"
import { useTheme } from "next-themes"

// Sun/moon icon swap, cross-faded and slightly rotated rather than hard-cut.
// Renders a disabled placeholder until mounted — next-themes can't know the
// stored theme during SSR, and guessing would flash the wrong icon.
export function ThemeToggle({ className = "" }: { className?: string }) {
  const { resolvedTheme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => setMounted(true), [])

  const isDark = mounted ? resolvedTheme === "dark" : true

  return (
    <button
      type="button"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      aria-label={mounted ? `Switch to ${isDark ? "light" : "dark"} mode` : "Toggle theme"}
      disabled={!mounted}
      className={`relative flex items-center justify-center w-9 h-9 rounded-lg text-muted-foreground hover:text-foreground hover:bg-accent/60 transition-colors duration-200 disabled:pointer-events-none ${className}`}
    >
      <svg
        viewBox="0 0 24 24"
        width="17"
        height="17"
        fill="none"
        aria-hidden="true"
        className="absolute"
        style={{
          opacity: isDark ? 0 : 1,
          transform: isDark ? "rotate(-90deg) scale(0.5)" : "rotate(0deg) scale(1)",
          transition: "opacity 300ms ease, transform 400ms cubic-bezier(0.16, 1, 0.3, 1)",
        }}
      >
        <circle cx="12" cy="12" r="4.2" stroke="currentColor" strokeWidth="1.6" />
        <path
          d="M12 2.5v2.2M12 19.3v2.2M4.2 4.2l1.55 1.55M18.25 18.25l1.55 1.55M2.5 12h2.2M19.3 12h2.2M4.2 19.8l1.55-1.55M18.25 5.75l1.55-1.55"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
        />
      </svg>
      <svg
        viewBox="0 0 24 24"
        width="16"
        height="16"
        fill="none"
        aria-hidden="true"
        className="absolute"
        style={{
          opacity: isDark ? 1 : 0,
          transform: isDark ? "rotate(0deg) scale(1)" : "rotate(90deg) scale(0.5)",
          transition: "opacity 300ms ease, transform 400ms cubic-bezier(0.16, 1, 0.3, 1)",
        }}
      >
        <path
          d="M20.5 14.2a8.5 8.5 0 1 1-9.7-11.4 7 7 0 0 0 9.7 11.4Z"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinejoin="round"
        />
      </svg>
    </button>
  )
}
