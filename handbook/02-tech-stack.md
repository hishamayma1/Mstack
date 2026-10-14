# 02 · Tech Stack

Versions are taken from `package.json`. When in doubt, `package.json` and `pnpm-lock.yaml` win over this document.

## At a glance

```
┌──────────────────────────── Browser ────────────────────────────┐
│ React 19 · Tailwind CSS 4 · CSS Modules · next-themes · Zustand │
└────────────────────────────────┬────────────────────────────────┘
                                 │
┌──────────────────────── Next.js 16 (App Router) ────────────────┐
│ Server Components · Server Actions · "use cache" (Cache Comp.)  │
│                                                                 │
│   (frontend) marketing site        (payload) /admin + /api      │
│                     └───── Payload CMS 3.88 ─────┘              │
└───────┬──────────────────┬──────────────────┬───────────────────┘
        │                  │                  │
   MongoDB Atlas      UploadThing CDN    SMTP (M365) + Web Push
   (all content)      (media files)      (lead alerts)
                                 │
                        Hosted on Vercel (+ Vercel Analytics)
```

---

## Core framework

| Technology | Version | Role | Notes |
|---|---|---|---|
| **Next.js** | `^16.3` | Web framework, routing, rendering, caching | ⚠️ Next 16 has breaking changes vs. most tutorials and AI training data. Read `node_modules/next/dist/docs/` before using an API you're not sure about. |
| **React** | `19` | UI library | Server Components by default; `useActionState` for the quote form. |
| **TypeScript** | `^5` | Language | `strict: true`. Path alias `@/*` → project root, `@payload-config` → `payload.config.ts`. |
| **Turbopack** | (bundled) | Dev bundler | Default in Next 16. |

### Next.js 16 features in active use

| Feature | Where | Why |
|---|---|---|
| `cacheComponents: true` | `next.config.mjs` | Enables `"use cache"` so CMS reads are cached across pages and requests. |
| `"use cache"` + `cacheLife()` + `cacheTag()` | `lib/cms/*.ts`, `components/layout/site-footer.tsx` | Read each collection once, reuse everywhere, invalidate by tag. |
| `revalidateTag(tag, "max")` | `collections/BlogPosts.ts`, `collections/Users.ts` | Publish in admin → blog updates on next visit. |
| `experimental.globalNotFound` | `next.config.mjs`, `app/global-not-found.tsx` | Branded 404 for unmatched URLs (needed because there are two root layouts). |
| `connection()` + `export const instant = false` | `app/(payload)/layout.tsx` | Opts the admin out of prerendering. |
| Error boundary `retry()` prop | `app/(frontend)/error.tsx` | Next 16 naming (not `reset`). |
| Multiple root layouts | `app/(frontend)/layout.tsx`, `app/(payload)/layout.tsx` | Site and admin have independent `<html>`. |

## Content & data

| Technology | Version | Role |
|---|---|---|
| **Payload CMS** | `3.88.0` | Headless CMS + admin UI + auth + REST/GraphQL API, running *inside* Next.js. |
| `@payloadcms/db-mongodb` | `3.88.0` | Mongoose adapter — content is stored in **MongoDB** (Atlas). |
| `@payloadcms/richtext-lexical` | `3.88.0` | Lexical rich-text editor for blog bodies (with custom blocks). |
| `@payloadcms/storage-uploadthing` | `3.88.0` | Stores uploaded images on the **UploadThing** CDN (Vercel's disk isn't persistent). |
| `@payloadcms/email-nodemailer` | `3.88.0` | Sends email via SMTP (Microsoft 365 by default). |
| `@payloadcms/next`, `@payloadcms/ui` | `3.88.0` | Next.js integration and admin UI components. |
| **sharp** | `^0.34` | Converts every upload to compressed **WebP** (max 2560 px wide) before storage. |
| **graphql** | `^16.8` | Required by Payload's GraphQL endpoint. |

> **All Payload packages must stay on the exact same version.** Upgrade them together.

## Styling & UI

| Technology | Version | Role |
|---|---|---|
| **Tailwind CSS** | `^4.2` | Utility classes. v4 is configured *in CSS* (`@theme inline` in `globals.css`) — there is **no `tailwind.config.js`**. |
| `@tailwindcss/postcss` | `^4.2` | PostCSS plugin (`postcss.config.mjs`). |
| **CSS Modules** | — | `*.module.css` next to components for complex effects (motion, intro, nav, configurator). |
| **next-themes** | `^0.4.6` | Light/dark mode via a `.dark` class on `<html>`. Default: light. |
| **three.js** | `0.180.0` | 3D/WebGL decorative background (`components/ui/floating-lines.tsx`). |
| **Google Fonts** via `next/font` | — | Geist, Geist Mono, IBM Plex Sans, Courier Prime. |

No component library (no shadcn, no MUI). Every UI primitive lives in `components/ui/`.

## State & interactivity

| Technology | Version | Role |
|---|---|---|
| **Zustand** | `^5.0` | Small UI store (`lib/store/index.ts`) for browsing state: search queries, filters, open FAQ, tabs, sort order. Persisted to `sessionStorage`. Holds **no content**. |
| `@faceless-ui/modal`, `@faceless-ui/scroll-info` | — | Peer dependencies used by Payload's admin. |

## Notifications

| Technology | Version | Role |
|---|---|---|
| **web-push** | `^3.6.7` | Sends browser push notifications using VAPID keys (free — delivered by browser vendors). |
| `public/sw.js` | — | Minimal service worker: shows the notification and opens the lead on click. **No fetch caching.** |
| Nodemailer (via Payload) | — | Email alerts for new leads. |

## Hosting & tooling

| Technology | Role |
|---|---|
| **Vercel** | Hosting. Pushing to `main` deploys to production. |
| `@vercel/analytics` | Page-view analytics (`<Analytics />` in the frontend layout). |
| **pnpm** | Package manager (`pnpm-lock.yaml`). Don't mix with npm/yarn. |
| **tsx** | Runs TypeScript scripts directly (`scripts/seed-blog.ts`). |
| **MongoDB Atlas** | Hosted database. |
| **UploadThing** | Media CDN. |

## Deliberate "not used" choices

| Not used | Why |
|---|---|
| Next.js image optimizer | Disabled (`images.unoptimized: true`) — Vercel's optimizer hit its quota and returned 402s. Images are pre-compressed to WebP on upload instead. |
| Edge runtime | Everything runs on the default Node.js runtime. |
| Client-side data fetching (SWR/React Query) | Content is server-rendered and cached; the client never fetches content. |
| A JS animation library (Framer Motion, GSAP) | Animations are CSS scroll-driven (`animation-timeline: view()`) — zero JavaScript. |
| `localStorage` for UI state | `sessionStorage` instead — last week's filter is confusing; five minutes ago is useful. |
