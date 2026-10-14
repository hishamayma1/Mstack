# 11 · Troubleshooting

Symptom → likely cause → fix. If you're asking an AI for help, paste the symptom row and the exact error message (see [10 · Prompting Guide §5.7](./10-prompting-guide.md#57-fix-a-bug)).

---

## Content & admin

| Symptom | Likely cause | Fix |
|---|---|---|
| I edited a service / industry / case study / FAQ in `/admin` but the site still shows the old version | Cached for up to ~1 hour (`cacheLife("hours")`); only blog posts revalidate instantly | Wait, redeploy, or add a `revalidateTag` hook to that collection ([07 §8](./07-business-logic.md#8-caching-behaviour-summary)) |
| New document doesn't appear on the site at all | `status` is still **Draft** | Set to **Published** |
| New service / industry page returns 404 | Not published, or the slug was added after the last build | Publish it; redeploy if it still 404s |
| Case study doesn't show on its industry page | `industry` doesn't exactly match the industry `title` | Pick the matching industry |
| Blog "On this page" menu is missing | Fewer than 2 H2/H3 headings in the body | Use Heading 2/3 for sections |
| Image upload fails | File > ~4.5 MB (Vercel request limit) or not an image | Compress / resize before uploading |
| Uploaded images disappear after deploy | `UPLOADTHING_TOKEN` not set, so files went to the ephemeral local disk | Set the token in Vercel and re-upload |
| "You can't give an account the … role" | Managers can't create/promote Administrators | Ask an Administrator |
| "This is the last Administrator…" | Demoting the only admin is blocked | Promote someone else first |
| Can't log in after changing `PAYLOAD_SECRET` | Changing the secret invalidates all sessions | Log in again |

## Leads & notifications

| Symptom | Likely cause | Fix |
|---|---|---|
| Visitor sees "Something went wrong saving your request" | Database write failed | Check server logs for `[service-request] Failed to record submission` |
| "That service is no longer available" | Service unpublished or slug changed | Republish / restore the slug |
| No lead email; terminal shows `Email attempted without being configured` | `SMTP_USER` / `SMTP_PASS` empty | Fill them in ([`ENVIRONMENT.md` §4](../ENVIRONMENT.md)) |
| No lead email, no log line | `NOTIFY_EMAIL_TO` empty (look for `[notify] NOTIFY_EMAIL_TO is not set`) | Set recipients |
| SMTP authentication error | Authenticated SMTP disabled or wrong app password (Microsoft 365) | Follow `ENVIRONMENT.md` §4, or switch to Gmail/Resend |
| "Open in dashboard" link in email goes to localhost | `NEXT_PUBLIC_SERVER_URL` wrong in production | Set to `https://mstack360.com` and **rebuild** |
| No push notifications | Push not turned on for this device, VAPID keys missing, or browser permission denied | Turn on from the dashboard; check `[notify] VAPID keys are not set`; reset site permissions |
| Push worked, then stopped | Subscription expired and was pruned, or VAPID keys were regenerated | Turn alerts on again |
| Push doesn't work on a LAN address (`192.168.x.x:3000`) | Push requires HTTPS (localhost is the only exception) | Test on `localhost` or a deployed URL |
| Leads appear that nobody submitted | Shouldn't happen — REST `create` is closed | Check whether someone used the Local API / a script |

## Development

| Symptom | Likely cause | Fix |
|---|---|---|
| `Could not validate instant` after adding a client component | Stale dev server | Restart `pnpm dev` |
| `module factory is not available` 500s after `pnpm add` | Stale dev server | Restart `pnpm dev` |
| Admin shows a blank/missing custom component | `importMap.js` not regenerated | `pnpm payload generate:importmap`, restart |
| TypeScript errors about a field that exists | `payload-types.ts` out of date | `pnpm generate:types` |
| `pnpm payload run script.ts` does nothing | Known no-op in this setup | `npx tsx --env-file=.env script.ts` |
| `pnpm lint` fails with "eslint not found" | ESLint isn't installed | Add ESLint, or rely on `pnpm build` / `npx tsc --noEmit` |
| Hydration mismatch warning | Rendering browser-only values (storage, `Date.now()`, `Intl` locale) during SSR | Defer to `useEffect`; use `formatMoney`; keep persisted state behind `StoreHydrator` |
| Build error about `new Date()` / uncached data during prerender | Cache Components requires dynamic data to be cached or behind a request boundary | Wrap the read in a `"use cache"` function, or use `await connection()` (see `app/(payload)/layout.tsx`) — check `node_modules/next/dist/docs/` |
| Error importing a constant from `actions.ts` is `undefined` | `"use server"` files only export async functions | Move constants/types to a normal module (like `lib/service-request-state.ts`) |
| Seed didn't run | Collection already had documents | Expected — seeding is empty-only; use `pnpm seed:blog` for blog upgrades |
| Payload count throws inside a hook | Unfiltered `count` isn't allowed in a transaction | Use `find({ limit: 1 })` |
| Test data appeared in production | `.env` points at the live Atlas DB | Use a dev database for experiments; delete the test docs |

## Styling & layout

| Symptom | Likely cause | Fix |
|---|---|---|
| Looks fine in dark mode, invisible in light (or vice versa) | Hard-coded colour | Use tokens (`text-foreground`, `bg-card`…) or `dark:` variants |
| Sticky TOC / sub-nav doesn't stick | An ancestor has `overflow: hidden` | Remove it (see `Section`'s `aurora` note) |
| Animation doesn't play in Firefox | No `animation-timeline` support — by design it shows the final state | Nothing to fix |
| Anchor link scrolls under the fixed nav | Target isn't a `section[id]` (which gets `scroll-margin-top`) | Put the `id` on a `<section>` or add `scroll-margin-top` |
| A new service has an unexpected colour | Not in `BY_SLUG`, so its colour is hashed from the slug | Add it to `lib/service-theme.ts` |
| Images return 402 | Next image optimizer quota | Keep `images.unoptimized: true` |

## Deployment

| Symptom | Likely cause | Fix |
|---|---|---|
| Production hangs on pages that read the DB | Atlas Network Access blocks Vercel IPs | Allow Vercel's IPs (or `0.0.0.0/0` with a strong password) |
| Changed a `NEXT_PUBLIC_*` variable, nothing changed | Baked in at build time | Redeploy |
| Deployment blocked on Vercel | Previously observed with commits carrying a `Co-Authored-By: Claude` trailer | Check with the repo owner; recommit without the trailer if required |
| Accidentally pushed to `main` | `main` = production | Fix forward or roll back in the Vercel dashboard (Deployments → Promote a previous one) |
