"use client"

import { useEffect } from "react"

// Last-resort boundary: catches errors thrown in a root layout, where the
// normal error.tsx boundary can't reach (error.js wraps the page below a
// layout, not the layout itself).
//
// This file replaces the root layout when active, so it renders its own
// <html> and <body> and receives none of the app's global CSS or fonts.
// Everything here is therefore inlined and dependency-free on purpose — if
// the stylesheet or font is what failed, this page still has to render.
// Same reason there's no PageShell: the nav and footer may be exactly what
// broke.
//
// Client Component, so `metadata` isn't supported — React's <title> is the
// documented alternative.
export default function GlobalError({
  error,
  retry,
}: {
  error: Error & { digest?: string }
  retry: () => void
}) {
  useEffect(() => {
    console.error("[mstack] global error", { digest: error.digest, message: error.message })
  }, [error])

  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "24px",
          background: "var(--ge-bg)",
          color: "var(--ge-fg)",
          fontFamily:
            "system-ui, -apple-system, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
          WebkitFontSmoothing: "antialiased",
        }}
      >
        <title>Something went wrong | MStack360</title>

        {/* This page renders outside the app's normal CSS pipeline (see the
            module comment above), so it can't reach globals.css's theme
            tokens. This tiny self-contained stylesheet mirrors just the two
            values this page needs, keyed off the OS-level color-scheme
            preference — the only theme signal available without the
            next-themes script, which also lives in the (unreached) root
            layout. */}
        <style>{`
          :root { --ge-bg: #F7F8FA; --ge-fg: #0A0E17; --ge-fg-rgb: 10, 14, 23; }
          @media (prefers-color-scheme: dark) {
            :root { --ge-bg: #0A0E17; --ge-fg: #F3F5FA; --ge-fg-rgb: 255, 255, 255; }
          }
        `}</style>

        <main style={{ maxWidth: "34rem", width: "100%", textAlign: "center" }}>
          <p
            style={{
              margin: "0 0 28px",
              fontSize: "11px",
              letterSpacing: "0.25em",
              color: "rgba(var(--ge-fg-rgb), 0.5)",
            }}
          >
            MSTACK360
          </p>

          <h1
            style={{
              margin: "0 0 20px",
              fontSize: "clamp(2rem, 6vw, 3rem)",
              fontWeight: 300,
              lineHeight: 1.1,
              letterSpacing: "-0.02em",
            }}
          >
            Something went wrong.
          </h1>

          <p
            style={{
              margin: "0 0 32px",
              fontSize: "15px",
              lineHeight: 1.7,
              color: "rgba(var(--ge-fg-rgb), 0.55)",
            }}
          >
            The site hit an unexpected problem and couldn&apos;t finish loading. This is
            usually temporary — trying again often resolves it.
          </p>

          {error.digest ? (
            <p
              style={{
                margin: "0 0 32px",
                display: "inline-block",
                padding: "8px 14px",
                borderRadius: "8px",
                border: "1px solid rgba(var(--ge-fg-rgb), 0.08)",
                background: "rgba(var(--ge-fg-rgb), 0.02)",
                fontSize: "11px",
                letterSpacing: "0.08em",
                fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
                color: "rgba(var(--ge-fg-rgb), 0.35)",
              }}
            >
              Reference: {error.digest}
            </p>
          ) : null}

          <div
            style={{
              display: "flex",
              gap: "12px",
              justifyContent: "center",
              flexWrap: "wrap",
            }}
          >
            <button
              type="button"
              onClick={() => retry()}
              style={{
                padding: "12px 32px",
                borderRadius: "12px",
                border: "none",
                background: "#2563EB",
                color: "#fff",
                fontSize: "14px",
                letterSpacing: "0.1em",
                fontWeight: 500,
                cursor: "pointer",
              }}
            >
              Try Again
            </button>
            {/* A plain anchor, not next/link — the router itself may be the
                thing that failed, so this needs to be a real navigation. */}
            <a
              href="/"
              style={{
                padding: "12px 32px",
                borderRadius: "12px",
                border: "1px solid rgba(var(--ge-fg-rgb), 0.15)",
                color: "rgba(var(--ge-fg-rgb), 0.75)",
                fontSize: "14px",
                letterSpacing: "0.1em",
                fontWeight: 500,
                textDecoration: "none",
              }}
            >
              Back to Home
            </a>
          </div>
        </main>
      </body>
    </html>
  )
}
