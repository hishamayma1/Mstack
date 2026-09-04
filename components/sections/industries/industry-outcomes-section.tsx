import { SectionHeader } from "@/components/ui/section-header"
import { SectionCTA } from "@/components/ui/section-cta"
import type { IndustryOutcome } from "@/lib/cms/industries"

// Closes the loop opened by the challenges section: what actually changes once
// the toolkit is in place. Numbered rows rather than cards, so it reads as a
// summary and doesn't compete visually with the toolkit grid above it.
export function IndustryOutcomesSection({ outcomes }: { outcomes: IndustryOutcome[] }) {
  if (outcomes.length === 0) return null

  return (
    <section id="outcomes" className="py-28 px-6 md:px-12 lg:px-20 border-t border-border">
      <div className="max-w-6xl mx-auto">
        <SectionHeader
          eyebrow="THE OUTCOME"
          title={"What Changes\nOnce It's Live."}
        />

        <ol className="border-t border-border">
          {outcomes.map((o, i) => (
            <li
              key={o.title}
              className="grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-8 py-8 border-b border-border group hover:bg-accent/30 transition-colors"
            >
              <span className="md:col-span-1 font-pixel text-[11px] text-muted-foreground tracking-widest">
                {String(i + 1).padStart(2, "0")}
              </span>
              <h3 className="md:col-span-4 text-lg font-light group-hover:text-blue-500 dark:group-hover:text-blue-300/90 transition-colors">
                {o.title}
              </h3>
              <p className="md:col-span-7 text-sm text-muted-foreground leading-relaxed">{o.description}</p>
            </li>
          ))}
        </ol>

        <SectionCTA
          text="These are the results our clients report. We'll tell you honestly which are realistic for your setup before you commit to anything."
          primaryLabel="Book a Free Consultation"
          secondaryLabel="Read Case Studies"
          secondaryHref="/case-studies"
        />
      </div>
    </section>
  )
}
