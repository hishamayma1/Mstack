import type { Metadata } from "next"
import { PageShell } from "@/components/layout/page-shell"
import { PageHero } from "@/components/sections/shared/page-hero"
import { CTAButtons } from "@/components/ui/section-cta"
import { CaseStudiesImpactSection } from "@/components/sections/case-studies/case-studies-impact-section"
import { CaseStudiesExplorer } from "@/components/sections/case-studies/case-studies-explorer"
import { TestimonialsSection } from "@/components/sections/shared/testimonials-section"
import { FinalCTASection } from "@/components/sections/shared/final-cta-section"
import { getCaseStudies } from "@/lib/cms/case-studies"

export const metadata: Metadata = {
  title: "Case Studies | MStack360 — Real Microsoft 365 Results",
  description:
    "See how businesses across healthcare, professional services, manufacturing, hospitality, retail, and education transformed their Microsoft 365 environments with MStack360.",
}

// Server component. Case studies are read once through Payload's local API
// and cached (see lib/payload-case-studies.ts), then handed to the explorer as
// plain data — search, filter, sort and layout all run in the browser against
// that already-fetched list, so there are no per-keystroke requests and no
// client-side fetching waterfall.
export default async function CaseStudiesPage() {
  const caseStudies = await getCaseStudies()

  return (
    <PageShell>
      <PageHero
        eyebrow="CASE STUDIES"
        title={"Proof, Not Just\nPromises."}
        subtitle="A look at the environments we've migrated, secured, and automated — and the measurable results that followed."
        actions={
          <CTAButtons
            primaryLabel="Book a Free Consultation"
            secondaryLabel="Browse the Stories"
            secondaryHref="#all-studies"
            align="center"
          />
        }
      />
      <CaseStudiesImpactSection caseStudies={caseStudies} />
      <CaseStudiesExplorer caseStudies={caseStudies} />
      <TestimonialsSection />
      <FinalCTASection />
    </PageShell>
  )
}
