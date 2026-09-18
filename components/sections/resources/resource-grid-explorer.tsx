"use client"

import { useDeferredValue, useMemo } from "react"
import { Tag } from "@/components/ui/tag"
import { ExplorerFilterChips, ExplorerSearch } from "@/components/ui/explorer-controls"
import { useExplorerFilter, useExplorerQuery } from "@/lib/store"
import type { ResourceCard } from "@/lib/cms/resources"

const ALL = "All"

// Shared by the Blog, Guides, and Tools sections on /resources — all three
// are "title + description + tag + optional link" cards, so one explorer
// with a search box and tag filter chips serves all three instead of three
// near-identical components.
//
// Search and filter state live in the store keyed by `id`, so each of the
// three keeps its own independent state and all of it survives a refresh.
// The controls are separate subscribers (see explorer-controls.tsx), so this
// component re-renders only when the result set can actually change.
export function ResourceGridExplorer({
  id,
  eyebrow,
  title,
  items,
  searchPlaceholder,
}: {
  id: string
  eyebrow: string
  title: string
  items: ResourceCard[]
  searchPlaceholder: string
}) {
  const query = useExplorerQuery(id)
  const tag = useExplorerFilter(id, ALL)

  // Deferred value keeps typing responsive, and the lowercase haystack is
  // built once per dataset rather than recomputed on every keystroke.
  const deferredQuery = useDeferredValue(query)

  const indexed = useMemo(
    () => items.map((item) => ({ item, haystack: `${item.title} ${item.description} ${item.tag}`.toLowerCase() })),
    [items]
  )

  const tags = useMemo(() => [ALL, ...Array.from(new Set(items.map((i) => i.tag))).sort()], [items])

  const filtered = useMemo(() => {
    const q = deferredQuery.trim().toLowerCase()
    return indexed
      .filter(({ item }) => tag === ALL || item.tag === tag)
      .filter(({ haystack }) => q === "" || haystack.includes(q))
      .map(({ item }) => item)
  }, [indexed, deferredQuery, tag])

  if (items.length === 0) return null

  return (
    <div id={id} className="mb-20 last:mb-0 scroll-mt-32">
      <div className="mb-6">
        <Tag>{eyebrow}</Tag>
        <h3 className="mt-4 text-2xl md:text-3xl font-light tracking-tight">{title}</h3>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-8">
        <ExplorerSearch explorerKey={id} placeholder={searchPlaceholder} />
        <ExplorerFilterChips
          explorerKey={id}
          options={tags}
          fallback={ALL}
          label={`Filter ${title} by tag`}
        />
      </div>

      {filtered.length === 0 ? (
        <div className="rounded-2xl border border-border p-8 text-center">
          <p className="text-sm text-muted-foreground">Nothing matches — try a different search or tag.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {filtered.map((item, i) => (
            <article
              key={item.id}
              className={`rounded-2xl border border-border bg-card p-7 flex flex-col transition-all duration-300 ${
                i % 2 === 0 ? "hover:border-blue-500/30 hover:bg-accent/30" : "hover:border-teal/30 hover:bg-teal/5"
              }`}
            >
              <div className="mb-4">
                <Tag>{item.tag}</Tag>
              </div>
              <h4 className="text-base font-light mb-2">{item.title}</h4>
              <p className="text-sm text-muted-foreground leading-relaxed">{item.description}</p>
              {item.href ? (
                <a
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`mt-5 pt-4 border-t border-border text-xs transition-colors tracking-wide ${
                    i % 2 === 0
                      ? "text-blue-600 dark:text-blue-300/80 hover:text-blue-700 dark:hover:text-blue-300"
                      : "text-teal/80 hover:text-teal"
                  }`}
                >
                  {item.hrefLabel} →
                </a>
              ) : null}
            </article>
          ))}
        </div>
      )}
    </div>
  )
}
