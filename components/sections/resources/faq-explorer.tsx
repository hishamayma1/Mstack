"use client"

import { useDeferredValue, useMemo } from "react"
import { PixelIcon } from "@/components/ui/pixel-icon"
import { ExplorerFilterChips, ExplorerSearch } from "@/components/ui/explorer-controls"
import { useExplorerFilter, useExplorerQuery, useOpenFAQ, useUIActions } from "@/lib/store"
import { RevealText } from "@/components/ui/reveal-text"
import { Tag } from "@/components/ui/tag"
import { BentoCard } from "@/components/ui/bento-card"
import { SectionCTA } from "@/components/ui/section-cta"
import type { FAQCard } from "@/lib/cms/resources"

const ALL = "All"

function FAQItem({
  item,
  isOpen,
  onToggle,
  delay,
  tone = "blue",
}: {
  item: FAQCard
  isOpen: boolean
  onToggle: () => void
  delay: number
  /** Alternated across the list so the open panels don't all read identically. */
  tone?: "blue" | "teal"
}) {
  return (
    <BentoCard className="overflow-hidden" delay={delay}>
      <button onClick={onToggle} className="w-full text-left p-6 flex items-center justify-between gap-4">
        <span className="text-base font-light text-foreground">{item.question}</span>
        <span
          className="shrink-0 w-6 h-6 rounded-full border border-border flex items-center justify-center text-muted-foreground transition-transform duration-300"
          style={{ transform: isOpen ? "rotate(45deg)" : "rotate(0deg)" }}
        >
          +
        </span>
      </button>
      <div className="overflow-hidden transition-all duration-300 ease-in-out" style={{ maxHeight: isOpen ? "320px" : "0px" }}>
        <div className="px-6 pb-6">
          <p className={`text-sm mb-4 ${tone === "blue" ? "text-blue-600 dark:text-blue-300/90" : "text-teal"}`}>
            {item.answer}
          </p>
          <ul className="space-y-2.5">
            {item.points.map((p) => (
              <li key={p} className="flex gap-3 text-sm text-muted-foreground leading-relaxed">
                <div
                  className={`w-1 h-1 rounded-full shrink-0 mt-2 ${tone === "blue" ? "bg-blue-400/50" : "bg-teal/50"}`}
                />
                {p}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </BentoCard>
  )
}

// Powers the FAQ accordion on both the homepage (showFilters=false, just
// the list) and /resources (showFilters=true, adds search + category
// chips) — one component instead of duplicating the accordion markup.
//
// `standalone` controls the outer wrapper: true (default) renders its own
// full-bleed <section> with padding/border, for use as a top-level page
// section (homepage). false renders a bare <div>, for nesting inside a
// shared section — e.g. the tab-selected layout on /resources, which
// provides its own section/padding around whichever tab is active.
export function FAQExplorer({
  faqs,
  showFilters = true,
  standalone = true,
  // Scopes this instance's store state. The accordion renders on both the
  // homepage and /resources, and the two should not share an open item or a
  // search term — they're showing the list in different contexts.
  scope = "faq",
}: {
  faqs: FAQCard[]
  showFilters?: boolean
  standalone?: boolean
  scope?: string
}) {
  const openFAQ = useOpenFAQ(scope, faqs[0]?.id ?? null)
  const query = useExplorerQuery(scope)
  const category = useExplorerFilter(scope, ALL)
  const { setOpenFAQ } = useUIActions()

  const deferredQuery = useDeferredValue(query)

  const indexed = useMemo(
    () => faqs.map((f) => ({ faq: f, haystack: `${f.question} ${f.answer} ${f.points.join(" ")}`.toLowerCase() })),
    [faqs]
  )

  const categories = useMemo(() => [ALL, ...Array.from(new Set(faqs.map((f) => f.category))).sort()], [faqs])

  const filtered = useMemo(() => {
    const q = deferredQuery.trim().toLowerCase()
    return indexed
      .filter(({ faq }) => category === ALL || faq.category === category)
      .filter(({ haystack }) => q === "" || haystack.includes(q))
      .map(({ faq }) => faq)
  }, [indexed, deferredQuery, category])

  if (faqs.length === 0) return null

  const content = (
    <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12 flex flex-col items-center">
          <PixelIcon type="pricing" size={40} />
          <div className="mt-4"><Tag>GOT QUESTIONS</Tag></div>
          <RevealText className="mt-5 text-4xl md:text-5xl font-light tracking-tight leading-[1.05]">
            {"Frequently Asked\nQuestions."}
          </RevealText>
        </div>

        {showFilters ? (
          <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-8">
            <ExplorerSearch
              explorerKey={scope}
              placeholder="Search questions..."
              className="max-w-xs w-full mx-auto sm:mx-0"
            />
            <div className="flex justify-center sm:justify-start">
              <ExplorerFilterChips
                explorerKey={scope}
                options={categories}
                fallback={ALL}
                label="Filter FAQs by category"
              />
            </div>
          </div>
        ) : null}

        {filtered.length === 0 ? (
          <div className="rounded-2xl border border-border p-8 text-center">
            <p className="text-sm text-muted-foreground">No questions match — try a different search or category.</p>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {filtered.map((item, i) => (
              <FAQItem
                key={item.id}
                item={item}
                isOpen={openFAQ === item.id}
                onToggle={() => setOpenFAQ(scope, openFAQ === item.id ? null : item.id)}
                delay={i * 40}
                tone={i % 2 === 0 ? "blue" : "teal"}
              />
            ))}
          </div>
        )}

        <SectionCTA
          text="Still have a question? Ask it on a free 15-minute call — no pitch, just an answer."
          primaryLabel="Ask Us Directly"
        />
    </div>
  )

  if (!standalone) return <div id="faq">{content}</div>

  return (
    <section id="faq" className="py-32 px-6 md:px-12 lg:px-20 border-t border-border scroll-mt-24">
      {content}
    </section>
  )
}
