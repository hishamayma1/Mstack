# 05 · Features

Every feature, described from the visitor's side and the staff side, with the files that implement it.

---

## F1 · Service price configurator

**Where:** every `/solutions/[slug]` page, in the middle section.

**Visitor experience**
1. Drag a **seat slider** (headcount) — bounded by the service's min/max, starting at its default.
2. Tick **optional add-ons** (some may be pre-ticked).
3. See a **live itemised quote**: band rate × seats, setup fee (or "waived"), each option, monthly total and one-time total, plus the billing small print.
4. Fill in name, work email, company (required), job title, phone, preferred start, message.
5. Submit → inline success or inline field errors. No page reload.

For services set to **"Price on application"**, the same form collects headcount and options but shows **no figures**; it submits as a scoping request.

**Staff side:** the submission appears in `/admin → Sales → Service Requests` as **New**, with the exact quote the visitor saw (recomputed on the server).

**Files:** `components/sections/services/service-configurator.tsx` (+ `.module.css`), `lib/pricing.ts`, `app/(frontend)/solutions/[slug]/actions.ts`, `lib/service-request-state.ts`.

Under the hood: [07 · Business Logic §1–2](./07-business-logic.md).

---

## F2 · Service pages & the Solutions hub

- `/solutions` shows the **5-level ladder** (`kind: level`) then the **add-on services** (`kind: addon`), sorted by `order`. Cards show tagline, summary, "Best for", highlight chips and a **"from £X/user"** price (cheapest band; hidden for price-on-application).
- `/solutions/[slug]`: Hero (with stats and from-price) → What's Included → Outcomes → **Configurator** → Seat bands table → FAQ → Other services → Closing CTA.
- Each service has its **own accent colour** (`data-svc` theme, see [06 · Design System](./06-design-system.md#3-per-service-accent-themes)).

**Files:** `app/(frontend)/solutions/`, `components/sections/services/`, `components/sections/solutions/`, `lib/cms/services.ts`, `lib/service-theme.ts`.

---

## F3 · Lead alerts (email + browser push)

When a quote request is saved:
- **Email** to every address in `NOTIFY_EMAIL_TO` — subject like *"New quote request — Acme Ltd (£560/mo)"*, a dark branded summary table, an **Open in dashboard** button, and the visitor's email for direct reply.
- **Browser push** to every device that turned alerts on — *"New request — Acme Ltd"* / *"Secure 365 · 25 users · £560/mo"*. Clicking it opens that lead in the dashboard. It stays on screen until dismissed.

Turning push on: `/admin` dashboard → **Browser alerts → Turn on** → accept the browser prompt. The device then appears under **System → Push Devices**.

Failures never lose a lead: if SMTP or push fails, the request is still saved and the error is logged.

**Files:** `lib/notify/service-request.ts`, `collections/ServiceRequests.ts` (hook), `collections/PushSubscriptions.ts`, `components/admin/push-toggle.tsx`, `public/sw.js`. Setup: [`ENVIRONMENT.md`](../ENVIRONMENT.md).

---

## F4 · Admin dashboard pipeline

The `/admin` home shows, above the standard collection cards, a **pipeline summary** — **New requests**, **In progress**, **Won**, and **Draft services** — each linking straight into the filtered list, plus the push toggle. Counts are best-effort: a failed count shows `0` rather than breaking the dashboard.

**Files:** `components/admin/dashboard-welcome.tsx`, `payload.config.ts` (`beforeDashboard`).

---

## F5 · Blog

**`/blog` index**
- Hero with **instant search** across titles, tags and excerpts, and popular topics.
- **"Start with these"** — featured posts (first featured = large card).
- **Topic cards** with post counts.
- **Explorer** — filter by tag, sort (newest / oldest / title), search, "load more" paging (9 at a time). Filter state survives refresh (session).

**`/blog/[slug]` article**
- Reading-progress bar (pure CSS scroll timeline).
- Hero: tag, title, excerpt, author, date, reading time (≈ 220 words/min, counted across text *and* blocks).
- **"In 30 seconds"** key-takeaways box.
- **Table of contents** built from H2/H3 headings — sticky sidebar on desktop, a reading bar on mobile, with scroll-spy.
- Rich body with all [content blocks](./04-cms-content-model.md#blog-content-blocks-collectionsblog-blocksts).
- Share buttons, aside CTA, **author card** (photo, role, bio, LinkedIn), **mentioned teammates**, previous/next, related posts (same topic first).
- **SEO**: `BlogPosting` + `BreadcrumbList` structured data, plus `FAQPage` when the article has FAQ blocks; OpenGraph/Twitter cards.

**Editor experience:** the author byline fills itself from the creator's profile; publishing makes the change live **on the next visit**.

**Files:** `app/(frontend)/blog/`, `components/sections/blog/`, `lib/cms/blog.ts`, `collections/BlogPosts.ts`, `collections/blog-blocks.ts`, `collections/author.ts`.

---

## F6 · Case studies

- `/case-studies`: hero, an **impact** strip derived from the published studies (counts, sectors covered — never hard-coded), then an **explorer** — search, filter by industry, sort (newest / client / industry), **grid or list view** (remembered for the session). Testimonials marquee and final CTA.
- `/case-studies/[slug]`: hero with headline + hero image + "At a glance" facts → Where They Started (challenge + points) → What We Did (numbered approach + image + tool chips) → The Results (headline stat + metrics + gallery) → client quote → related studies (same industry first).
- Sections with no content are **not rendered** (no empty placeholders).
- Industry pages automatically list case studies whose `industry` matches.

**Files:** `app/(frontend)/case-studies/`, `components/sections/case-studies/`, `lib/cms/case-studies.ts`.

---

## F7 · Industries

- `/industries`: grid of sectors with summary, tool chips and solution count.
- `/industries/[slug]`: Hero + stats → **sticky sub-nav** (only lists sections that actually rendered) → Challenges → What We Solve → **Your Toolkit** (Microsoft tools with "what it is / why you need it") → How It Works walkthrough → Outcomes → matching Case Studies → Other sectors → CTA.
- Missing CMS fields fall back to built-in sector copy.

**Files:** `app/(frontend)/industries/`, `components/sections/industries/`, `lib/cms/industries.ts`, `lib/content/industries.ts`, `lib/content/industry-media.ts`.

---

## F8 · Resources

`/resources` — a tabbed explorer: **Guides & Checklists** (download links), **FAQ** (filter by category, accordion), **Tools** (links to calculators/assessments). Each tab has its own search + tag filter; only the selected tab is mounted. Selected tab and filters persist for the session.

**Files:** `app/(frontend)/resources/page.tsx`, `components/sections/resources/`, `lib/cms/resources.ts`.

---

## F9 · Homepage

A server-rendered funnel (see [01 · Overview](./01-project-overview.md#the-homepage-funnel)). Dynamic parts: service levels and FAQs from the CMS. Everything else is copy in `lib/content/site.ts`, `lib/content/home-media.ts` and `lib/content/app-logos.ts`.

Notable pieces: CSS-only **intro animation** spelling "MSTACK360" (`components/ui/intro-animation.tsx`), Microsoft product **logo trust bar**, **industry tabs** carousel that auto-advances, **FAQ accordion**, **Health Check** lead magnet (`#health-check`).

---

## F10 · About, Contact, Legal

| Page | Content | Source |
|---|---|---|
| `/about` | Our story timeline, team (photos in `public/team/`), partners, careers, testimonials | `lib/content/site.ts` (`OUR_STORY`, `TEAM`, `PARTNERS`, `CAREER_OPENINGS`, `TESTIMONIALS`) |
| `/contact` | Contact methods + embedded **Microsoft Bookings** iframe | `CONTACT_METHODS`; booking URL constant in `components/sections/contact/contact-section.tsx` |
| `/legal` | Privacy, Terms, Cookies with anchors `#privacy-policy` etc. | `LEGAL_DOCS` |

These pages are **code-edited, not CMS-edited.**

---

## F11 · Navigation & layout

- **Fixed top nav** with mega-menus (`NAV_MENUS`), mobile slide-in menu, active-link state, and theme toggle — `components/layout/mobile-nav.tsx`, `mobile-menu.tsx`.
- **Footer** with grouped link columns (`FOOTER_COLUMNS`) — cached server component.
- **Floating actions** — a persistent "Contact us" pill and a back-to-top button that appears after 600 px of scrolling — `floating-actions.tsx`.
- **PageShell** wraps every non-home page: nav + fade-in content + floating actions + footer.

---

## F12 · Light / dark theme

- Toggle in the nav. **Defaults to light** for first-time visitors; choice saved in `localStorage` by next-themes.
- Smooth colour cross-fade on toggle (disabled for the first paint and for reduced-motion users).
- The admin is always dark.

**Files:** `components/providers/theme-provider.tsx`, `components/ui/theme-toggle.tsx`, `globals.css`.

---

## F13 · Session-persistent browsing state

Search boxes, filters, open FAQ, active tabs, sort order and grid/list view survive a refresh or navigating away and back — for the browser session only. See [03 · Architecture §7](./03-architecture.md#7-client-side-ui-state).

---

## F14 · Error & 404 pages

- `notFound()` from a page → `app/(frontend)/not-found.tsx` (full shell, suggestions).
- Unmatched URL → `app/global-not-found.tsx` (branded, dark).
- Render error → `app/(frontend)/error.tsx` with **Try Again** (`retry()`) and an error reference digest.
- Unknown slugs also get a "Page Not Found" `<title>` and `noindex`.

---

## F15 · Automatic seed content

A fresh, empty database is filled on first start with real starter content for services, industries, case studies, blog posts, guides, tools and FAQs (`lib/seed/`). Collections that already contain anything are never touched. Service Requests are never seeded.

---

## F16 · Media pipeline

Upload any image in the dashboard → it's resized (≤2560 px), converted to WebP, and stored on the UploadThing CDN. Reuse it anywhere. See [04 · CMS](./04-cms-content-model.md#media-media).

---

## F17 · Analytics & SEO

- **Vercel Analytics** on every frontend page.
- Per-page `<title>`/description via `metadata` / `generateMetadata`; CMS `summary` / `excerpt` fields are the meta descriptions.
- Structured data on blog articles.
- `noindex` on 404s.
