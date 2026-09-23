"use client"

import Link from "next/link"
import { Tag } from "@/components/ui/tag"
import { ResourceGridExplorer } from "@/components/sections/resources/resource-grid-explorer"
import { FAQExplorer } from "@/components/sections/resources/faq-explorer"
import { useResourcesTab, useUIActions, type ResourceTabId as TabId } from "@/lib/store"
import type { ResourceCard, FAQCard } from "@/lib/cms/resources"

const TABS: { id: TabId; label: string }[] = [
  { id: "guides", label: "Guides" },
  { id: "faq", label: "FAQ" },
  { id: "tools", label: "Tools" },
]

// Section picker for /resources: only the selected content type is
// mounted at a time. Data for all three is already fetched server-side
// (see app/(frontend)/resources/page.tsx) and handed down as props, so
// switching tabs is instant — no request, no loading state — and each
// tab still runs its own search/filter (ResourceGridExplorer /
// FAQExplorer) against the slice of data it was given.
export function ResourcesExplorer({
  guides,
  tools,
  faqs,
}: {
  guides: ResourceCard[]
  tools: ResourceCard[]
  faqs: FAQCard[]
}) {
  // Selected tab lives in the store rather than local state, so it survives a
  // refresh and a round trip to another page and back.
  const active = useResourcesTab()
  const { setResourcesTab } = useUIActions()

  const counts: Record<TabId, number> = {
    guides: guides.length,
    faq: faqs.length,
    tools: tools.length,
  }

  return (
    <section className="py-24 px-6 md:px-12 lg:px-20 border-t border-border">
      <div className="max-w-6xl mx-auto">
        <div className="mb-4 max-w-2xl">
          <Tag>RESOURCE LIBRARY</Tag>
        </div>

        <div className="flex flex-wrap items-center gap-2 mb-16">
          <div className="flex flex-wrap gap-2" role="tablist" aria-label="Resource type">
            {TABS.map((t) => {
              const isActive = t.id === active
              return (
                <button
                  key={t.id}
                  role="tab"
                  aria-selected={isActive}
                  onClick={() => setResourcesTab(t.id)}
                  className="px-5 py-2.5 rounded-full text-sm tracking-wide border transition-all duration-200"
                  style={{
                    background: isActive ? "rgba(59,130,246,0.18)" : "rgba(var(--fg-rgb),0.03)",
                    borderColor: isActive ? "rgba(96,165,250,0.4)" : "rgba(var(--fg-rgb),0.08)",
                    color: isActive ? "rgba(var(--fg-rgb),0.95)" : "rgba(var(--fg-rgb),0.55)",
                  }}
                >
                  {t.label} <span className="text-muted-foreground">({counts[t.id]})</span>
                </button>
              )
            })}
          </div>
          {/* Articles moved to their own route; this keeps the old entry
              point one click from them. */}
          <Link
            href="/blog"
            className="px-5 py-2.5 rounded-full text-sm tracking-wide border border-border text-foreground/60 hover:text-foreground hover:border-teal/40 hover:bg-teal/10 transition-all duration-200"
          >
            Blog <span aria-hidden="true">→</span>
          </Link>
        </div>

        {/* Remounting on `key={active}` replays the fade-up animation
            (defined in globals.css) each time the selection changes. */}
        <div key={active} role="tabpanel" className="animate-[fade-up_0.5s_cubic-bezier(0.16,1,0.3,1)]">
          {active === "guides" ? (
            <ResourceGridExplorer id="guides" eyebrow="DOWNLOADABLE GUIDES" title="Guides & Checklists" items={guides} searchPlaceholder="Search guides..." />
          ) : null}
          {active === "tools" ? (
            <ResourceGridExplorer id="tools" eyebrow="FREE TOOLS" title="Calculators & Scorecards" items={tools} searchPlaceholder="Search tools..." />
          ) : null}
          {active === "faq" ? <FAQExplorer faqs={faqs} standalone={false} scope="faq-resources" /> : null}
        </div>
      </div>
    </section>
  )
}
