import type { ReactNode } from "react"
import { RevealText } from "@/components/ui/reveal-text"
import { Tag } from "@/components/ui/tag"
import styles from "./page-hero.module.css"

// Shared hero for every sub-page (Solutions, Industries, Case Studies, ...).
// Server component apart from the RevealText leaf, so the decorative
// background and copy ship as static HTML with no hydration cost.
export function PageHero({
  eyebrow,
  title,
  subtitle,
  actions,
}: {
  eyebrow: string
  title: string
  subtitle?: string
  // Optional CTA row rendered under the subtitle. Composed on the server by
  // the calling page, so it adds no client JS to pages that don't pass it.
  actions?: ReactNode
}) {
  return (
    <section className="relative pt-36 md:pt-44 pb-20 px-6 md:px-12 lg:px-20 overflow-hidden">
      <div className={styles.grid} aria-hidden="true" />
      <div className={styles.glow} aria-hidden="true" />
      <div className="relative z-10 max-w-4xl mx-auto text-center">
        <div className="flex justify-center">
          <Tag>{eyebrow}</Tag>
        </div>
        <RevealText
          as="h1"
          className="mt-5 text-5xl md:text-6xl lg:text-7xl font-light tracking-tight leading-[1.05]"
        >
          {title}
        </RevealText>
        {subtitle ? (
          <p className="mt-6 text-base text-white/55 leading-relaxed max-w-2xl mx-auto">{subtitle}</p>
        ) : null}
        {actions ? <div className="mt-9">{actions}</div> : null}
      </div>
    </section>
  )
}
