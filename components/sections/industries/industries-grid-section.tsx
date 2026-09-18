import Link from "next/link"
import { BentoCard } from "@/components/ui/bento-card"
import { MouseGlowGrid } from "@/components/ui/mouse-glow-grid"
import { SectionHeader } from "@/components/ui/section-header"
import { SectionCTA } from "@/components/ui/section-cta"
import { MediaFrame } from "@/components/ui/media-frame"
import { cardMediaFor } from "@/lib/content/industry-media"
import type { IndustryCard } from "@/lib/cms/industries"

// Fully server-rendered grid, fed by the "industries" Payload collection —
// every industry is present in the initial HTML (crawlable, linkable),
// each card routing to its own /industries/[slug] page. Cards preview the
// Microsoft tools that industry gets, so the grid sells before the click.
export function IndustriesGridSection({ industries }: { industries: IndustryCard[] }) {
  return (
    <section id="sectors" className="py-28 px-6 md:px-12 lg:px-20 border-t border-border">
      <div className="max-w-6xl mx-auto">
        <SectionHeader
          eyebrow="SECTOR EXPERTISE"
          title={"Find Your\nIndustry."}
          intro="Pick your sector to see the problems we solve there, the exact Microsoft tools we deploy, and what changes once they're in place."
        />

        <MouseGlowGrid className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {industries.map((ind, i) => {
            const media = cardMediaFor(ind.slug, ind.title)
            return (
            <Link key={ind.id} href={`/industries/${ind.slug}`} className="block group/card">
              <BentoCard className="p-8 h-full cursor-pointer flex flex-col" delay={i * 60}>
                <MediaFrame
                  src={media.src}
                  alt={media.alt}
                  label={media.label}
                  hint={media.hint}
                  aspect="16/9"
                  className="mb-6"
                  sizes="(max-width: 768px) 100vw, 45vw"
                />

                <div className="flex items-center justify-between mb-5">
                  <span className="font-pixel text-[11px] text-muted-foreground tracking-widest">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  {ind.solutionCount > 0 ? (
                    <span className="text-[11px] text-muted-foreground tracking-wide">
                      {ind.solutionCount} solutions
                    </span>
                  ) : null}
                </div>

                <h3 className="text-xl font-light mb-3">{ind.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed mb-6">{ind.summary}</p>

                {ind.toolNames.length > 0 ? (
                  <div className="flex flex-wrap gap-1.5 mb-6">
                    {ind.toolNames.map((name) => (
                      <span
                        key={name}
                        className="px-2.5 py-1 rounded-full text-[11px] tracking-wide text-muted-foreground bg-card border border-border"
                      >
                        {name}
                      </span>
                    ))}
                  </div>
                ) : null}

                <span
                  className={`mt-auto pt-5 border-t border-border text-xs tracking-wide transition-colors ${
                    i % 2 === 0
                      ? "text-blue-600 dark:text-blue-300/80 group-hover/card:text-blue-500 dark:group-hover/card:text-blue-300"
                      : "text-teal/80 group-hover/card:text-teal"
                  }`}
                >
                  See the toolkit for {ind.title} →
                </span>
              </BentoCard>
            </Link>
            )
          })}
        </MouseGlowGrid>

        <SectionCTA
          text="Don't see your sector listed? We've built Microsoft 365 environments for businesses in most industries — the approach adapts."
          primaryLabel="Talk to a Specialist"
          secondaryLabel="See Our Solutions"
          secondaryHref="/solutions"
        />

        <p className="mt-8 text-xs text-muted-foreground leading-relaxed max-w-2xl">
          *PCI and HIPAA policy compliance requires additional, out-of-scope labour. Reach out for more information.
        </p>
      </div>
    </section>
  )
}
