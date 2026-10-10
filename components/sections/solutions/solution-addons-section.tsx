import Link from "next/link"
import { Tag } from "@/components/ui/tag"
import { BentoCard } from "@/components/ui/bento-card"
import { MouseGlowGrid } from "@/components/ui/mouse-glow-grid"
import { formatMoney } from "@/lib/pricing"
import type { ServiceCard } from "@/lib/cms/services"
import { serviceTheme } from "@/lib/service-theme"
import { ServiceAccent } from "@/components/ui/service-accent"

// The standalone engagements that sit alongside the five-level ladder. Same
// prop-driven shape as ServiceLevelsSection — the page fetches, this renders.
export function SolutionAddonsSection({ addons }: { addons: ServiceCard[] }) {
  if (addons.length === 0) return null

  return (
    <section id="add-ons" className="py-32 px-6 md:px-12 lg:px-20 border-t border-border">
      <div className="max-w-6xl mx-auto">
        <div className="mb-16 max-w-2xl">
          <Tag>SPECIALIST ENGAGEMENTS</Tag>
          <h2 className="mt-5 text-4xl md:text-5xl font-light tracking-tight leading-[1.05]">
            Focused Add-Ons for
            <br />
            Specific Needs.
          </h2>
          <p className="mt-5 text-sm text-muted-foreground leading-relaxed">
            Beyond the five service levels, these are the standalone engagements we run most often —
            scoped independently or layered on top of an existing plan.
          </p>
        </div>

        <MouseGlowGrid className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {addons.map((addon, index) => (
            <BentoCard
              key={addon.id}
              theme={serviceTheme(addon.slug)}
              className="p-8 flex flex-col"
              delay={index * 70}
            >
              <ServiceAccent />

              <div className="mb-5 flex items-center gap-3">
                <span
                  aria-hidden="true"
                  className="h-2.5 w-2.5 rounded-full bg-linear-to-br from-svc to-svc-2 shadow-[0_0_12px_var(--svc)]"
                />
                <span className="text-[11px] tracking-widest text-svc-ink">ADD-ON</span>
              </div>

              <h3 className="text-lg font-light mb-2">
                <Link href={`/solutions/${addon.slug}`} className="transition-colors hover:text-svc-ink">
                  {addon.title}
                </Link>
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{addon.summary}</p>

              {addon.highlights.length > 0 ? (
                <div className="mt-5 flex flex-wrap gap-1.5">
                  {addon.highlights.map((highlight) => (
                    <span
                      key={highlight}
                      className="text-[10px] px-2.5 py-1 rounded-full bg-svc/[0.06] border border-svc/20 text-muted-foreground tracking-wide"
                    >
                      {highlight}
                    </span>
                  ))}
                </div>
              ) : null}

              <div className="mt-auto pt-5 flex items-baseline justify-between gap-3">
                <span className="text-sm text-muted-foreground">
                  {addon.fromPricePerSeat !== null ? (
                    <>
                      from{" "}
                      <span className="text-foreground/85 text-base">
                        {formatMoney(addon.fromPricePerSeat, addon.currency)}
                      </span>{" "}
                      / user / mo
                    </>
                  ) : (
                    "Priced on application"
                  )}
                </span>
                <Link
                  href={`/solutions/${addon.slug}`}
                  className="text-[11px] tracking-widest text-svc-ink hover:opacity-80 transition-opacity whitespace-nowrap"
                >
                  {addon.fromPricePerSeat !== null ? "BUILD PLAN →" : "GET A PRICE →"}
                </Link>
              </div>
            </BentoCard>
          ))}
        </MouseGlowGrid>
      </div>
    </section>
  )
}
