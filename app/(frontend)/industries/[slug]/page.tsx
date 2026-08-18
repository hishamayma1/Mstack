import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { PageShell } from "@/components/layout/page-shell"
import { IndustryHero } from "@/components/sections/industries/industry-hero"
import { IndustryPageNav } from "@/components/sections/industries/industry-page-nav"
import { IndustryChallengesSection } from "@/components/sections/industries/industry-challenges-section"
import { IndustrySolutionsSection } from "@/components/sections/industries/industry-solutions-section"
import { IndustryToolkitSection } from "@/components/sections/industries/industry-toolkit-section"
import { IndustryWalkthroughSection } from "@/components/sections/industries/industry-walkthrough-section"
import { IndustryOutcomesSection } from "@/components/sections/industries/industry-outcomes-section"
import { IndustryCaseStudiesSection } from "@/components/sections/industries/industry-case-studies-section"
import { IndustryRelatedSection } from "@/components/sections/industries/industry-related-section"
import { IndustryCTASection } from "@/components/sections/industries/industry-cta-section"
import { getIndustryBySlug, getIndustryLinks, getIndustrySlugs } from "@/lib/cms/industries"
import { getCaseStudiesByIndustry } from "@/lib/cms/case-studies"

// Pre-renders one static route per published industry at build time —
// new industries added in /admin need a rebuild/redeploy to appear here,
// same tradeoff as every other statically generated page on this site.
export async function generateStaticParams() {
  const slugs = await getIndustrySlugs()
  return slugs.map((slug) => ({ slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const industry = await getIndustryBySlug(slug)

  // An unknown slug renders not-found.tsx, but metadata is resolved from this
  // route, not from the not-found boundary — returning {} here left the 404
  // showing the site-wide default title. Match the 404 page instead.
  if (!industry) {
    return {
      title: "Page Not Found | MStack360",
      description: "That industry page doesn't exist. Browse all the sectors we work in.",
      robots: { index: false, follow: true },
    }
  }

  return {
    title: `${industry.title} | MStack360 — Microsoft 365 for ${industry.title}`,
    description: industry.summary,
  }
}

export default async function IndustryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const industry = await getIndustryBySlug(slug)
  if (!industry) notFound()

  // Both queries are independent of each other, so they run together rather
  // than one after the other. Case studies are filtered by industry in the
  // database, and the sector chips pull title+slug only.
  const [caseStudies, allIndustries] = await Promise.all([
    getCaseStudiesByIndustry(industry.title),
    getIndustryLinks(),
  ])
  const otherIndustries = allIndustries.filter((i) => i.slug !== industry.slug)

  // Built from what this industry actually has, so the sub-nav never points at
  // a section that rendered nothing.
  const navItems = [
    industry.challenges.length > 0 && { id: "challenges", label: "Challenges" },
    industry.solutions.length > 0 && { id: "solutions", label: "What We Solve" },
    industry.tools.length > 0 && { id: "toolkit", label: "Your Toolkit" },
    { id: "how-it-works", label: "How It Works" },
    industry.outcomes.length > 0 && { id: "outcomes", label: "Outcomes" },
    caseStudies.length > 0 && { id: "case-studies", label: "Case Studies" },
  ].filter(Boolean) as { id: string; label: string }[]

  return (
    <PageShell>
      <IndustryHero
        industryTitle={industry.title}
        slug={industry.slug}
        headline={industry.headline}
        valueProp={industry.valueProp}
        stats={industry.stats}
      />

      <IndustryPageNav items={navItems} />

      <IndustryChallengesSection industryTitle={industry.title} challenges={industry.challenges} />
      <IndustrySolutionsSection industryTitle={industry.title} solutions={industry.solutions} />
      <IndustryToolkitSection industryTitle={industry.title} tools={industry.tools} />
      <IndustryWalkthroughSection industryTitle={industry.title} />
      <IndustryOutcomesSection outcomes={industry.outcomes} />
      <IndustryCaseStudiesSection caseStudies={caseStudies} />
      <IndustryRelatedSection industries={otherIndustries} />
      <IndustryCTASection headline={industry.ctaHeadline} subtext={industry.ctaSubtext} />
    </PageShell>
  )
}
