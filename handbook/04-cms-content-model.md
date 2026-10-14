# 04 · CMS & Content Model

All editable content lives in **Payload CMS** collections, stored in MongoDB. Each collection is defined in `collections/<Name>.ts` and registered in `payload.config.ts`. Generated types for every document are in `payload-types.ts`.

---

## Collections at a glance

| Sidebar group | Collection | Slug | Public read? | Powers | Instant refresh on save? |
|---|---|---|---|---|---|
| **Sales** | Service Requests | `service-requests` | ❌ staff only | The leads inbox | n/a (not on site) |
| **Sales** | Services | `services` | ✅ | `/solutions`, `/solutions/[slug]`, homepage levels | ❌ cache window |
| **Website** | Industries | `industries` | ✅ | `/industries`, `/industries/[slug]` | ❌ cache window |
| **Website** | Case Studies | `case-studies` | ✅ | `/case-studies`, `/case-studies/[slug]`, industry pages | ❌ cache window |
| **Resources** | Blog Posts | `blog-posts` | ✅ | `/blog`, `/blog/[slug]` | ✅ yes |
| **Resources** | Guides | `guides` | ✅ | `/resources` → Guides tab | ❌ cache window |
| **Resources** | Tools | `tools` | ✅ | `/resources` → Tools tab | ❌ cache window |
| **Resources** | FAQs | `faqs` | ✅ | Homepage FAQ + `/resources` → FAQ tab | ❌ cache window |
| **System** | Media | `media` | ✅ | Every uploaded image | — |
| **System** | Users | `users` | ❌ signed-in | Dashboard accounts + blog bylines | ✅ (blog bylines) |
| **System** | Push Devices | `push-subscriptions` | ❌ signed-in | Browsers receiving lead alerts | n/a |

"Public read" means the REST API (`/api/<slug>`) returns documents to anyone. The site itself never uses the REST API — it reads through the Local API in `lib/cms/`.

---

## Shared conventions

Almost every content collection follows the same patterns. Keep new collections consistent with them.

| Convention | How it works |
|---|---|
| **`status`** (`draft` / `published`) | Sidebar field, default `draft`. The site only ever queries `published`. |
| **`slug`** | Unique, indexed, validated `^[a-z0-9]+(?:-[a-z0-9]+)*$` (lowercase, hyphens). Becomes the URL. |
| **`order`** | Number, lower first. Used where editors control sort order (industries, services, FAQs). |
| **`publishedDate`** | Date, default today. Drives newest-first sorting. |
| **Unnamed tabs in page order** | Long forms are split into tabs labelled `1 · Hero`, `2 · Challenges`… matching the page top to bottom. Unnamed tabs are presentation only — fields stay at the document root, so reorganising tabs needs **no data migration**. |
| **"Listing & SEO" tab** | `summary` (card text + meta description, aim for 150–160 chars) and card-only fields. |
| **Field descriptions** | Every field has an `admin.description` written for a non-technical editor. Write new ones the same way. |
| **`admin.preview`** | Services, Industries and Case Studies have a "Preview" button linking to the live page. |

---

## Services (`services`)

One document = one `/solutions/[slug]` page **with its own price configurator**.

| Tab / area | Fields |
|---|---|
| Sidebar | `slug`, `kind` (`level` = service ladder / `addon` = add-on service), `status`, `order` |
| 1 · Hero | `title`*, `tagline` (pill, e.g. "The Shield"), `headline` (Enter = line break), `valueProp`*, `stats[]` (max 3: value + label) |
| 2 · What's Included | `includes[]`* (title + description) — numbered cards |
| 3 · Outcomes | `outcomes[]` (title + description) |
| 4 · Pricing | `pricingMode` (`per-seat` / `quote`), `currency` (GBP/USD/EUR/AED), `seatBands[]` (minSeats, maxSeats — blank = "and above", pricePerSeat, label), `setupFee`, `setupFeeWaivedAtSeats`, slider `minSeats` / `maxSeats` / `defaultSeats`, `billingNote` |
| 5 · Options | `options[]`: name, description, `priceType` (`per-seat-monthly` / `monthly-flat` / `one-time`), `amount`, `defaultSelected` |
| 6 · FAQ | `faqs[]` (question + answer) |
| 7 · Closing CTA | `ctaHeadline`, `ctaSubtext` (defaults provided if blank) |
| Listing & SEO | `summary`*, `bestFor`, `highlights[]` (max 6 chips) |

\* required. Seat-band fields are hidden when `pricingMode = quote`.

**Changing a rate here changes the next quote immediately** — the submit action reads prices uncached.

## Service Requests (`service-requests`)

The **leads inbox**. One document per configurator submission. See [07 · Business Logic](./07-business-logic.md#2-quote-submission-flow).

| Area | Fields | Editable? |
|---|---|---|
| Sidebar | `status`: New → Reviewing → Contacted → Proposal Sent → Won / Lost; `owner` (a user) | ✅ |
| 1 · Contact | `fullName`, `workEmail`, `companyName`, `jobTitle`, `phone`, `preferredStart`, `message` | 🔒 read-only |
| 2 · Configured Plan | `service` (relation), `serviceTitle`, `serviceSlug` (snapshots), `seats`, `bandLabel`, `currency`, `estimatedMonthly`, `estimatedOneTime`, `priceOnApplication`, `selectedOptions[]`, `quoteBreakdown[]` | 🔒 read-only |
| 3 · Internal | `internalNotes` ✅, `sourcePath` 🔒 | partly |

Access: `create: () => false` (REST API cannot create — only the server action via Local API can), read/update/delete for signed-in users. Default sort: newest first.

## Industries (`industries`)

One document = one `/industries/[slug]` page.

| Tab | Fields |
|---|---|
| Sidebar | `slug`, `status`, `order` |
| 1 · Hero | `title`* (sector name), `headline`, `valueProp`, `stats[]` (max 3) |
| 2 · Challenges | `challenges[]` (title + description) — pain points |
| 3 · What We Solve | `solutions[]`* (min 1) — numbered cards |
| 4 · Your Toolkit | `tools[]`: name, category, `whatItIs`, `whyYouNeedIt`. First 4 names appear as chips on the hub card |
| 5 · Outcomes | `outcomes[]` |
| 6 · Closing CTA | `ctaHeadline`, `ctaSubtext` |
| Listing & SEO | `summary`* |

Empty optional fields fall back to built-in copy in `lib/content/industries.ts`.

## Case Studies (`case-studies`)

| Tab | Fields |
|---|---|
| Sidebar | `slug`, `status`, `publishedDate`, `createdBy` (author) |
| 1 · Overview | `client`*, `industry`* (fixed list = `SITEMAP_INDUSTRY_TITLES`), `headline`, `summary`, `heroImage`, `logo`, `facts[]` (max 4 "At a glance") |
| 2 · Challenge | `challenge`*, `challengePoints[]` |
| 3 · What We Did | `result`*, `approach[]` (numbered steps), `approachImage`, `toolsUsed[]` |
| 4 · Results | `stat`* (headline metric: value + label), `metrics[]` (max 4), `gallery[]` (max 6: image + caption) |
| 5 · Client Quote | `quote` group: text, author, role (section hidden if blank) |

Only the original six fields are required; every richer section simply doesn't render until filled in. The `industry` value is what links a case study to its industry page — an exact title match.

## Blog Posts (`blog-posts`)

| Field | Notes |
|---|---|
| `title`*, `slug`*, `excerpt`* | Excerpt is the card text, subtitle, and meta description |
| `tag`* | Security · SharePoint · Automation · Power Platform · Migration · General — drives /blog filters and topic cards |
| `keyTakeaways[]` ("In 30 seconds") | Up to 5 one-liners in a summary box |
| `body` | Lexical rich text. **H2/H3 build the table of contents.** `+` menu / `/` inserts blocks (below) |
| `coverImage` | Upload → media |
| `author` group ("Byline") | name, role, bio, linkedin — auto-filled from the author's account |
| `mentions[]` | Teammates tagged on the post (shown with photo) |
| `createdBy` | Author account — auto-set to the creator; only managers/admins can reassign |
| `featured` | Pins to "Start with these"; the first featured post gets the large card |
| `status`, `publishedDate` | Sidebar |

### Blog content blocks (`collections/blog-blocks.ts`)

Each block is rendered in the site's design by `components/sections/blog/blocks/`. **Field names are the stored JSON — don't rename them.**

| Block | Slug | Purpose |
|---|---|---|
| Code | `Code` | Syntax block: PowerShell (default), Bash, JSON, TypeScript, Plain text — with copy button |
| Callout | `Callout` | Note / Tip / Warning / Success aside |
| Steps | `Steps` | Numbered procedure — grid or timeline; optional highlighted final step |
| Interactive checklist | `Checklist` | Reader can tick items; progress saved in their browser |
| Table | `ComparisonTable` | Up to 5 columns, highlight a column, yes/no/partial icons, mobile stack or scroll |
| Pros & cons | `ProsCons` | Two lists |
| Key numbers | `Stats` | Up to 4 big figures |
| FAQ | `FAQ` | Q&A list — **also emitted as FAQPage structured data for Google** |
| Pull quote | `PullQuote` | Quote + attribution |
| Call to action | `InlineCTA` | Title, text, button label, link (default `/contact`) |
| YouTube video | `Video` | URL + accessible title + caption |

The editor also has a fixed toolbar and tables (`EXPERIMENTAL_TableFeature`).

## Guides / Tools / FAQs

| Collection | Key fields | Tags / categories |
|---|---|---|
| `guides` | title, slug, description, tag, `downloadUrl` (card hides the link if blank) | Security · Migration · Power Platform · Governance · General |
| `tools` | title, slug, description, tag, `url` | Calculator · Assessment · Scorecard · General |
| `faqs` | question, answer (always visible), `points[]`, category, `order` | General · Security · Industries · Pricing · Support |

## Media (`media`)

- Single required field: `alt` (accessibility text).
- Images only (`image/*`). Every upload is resized to max **2560 px** wide (never enlarged) and converted to **WebP quality 80** by sharp, on the server, before storage.
- Stored on **UploadThing** when `UPLOADTHING_TOKEN` is set (direct CDN URLs); otherwise in the local `media/` folder (gitignored, not persistent on Vercel).
- Max upload on Vercel ≈ **4.5 MB** (function request body limit).

## Users (`users`) & roles

Auth-enabled — powers `/admin` login. Profile fields double as the public blog byline.

| Field | Notes |
|---|---|
| `name` | Required on create. Shown as author |
| `avatar` ("Photo") | Shown in the account icon, tables and blog posts. Initials until set |
| `role` | `admin` / `manager` / `editor` (default `editor`); stored in the JWT |
| `jobTitle`, `bio`, `linkedin` | Used for the blog "Written by" box |

### Permission matrix (`collections/access.ts`)

| Action | Administrator | Manager | Editor |
|---|---|---|---|
| Create / edit content | ✅ | ✅ | ✅ |
| Create accounts | ✅ any role | ✅ manager or editor | ❌ |
| Edit accounts | ✅ anyone | non-admins + self | self only |
| Delete accounts | anyone except self | non-admins, not self | ❌ |
| Change roles | ✅ | ✅ (not to/from admin) | ❌ |
| Reassign an article's author | ✅ | ✅ | ❌ |

Safety rules enforced in code:
- The **first account ever created** is always an Administrator.
- The **last Administrator** cannot be demoted.
- On startup, if no admin exists, the oldest account is promoted (`backfillAdminRole` in `payload.config.ts`).

## Push Devices (`push-subscriptions`)

One row per browser that turned on lead alerts: `endpoint` (unique), `p256dh`, `auth` (encryption keys), `label` ("Chrome on Windows"), `user`. Created by the dashboard toggle — don't add rows by hand. Delete a row to stop alerts to that device. Expired rows are pruned automatically.

---

## Changing the schema safely

1. Edit `collections/<Name>.ts`.
2. Run `pnpm generate:types` to refresh `payload-types.ts`.
3. Update the matching reader in `lib/cms/` and the component that renders it.
4. If the field should appear in seed data, update `lib/seed/`.
5. MongoDB is schemaless — adding optional fields needs no migration. **Renaming or removing** a field leaves old data under the old key; plan a migration script if the data matters.
6. Adding a **required** field to a collection with existing documents makes those documents fail validation on their next save — prefer optional + a fallback.
