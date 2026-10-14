# 08 · Development Workflow

Everything you need to run, change, verify and ship the project.

---

## 1. Prerequisites

| Tool | Version | Check |
|---|---|---|
| Node.js | 22+ (Vercel default is 24 LTS) | `node -v` |
| pnpm | 9+ | `pnpm -v` (install: `npm i -g pnpm`) |
| Git | any | `git --version` |
| A MongoDB database | Atlas or local | — |

Optional: Vercel CLI (`npm i -g vercel`) for `vercel env pull` and deploy logs.

---

## 2. First-time setup

```bash
git clone <repo-url>
cd MStack
pnpm install
cp .env.example .env        # then fill in values — see ENVIRONMENT.md
pnpm dev                    # http://localhost:3000
```

Then open **http://localhost:3000/admin**:
- On an **empty database** you'll see "Create first user" — that account becomes the Administrator, and starter content is seeded automatically.
- On an existing database, ask an Administrator or Manager to create your account.

> ⚠️ **The `.env` in this project points at the live MongoDB Atlas database.** Anything you create, edit or delete locally — including test leads — changes production data. For experiments, use a separate database (`DATABASE_URI=mongodb://127.0.0.1:27017/mstack360-dev` or a second Atlas database).

---

## 3. Environment variables

Full guide: [`../ENVIRONMENT.md`](../ENVIRONMENT.md). Summary:

| Variable | Required | Purpose |
|---|---|---|
| `DATABASE_URI` | ✅ | MongoDB connection string |
| `PAYLOAD_SECRET` | ✅ | Signs admin login tokens (different in production) |
| `NEXT_PUBLIC_SERVER_URL` | ✅ | Absolute links in emails, JSON-LD URLs (no trailing slash) |
| `UPLOADTHING_TOKEN` | prod | Media storage on the UploadThing CDN |
| `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS` | for email | Mail server (Microsoft 365 default) |
| `EMAIL_FROM_ADDRESS`, `EMAIL_FROM_NAME` | for email | Sender |
| `NOTIFY_EMAIL_TO` | for lead emails | Comma-separated recipients |
| `VAPID_PUBLIC_KEY`, `VAPID_PRIVATE_KEY`, `NEXT_PUBLIC_VAPID_PUBLIC_KEY`, `VAPID_SUBJECT` | for push | Browser push identity |

Rules: never commit `.env`; restart `pnpm dev` after editing it; `NEXT_PUBLIC_*` values are public and baked in at build time.

---

## 4. Scripts

| Command | What it does |
|---|---|
| `pnpm dev` | Start the dev server (site + admin) on port 3000 |
| `pnpm build` | Production build — **the main correctness check** (type errors, prerender errors, cache-component violations) |
| `pnpm start` | Serve the production build |
| `pnpm generate:types` | Regenerate `payload-types.ts` after changing any collection |
| `pnpm payload generate:importmap` | Regenerate `app/(payload)/admin/importMap.js` after adding/renaming an admin component |
| `pnpm seed:blog` | Upgrade blog seed posts in an existing DB (`--overwrite` to replace edited ones) |
| `npx tsc --noEmit` | Type-check without building |
| `pnpm lint` | Runs `eslint .` — note ESLint is **not currently installed** as a dependency, so this fails until it's added |

One-off TypeScript scripts that need the env: `npx tsx --env-file=.env scripts/<file>.ts` (this is how `seed:blog` runs).

---

## 5. Everyday workflows

### Change copy that's in code (homepage, about, nav, footer, legal)
Edit `lib/content/site.ts` (or `home-media.ts`, `app-logos.ts`, `industries.ts`). Components read from there — don't hard-code text in JSX.

### Change content that's in the CMS
Use `/admin`. No code change, no deploy (see caching notes in [07 §8](./07-business-logic.md#8-caching-behaviour-summary)).

### Add a field to a CMS collection
1. Add the field in `collections/<Name>.ts` (with an editor-friendly `admin.description`; optional unless you're sure).
2. `pnpm generate:types`.
3. Add it to the `select` and the mapped shape in `lib/cms/<name>.ts`.
4. Render it in the section component; hide the UI when empty.
5. Optionally add it to `lib/seed/<name>-seed.ts`.
6. `pnpm build`.

### Add a new collection
1. Create `collections/<Name>.ts` following the conventions in [04](./04-cms-content-model.md#shared-conventions) (status, slug, descriptions, group).
2. Register it in `payload.config.ts` `collections` (position = sidebar order).
3. `pnpm generate:types`.
4. Create `lib/cms/<name>.ts` with `"use cache"`, `cacheLife`, `cacheTag`, `status: published`, `select`, flat return types.
5. If editors expect instant updates, add an `afterChange`/`afterDelete` hook calling `revalidateTag("<tag>", "max")` (copy `revalidateBlog` from `BlogPosts.ts`).
6. Optional: seed data + `seedCollection(...)` in `onInit`.

### Add a new page
1. `app/(frontend)/<route>/page.tsx` — a server component wrapped in `<PageShell>`, with `export const metadata` (or `generateMetadata`).
2. Compose sections from `components/sections/<route>/`, built with `Section` / `SectionIntro`.
3. Add it to `NAV_LINKS` / `NAV_MENUS` / `FOOTER_COLUMNS` in `lib/content/site.ts` if it should be linked.
4. Dynamic route? Add `generateStaticParams()` and `generateMetadata()` with the "Page Not Found" + `noindex` branch for unknown slugs, and call `notFound()`.

### Add an admin component
Create it in `components/admin/`, reference it by string path (`"/components/admin/file#ExportName"`) in a collection or `payload.config.ts`, then run `pnpm payload generate:importmap` and restart dev.

---

## 6. Coding conventions

- **Read the Next 16 docs first** (`node_modules/next/dist/docs/`) for any framework API — this version differs from most tutorials (`AGENTS.md`).
- Server Components by default; `"use client"` only on interactive leaves.
- Data access only through `lib/cms/`; components receive plain props.
- Copy in `lib/content/`, not inline.
- Colours from tokens; check light **and** dark.
- Comments explain **why**, not what — match the existing comment style (the codebase documents its decisions thoroughly).
- Kebab-case filenames, named exports, `@/` imports.
- Handle empty CMS data: empty arrays hide their section; never render broken images or empty frames.
- Never trust the browser for prices or permissions.
- A `"use server"` file exports only async functions; shared types/constants go in a normal module.
- Keep `payload-types.ts` and `importMap.js` generated — don't hand-edit.
- All `@payloadcms/*` packages and `payload` on the same exact version.

---

## 7. Verifying a change

Before you consider anything done:

1. `pnpm build` succeeds.
2. The affected pages render in the browser — light and dark, desktop and ~375px mobile.
3. If you touched the configurator: change seats and options, submit, and check the lead in `/admin` (⚠️ live DB — delete test leads afterwards or use a dev database).
4. If you touched a collection: create/edit a document in `/admin` and confirm it appears (published) on the site.
5. No new console errors (hydration warnings especially).

---

## 8. Git & deployment

| Fact | Implication |
|---|---|
| Hosting is **Vercel**, connected to this repo | Pushing to `main` deploys to **production** |
| Other branches / PRs | Get preview deployments |
| `.env` is not deployed | Set variables in Vercel → Project → Settings → Environment Variables; redeploy after changing `NEXT_PUBLIC_*` |
| A Vercel deployment was previously blocked when a commit carried a `Co-Authored-By: Claude` trailer | Check with the repo owner before pushing AI-authored commits straight to `main` |

Recommended flow: branch → commit → push → check the preview URL → merge to `main`.

Production checklist: `NEXT_PUBLIC_SERVER_URL=https://mstack360.com`, a production-only `PAYLOAD_SECRET`, `UPLOADTHING_TOKEN` set, Atlas network access allows Vercel, push requires HTTPS.

---

## 9. Project-specific gotchas

| Gotcha | Fix |
|---|---|
| After adding a client component or a package, dev shows *"Could not validate instant"* or *"module factory is not available"* 500s | Stop and restart `pnpm dev` |
| `pnpm payload run <script>` does nothing | Use `npx tsx --env-file=.env <script>` |
| A failed Payload operation inside a hook/transaction leaves partial writes | Wrap risky calls; don't rely on rollback for test cleanup |
| `payload.count()` with no filter inside a create hook throws | Use `payload.find({ limit: 1 })` instead |
| Images return 402 | Already handled — `images.unoptimized: true`; don't re-enable the optimizer without checking Vercel quota |
| `overflow-hidden` on a wrapper breaks sticky TOC/sub-nav | Remove it or restructure |
| Hydration mismatch with persisted UI state | Store uses `skipHydration` + `StoreHydrator`; keep new persisted state behind the same mechanism |
| Using `Intl.NumberFormat` for prices | Use `formatMoney()` — avoids server/client locale mismatch |
