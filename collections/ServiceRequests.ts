import type { CollectionConfig } from "payload"
import { notifyNewServiceRequest } from "@/lib/notify/service-request"

// Your inbox. One document per configurator submission from a
// /solutions/[slug] page: who they are, what they configured, and what it
// priced at — then a status you move through as you work the lead.
//
// Access, deliberately:
//
//   create: () => false     The public form does NOT write through this. It
//                           goes through the server action in
//                           app/(frontend)/solutions/[slug]/actions.ts, which
//                           uses Payload's Local API — and the Local API
//                           bypasses access control. So the form keeps working
//                           while the REST endpoint stays shut, and nobody can
//                           spray fabricated leads at /api/service-requests.
//   read/update/delete      Logged-in admin users only. These documents hold
//                           names, work emails and phone numbers.
//
// Almost every field is read-only in the admin UI. They're a *snapshot* of
// what the visitor submitted and what the pricing engine computed at that
// moment — editing them after the fact would quietly rewrite the record of
// what someone was actually shown. Status, owner and internal notes are the
// fields meant to be edited, and they sit in the sidebar and the last tab.
export const ServiceRequests: CollectionConfig = {
  slug: "service-requests",
  admin: {
    useAsTitle: "companyName",
    defaultColumns: ["companyName", "serviceTitle", "seats", "estimatedMonthly", "status", "createdAt"],
    description:
      "Quote requests submitted from the service pages. Work them top to bottom: New → Reviewing → Contacted → Won/Lost.",
    group: "Sales",
  },
  // Newest first — this list is a queue, not an archive.
  defaultSort: "-createdAt",

  hooks: {
    // Alerts live here rather than in the submit action so they fire however a
    // request is created, and so the action stays about validating and pricing.
    //
    // `afterChange` runs once the document is committed, so an alert can never
    // announce a lead that failed to save. The notifier swallows its own
    // errors — this hook is awaited, and anything thrown here would roll the
    // submission back and show the visitor a failure for an email problem.
    afterChange: [
      async ({ doc, operation, req }) => {
        if (operation !== "create") return
        await notifyNewServiceRequest(req.payload, doc)
      },
    ],
  },
  access: {
    create: () => false,
    read: ({ req }) => Boolean(req.user),
    update: ({ req }) => Boolean(req.user),
    delete: ({ req }) => Boolean(req.user),
  },
  fields: [
    // ── Sidebar: the only fields you routinely change ───────────────────────
    {
      name: "status",
      type: "select",
      required: true,
      defaultValue: "new",
      index: true,
      options: [
        { label: "New", value: "new" },
        { label: "Reviewing", value: "reviewing" },
        { label: "Contacted", value: "contacted" },
        { label: "Proposal Sent", value: "proposal-sent" },
        { label: "Won", value: "won" },
        { label: "Lost", value: "lost" },
      ],
      admin: {
        position: "sidebar",
        description: "Where this lead is in your pipeline.",
      },
    },
    {
      name: "owner",
      type: "relationship",
      relationTo: "users",
      required: false,
      admin: {
        position: "sidebar",
        description: "Who on the team is handling this.",
      },
    },

    {
      type: "tabs",
      tabs: [
        {
          label: "1 · Contact",
          description: "Who submitted this, and how to reach them.",
          fields: [
            {
              type: "row",
              fields: [
                { name: "fullName", type: "text", required: true, admin: { width: "50%", readOnly: true } },
                {
                  name: "workEmail",
                  type: "email",
                  required: true,
                  index: true,
                  admin: { width: "50%", readOnly: true },
                },
              ],
            },
            {
              type: "row",
              fields: [
                { name: "companyName", type: "text", required: true, admin: { width: "50%", readOnly: true } },
                { name: "jobTitle", type: "text", required: false, admin: { width: "50%", readOnly: true } },
              ],
            },
            {
              type: "row",
              fields: [
                { name: "phone", type: "text", required: false, admin: { width: "50%", readOnly: true } },
                {
                  name: "preferredStart",
                  type: "select",
                  required: false,
                  options: [
                    { label: "As soon as possible", value: "asap" },
                    { label: "Within 1–3 months", value: "1-3-months" },
                    { label: "In 3–6 months", value: "3-6-months" },
                    { label: "Just exploring", value: "exploring" },
                  ],
                  admin: { width: "50%", readOnly: true, description: "How warm this is." },
                },
              ],
            },
            {
              name: "message",
              type: "textarea",
              required: false,
              admin: { readOnly: true, description: "Anything they typed in the notes box." },
            },
          ],
        },

        {
          label: "2 · Configured Plan",
          description:
            "Exactly what they built on the page. Figures are recomputed server-side at submit — they are not taken from the browser.",
          fields: [
            {
              name: "service",
              type: "relationship",
              relationTo: "services",
              required: false,
              admin: {
                readOnly: true,
                description: "The service page this came from. Empty only if that service was later deleted.",
              },
            },
            {
              type: "row",
              fields: [
                {
                  name: "serviceTitle",
                  type: "text",
                  required: true,
                  admin: {
                    width: "50%",
                    readOnly: true,
                    description: "Name at time of submission, kept even if the service is renamed or removed.",
                  },
                },
                {
                  name: "serviceSlug",
                  type: "text",
                  required: false,
                  admin: { width: "50%", readOnly: true },
                },
              ],
            },
            {
              type: "row",
              fields: [
                {
                  name: "seats",
                  type: "number",
                  required: true,
                  admin: { width: "33%", readOnly: true, description: "Headcount they selected." },
                },
                {
                  name: "bandLabel",
                  type: "text",
                  required: false,
                  admin: { width: "33%", readOnly: true, description: "Which pricing band that fell into." },
                },
                {
                  name: "currency",
                  type: "text",
                  required: false,
                  admin: { width: "33%", readOnly: true },
                },
              ],
            },
            {
              type: "row",
              fields: [
                {
                  name: "estimatedMonthly",
                  type: "number",
                  required: false,
                  admin: {
                    width: "50%",
                    readOnly: true,
                    description: "Recurring estimate shown to them, in the currency above.",
                  },
                },
                {
                  name: "estimatedOneTime",
                  type: "number",
                  required: false,
                  admin: { width: "50%", readOnly: true, description: "One-time setup and one-off options." },
                },
              ],
            },
            {
              name: "priceOnApplication",
              type: "checkbox",
              defaultValue: false,
              admin: {
                readOnly: true,
                description: "Ticked when the service is priced on application, so the totals above are not meaningful.",
              },
            },
            {
              name: "selectedOptions",
              type: "array",
              required: false,
              labels: { singular: "Option", plural: "Options" },
              admin: { readOnly: true, description: "Every add-on they ticked, priced at submission time." },
              fields: [
                {
                  type: "row",
                  fields: [
                    { name: "name", type: "text", admin: { width: "40%" } },
                    { name: "priceType", type: "text", admin: { width: "30%" } },
                    { name: "amount", type: "number", admin: { width: "30%" } },
                  ],
                },
              ],
            },
            {
              name: "quoteBreakdown",
              type: "array",
              required: false,
              labels: { singular: "Line", plural: "Lines" },
              admin: {
                readOnly: true,
                description: "The line-by-line quote as it appeared on screen. Useful when they query the number.",
              },
              fields: [
                {
                  type: "row",
                  fields: [
                    { name: "label", type: "text", admin: { width: "40%" } },
                    { name: "detail", type: "text", admin: { width: "30%" } },
                    { name: "monthly", type: "number", admin: { width: "15%" } },
                    { name: "oneTime", type: "number", admin: { width: "15%" } },
                  ],
                },
              ],
            },
          ],
        },

        {
          label: "3 · Internal",
          description: "Your working notes. Nothing here is ever shown on the site.",
          fields: [
            {
              name: "internalNotes",
              type: "textarea",
              required: false,
              admin: { description: "Call notes, objections, what you quoted in the end." },
            },
            {
              name: "sourcePath",
              type: "text",
              required: false,
              admin: { readOnly: true, description: "The page the request was submitted from." },
            },
          ],
        },
      ],
    },
  ],
}
