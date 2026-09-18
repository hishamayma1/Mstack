import { BentoCard } from "@/components/ui/bento-card"
import { MouseGlowGrid } from "@/components/ui/mouse-glow-grid"
import { SectionHeader } from "@/components/ui/section-header"
import { SectionCTA } from "@/components/ui/section-cta"

// Sits between the hero and the sector grid on /industries: answers "why does
// an industry-specific partner matter?" before asking the visitor to pick one.
// Static copy — this is positioning, not per-sector content, so it lives here
// rather than in the CMS.

const VALUE_POINTS = [
  {
    n: "01",
    title: "We Already Know Your Constraints",
    desc: "We've deployed Microsoft 365 in regulated, shift-based, and multi-site businesses. You don't spend the first month explaining how your sector works.",
  },
  {
    n: "02",
    title: "Configured, Not Just Licensed",
    desc: "Most businesses already own the tools they need and use a fraction of them. We turn on what your sector actually benefits from and switch off what it doesn't.",
  },
  {
    n: "03",
    title: "Compliance Built In From Day One",
    desc: "Retention, access control, and audit trails are set up as part of the rollout — not bolted on in a panic before a review.",
  },
]

export function IndustriesValueSection() {
  return (
    <section className="py-28 px-6 md:px-12 lg:px-20 border-t border-border">
      <div className="max-w-6xl mx-auto">
        <SectionHeader
          eyebrow="WHY SECTOR MATTERS"
          title={"The Same Licences.\nA Very Different Result."}
          intro="Two businesses on identical Microsoft 365 plans can get completely different value out of them. The difference is configuration built around how your industry actually operates."
        />

        <MouseGlowGrid className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {VALUE_POINTS.map((v, i) => (
            <BentoCard key={v.n} className="p-8 flex flex-col min-h-[240px]" delay={i * 70}>
              <span
                className={`font-pixel text-[11px] tracking-widest block mb-6 ${
                  i % 2 === 0 ? "text-blue-400/70 dark:text-blue-300/60" : "text-teal/70"
                }`}
              >
                {v.n}
              </span>
              <h3 className="text-lg font-light mb-3 mt-auto">{v.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{v.desc}</p>
            </BentoCard>
          ))}
        </MouseGlowGrid>

        <SectionCTA
          text="Not sure how much of your Microsoft 365 investment you're actually using? We'll tell you in 15 minutes, free."
          primaryLabel="Get a Free Review"
        />
      </div>
    </section>
  )
}
