import Link from "next/link"
import { Tag } from "@/components/ui/tag"
import { MediaFrame } from "@/components/ui/media-frame"
import type { CaseStudyCard } from "@/lib/cms/case-studies"

// Other studies at the bottom of a detail page — same sector first, topped up
// with the most recent so the section is never thin (see getRelatedCaseStudies).
export function CaseStudyRelatedSection({ studies }: { studies: CaseStudyCard[] }) {
  if (studies.length === 0) return null

  return (
    <section className="py-24 px-6 md:px-12 lg:px-20 border-t border-white/[0.08]">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div className="max-w-xl">
            <Tag>MORE STORIES</Tag>
            <h2 className="mt-5 text-2xl md:text-3xl font-light tracking-tight leading-[1.15]">
              Other businesses we&apos;ve done this for.
            </h2>
          </div>
          <Link
            href="/case-studies"
            className="text-xs text-blue-300/80 hover:text-blue-300 transition-colors tracking-wide shrink-0"
          >
            View all case studies →
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {studies.map((s) => (
            <Link key={s.id} href={`/case-studies/${s.slug}`} className="block group">
              <article className="h-full rounded-2xl border border-white/[0.08] bg-[#10141f] p-7 flex flex-col transition-all duration-300 group-hover:border-blue-500/30 group-hover:bg-[#131a29]">
                <MediaFrame
                  src={s.heroImage?.url}
                  alt={s.heroImage?.alt ?? ""}
                  label={s.client}
                  aspect="16/9"
                  className="mb-5"
                  sizes="(max-width: 768px) 100vw, 30vw"
                />
                <span className="text-[11px] text-white/35 tracking-wide mb-4">{s.industry}</span>
                <h3 className="text-base font-light mb-3 group-hover:text-blue-300/90 transition-colors">
                  {s.client}
                </h3>
                <p className="text-sm text-white/50 leading-relaxed mb-6 line-clamp-3">
                  {s.challenge}
                </p>
                <div className="mt-auto pt-4 border-t border-white/[0.08] flex items-baseline gap-2">
                  <span className="text-xl font-light text-blue-400 font-ibm-plex">
                    {s.stat.value}
                  </span>
                  <span className="text-[11px] text-white/45 tracking-wide leading-snug">
                    {s.stat.label}
                  </span>
                </div>
              </article>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
