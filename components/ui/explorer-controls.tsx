"use client"

import { useExplorerFilter, useExplorerQuery, useUIActions } from "@/lib/store"

// Search box and filter chips for the three explorers (resources, case
// studies, FAQ). Each is its own subscriber to its own slice of the store,
// which is the point: typing re-renders the input and the result list, but
// not the chips, the headings, or anything else on the page. When all of this
// lived in one component with useState, every keystroke re-rendered the lot.
//
// Both read straight from the store, so neither needs a value prop and no
// parent has to re-render to pass one down.

export function ExplorerSearch({
  explorerKey,
  placeholder,
  className = "max-w-xs w-full",
}: {
  explorerKey: string
  placeholder: string
  className?: string
}) {
  const query = useExplorerQuery(explorerKey)
  const { setQuery } = useUIActions()

  return (
    <div className={`relative ${className}`}>
      <svg
        className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground"
        width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
        aria-hidden="true"
      >
        <circle cx="11" cy="11" r="7" />
        <path d="m21 21-4.3-4.3" />
      </svg>
      <input
        type="search"
        value={query}
        onChange={(e) => setQuery(explorerKey, e.target.value)}
        placeholder={placeholder}
        aria-label={placeholder}
        className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-card border border-border text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-blue-500/50 focus:bg-accent/40 transition-colors"
      />
    </div>
  )
}

export function ExplorerFilterChips({
  explorerKey,
  options,
  fallback,
  label,
}: {
  explorerKey: string
  options: string[]
  /** The "show everything" option — also the value used when nothing is set. */
  fallback: string
  label: string
}) {
  const selected = useExplorerFilter(explorerKey, fallback)
  const { setFilter } = useUIActions()

  return (
    <div className="flex flex-wrap gap-2" role="group" aria-label={label}>
      {options.map((option) => {
        const active = option === selected
        return (
          <button
            key={option}
            onClick={() => setFilter(explorerKey, option)}
            aria-pressed={active}
            className="px-3 py-1.5 rounded-full text-[11px] tracking-wide border transition-all duration-200"
            style={{
              background: active ? "rgba(59,130,246,0.18)" : "rgba(var(--fg-rgb),0.03)",
              borderColor: active ? "rgba(96,165,250,0.4)" : "rgba(var(--fg-rgb),0.08)",
              color: active ? "rgb(var(--fg-rgb))" : "rgba(var(--fg-rgb),0.55)",
            }}
          >
            {option}
          </button>
        )
      })}
    </div>
  )
}
