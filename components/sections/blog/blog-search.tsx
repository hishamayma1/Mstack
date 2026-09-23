"use client"

import { useDeferredValue, useEffect, useId, useMemo, useRef, useState, type ReactNode } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useExplorerQuery, useUIActions } from "@/lib/store"

// The hero search and the topic shortcuts on /blog.
//
// Both write to the same store slice ("blog") the article explorer further
// down reads, so typing here, or picking a topic, filters that grid too —
// there is one source of truth, not two search boxes that disagree.
//
// Typing also shows the top matches right under the box (a combobox), so a
// visitor who knows what they want is one keystroke from the article and
// never has to scroll to the grid at all.

export const BLOG_EXPLORER = "blog"
export const RESULTS_ID = "all-articles"
const MAX_SUGGESTIONS = 5

export type BlogSearchItem = { slug: string; title: string; tag: string; excerpt: string }

export function scrollToResults() {
  const el = document.getElementById(RESULTS_ID)
  if (!el) return
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches
  el.scrollIntoView({ behavior: reduced ? "auto" : "smooth", block: "start" })
}

// Wraps the matched part of a title in <mark>, so a visitor sees *why* a
// result matched. Case-insensitive, first occurrence only.
function highlight(text: string, q: string): ReactNode {
  if (!q) return text
  const i = text.toLowerCase().indexOf(q)
  if (i === -1) return text
  return (
    <>
      {text.slice(0, i)}
      <mark className="bg-transparent text-foreground font-normal underline decoration-teal/60 underline-offset-4">
        {text.slice(i, i + q.length)}
      </mark>
      {text.slice(i + q.length)}
    </>
  )
}

export function BlogSearch({ items, popular }: { items: BlogSearchItem[]; popular: string[] }) {
  const query = useExplorerQuery(BLOG_EXPLORER)
  const { setQuery, setFilter } = useUIActions()
  const router = useRouter()

  const inputRef = useRef<HTMLInputElement>(null)
  const wrapRef = useRef<HTMLDivElement>(null)
  const listId = useId()

  const [open, setOpen] = useState(false)
  const [active, setActive] = useState(-1)
  // Rendered as "Ctrl K" on the server and first paint; switched to ⌘K after
  // mount on a Mac, so the markup still matches what the server sent.
  const [shortcut, setShortcut] = useState("Ctrl K")

  const deferred = useDeferredValue(query)
  const q = deferred.trim().toLowerCase()

  const indexed = useMemo(
    () => items.map((item) => ({ item, haystack: `${item.title} ${item.tag} ${item.excerpt}`.toLowerCase() })),
    [items]
  )

  const { suggestions, total } = useMemo(() => {
    if (!q) return { suggestions: [] as BlogSearchItem[], total: 0 }
    // Title hits rank above excerpt-only hits.
    const hits = indexed.filter(({ haystack }) => haystack.includes(q)).map(({ item }) => item)
    hits.sort((a, b) => Number(b.title.toLowerCase().includes(q)) - Number(a.title.toLowerCase().includes(q)))
    return { suggestions: hits.slice(0, MAX_SUGGESTIONS), total: hits.length }
  }, [indexed, q])

  // Ctrl/⌘ K and "/" jump to the search box from anywhere on the page.
  useEffect(() => {
    if (/Mac|iPhone|iPad/.test(navigator.platform)) setShortcut("⌘K")

    const onKey = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null
      const typing = target?.closest("input, textarea, select, [contenteditable='true']")
      if ((e.key === "k" || e.key === "K") && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        inputRef.current?.focus()
        inputRef.current?.select()
      } else if (e.key === "/" && !typing) {
        e.preventDefault()
        inputRef.current?.focus()
      }
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [])

  const showList = open && q.length > 0
  // Clamp rather than reset in an effect: the list can shrink under the
  // highlighted row as the visitor keeps typing.
  const activeIndex = active < suggestions.length ? active : -1

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "ArrowDown") {
      e.preventDefault()
      setOpen(true)
      setActive((i) => (i + 1 >= suggestions.length ? 0 : i + 1))
    } else if (e.key === "ArrowUp") {
      e.preventDefault()
      setActive((i) => (i <= 0 ? suggestions.length - 1 : i - 1))
    } else if (e.key === "Escape") {
      if (showList) {
        e.preventDefault()
        setOpen(false)
      } else if (query) {
        setQuery(BLOG_EXPLORER, "")
      }
    } else if (e.key === "Enter") {
      e.preventDefault()
      const pick = suggestions[activeIndex]
      if (pick) {
        router.push(`/blog/${pick.slug}`)
      } else {
        setOpen(false)
        scrollToResults()
      }
    }
  }

  const pickTopic = (topic: string) => {
    setFilter(BLOG_EXPLORER, topic)
    setQuery(BLOG_EXPLORER, "")
    scrollToResults()
  }

  return (
    <div className="w-full max-w-2xl mx-auto">
      <form
        role="search"
        onSubmit={(e) => {
          e.preventDefault()
          setOpen(false)
          scrollToResults()
        }}
      >
        <div
          ref={wrapRef}
          className="relative"
          onBlur={(e) => {
            if (!wrapRef.current?.contains(e.relatedTarget as Node | null)) setOpen(false)
          }}
        >
          <label htmlFor={`${listId}-input`} className="sr-only">
            Search the blog
          </label>
          <div
            className="flex items-center gap-3 h-14 md:h-16 pl-5 pr-2 rounded-2xl border border-glass-border transition-[border-color,box-shadow] duration-200 focus-within:border-blue-500/50 focus-within:shadow-[0_0_0_4px_rgba(59,130,246,0.12)]"
            style={{
              background: "var(--glass-bg)",
              backdropFilter: "blur(16px)",
              WebkitBackdropFilter: "blur(16px)",
              boxShadow: "var(--shadow-glass)",
            }}
          >
            <svg
              width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
              strokeLinecap="round" className="shrink-0 text-muted-foreground" aria-hidden="true"
            >
              <circle cx="11" cy="11" r="7" />
              <path d="m20 20-3.5-3.5" />
            </svg>
            <input
              ref={inputRef}
              id={`${listId}-input`}
              type="search"
              role="combobox"
              aria-expanded={showList}
              aria-controls={listId}
              aria-autocomplete="list"
              aria-activedescendant={activeIndex >= 0 ? `${listId}-opt-${activeIndex}` : undefined}
              autoComplete="off"
              enterKeyHint="search"
              value={query}
              onChange={(e) => {
                setQuery(BLOG_EXPLORER, e.target.value)
                setOpen(true)
                setActive(-1)
              }}
              onFocus={() => setOpen(true)}
              onKeyDown={onKeyDown}
              placeholder="Search articles — e.g. migration, SharePoint, MFA"
              className="flex-1 min-w-0 bg-transparent text-sm md:text-base text-foreground placeholder:text-muted-foreground focus:outline-none [&::-webkit-search-cancel-button]:hidden"
            />
            {query ? (
              <button
                type="button"
                onClick={() => {
                  setQuery(BLOG_EXPLORER, "")
                  inputRef.current?.focus()
                }}
                aria-label="Clear search"
                className="shrink-0 w-8 h-8 rounded-lg flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-accent/60 transition-colors"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
                  <path d="M6 6l12 12M18 6 6 18" />
                </svg>
              </button>
            ) : (
              <kbd className="hidden sm:inline-flex shrink-0 items-center px-2 py-1 rounded-md border border-border text-[11px] font-mono text-muted-foreground">
                {shortcut}
              </kbd>
            )}
            <button
              type="submit"
              className="shrink-0 h-10 md:h-12 px-5 md:px-6 rounded-xl bg-linear-to-br from-blue-600 to-cyan-600 text-white text-sm tracking-widest font-medium transition-[filter] duration-200 hover:brightness-110 active:brightness-95"
            >
              Search
            </button>
          </div>

          {showList ? (
            <div
              className="absolute left-0 right-0 top-full mt-2 z-30 rounded-2xl border border-glass-border overflow-hidden text-left animate-[fade-up_0.25s_cubic-bezier(0.16,1,0.3,1)]"
              style={{
                background: "var(--surface-solid)",
                boxShadow: "var(--shadow-dropdown)",
              }}
            >
              {suggestions.length > 0 ? (
                <ul id={listId} role="listbox" aria-label="Matching articles" className="py-2">
                  {suggestions.map((s, i) => (
                    <li
                      key={s.slug}
                      id={`${listId}-opt-${i}`}
                      role="option"
                      aria-selected={i === activeIndex}
                      onMouseEnter={() => setActive(i)}
                    >
                      <Link
                        href={`/blog/${s.slug}`}
                        tabIndex={-1}
                        className={`flex items-start gap-4 px-5 py-3 transition-colors ${
                          i === activeIndex ? "bg-accent/60" : ""
                        }`}
                      >
                        <span className="mt-0.5 shrink-0 w-24 text-[10px] tracking-widest text-muted-foreground uppercase truncate">
                          {s.tag}
                        </span>
                        <span className="text-sm font-light text-foreground/90 leading-snug">{highlight(s.title, q)}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              ) : (
                <p id={listId} role="status" className="px-5 py-4 text-sm text-muted-foreground">
                  No articles match “{deferred.trim()}”. Try a broader word, or browse by topic below.
                </p>
              )}
              {total > 0 ? (
                <button
                  type="submit"
                  className="w-full flex items-center justify-between px-5 py-3 border-t border-border text-xs tracking-wide text-muted-foreground hover:text-foreground hover:bg-accent/40 transition-colors"
                >
                  <span>
                    See all {total} {total === 1 ? "result" : "results"}
                  </span>
                  <span aria-hidden="true">↓</span>
                </button>
              ) : null}
            </div>
          ) : null}
        </div>
      </form>

      {popular.length > 0 ? (
        <div className="mt-5 flex flex-wrap items-center justify-center gap-2 text-xs">
          <span className="text-muted-foreground tracking-wide mr-1">Popular topics:</span>
          {popular.map((topic) => (
            <button
              key={topic}
              type="button"
              onClick={() => pickTopic(topic)}
              className="px-3 py-1.5 rounded-full border border-border bg-card/60 text-foreground/70 tracking-wide hover:text-foreground hover:border-teal/40 hover:bg-teal/10 transition-all duration-200"
            >
              {topic}
            </button>
          ))}
        </div>
      ) : null}
    </div>
  )
}

/**
 * A button that filters the article grid to one topic and scrolls to it —
 * used by the topic cards, which are otherwise server-rendered.
 */
export function TopicJump({
  topic,
  className,
  children,
}: {
  topic: string
  className?: string
  children: ReactNode
}) {
  const { setFilter, setQuery } = useUIActions()
  return (
    <button
      type="button"
      className={className}
      onClick={() => {
        setFilter(BLOG_EXPLORER, topic)
        setQuery(BLOG_EXPLORER, "")
        scrollToResults()
      }}
    >
      {children}
    </button>
  )
}
