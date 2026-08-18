import type { Metadata } from "next"
import { PageShell } from "@/components/layout/page-shell"
import { PageHero } from "@/components/sections/shared/page-hero"
import { ServiceLevelsSection } from "@/components/sections/solutions/service-levels-section"
import { SolutionAddonsSection } from "@/components/sections/solutions/solution-addons-section"
import { FinalCTASection } from "@/components/sections/shared/final-cta-section"
import { getServices } from "@/lib/cms/services"

export const metadata: Metadata = {
  title: "Solutions | MStack360 — Microsoft 365 Service Levels",
  description:
    "Five progressive Microsoft 365 service levels — Core 365, Cloud 365, Secure 365, Managed 365, and Intelligent 365 — plus migration, security, SharePoint, and Teams Phone add-ons. Price each one against your headcount.",
}

// Server-rendered throughout: getServices() is wrapped in "use cache", so this
// page still prerenders to static HTML and the only hydration on it lives in
// the interactive leaves (BentoCard reveals, RevealText, MouseGlowGrid).
export default async function SolutionsPage() {
  const services = await getServices()
  const levels = services.filter((service) => service.kind === "level")
  const addons = services.filter((service) => service.kind === "addon")

  return (
    <PageShell>
      <PageHero
        eyebrow="SOLUTIONS"
        title={"Microsoft 365,\nBuilt to Scale With You."}
        subtitle="A progressive Microsoft 365 journey — from foundational setup to intelligent automation — plus focused add-ons for specific needs. Every service has its own page where you can size it to your team and get a price."
      />
      <ServiceLevelsSection levels={levels} />
      <SolutionAddonsSection addons={addons} />
      <FinalCTASection />
    </PageShell>
  )
}
