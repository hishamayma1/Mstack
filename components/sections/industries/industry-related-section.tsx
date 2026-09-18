import Link from "next/link"
import { Tag } from "@/components/ui/tag"

// Cross-links to the other sectors. Keeps a visitor who landed on the wrong
// page (or works across sectors) one click from the right one, and gives every
// industry page internal links from all the others.
//
// Takes the minimum shape it renders rather than a full IndustryCard, so the
// page can fetch title+slug instead of whole documents (getIndustryLinks).
export function IndustryRelatedSection({
  industries,
}: {
  industries: { id: string; title: string; slug: string }[]
}) {
  if (industries.length === 0) return null

  return (
    <section className="py-24 px-6 md:px-12 lg:px-20 border-t border-border">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div className="max-w-xl">
            <Tag>OTHER SECTORS</Tag>
            <h2 className="mt-5 text-2xl md:text-3xl font-light tracking-tight leading-[1.15]">
              We work across industries.
            </h2>
          </div>
          <Link
            href="/industries"
            className="text-xs text-blue-600 dark:text-blue-300/80 hover:text-blue-500 dark:hover:text-blue-300 transition-colors tracking-wide shrink-0"
          >
            View all industries →
          </Link>
        </div>

        <div className="flex flex-wrap gap-2">
          {industries.map((ind, i) => (
            <Link
              key={ind.id}
              href={`/industries/${ind.slug}`}
              className={`px-4 py-2.5 rounded-xl border border-border bg-card text-sm text-muted-foreground hover:text-foreground transition-all ${
                i % 2 === 0 ? "hover:border-blue-500/30 hover:bg-accent/60" : "hover:border-teal/30 hover:bg-teal/10"
              }`}
            >
              {ind.title}
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
