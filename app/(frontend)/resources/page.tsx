import type { Metadata } from "next"
import { PageShell } from "@/components/layout/page-shell"
import { PageHero } from "@/components/sections/shared/page-hero"
import { ResourcesExplorer } from "@/components/sections/resources/resources-explorer"
import { FinalCTASection } from "@/components/sections/shared/final-cta-section"
import { getBlogPosts, getGuides, getTools, getFAQs } from "@/lib/cms/resources"

export const metadata: Metadata = {
  title: "Resources | MStack360 — Blog, Guides, FAQ & Tools",
  description: "Microsoft 365 blog articles, downloadable guides, free tools, and answers to the questions we hear most often.",
}

// Server component: all four content types are read once via Payload's
// local API (see lib/payload-resources.ts), in parallel. ResourcesExplorer
// is a tab picker — only the selected type mounts (and fades in) at a
// time, with search/filter running client-side against the data it was
// handed, so switching tabs is instant with no extra fetch.
export default async function ResourcesPage() {
  const [blogPosts, guides, tools, faqs] = await Promise.all([
    getBlogPosts(),
    getGuides(),
    getTools(),
    getFAQs(),
  ])

  return (
    <PageShell>
      <PageHero
        eyebrow="RESOURCES"
        title={"Learn Before\nYou Migrate."}
        subtitle="Articles, guides, and free tools to help you get more out of Microsoft 365 — plus answers to the questions we hear most."
      />
      <ResourcesExplorer blogPosts={blogPosts} guides={guides} tools={tools} faqs={faqs} />
      <FinalCTASection />
    </PageShell>
  )
}
