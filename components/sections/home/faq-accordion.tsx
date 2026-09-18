"use client"

import { useState } from "react"
import type { FAQCard } from "@/lib/cms/resources"

// The homepage FAQ list. Client only because one item is open at a time.
//
// /resources still renders FAQExplorer, which adds search, category chips and
// its own header — worth the weight on a page someone opened to look things
// up, and dead weight on a homepage list of six.
//
// Presented as hairline-divided rows rather than a stack of bordered cards:
// an accordion is a list, and boxing each row made six answers look like six
// separate offers.
export function FAQAccordion({ faqs }: { faqs: FAQCard[] }) {
  const [open, setOpen] = useState<string | null>(faqs[0]?.id ?? null)

  return (
    <div className="divide-y divide-border border-y border-border">
      {faqs.map((item, itemIndex) => {
        const isOpen = open === item.id
        return (
          <div key={item.id}>
            <h3>
              <button
                type="button"
                onClick={() => setOpen(isOpen ? null : item.id)}
                aria-expanded={isOpen}
                aria-controls={`faq-panel-${item.id}`}
                className="group flex w-full items-center justify-between gap-6 py-5 text-left"
              >
                <span
                  className={`text-[1.0625rem] font-light leading-snug transition-colors ${
                    isOpen ? "text-blue-600 dark:text-blue-200" : "text-foreground group-hover:text-foreground"
                  }`}
                >
                  {item.question}
                </span>
                <span
                  aria-hidden="true"
                  className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full border text-muted-foreground transition-all duration-300 ${
                    isOpen ? "rotate-45 border-blue-400/40 text-blue-600 dark:text-blue-300" : "border-border"
                  }`}
                >
                  +
                </span>
              </button>
            </h3>

            {/* 0fr → 1fr animates to the content's natural height without a
                guessed max-height, so a long answer never clips. */}
            <div
              id={`faq-panel-${item.id}`}
              className={`grid transition-[grid-template-rows] duration-300 ease-out ${
                isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
              }`}
            >
              <div className="overflow-hidden">
                <div className="max-w-[70ch] pb-7 pr-4 md:pr-10">
                  <p className="text-[0.9375rem] leading-[1.8] text-muted-foreground">{item.answer}</p>
                  {item.points.length > 0 ? (
                    <ul className="mt-4 space-y-2.5">
                      {item.points.map((p) => (
                        <li key={p} className="flex gap-3 text-[0.9375rem] leading-[1.7] text-muted-foreground">
                          <span
                            aria-hidden="true"
                            className={`mt-[0.6em] h-1 w-1 shrink-0 rounded-full ${
                              itemIndex % 2 === 0 ? "bg-blue-400/50" : "bg-teal/50"
                            }`}
                          />
                          {p}
                        </li>
                      ))}
                    </ul>
                  ) : null}
                </div>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
