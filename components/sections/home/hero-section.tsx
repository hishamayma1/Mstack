import type { CSSProperties } from "react"
import Link from "next/link"
import { HeroBackdrop } from "@/components/ui/hero-backdrop"
import { AppLogoRow } from "@/components/ui/app-logo"
import { HERO_STATS } from "@/lib/content/site"
import { HERO_LOGOS } from "@/lib/content/app-logos"
import styles from "./hero-section.module.css"

// Server component. The headline, copy and CTAs are present and visible in
// the server HTML — they used to render at opacity 0 and wait on a client
// store that only flipped once the intro animation finished, which pushed
// the LCP element several seconds past first paint and hid the page's main
// heading from anything that doesn't run JS.
//
// The entrance is now a pure CSS stagger, and the only client code in the
// hero is HeroBackdrop, which defers three.js to idle time.
//
// Layout: the copy column is in normal flow (pushed down by `mt-auto`) rather
// than absolutely pinned to the bottom. Pinned, it overflowed *upwards* on
// short/narrow viewports and slid the headline under the fixed nav; in flow
// it bottoms out when there's room and grows the section when there isn't.
// `100svh` rather than `100vh` so mobile browser chrome doesn't eat the
// bottom of the hero.
export function HeroSection() {
  return (
    <section className="relative min-h-[100svh] overflow-hidden flex flex-col">
      <div className="absolute inset-0 w-full h-full z-0">
        <HeroBackdrop />
      </div>

      <div className={styles.fade} aria-hidden="true" />
      <div className={styles.blur} aria-hidden="true" />

      {/* pt clears the fixed nav (top-4 + ~56px bar on mobile, taller on md) */}
      <div className="relative z-30 mt-auto w-full max-w-3xl flex flex-col px-6 md:px-12 pt-28 md:pt-32 pb-10 sm:pb-12">
        <h1
          className={`${styles.rise} ${styles.headline} font-light text-foreground leading-[1.05] sm:leading-[1.0] tracking-tight mb-4 sm:mb-6 font-ibm-plex`}
          style={{ "--i": 0 } as CSSProperties}
        >
          Your Cloud.<br />Our Expertise.
        </h1>

        <p
          className={`${styles.rise} text-sm sm:text-lg text-muted-foreground leading-relaxed max-w-lg mb-6 sm:mb-8`}
          style={{ "--i": 1 } as CSSProperties}
        >
          Expert Microsoft 365 consulting: security hardening, SharePoint setup,
          Power Platform automation &amp; managed IT support.
        </p>

        <div
          className={`${styles.rise} flex flex-wrap gap-3 mb-8 sm:mb-10`}
          style={{ "--i": 2 } as CSSProperties}
        >
          <Link
            href="/contact"
            className="px-5 sm:px-6 py-3 bg-blue-600 text-white text-sm rounded-xl hover:bg-blue-500 transition-colors tracking-wide font-medium"
          >
            Book a Free Call
          </Link>
          <a
            href="#services"
            className="px-5 sm:px-6 py-3 border border-border text-foreground/75 text-sm rounded-xl hover:border-blue-500/40 hover:text-foreground hover:bg-accent/60 transition-all tracking-wide font-medium"
          >
            Explore Our Services
          </a>
        </div>

        <dl className="flex flex-wrap gap-x-6 sm:gap-x-8 gap-y-4 mb-6 sm:mb-8">
          {HERO_STATS.map((stat, i) => (
            <div key={stat.label} className={styles.rise} style={{ "--i": 3 + i } as CSSProperties}>
              <dd className="text-2xl sm:text-4xl text-foreground font-light tracking-tight font-ibm-plex">
                {stat.value}
              </dd>
              <dt className="text-[10px] sm:text-xs text-muted-foreground tracking-widest uppercase mt-1 font-ibm-plex">
                {stat.label}
              </dt>
            </div>
          ))}
        </dl>

        {/* The stack, as marks rather than a run-on list of names — the same
            products scroll past in full underneath, in the trust bar. */}
        <div className={styles.rise} style={{ "--i": 7 } as CSSProperties}>
          <span className="block text-[10px] text-muted-foreground tracking-[0.25em] mb-3">WE WORK IN</span>
          <AppLogoRow slugs={HERO_LOGOS} size={30} title="The Microsoft products we work in" />
        </div>
      </div>
    </section>
  )
}
