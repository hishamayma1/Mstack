import Link from "next/link"
import { Tag } from "@/components/ui/tag"
import { BentoCard } from "@/components/ui/bento-card"
import { MouseGlowGrid } from "@/components/ui/mouse-glow-grid"
import { formatMoney } from "@/lib/pricing"
import type { ServiceCard } from "@/lib/cms/services"

// The standalone engagements that sit alongside the five-level ladder. Same
// prop-driven shape as ServiceLevelsSection — the page fetches, this renders.
export function SolutionAddonsSection({ addons }: { addons: ServiceCard[] }) {
  if (addons.length === 0) return null

  return (
    <section id="add-ons" className="py-32 px-6 md:px-12 lg:px-20 border-t border-white/[0.08]">
      <div className="max-w-6xl mx-auto">
        <div className="mb-16 max-w-2xl">
          <Tag>SPECIALIST ENGAGEMENTS</Tag>
          <h2 className="mt-5 text-4xl md:text-5xl font-light tracking-tight leading-[1.05]">
            Focused Add-Ons for
            <br />
            Specific Needs.
          </h2>
          <p className="mt-5 text-sm text-white/55 leading-relaxed">
            Beyond the five service levels, these are the standalone engagements we run most often —
            scoped independently or layered on top of an existing plan.
          </p>
        </div>

        <MouseGlowGrid className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {addons.map((addon, index) => (
            <BentoCard key={addon.id} className="p-8 flex flex-col" delay={index * 70}>
              <h3 className="text-lg font-light mb-2">
                <Link
                  href={`/solutions/${addon.slug}`}
                  className="hover:text-blue-300 transition-colors"
                >
                  {addon.title}
                </Link>
              </h3>
              <p className="text-sm text-white/55 leading-relaxed">{addon.summary}</p>

              {addon.highlights.length > 0 ? (
                <div className="mt-5 flex flex-wrap gap-1.5">
                  {addon.highlights.map((highlight) => (
                    <span
                      key={highlight}
                      className="text-[10px] px-2.5 py-1 rounded-full bg-white/[0.05] border border-white/[0.08] text-white/50 tracking-wide"
                    >
                      {highlight}
                    </span>
                  ))}
                </div>
              ) : null}

              <div className="mt-auto pt-5 flex items-baseline justify-between gap-3">
                <span className="text-sm text-white/45">
                  {addon.fromPricePerSeat !== null ? (
                    <>
                      from{" "}
                      <span className="text-white/85 text-base">
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
                  className="text-[11px] tracking-widest text-blue-300/80 hover:text-blue-300 transition-colors whitespace-nowrap"
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
