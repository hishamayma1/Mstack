import { SectionHeader } from "@/components/ui/section-header"
import type { ServiceFAQ } from "@/lib/cms/services"

// Native <details>, so the accordion works with zero JavaScript and stays
// keyboard- and screen-reader-accessible without any ARIA of our own. The
// content is also in the DOM unexpanded, which matters for search engines
// picking up FAQ answers.
export function ServiceFAQSection({ faqs }: { faqs: ServiceFAQ[] }) {
  if (faqs.length === 0) return null

  return (
    <section id="faq" className="py-28 px-6 md:px-12 lg:px-20 border-t border-border">
      <div className="max-w-3xl mx-auto">
        <SectionHeader
          eyebrow="QUESTIONS"
          title={"Before You\nAsk Us."}
          intro="The questions that come up on almost every first call, answered here so you don't have to book one to get them."
        />

        <div className="flex flex-col gap-2">
          {faqs.map((faq) => (
            <details
              key={faq.question}
              className="group rounded-xl border border-border bg-card transition-colors open:border-svc/35 open:bg-svc/[0.04]"
            >
              <summary className="flex items-start justify-between gap-6 p-6 cursor-pointer list-none [&::-webkit-details-marker]:hidden">
                <span className="text-base font-light text-foreground">{faq.question}</span>
                <span
                  aria-hidden="true"
                  className="mt-1 shrink-0 text-muted-foreground transition-transform duration-300 group-open:rotate-45 group-open:text-svc-ink"
                >
                  +
                </span>
              </summary>
              <p className="px-6 pb-6 text-sm text-muted-foreground leading-relaxed">{faq.answer}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  )
}
