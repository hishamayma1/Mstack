import type { Metadata } from "next"
import { PageShell } from "@/components/layout/page-shell"
import { PageHero } from "@/components/sections/shared/page-hero"
import { OurStorySection } from "@/components/sections/about/our-story-section"
import { TeamSection } from "@/components/sections/about/team-section"
import { PartnersSection } from "@/components/sections/about/partners-section"
import { CareersSection } from "@/components/sections/about/careers-section"
import { TestimonialsSection } from "@/components/sections/shared/testimonials-section"
import { FinalCTASection } from "@/components/sections/shared/final-cta-section"

export const metadata: Metadata = {
  title: "About | MStack360 — Our Story, Team & Partners",
  description: "MStack360 is a 100% Microsoft-native consultancy. Meet the team, see our Microsoft partner status and certifications, and read what our clients say.",
}

export default function AboutPage() {
  return (
    <PageShell>
      <PageHero
        eyebrow="ABOUT US"
        title={"A Decade of\nMicrosoft 365 Focus."}
        subtitle="We're a small, deeply specialised team that only works inside the Microsoft ecosystem — no third-party tools, no divided attention."
      />
      <OurStorySection />
      <TeamSection />
      <PartnersSection />
      <CareersSection />
      <TestimonialsSection />
      <FinalCTASection />
    </PageShell>
  )
}
