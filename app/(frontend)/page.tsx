import { IntroAnimation } from "@/components/ui/intro-animation"
import { MobileNav } from "@/components/layout/mobile-nav"
import { FloatingActions } from "@/components/layout/floating-actions"
import { SiteFooter } from "@/components/layout/site-footer"
import { HeroSection } from "@/components/sections/home/hero-section"
import { TrustBarSection } from "@/components/sections/home/trust-bar-section"
import { ChallengesSection } from "@/components/sections/home/challenges-section"
import { HomeServicesSection } from "@/components/sections/home/services-section"
import { ProofSection } from "@/components/sections/home/proof-section"
import { HomeIndustriesSection } from "@/components/sections/home/industries-section"
import { ProcessSection } from "@/components/sections/home/process-section"
import { DifferentiatorsSection } from "@/components/sections/home/differentiators-section"
import { QuestionsSection } from "@/components/sections/home/questions-section"
import { LeadMagnetSection } from "@/components/sections/home/lead-magnet-section"
import { FinalCTASection } from "@/components/sections/shared/final-cta-section"
import { getFAQs } from "@/lib/cms/resources"
import { getServices } from "@/lib/cms/services"

// Server component — the page ships no client JS of its own.
//
// ── Structure ───────────────────────────────────────────────────────────────
//
// Section order follows a lead-generation funnel rather than a feature tour,
// and the *surface* alternates so consecutive ideas never blur together. Tone
// is the separator; hairline borders are not asked to do that job any more.
//
//   Hero          base     what we do, and the primary ask
//   Trust bar     base     the platform, as marks — one slim strip
//   Challenges    base     the visitor recognises their own situation
//   Services      raised   what we'd do about it, as an ordered progression
//   Proof         accent   the numbers and the voices, together, held still
//   Industries    base     proof we understand their context specifically
//   Process       raised   what working with us looks like — removes risk
//   Why us        base     differentiation, once they're considering
//   Questions     raised   real requests + FAQ — objection handling, merged
//   Health check  accent   the conversion offer every other link points to
//   Final CTA     —        the close, on its own backdrop
//
// ── What changed, and why ───────────────────────────────────────────────────
//
// Twelve sections became ten, and eight calls to action became two. Every
// section used to close with a SectionCTA bar, which meant the visitor had
// declined the same offer six times before reaching the one that mattered.
// The bars are gone; sections that need a next step end in a single quiet
// link, and all of them point at #health-check.
//
// Removed: the testimonial marquee (folded into the proof band — it still runs
// on /about and /case-studies, where a long scrolling wall is the point), the
// standalone use-cases grid (folded into the questions band), the duplicated
// stat strip under the hero, and four dashed `src: null` image placeholders
// that were advertising missing artwork on a live page.
//
// Card walls became lists wherever the items are a sequence or a menu rather
// than a set of peers: five service levels and six problems read far better
// divided by hairlines than boxed on the same dark surface.
export default async function HomePage() {
  // Independent of each other, so they resolve together rather than in series.
  // Both are "use cache"-wrapped, so this stays a static render.
  const [faqs, services] = await Promise.all([getFAQs(), getServices()])
  const levels = services.filter((service) => service.kind === "level")

  return (
    <div className="min-h-screen bg-[#0A0E17] font-sans antialiased text-[#F3F5FA]">
      <IntroAnimation />
      <MobileNav />

      <HeroSection />
      <TrustBarSection />
      <ChallengesSection />
      <HomeServicesSection levels={levels} />
      <ProofSection />
      <HomeIndustriesSection />
      <ProcessSection />
      <DifferentiatorsSection />
      <QuestionsSection faqs={faqs} />
      <LeadMagnetSection />
      <FinalCTASection />

      <FloatingActions />
      <SiteFooter />
    </div>
  )
}
