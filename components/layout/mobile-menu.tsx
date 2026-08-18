"use client"

import { useEffect, useRef, useState, type CSSProperties } from "react"
import { usePathname } from "next/navigation"
import { NAV_LINKS, NAV_MENUS, SOCIAL_LINKS } from "@/lib/content/site"
import styles from "./mobile-menu.module.css"

/*
 * Mobile side menu. Rendered by MobileNav, which owns the `open` state because
 * the burger inside the nav pill is the toggle.
 *
 * Sub-navigation comes from the same NAV_MENUS data the desktop hover panels
 * use, so a link added there shows up in both places — here as a collapsible
 * accordion (the media/feature card is desktop-only; on a phone it would push
 * the actual links below the fold).
 *
 * All animation is CSS (see mobile-menu.module.css). This file only tracks
 * `open`, which accordion is expanded, and the body scroll lock — no animation
 * library, and no measuring or per-frame work on the main thread.
 */

const CHEVRON = (
  <svg className={styles.chevron} width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
    <path d="M2.5 4.5 6 8l3.5-3.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

export function MobileMenu({
  id,
  open,
  onClose,
}: {
  id: string
  open: boolean
  onClose: () => void
}) {
  const [expanded, setExpanded] = useState<string | null>(null)
  const pathname = usePathname()
  const resetTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  // Collapse whatever was open — but only once the sheet has slid away, so the
  // accordion isn't seen snapping shut mid-exit.
  useEffect(() => {
    if (open) return
    resetTimer.current = setTimeout(() => setExpanded(null), 500)
    return () => {
      if (resetTimer.current) clearTimeout(resetTimer.current)
    }
  }, [open])

  // Escape closes, and the page behind stops scrolling while the sheet is up.
  useEffect(() => {
    if (!open) return

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose()
    }
    document.addEventListener("keydown", onKeyDown)

    const previous = document.body.style.overflow
    document.body.style.overflow = "hidden"
    // Read by mobile-menu.module.css to move the floating action cluster out of
    // the sheet's way; see the :global rule there.
    document.body.dataset.mobileMenu = "open"

    return () => {
      document.removeEventListener("keydown", onKeyDown)
      document.body.style.overflow = previous
      delete document.body.dataset.mobileMenu
    }
  }, [open, onClose])

  return (
    <div
      className={styles.root}
      data-open={open ? "true" : "false"}
      style={{ "--foot-delay": `${280 + NAV_LINKS.length * 45}ms` } as CSSProperties}
    >
      <button className={styles.scrim} onClick={onClose} tabIndex={-1} aria-hidden="true" />

      {/* Decorative slabs that arrive ahead of the panel — the "staggered" read. */}
      <div className={`${styles.sheet} ${styles.prelayer}`} aria-hidden="true" />
      <div className={`${styles.sheet} ${styles.prelayer}`} aria-hidden="true" />

      <nav id={id} className={`${styles.sheet} ${styles.panel}`} aria-label="Mobile navigation" aria-hidden={!open}>
        <ul className={styles.list}>
          {NAV_LINKS.map((l, i) => {
            const menu = NAV_MENUS[l.label] ?? null
            const isExpanded = expanded === l.label
            const active = pathname === l.href

            return (
              <li key={l.label} className={styles.item} style={{ "--i": i } as CSSProperties}>
                <div className={styles.mask}>
                  <div className={styles.row}>
                    <a
                      href={l.href}
                      className={styles.link}
                      onClick={onClose}
                      data-active={active ? "true" : undefined}
                      aria-current={active ? "page" : undefined}
                    >
                      <span className={styles.num} aria-hidden="true" />
                      <span>{l.label}</span>
                    </a>

                    {menu && (
                      <button
                        type="button"
                        className={styles.expander}
                        aria-expanded={isExpanded}
                        aria-controls={`${id}-sub-${i}`}
                        aria-label={`${isExpanded ? "Hide" : "Show"} ${l.label} links`}
                        onClick={() => setExpanded(current => (current === l.label ? null : l.label))}
                      >
                        {CHEVRON}
                      </button>
                    )}
                  </div>
                </div>

                {menu && (
                  <div
                    id={`${id}-sub-${i}`}
                    className={styles.sub}
                    data-expanded={isExpanded ? "true" : "false"}
                    role="region"
                    aria-label={`${l.label} links`}
                  >
                    <div className={styles.subInner}>
                      <div className={styles.subBody}>
                        <span className={styles.blurb}>{menu.blurb}</span>

                        {menu.groups.map(g => (
                          <div key={g.heading} className={styles.group}>
                            <span className={styles.groupHeading}>{g.heading}</span>
                            {g.links.map(m => (
                              <a key={m.label} href={m.href} className={styles.subLink} onClick={onClose}>
                                <span className={styles.dot} aria-hidden="true" />
                                <span className={styles.subText}>
                                  <span className={styles.subLabel}>{m.label}</span>
                                  <span className={styles.subDesc}>{m.desc}</span>
                                </span>
                              </a>
                            ))}
                          </div>
                        ))}

                        <a href={l.href} className={styles.viewAll} onClick={onClose}>
                          View all {l.label}
                          <span aria-hidden="true">→</span>
                        </a>
                      </div>
                    </div>
                  </div>
                )}
              </li>
            )
          })}
        </ul>

        <div className={styles.foot}>
          <a href="/contact" className={styles.cta} onClick={onClose}>
            FREE CONSULTATION
          </a>

          <div className={styles.socials}>
            <span className={styles.socialsTitle}>Follow</span>
            <ul className={styles.socialsList}>
              {SOCIAL_LINKS.map(s => (
                <li key={s.label}>
                  <a
                    href={s.href}
                    className={styles.socialsLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={onClose}
                  >
                    {s.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </nav>
    </div>
  )
}
