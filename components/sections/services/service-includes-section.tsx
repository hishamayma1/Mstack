import { BentoCard } from "@/components/ui/bento-card"
import { MouseGlowGrid } from "@/components/ui/mouse-glow-grid"
import { SectionHeader } from "@/components/ui/section-header"
import type { ServiceItem } from "@/lib/cms/services"

// The line items the monthly fee buys. Numbered, because a visitor scanning
// for "is X included" reads a list far faster than prose.
export function ServiceIncludesSection({
  serviceTitle,
  includes,
}: {
  serviceTitle: string
  includes: ServiceItem[]
}) {
  if (includes.length === 0) return null

  return (
    <section id="included" className="py-28 px-6 md:px-12 lg:px-20 border-t border-border">
      <div className="max-w-6xl mx-auto">
        <SectionHeader
          eyebrow="WHAT'S INCLUDED"
          title={`Everything in\n${serviceTitle}.`}
          intro="No asterisks. This is the scope of the engagement — anything outside it gets quoted separately rather than quietly absorbed."
        />

        <MouseGlowGrid className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {includes.map((item, index) => (
            <BentoCard key={item.title} className="p-8" delay={index * 70}>
              <span
                aria-hidden="true"
                className="pointer-events-none absolute -z-10 inset-y-0 left-0 w-1 bg-linear-to-b from-svc to-svc-2 opacity-70 transition-opacity duration-300 group-hover:opacity-100"
              />
              <span className="inline-flex h-8 min-w-8 items-center justify-center rounded-lg bg-svc/10 px-2 font-pixel text-[11px] tracking-widest text-svc-ink">
                {String(index + 1).padStart(2, "0")}
              </span>
              <h3 className="mt-4 text-lg font-light">{item.title}</h3>
              <p className="mt-2.5 text-sm text-muted-foreground leading-relaxed">{item.description}</p>
            </BentoCard>
          ))}
        </MouseGlowGrid>
      </div>
    </section>
  )
}
