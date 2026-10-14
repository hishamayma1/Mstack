# 01 · Project Overview

## What MStack360 is

MStack360 is a **100% Microsoft-native consultancy**. It sets up, secures, migrates, automates and manages Microsoft 365 for small and mid-sized organisations. The website has one job: **turn visitors into qualified leads.**

## What this repository contains

One Next.js application that serves two very different things from the same codebase and the same database:

| Part | URL | Audience | Built with |
|---|---|---|---|
| **Marketing website** | `/`, `/solutions`, `/blog`… | Prospective clients | Next.js App Router, React 19, Tailwind CSS 4 |
| **Dashboard (CMS + sales inbox)** | `/admin` | MStack360 staff | Payload CMS 3 (runs inside Next.js) |
| **API** | `/api/*`, `/api/graphql` | The dashboard itself | Payload REST + GraphQL |

There is no separate backend server. Payload runs inside Next.js and talks to MongoDB.

---

## Business goals the code is built around

1. **Explain the offer clearly** — five progressive service levels plus focused add-ons.
2. **Price transparently** — every service page has a live price calculator driven by real rates from the CMS.
3. **Capture leads, not payments** — the configurator submits a quote request; nobody is charged online.
4. **Respond fast** — new leads trigger an email and a browser push notification within seconds.
5. **Let non-developers run the site** — every price, page, article and FAQ is editable in `/admin`.
6. **Prove credibility** — case studies, industry pages, testimonials, a blog written by the team.

---

## Site map

### Public pages

| Route | Page | Content source | Purpose |
|---|---|---|---|
| `/` | Homepage | Code (`lib/content/site.ts`) + CMS (services, FAQs) | A lead-generation funnel: problem → process → services → proof → offer |
| `/solutions` | Solutions hub | CMS → `services` | The 5-level ladder and the add-on services |
| `/solutions/[slug]` | Service detail | CMS → `services` | Hero, inclusions, outcomes, **price configurator**, seat bands, FAQ |
| `/industries` | Industries hub | CMS → `industries` | Grid of sectors served |
| `/industries/[slug]` | Industry detail | CMS → `industries` (+ code fallbacks) + `case-studies` | Challenges, solutions, Microsoft toolkit, outcomes, matching case studies |
| `/case-studies` | Case studies index | CMS → `case-studies` | Searchable, filterable, sortable; grid or list view |
| `/case-studies/[slug]` | Case study detail | CMS → `case-studies` | Challenge, approach, results, gallery, client quote |
| `/blog` | Blog index | CMS → `blog-posts` | Search, featured posts, topics, filterable list |
| `/blog/[slug]` | Article | CMS → `blog-posts` | Rich article with table of contents, blocks, author, related posts |
| `/resources` | Resources | CMS → `guides`, `tools`, `faqs` | Tabs: Guides & Checklists · FAQ · Tools |
| `/about` | About | Code (`lib/content/site.ts`) | Story, team, partners, careers, testimonials |
| `/contact` | Contact | Code | Contact methods + an embedded **Microsoft Bookings** calendar |
| `/legal` | Legal | Code (`LEGAL_DOCS`) | Privacy, Terms, Cookie policy |
| any unknown URL | 404 | Code | Branded "page not found" (`app/global-not-found.tsx`) |

### Staff pages

| Route | Purpose |
|---|---|
| `/admin` | Dashboard home with a **pipeline summary** (new / in-progress leads) and push-notification toggle |
| `/admin/collections/<slug>` | List and edit any collection |
| `/admin/login` | Sign-in |

---

## The homepage funnel

The homepage is deliberately ordered like a sales conversation (see the comment block in `app/(frontend)/page.tsx`):

```
Intro animation    "MSTACK360" letter reveal (CSS only)
Hero               What we do + the primary ask
Trust bar          Microsoft product logos
Challenges         "Is this you?" — six pain points (cost / risk / time)
Proof              Numbers and client voices
Process            What working with us looks like
Services           The five service levels (from CMS)
Differentiators    Why MStack360
Lead magnet        Free Microsoft 365 Health Check  ← the conversion offer (#health-check)
Industries         Sectors we know
Questions          Real requests + FAQ (from CMS)
Final CTA          The close
```

Rule baked into the design: **only two real calls-to-action on the page.** Other sections end in a quiet link pointing at `#health-check`.

---

## Services offered (seed data)

**Service Levels** (`kind: "level"`) — a progressive ladder:

| Slug | Name | Theme colour |
|---|---|---|
| `core-365` | Core 365 | blue |
| `cloud-365` | Cloud 365 | sky |
| `secure-365` | Secure 365 | emerald |
| `managed-365` | Managed 365 | violet |
| `intelligent-365` | Intelligent 365 | fuchsia |

**Add-On Services** (`kind: "addon"`):

| Slug | Name | Theme colour |
|---|---|---|
| `migration` | Migration | orange |
| `security-compliance` | Security & Compliance | rose |
| `sharepoint-support` | SharePoint Support | teal |
| `teams-phone` | Teams Phone Support | amber |

All of these are editable in `/admin → Sales → Services`. New services automatically get a stable colour.

## Industries served

Healthcare · Banking & Finance · Education · Manufacturing · Retail & Wholesale · Hospitality · Professional Services.

Defined once in `SITEMAP_INDUSTRY_TITLES` (`lib/content/site.ts`) and shared by the Industries and Case Studies collections, so a case study's industry always matches an industry page exactly.

---

## What the site deliberately does **not** do

- **No online payments** — quotes are leads, followed up by a human.
- **No visitor accounts** — only staff log in (at `/admin`).
- **No public form that writes directly to the database API** — the quote form goes through a validated server action.
- **No contact form** — `/contact` embeds Microsoft Bookings so visitors book a call directly.
- **No client-side data fetching for content** — pages are server-rendered and cached.
