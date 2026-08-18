import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { PageShell } from "@/components/layout/page-shell"
import { ServiceHero } from "@/components/sections/services/service-hero"
import { ServiceIncludesSection } from "@/components/sections/services/service-includes-section"
import { ServiceOutcomesSection } from "@/components/sections/services/service-outcomes-section"
import { ServiceConfigurator } from "@/components/sections/services/service-configurator"
import { ServiceBandsSection } from "@/components/sections/services/service-bands-section"
import { ServiceFAQSection } from "@/components/sections/services/service-faq-section"
import { ServiceRelatedSection } from "@/components/sections/services/service-related-section"
import { ServiceCTASection } from "@/components/sections/services/service-cta-section"
import { getServiceBySlug, getServiceLinks, getServiceSlugs } from "@/lib/cms/services"

// Pre-renders one static route per published service at build time. New
// services added in /admin need a rebuild to appear, the same tradeoff every
// other statically generated page on this site makes.
export async function generateStaticParams() {
  const slugs = await getServiceSlugs()
  return slugs.map((slug) => ({ slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const service = await getServiceBySlug(slug)

  // An unknown slug renders not-found.tsx, but metadata resolves from this
  // route rather than the not-found boundary — so it has to be set here or
  // the 404 inherits the site-wide default title.
  if (!service) {
    return {
      title: "Page Not Found | MStack360",
      description: "That service page doesn't exist. Browse everything we offer.",
      robots: { index: false, follow: true },
    }
  }

  return {
    title: `${service.title} | MStack360 — ${service.tagline || "Microsoft 365 Services"}`,
    description: service.summary,
  }
}

export default async function ServicePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const service = await getServiceBySlug(slug)
  if (!service) notFound()

  const allServices = await getServiceLinks()
  const otherServices = allServices.filter((item) => item.slug !== service.slug)

  return (
    <PageShell>
      <ServiceHero
        title={service.title}
        tagline={service.tagline}
        headline={service.headline}
        valueProp={service.valueProp}
        stats={service.stats}
        fromPricePerSeat={service.fromPricePerSeat}
        currency={service.currency}
        kind={service.kind}
      />

      <ServiceIncludesSection serviceTitle={service.title} includes={service.includes} />
      <ServiceOutcomesSection outcomes={service.outcomes} />

      {/* The only client boundary on the page. Everything above and below is
          static HTML, so the JS cost is scoped to the part that needs it. */}
      <ServiceConfigurator
        slug={service.slug}
        serviceTitle={service.title}
        pricing={service.pricing}
      />

      <ServiceBandsSection pricing={service.pricing} />
      <ServiceFAQSection faqs={service.faqs} />
      <ServiceRelatedSection services={otherServices} />
      <ServiceCTASection headline={service.ctaHeadline} subtext={service.ctaSubtext} />
    </PageShell>
  )
}
