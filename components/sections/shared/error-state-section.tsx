import type { ReactNode } from "react"
import Link from "next/link"
import { Tag } from "@/components/ui/tag"
import { RevealText } from "@/components/ui/reveal-text"
import styles from "./cta-backdrop.module.css"

// Shared layout for every error state on the site (404, route error, global
// error). One component so a missing page and a failed render feel like the
// same site rather than two different accidents.
//
// Server component — the CSS backdrop is the same one the closing CTA uses, so
// an error page costs no extra request and no extra JS. Interactive bits (a
// retry button) are passed in as `actions` by the client error boundaries.

export type ErrorLink = { label: string; href: string; description: string }

export function ErrorStateSection({
  code,
  eyebrow,
  title,
  message,
  detail,
  actions,
  links,
}: {
  /** Big number or short token — "404", "500". */
  code: string
  eyebrow: string
  /** Line breaks control wrapping. */
  title: string
  message: string
  /** Small monospace line, e.g. an error digest for support to quote. */
  detail?: string
  actions?: ReactNode
  links?: ErrorLink[]
}) {
  return (
    <section
      className={`${styles.backdrop} min-h-[70vh] flex items-center py-28 px-6 md:px-12 lg:px-20`}
    >
      <div className={styles.glow} aria-hidden="true" />
      <div className={styles.floor} aria-hidden="true" />

      <div className="relative max-w-4xl mx-auto w-full text-center">
        <span
          aria-hidden="true"
          className="block font-pixel text-6xl md:text-8xl text-white/[0.07] tracking-[0.2em] mb-6 select-none"
        >
          {code}
        </span>

        <div className="flex justify-center">
          <Tag>{eyebrow}</Tag>
        </div>

        <RevealText
          as="h1"
          className="mt-5 text-4xl md:text-5xl lg:text-6xl font-light tracking-tight leading-[1.05]"
        >
          {title}
        </RevealText>

        <p className="mt-6 text-base text-white/55 leading-relaxed max-w-xl mx-auto">{message}</p>

        {detail ? (
          <p className="mt-5 inline-block rounded-lg border border-white/[0.08] bg-white/[0.02] px-3.5 py-2 font-pixel text-[11px] tracking-wider text-white/35">
            {detail}
          </p>
        ) : null}

        {actions ? <div className="mt-9 flex justify-center">{actions}</div> : null}

        {links && links.length > 0 ? (
          <div className="mt-16 text-left">
            <p className="text-[11px] tracking-widest text-white/35 mb-4 text-center">
              OR TRY ONE OF THESE
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {links.map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  className="group rounded-2xl border border-white/[0.08] bg-white/[0.02] p-5 transition-all hover:border-blue-500/30 hover:bg-white/[0.05]"
                >
                  <span className="flex items-center justify-between gap-3 text-sm font-light">
                    {l.label}
                    <span
                      aria-hidden="true"
                      className="text-blue-300/60 group-hover:text-blue-300 transition-colors"
                    >
                      →
                    </span>
                  </span>
                  <span className="mt-1.5 block text-xs text-white/45 leading-relaxed">
                    {l.description}
                  </span>
                </Link>
              ))}
            </div>
          </div>
        ) : null}
      </div>
    </section>
  )
}
