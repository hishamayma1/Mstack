import type { CollectionConfig } from "payload"

// Powers the /solutions hub and each /solutions/[slug] detail page, including
// the price configurator on it.
//
// Same editing shape as Industries: unnamed tabs in page order, so filling
// this in is a walk down the page being built rather than a flat field list.
// Unnamed tabs are presentation only — every field stays at the top level of
// the document, so reordering them later needs no migration.
//
// The Pricing and Options tabs are the ones that matter commercially. They
// feed lib/pricing.ts, which the visitor's configurator and the submit action
// both run — change a rate here and the next quote uses it, with no deploy.
export const Services: CollectionConfig = {
  slug: "services",
  admin: {
    group: "Sales",
    useAsTitle: "title",
    defaultColumns: ["title", "kind", "slug", "status", "order"],
    description:
      "Each entry is one /solutions/[slug] page with its own price configurator. The tabs follow the page from top to bottom.",
    preview: (doc) => (doc?.slug ? `/solutions/${doc.slug}` : null),
  },
  access: {
    read: () => true,
  },
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
        description: 'URL segment, e.g. "secure-365" → /solutions/secure-365.',
      },
      validate: (value: string | null | undefined) =>
        !value || /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(value)
          ? true
          : "Use lowercase letters, numbers and single hyphens only, e.g. teams-phone.",
    },
    {
      name: "kind",
      type: "select",
      required: true,
      defaultValue: "level",
      index: true,
      options: [
        { label: "Service Level", value: "level" },
        { label: "Add-On Service", value: "addon" },
      ],
      admin: {
        position: "sidebar",
        description:
          "Which block of the /solutions hub this appears in — the five-level ladder, or the standalone engagements below it.",
      },
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
        description: "Only Published services appear on the site and can be configured by visitors.",
      },
    },
    {
      name: "order",
      type: "number",
      required: false,
      defaultValue: 0,
      admin: {
        position: "sidebar",
        description: "Lower numbers appear first within their block on the /solutions hub.",
      },
    },

    // ── Main editing area ───────────────────────────────────────────────────
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
                  'The service name, e.g. "Secure 365". Used in the breadcrumb, the page title, and on every request this service generates.',
              },
            },
            {
              name: "tagline",
              type: "text",
              required: false,
              admin: {
                description: 'The short pill above the name, e.g. "The Shield". Two or three words.',
              },
            },
            {
              name: "headline",
              type: "textarea",
              required: false,
              admin: {
                description:
                  "The large hero headline. Press Enter to control where it wraps — each line break becomes a line break on the page. Leave blank to use the service name.",
              },
            },
            {
              name: "valueProp",
              type: "textarea",
              required: true,
              admin: {
                description:
                  "Two sentences under the headline: what this service does and who it's for. This is the paragraph a visitor reads before deciding to scroll.",
              },
            },
            {
              name: "stats",
              type: "array",
              required: false,
              maxRows: 3,
              labels: { singular: "Stat", plural: "Stats" },
              admin: {
                description: "Up to 3 proof points in the band under the hero. Three reads best.",
              },
              fields: [
                {
                  type: "row",
                  fields: [
                    {
                      name: "value",
                      type: "text",
                      required: true,
                      admin: { width: "40%", description: 'The big number, e.g. "99.9%", "24/7", "2 weeks".' },
                    },
                    {
                      name: "label",
                      type: "text",
                      required: true,
                      admin: { width: "60%", description: 'What it refers to, e.g. "Uptime monitored".' },
                    },
                  ],
                },
              ],
            },
          ],
        },

        {
          label: "2 · What's Included",
          description: 'Section headed "What You Get" — the line items that justify the price.',
          fields: [
            {
              name: "includes",
              type: "array",
              required: true,
              minRows: 1,
              labels: { singular: "Inclusion", plural: "Inclusions" },
              admin: {
                initCollapsed: true,
                description:
                  "Each row becomes a numbered card. These are what the monthly fee buys — be concrete. Four to six works best.",
              },
              fields: [
                {
                  name: "title",
                  type: "text",
                  required: true,
                  admin: { description: 'The deliverable, e.g. "Conditional Access policies".' },
                },
                {
                  name: "description",
                  type: "textarea",
                  required: true,
                  admin: { description: "What it means in practice, in one or two sentences." },
                },
              ],
            },
          ],
        },

        {
          label: "3 · Outcomes",
          description: 'Section headed "What Changes Once It\'s Live" — the result, not the work.',
          fields: [
            {
              name: "outcomes",
              type: "array",
              required: false,
              labels: { singular: "Outcome", plural: "Outcomes" },
              admin: {
                initCollapsed: true,
                description: "Three works best — they render as numbered rows, not cards.",
              },
              fields: [
                {
                  name: "title",
                  type: "text",
                  required: true,
                  admin: { description: 'The result, e.g. "Nobody logs in without MFA".' },
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
          label: "4 · Pricing",
          description:
            "Drives the configurator. Visitors set their headcount and see a live estimate built from these numbers.",
          fields: [
            {
              type: "row",
              fields: [
                {
                  name: "pricingMode",
                  type: "select",
                  required: true,
                  defaultValue: "per-seat",
                  options: [
                    { label: "Per user, by headcount band", value: "per-seat" },
                    { label: "Price on application (no figures shown)", value: "quote" },
                  ],
                  admin: {
                    width: "60%",
                    description:
                      'Choose "Price on application" for bespoke engagements — the configurator still collects headcount and options, but shows no numbers and submits as a scoping request.',
                  },
                },
                {
                  name: "currency",
                  type: "select",
                  required: true,
                  defaultValue: "GBP",
                  options: [
                    { label: "GBP (£)", value: "GBP" },
                    { label: "USD ($)", value: "USD" },
                    { label: "EUR (€)", value: "EUR" },
                    { label: "AED", value: "AED" },
                  ],
                  admin: { width: "40%", description: "Applies to every figure on this service." },
                },
              ],
            },
            {
              name: "seatBands",
              type: "array",
              required: false,
              labels: { singular: "Band", plural: "Bands" },
              admin: {
                initCollapsed: false,
                condition: (_, siblingData) => siblingData?.pricingMode !== "quote",
                description:
                  "The headcount ladder, cheapest per user at the top of the range. Leave the last band's max empty so it means 'and above' — otherwise a company larger than your top band falls off the end of the ladder.",
              },
              fields: [
                {
                  type: "row",
                  fields: [
                    {
                      name: "minSeats",
                      type: "number",
                      required: true,
                      min: 1,
                      admin: { width: "25%", description: "From this many users." },
                    },
                    {
                      name: "maxSeats",
                      type: "number",
                      required: false,
                      min: 1,
                      admin: {
                        width: "25%",
                        description: "Up to this many. Leave empty for 'and above'.",
                      },
                    },
                    {
                      name: "pricePerSeat",
                      type: "number",
                      required: true,
                      min: 0,
                      admin: { width: "25%", description: "Per user, per month." },
                    },
                    {
                      name: "label",
                      type: "text",
                      required: false,
                      admin: {
                        width: "25%",
                        description: 'Optional name, e.g. "Growth". Defaults to the range.',
                      },
                    },
                  ],
                },
              ],
            },
            {
              type: "row",
              admin: { condition: (_, siblingData) => siblingData?.pricingMode !== "quote" },
              fields: [
                {
                  name: "setupFee",
                  type: "number",
                  required: false,
                  min: 0,
                  defaultValue: 0,
                  admin: {
                    width: "50%",
                    description: "One-time onboarding fee, added on top of the monthly. 0 hides the line entirely.",
                  },
                },
                {
                  name: "setupFeeWaivedAtSeats",
                  type: "number",
                  required: false,
                  min: 1,
                  admin: {
                    width: "50%",
                    description:
                      "Waive the setup fee at this headcount and above. Leave empty to always charge it. A strong closer on the larger bands.",
                  },
                },
              ],
            },
            {
              type: "row",
              fields: [
                {
                  name: "minSeats",
                  type: "number",
                  required: false,
                  min: 1,
                  defaultValue: 1,
                  admin: { width: "33%", description: "Smallest headcount the slider allows." },
                },
                {
                  name: "maxSeats",
                  type: "number",
                  required: false,
                  min: 1,
                  defaultValue: 500,
                  admin: { width: "33%", description: "Largest headcount the slider allows." },
                },
                {
                  name: "defaultSeats",
                  type: "number",
                  required: false,
                  min: 1,
                  defaultValue: 25,
                  admin: {
                    width: "33%",
                    description: "Where the slider starts. Set it near your typical customer.",
                  },
                },
              ],
            },
            {
              name: "billingNote",
              type: "textarea",
              required: false,
              admin: {
                description:
                  'The small print under the total, e.g. "Estimate excludes Microsoft licence costs. 12-month term, billed monthly." Say what the number does NOT include — it prevents the awkward first call.',
              },
            },
          ],
        },

        {
          label: "5 · Options",
          description:
            "Tick-boxes in the configurator that adjust the estimate — upsells, and scope the visitor chooses.",
          fields: [
            {
              name: "options",
              type: "array",
              required: false,
              labels: { singular: "Option", plural: "Options" },
              admin: {
                initCollapsed: true,
                description:
                  "Each row is a checkbox on the page. Anything ticked at submit is recorded on the request, so you see exactly what was configured.",
              },
              fields: [
                {
                  name: "name",
                  type: "text",
                  required: true,
                  admin: { description: 'The option, e.g. "Teams Phone rollout".' },
                },
                {
                  name: "description",
                  type: "textarea",
                  required: true,
                  admin: { description: "One line on what it adds. Shown under the name." },
                },
                {
                  type: "row",
                  fields: [
                    {
                      name: "priceType",
                      type: "select",
                      required: true,
                      defaultValue: "per-seat-monthly",
                      options: [
                        { label: "Per user, per month", value: "per-seat-monthly" },
                        { label: "Flat, per month", value: "monthly-flat" },
                        { label: "One-time", value: "one-time" },
                      ],
                      admin: { width: "50%" },
                    },
                    {
                      name: "amount",
                      type: "number",
                      required: true,
                      min: 0,
                      admin: { width: "25%", description: "The figure." },
                    },
                    {
                      name: "defaultSelected",
                      type: "checkbox",
                      defaultValue: false,
                      admin: { width: "25%", description: "Ticked on page load." },
                    },
                  ],
                },
              ],
            },
          ],
        },

        {
          label: "6 · FAQ",
          description: "Answers the objections that stop a visitor submitting. Optional but high-leverage.",
          fields: [
            {
              name: "faqs",
              type: "array",
              required: false,
              labels: { singular: "Question", plural: "Questions" },
              admin: {
                initCollapsed: true,
                description:
                  "Write the questions people actually ask on the first call — contract length, what happens to existing licences, who does the work.",
              },
              fields: [
                { name: "question", type: "text", required: true },
                { name: "answer", type: "textarea", required: true },
              ],
            },
          ],
        },

        {
          label: "7 · Closing CTA",
          description: "The final block, under the configurator.",
          fields: [
            {
              name: "ctaHeadline",
              type: "textarea",
              required: false,
              admin: {
                description: "Closing headline. Press Enter to control where it wraps. Leave blank for the default.",
              },
            },
            {
              name: "ctaSubtext",
              type: "textarea",
              required: false,
              admin: { description: "One supporting line. Say what the visitor gets, not what we do." },
            },
          ],
        },

        {
          label: "Listing & SEO",
          description:
            "Not shown in the page body — this is the card on the /solutions hub and the search-engine description.",
          fields: [
            {
              name: "summary",
              type: "textarea",
              required: true,
              admin: {
                description:
                  "Shown on the /solutions card, and used as the page's meta description. Aim for 150–160 characters so search engines don't truncate it.",
              },
            },
            {
              name: "bestFor",
              type: "text",
              required: false,
              admin: {
                description: 'The "Best for:" line on the hub card, e.g. "New tenants & startups".',
              },
            },
            {
              name: "highlights",
              type: "array",
              required: false,
              maxRows: 6,
              labels: { singular: "Highlight", plural: "Highlights" },
              admin: {
                description: "The small chips on the hub card. Four or five keeps the card compact.",
              },
              fields: [{ name: "label", type: "text", required: true }],
            },
          ],
        },
      ],
    },
  ],
}
