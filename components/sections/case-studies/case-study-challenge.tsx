import { SectionHeader } from "@/components/ui/section-header"
import { SectionCTA } from "@/components/ui/section-cta"
import type { CaseStudyDetail } from "@/lib/cms/case-studies"

// "Where They Started" — the problem the client arrived with. The paragraph is
// always present (it's a required field); the bullets only render if an editor
// broke the problem down further.
export function CaseStudyChallenge({ study }: { study: CaseStudyDetail }) {
  return (
    <section id="challenge" className="py-24 px-6 md:px-12 lg:px-20 border-t border-border">
      <div className="max-w-6xl mx-auto">
        <SectionHeader
          eyebrow="THE CHALLENGE"
          title={"Where They\nStarted."}
          intro={study.challenge}
        />

        {study.challengePoints.length > 0 ? (
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {study.challengePoints.map((p, i) => (
              <li
                key={p}
                className="flex items-start gap-3.5 rounded-2xl border border-border bg-accent/20 p-6"
              >
                <span
                  aria-hidden="true"
                  className={`mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full ${i % 2 === 0 ? "bg-blue-400/70" : "bg-teal/70"}`}
                />
                <span className="text-sm text-muted-foreground leading-relaxed">{p}</span>
              </li>
            ))}
          </ul>
        ) : null}

        <SectionCTA
          text="If this sounds like your environment, the first conversation is free and takes 15 minutes."
          primaryLabel="Book a Free Consultation"
        />
      </div>
    </section>
  )
}
