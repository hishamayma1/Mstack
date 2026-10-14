# MStack360 Website — Project Handbook

The single source of truth for how the MStack360 website is built, how it behaves, and how to change it safely — whether you write the code yourself or ask an AI assistant to write it for you.

---

## Who this is for

| You are… | Start here |
|---|---|
| **New to the project** (any role) | [01 · Project Overview](./01-project-overview.md) → [02 · Tech Stack](./02-tech-stack.md) |
| **A developer** about to write code | [03 · Architecture](./03-architecture.md) → [08 · Development Workflow](./08-development-workflow.md) |
| **A vibe coder** using Claude / Cursor / Copilot | [10 · Prompting Guide](./10-prompting-guide.md) — read it end to end once |
| **A content editor / sales team member** | [09 · Admin Dashboard Guide](./09-admin-guide.md) |
| **A designer** changing the look | [06 · Design System](./06-design-system.md) |
| **Debugging something broken** | [11 · Troubleshooting](./11-troubleshooting.md) |

---

## Table of contents

| # | Document | What it answers |
|---|---|---|
| 01 | [Project Overview](./01-project-overview.md) | What the site is, who it serves, every page and what it's for |
| 02 | [Tech Stack](./02-tech-stack.md) | Every technology, its version, and why it was chosen |
| 03 | [Architecture](./03-architecture.md) | Folder structure, route groups, rendering, caching, data flow |
| 04 | [CMS & Content Model](./04-cms-content-model.md) | Every Payload collection, its fields, access rules and roles |
| 05 | [Features](./05-features.md) | What each feature does from the visitor's and editor's point of view |
| 06 | [Design System](./06-design-system.md) | Colours, tokens, service themes, section tones, typography, motion |
| 07 | [Business Logic & Behaviour](./07-business-logic.md) | Pricing engine, quote submission, notifications, seeding, permissions |
| 08 | [Development Workflow](./08-development-workflow.md) | Setup, scripts, environment, seeding, deployment, conventions |
| 09 | [Admin Dashboard Guide](./09-admin-guide.md) | How to use `/admin` day to day — content, leads, team, alerts |
| 10 | [Prompting Guide](./10-prompting-guide.md) | How to write prompts that change, add or restyle features correctly |
| 11 | [Troubleshooting](./11-troubleshooting.md) | Known problems, their causes and their fixes |

Related files outside this folder:

- [`../ENVIRONMENT.md`](../ENVIRONMENT.md) — every environment variable, step by step.
- [`../AGENTS.md`](../AGENTS.md) — instructions AI agents read automatically (Next.js version warning).
- [`../payload-types.ts`](../payload-types.ts) — generated TypeScript types for every CMS document.

---

## The project in one paragraph

**MStack360** is a Microsoft 365 consultancy. This repository is its marketing website **and** its sales/content dashboard in one Next.js 16 app. Visitors browse services, industries, case studies, a blog and resources; on any service page they can size the service to their headcount, see a live price, and submit a quote request. That request lands in the **Payload CMS** dashboard at `/admin` as a lead, and the team is alerted by **email** and **browser push**. Every piece of page content — services, prices, industries, case studies, blog posts, FAQs — is editable in the dashboard without a code change.

---

## Glossary

| Term | Meaning in this project |
|---|---|
| **Service** | A product MStack360 sells. Either a **Service Level** (the 5-step ladder: Core 365 → Intelligent 365) or an **Add-On** (Migration, Teams Phone…). Lives at `/solutions/[slug]`. |
| **Configurator** | The interactive pricing widget on every service page (seat slider + option checkboxes + quote form). |
| **Seat band** | A headcount range with its own per-user price, e.g. "1–10 users @ £12". |
| **Service Request** | A lead — one submitted configurator form, stored in the CMS. |
| **Collection** | A Payload CMS content type (like a database table with an admin UI). |
| **Local API** | Calling Payload directly from server code (`payload.find(...)`), no HTTP. Bypasses access control. |
| **`"use cache"`** | Next.js 16 directive that caches a function's result across requests. |
| **Cache tag** | A label on cached data (`"blog-posts"`, `"services"`…) that can be invalidated. |
| **Tone** | Which background surface a `<Section>` sits on: `base`, `raised`, `accent`, `blue`, `contrast`. |
| **Service theme** | The accent hue each service wears (`data-svc="emerald"` etc.). |
| **Route group** | A folder in parentheses like `(frontend)` — organises routes without adding to the URL. |
| **Seed** | Starter content automatically inserted into an empty database. |

---

## Keeping this handbook accurate

This handbook describes the code as of **October 2026** (Next.js 16.3, Payload 3.88). When you change something it documents:

1. Update the relevant file in the same commit as the code change.
2. If you add a collection, feature, or env variable, add it to docs 04 / 05 / `ENVIRONMENT.md`.
3. If an AI assistant made the change, ask it: *"Update the handbook files affected by this change."*
