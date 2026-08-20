import Link from "next/link"
import { Section, Eyebrow, SectionIntro, Chevron } from "@/components/ui/section"
import { AppLogo } from "@/components/ui/app-logo"
import { FAQAccordion } from "@/components/sections/home/faq-accordion"
import { USE_CASES } from "@/lib/content/site"
import { USE_CASE_LOGOS } from "@/lib/content/app-logos"
import type { FAQCard } from "@/lib/cms/resources"

// Everything the visitor still wants to ask, in one band.
//
// These used to be two full sections a third of a page apart — "How Can We
// Help You?" (six persona quotes as bento cards) and "Frequently Asked
// Questions" (the /resources accordion, with its own centred heading, its own
// animated icon and its own CTA bar). They are the same moment in the funnel:
// objection handling, right before the close. Merging them removes a section,
// a heading and a CTA, and puts the real requests next to the answers.
//
// Server component; only the accordion crosses the client boundary.
export function QuestionsSection({ faqs }: { faqs: FAQCard[] }) {
  return (
    <Section id="faq" tone="raised" size="lg">
      <SectionIntro
        eyebrow="Questions"
        title={"What people ask us\nbefore they start."}
        lead="Real requests, in the words they arrived in — followed by the questions we answer most weeks."
      />

      {/* The requests. Quiet by design: they are context for the answers under
          them, not six things to choose between. */}
      <ul className="mt-12 grid gap-px overflow-hidden rounded-2xl border border-white/[0.07] bg-white/[0.07] sm:grid-cols-2 lg:grid-cols-3">
        {USE_CASES.map((u) => (
          <li key={u.name} className="flex flex-col gap-4 bg-[#0C111C] p-6">
            <p className="flex-1 text-[0.9375rem] leading-[1.75] text-white/55">&ldquo;{u.quote}&rdquo;</p>
            <div className="flex items-center gap-2.5 border-t border-white/[0.06] pt-4">
              {USE_CASE_LOGOS[u.topic] ? <AppLogo slug={USE_CASE_LOGOS[u.topic]} size={20} /> : null}
              <span className="text-[0.8125rem] font-light text-white/75">{u.name}</span>
              <span className="ml-auto text-[10px] uppercase tracking-[0.15em] text-white/35">{u.topic}</span>
            </div>
          </li>
        ))}
      </ul>

      {faqs.length > 0 ? (
        <div className="mt-20">
          <Eyebrow>Frequently asked</Eyebrow>
          <div className="mt-6">
            <FAQAccordion faqs={faqs} />
          </div>

          <Link
            href="/contact"
            className="group mt-10 inline-flex items-center gap-2 text-[0.9375rem] tracking-wide text-blue-300/85 transition-colors hover:text-blue-300"
          >
            Still have a question? Ask it on a free 15-minute call
            <Chevron className="transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>
      ) : null}
    </Section>
  )
}
