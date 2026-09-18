import { BentoCard } from "@/components/ui/bento-card"
import { MouseGlowGrid } from "@/components/ui/mouse-glow-grid"
import { SectionHeader } from "@/components/ui/section-header"
import { SectionCTA } from "@/components/ui/section-cta"
import type { IndustryTool } from "@/lib/cms/industries"

// The centrepiece of an industry page: the exact Microsoft products we deploy
// for this sector. Each card answers the two questions a buyer actually has —
// what is this, and why do *I* need it — in plain language, kept deliberately
// short so the section is scannable rather than a product manual.
export function IndustryToolkitSection({
  industryTitle,
  tools,
}: {
  industryTitle: string
  tools: IndustryTool[]
}) {
  if (tools.length === 0) return null

  return (
    <section id="toolkit" className="py-28 px-6 md:px-12 lg:px-20 border-t border-border">
      <div className="max-w-6xl mx-auto">
        <SectionHeader
          eyebrow="YOUR TOOLKIT"
          title={"The Microsoft Tools\nYour Sector Needs."}
          intro={`These are the products we configure for ${industryTitle} — what each one does, and why it matters here specifically. Most are already included in the licences you own.`}
        />

        <MouseGlowGrid className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {tools.map((tool, i) => (
            <BentoCard key={tool.name} className="p-7 flex flex-col" delay={i * 60}>
              <span
                className={`inline-flex self-start items-center px-2.5 py-1 rounded-full text-[10px] tracking-widest mb-5 ${
                  i % 2 === 0
                    ? "text-blue-300/70 bg-blue-500/[0.08] border border-blue-500/15"
                    : "text-teal bg-teal/[0.08] border border-teal/20"
                }`}
              >
                {tool.category.toUpperCase()}
              </span>

              <h3 className="text-lg font-light mb-4">{tool.name}</h3>

              <p className="text-sm text-muted-foreground leading-relaxed mb-5">{tool.whatItIs}</p>

              <div className="mt-auto pt-5 border-t border-border">
                <span className="block text-[10px] tracking-widest text-muted-foreground mb-2">
                  WHY {industryTitle.toUpperCase()} NEEDS IT
                </span>
                <p className="text-sm text-foreground/70 leading-relaxed">{tool.whyYouNeedIt}</p>
              </div>
            </BentoCard>
          ))}
        </MouseGlowGrid>

        <SectionCTA
          text="Already paying for most of these? We'll audit your tenant for free and show you which are switched on, which aren't, and which are misconfigured."
          primaryLabel="Get a Free Tenant Audit"
          secondaryLabel="See Our Service Levels"
          secondaryHref="/solutions"
        />
      </div>
    </section>
  )
}
