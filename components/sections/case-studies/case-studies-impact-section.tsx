import Link from "next/link"
import type { CaseStudyCard } from "@/lib/cms/case-studies"

// Aggregate band under the /case-studies hero. Everything here is derived from
// the studies actually published — no hardcoded numbers to go stale when
// someone adds or unpublishes one.
export function CaseStudiesImpactSection({ caseStudies }: { caseStudies: CaseStudyCard[] }) {
  if (caseStudies.length === 0) return null

  const sectors = Array.from(new Set(caseStudies.map((c) => c.industry))).sort()

  return (
    <section className="border-t border-border">
      <div className="max-w-6xl mx-auto px-6 md:px-12 lg:px-20 py-10 flex flex-col lg:flex-row lg:items-center gap-8 lg:gap-14">
        <dl className="flex items-center gap-10 shrink-0">
          <div>
            <dd className="text-2xl font-light text-blue-600 dark:text-blue-300/90 font-ibm-plex leading-none">
              {caseStudies.length}
            </dd>
            <dt className="mt-1.5 text-[11px] text-muted-foreground tracking-wide">
              Published stories
            </dt>
          </div>
          <div>
            <dd className="text-2xl font-light text-teal font-ibm-plex leading-none">
              {sectors.length}
            </dd>
            <dt className="mt-1.5 text-[11px] text-muted-foreground tracking-wide">Sectors covered</dt>
          </div>
        </dl>

        <p className="text-sm text-muted-foreground leading-relaxed lg:flex-1">
          Every study below is a real Microsoft 365 environment we migrated, secured, or automated —
          with the number the client measured afterwards.{" "}
          <Link
            href="/contact"
            className="text-blue-600 dark:text-blue-300/80 hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
          >
            Talk to us about yours →
          </Link>
        </p>
      </div>

      <div className="border-t border-border">
        <ul className="max-w-6xl mx-auto px-6 md:px-12 lg:px-20 py-4 flex flex-wrap gap-x-6 gap-y-2">
          {sectors.map((s) => (
            <li key={s} className="text-xs text-muted-foreground tracking-widest">
              {s}
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
