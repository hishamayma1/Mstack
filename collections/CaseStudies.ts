import type { CollectionConfig } from "payload"
import { SITEMAP_INDUSTRY_TITLES } from "@/lib/content/site"

// Case studies power the /case-studies index and one /case-studies/[slug]
// page each. Only "Published" entries are ever fetched by the site (see
// lib/payload-case-studies.ts), so a study can be drafted and reviewed with
// the client before it goes live.
//
// `industry` is a fixed select rather than free text, matching the same 7
// sectors used on /industries, so the filter menu shows a known set of
// categories instead of accumulating typos and variants — and so an industry
// page can find its own case studies by an exact match.
//
// The form is organised as tabs following the detail page top to bottom, the
// same convention as the Industries collection. The tabs are unnamed, so they
// are presentation only and every field stays at the top level of the
// document — no migration, nothing downstream changes.
//
// Everything on tabs 2–5 is optional. The five original fields (client, slug,
// industry, challenge, result, stat) are all a case study needs to appear on
// the index and render a valid detail page; the richer sections simply don't
// render until someone fills them in.
export const CaseStudies: CollectionConfig = {
  slug: "case-studies",
  admin: {
    group: "Website",
    useAsTitle: "client",
    defaultColumns: ["client", "industry", "status", "publishedDate"],
    description: "Client success stories. Each one gets its own /case-studies/[slug] page.",
    preview: (doc) => (doc?.slug ? `/case-studies/${doc.slug}` : null),
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: "slug",
      type: "text",
      required: true,
      unique: true,
      index: true,
      admin: {
        position: "sidebar",
        description: 'URL segment, e.g. "alden-manufacturing-co" → /case-studies/alden-manufacturing-co.',
      },
      validate: (value: string | null | undefined) =>
        !value || /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(value)
          ? true
          : "Use lowercase letters, numbers and single hyphens only.",
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
      admin: { position: "sidebar", description: "Only Published studies appear on the site." },
    },
    {
      name: "publishedDate",
      type: "date",
      required: true,
      defaultValue: () => new Date().toISOString(),
      admin: {
        position: "sidebar",
        date: { pickerAppearance: "dayOnly" },
        description: "Drives the default ordering — newest first.",
      },
    },

    {
      type: "tabs",
      tabs: [
        {
          label: "1 · Overview",
          description: "The top of the case study page, and the card on the /case-studies index.",
          fields: [
            {
              name: "client",
              type: "text",
              required: true,
              admin: { description: "Company or organisation name. Used as the page heading and card title." },
            },
            {
              name: "industry",
              type: "select",
              required: true,
              options: SITEMAP_INDUSTRY_TITLES.map((label) => ({ label, value: label })),
              admin: {
                description:
                  "Drives the filter menu on /case-studies, and decides which industry page shows this study.",
              },
            },
            {
              name: "headline",
              type: "textarea",
              required: false,
              admin: {
                description:
                  'The outcome in one line, e.g. "Zero compliance incidents since go-live." Press Enter to control wrapping. Falls back to the client name.',
              },
            },
            {
              name: "summary",
              type: "textarea",
              required: false,
              admin: {
                description:
                  "Two sentences under the headline setting up the story. Also used as the page's meta description.",
              },
            },
            {
              name: "heroImage",
              type: "upload",
              relationTo: "media",
              required: false,
              admin: {
                description:
                  "The main visual. Shown beside the headline at the top of the case study page AND as the image on the /case-studies card, so pick something that reads well small. Landscape, around 1600×1000. Leave empty and both places show a labelled placeholder instead.",
              },
            },
            {
              name: "logo",
              type: "upload",
              relationTo: "media",
              required: false,
              admin: { description: "Optional client logo, shown next to the industry tag." },
            },
            {
              name: "facts",
              type: "array",
              required: false,
              maxRows: 4,
              labels: { singular: "Fact", plural: "Facts" },
              admin: {
                description:
                  'The "At a glance" strip — e.g. "Size / 240 staff", "Timeline / 6 weeks", "Service Level / Secure 365".',
              },
              fields: [
                {
                  type: "row",
                  fields: [
                    { name: "label", type: "text", required: true, admin: { width: "40%" } },
                    { name: "value", type: "text", required: true, admin: { width: "60%" } },
                  ],
                },
              ],
            },
          ],
        },

        {
          label: "2 · Challenge",
          description: 'Section headed "Where They Started".',
          fields: [
            {
              name: "challenge",
              type: "textarea",
              required: true,
              admin: { description: "The problem the client came to us with, in a short paragraph." },
            },
            {
              name: "challengePoints",
              type: "array",
              required: false,
              labels: { singular: "Point", plural: "Points" },
              admin: {
                initCollapsed: true,
                description: "Optional bullets breaking the problem down. Three or four reads best.",
              },
              fields: [{ name: "point", type: "text", required: true }],
            },
          ],
        },

        {
          label: "3 · What We Did",
          description: 'Section headed "What We Did" — numbered steps.',
          fields: [
            {
              name: "result",
              type: "textarea",
              required: true,
              admin: {
                description:
                  "One-paragraph summary of the work. Shown on the index card and as the intro to this section.",
              },
            },
            {
              name: "approach",
              type: "array",
              required: false,
              labels: { singular: "Step", plural: "Step" },
              admin: {
                initCollapsed: true,
                description:
                  "The engagement broken into stages. Numbered 01, 02, 03 in the order listed here.",
              },
              fields: [
                { name: "title", type: "text", required: true, admin: { description: 'e.g. "Tenant audit and licence review".' } },
                { name: "description", type: "textarea", required: true },
              ],
            },
            {
              name: "approachImage",
              type: "upload",
              relationTo: "media",
              required: false,
              admin: {
                description:
                  "Optional visual for this section — a screenshot of what we built, an architecture diagram, a before/after. Sits beside the numbered steps. Around 1200×900.",
              },
            },
            {
              name: "toolsUsed",
              type: "array",
              required: false,
              labels: { singular: "Tool", plural: "Tools" },
              admin: {
                description: "Microsoft products deployed, shown as chips. e.g. SharePoint, Purview, Power Automate.",
              },
              fields: [{ name: "name", type: "text", required: true }],
            },
          ],
        },

        {
          label: "4 · Results",
          description: 'Section headed "The Results".',
          fields: [
            {
              name: "stat",
              type: "group",
              admin: {
                description: "The single headline metric. This is the one shown on the /case-studies card.",
              },
              fields: [
                {
                  type: "row",
                  fields: [
                    { name: "value", type: "text", required: true, admin: { width: "40%", description: 'e.g. "40%", "3x", "500+"' } },
                    { name: "label", type: "text", required: true, admin: { width: "60%", description: 'e.g. "Faster document turnaround"' } },
                  ],
                },
              ],
            },
            {
              name: "metrics",
              type: "array",
              required: false,
              maxRows: 4,
              labels: { singular: "Metric", plural: "Metrics" },
              admin: {
                description:
                  "Additional measured outcomes shown on the detail page. The headline stat above is displayed first, so don't repeat it here.",
              },
              fields: [
                {
                  type: "row",
                  fields: [
                    { name: "value", type: "text", required: true, admin: { width: "40%" } },
                    { name: "label", type: "text", required: true, admin: { width: "60%" } },
                  ],
                },
              ],
            },
            {
              name: "gallery",
              type: "array",
              required: false,
              maxRows: 6,
              labels: { singular: "Image", plural: "Gallery" },
              admin: {
                initCollapsed: true,
                description:
                  "Proof images — dashboards, reports, the finished environment. Shown as a gallery under the results. The section is hidden entirely if left empty.",
              },
              fields: [
                { name: "image", type: "upload", relationTo: "media", required: true },
                {
                  name: "caption",
                  type: "text",
                  required: false,
                  admin: { description: "Optional line under the image explaining what it shows." },
                },
              ],
            },
          ],
        },

        {
          label: "5 · Client Quote",
          description: "Optional pull quote. The section is hidden entirely if left blank.",
          fields: [
            {
              name: "quote",
              type: "group",
              fields: [
                {
                  name: "text",
                  type: "textarea",
                  required: false,
                  admin: { description: "The quote itself, without surrounding quotation marks." },
                },
                {
                  type: "row",
                  fields: [
                    { name: "author", type: "text", required: false, admin: { width: "50%", description: "Who said it." } },
                    { name: "role", type: "text", required: false, admin: { width: "50%", description: 'Their title, e.g. "IT Director".' } },
                  ],
                },
              ],
            },
          ],
        },
      ],
    },
  ],
}
