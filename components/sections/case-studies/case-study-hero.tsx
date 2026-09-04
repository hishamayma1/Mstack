import Link from "next/link"
import Image from "next/image"
import { RevealText } from "@/components/ui/reveal-text"
import { Tag } from "@/components/ui/tag"
import { CTAButtons } from "@/components/ui/section-cta"
import { MediaFrame } from "@/components/ui/media-frame"
import type { CaseStudyDetail } from "@/lib/cms/case-studies"
import styles from "@/components/sections/shared/page-hero.module.css"

// Case study hero: breadcrumb, industry, the outcome as the headline, and the
// headline metric alongside any additional ones. Same decorative backdrop as
// the other page heroes so the detail page belongs to the same site.
export function CaseStudyHero({ study }: { study: CaseStudyDetail }) {
  // The headline stat leads, then whatever extra metrics the editor added.
  const metrics = [study.stat, ...study.metrics].filter((m) => m.value)

  // `headline` falls back to the client name when an editor hasn't written
  // one, so showing the client as an eyebrow above it too would print the
  // same words twice. Only show the eyebrow when it adds something.
  const showClientEyebrow = study.headline !== study.client

  // One metric shouldn't sit in a third of a row looking stranded.
  const metricCols =
    metrics.length >= 3 ? "sm:grid-cols-3" : metrics.length === 2 ? "sm:grid-cols-2" : "max-w-sm"

  return (
    <section className="relative pt-36 md:pt-44 pb-20 px-6 md:px-12 lg:px-20 overflow-hidden">
      <div className={styles.grid} aria-hidden="true" />
      <div className={styles.glow} aria-hidden="true" />

      <div className="relative z-10 max-w-6xl mx-auto">
        <nav aria-label="Breadcrumb" className="mb-6">
          <ol className="flex items-center gap-2 text-xs text-muted-foreground tracking-wide">
            <li>
              <Link href="/case-studies" className="hover:text-foreground transition-colors">
                Case Studies
              </Link>
            </li>
            <li aria-hidden="true">/</li>
            <li className="text-foreground/60">{study.client}</li>
          </ol>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14 items-center">
          <div>
          <div className="flex flex-wrap items-center gap-3">
            <Tag>{study.industry.toUpperCase()}</Tag>
            {study.logoUrl ? (
              <Image
                src={study.logoUrl}
                alt={`${study.client} logo`}
                width={96}
                height={28}
                className="h-7 w-auto object-contain opacity-70"
              />
            ) : null}
          </div>

          {showClientEyebrow ? (
            <p className="mt-6 text-sm text-muted-foreground tracking-wide">{study.client}</p>
          ) : null}
          <RevealText
            as="h1"
            className={`${showClientEyebrow ? "mt-2" : "mt-6"} text-4xl md:text-5xl lg:text-6xl font-light tracking-tight leading-[1.05]`}
          >
            {study.headline}
          </RevealText>

          <p className="mt-6 text-base text-muted-foreground leading-relaxed">{study.summary}</p>

          <div className="mt-9">
            <CTAButtons
              primaryLabel="Get Results Like These"
              secondaryLabel="Read the Story"
              secondaryHref="#challenge"
            />
          </div>
          </div>

          <MediaFrame
            src={study.heroImage?.url}
            alt={study.heroImage?.alt ?? ""}
            label={`${study.client} — the environment we built`}
            hint="1600×1000 · screenshot, dashboard, or on-site photo"
            aspect="16/10"
            priority
            sizes="(max-width: 1024px) 100vw, 50vw"
          />
        </div>

        {metrics.length > 0 ? (
          <dl className={`mt-16 grid grid-cols-1 gap-3 ${metricCols}`}>
            {metrics.map((m) => (
              <div
                key={`${m.value}-${m.label}`}
                className="rounded-2xl border border-border bg-accent/20 px-6 py-5"
              >
                <dt className="sr-only">{m.label}</dt>
                <dd>
                  <span className="block text-3xl font-light text-blue-600 dark:text-blue-400 font-ibm-plex">
                    {m.value}
                  </span>
                  <span className="mt-1 block text-xs text-muted-foreground tracking-wide leading-relaxed">
                    {m.label}
                  </span>
                </dd>
              </div>
            ))}
          </dl>
        ) : null}
      </div>
    </section>
  )
}
