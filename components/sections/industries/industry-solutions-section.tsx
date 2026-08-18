import { BentoCard } from "@/components/ui/bento-card"
import { MouseGlowGrid } from "@/components/ui/mouse-glow-grid"
import { SectionHeader } from "@/components/ui/section-header"
import { SectionCTA } from "@/components/ui/section-cta"
import type { IndustrySolution } from "@/lib/cms/industries"

// The "how we fix it" half of the challenge/solution pair. Numbered so the
// list reads as a deliberate programme of work rather than a feature dump.
export function IndustrySolutionsSection({
  industryTitle,
  solutions,
}: {
  industryTitle: string
  solutions: IndustrySolution[]
}) {
  if (solutions.length === 0) return null

  return (
    <section id="solutions" className="py-28 px-6 md:px-12 lg:px-20 border-t border-white/[0.08]">
      <div className="max-w-6xl mx-auto">
        <SectionHeader
          eyebrow="WHAT WE SOLVE"
          title={`Built for\n${industryTitle}.`}
          intro="Each of these is a scoped piece of work with a clear outcome. We start with whichever one is costing you the most right now."
        />

        <MouseGlowGrid className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {solutions.map((s, i) => (
            <BentoCard key={s.title} className="p-8 flex flex-col" delay={i * 70}>
              <span className="font-pixel text-[11px] text-white/30 tracking-widest block mb-5">
                {String(i + 1).padStart(2, "0")}
              </span>
              <h3 className="text-lg font-light mb-2">{s.title}</h3>
              <p className="text-sm text-white/55 leading-relaxed">{s.description}</p>
            </BentoCard>
          ))}
        </MouseGlowGrid>

        <SectionCTA
          text={`Want these scoped for your ${industryTitle.toLowerCase()} business? We'll put rough timelines and effort against each one.`}
          primaryLabel="Get a Scoped Plan"
          secondaryLabel="Compare Service Levels"
          secondaryHref="/solutions"
        />
      </div>
    </section>
  )
}
