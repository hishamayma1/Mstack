import { BentoCard } from "@/components/ui/bento-card"
import { MouseGlowGrid } from "@/components/ui/mouse-glow-grid"
import { SectionHeader } from "@/components/ui/section-header"
import { SectionCTA } from "@/components/ui/section-cta"
import { MediaFrame } from "@/components/ui/media-frame"
import type { CaseStudyDetail } from "@/lib/cms/case-studies"

const IMAGE_LABEL = "What we built — screenshot, diagram, or before/after"

// "What We Did" — the engagement broken into numbered stages, with the visual
// alongside. With steps, the image sits in a two-column split and sticks while
// the steps scroll past. Without steps it goes full width, so the section still
// has something to show.
export function CaseStudyApproach({ study }: { study: CaseStudyDetail }) {
  const hasSteps = study.approach.length > 0

  return (
    <section id="approach" className="py-24 px-6 md:px-12 lg:px-20 border-t border-border">
      <div className="max-w-6xl mx-auto">
        <SectionHeader eyebrow="THE WORK" title={"What We\nDid."} intro={study.result} />

        {hasSteps ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-10 items-start">
            <MouseGlowGrid className="grid grid-cols-1 gap-3">
              {study.approach.map((step, i) => (
                <BentoCard key={step.title} className="p-7 flex flex-col" delay={i * 70}>
                  <span
                    className={`font-pixel text-[11px] tracking-widest block mb-4 ${
                      i % 2 === 0 ? "text-blue-400/70 dark:text-blue-300/60" : "text-teal/70"
                    }`}
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <h3 className="text-lg font-light mb-2">{step.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{step.description}</p>
                </BentoCard>
              ))}
            </MouseGlowGrid>

            <MediaFrame
              src={study.approachImage?.url}
              alt={study.approachImage?.alt ?? ""}
              label={IMAGE_LABEL}
              hint="1200×900"
              aspect="4/3"
              className="lg:sticky lg:top-28"
              sizes="(max-width: 1024px) 100vw, 45vw"
            />
          </div>
        ) : (
          <MediaFrame
            src={study.approachImage?.url}
            alt={study.approachImage?.alt ?? ""}
            label={IMAGE_LABEL}
            hint="1200×900"
            aspect="16/9"
            sizes="100vw"
          />
        )}

        <SectionCTA
          text="We'd scope the same kind of engagement for your business, with timelines and effort against each stage."
          primaryLabel="Get a Scoped Plan"
          secondaryLabel="Compare Service Levels"
          secondaryHref="/solutions"
        />
      </div>
    </section>
  )
}
