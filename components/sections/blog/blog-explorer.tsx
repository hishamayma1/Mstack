"use client"

import { useDeferredValue, useMemo, useState } from "react"
import { Tag } from "@/components/ui/tag"
import { ExplorerSearch } from "@/components/ui/explorer-controls"
import { ScrollRail } from "@/components/ui/scroll-rail"
import { BlogCard } from "@/components/sections/blog/blog-card"
import { BLOG_EXPLORER, RESULTS_ID } from "@/components/sections/blog/blog-search"
import {
  useBlogSort,
  useExplorerFilter,
  useExplorerQuery,
  useUIActions,
  type BlogSort,
} from "@/lib/store"
import type { BlogCard as BlogCardData } from "@/lib/cms/blog"
import motion from "@/components/ui/motion.module.css"

const ALL = "All"
const PAGE_SIZE = 9

const SORTS: { id: BlogSort; label: string }[] = [
  { id: "newest", label: "Newest first" },
  { id: "oldest", label: "Oldest first" },
  { id: "title", label: "A to Z" },
]

// "All articles": topic pills with counts, sort, search, and a paged grid.
//
// Every article is already in the page (fetched and cached on the server), so
// filtering, sorting and paging are instant array work — no request per click.
// Paging exists for the DOM, not the network: rendering nine cards at a time
// keeps the first paint and every filter change cheap as the archive grows.
//
// State lives in the store (sessionStorage), so opening an article and coming
// back finds the list exactly as it was left.
export function BlogExplorer({ posts }: { posts: BlogCardData[] }) {
  const query = useExplorerQuery(BLOG_EXPLORER)
  const topic = useExplorerFilter(BLOG_EXPLORER, ALL)
  const sort = useBlogSort()
  const { setFilter, setBlogSort, resetExplorer } = useUIActions()

  const deferredQuery = useDeferredValue(query)
  const q = deferredQuery.trim().toLowerCase()

  const indexed = useMemo(
    () => posts.map((p) => ({ post: p, haystack: `${p.title} ${p.excerpt} ${p.tag}`.toLowerCase() })),
    [posts]
  )

  // Counts reflect the current search, so a pill never promises articles the
  // grid won't show.
  const { topics, filtered } = useMemo(() => {
    const matchingQuery = indexed.filter(({ haystack }) => q === "" || haystack.includes(q)).map(({ post }) => post)

    const counts = new Map<string, number>()
    for (const p of matchingQuery) counts.set(p.tag, (counts.get(p.tag) ?? 0) + 1)
    const allTags = Array.from(new Set(posts.map((p) => p.tag))).sort()
    const topics = [
      { name: ALL, count: matchingQuery.length },
      ...allTags.map((name) => ({ name, count: counts.get(name) ?? 0 })),
    ]

    const inTopic = topic === ALL ? matchingQuery : matchingQuery.filter((p) => p.tag === topic)
    // The server returns newest first, so "newest" needs no work.
    const sorted =
      sort === "oldest"
        ? [...inTopic].reverse()
        : sort === "title"
          ? [...inTopic].sort((a, b) => a.title.localeCompare(b.title))
          : inTopic

    return { topics, filtered: sorted }
  }, [indexed, posts, q, topic, sort])

  // Page size resets whenever the result set changes — tracked as "which
  // filter was this count for" rather than an effect, so there's no extra
  // render with the stale count.
  const signature = `${q}|${topic}|${sort}`
  const [paging, setPaging] = useState({ signature, count: PAGE_SIZE })
  const visibleCount = paging.signature === signature ? paging.count : PAGE_SIZE
  const visible = filtered.slice(0, visibleCount)
  const remaining = filtered.length - visible.length

  const isFiltered = q !== "" || topic !== ALL

  return (
    <section id={RESULTS_ID} className="py-24 px-6 md:px-12 lg:px-20 border-t border-border">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <Tag>THE ARCHIVE</Tag>
            <h2 className="mt-4 text-3xl md:text-4xl font-light tracking-tight">All articles.</h2>
          </div>
          <p className="text-xs text-muted-foreground tracking-wide" aria-live="polite">
            {filtered.length === 0
              ? "No matches"
              : `Showing ${visible.length} of ${filtered.length} ${filtered.length === 1 ? "article" : "articles"}`}
            {q ? <> for “{deferredQuery.trim()}”</> : null}
          </p>
        </div>

        {/* Control bar */}
        <div className="mb-8 flex flex-col lg:flex-row lg:items-center gap-3 rounded-2xl border border-border bg-card/60 p-2">
          {/* One swipeable line on phones and tablets (drag / wheel on a
              mouse), wrapping onto more lines on desktop. */}
          <ScrollRail label="Filter by topic" activeKey={topic} className="min-w-0 lg:flex-1" trackClassName="gap-1 lg:flex-wrap">
            {topics.map((t) => {
              const active = t.name === topic
              return (
                <button
                  key={t.name}
                  data-rail-key={t.name}
                  type="button"
                  aria-pressed={active}
                  onClick={() => setFilter(BLOG_EXPLORER, t.name)}
                  className={`shrink-0 inline-flex items-center gap-1.5 h-9 px-4 rounded-xl text-xs tracking-wide border transition-all duration-200 ${
                    active
                      ? "bg-background text-foreground border-border shadow-[0_2px_10px_rgb(var(--shadow-tint) / 0.08)]"
                      : "border-transparent text-foreground/60 hover:text-foreground hover:bg-accent/40"
                  }`}
                >
                  {t.name}
                  <span className={`text-[10px] ${active ? "text-teal" : "text-muted-foreground"}`}>{t.count}</span>
                </button>
              )
            })}
          </ScrollRail>

          <div className="flex items-center gap-2 lg:ml-auto">
            <ExplorerSearch explorerKey={BLOG_EXPLORER} placeholder="Filter articles..." className="flex-1 lg:w-56" />
            <label className="shrink-0 flex items-center">
              <span className="sr-only">Sort articles</span>
              <select
                value={sort}
                onChange={(e) => setBlogSort(e.target.value as BlogSort)}
                className="h-[38px] rounded-xl border border-border bg-card px-3 text-xs text-foreground focus:outline-none focus:border-blue-500/50 cursor-pointer"
              >
                {SORTS.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.label}
                  </option>
                ))}
              </select>
            </label>
          </div>
        </div>

        {filtered.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-border p-12 text-center">
            <p className="text-base font-light">Nothing matches that yet.</p>
            <p className="mt-2 text-sm text-muted-foreground">Try a broader word, or clear the filters to see everything.</p>
            <button
              type="button"
              onClick={() => resetExplorer(BLOG_EXPLORER)}
              className="mt-6 px-5 py-2.5 rounded-xl border border-border text-xs tracking-widest text-foreground/80 hover:text-foreground hover:border-teal/40 hover:bg-teal/10 transition-all"
            >
              CLEAR FILTERS
            </button>
          </div>
        ) : (
          // Re-keyed on topic and sort so the grid does a short blur-in swap
          // when they change. Not on the query — that would flash on every keystroke.
          <ul key={`${topic}|${sort}`} className={`${motion.swap} grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3`}>
            {visible.map((post, i) => (
              <li key={post.id}>
                <BlogCard post={post} index={i} />
              </li>
            ))}
          </ul>
        )}

        {filtered.length > PAGE_SIZE ? (
          <div className="mt-12 flex flex-col items-center gap-4">
            <div
              className="w-60 h-1 rounded-full bg-border overflow-hidden"
              role="progressbar"
              aria-label="Articles shown"
              aria-valuemin={0}
              aria-valuemax={filtered.length}
              aria-valuenow={visible.length}
            >
              <div
                className="h-full rounded-full bg-linear-to-r from-blue-600 to-cyan-600 origin-left transition-transform duration-500"
                style={{ transform: `scaleX(${visible.length / filtered.length})` }}
              />
            </div>
            {remaining > 0 ? (
              <button
                type="button"
                onClick={() => setPaging({ signature, count: visibleCount + PAGE_SIZE })}
                className="px-8 py-3 rounded-xl border border-border text-sm tracking-widest text-foreground/80 hover:text-foreground hover:border-teal/40 hover:bg-teal/10 transition-all"
              >
                Load {Math.min(PAGE_SIZE, remaining)} more
              </button>
            ) : (
              <p className="text-xs text-muted-foreground tracking-wide">You&apos;ve reached the end.</p>
            )}
          </div>
        ) : null}

        {isFiltered && filtered.length > 0 ? (
          <div className="mt-8 text-center">
            <button
              type="button"
              onClick={() => resetExplorer(BLOG_EXPLORER)}
              className="text-xs tracking-wide text-muted-foreground hover:text-foreground transition-colors"
            >
              Clear filters and show all {posts.length} articles
            </button>
          </div>
        ) : null}
      </div>
    </section>
  )
}
