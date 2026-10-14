# 07 · Business Logic & Behaviour

The rules the system follows, written so you can predict what it will do — and what will break if you change it.

---

## 1. Pricing engine (`lib/pricing.ts`)

A **pure** module: no React, no Payload, no browser APIs. It runs in two places with identical code:

| Where | Why |
|---|---|
| Browser (configurator) | Show the quote live as the visitor drags the slider |
| Server (submit action) | Recompute the quote from the database before storing it |

**The server result is the only one ever stored.** The browser copy exists only so the number moves without a round trip.

### Inputs (from the Services document)

```ts
ServicePricing = {
  mode: "per-seat" | "quote",
  currency: "GBP" | "USD" | "EUR" | "AED",
  bands: { minSeats, maxSeats | null, pricePerSeat, label }[],
  setupFee, setupFeeWaivedAtSeats | null,
  minSeats, maxSeats, defaultSeats,
  billingNote,
  options: { id, name, description, priceType, amount, defaultSelected }[],
}
```

### Algorithm — `buildQuote(pricing, seats, selectedOptionIds)`

1. **Clamp seats** into `[minSeats, maxSeats]`, rounded. Junk input (NaN) → `defaultSeats`.
2. **Filter options** — only ids that exist on the service count. Unknown/stale ids contribute nothing.
3. If `mode === "quote"` → return all totals `0`, `quoteOnly: true`, options listed as "Included in scope".
4. **Find the band**: sort bands by `minSeats`, take the first where `minSeats ≤ seats ≤ maxSeats` (`maxSeats: null` = no upper limit). **If none matches, use the highest band** — pricing at the top rate is safer than pricing at zero.
5. Line: `band.label` → `seats × pricePerSeat` monthly.
6. Line: **Onboarding & setup** one-time `setupFee` — unless `setupFee` is 0, or `seats ≥ setupFeeWaivedAtSeats`.
7. One line per selected option:
   | `priceType` | Monthly | One-time |
   |---|---|---|
   | `per-seat-monthly` | `amount × seats` | 0 |
   | `monthly-flat` | `amount` | 0 |
   | `one-time` | 0 | `amount` |
8. Totals = sums, rounded to 2 decimals.

### Worked example

*Illustrative numbers — check `/admin → Services` for real rates.* A service with bands `1–10 @ £15`, `11–50 @ £12`, `51+ @ £10`; setup £500 waived at 50+; option "Teams Phone" £4/user/month. Visitor: **25 seats**, Teams Phone ticked.

| Line | Monthly | One-time |
|---|---|---|
| 11–50 users — 25 × 12 | £300 | |
| Onboarding & setup | | £500 |
| Teams Phone — 25 × 4 | £100 | |
| **Total** | **£400/mo** | **£500** |

At 60 seats: band 51+ (£600) + Teams Phone (£240) = £840/mo, setup **waived**.

### Formatting

`formatMoney()` formats by hand (symbol + comma grouping + pence only when needed) instead of `Intl.NumberFormat`, because locale data can differ between server and browser and cause hydration errors. `bandRangeLabel()` produces "1–10 users" / "251+ users".

### Sanitising CMS data (`lib/cms/services.ts → toPricing`)

- Slider bounds are reconciled: `min ≥ 1`, `max ≥ min`, `default` clamped into range — so a mis-typed admin value never ships an unusable slider.
- Blank band `maxSeats` stays `null` (= "and above"), never defaulted.
- Blank band label → generated range label.
- Hub card "from" price = cheapest band rate; **hidden** for `quote` mode.

---

## 2. Quote submission flow

`app/(frontend)/solutions/[slug]/actions.ts → submitServiceRequest(slug, prevState, formData)`

| Step | Rule |
|---|---|
| 1. Honeypot | A hidden `website` input. If filled → return **success** silently (bots don't learn they were caught). Nothing is stored. |
| 2. Normalise | Trim, collapse whitespace, cap lengths (name 120, email 160, company 160, title 120, phone 40, message 4000). Email lower-cased. |
| 3. Validate | `fullName`, `workEmail`, `companyName` required; email must match a permissive pattern. Errors return per-field messages shown inline. |
| 4. Load pricing | `getServicePricingForSubmission(slug)` — **uncached**, published services only. Unknown/unpublished → "That service is no longer available." |
| 5. Recompute | `buildQuote()` from DB pricing + submitted `seats` and `options`. Browser totals are ignored. |
| 6. Store | `payload.create({ collection: "service-requests" })` via Local API (bypasses the `create: false` REST rule). Stores contact info, service relation **and** title/slug snapshots, seats, band, currency, totals, chosen options, full line-by-line breakdown, `sourcePath`, status `new`. |
| 7. Respond | Success message, or a generic failure message (details go to the server log only). |

`preferredStart` must be one of `asap`, `1-3-months`, `3-6-months`, `exploring`; anything else is dropped.

**Why snapshots?** If a service is renamed or deleted later, the lead still shows exactly what was quoted.

**Why are lead fields read-only in the admin?** They're a record of what the visitor was shown. Only `status`, `owner` and `internalNotes` are meant to be edited.

`SubmitState` lives in `lib/service-request-state.ts`, not in `actions.ts`, because a `"use server"` file may only export async functions.

---

## 3. Notifications (`lib/notify/service-request.ts`)

Triggered by the `afterChange` hook on `service-requests`, **only on create**, after the document is committed.

```
notifyNewServiceRequest(payload, doc)
  ├── sendEmail  ─┐  Promise.allSettled — each channel independent
  └── sendPush   ─┘  failures are logged, never thrown
```

**Golden rule: a notification failure must never fail the submission.**

### Email
- Recipients: `NOTIFY_EMAIL_TO` (comma-separated). Empty → skipped with a warning.
- No SMTP credentials → Payload logs the email to the console instead of sending (intended dev behaviour).
- Subject: `New quote request — {company} ({money line})`. Money line = `£X/mo + £Y setup`, or "Price on application", or "No estimate".
- HTML is table-based with inline styles so it survives Outlook. All user input is HTML-escaped.
- Link: `{NEXT_PUBLIC_SERVER_URL}/admin/collections/service-requests/{id}`.

### Push
- Requires `VAPID_PUBLIC_KEY` + `VAPID_PRIVATE_KEY`; otherwise skipped.
- Sends to up to 200 rows in `push-subscriptions`.
- Payload: title, body, url, and `tag: service-request-{id}` (repeat alerts replace each other).
- Responses **404/410** → subscription is dead → row deleted. Other errors → logged, retried next time.
- `public/sw.js` shows the notification (`requireInteraction: true`) and on click focuses an existing tab and navigates it, or opens a new one. The service worker **does not cache anything** and is only registered from the admin.

---

## 4. Users, roles & authorship

Roles: **admin > manager > editor** (`collections/access.ts`). Full matrix in [04 · CMS](./04-cms-content-model.md#permission-matrix-collectionsaccessts).

| Behaviour | Where |
|---|---|
| First account ever → admin | `Users` `beforeChange` hook (uses `find`, not `count`, because count isn't allowed inside the create transaction) |
| Can't assign a role you're not allowed to hand out (403) | `role` field `beforeChange` hook + `filterOptions` |
| Can't demote the last admin (400) | same hook |
| No admin on startup → promote role-less accounts, else the oldest | `backfillAdminRole` in `payload.config.ts` `onInit` |
| Author stamped on create (editors can't override) | `stampCreatedBy` in `collections/author.ts` |
| Blog byline filled from author profile; replaced when author is reassigned; hand-typed values otherwise win | `fillBylineFromAuthor` |
| Author photo shown only while the byline still names that account | `getBlogPostBySlug` in `lib/cms/blog.ts` |
| Mentioned people: deduplicated, author excluded, only accounts with a name; only `name/jobTitle/linkedin/avatar` are read (never email/role) | `toPeople` + `populate` in `lib/cms/blog.ts` |
| LinkedIn links must start with `http(s)://` to become links | `safeLink` |

---

## 5. Blog derived data (`lib/cms/blog.ts`)

Computed once on the server, inside the cache:

| Value | Rule |
|---|---|
| Reading time | Words in all text **and** block fields (ignoring settings like `tone`, `url`) ÷ 220, min 1 minute. Falls back to the excerpt. |
| Table of contents | Every top-level H2/H3 → slug id (accents stripped, max 64 chars); duplicates get `-2`, `-3`. The anchor is written onto the node so the heading and TOC link can't drift. TOC shown when ≥ 2 headings. |
| FAQ structured data | Collected from every `FAQ` block in the body |
| Date label | `"Nov 10, 2025"` formatted in UTC (server and client agree) |
| Previous / next | By publish order (newest first list) |
| Related | Same tag first, topped up with most recent; max 3 |
| Default author | "MStack360 Team" (marked as Organization in structured data) |

---

## 6. Case-study & industry relationships

- A case study belongs to an industry by **exact title** match (`industry: "Healthcare"` ↔ industry `title: "Healthcare"`). Both use `SITEMAP_INDUSTRY_TITLES`. If you rename an industry title, update that list and existing case studies.
- Related case studies: same industry (excluding current) → topped up with the newest others, no duplicates, max 3.
- Industry fields that are empty fall back to `INDUSTRY_CONTENT[slug]`, then to `INDUSTRY_CONTENT_FALLBACK`.
- Industry sub-nav only lists sections that have content.

---

## 7. Seeding (`payload.config.ts → onInit`)

On every server start:

1. `backfillAdminRole()`.
2. For each of `case-studies`, `blog-posts`, `guides`, `tools`, `faqs`, `industries`, `services`: if the collection has **zero** documents, insert the seed from `lib/seed/`. Otherwise do nothing.
3. Failures are logged as warnings, never crash the build/dev server (multiple workers may race).

`service-requests` is never seeded — an empty inbox is correct.

To push *updated* blog seed content into an existing database: `pnpm seed:blog` (creates missing seed posts and upgrades untouched ones) or `pnpm seed:blog --overwrite` (also replaces edited seed posts). Posts not in the seed are never touched.

---

## 8. Caching behaviour summary

| Situation | Result |
|---|---|
| Editor publishes/edits a blog post | Visible on next visit (`revalidateTag("blog-posts", "max")`, stale-while-revalidate) |
| Editor updates their profile photo | Blog bylines update on next visit |
| Editor edits a service/industry/case study/FAQ/guide/tool | Visible after the `cacheLife("hours")` window (up to about an hour) or the next deploy |
| Editor changes a price | **Next submitted quote** uses it immediately (uncached read); the page display follows the cache window |
| Draft content | Never shown on the site |
| Hook runs outside a request (seed/CLI) | `revalidateTag` is wrapped in try/catch and silently skipped |

---

## 9. Security posture

| Concern | Mitigation |
|---|---|
| Fake leads via API | `service-requests.create = false` on REST; only the server action writes |
| Spam bots | Honeypot field |
| Price tampering | Server recomputes every figure from the DB |
| Oversized input | Length caps on every field |
| XSS in alert emails | All values HTML-escaped |
| XSS via JSON-LD | `<` escaped to `<` in structured data |
| Private user data leaking to the site | Blog queries `populate` only public profile fields |
| Privilege escalation | Role hooks + field access; last-admin protection |
| Secrets in the browser | Only `NEXT_PUBLIC_*` vars reach the client (server URL, VAPID **public** key) |
| Service worker caching stale pages | `sw.js` has no `fetch` handler |
