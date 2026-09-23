"use client"

import { useEffect, useState } from "react"

// Share row: the OS share sheet where there is one (phones), LinkedIn, email,
// and copy-link. The page URL is read at click time rather than render time,
// so the server markup doesn't depend on which host served it.
export function ArticleShare({ title }: { title: string }) {
  const [copied, setCopied] = useState(false)
  const [canNativeShare, setCanNativeShare] = useState(false)

  useEffect(() => {
    setCanNativeShare(typeof navigator !== "undefined" && typeof navigator.share === "function")
  }, [])

  useEffect(() => {
    if (!copied) return
    const t = setTimeout(() => setCopied(false), 1800)
    return () => clearTimeout(t)
  }, [copied])

  const url = () => window.location.href.split("#")[0]

  const button =
    "w-10 h-10 rounded-xl border border-border bg-card flex items-center justify-center text-foreground/70 hover:text-foreground hover:border-teal/40 hover:bg-teal/10 transition-all"

  return (
    <div className="flex flex-wrap items-center gap-2">
      {canNativeShare ? (
        <button
          type="button"
          aria-label="Share"
          className={button}
          onClick={() => navigator.share({ title, url: url() }).catch(() => {})}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M12 3v12M7 8l5-5 5 5" />
            <path d="M5 13v6a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-6" />
          </svg>
        </button>
      ) : null}
      <button
        type="button"
        aria-label="Share on LinkedIn"
        className={button}
        onClick={() =>
          window.open(
            `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url())}`,
            "_blank",
            "noopener,noreferrer,width=600,height=640"
          )
        }
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <rect x="3" y="3" width="18" height="18" rx="3" />
          <path d="M8 11v5M8 8v.01M12 16v-5M16 16v-3a2 2 0 0 0-4 0" />
        </svg>
      </button>
      <button
        type="button"
        aria-label="Share by email"
        className={button}
        onClick={() => {
          window.location.href = `mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(url())}`
        }}
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <rect x="3" y="5" width="18" height="14" rx="2" />
          <path d="m3 7 9 6 9-6" />
        </svg>
      </button>
      <button
        type="button"
        aria-label={copied ? "Link copied" : "Copy link"}
        className={button}
        onClick={async () => {
          try {
            await navigator.clipboard.writeText(url())
            setCopied(true)
          } catch {
            // Clipboard unavailable — nothing sensible to fall back to.
          }
        }}
      >
        {copied ? (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" className="text-teal" aria-hidden="true">
            <path d="M5 12l5 5 9-10" />
          </svg>
        ) : (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1" />
            <path d="M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1" />
          </svg>
        )}
      </button>
      <span className="sr-only" aria-live="polite">
        {copied ? "Link copied to clipboard" : ""}
      </span>
    </div>
  )
}
