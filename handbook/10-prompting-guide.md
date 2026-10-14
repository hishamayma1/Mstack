# 10 · Prompting Guide — Changing This Project With AI

How to write prompts that get an AI coding assistant (Claude Code, Cursor, Copilot, Windsurf…) to change, add, restyle or fix things in **this** codebase correctly the first time.

> **The one-sentence version:** say *what* you want, *where* it is, *what must not change*, and *how you'll know it's done* — using this project's own vocabulary.

---

## Contents

1. [Why prompts fail on this project](#1-why-prompts-fail-on-this-project)
2. [The anatomy of a good prompt](#2-the-anatomy-of-a-good-prompt)
3. [Where things live — the map to put in your prompt](#3-where-things-live--the-map-to-put-in-your-prompt)
4. [Project vocabulary](#4-project-vocabulary)
5. [Templates by task type](#5-templates-by-task-type)
6. [Example prompts for this project](#example-prompts-for-this-project)
7. [Bad prompt → good prompt](#7-bad-prompt--good-prompt)
8. [Working in steps](#8-working-in-steps)
9. [Reviewing what the AI did](#9-reviewing-what-the-ai-did)
10. [Safety rules](#10-safety-rules)
11. [Copy-paste context block](#11-copy-paste-context-block)

---

## 1. Why prompts fail on this project

| Trap | What goes wrong | Prevent it by saying… |
|---|---|---|
| **Next.js 16 is newer than most AI training data** | The AI uses old APIs (`unstable_cache`, `reset()` in error boundaries, `runtime = 'edge'`, `tailwind.config.js`) | *"This is Next.js 16 with Cache Components — check `node_modules/next/dist/docs/` before using any Next API."* |
| **Content is in two places** (CMS vs. code) | The AI edits code for something that's actually CMS content, or vice versa | Name the source: *"the Secure 365 headline in the CMS"* vs. *"the hero stats in `lib/content/site.ts`"* |
| **Prices are computed twice** (browser + server) | AI changes only the configurator UI and the stored quote disagrees | *"Change the pricing logic in `lib/pricing.ts` so client and server stay identical."* |
| **Two themes** | A style looks great in dark mode, invisible in light | *"Use the existing tokens and check both light and dark."* |
| **Server Components by default** | AI adds `"use client"` to a whole page, shipping JS for everything | *"Keep the page a server component; only the interactive part should be a client component."* |
| **Live database in `.env`** | Test data lands in production | *"Don't create or delete database records"* or point to a dev DB |
| **Caching** | "I changed it in the admin but the site didn't update" — the AI goes hunting for a bug | Mention [07 §8](./07-business-logic.md#8-caching-behaviour-summary): most collections refresh within the hour |
| **Vague scope** | AI "improves" ten unrelated things | *"Only change X. Don't refactor anything else."* |

---

## 2. The anatomy of a good prompt

Use this structure. Not every prompt needs every part, but the first four almost always matter.

```
1. GOAL        What should be different when you're done, in one or two sentences.
2. LOCATION    The page/URL, the section, and (if you know) the file.
3. DETAILS     Exact copy, numbers, colours, behaviour, examples.
4. CONSTRAINTS What must NOT change. Patterns to follow. Things to reuse.
5. DONE WHEN   How to verify: build passes, what to look at, what should happen.
6. PROCESS     (optional) "Plan first and wait for my OK", "ask if unsure", "one step at a time".
```

### Example using the structure

```
GOAL: Add a "Most popular" badge to the Secure 365 card on the /solutions hub.

LOCATION: /solutions page, the service levels section
(components/sections/solutions/service-levels-section.tsx). Data comes from
lib/cms/services.ts.

DETAILS: The badge should say "Most popular", sit in the card's top-right corner,
and use the card's own service accent colour (the --svc tokens / bg-svc class).
Editors should control which service shows it — add a "popular" checkbox to the
Services collection (sidebar, default off), not a hard-coded slug.

CONSTRAINTS: Follow the existing collection conventions (admin.description on the
field). Run generate:types. Add the field to the select in getServices(). Don't
change the card layout otherwise. Must look right in light and dark mode.

DONE WHEN: pnpm build passes; ticking "popular" on a service in /admin shows the
badge on that card only; unticked services look exactly as before.
```

### Five rules that matter most

1. **Be specific about the target.** "The hero on `/industries/healthcare`" beats "the industry page". A URL + a section name is usually enough for the AI to find the file.
2. **Give exact content.** Paste the exact text, number, or colour. "Make it punchier" gets you the AI's taste, not yours.
3. **State what stays the same.** The AI's default is to tidy things up. Tell it not to.
4. **Point to an existing example.** "Do it the same way `BlogPosts.ts` revalidates its cache" is worth a paragraph of explanation.
5. **Define done.** "pnpm build passes and it works in dark mode on mobile" turns a vague request into a checkable one.

---

## 3. Where things live — the map to put in your prompt

### "I want to change…"

| What | Where it lives | Edit in |
|---|---|---|
| Service name, prices, inclusions, FAQ, options | CMS → Services | `/admin` (no code) |
| Industry page text | CMS → Industries (fallback: `lib/content/industries.ts`) | `/admin` |
| Case study content | CMS → Case Studies | `/admin` |
| Blog articles | CMS → Blog Posts | `/admin` |
| Guides, tools, FAQs | CMS → Guides / Tools / FAQs | `/admin` |
| Homepage hero stats, pain points, process steps, differentiators, health-check list, testimonials | `lib/content/site.ts` | code |
| Homepage section order | `app/(frontend)/page.tsx` | code |
| Homepage images / placeholders | `lib/content/home-media.ts` | code |
| Microsoft product logos | `lib/content/app-logos.ts` | code |
| Navigation links & mega-menus | `NAV_LINKS`, `NAV_MENUS` in `lib/content/site.ts` | code |
| Footer columns | `FOOTER_COLUMNS` in `lib/content/site.ts` | code |
| About: story, team, partners, careers | `lib/content/site.ts` (`OUR_STORY`, `TEAM`, `PARTNERS`, `CAREER_OPENINGS`) + `public/team/` | code |
| Contact details | `CONTACT_METHODS` in `lib/content/site.ts` | code |
| Booking calendar link | `BOOKING_URL` in `components/sections/contact/contact-section.tsx` | code |
| Legal text | `LEGAL_DOCS` in `lib/content/site.ts` | code |
| Page `<title>` / description | `metadata` / `generateMetadata` in `app/(frontend)/<route>/page.tsx` | code |
| Brand colours, dark/light palette | `:root` and `.dark` in `app/(frontend)/globals.css` | code |
| Which colour each service uses | `lib/service-theme.ts` | code |
| Section backgrounds (tones) | `tone` prop on `<Section>` in the section file | code |
| Animations | `components/ui/motion.module.css`, `lib/motion.ts` | code |
| Fonts | `app/(frontend)/layout.tsx` + `@theme inline` in `globals.css` | code |
| Pricing maths | `lib/pricing.ts` | code |
| Quote form fields / validation | `components/sections/services/service-configurator.tsx` + `app/(frontend)/solutions/[slug]/actions.ts` + `collections/ServiceRequests.ts` | code |
| Lead email / push content | `lib/notify/service-request.ts` | code |
| CMS fields and editor form | `collections/<Name>.ts` | code |
| Who can do what in the admin | `collections/access.ts`, `collections/Users.ts` | code |
| Admin look | `app/(payload)/custom.scss`, `components/admin/` | code |
| Starter content for empty databases | `lib/seed/` | code |

### Page → section files

| Page | Section components |
|---|---|
| `/` | `components/sections/home/*` |
| `/solutions` | `components/sections/solutions/*` |
| `/solutions/[slug]` | `components/sections/services/*` |
| `/industries`, `/industries/[slug]` | `components/sections/industries/*` |
| `/case-studies`, `/case-studies/[slug]` | `components/sections/case-studies/*` |
| `/blog`, `/blog/[slug]` | `components/sections/blog/*` (blocks in `blog/blocks/`) |
| `/resources` | `components/sections/resources/*` |
| `/about` | `components/sections/about/*` |
| `/contact` | `components/sections/contact/*` |
| `/legal` | `components/sections/legal/*` |
| Shared (hero, final CTA, testimonials, errors) | `components/sections/shared/*` |
| Nav, footer, page wrapper | `components/layout/*` |

> **Tip:** if you don't know the file, give the URL and the visible text: *"On /about, the section headed 'A Decade of Microsoft 365 Focus'"*. The AI can search for the text.

---

## 4. Project vocabulary

Using these words makes the AI land in the right place and follow existing patterns.

| Say | Means |
|---|---|
| **Service** / **service level** / **add-on** | A `services` document; `kind: level` or `addon` |
| **Configurator** | The pricing widget on `/solutions/[slug]` |
| **Seat band** | A headcount price tier |
| **Service request** / **lead** | A `service-requests` document |
| **Collection** | A Payload content type in `collections/` |
| **Reader** / **data function** | A cached function in `lib/cms/` |
| **Section** with **tone** `base`/`raised`/`accent`/`blue`/`contrast` | The `<Section>` primitive |
| **SectionIntro** / **Eyebrow** | The standard heading block / caps kicker |
| **Service theme** / **`data-svc`** / **`--svc` tokens** | Per-service accent colour |
| **Tokens** (`bg-card`, `text-muted-foreground`, `border-border`) | Theme-aware colours |
| **Motion classes** (`motion.rise`, `stagger(i)`) | CSS scroll animations |
| **Explorer** | Client-side search/filter/sort over a server-fetched list |
| **UI store** | The Zustand store in `lib/store/index.ts` |
| **Seed** | Starter content in `lib/seed/` |
| **Cache tag** / **revalidate** | `cacheTag("…")` / `revalidateTag("…", "max")` |
| **PageShell** | Wrapper with nav + footer for non-home pages |

---

## 5. Templates by task type

Copy, fill in the brackets, delete what doesn't apply.

### 5.1 Change existing copy or content

```
Change the [text / number / list] in [section name] on [URL].
Current: "[current text]"
New: "[new text]"
This is [CMS content in /admin → … | code content in lib/content/site.ts].
Don't change anything else.
```

### 5.2 Change the style of something

```
On [URL], in the [section name] section, change [element] so that [visual result].
Reference: [screenshot / "like the cards on /solutions" / exact values].
Use the existing design tokens and Tailwind classes (see handbook/06-design-system.md) —
no hard-coded hex colours. It must look right in both light and dark mode and on mobile
(~375px wide). Respect prefers-reduced-motion for any animation.
Don't change the content, the layout of other sections, or shared components unless
you tell me first.
```

### 5.3 Change how an existing feature behaves

```
Feature: [name, e.g. "the price configurator on /solutions/[slug]"].
Currently: [what happens now].
I want: [what should happen instead], for example: [concrete scenario with numbers].
Relevant files (check them): [files from the map in section 3].
Constraints:
- [e.g. client and server must compute the same quote — change lib/pricing.ts, not just the UI]
- Keep existing behaviour for [cases that must not change].
Done when: pnpm build passes and [scenario] produces [expected result].
Explain the change before you make it.
```

### 5.4 Add a new feature

```
I want to add [feature] so that [who] can [do what / why].

Behaviour:
- [step / rule 1]
- [step / rule 2]
- Edge cases: [empty state, mobile, errors…]

Where: [page / section / admin].
Data: [Should editors manage it in /admin (new collection or field) or is it fixed copy
in lib/content?]

Follow the project's patterns:
- Server components by default; "use client" only for the interactive part.
- Data reads go in lib/cms/ with "use cache", cacheLife and cacheTag, published-only.
- New CMS fields: editor-friendly admin.description, then pnpm generate:types.
- Styling with Section/SectionIntro and design tokens; light + dark.
- Copy in lib/content/, not inline.
(See handbook/03-architecture.md and handbook/08-development-workflow.md.)

First, propose a short plan (files to create/change) and wait for my OK.
Done when: pnpm build passes and [how I'll test it].
```

### 5.5 Add or change a CMS field

```
Add a [type: text / textarea / checkbox / select / array / upload] field "[name]" to the
[collection] collection, in the [tab name] tab [or sidebar].
Label/description for editors: "[description]".
Required: [yes/no — prefer no for existing collections]. Default: [value].
Show it on the site at [where], and hide that UI when it's empty.
Steps: update collections/[Name].ts → pnpm generate:types → add to the select and the
mapped type in lib/cms/[name].ts → render in [component]. Optionally add to the seed.
```

### 5.6 Add a new page

```
Create a new page at /[route] called "[title]".
Purpose: [why it exists].
Sections, in order:
1. PageHero — eyebrow "[…]", title "[…]" (line break where \n), subtitle "[…]"
2. [section] — [content]
3. FinalCTASection
Content source: [lib/content/site.ts | new CMS collection].
Add metadata (title "[…] | MStack360", description "[…]").
Link it from [nav / footer column "…"].
Follow the existing page pattern (e.g. app/(frontend)/about/page.tsx): server component
inside <PageShell>, sections in components/sections/[route]/.
```

### 5.7 Fix a bug

```
Bug: [what's wrong].
Where: [URL / admin screen], [desktop/mobile], [light/dark], [browser].
Steps to reproduce:
1. …
2. …
Expected: [...]
Actual: [...]   Error message (exact): [paste]
It started after: [change/commit, if known].
Find the root cause before changing code, explain it, then fix it with the smallest
change. Don't refactor unrelated code.
```

### 5.8 Performance / SEO / accessibility

```
Audit [page/URL] for [performance | SEO | accessibility].
Report findings first, ranked by impact, with the file and line for each.
Don't change anything until I pick which to fix.
Constraints: keep pages as server components; don't re-enable the Next image optimizer
(it's disabled on purpose — see next.config.mjs).
```

### 5.9 Understand something (no changes)

```
Explain how [feature/flow] works in this project — which files are involved, in what
order, and why. Don't change any code. Point me to file:line for each step.
```

---

## Example prompts for this project

Real, ready-to-use prompts. Adjust the details.

**Content (code)**
> On the homepage, the hero stats come from `HERO_STATS` in `lib/content/site.ts`. Change "500+ Satisfied Clients" to "650+ Satisfied Clients" and "10+ Years Experience" to "12+ Years Experience". Nothing else.

**Navigation**
> Add "Blog" to the main navigation between "Case Studies" and "Resources", linking to `/blog`. The nav reads `NAV_LINKS` (and `NAV_MENUS` for mega-menus) in `lib/content/site.ts`. Check the desktop nav and the mobile menu both show it.

**Style — colour**
> Make the Migration service use the `violet` accent instead of `orange`. The mapping is `BY_SLUG` in `lib/service-theme.ts`. Managed 365 is already violet, so swap Managed 365 to `orange`. Check `/solutions` in light and dark mode.

**Style — section tone**
> On the homepage, the Differentiators section feels flat. Change its `<Section>` tone to `raised`. Make sure it isn't now next to another `raised` band — if it is, tell me and suggest an alternative instead of changing other sections.

**Style — brand**
> I want the brand blue slightly more purple. In `app/(frontend)/globals.css`, shift the hue of `--primary`, `--ring`, `--sidebar-primary`, `--sidebar-ring` and `--chart-1` from 259.8 to 268, in both `:root` and `.dark`. Don't touch the per-service themes. Show me the diff before applying.

**Behaviour — pricing**
> Add an annual-billing discount to the configurator: a toggle "Pay annually (save 10%)" that reduces the monthly recurring total by 10% (not one-time fees). It must be computed in `lib/pricing.ts` so the server action stores the same discounted figures, saved on the service request (add a `billing` field to `collections/ServiceRequests.ts`, read-only like the others) and shown in the alert email. Editors should be able to set the discount % per service in the Pricing tab (default 0 = toggle hidden). Plan first, wait for my OK.

**Behaviour — caching**
> Edits to Services in `/admin` take up to an hour to appear on `/solutions`. Make them appear on the next visit the same way `collections/BlogPosts.ts` does it: an `afterChange` and `afterDelete` hook calling `revalidateTag("services", "max")`, wrapped in try/catch for the seed. Do the same for `industries` and `case-studies`.

**New CMS field**
> Add an optional "Video URL" text field to Case Studies, tab "4 · Results", description "YouTube link to a client video. Shown under the results." Run `pnpm generate:types`, add it to `getCaseStudyBySlug` in `lib/cms/case-studies.ts`, and render it under the results section by reusing the blog's video block component (`components/sections/blog/blocks/video-block.tsx`). Hide it when empty.

**New feature — notification**
> When a lead's status changes to "Won" in `/admin`, send a push notification to all devices: "🎉 Won — {company}". Put the logic in `lib/notify/` next to the existing alerts, trigger it from an `afterChange` hook in `collections/ServiceRequests.ts` only when the status actually changed to `won`, and follow the same rule as the existing notifier: failures are logged, never thrown.

**New page**
> Create `/partners` listing our Microsoft partnerships. Reuse `PARTNERS` from `lib/content/site.ts`. Sections: PageHero (eyebrow "PARTNERS", title "Built on\nMicrosoft.") → a grid of partner cards using `BentoCard` → `FinalCTASection`. Add metadata and a link in the footer "Company" column. Follow `app/(frontend)/about/page.tsx` as the pattern.

**Bug**
> On `/blog/[slug]` on iPhone Safari, the "On this page" reading bar doesn't stick to the top while scrolling. Expected: it stays pinned. Find the cause first — check whether any ancestor has `overflow: hidden`, which breaks `position: sticky` — explain it, then fix with the smallest change.

**Explain**
> Explain what happens from the moment a visitor clicks "Send" in the configurator until the push notification appears on my phone. List each file and function in order. Don't change code.

---

## 7. Bad prompt → good prompt

| ❌ Bad | Why it fails | ✅ Good |
|---|---|---|
| "Make the site better" | No target, no definition of better | "On `/solutions`, make the add-on cards the same height on desktop. Nothing else." |
| "Change the price" | Which price? CMS or code? | "In `/admin → Services → Secure 365 → Pricing`, …" — or do it yourself, it's CMS content |
| "Add dark mode" | Already exists | Check [05 · Features](./05-features.md) first |
| "Fix the blog" | No symptom | "On `/blog`, filtering by 'Security' then searching 'MFA' shows 0 results, but the post 'MFA rollout' has that tag." |
| "Use a nicer blue" | Taste, not spec | "Use `oklch(0.6 0.2 250)` for `--primary` in light mode only." |
| "Add a contact form" | Unspecified storage, alerts, spam handling | "Add a contact form to `/contact` that stores submissions in a new `contact-messages` collection (staff-only read, `create: false` on REST, written by a server action with a honeypot like `actions.ts`) and reuses the email alert from `lib/notify/`." |
| "Refactor the components" | Unbounded | "Split `service-configurator.tsx` into the slider, options list and form, in the same folder, with no behaviour change." |
| "Make it animate" | No spec, may ignore reduced motion | "Make the stat numbers count up as they scroll in, using the existing `motion.count` class pattern and `drawRange()`." |
| "Install X library to do Y" | Adds weight before checking existing tools | "Can we do Y with what's already in the project? If not, recommend a library and why." |

---

## 8. Working in steps

For anything bigger than a one-line change:

1. **Ask for a plan first.** *"Propose a plan — files to add/change and why. Wait for my OK."*
2. **Approve or correct the plan.** This is the cheapest moment to fix a misunderstanding.
3. **Implement one step at a time** for large features: schema → data reader → UI → polish.
4. **Verify after each step** (`pnpm build`, look at the page).
5. **Ask for the handbook update:** *"Update the handbook files affected by this change."*

Useful follow-up phrases:

| Situation | Say |
|---|---|
| It changed too much | "Revert everything except [X]." |
| It guessed | "Don't guess — check the file and tell me what's there." |
| You're unsure it's right | "How did you verify this works? Show me." |
| It went the wrong direction | "Stop. Go back to [state]. The goal is actually [goal]." |
| Long session, AI getting confused | Start a new session and paste the copy-paste block from §11 plus a summary |

---

## 9. Reviewing what the AI did

Run through this checklist before accepting a change:

- [ ] `pnpm build` passes (ask the AI to run it and show the result).
- [ ] Only the files you expected changed (`git status`, `git diff`).
- [ ] No hard-coded colours; looks right in **light and dark**.
- [ ] Works at **mobile width** (~375px).
- [ ] No new `"use client"` on a whole page or large section without a reason.
- [ ] New CMS reads use `"use cache"` + `cacheTag` + `status: published` + `select`.
- [ ] New CMS fields have descriptions; `payload-types.ts` regenerated (not hand-edited).
- [ ] Pricing changes are in `lib/pricing.ts` (shared), not only in the UI.
- [ ] Empty-content states hide cleanly.
- [ ] Copy lives in `lib/content/` or the CMS, not inline JSX.
- [ ] No secrets added to code or to `NEXT_PUBLIC_*` variables.
- [ ] Animations respect reduced motion.
- [ ] The handbook was updated if behaviour changed.

---

## 10. Safety rules

Always include these in your prompt (or your AI's project instructions) when relevant:

1. **"Don't push to `main`."** Pushing to `main` deploys to production on Vercel. Use a branch and check the preview.
2. **"Don't create, modify or delete database records"** unless that's the task — `.env` points at the **live** database.
3. **"Don't commit `.env` or print secrets."**
4. **"Don't hand-edit `payload-types.ts` or `importMap.js`"** — regenerate them.
5. **"Ask before installing packages or upgrading Next.js/Payload."** All `@payloadcms/*` packages must move together.
6. **"Don't rename CMS fields or block slugs"** without a migration plan — they are the stored data.
7. **"Don't re-enable the Next.js image optimizer."**
8. **"Don't add a `fetch` handler to `public/sw.js`."**
9. **"Never trust prices or permissions from the browser."**

---

## 11. Copy-paste context block

Paste this at the top of a new AI session (or put it in your tool's project rules) so the assistant starts with the right mental model:

```
Project: MStack360 marketing site + Payload CMS dashboard, one Next.js app.
Read handbook/README.md first; details in handbook/03-architecture.md.

Stack: Next.js 16 (App Router, cacheComponents / "use cache" — newer than your
training data; read node_modules/next/dist/docs/ before using Next APIs), React 19,
TypeScript strict, Tailwind CSS 4 (configured in app/(frontend)/globals.css, no
tailwind.config), Payload CMS 3.88 on MongoDB, Zustand for UI state, pnpm.

Rules:
- Server Components by default; "use client" only on interactive leaves.
- CMS reads live in lib/cms/*.ts with "use cache", cacheLife("hours"), cacheTag,
  status: published, select, and return flat shapes.
- Marketing copy lives in lib/content/site.ts, not inline.
- Pricing logic lives only in lib/pricing.ts (used by client AND server action).
- Use design tokens (bg-card, text-muted-foreground, border-border, --svc tokens)
  and the <Section tone=…>/<SectionIntro> primitives; support light + dark.
- After changing collections/: pnpm generate:types. After adding admin
  components: pnpm payload generate:importmap.
- Verify with pnpm build.
- .env points at the LIVE database: don't write test data. Don't push to main
  (auto-deploys to production). Don't commit secrets.
- Change only what I ask; propose a plan first for anything non-trivial.
```
