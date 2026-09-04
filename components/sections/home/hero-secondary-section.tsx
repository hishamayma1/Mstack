import type { CSSProperties } from "react"
import Link from "next/link"
import { AppLogo } from "@/components/ui/app-logo"
import { APP_LOGOS, SERVICE_LOGOS } from "@/lib/content/app-logos"
import styles from "./hero-secondary-section.module.css"

// A second, quieter hero that sits directly under the main one.
//
// The first hero is the loud one — full-bleed three.js backdrop, left-aligned
// stack, four figures. This one is its opposite on purpose: centred, still,
// and built out of nothing but type, one hairline grid and a soft glow. That
// contrast is the whole point; two identical heroes back to back read as a
// bug, whereas a loud statement followed by a calm one reads as a page.
//
// Design language borrowed from the reference: an eyebrow pill, one large
// low-contrast headline where the second clause drops to muted, a single
// sentence of support, a filled primary CTA with an arrow plus a ghost
// secondary, and a thin row of plain-text credentials underneath.
//
// Server component. No JS ships for it — the entrance is a CSS stagger and
// the arrow nudge is a hover transition.
const CREDENTIALS = [
  "Microsoft Solutions Partner",
  "UK-based team",
  "Fixed monthly pricing",
  "No lock-in",
]

export function HeroSecondarySection() {
  return (
    <section className={`${styles.section} relative overflow-hidden border-b border-border`}>
      {/* Two decorative layers, both cheap: a masked hairline grid and one
          radial glow behind the headline. No blur passes, no canvas. */}
      <div className={styles.grid} aria-hidden="true" />
      <div className={styles.glow} aria-hidden="true" />

      <div className="relative z-10 mx-auto flex max-w-3xl flex-col items-center px-6 py-24 text-center md:px-10 md:py-32">
        <span className={`${styles.rise} ${styles.pill}`} style={{ "--i": 0 } as CSSProperties}>
          <span className={styles.dot} aria-hidden="true" />
          Microsoft 365 consultancy
        </span>

        <h2
          className={`${styles.rise} ${styles.headline} mt-7 font-ibm-plex font-light leading-[1.06] tracking-tight text-foreground`}
          style={{ "--i": 1 } as CSSProperties}
        >
          Your strategic partner
          <br />
          <span className="text-muted-foreground">in everything Microsoft</span>
        </h2>

        <p
          className={`${styles.rise} mt-6 max-w-xl text-sm leading-relaxed text-muted-foreground sm:text-base`}
          style={{ "--i": 2 } as CSSProperties}
        >
          Ten years of hardening tenants, moving files out of inboxes and putting
          the manual work on rails — inside the licences you already pay for.
        </p>

        {/* The services, as their product marks. Named rather than mark-only:
            this row is directly under the description, where it is read as a
            list of what we do — the anonymous mark-only treatment belongs in
            the trust marquee below, where the job is coverage, not meaning. */}
        <ul
          className={`${styles.rise} ${styles.logos} mt-10`}
          style={{ "--i": 3 } as CSSProperties}
          aria-label="The Microsoft products our services cover"
        >
          {SERVICE_LOGOS.map((slug) => (
            <li key={slug}>
              <AppLogo slug={slug} size={22} />
              <span>{APP_LOGOS[slug].name}</span>
            </li>
          ))}
        </ul>

        <div
          className={`${styles.rise} mt-10 flex flex-wrap items-center justify-center gap-3`}
          style={{ "--i": 4 } as CSSProperties}
        >
          <Link href="/contact" className={styles.primary}>
            Book a call
            <svg viewBox="0 0 16 16" className={styles.arrow} aria-hidden="true">
              <path
                d="M2.5 8h11m0 0L9.5 4m4 4-4 4"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.4"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </Link>
          <a href="#health-check" className={styles.secondary}>
            Get a free health check
          </a>
        </div>

        <ul
          className={`${styles.rise} ${styles.credentials} mt-12`}
          style={{ "--i": 5 } as CSSProperties}
        >
          {CREDENTIALS.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </div>
    </section>
  )
}
