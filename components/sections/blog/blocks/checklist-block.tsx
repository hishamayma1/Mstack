"use client"

import { useEffect, useState } from "react"

type Item = { id?: string; label: string; detail?: string | null }

// A checklist the reader works through. Ticks are saved in localStorage under
// the block's own id, so they survive a refresh or a return visit next week —
// this is a to-do list, not a quiz. Storage can be unavailable (private mode,
// blocked site data), so every access is guarded and the list still works for
// the current visit without it.
export function ChecklistBlock({ blockId, title, items }: { blockId: string; title?: string | null; items: Item[] }) {
  const storageKey = `mstack:blog-checklist:${blockId}`
  const [done, setDone] = useState<string[]>([])

  // Read after mount so the server HTML (nothing ticked) and the first client
  // render match; stored ticks appear a frame later.
  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(storageKey) ?? "[]")
      if (Array.isArray(saved)) setDone(saved.filter((v) => typeof v === "string"))
    } catch {
      // Unreadable or blocked storage — start empty.
    }
  }, [storageKey])

  const keyOf = (item: Item, i: number) => item.id ?? String(i)

  const update = (next: string[]) => {
    setDone(next)
    try {
      localStorage.setItem(storageKey, JSON.stringify(next))
    } catch {
      // Not persisted, but still ticked for this visit.
    }
  }

  const toggle = (key: string) => update(done.includes(key) ? done.filter((k) => k !== key) : [...done, key])

  const count = items.filter((item, i) => done.includes(keyOf(item, i))).length
  const pct = items.length ? count / items.length : 0
  const complete = items.length > 0 && count === items.length

  return (
    <div className={`rounded-2xl border p-5 md:p-6 transition-colors duration-500 ${complete ? "border-teal/40 bg-teal/[0.05]" : "border-border bg-card"}`}>
      <div className="flex items-center justify-between gap-4">
        <p className="text-lg font-light text-foreground">{title || "Your checklist"}</p>
        <span className={`shrink-0 text-xs tabular-nums ${complete ? "text-teal" : "text-muted-foreground"}`} aria-live="polite">
          {complete ? "All done ✓" : `${count} of ${items.length} done`}
        </span>
      </div>

      <div className="mt-3 h-1 rounded-full bg-border overflow-hidden" aria-hidden="true">
        <div
          className="h-full rounded-full bg-linear-to-r from-blue-600 to-cyan-500 origin-left transition-transform duration-500 ease-out"
          style={{ transform: `scaleX(${pct})` }}
        />
      </div>

      <ul className="mt-4 flex flex-col gap-1">
        {items.map((item, i) => {
          const key = keyOf(item, i)
          const checked = done.includes(key)
          const inputId = `${storageKey}:${key}`
          return (
            <li key={key}>
              <label
                htmlFor={inputId}
                className="group flex items-start gap-3 rounded-xl px-2 py-2.5 -mx-2 cursor-pointer hover:bg-accent/30 transition-colors"
              >
                <input id={inputId} type="checkbox" checked={checked} onChange={() => toggle(key)} className="peer sr-only" />
                <span
                  aria-hidden="true"
                  className={`mt-0.5 shrink-0 w-5 h-5 rounded-md border flex items-center justify-center transition-all duration-200 peer-focus-visible:ring-2 peer-focus-visible:ring-ring/60 ${
                    checked ? "bg-teal border-teal text-white scale-100" : "border-foreground/25 group-hover:border-teal/60"
                  }`}
                >
                  {checked ? (
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M5 12l5 5 9-10" />
                    </svg>
                  ) : null}
                </span>
                <span className="flex-1 min-w-0">
                  <span className={`block text-[0.95rem] leading-snug transition-colors ${checked ? "text-muted-foreground line-through decoration-teal/50" : "text-foreground"}`}>
                    {item.label}
                  </span>
                  {item.detail ? <span className="block mt-0.5 text-xs text-muted-foreground leading-relaxed">{item.detail}</span> : null}
                </span>
              </label>
            </li>
          )
        })}
      </ul>

      {count > 0 ? (
        <button
          type="button"
          onClick={() => update([])}
          className="mt-3 text-xs tracking-wide text-muted-foreground hover:text-foreground transition-colors"
        >
          Reset checklist
        </button>
      ) : null}
    </div>
  )
}
