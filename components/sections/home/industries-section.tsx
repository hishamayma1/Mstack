import { Section, SectionIntro } from "@/components/ui/section"
import { IndustryTabs } from "@/components/sections/home/industry-tabs"

// Sector picker for the homepage. Server component — only the tab list itself
// is a client boundary (see industry-tabs.tsx).
//
// /industries still renders the shared IndustriesSection; this is the
// homepage's own, tidier take on the same content.
export function HomeIndustriesSection() {
  return (
    <Section id="industries" tone="base" size="lg">
      <SectionIntro
        eyebrow="Built for your sector"
        title={"The same platform,\nconfigured for your industry."}
        lead="Nine sectors, each with its own compliance profile, its own bottlenecks, and its own set of Microsoft tools worth deploying first."
      />

      <div className="mt-12">
        <IndustryTabs />
      </div>

      <p className="mt-8 max-w-2xl text-[0.8125rem] leading-[1.7] text-muted-foreground">
        *PCI and HIPAA policy compliance requires additional, out-of-scope labour. Reach out for more
        information.
      </p>
    </Section>
  )
}
