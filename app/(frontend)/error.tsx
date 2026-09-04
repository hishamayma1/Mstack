"use client"

import { useEffect } from "react"
import Link from "next/link"
import { MobileNav } from "@/components/layout/mobile-nav"
import { ErrorStateSection, type ErrorLink } from "@/components/sections/shared/error-state-section"

// Catches runtime errors thrown while rendering any frontend page, and
// replaces that page's content with a recoverable fallback instead of a blank
// screen. Error boundaries must be Client Components.
//
// Note the prop is `retry`, not `reset`. In Next 16 `retry()` re-fetches and
// re-renders the boundary's children, which is what you want for a failed
// data read — `reset()` only clears the error state and re-renders with the
// same data, so a transient database failure would come straight back.
//
// This renders the nav itself rather than using PageShell. PageShell pulls in
// SiteFooter, which is a cached Server Component ("use cache") — and an
// inline cached function can't exist inside a Client Component's module
// graph, which an error boundary always is. The nav is what matters here
// anyway: it's the way out. The 404 page is a Server Component, so it still
// gets the full shell.
const SUGGESTIONS: ErrorLink[] = [
  {
    label: "Back to Home",
    href: "/",
    description: "Start again from the top.",
  },
  {
    label: "Contact Us",
    href: "/contact",
    description: "Tell us what you were trying to reach and we'll send the link.",
  },
]

export default function FrontendError({
  error,
  retry,
}: {
  error: Error & { digest?: string }
  retry: () => void
}) {
  useEffect(() => {
    // Server Component errors arrive here with a generic message and a digest;
    // the digest is what matches this up with the full server-side log entry.
    console.error("[mstack] render error", { digest: error.digest, message: error.message })
  }, [error])

  return (
    <div className="bg-background text-foreground min-h-screen font-sans antialiased">
      <MobileNav />
      <ErrorStateSection
        code="500"
        eyebrow="SOMETHING WENT WRONG"
        title={"This Page Didn't\nLoad Properly."}
        message="A problem on our side stopped this page from rendering. It's often temporary — trying again usually works."
        detail={error.digest ? `Reference: ${error.digest}` : undefined}
        actions={
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              type="button"
              onClick={() => retry()}
              className="px-8 py-3 bg-blue-600 text-white text-sm rounded-xl hover:bg-blue-500 transition-colors tracking-widest font-medium whitespace-nowrap"
            >
              Try Again
            </button>
            <Link
              href="/"
              className="px-8 py-3 border border-border text-muted-foreground text-sm rounded-xl hover:border-blue-500/40 hover:text-foreground hover:bg-accent/40 transition-all tracking-widest font-medium text-center whitespace-nowrap"
            >
              Back to Home
            </Link>
          </div>
        }
        links={SUGGESTIONS}
      />
    </div>
  )
}
