# 09 · Admin Dashboard Guide

For anyone who manages content or leads. No coding needed.

**Sign in:** `https://mstack360.com/admin` (or `http://localhost:3000/admin` locally).

---

## 1. The dashboard home

At the top of `/admin` you'll see the **pipeline summary**:

| Card | Meaning | Click to… |
|---|---|---|
| **New requests** | Leads nobody has touched yet | Open the filtered list |
| **In progress** | Leads you're working | Open the filtered list |
| **Won** | Closed deals | Open the filtered list |
| **Draft services** | Service pages not yet live | Open the filtered list |

Below it is **Browser alerts** — click **Turn on** to get a desktop/phone notification every time a quote request comes in (do this on each device you use).

The sidebar is grouped as a working day reads: **Sales → Website → Resources → System**.

---

## 2. Working leads (Sales → Service Requests)

Every submitted price configurator becomes a request, newest first.

1. Open a request. Tab **1 · Contact** has who they are; **2 · Configured Plan** has exactly what they priced (seats, band, add-ons, line-by-line quote).
2. Set **Owner** (sidebar) to whoever is handling it.
3. Move **Status** as you go: **New → Reviewing → Contacted → Proposal Sent → Won / Lost**.
4. Write call notes in **3 · Internal → Internal notes** (never shown publicly).

Contact and quote fields are **locked on purpose** — they're a record of what the visitor saw. Reply to them from your email client using their work email.

---

## 3. Editing services & prices (Sales → Services)

Each service = one `/solutions/...` page. Tabs follow the page top to bottom.

| To change… | Go to |
|---|---|
| Name, headline, intro, stats | **1 · Hero** |
| What the fee includes | **2 · What's Included** |
| Results promised | **3 · Outcomes** |
| Prices, currency, headcount slider, setup fee | **4 · Pricing** |
| Optional add-ons in the calculator | **5 · Options** |
| FAQ on the page | **6 · FAQ** |
| Closing headline | **7 · Closing CTA** |
| Card text on /solutions + Google description | **Listing & SEO** |

Pricing tips:
- **Seat bands**: leave the last band's *max* empty so it means "and above".
- **Setup fee waived at**: a headcount where the setup fee disappears — a good closer for big teams.
- **Price on application**: choose this for bespoke work; the calculator then shows no numbers.
- **Billing note**: say what the price *doesn't* include (e.g. Microsoft licences).
- **Kind**: *Service Level* (the 5-step ladder) or *Add-On Service*.
- **Order**: lower numbers appear first.

A price change applies to **new quotes immediately**; the page display refreshes within about an hour.

---

## 4. Industries & case studies (Website)

**Industries** — one per `/industries/...` page. Fill the tabs in order (Hero, Challenges, What We Solve, Your Toolkit, Outcomes, Closing CTA, Listing & SEO). Empty optional tabs use built-in text, so you can start small.

**Case Studies** — only *Client, Industry, Challenge, Result, Headline stat* and *Slug* are required. Add more tabs (facts, approach steps, metrics, gallery, client quote) to make the page richer; empty sections stay hidden. The **Industry** you pick decides which industry page shows the study.

Use the **Preview** button to open the live page.

---

## 5. Blog posts (Resources → Blog Posts)

1. **Title**, **Slug** (the URL: `/blog/your-slug` — lowercase with hyphens), **Excerpt** (1–2 sentences), **Tag**.
2. **In 30 seconds**: 2–4 one-line takeaways (optional).
3. **Body**: write with **Heading 2 / Heading 3** for sections — they build the "On this page" menu. Press **`/`** or use **+** to insert blocks:
   Steps · Interactive checklist · Table · Pros & cons · Key numbers · FAQ (also shows in Google) · Callout · Pull quote · Call to action · YouTube video · Code.
4. **Cover image** (optional, landscape).
5. **Byline** fills itself from your profile — edit only to override.
6. **Mentioned people**: tag teammates featured in the article.
7. **Featured**: pin to "Start with these" on /blog.
8. Set **Status → Published** and save. It's live on the next page visit.

---

## 6. Guides, tools & FAQs (Resources)

| Collection | Appears on | Notes |
|---|---|---|
| Guides | `/resources` → Guides | Add a **Download URL** or the card shows no link |
| Tools | `/resources` → Tools | Add the tool's **URL** when it's live |
| FAQs | Homepage + `/resources` → FAQ | **Order**: lower first. **Points**: optional bullet list |

Everything must be **Published** to appear.

---

## 7. Images (System → Media)

Upload once, reuse anywhere. Every image is automatically resized and converted to WebP. Always write meaningful **Alt** text (it's read by screen readers and search engines). Keep uploads under ~4.5 MB.

---

## 8. Team accounts (System → Users)

| Role | Can |
|---|---|
| **Administrator** | Everything, including creating other admins |
| **Manager** | Add and manage Managers and Editors; reassign article authors |
| **Editor** (default) | Write and edit content; edit only their own account |

Fill in your **Name, Photo, Job title, Bio, LinkedIn** — they appear on articles you write. The last Administrator can't be demoted.

---

## 9. Push devices (System → Push Devices)

Lists every browser receiving lead alerts. Delete a row to stop alerts to that device. Don't add rows by hand — use **Turn on** on the dashboard.

---

## 10. What is *not* in the dashboard

These are edited in code (ask a developer, or see [10 · Prompting Guide](./10-prompting-guide.md)):
homepage copy (hero, pain points, process, differentiators, health check, testimonials), About page (story, team, partners, careers), Contact details and booking link, Legal pages, navigation menus and footer links.
