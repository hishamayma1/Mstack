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
          background: "#0A0E17",
          color: "#F3F5FA",
          fontFamily:
            "system-ui, -apple-system, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
          WebkitFontSmoothing: "antialiased",
        }}
      >
        <title>Something went wrong | MStack360</title>

        <main style={{ maxWidth: "34rem", width: "100%", textAlign: "center" }}>
          <p
            style={{
              margin: "0 0 28px",
              fontSize: "11px",
              letterSpacing: "0.25em",
              color: "rgba(255,255,255,0.5)",
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
              color: "rgba(255,255,255,0.55)",
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
                border: "1px solid rgba(255,255,255,0.08)",
                background: "rgba(255,255,255,0.02)",
                fontSize: "11px",
                letterSpacing: "0.08em",
                fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
                color: "rgba(255,255,255,0.35)",
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
                border: "1px solid rgba(255,255,255,0.15)",
                color: "rgba(255,255,255,0.75)",
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
