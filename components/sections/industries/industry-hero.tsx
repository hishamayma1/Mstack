import Link from "next/link"
import { RevealText } from "@/components/ui/reveal-text"
import { Tag } from "@/components/ui/tag"
import { CTAButtons } from "@/components/ui/section-cta"
import { MediaFrame } from "@/components/ui/media-frame"
import { heroMediaFor } from "@/lib/content/industry-media"
import type { IndustryStat } from "@/lib/cms/industries"
import styles from "@/components/sections/shared/page-hero.module.css"

// Industry-page hero. Same decorative background as the shared PageHero, but
// two-column with a breadcrumb, an above-the-fold CTA, a sector visual, and a
// proof band — the elements a landing page needs that a generic header doesn't.
export function IndustryHero({
  industryTitle,
  slug,
  headline,
  valueProp,
  stats,
}: {
  industryTitle: string
  slug: string
  headline: string
  valueProp: string
  stats: IndustryStat[]
}) {
  const media = heroMediaFor(slug)
  return (
    <section className="relative pt-36 md:pt-44 pb-20 px-6 md:px-12 lg:px-20 overflow-hidden">
      <div className={styles.grid} aria-hidden="true" />
      <div className={styles.glow} aria-hidden="true" />

      <div className="relative z-10 max-w-6xl mx-auto">
        <nav aria-label="Breadcrumb" className="mb-6">
          <ol className="flex items-center gap-2 text-xs text-white/40 tracking-wide">
            <li>
              <Link href="/industries" className="hover:text-white/70 transition-colors">
                Industries
              </Link>
            </li>
            <li aria-hidden="true">/</li>
            <li className="text-white/60">{industryTitle}</li>
          </ol>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14 items-center">
          <div>
            <Tag>MICROSOFT 365 FOR {industryTitle.toUpperCase()}</Tag>
            <RevealText
              as="h1"
              className="mt-5 text-4xl md:text-5xl lg:text-6xl font-light tracking-tight leading-[1.05]"
            >
              {headline}
            </RevealText>
            <p className="mt-6 text-base text-white/55 leading-relaxed">{valueProp}</p>

            <div className="mt-9">
              <CTAButtons
                primaryLabel="Book a Free Consultation"
                secondaryLabel={`See the ${industryTitle} Toolkit`}
                secondaryHref="#toolkit"
              />
            </div>
          </div>

          <MediaFrame
            src={media.src}
            alt={media.alt}
            label={media.label}
            hint={media.hint}
            aspect="16/10"
            priority
            sizes="(max-width: 1024px) 100vw, 50vw"
          />
        </div>

        {stats.length > 0 ? (
          <dl className="mt-16 grid grid-cols-1 sm:grid-cols-3 gap-3">
            {stats.map((s) => (
              <div
                key={s.label}
                className="rounded-2xl border border-white/[0.08] bg-white/[0.02] px-6 py-5"
              >
                <dt className="sr-only">{s.label}</dt>
                <dd>
                  <span className="block text-3xl font-light text-blue-400 font-ibm-plex">{s.value}</span>
                  <span className="mt-1 block text-xs text-white/45 tracking-wide">{s.label}</span>
                </dd>
              </div>
            ))}
          </dl>
        ) : null}
      </div>
    </section>
  )
}
