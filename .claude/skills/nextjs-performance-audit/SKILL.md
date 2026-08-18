---
name: nextjs-performance-audit
description: Audit and restructure a Next.js App Router project for render performance, bundle size, folder structure, state management, and CMS data fetching. Use when asked to "make the site faster", "improve performance", "restructure components/folders", "clean up unused code", "add state management", "fix re-renders", or when a page feels slow, ships too much JavaScript, or has a bloated flat component directory.
---

# Next.js Performance & Structure Audit

A repeatable method for making an App Router site fast and maintainable. Derived from a real audit of a Next 16 + Payload CMS marketing site.

**Work in this order.** Each phase makes the next one cheaper, and the early phases catch the defects that dominate real-world numbers.

---

## Phase 0 — Measure and inventory before touching anything

Never optimise from intuition. Establish the baseline first.

```bash
# Flat-directory smell: a components dir with 40+ files needs grouping
ls components/sections | wc -l

# True client components (the grep alone matches comments — check line 1)
for f in $(grep -rl '"use client"' components app --include=*.tsx); do
  [ "$(head -1 "$f")" = '"use client"' ] && echo "CLIENT: $f"
done

# Unused dependencies
for pkg in $(node -p "Object.keys(require('./package.json').dependencies).join(' ')"); do
  n=$(grep -rl "$pkg" app components lib --include=*.{ts,tsx,css} 2>/dev/null | wc -l)
  [ "$n" -eq 0 ] && echo "UNUSED?: $pkg"
done
```

Runtime metrics, from a **production build** (`next build && next start`), never dev:

```js
const nav = performance.getEntriesByType('navigation')[0]
const scripts = performance.getEntriesByType('resource').filter(r => r.initiatorType === 'script')
const kb = l => Math.round(l.reduce((a, r) => a + (r.encodedBodySize || 0), 0) / 1024)
console.log({
  ttfb: Math.round(nav.responseStart),
  domInteractive: Math.round(nav.domInteractive),
  scriptKB: kb(scripts),
  // Anything starting after ~500ms is off the critical path — that's the goal
  deferredKB: kb(scripts.filter(r => r.startTime > 500)),
})
```

> Paint timing (FCP/LCP) is often suppressed in automation contexts and returns
> `null`. **Do not report numbers you did not observe.** Say so, and point the
> user at Lighthouse in DevTools or PageSpeed Insights on a deployed URL.

---

## Phase 1 — Find content hidden behind client state

This is almost always the single biggest win, and it is invisible in a bundle analyzer.

**The pattern to hunt for:** a hero or headline rendered at `opacity: 0` in the
server HTML, revealed only when a client store, effect, or timer flips.

```tsx
// BEFORE — LCP element is invisible until JS runs. Also invisible to crawlers.
const ready = useStore(s => s.introDone)
<h1 style={{ opacity: ready ? 1 : 0 }}>…</h1>

// AFTER — real HTML, painted immediately; entrance is a pure CSS animation
<h1 className={styles.rise}>…</h1>
```

Also check for **full-screen intro/loading overlays that only JS can remove**.
If hydration is slow or fails, the site is a blank screen. Convert them to pure
CSS keyframes that self-dismiss:

```css
.overlay { animation: overlayOut 500ms ease 3000ms forwards; }
@keyframes overlayOut { to { opacity: 0; visibility: hidden; } }
@media (prefers-reduced-motion: reduce) { .overlay { display: none; } }
```

A CSS-driven overlay can be a **Server Component** — zero JS, and correct with JS disabled.

---

## Phase 2 — Delete client boundaries, don't just shrink them

Scroll-reveal wrappers are the usual culprit: one `IntersectionObserver` per
card forces every grid on the site into a client boundary.

Replace with native scroll-driven animations. The component becomes a Server Component.

```css
@supports (animation-timeline: view()) {
  @media (prefers-reduced-motion: no-preference) {
    .reveal {
      animation: revealUp linear both;
      animation-timeline: view();
      /* per-element stagger via inline custom properties */
      animation-range: entry var(--reveal-start, 0%) entry var(--reveal-end, 42%);
    }
  }
}
@keyframes revealUp {
  from { opacity: 0; transform: translate3d(0, 26px, 0); }
  to   { opacity: 1; transform: none; }
}
```

The `@supports` guard is the whole safety story: unsupported browsers skip the
block and render the **finished** state. Content is never hidden behind a
feature check.

**Gotcha:** if each animated word is `display: inline-block`, a trailing space
*inside* the span is dropped by white-space processing and words run together.
Emit the space outside the span:

```tsx
<>
  <span className={styles.word}>{word}</span>
  {hasSpace ? " " : null}
</>
```

### Audit every `requestAnimationFrame` and `setInterval`

Two bugs are extremely common:

```tsx
// BUG 1: resizing the canvas inside the loop reallocates the bitmap and
// resets the context 60×/sec. Size it ONCE, outside the loop.
canvas.width = size * dpr

// BUG 2: animations run forever, off-screen, for the whole session.
const io = new IntersectionObserver(([e]) => e.isIntersecting ? start() : stop())
io.observe(el)
```

Apply the same to auto-rotating carousels — and stop them permanently once the
user makes a selection, which is better UX anyway.

---

## Phase 3 — Defer the heaviest dependency

3D/animation libraries often outweigh the entire rest of the bundle.

```tsx
const Heavy = dynamic(() => import("@/components/heavy"), { ssr: false })

export function Backdrop() {
  const [show, setShow] = useState(false)
  useEffect(() => {
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return
    if ((navigator.hardwareConcurrency ?? 8) <= 4) return   // weak devices
    const ric = window.requestIdleCallback
    if (typeof ric === "function") {
      const h = ric(() => setShow(true), { timeout: 2000 })
      return () => window.cancelIdleCallback?.(h)
    }
    const h = window.setTimeout(() => setShow(true), 600)   // Safari
    return () => window.clearTimeout(h)
  }, [])
  return show ? <Heavy /> : null
}
```

Verify it worked: the chunk's `startTime` in the resource timings should be
several hundred ms, not ~40ms.

Also collapse stacked `backdrop-filter` layers — each one is a separate
full-width compositor pass. One gradient plus one blur usually reads identically.

---

## Phase 4 — Data fetching (CMS-backed sites)

Server-fetch and prerender. **Do not move CMS data into a client store** — that
ships the data *and* the code to fetch it, with an empty state first.

Tune every query:

| Lever | Why |
|---|---|
| `depth: 0` | Default is 2. If the collection has no relations, that walk is pure cost. |
| `depth: 1` | Only where a media/relation field is actually rendered. Comment why. |
| `pagination: false` | Skips the extra count query nobody reads. |
| `select: {...}` | Return the 5 fields the card uses, not all 20. |
| Filter in the query | Not `getAll().filter()` in JS. |
| `Promise.all` | For independent fetches in the same page. |

Add a purpose-built narrow query rather than reusing a fat one:

```ts
// Renders 7 text links — don't fetch 7 full documents for that
export async function getIndustryLinks() {
  const { docs } = await payload.find({
    collection: "industries",
    depth: 0, pagination: false,
    select: { title: true, slug: true },
  })
  return docs.map(d => ({ id: String(d.id), title: d.title, slug: d.slug }))
}
```

**TS gotcha:** a shared `select` object literal widens to `boolean` and fails
Payload's `true`-only type. Add `as const`.

### Cache Components (Next 16)

```ts
// next.config.mjs → cacheComponents: true
export async function getThings() {
  "use cache"
  cacheLife("hours")
  cacheTag("things")   // enables revalidateTag() from a CMS hook later
  …
}
```

Enabling it **surfaces latent bugs** — that's a feature. Expect errors like
`encountered the unstable value new Date()`: a clock read during prerender
bakes the build date into static HTML permanently (a copyright year that goes
stale on 1 January). Fix by caching that component with `cacheLife('days')`.

> **Constraint:** an inline `"use cache"` function cannot exist inside a Client
> Component's module graph. If a cached `<Footer>` lives in your `<PageShell>`,
> a Client Component (like `error.tsx`) cannot import that shell. Give it a
> lighter shell instead.

---

## Phase 5 — State management, scoped correctly

Zustand is right for **browsing state** (search text, filters, selected tab,
open accordion, sort, view mode) and wrong for content.

Two design decisions do the real work:

```ts
export const useUIStore = create<Store>()(persist((set) => ({
  explorers: {},
  // Actions in ONE object created once — its identity never changes, so a
  // component that only dispatches never re-renders.
  actions: {
    setQuery: (key, query) => set(s => ({
      explorers: { ...s.explorers, [key]: { ...s.explorers[key], query } },
    })),
  },
}), {
  storage: createJSONStorage(() => sessionStorage),
  partialize: s => ({ explorers: s.explorers }),   // never persist `actions`
  // CRITICAL for SSR: without this, zustand reads storage during the first
  // client render and the markup won't match the server's → hydration error.
  skipHydration: true,
}))

export const useUIActions = () => useUIStore(s => s.actions)
export const useExplorerQuery = (k: string) => useUIStore(s => s.explorers[k]?.query ?? "")
```

Then rehydrate after mount in a tiny client component mounted in the layout:

```tsx
useEffect(() => { useUIStore.persist.rehydrate() }, [])
```

**Split controls into their own subscribers.** A search box and filter chips in
one `useState` component means every keystroke re-renders both. As separate
components reading separate slices, typing re-renders the input and the results
only.

**Don't persist high-frequency state.** An auto-advancing carousel index writes
to storage every few seconds — keep it in the store but exclude it from
`partialize`.

---

## Phase 6 — Folder structure

A flat `components/sections/` with 40+ files is the maintainability problem.
Group by **domain**, not by which page renders it:

```
components/
  ui/                  primitives (button, tag, media-frame, section-cta)
  layout/              shell, nav, footer
  providers/           store hydrator, context providers
  sections/
    shared/            page-hero, final-cta, error-state  (+ their .module.css)
    home/  industries/  case-studies/  resources/  about/ …
lib/
  cms/                 one file per collection: industries.ts, case-studies.ts
  content/             static copy + config maps
  store/               zustand slices
  seed/
```

Move mechanically, then rewrite imports in bulk and **build after every step**:

```bash
for f in components/sections/$dir/*.tsx; do
  base=$(basename "$f" .tsx)
  grep -rl "@/components/sections/$base\"" app components | while read -r file; do
    sed -i "s|@/components/sections/$base\"|@/components/sections/$dir/$base\"|g" "$file"
  done
done
```

**The move breaks relative CSS-module imports.** `./page-hero.module.css` from
a sibling folder now resolves nowhere. Find and re-point them at an alias:

```bash
grep -rn 'from "\./.*\.module\.css"' components/sections
```

Split files exporting 4–5 sections into one file each. Keep genuinely cohesive
files (a 500-line WebGL renderer) intact — splitting for a line count is churn.

---

## Phase 7 — Error and 404 coverage

| File | Catches |
|---|---|
| `app/global-not-found.tsx` | URLs matching **no route** |
| `app/(group)/not-found.tsx` | `notFound()` inside that segment |
| `app/(group)/error.tsx` | Runtime render errors |
| `app/global-error.tsx` | Errors in the root layout itself |

**Multiple root layouts?** (e.g. `(frontend)` and `(payload)`) Then there is no
single root layout for Next to compose a root 404 from, and unmatched URLs fall
through to the framework default. You need `app/global-not-found.tsx` plus
`experimental.globalNotFound: true`. It bypasses layouts, so it must render its
own `<html>`, `<body>`, stylesheet and fonts. **Verify by actually requesting a
bad URL** — don't assume the segment not-found covers it.

Next 16 renamed the error prop to **`retry`** (`reset` still exists but is
discouraged): `retry()` re-fetches and re-renders, `reset()` only clears state,
so a transient data failure comes straight back.

`global-error.tsx` gets no global CSS — inline every style, and use a plain
`<a>` not `<Link>`, since the router may be what failed.

When a dynamic route's `generateMetadata` returns `{}` for a missing record,
the 404 renders with the site-wide default `<title>`. Return the 404 metadata.

---

## Phase 8 — Verify

- `npx tsc --noEmit`
- `npx next build` — confirm route count and that pages still prerender (`○`/`●`)
- `next start`, then curl every route for status + size
- Load pages in a browser; check the console for hydration warnings
- Exercise persisted state: set a filter → refresh → confirm it restored

**Test the branch you didn't build for.** If a media slot has no uploads, the
real-image path is unexercised — point it at a temporary asset, confirm it
renders through `/_next/image`, then revert.

---

## Reporting rules

- Lead with what you found, not what you did.
- Quote only metrics you measured; name what you couldn't measure and why.
- Flag defects you discovered but didn't fix.
- If the request would hurt performance (e.g. "put all data in a store"), say
  so in a sentence or two, deliver the version that helps, and be explicit
  about what you did not do and why.
