import type { CollectionConfig } from "payload"
import { revalidateOnChange } from "./revalidate"

// Powers the /industries hub grid and each /industries/[slug] detail page.
// Only "Published" entries are fetched by the site (lib/payload-industries.ts).
//
// The editing form is organised to mirror the industry page top to bottom —
// one tab per section, in the order a visitor scrolls through them — so an
// editor filling this in is walking down the page they're building rather
// than through a flat list of unrelated fields.
//
// The tabs are *unnamed*, which is deliberate: unnamed tabs are a presentation
// layer only and leave every field at the top level of the document, so this
// reorganisation needs no data migration and nothing downstream changes.
//
// Everything below the Hero tab is optional. The collection was seeded before
// these fields existed, so older documents leave them blank and
// lib/industry-content.ts supplies a per-slug fallback. A value set here
// always wins over the fallback.
export const Industries: CollectionConfig = {
  slug: "industries",
  admin: {
    group: "Website",
    useAsTitle: "title",
    defaultColumns: ["title", "slug", "status", "order"],
    description:
      "Each entry is one /industries/[slug] page. The tabs follow the page from top to bottom.",
    preview: (doc) => (doc?.slug ? `/industries/${doc.slug}` : null),
  },
  access: {
    read: () => true,
  },
  hooks: revalidateOnChange("industries"),
  fields: [
    // ── Sidebar: identity and publishing ────────────────────────────────────
    {
      name: "slug",
      type: "text",
      required: true,
      unique: true,
      index: true,
      admin: {
        position: "sidebar",
        description: 'URL segment, e.g. "healthcare" → /industries/healthcare.',
      },
      validate: (value: string | null | undefined) =>
        !value || /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(value)
          ? true
          : "Use lowercase letters, numbers and single hyphens only, e.g. banking-finance.",
    },
    {
      name: "status",
      type: "select",
      required: true,
      defaultValue: "draft",
      index: true,
      options: [
        { label: "Draft", value: "draft" },
        { label: "Published", value: "published" },
      ],
      admin: {
        position: "sidebar",
        description: "Only Published industries appear on the site.",
      },
    },
    {
      name: "order",
      type: "number",
      required: false,
      defaultValue: 0,
      admin: {
        position: "sidebar",
        description: "Lower numbers appear first on the /industries grid.",
      },
    },

    // ── Main editing area: one tab per page section, in page order ──────────
    {
      type: "tabs",
      tabs: [
        {
          label: "1 · Hero",
          description: "The top of the page — the first screen a visitor sees.",
          fields: [
            {
              name: "title",
              type: "text",
              required: true,
              admin: {
                description:
                  'The sector name, e.g. "Healthcare". Used in the breadcrumb, the eyebrow ("MICROSOFT 365 FOR HEALTHCARE"), section headings, and the page title.',
              },
            },
            {
              name: "headline",
              type: "textarea",
              required: false,
              admin: {
                description:
                  "The large hero headline. Press Enter to control where it wraps — each line break becomes a line break on the page. Leave blank to use the built-in copy.",
              },
            },
            {
              name: "valueProp",
              type: "textarea",
              required: false,
              admin: {
                description:
                  "Two sentences under the headline: why this sector should care. This is the paragraph beside the hero image.",
              },
            },
            {
              name: "stats",
              type: "array",
              required: false,
              maxRows: 3,
              labels: { singular: "Stat", plural: "Stats" },
              admin: {
                description:
                  "Up to 3 proof points in the band under the hero. Three reads best; fewer is fine.",
              },
              fields: [
                {
                  type: "row",
                  fields: [
                    {
                      name: "value",
                      type: "text",
                      required: true,
                      admin: {
                        width: "40%",
                        description: 'The big number, e.g. "40%", "HIPAA", "24/7".',
                      },
                    },
                    {
                      name: "label",
                      type: "text",
                      required: true,
                      admin: {
                        width: "60%",
                        description: 'What it refers to, e.g. "Less Admin Time".',
                      },
                    },
                  ],
                },
              ],
            },
          ],
        },

        {
          label: "2 · Challenges",
          description: 'Section headed "What\'s Slowing You Down" — names the problem before pitching the fix.',
          fields: [
            {
              name: "challenges",
              type: "array",
              required: false,
              labels: { singular: "Challenge", plural: "Challenges" },
              admin: {
                initCollapsed: true,
                description:
                  "Pain points this sector recognises. Four works best — they lay out as a two-column grid. Write them as a symptom the buyer would describe themselves, not as a missing feature.",
              },
              fields: [
                {
                  name: "title",
                  type: "text",
                  required: true,
                  admin: { description: 'The problem in a short line, e.g. "Audits become fire drills".' },
                },
                {
                  name: "description",
                  type: "textarea",
                  required: true,
                  admin: { description: "One or two sentences on what it costs them today." },
                },
              ],
            },
          ],
        },

        {
          label: "3 · What We Solve",
          description: 'Section headed "Built for [Industry]" — numbered cards, each a scoped piece of work.',
          fields: [
            {
              name: "solutions",
              type: "array",
              required: true,
              minRows: 1,
              labels: { singular: "Solution", plural: "Solutions" },
              admin: {
                initCollapsed: true,
                description:
                  "Each row becomes a numbered card. Order matters — they're numbered 01, 02, 03 in the order listed here. Four is the usual count.",
              },
              fields: [
                {
                  name: "title",
                  type: "text",
                  required: true,
                  admin: { description: 'The capability, e.g. "Patient Data Compliance".' },
                },
                {
                  name: "description",
                  type: "textarea",
                  required: true,
                  admin: { description: "How we solve it, in one or two sentences." },
                },
              ],
            },
          ],
        },

        {
          label: "4 · Your Toolkit",
          description:
            'Section headed "The Microsoft Tools Your Sector Needs" — the centrepiece of the page.',
          fields: [
            {
              name: "tools",
              type: "array",
              required: false,
              labels: { singular: "Tool", plural: "Tools" },
              admin: {
                initCollapsed: true,
                description:
                  "The Microsoft products we deploy for this sector. Six lays out as a clean 3×2 grid. The first four names also appear as chips on the /industries hub card, so put the most recognisable ones first.",
              },
              fields: [
                {
                  type: "row",
                  fields: [
                    {
                      name: "name",
                      type: "text",
                      required: true,
                      admin: { width: "55%", description: 'Product name, e.g. "Microsoft Purview".' },
                    },
                    {
                      name: "category",
                      type: "text",
                      required: true,
                      admin: {
                        width: "45%",
                        description: 'Short label on the chip above the name, e.g. "Compliance", "Identity".',
                      },
                    },
                  ],
                },
                {
                  name: "whatItIs",
                  type: "textarea",
                  required: true,
                  admin: {
                    description:
                      "What the tool does, in one plain-English sentence. This is read by buyers, not administrators — no jargon.",
                  },
                },
                {
                  name: "whyYouNeedIt",
                  type: "textarea",
                  required: true,
                  admin: {
                    description:
                      'Appears under the "WHY [INDUSTRY] NEEDS IT" divider. Tie it to a problem this sector actually has — ideally one listed on the Challenges tab.',
                  },
                },
              ],
            },
          ],
        },

        {
          label: "5 · Outcomes",
          description: 'Section headed "What Changes Once It\'s Live" — closes the loop opened by Challenges.',
          fields: [
            {
              name: "outcomes",
              type: "array",
              required: false,
              labels: { singular: "Outcome", plural: "Outcomes" },
              admin: {
                initCollapsed: true,
                description:
                  "Three works best — they render as numbered rows, not cards. Each should answer a challenge from tab 2.",
              },
              fields: [
                {
                  name: "title",
                  type: "text",
                  required: true,
                  admin: { description: 'The result, e.g. "Compliance you can evidence".' },
                },
                {
                  name: "description",
                  type: "textarea",
                  required: true,
                  admin: { description: "One sentence on what that means day to day." },
                },
              ],
            },
          ],
        },

        {
          label: "6 · Closing CTA",
          description: "The final block on the page, before the footer.",
          fields: [
            {
              name: "ctaHeadline",
              type: "textarea",
              required: false,
              admin: {
                description:
                  "Closing headline. Press Enter to control where it wraps. Leave blank to use the built-in copy.",
              },
            },
            {
              name: "ctaSubtext",
              type: "textarea",
              required: false,
              admin: {
                description:
                  "One supporting line under it. Say what the visitor gets from the call, not what we do.",
              },
            },
          ],
        },

        {
          label: "Listing & SEO",
          description:
            "Not shown in the page body — this is the card on the /industries grid and the search-engine description.",
          fields: [
            {
              name: "summary",
              type: "textarea",
              required: true,
              admin: {
                description:
                  "Shown on the /industries grid card, and used as the page's meta description. Aim for 150–160 characters so search engines don't truncate it.",
              },
            },
          ],
        },
      ],
    },
  ],
}
