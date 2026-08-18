import { IntroAnimation } from "@/components/ui/intro-animation"
import { MobileNav } from "@/components/layout/mobile-nav"
import { FloatingActions } from "@/components/layout/floating-actions"
import { SiteFooter } from "@/components/layout/site-footer"
import { HeroSection } from "@/components/sections/home/hero-section"
import { TrustBarSection } from "@/components/sections/home/trust-bar-section"
import { PainPointsSection } from "@/components/sections/home/pain-points-section"
import { ServiceLevelsSection } from "@/components/sections/solutions/service-levels-section"
import { IndustriesSection } from "@/components/sections/industries/industries-section"
import { ProcessSection } from "@/components/sections/home/process-section"
import { UseCasesSection } from "@/components/sections/home/use-cases-section"
import { DifferentiatorsSection } from "@/components/sections/home/differentiators-section"
import { TestimonialsSection } from "@/components/sections/shared/testimonials-section"
import { LeadMagnetSection } from "@/components/sections/home/lead-magnet-section"
import { FAQExplorer } from "@/components/sections/resources/faq-explorer"
import { FinalCTASection } from "@/components/sections/shared/final-cta-section"
import { getFAQs } from "@/lib/cms/resources"
import { getServices } from "@/lib/cms/services"

// Server component — the page ships no client JS of its own.
//
// Section order follows a lead-generation funnel rather than a feature tour:
//
//   Hero            what we do, and the primary ask
//   Trust bar       proof, before any further asking
//   Pain points     the visitor recognises their own situation
//   Services        what we'd actually do about it
//   Industries      proof we understand their context specifically
//   Process         what working with us looks like — removes risk
//   Use cases       other people asking their question
//   Why us          differentiation, once they're considering
//   Testimonials    social proof at the point of decision
//   Health check    the conversion offer every other CTA points to
//   FAQ             objection handling, last
//   Final CTA       the close
//
// Every section ends in a CTA. The team section moved off the homepage —
// it lives on /about, and it was sitting between the FAQ and the close where
// it interrupted the conversion path.
export default async function HomePage() {
  // Independent of each other, so they resolve together rather than in series.
  // Both are "use cache"-wrapped, so this stays a static render.
  const [faqs, services] = await Promise.all([getFAQs(), getServices()])
  const levels = services.filter((service) => service.kind === "level")

  return (
    <div className="bg-[#0A0E17] text-[#F3F5FA] min-h-screen font-sans antialiased">
      <IntroAnimation />
      <MobileNav />

      <HeroSection />
      <TrustBarSection />
      <PainPointsSection />
      <ServiceLevelsSection levels={levels} />
      <IndustriesSection />
      <ProcessSection />
      <UseCasesSection />
      <DifferentiatorsSection />
      <TestimonialsSection />
      <LeadMagnetSection />
      <FAQExplorer faqs={faqs} showFilters={false} />
      <FinalCTASection />

      <FloatingActions />
      <SiteFooter />
    </div>
  )
}
