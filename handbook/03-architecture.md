# 03 · Architecture

How the code is organised, how a page gets rendered, and how data moves through the system.

---

## 1. Folder structure

```
MStack/
├── app/                              Next.js App Router — routes only, thin files
│   ├── (frontend)/                   Marketing site (route group, not in URL)
│   │   ├── layout.tsx                Root layout #1: fonts, ThemeProvider, StoreHydrator, Analytics
│   │   ├── globals.css               Design tokens, service themes, blue bands, Tailwind theme
│   │   ├── page.tsx                  Homepage
│   │   ├── solutions/[slug]/
│   │   │   ├── page.tsx              Service detail page
│   │   │   └── actions.ts            Server action: submitServiceRequest()
│   │   ├── industries/ case-studies/ blog/ resources/ about/ contact/ legal/
│   │   ├── error.tsx                 500 boundary for frontend pages
│   │   └── not-found.tsx             404 when a page calls notFound()
│   ├── (payload)/                    Payload admin + API (route group)
│   │   ├── layout.tsx                Root layout #2: Payload's own <html>, not prerendered
│   │   ├── admin/[[...segments]]/    The /admin UI
│   │   ├── api/[...slug]/route.ts    REST API  (/api/<collection>)
│   │   ├── api/graphql/              GraphQL API
│   │   ├── admin/importMap.js        ⚙ Generated: maps admin component paths → imports
│   │   └── custom.scss               Admin theme overrides
│   ├── global-not-found.tsx          404 for URLs that match no route
│   └── global-error.tsx              Last-resort error page
│
├── collections/                      Payload CMS schema — one file per content type
│   ├── access.ts                     Roles (admin/manager/editor) and access helpers
│   ├── author.ts                     Shared "Author" + "Mentions" fields and hooks
│   └── blog-blocks.ts                Custom rich-text blocks for blog articles
│
├── components/
│   ├── admin/                        Custom components injected into /admin
│   ├── layout/                       Nav, mobile menu, footer, floating actions, PageShell
│   ├── providers/                    ThemeProvider, StoreHydrator
│   ├── sections/<page>/              Page sections grouped by the page that uses them
│   │   └── shared/                   Sections used by several pages (FinalCTA, PageHero…)
│   └── ui/                           Reusable primitives (Section, BentoCard, Tag, RevealText…)
│
├── lib/
│   ├── cms/                          Data access: cached Payload reads → flat frontend shapes
│   ├── content/                      Hard-coded copy (homepage, about, nav, footer, legal)
│   ├── seed/                         Starter content inserted into an empty database
│   ├── notify/service-request.ts     Email + push alerts for new leads
│   ├── store/index.ts                Zustand UI store
│   ├── pricing.ts                    Pure pricing engine (client + server)
│   ├── service-theme.ts              Service slug → accent colour
│   ├── service-request-state.ts      Form state type for the quote form
│   ├── motion.ts                     Scroll-animation stagger helpers
│   └── people.ts                     Initials, media URL helpers
│
├── public/                           Static files: sw.js, icons, logo, images/, team/
├── scripts/seed-blog.ts              One-off script: upgrade blog seed content
├── payload.config.ts                 Payload configuration (collections, DB, email, storage, seed)
├── payload-types.ts                  ⚙ Generated TypeScript types — never edit by hand
├── next.config.mjs                   Next.js configuration
├── ENVIRONMENT.md                    Environment-variable guide
└── handbook/                         This documentation
```

### Placement rules

| You're adding… | Put it in… |
|---|---|
| A new page | `app/(frontend)/<route>/page.tsx` — keep it thin: fetch data, compose sections |
| A section used on one page | `components/sections/<page>/<name>-section.tsx` |
| A section used on several pages | `components/sections/shared/` |
| A small reusable visual building block | `components/ui/` |
| A database read for the site | `lib/cms/<collection>.ts`, wrapped in `"use cache"` |
| Static marketing copy | `lib/content/site.ts` (or a sibling file) — never inline in JSX |
| A new content type editors manage | `collections/<Name>.ts` + register in `payload.config.ts` |
| Business logic with no UI | `lib/<name>.ts`, pure functions |
| A dashboard customisation | `components/admin/` + reference it by path in a collection or `payload.config.ts` |

File naming: **kebab-case** files (`service-hero.tsx`), **PascalCase** components (`ServiceHero`), named exports (no default exports except Next.js route files).

---

## 2. Two root layouts

The app has **no shared `app/layout.tsx`**. Instead there are two independent root layouts:

| | `(frontend)/layout.tsx` | `(payload)/layout.tsx` |
|---|---|---|
| Serves | Every public page | `/admin` and `/api` |
| Theme | Light by default, user-switchable | Forced dark (`admin.theme: "dark"`) |
| Rendering | Prerendered / cached static HTML | Request-time (`await connection()`, `instant = false`) |
| CSS | `globals.css` (Tailwind) | Payload styles + `custom.scss` |

Because there are two roots, a URL that matches neither needs `app/global-not-found.tsx` (enabled with `experimental.globalNotFound`).

---

## 3. Rendering model

**Default = Server Component.** Pages and most sections render on the server to HTML and ship **no JavaScript**. Only interactive leaves are Client Components (`"use client"`):

| Client component | Why it needs the browser |
|---|---|
| `service-configurator.tsx` | Seat slider, option checkboxes, live quote, form submit |
| `mobile-nav.tsx`, `mobile-menu.tsx` | Menu open/close, mega-menu, active link |
| `*-explorer.tsx`, `blog-search.tsx`, `explorer-controls.tsx` | Client-side search / filter / sort of an already-fetched list |
| `faq-accordion.tsx`, `industry-tabs.tsx`, `resources-explorer.tsx` | Open/close, tabs |
| `article-toc.tsx`, `mobile-reading-bar.tsx`, `reading-checklist.tsx` | Scroll-spy, progress, saved checklist |
| `theme-toggle.tsx`, `theme-provider.tsx` | Light/dark switching |
| `floating-lines.tsx` | three.js WebGL backdrop |
| `components/admin/push-toggle.tsx` | Notification permission, service worker |

Rule of thumb: **push `"use client"` as far down the tree as possible.** A page that needs one interactive widget should stay a server component and render that one widget as a client child (see the comment in `solutions/[slug]/page.tsx`: *"The only client boundary on the page"*).

Animations are **CSS scroll-driven** (`animation-timeline: view()`), so a server component animates by adding a class — no JS.

---

## 4. Data flow — reading content

```
 Editor saves in /admin
        │
        ▼
  MongoDB (Payload)
        │   payload.find(...)  — Local API, no HTTP
        ▼
  lib/cms/<collection>.ts     "use cache" · cacheLife("hours") · cacheTag("<collection>")
        │   maps Payload docs → flat, typed frontend shapes (BlogCard, ServiceDetail…)
        ▼
  app/(frontend)/<route>/page.tsx   (Server Component)
        │   passes plain props
        ▼
  components/sections/...     render HTML; client explorers filter in-memory
```

### Conventions in every `lib/cms/*.ts` reader

- `where: { status: { equals: "published" } }` — drafts never reach the site.
- `depth: 0` unless a relationship (image, author) must be populated.
- `pagination: false` — skips a count query nobody reads.
- `select: { ... }` — fetch only the fields the caller renders.
- Return **flat shapes** (`{ title, slug, stats: [...] }`), never raw Payload documents, so components don't depend on CMS structure.
- Normalise empties: Payload arrays are `null` (never filled) or `[]` (cleared) — both become `[]` and the section hides itself.

### Fallback content

Industries have rich built-in copy in `lib/content/industries.ts` (`INDUSTRY_CONTENT`). If a CMS field is empty, the code falls back to that copy (`orFallback()` in `lib/cms/industries.ts`). **A CMS value always wins.**

---

## 5. Caching & freshness

`next.config.mjs` enables `cacheComponents`. Every reader in `lib/cms/` is cached with `cacheLife("hours")` and tagged by collection.

| Collection | Cache tag | When does an admin edit appear on the site? |
|---|---|---|
| `blog-posts` | `blog-posts` | **Next visit** — `afterChange`/`afterDelete` hooks call `revalidateTag("blog-posts", "max")` |
| `users` (profile/avatar) | `blog-posts` | Next visit (bylines on blog posts) |
| `services` | `services` | When the cache window expires (up to ~1 hour) or on redeploy |
| `industries` | `industries` | Same as above |
| `case-studies` | `case-studies` | Same as above |
| `guides` / `tools` / `faqs` | `guides` / `tools` / `faqs` | Same as above |

> **The exception that matters:** the quote submission reads prices **uncached** (`getServicePricingForSubmission`), so a stored quote always uses the current rates even if the page showed a cached one.

Detail pages use `generateStaticParams()` to prerender one page per published slug at build time. The code comments for `/solutions/[slug]` and `/industries/[slug]` note that **brand-new slugs may need a redeploy** to appear; blog articles are designed to render on first request.

If you want instant updates for another collection, copy the `revalidateBlog()` pattern from `collections/BlogPosts.ts` (see [10 · Prompting Guide](./10-prompting-guide.md#example-prompts-for-this-project)).

---

## 6. Data flow — writing a lead

```
Visitor fills configurator on /solutions/secure-365
        │  <form action={submitServiceRequest.bind(null, slug)}>
        ▼
app/(frontend)/solutions/[slug]/actions.ts   ("use server")
   1. Honeypot check (hidden "website" field)
   2. Trim, cap length, validate name / email / company
   3. Load pricing UNCACHED from the database
   4. buildQuote() — recompute every price server-side (browser figures ignored)
   5. payload.create({ collection: "service-requests", ... })   ← Local API bypasses access
        │
        ▼
collections/ServiceRequests.ts  afterChange hook (operation === "create")
        │
        ▼
lib/notify/service-request.ts   notifyNewServiceRequest()
   ├── Email  → NOTIFY_EMAIL_TO via SMTP     (skipped if not configured)
   └── Push   → every row in push-subscriptions via web-push
               (dead subscriptions 404/410 are pruned)
        │
        ▼
Staff see it at /admin → Sales → Service Requests (status: New)
```

Full details: [07 · Business Logic](./07-business-logic.md).

---

## 7. Client-side UI state

`lib/store/index.ts` is a Zustand store holding **browsing state only** — search text, active filter, open FAQ item, resources tab, case-study sort/view, blog sort. Never content.

- Persisted to `sessionStorage` under the key `mstack:ui` (schema `version: 2`, with a `migrate` function).
- Created with `skipHydration: true`; `StoreHydrator` rehydrates after mount to avoid hydration mismatches.
- Components read through **atomic selectors** (`useExplorerQuery(key)`, `useBlogSort()`…) and dispatch through `useUIActions()`, whose identity never changes.

Adding new UI state: add the field + action to the store, add a selector, add it to `partialize` if it should survive refresh, and bump `version` + `migrate` if you change the shape of persisted data.

---

## 8. The admin (Payload) customisations

Configured in `payload.config.ts` → `admin`:

| Customisation | File |
|---|---|
| Brand logo / icon | `components/admin/brand-logo.tsx`, `brand-icon.tsx` |
| Sidebar brand lockup | `components/admin/brand-nav.tsx` (`beforeNavLinks`) |
| Pipeline summary on the dashboard | `components/admin/dashboard-welcome.tsx` (`beforeDashboard`) |
| Push-notification toggle | `components/admin/push-toggle.tsx` (inside the dashboard welcome) |
| Account avatar (top right) | `components/admin/account-avatar.tsx` |
| Table cells with photos | `components/admin/people-cell.tsx`, `user-name-cell.tsx` |
| Dark theme overrides | `app/(payload)/custom.scss` |

Admin components are referenced **by string path** (e.g. `"/components/admin/brand-logo#BrandLogo"`) and resolved through the generated `app/(payload)/admin/importMap.js`. After adding one, regenerate the import map (see [08 · Development Workflow](./08-development-workflow.md)).

Sidebar order = order of the `collections` array in `payload.config.ts`, grouped by each collection's `admin.group`: **Sales → Website → Resources → System**.
