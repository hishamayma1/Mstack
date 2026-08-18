import Link from "next/link"
import { PixelIcon } from "@/components/ui/pixel-icon"
import { RevealText } from "@/components/ui/reveal-text"
import { Tag } from "@/components/ui/tag"
import { BentoCard } from "@/components/ui/bento-card"
import { MouseGlowGrid } from "@/components/ui/mouse-glow-grid"
import { SectionCTA } from "@/components/ui/section-cta"
import { AppLogoRow } from "@/components/ui/app-logo"
import { LEVEL_LOGOS } from "@/lib/content/app-logos"
import { formatMoney } from "@/lib/pricing"
import type { ServiceCard } from "@/lib/cms/services"

// Server component — no "use client" here. BentoCard/PixelIcon/RevealText are
// the only client leaves; this file's own markup is server-rendered.
//
// The levels arrive as a prop rather than being fetched here, because both
// callers (the homepage and /solutions) already fetch services for their own
// reasons — passing them down avoids a second identical query and keeps this
// component free of data access.
export function ServiceLevelsSection({ levels }: { levels: ServiceCard[] }) {
  if (levels.length === 0) return null

  return (
    <section id="services" className="py-32 px-6 md:px-12 lg:px-20">
      <div className="max-w-6xl mx-auto">
        <div className="mb-16">
          <PixelIcon type="platform" size={40} />
          <div className="mt-4">
            <Tag>SERVICE LEVELS</Tag>
          </div>
          <RevealText className="mt-5 text-4xl md:text-5xl lg:text-6xl font-light tracking-tight leading-[1.05]">
            {"Five Levels to\nDigital Excellence."}
          </RevealText>
          <p className="mt-5 text-sm text-white/55 leading-relaxed max-w-xl">
            A progressive journey that transforms your Microsoft 365 environment from basic setup to
            intelligent automation. Every level has its own page — set your headcount and see what
            it costs.
          </p>
        </div>

        <MouseGlowGrid className="grid grid-cols-12 gap-3">
          {levels.map((level, index) => (
            <BentoCard
              key={level.id}
              className="col-span-12 md:col-span-6 lg:col-span-4 p-8 flex flex-col"
              delay={index * 80}
            >
              <div className="flex items-center justify-between mb-5">
                <span className="font-pixel text-[11px] text-white/30 tracking-widest">
                  {String(index + 1).padStart(2, "0")}
                </span>
                {level.tagline ? <Tag>{level.tagline}</Tag> : null}
              </div>

              <h3 className="text-xl font-light mb-3">
                {/* The whole card is not a link — a nested-interactive card
                    breaks keyboard navigation and the logo row's own titles.
                    The heading carries the link instead. */}
                <Link
                  href={`/solutions/${level.slug}`}
                  className="hover:text-blue-300 transition-colors"
                >
                  {level.title}
                </Link>
              </h3>
              <p className="text-sm text-white/55 leading-relaxed mb-5">{level.summary}</p>

              {/* The products this level actually deploys — recognisable before
                  the service list is read. Swap the real marks in via
                  lib/content/app-logos.ts. */}
              <AppLogoRow
                slugs={LEVEL_LOGOS[level.title] ?? []}
                title={`Products included in ${level.title}`}
                className="mb-5"
              />

              <div className="flex flex-wrap gap-1.5 mb-6">
                {level.highlights.map((highlight) => (
                  <span
                    key={highlight}
                    className="text-[10px] px-2.5 py-1 rounded-full bg-white/[0.05] border border-white/[0.08] text-white/50 tracking-wide"
                  >
                    {highlight}
                  </span>
                ))}
              </div>

              <div className="mt-auto pt-4 border-t border-white/[0.08] flex flex-col gap-3">
                {level.bestFor ? (
                  <div className="flex items-center gap-2">
                    <span aria-hidden="true" className="h-1 w-1 rounded-full bg-blue-400/70" />
                    <span className="text-[11px] text-blue-300/80 tracking-wide">
                      Best for: {level.bestFor}
                    </span>
                  </div>
                ) : null}

                <div className="flex items-baseline justify-between gap-3">
                  <span className="text-sm text-white/45">
                    {level.fromPricePerSeat !== null ? (
                      <>
                        from{" "}
                        <span className="text-white/85 text-base">
                          {formatMoney(level.fromPricePerSeat, level.currency)}
                        </span>{" "}
                        / user / mo
                      </>
                    ) : (
                      "Priced on application"
                    )}
                  </span>
                  <Link
                    href={`/solutions/${level.slug}`}
                    className="text-[11px] tracking-widest text-blue-300/80 hover:text-blue-300 transition-colors whitespace-nowrap"
                  >
                    BUILD PLAN →
                  </Link>
                </div>
              </div>
            </BentoCard>
          ))}
        </MouseGlowGrid>

        <p className="mt-8 text-sm text-white/45 leading-relaxed max-w-3xl italic">
          All 5 levels are available as ongoing support models. We don&apos;t just implement and
          leave. We support your full Microsoft 365 environment continuously, across every level, at
          the same time.
        </p>

        <SectionCTA
          text="Not sure which level you're at? Most businesses are further along than they think — we'll tell you in 15 minutes."
          primaryLabel="Find My Level"
          primaryHref="#health-check"
          secondaryLabel="Compare in Detail"
          secondaryHref="/solutions"
        />
      </div>
    </section>
  )
}
