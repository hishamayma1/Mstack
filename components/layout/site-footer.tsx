import Image from "next/image"
import Link from "next/link"
import { cacheLife } from "next/cache"
import { FOOTER_COLUMNS, LEGAL_LINKS, SOCIAL_LINKS } from "@/lib/content/site"
import styles from "./site-footer.module.css"

// Four-column footer with a brand block. Pure static markup — no hooks, no
// "use client" — so it stays a server component and ships zero client JS on
// every page. All motion and lighting is CSS (see site-footer.module.css);
// there is no background image to download or decode.
//
// Cached rather than plain-static because of the copyright year: reading the
// clock during a prerender bakes the build year into the HTML permanently, so
// the notice silently goes stale on 1 January until someone redeploys. A daily
// cache lifetime prerenders the year and refreshes it on its own.
export async function SiteFooter() {
  "use cache"
  cacheLife("days")

  const year = new Date().getFullYear()

  return (
    <footer className={`${styles.footer} pt-20 pb-10 px-6 md:px-12 lg:px-20`}>
      {/* Decorative layers — all CSS, all behind the content */}
      <div className={styles.topLine} aria-hidden="true" />
      <div className={styles.aurora} aria-hidden="true" />
      <div className={styles.grid} aria-hidden="true" />
      <span className={`${styles.watermark} font-pixel`} aria-hidden="true">
        MSTACK360
      </span>

      <div className="relative max-w-6xl mx-auto">
        {/* Brand + link columns */}
        <div className="grid grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8">
          <div className={`${styles.reveal} col-span-2 lg:col-span-4`}>
            <Link href="/" aria-label="MStack360 home" className="inline-flex items-center opacity-90 hover:opacity-100 transition-opacity">
              <Image
                src="/Mstacklogo.webp"
                alt="MStack360"
                width={1024}
                height={512}
                className="h-11 w-auto"
              />
            </Link>
            <p className="mt-5 text-sm text-muted-foreground leading-relaxed max-w-xs">
              Microsoft 365 configured around how your business actually works — secured,
              automated, and supported by people who know your sector.
            </p>

            <Link
              href="/contact"
              className="mt-7 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-blue-500/40 text-blue-600 dark:text-blue-300 text-xs tracking-widest hover:text-foreground hover:border-blue-400 hover:bg-blue-500/20 transition-all"
            >
              BOOK A FREE CONSULTATION
              <span aria-hidden="true">→</span>
            </Link>
          </div>

          {FOOTER_COLUMNS.map((column) => (
            <nav
              key={column.heading}
              aria-label={column.heading}
              className={`${styles.reveal} lg:col-span-2`}
            >
              <h2 className="flex items-center gap-2 text-[11px] tracking-widest text-muted-foreground mb-4">
                <span aria-hidden="true" className="h-1 w-1 rounded-full bg-blue-400/70" />
                {column.heading.toUpperCase()}
              </h2>
              <ul className="space-y-2.5">
                {column.links.map((l) => (
                  <li key={`${column.heading}-${l.label}`}>
                    <Link
                      href={l.href}
                      className={`${styles.link} text-xs text-muted-foreground hover:text-foreground leading-relaxed`}
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="mt-16 pt-6 border-t border-border flex flex-col md:flex-row md:items-center justify-between gap-5">
          <span className="text-xs text-muted-foreground">
            © {year} MStack360. All rights reserved.
          </span>

          <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
            {LEGAL_LINKS.map((l) => (
              <Link
                key={l.label}
                href={l.href}
                className={`${styles.link} text-xs text-muted-foreground hover:text-foreground`}
              >
                {l.label}
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-5">
            {SOCIAL_LINKS.map((l) => (
              <a
                key={l.label}
                href={l.href}
                className={`${styles.link} text-xs text-muted-foreground hover:text-foreground tracking-widest`}
              >
                {l.label}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
