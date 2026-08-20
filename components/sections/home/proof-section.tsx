import Link from "next/link"
import { Section, Eyebrow, Chevron } from "@/components/ui/section"
import { Stat } from "@/components/ui/stat"
import { RevealText } from "@/components/ui/reveal-text"
import { INDUSTRIES, TESTIMONIALS } from "@/lib/content/site"

const FIGURES = [
  { value: "500+", label: "Businesses supported" },
  { value: "★★★★★", label: "Google review rating" },
  { value: "10+", label: "Years on Microsoft 365" },
  { value: String(INDUSTRIES.length), label: "Industries served" },
]

// The page's one proof moment.
//
// It replaces two things that were doing the same job badly and far apart: a
// three-figure strip under the hero (which repeated figures the hero had just
// printed) and a full-width auto-scrolling testimonial marquee, which moved
// the quotes out from under the reader before they could finish one.
//
// Static quotes, three of them, chosen and stopped. Every reference site puts
// its numbers and its voices together in a single band like this, on a surface
// that is visibly different from the sections either side — so it reads as
// evidence rather than as more page.
//
// TestimonialsSection (the marquee) is untouched and still runs on /about and
// /case-studies, where a long scrolling wall of names is the point.
export function ProofSection() {
  return (
    <Section id="proof" tone="accent" size="lg">
      <div className="grid gap-10 lg:grid-cols-12 lg:gap-16">
        <div className="lg:col-span-5">
          <Eyebrow>The record</Eyebrow>
          <RevealText
            stagger={2}
            className="mt-4 text-[2rem] font-light leading-[1.12] tracking-tight text-[#F3F5FA] md:text-[2.5rem]"
          >
            {"Ten years, one\nplatform, 500+\nbusinesses."}
          </RevealText>
          <Link
            href="/case-studies"
            className="group mt-7 inline-flex items-center gap-2 text-[0.875rem] tracking-wide text-blue-300/85 transition-colors hover:text-blue-300"
          >
            Read the case studies
            <Chevron className="transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>

        <dl className="grid grid-cols-2 gap-x-6 gap-y-10 lg:col-span-7 lg:grid-cols-4 lg:gap-x-4">
          {FIGURES.map((f) => (
            <Stat key={f.label} value={f.value} label={f.label} />
          ))}
        </dl>
      </div>

      {/* Three quotes, held still. Divided rather than boxed — the band's own
          surface already separates them from the page. */}
      <ul className="mt-16 grid gap-px overflow-hidden rounded-2xl border border-white/[0.07] bg-white/[0.07] md:grid-cols-3">
        {TESTIMONIALS.slice(0, 3).map((t) => (
          <li key={t.name} className="flex flex-col gap-4 bg-[#0B1220] p-7">
            <span className="text-[11px] tracking-[0.25em] text-blue-400/80" aria-label="5 out of 5">
              ★★★★★
            </span>
            <p className="flex-1 text-[0.9375rem] leading-[1.75] text-white/60">
              <span aria-hidden="true" className="mr-1 text-white/20">
                &ldquo;
              </span>
              {t.quote}
              <span aria-hidden="true" className="ml-0.5 text-white/20">
                &rdquo;
              </span>
            </p>
            <span className="text-[0.8125rem] font-light text-white/80">{t.name}</span>
          </li>
        ))}
      </ul>
    </Section>
  )
}
