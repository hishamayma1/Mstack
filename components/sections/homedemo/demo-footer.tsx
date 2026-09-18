import Link from "next/link"

// Deliberately thin — this is a concept page, not the site's real footer
// (that stays SiteFooter, on every other route). Just enough to get a
// visitor to the two places they'd actually want next.
export function DemoFooter() {
  return (
    <footer className="border-t border-border px-6 py-10 md:px-10">
      <div className="mx-auto flex w-full max-w-6xl flex-col items-center justify-between gap-4 sm:flex-row">
        <p className="text-sm text-muted-foreground">
          © {new Date().getFullYear()} MStack360. Design concept — not the live site.
        </p>
        <div className="flex items-center gap-6">
          <Link href="/" className="text-sm text-muted-foreground hover:text-foreground">
            Live site
          </Link>
          <Link href="/contact" className="text-sm text-muted-foreground hover:text-foreground">
            Contact
          </Link>
        </div>
      </div>
    </footer>
  )
}
