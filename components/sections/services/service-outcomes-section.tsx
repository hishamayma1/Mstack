import { SectionHeader } from "@/components/ui/section-header"
import type { ServiceItem } from "@/lib/cms/services"

// Rows rather than cards, matching the industries pages: outcomes are read
// sequentially as a short argument, not scanned as a grid of options.
export function ServiceOutcomesSection({ outcomes }: { outcomes: ServiceItem[] }) {
  if (outcomes.length === 0) return null

  return (
    <section id="outcomes" className="py-28 px-6 md:px-12 lg:px-20 border-t border-border">
      <div className="max-w-6xl mx-auto">
        <SectionHeader
          eyebrow="OUTCOMES"
          title={"What Changes\nOnce It's Live."}
          intro="The point of the work, stated as what's different afterwards rather than what we did."
        />

        <div className="flex flex-col">
          {outcomes.map((outcome, index) => (
            <div
              key={outcome.title}
              className="grid grid-cols-1 md:grid-cols-[auto_1fr_1.2fr] gap-4 md:gap-10 py-8 border-t border-border last:border-b"
            >
              <span className="font-pixel text-[11px] text-muted-foreground tracking-widest md:pt-1.5">
                {String(index + 1).padStart(2, "0")}
              </span>
              <h3 className="text-xl font-light">{outcome.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{outcome.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
