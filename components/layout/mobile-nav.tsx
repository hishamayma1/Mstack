"use client"

import { useEffect, useState, type CSSProperties } from "react"
import Image from "next/image"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { NAV_LINKS, NAV_MENUS } from "@/lib/content/site"
import { AppLogo } from "@/components/ui/app-logo"
import { ThemeToggle } from "@/components/ui/theme-toggle"
import { MobileMenu } from "./mobile-menu"
import styles from "./mobile-nav.module.css"

const MOBILE_MENU_ID = "mobile-nav-menu"

const NAV_STYLE = {
  backdropFilter: "blur(16px)",
  WebkitBackdropFilter: "blur(16px)",
  background: "var(--glass-bg)",
  boxShadow: "var(--shadow-glass)",
} as const

// Desktop-only hover panels. Which nav items get one — and everything in them —
// is data in lib/content/site.ts (NAV_MENUS); this file only lays it out.
function menuFor(label: string) {
  return NAV_MENUS[label] ?? null
}

export function MobileNav() {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()
  const onHome = pathname === "/"

  const close = () => setOpen(false)

  // Next 16's router keeps restoring the scroll offset the previous route
  // had for a while after a client-side transition (part of its new
  // "maintain scroll position" behavior) — a single scrollTo(0) here gets
  // silently overwritten a moment later. Re-asserting it on an interval for
  // a short window reliably wins once the router's own restoration settles.
  // setTimeout rather than requestAnimationFrame: rAF is suspended while the
  // tab isn't the active rendering target, which would stall this entirely.
  // behavior must be explicit: the site sets `scroll-behavior: smooth` on
  // <html>, so the bare two-arg scrollTo(0, 0) inherits an animated scroll —
  // too slow to ever win against the router's instant correction.
  const forceScrollTop = () => {
    const deadline = Date.now() + 2500
    const tick = () => {
      window.scrollTo({ top: 0, left: 0, behavior: "instant" })
      if (Date.now() < deadline) setTimeout(tick, 50)
    }
    tick()
  }

  // Whenever the route actually becomes "/", after the new page has mounted.
  useEffect(() => {
    if (onHome) forceScrollTop()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname])

  // Covers clicking the logo while already on "/", where Link treats the
  // navigation as a no-op and the effect above never re-fires.
  const scrollTopIfHome = () => {
    if (onHome) forceScrollTop()
  }

  return (
    <>
    <div className="fixed top-4 inset-x-0 z-50 flex justify-center px-4 pointer-events-none">
      <div className={`pointer-events-auto w-full max-w-3xl lg:max-w-5xl ${styles.navRoot}`}>

        {/* Main bar */}
        <nav
          className="flex items-center justify-between gap-3 px-4 py-3 sm:px-5 lg:px-7 lg:py-4 rounded-2xl border border-glass-border"
          style={NAV_STYLE}
        >
          <Link
            href="/"
            aria-label="MStack360 home"
            className="flex items-center shrink-0"
            scroll={false}
            onClick={scrollTopIfHome}
          >
            <Image
              src="/Mstacklogo.webp"
              alt="MStack360"
              width={1024}
              height={512}
              priority
              className="h-7 sm:h-8 lg:h-9 w-auto"
            />
          </Link>

          {/* Desktop links — needs real room for the mega-menu triggers, so
              this only switches on at `lg`; below that the burger takes over,
              same as it always did, just one breakpoint later than before. */}
          <div className="hidden lg:flex items-center gap-6 xl:gap-8" style={{ fontFamily: "system-ui, -apple-system, sans-serif" }}>
            {NAV_LINKS.map(l => {
              const menu = menuFor(l.label)

              if (!menu) {
                return (
                  <a
                    key={l.label}
                    href={l.href}
                    className="text-[12px] text-muted-foreground hover:text-foreground transition-colors duration-200 tracking-wide"
                  >
                    {l.label}
                  </a>
                )
              }

              return (
                <div key={l.label} className={styles.navItem}>
                  <a
                    href={l.href}
                    className="inline-flex items-center gap-1 text-[12px] text-muted-foreground hover:text-foreground transition-colors duration-200 tracking-wide"
                  >
                    {l.label}
                    <svg className={styles.chevron} width="9" height="9" viewBox="0 0 9 9" fill="none" aria-hidden="true">
                      <path d="M1.5 3L4.5 6L7.5 3" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </a>

                  {/* Mega panel — spans the full nav width (positioned against
                      the nav root, not this item) so the link groups and the
                      media card sit side by side horizontally. */}
                  <div className={styles.dropdown}>
                    <div className={styles.dropdownInner}>
                      <div className={styles.panel}>
                        <div className={styles.panelMain}>
                          <div className={styles.panelHead}>
                            <span className={styles.panelTitle}>{l.label}</span>
                            <span className={styles.panelBlurb}>{menu.blurb}</span>
                          </div>

                          <div className={styles.groups}>
                            {menu.groups.map((g, gi) => (
                              <div key={g.heading} className={styles.group}>
                                <span className={styles.groupHeading}>{g.heading}</span>
                                {g.links.map((m, i) => (
                                  <a
                                    key={m.label}
                                    href={m.href}
                                    className={styles.itemLink}
                                    style={{ "--i": gi * 2 + i } as CSSProperties}
                                  >
                                    <span className={styles.itemDot} />
                                    <span className={styles.itemText}>
                                      <span className={styles.itemLabel}>{m.label}</span>
                                      <span className={styles.itemDesc}>{m.desc}</span>
                                    </span>
                                    <svg
                                      className={styles.itemArrow}
                                      width="12"
                                      height="12"
                                      viewBox="0 0 12 12"
                                      fill="none"
                                      aria-hidden="true"
                                    >
                                      <path d="M3.5 6h5M6.5 3.5 9 6l-2.5 2.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                  </a>
                                ))}
                              </div>
                            ))}
                          </div>

                          <div className={styles.panelFoot}>
                            <a href={l.href} className={styles.footLink}>
                              View all {l.label}
                              <span aria-hidden="true">→</span>
                            </a>
                          </div>
                        </div>

                        <a href={menu.media.href} className={styles.media}>
                          <span className={styles.mediaVisual}>
                            {menu.media.image ? (
                              <Image
                                src={menu.media.image}
                                alt=""
                                fill
                                sizes="280px"
                                className="object-cover"
                              />
                            ) : (
                              <span className={styles.mediaGrid} aria-hidden="true" />
                            )}
                            <span className={styles.mediaLogos}>
                              {menu.media.logos.map(slug => (
                                <AppLogo key={slug} slug={slug} size={26} />
                              ))}
                            </span>
                          </span>
                          <span className={styles.mediaBody}>
                            <span className={styles.mediaEyebrow}>{menu.media.eyebrow}</span>
                            <span className={styles.mediaTitle}>{menu.media.title}</span>
                            <span className={styles.mediaDesc}>{menu.media.desc}</span>
                            <span className={styles.mediaCta}>
                              {menu.media.cta}
                              <span aria-hidden="true">→</span>
                            </span>
                          </span>
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

          <div className="flex items-center gap-1.5 sm:gap-2">
            <ThemeToggle />

            <button className="text-[12px] px-4 py-2 lg:px-5 lg:py-2.5 rounded-xl border border-teal/40 text-teal hover:text-foreground hover:border-teal hover:bg-teal/20 transition-all duration-200 tracking-wide hidden lg:block" style={{ fontFamily: "system-ui, -apple-system, sans-serif" }}>
              FREE CONSULTATION
            </button>

            {/* Burger — everything below `lg`, matching the desktop links' breakpoint */}
            <button
              onClick={() => setOpen(v => !v)}
              className="lg:hidden flex flex-col justify-center items-center w-9 h-9 gap-[5px] rounded-lg hover:bg-accent/60 transition-colors"
              aria-label={open ? "Close menu" : "Open menu"}
              aria-expanded={open}
              aria-controls={MOBILE_MENU_ID}
            >
              <span
                className="block h-px bg-foreground/70 transition-all duration-300 origin-center"
                style={{
                  width: "18px",
                  transform: open ? "translateY(6px) rotate(45deg)" : "none",
                }}
              />
              <span
                className="block h-px bg-foreground/70 transition-all duration-300"
                style={{
                  width: "18px",
                  opacity: open ? 0 : 1,
                  transform: open ? "scaleX(0)" : "none",
                }}
              />
              <span
                className="block h-px bg-foreground/70 transition-all duration-300 origin-center"
                style={{
                  width: "18px",
                  transform: open ? "translateY(-6px) rotate(-45deg)" : "none",
                }}
              />
            </button>
          </div>
        </nav>

      </div>
    </div>

    {/* Mobile side menu. A sibling of the nav bar, not a child: it's its own
        fixed full-viewport layer, and nesting it inside the bar's z-50 stacking
        context would paint it over the pill — burger included, which is the
        close affordance and must stay tappable. */}
    <MobileMenu id={MOBILE_MENU_ID} open={open} onClose={close} />
    </>
  )
}
