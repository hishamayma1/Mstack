"use client"

import {
  useCaseStudySort,
  useCaseStudyView,
  useUIActions,
  type CaseStudySort,
  type CaseStudyView,
} from "@/lib/store"

// Sort and view toggles for the /case-studies index.
//
// Each is its own subscriber to its own slice of the store, so changing the
// sort doesn't re-render the view toggle and neither re-renders the search
// box or the filter chips. Both selections persist across a refresh.

const SORTS: { id: CaseStudySort; label: string }[] = [
  { id: "newest", label: "Newest" },
  { id: "client", label: "Client A–Z" },
  { id: "industry", label: "Industry" },
]

export function CaseStudySortControl() {
  const sort = useCaseStudySort()
  const { setCaseStudySort } = useUIActions()

  return (
    <div className="flex items-center gap-2">
      <span className="text-[11px] tracking-widest text-white/30 shrink-0">SORT</span>
      <div className="flex gap-1" role="group" aria-label="Sort case studies">
        {SORTS.map((s) => {
          const active = s.id === sort
          return (
            <button
              key={s.id}
              onClick={() => setCaseStudySort(s.id)}
              aria-pressed={active}
              className={`px-3 py-1.5 rounded-lg text-[11px] tracking-wide transition-colors ${
                active
                  ? "bg-white/[0.08] text-white/90"
                  : "text-white/45 hover:text-white/75 hover:bg-white/[0.04]"
              }`}
            >
              {s.label}
            </button>
          )
        })}
      </div>
    </div>
  )
}

const VIEWS: { id: CaseStudyView; label: string; icon: string }[] = [
  { id: "grid", label: "Grid view", icon: "▦" },
  { id: "list", label: "List view", icon: "☰" },
]

export function CaseStudyViewControl() {
  const view = useCaseStudyView()
  const { setCaseStudyView } = useUIActions()

  return (
    <div className="flex gap-1" role="group" aria-label="Layout">
      {VIEWS.map((v) => {
        const active = v.id === view
        return (
          <button
            key={v.id}
            onClick={() => setCaseStudyView(v.id)}
            aria-pressed={active}
            aria-label={v.label}
            title={v.label}
            className={`w-8 h-8 rounded-lg text-xs transition-colors ${
              active
                ? "bg-white/[0.08] text-white/90"
                : "text-white/35 hover:text-white/70 hover:bg-white/[0.04]"
            }`}
          >
            <span aria-hidden="true">{v.icon}</span>
          </button>
        )
      })}
    </div>
  )
}
