import Link from "next/link"
import { Tag } from "@/components/ui/tag"
import { SectionHeader } from "@/components/ui/section-header"
import { SectionCTA } from "@/components/ui/section-cta"
import type { CaseStudyCard } from "@/lib/cms/case-studies"

// Only renders when there's at least one case study whose `industry` field
// (from the case-studies collection) matches this industry's title — the
// two collections share the same taxonomy on purpose (see SITEMAP_INDUSTRY_TITLES).
export function IndustryCaseStudiesSection({ caseStudies }: { caseStudies: CaseStudyCard[] }) {
  if (caseStudies.length === 0) return null

  return (
    <section id="case-studies" className="py-28 px-6 md:px-12 lg:px-20 border-t border-white/[0.08]">
      <div className="max-w-6xl mx-auto">
        <SectionHeader
          eyebrow="PROVEN RESULTS"
          title={"Case Studies in\nThis Industry."}
          intro="Real deployments in your sector, with the numbers the client actually measured afterwards."
        />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
          {caseStudies.map((c) => (
            <Link key={c.id} href={`/case-studies/${c.slug}`} className="block group">
              <article className="h-full rounded-2xl border border-white/[0.08] bg-[#10141f] p-8 flex flex-col transition-all duration-300 group-hover:border-blue-500/30 group-hover:bg-[#131a29]">
                <div className="flex items-start justify-between gap-4 mb-6">
                  <h3 className="text-lg font-light">{c.client}</h3>
                  <Tag>{c.industry}</Tag>
                </div>
                <p className="text-sm text-white/55 leading-relaxed mb-6">{c.result}</p>
                <div className="mt-auto pt-5 border-t border-white/[0.08] flex items-end justify-between gap-4">
                  <span className="flex items-baseline gap-2">
                    <span className="text-2xl font-light text-blue-400 font-ibm-plex">{c.stat.value}</span>
                    <span className="text-xs text-white/45 tracking-wide">{c.stat.label}</span>
                  </span>
                  <span className="shrink-0 text-xs text-blue-300/70 group-hover:text-blue-300 transition-colors tracking-wide">
                    Read story →
                  </span>
                </div>
              </article>
            </Link>
          ))}
        </div>

        <SectionCTA
          text="Want to know what a result like this would look like for your business? We'll walk you through the closest comparable project we've delivered."
          primaryLabel="Book a Free Consultation"
          secondaryLabel="View All Case Studies"
          secondaryHref="/case-studies"
        />
      </div>
    </section>
  )
}
