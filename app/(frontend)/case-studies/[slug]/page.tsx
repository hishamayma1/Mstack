import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { PageShell } from "@/components/layout/page-shell"
import { CaseStudyHero } from "@/components/sections/case-studies/case-study-hero"
import { CaseStudyFacts } from "@/components/sections/case-studies/case-study-facts"
import { CaseStudyChallenge } from "@/components/sections/case-studies/case-study-challenge"
import { CaseStudyApproach } from "@/components/sections/case-studies/case-study-approach"
import { CaseStudyGallery } from "@/components/sections/case-studies/case-study-gallery"
import { CaseStudyQuoteSection } from "@/components/sections/case-studies/case-study-quote"
import { CaseStudyRelatedSection } from "@/components/sections/case-studies/case-study-related-section"
import { IndustryCTASection } from "@/components/sections/industries/industry-cta-section"
import {
  getCaseStudyBySlug,
  getCaseStudySlugs,
  getRelatedCaseStudies,
} from "@/lib/cms/case-studies"

// One static route per published case study. New studies added in /admin
// render on demand via the fallback until the next build, same as industries.
export async function generateStaticParams() {
  const slugs = await getCaseStudySlugs()
  return slugs.map((slug) => ({ slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const study = await getCaseStudyBySlug(slug)

  // An unknown slug renders not-found.tsx, but metadata resolves from this
  // route — returning {} would leave the 404 showing the site-wide default.
  if (!study) {
    return {
      title: "Page Not Found | MStack360",
      description: "That case study doesn't exist. Browse all our client stories.",
      robots: { index: false, follow: true },
    }
  }

  return {
    title: `${study.client} | MStack360 Case Study`,
    description: study.summary,
    openGraph: {
      title: `${study.client} — ${study.industry}`,
      description: study.summary,
      type: "article",
    },
  }
}

export default async function CaseStudyPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const study = await getCaseStudyBySlug(slug)
  if (!study) notFound()

  const related = await getRelatedCaseStudies(study.slug, study.industry)

  return (
    <PageShell>
      <CaseStudyHero study={study} />
      <CaseStudyFacts study={study} />
      <CaseStudyChallenge study={study} />
      <CaseStudyApproach study={study} />
      <CaseStudyGallery study={study} />
      <CaseStudyQuoteSection study={study} />
      <CaseStudyRelatedSection studies={related} />
      <IndustryCTASection
        headline={"Want Results Like\nThis for Your Business?"}
        subtext={`Book a free 15-minute call. We'll tell you honestly how much of what we did for ${study.client} would apply to your setup.`}
      />
    </PageShell>
  )
}
