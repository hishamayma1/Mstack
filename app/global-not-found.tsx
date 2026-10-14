import type { Metadata } from "next"
import { Geist, IBM_Plex_Sans, Courier_Prime } from "next/font/google"
import { PageShell } from "@/components/layout/page-shell"
import { NotFoundContent } from "@/components/sections/shared/not-found-content"
import "./(frontend)/globals.css"

// 404 for URLs that match no route in the app at all.
//
// Why this file exists: `app/(frontend)/not-found.tsx` only fires when a
// frontend route calls notFound(). Unmatched URLs need a *root* not-found,
// and this app has two root layouts — (frontend) and (payload) — so there is
// no single layout for Next to compose one from. Without this file, visiting
// /anything-else fell through to the unstyled framework default.
//
// This bypasses layout rendering entirely, so it has to bring its own
// document: <html>, <body>, global stylesheet, and fonts. Only the three
// fonts the 404 actually uses are loaded — the layout's fourth (Geist Mono)
// isn't needed here.
//
// Requires experimental.globalNotFound in next.config.mjs.

const geistSans = Geist({ subsets: ["latin"], variable: "--font-geist-sans", display: "swap" })
const courierPrime = Courier_Prime({
  weight: ["400"],
  subsets: ["latin"],
  variable: "--font-courier-prime",
  display: "swap",
  // Not preloaded: font files are shared with the main layout, and a preload
  // flag here put these on every page's critical path (see that layout).
  preload: false,
})
const ibmPlexSans = IBM_Plex_Sans({
  weight: ["300", "400"],
  subsets: ["latin"],
  variable: "--font-ibm-plex-sans",
  display: "swap",
  preload: false,
})

export const metadata: Metadata = {
  title: "Page Not Found | MStack360",
  description: "That page doesn't exist. Find what you were looking for, or talk to us directly.",
  robots: { index: false, follow: true },
}

export default function GlobalNotFound() {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${courierPrime.variable} ${ibmPlexSans.variable} font-sans antialiased`}
        suppressHydrationWarning
      >
        <PageShell>
          <NotFoundContent />
        </PageShell>
      </body>
    </html>
  )
}
