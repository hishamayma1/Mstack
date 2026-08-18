import type { Metadata } from "next"
import { PageShell } from "@/components/layout/page-shell"
import { NotFoundContent } from "@/components/sections/shared/not-found-content"

export const metadata: Metadata = {
  title: "Page Not Found | MStack360",
  description: "That page doesn't exist. Find what you were looking for, or talk to us directly.",
  // Next injects noindex for 404 responses automatically; this makes the
  // intent explicit for anything else that reads the document.
  robots: { index: false, follow: true },
}

// Handles a `notFound()` call inside a frontend route — an unknown
// /industries/[slug], for instance. URLs that match no route at all are
// handled by app/global-not-found.tsx instead; see the note there.
//
// Rendered inside PageShell on purpose. A 404 that drops the nav and footer
// is a dead end; keeping them means the visitor is always one click from
// somewhere useful, which is the whole point of a custom 404.
export default function NotFound() {
  return (
    <PageShell>
      <NotFoundContent />
    </PageShell>
  )
}
