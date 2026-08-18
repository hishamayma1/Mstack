import { create } from "zustand"
import { persist, createJSONStorage } from "zustand/middleware"

// ─────────────────────────────────────────────────────────────────────────────
// Shared UI state.
//
// Scope, deliberately: this holds *browsing state* only — what the visitor has
// typed, filtered, expanded, or selected. It does NOT hold content. All page
// content is fetched server-side from Payload and prerendered into static HTML
// (see lib/payload-*.ts), which is faster than any client cache could be and
// costs the visitor no JavaScript at all. Putting that data here instead would
// turn static pages into client-fetched ones.
//
// Two things this buys us:
//
//  1. Persistence. State is written to sessionStorage, so a filtered resource
//     list, an open FAQ, or a selected tab survives a refresh and survives
//     navigating away and back. Previously every one of these reset to its
//     default because it lived in component-local useState.
//
//  2. Fewer re-renders. Actions live in a single object created once at store
//     creation, so `useUIActions()` returns a reference that never changes and
//     a component that only dispatches never re-renders. Readers use atomic
//     selectors, so typing in a search box re-renders the search box and the
//     result grid — not the tab bar, the filter chips, or the page around them.
// ─────────────────────────────────────────────────────────────────────────────

export type ResourceTabId = "blog" | "guides" | "faq" | "tools"

/** Ordering options on the /case-studies index. */
export type CaseStudySort = "newest" | "client" | "industry"

/** Card grid or condensed list on the /case-studies index. */
export type CaseStudyView = "grid" | "list"

export type ExplorerState = {
  query: string
  /** Tag / category / industry chip, whichever that explorer filters on. */
  filter: string
}

type UIStore = {
  /** Keyed by explorer id — "blog", "guides", "tools", "case-studies", ... */
  explorers: Record<string, ExplorerState>
  resourcesTab: ResourceTabId
  industryIndex: number
  /** Keyed by scope, since the FAQ accordion renders on more than one page. */
  openFAQ: Record<string, string | null>
  caseStudySort: CaseStudySort
  caseStudyView: CaseStudyView

  actions: {
    setQuery: (key: string, query: string) => void
    setFilter: (key: string, filter: string) => void
    resetExplorer: (key: string) => void
    setResourcesTab: (tab: ResourceTabId) => void
    setIndustryIndex: (index: number) => void
    setOpenFAQ: (scope: string, id: string | null) => void
    setCaseStudySort: (sort: CaseStudySort) => void
    setCaseStudyView: (view: CaseStudyView) => void
  }
}

const EMPTY_EXPLORER: ExplorerState = { query: "", filter: "" }

export const useUIStore = create<UIStore>()(
  persist(
    (set) => ({
      explorers: {},
      resourcesTab: "blog",
      industryIndex: 0,
      openFAQ: {},
      caseStudySort: "newest",
      caseStudyView: "grid",

      // Created once, never replaced — this object's identity is what makes
      // useUIActions() safe to call from any component without subscribing it
      // to state changes.
      actions: {
        setQuery: (key, query) =>
          set((s) => ({
            explorers: {
              ...s.explorers,
              [key]: { ...(s.explorers[key] ?? EMPTY_EXPLORER), query },
            },
          })),

        setFilter: (key, filter) =>
          set((s) => ({
            explorers: {
              ...s.explorers,
              [key]: { ...(s.explorers[key] ?? EMPTY_EXPLORER), filter },
            },
          })),

        resetExplorer: (key) =>
          set((s) => ({ explorers: { ...s.explorers, [key]: EMPTY_EXPLORER } })),

        setResourcesTab: (resourcesTab) => set({ resourcesTab }),

        setIndustryIndex: (industryIndex) => set({ industryIndex }),

        setOpenFAQ: (scope, id) =>
          set((s) => ({ openFAQ: { ...s.openFAQ, [scope]: id } })),

        setCaseStudySort: (caseStudySort) => set({ caseStudySort }),

        setCaseStudyView: (caseStudyView) => set({ caseStudyView }),
      },
    }),
    {
      name: "mstack:ui",
      // sessionStorage, not localStorage: a filter you set five minutes ago is
      // useful context, one you set last week is confusing.
      storage: createJSONStorage(() => sessionStorage),
      // Never serialise the action object.
      //
      // `industryIndex` is deliberately excluded: that carousel auto-advances
      // every few seconds, and persisting it would mean a JSON serialise and a
      // sessionStorage write every 3.2s for the whole session. It still lives
      // in the store (so it is shared and survives client-side navigation),
      // just not on disk.
      partialize: (s) => ({
        explorers: s.explorers,
        resourcesTab: s.resourcesTab,
        openFAQ: s.openFAQ,
        caseStudySort: s.caseStudySort,
        caseStudyView: s.caseStudyView,
      }),
      version: 1,
      // Critical for SSR: without this, zustand reads sessionStorage during
      // the first client render, which produces markup that doesn't match the
      // server HTML and React throws a hydration error. Instead the first
      // render uses the defaults (matching the server exactly) and
      // StoreHydrator replays the stored values immediately after mount.
      skipHydration: true,
    }
  )
)

// ── Selectors ────────────────────────────────────────────────────────────────
// Each returns the smallest possible slice, so subscribers re-render only when
// the value they actually read changes.

/** Stable across the component's whole lifetime — never triggers a re-render. */
export const useUIActions = () => useUIStore((s) => s.actions)

export const useExplorerQuery = (key: string) =>
  useUIStore((s) => s.explorers[key]?.query ?? "")

export const useExplorerFilter = (key: string, fallback: string) =>
  useUIStore((s) => s.explorers[key]?.filter || fallback)

export const useResourcesTab = () => useUIStore((s) => s.resourcesTab)

export const useIndustryIndex = () => useUIStore((s) => s.industryIndex)

// `null` is a real value here (every item collapsed), so only `undefined`
// means "the visitor hasn't touched this yet, use the caller's default".
export const useOpenFAQ = (scope: string, fallback: string | null) =>
  useUIStore((s) => (s.openFAQ[scope] === undefined ? fallback : s.openFAQ[scope]))

export const useCaseStudySort = () => useUIStore((s) => s.caseStudySort)

export const useCaseStudyView = () => useUIStore((s) => s.caseStudyView)
