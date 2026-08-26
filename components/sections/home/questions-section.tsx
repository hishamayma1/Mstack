import Link from "next/link"
import { Section, Eyebrow, SectionIntro, Chevron } from "@/components/ui/section"
import { InfiniteMovingCards } from "@/components/ui/infinite-moving-cards"
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

      {/* The requests, as a strip that drifts past rather than a grid that
          sits still. They are context for the answers under them, not six
          things to choose between, so a row you can glance at and move on
          from suits them better than six cells asking to be compared.

          The speed is the whole argument for doing it this way at all. At the
          component's own default — one pass in 20s — a quote leaves the
          screen before it can be read, which is exactly why the testimonial
          marquee that used to run further up this page was taken out. 110s is
          slow enough to finish a card at a glance, it pauses under the
          pointer, and it stops dead for anyone who has asked for reduced
          motion. */}
      <div className="mt-12">
        <InfiniteMovingCards
          ariaLabel="What people ask us for"
          speed={110}
          items={USE_CASES.map((u) => ({
            id: u.name,
            quote: u.quote,
            name: u.name,
            meta: u.topic,
            logo: USE_CASE_LOGOS[u.topic],
          }))}
        />
      </div>

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
