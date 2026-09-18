import Image from "next/image"
import Link from "next/link"
import { ThemeToggle } from "@/components/ui/theme-toggle"
import { DemoNavLinks } from "./demo-nav-links"

// Self-contained header for the /homedemo concept — deliberately not
// MobileNav/PageShell. No mega-menu, no mobile drawer: the real MStack360
// mark, four scroll-spy anchor links, a theme toggle, and one CTA. The thin
// ribbon above it makes clear this is a design concept, not the live site,
// and gives a one-tap way back.
export function DemoHeader() {
  return (
    <>
      <div className="flex items-center justify-center gap-2 bg-primary px-4 py-2 text-center text-xs text-primary-foreground">
        <span>You&apos;re viewing a homepage design concept.</span>
        <Link href="/" className="font-medium underline underline-offset-2 hover:no-underline">
          Back to the live site
        </Link>
      </div>

      <header className="sticky top-0 z-40 border-b border-border bg-background/80 backdrop-blur-md">
        <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between gap-4 px-6 md:px-10">
          <Link href="#top" aria-label="MStack360 home" className="flex shrink-0 items-center">
            <Image
              src="/Mstacklogo.webp"
              alt="MStack360"
              width={1024}
              height={512}
              priority
              className="h-7 w-auto md:h-8"
            />
          </Link>

          <DemoNavLinks className="hidden items-center gap-8 md:flex" />

          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Link
              href="/contact"
              className="hidden rounded-full bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:opacity-90 sm:inline-flex"
            >
              Book a free call
            </Link>
          </div>
        </div>

        {/* Mobile: the same links as a horizontal scroll row, since there's
            no room for them in the bar and this page has no burger menu. */}
        <div className="flex gap-5 overflow-x-auto border-t border-border px-6 py-2.5 md:hidden [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <DemoNavLinks className="flex items-center gap-5" />
        </div>
      </header>
    </>
  )
}
