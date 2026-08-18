import type { CaseStudyDetail } from "@/lib/cms/case-studies"

// Client pull quote. Hidden entirely when there's no quote text — a testimonial
// section with no testimonial is worse than no section.
export function CaseStudyQuoteSection({ study }: { study: CaseStudyDetail }) {
  if (!study.quote) return null
  const { text, author, role } = study.quote

  return (
    <section className="py-24 px-6 md:px-12 lg:px-20 border-t border-white/[0.08]">
      <figure className="max-w-3xl mx-auto text-center">
        <span aria-hidden="true" className="block text-5xl text-blue-400/25 leading-none mb-6">
          &ldquo;
        </span>
        <blockquote className="text-2xl md:text-3xl font-light leading-[1.35] tracking-tight text-white/85">
          {text}
        </blockquote>
        {author ? (
          <figcaption className="mt-8 text-sm text-white/45">
            <span className="text-white/70">{author}</span>
            {role ? <span> · {role}</span> : null}
            <span className="block mt-1 text-xs text-white/35">{study.client}</span>
          </figcaption>
        ) : null}
      </figure>
    </section>
  )
}
