"use client"

import { useDeferredValue, useMemo } from "react"
import Link from "next/link"
import { Tag } from "@/components/ui/tag"
import { ExplorerFilterChips, ExplorerSearch } from "@/components/ui/explorer-controls"
import { SectionCTA } from "@/components/ui/section-cta"
import { MediaFrame } from "@/components/ui/media-frame"
import {
  CaseStudySortControl,
  CaseStudyViewControl,
} from "@/components/sections/case-studies/case-study-controls"
import {
  useCaseStudySort,
  useCaseStudyView,
  useExplorerFilter,
  useExplorerQuery,
} from "@/lib/store"
import type { CaseStudyCard } from "@/lib/cms/case-studies"

const ALL = "All Industries"
const KEY = "case-studies"

// Every card now links to its own /case-studies/[slug] page — the slug field
// existed on the collection from the start but nothing linked to it, so the
// index was the whole experience.
//
// Search, industry filter, sort and layout all live in the store, so a
// visitor who opens a study and comes back finds the list exactly as they
// left it, and so does one who refreshes.
export function CaseStudiesExplorer({ caseStudies }: { caseStudies: CaseStudyCard[] }) {
  const query = useExplorerQuery(KEY)
  const industry = useExplorerFilter(KEY, ALL)
  const sort = useCaseStudySort()
  const view = useCaseStudyView()

  // Deferred so typing stays responsive while the grid recomputes.
  const deferredQuery = useDeferredValue(query)

  // The lowercase haystack per card is built once when the dataset changes,
  // not on every keystroke, so each search is a cheap substring scan.
  const indexed = useMemo(
    () =>
      caseStudies.map((c) => ({
        card: c,
        haystack: `${c.client} ${c.industry} ${c.challenge} ${c.result}`.toLowerCase(),
      })),
    [caseStudies]
  )

  const industries = useMemo(
    () => [ALL, ...Array.from(new Set(caseStudies.map((c) => c.industry))).sort()],
    [caseStudies]
  )

  const filtered = useMemo(() => {
    const q = deferredQuery.trim().toLowerCase()
    const matched = indexed
      .filter(({ card }) => industry === ALL || card.industry === industry)
      .filter(({ haystack }) => q === "" || haystack.includes(q))
      .map(({ card }) => card)

    // The server already returns newest-first, so "newest" needs no work.
    if (sort === "client") {
      return [...matched].sort((a, b) => a.client.localeCompare(b.client))
    }
    if (sort === "industry") {
      return [...matched].sort(
        (a, b) => a.industry.localeCompare(b.industry) || a.client.localeCompare(b.client)
      )
    }
    return matched
  }, [indexed, deferredQuery, industry, sort])

  return (
    <section id="all-studies" className="py-24 px-6 md:px-12 lg:px-20 border-t border-white/[0.08]">
      <div className="max-w-6xl mx-auto">
        <div className="mb-10 max-w-2xl">
          <Tag>PROVEN RESULTS</Tag>
          <h2 className="mt-5 text-4xl md:text-5xl font-light tracking-tight leading-[1.05]">
            Real Businesses,<br />Real Outcomes.
          </h2>
        </div>

        {/* Controls */}
        <div className="flex flex-col gap-4 mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center gap-3">
            <ExplorerSearch
              explorerKey={KEY}
              placeholder="Search by client, industry, or challenge..."
              className="max-w-md w-full"
            />
            <div className="sm:ml-auto flex items-center gap-4">
              <CaseStudySortControl />
              <CaseStudyViewControl />
            </div>
          </div>

          <ExplorerFilterChips
            explorerKey={KEY}
            options={industries}
            fallback={ALL}
            label="Filter by industry"
          />
        </div>

        <p className="text-xs text-white/35 tracking-wide mb-6" aria-live="polite">
          {filtered.length} {filtered.length === 1 ? "case study" : "case studies"}
        </p>

        {filtered.length === 0 ? (
          <div className="rounded-2xl border border-white/[0.08] p-12 text-center">
            <p className="text-sm text-white/45">
              No case studies match your search. Try a different term or industry.
            </p>
          </div>
        ) : view === "list" ? (
          <ul className="border-t border-white/[0.08]">
            {filtered.map((c) => (
              <li key={c.id}>
                <Link
                  href={`/case-studies/${c.slug}`}
                  className="group grid grid-cols-1 md:grid-cols-12 gap-3 md:gap-6 items-baseline py-6 border-b border-white/[0.08] hover:bg-white/[0.02] transition-colors"
                >
                  <span className="md:col-span-4 text-base font-light group-hover:text-blue-300/90 transition-colors">
                    {c.client}
                  </span>
                  <span className="md:col-span-3 text-xs text-white/40 tracking-wide">
                    {c.industry}
                  </span>
                  <span className="md:col-span-3 text-sm text-white/55 leading-relaxed">
                    {c.stat.label}
                  </span>
                  <span className="md:col-span-2 md:text-right text-xl font-light text-blue-400 font-ibm-plex">
                    {c.stat.value}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
            {filtered.map((c) => (
              <Link key={c.id} href={`/case-studies/${c.slug}`} className="block group">
                <article className="h-full rounded-2xl border border-white/[0.08] bg-[#10141f] p-8 flex flex-col transition-all duration-300 group-hover:border-blue-500/30 group-hover:bg-[#131a29]">
                  <MediaFrame
                    src={c.heroImage?.url}
                    alt={c.heroImage?.alt ?? ""}
                    label={c.client}
                    hint="1600×1000"
                    aspect="16/9"
                    className="mb-6"
                    sizes="(max-width: 1024px) 100vw, 45vw"
                  />

                  <div className="flex items-start justify-between gap-4 mb-6">
                    <h3 className="text-lg font-light">{c.client}</h3>
                    <Tag>{c.industry}</Tag>
                  </div>

                  <p className="text-[11px] uppercase tracking-widest text-white/35 mb-1.5">
                    Challenge
                  </p>
                  <p className="text-sm text-white/55 leading-relaxed mb-5">{c.challenge}</p>

                  <p className="text-[11px] uppercase tracking-widest text-white/35 mb-1.5">
                    What We Did
                  </p>
                  <p className="text-sm text-white/55 leading-relaxed mb-6">{c.result}</p>

                  <div className="mt-auto pt-5 border-t border-white/[0.08] flex items-end justify-between gap-4">
                    <span className="flex items-baseline gap-2">
                      <span className="text-2xl font-light text-blue-400 font-ibm-plex">
                        {c.stat.value}
                      </span>
                      <span className="text-xs text-white/45 tracking-wide">{c.stat.label}</span>
                    </span>
                    <span className="shrink-0 text-xs text-blue-300/70 group-hover:text-blue-300 transition-colors tracking-wide">
                      Read story →
                    </span>
                  </div>
                </article>
              </Link>
            ))}
          </div>
        )}

        <SectionCTA
          text="Every one of these started with a free 15-minute call. Yours can too."
          primaryLabel="Book a Free Consultation"
          secondaryLabel="See Our Service Levels"
          secondaryHref="/solutions"
        />
      </div>
    </section>
  )
}
