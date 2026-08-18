import type { Metadata } from "next"
import { PageShell } from "@/components/layout/page-shell"
import { PageHero } from "@/components/sections/shared/page-hero"
import { CTAButtons } from "@/components/ui/section-cta"
import { IndustriesValueSection } from "@/components/sections/industries/industries-value-section"
import { IndustriesGridSection } from "@/components/sections/industries/industries-grid-section"
import { FinalCTASection } from "@/components/sections/shared/final-cta-section"
import { getIndustries } from "@/lib/cms/industries"

export const metadata: Metadata = {
  title: "Industries | MStack360 — Microsoft 365 by Sector",
  description:
    "Microsoft 365 solutions tailored to Healthcare, Banking & Finance, Education, Manufacturing, Retail & Wholesale, Hospitality, and Professional Services — with the exact tools each sector needs.",
}

export default async function IndustriesPage() {
  const industries = await getIndustries()

  return (
    <PageShell>
      <PageHero
        eyebrow="INDUSTRIES"
        title={"Built for\nYour Industry."}
        subtitle="Every sector runs Microsoft 365 differently. We tailor security, automation, and support to how your business actually operates — then show you exactly which tools do the work."
        actions={
          <CTAButtons
            primaryLabel="Book a Free Consultation"
            secondaryLabel="Browse Sectors"
            secondaryHref="#sectors"
            align="center"
          />
        }
      />
      <IndustriesValueSection />
      <IndustriesGridSection industries={industries} />
      <FinalCTASection />
    </PageShell>
  )
}
