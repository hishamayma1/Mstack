import { BentoCard } from "@/components/ui/bento-card"
import { MouseGlowGrid } from "@/components/ui/mouse-glow-grid"
import { SectionHeader } from "@/components/ui/section-header"
import { SectionCTA } from "@/components/ui/section-cta"
import type { IndustryChallenge } from "@/lib/cms/industries"

// Names the problem before pitching the fix — the page earns the right to
// talk about tools by showing it understands the sector first. Renders
// nothing if an industry has no challenges defined.
export function IndustryChallengesSection({
  industryTitle,
  challenges,
}: {
  industryTitle: string
  challenges: IndustryChallenge[]
}) {
  if (challenges.length === 0) return null

  return (
    <section id="challenges" className="py-28 px-6 md:px-12 lg:px-20 border-t border-border">
      <div className="max-w-6xl mx-auto">
        <SectionHeader
          eyebrow="THE CHALLENGE"
          title={"What's Slowing\nYou Down."}
          intro={`These are the issues we see most often in ${industryTitle} before we get involved. If more than one sounds familiar, the fix is usually configuration, not more software.`}
        />

        <MouseGlowGrid className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {challenges.map((c, i) => (
            <BentoCard key={c.title} className="p-8 flex gap-5" delay={i * 60}>
              <span
                aria-hidden="true"
                className={`mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full ${i % 2 === 0 ? "bg-blue-400/70" : "bg-teal/70"}`}
              />
              <div>
                <h3 className="text-lg font-light mb-2">{c.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{c.description}</p>
              </div>
            </BentoCard>
          ))}
        </MouseGlowGrid>

        <SectionCTA
          text="Recognise these? A free 15-minute call is usually enough to tell you which are fixable with the licences you already own."
          primaryLabel="Book a Free Consultation"
        />
      </div>
    </section>
  )
}
