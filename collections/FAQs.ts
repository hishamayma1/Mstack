import type { CollectionConfig } from "payload"
import { revalidateOnChange } from "./revalidate"

const CATEGORY_OPTIONS = ["General", "Security", "Industries", "Pricing", "Support"] as const

// Powers the FAQ accordion on both the homepage and /resources. Only
// "Published" entries are fetched by the site (lib/payload-resources.ts).
export const FAQs: CollectionConfig = {
  slug: "faqs",
  // Without this, Payload title-cases the slug and renders "Faqs" everywhere.
  labels: { singular: "FAQ", plural: "FAQs" },
  admin: {
    group: "Resources",
    useAsTitle: "question",
    defaultColumns: ["question", "category", "status", "order"],
    description: "Questions shown in the FAQ accordion on the homepage and /resources.",
  },
  access: {
    read: () => true,
  },
  hooks: revalidateOnChange("faqs"),
  fields: [
    { name: "question", type: "text", required: true },
    {
      name: "answer",
      type: "textarea",
      required: true,
      admin: { description: "Short, always-visible summary shown when the question is expanded." },
    },
    {
      name: "points",
      type: "array",
      required: false,
      labels: { singular: "Point", plural: "Points" },
      fields: [{ name: "point", type: "text", required: true }],
    },
    {
      name: "category",
      type: "select",
      required: true,
      defaultValue: "General",
      options: CATEGORY_OPTIONS.map((label) => ({ label, value: label })),
      admin: { description: "Drives the category filter on /resources." },
    },
    {
      name: "order",
      type: "number",
      required: false,
      defaultValue: 0,
      admin: { description: "Lower numbers show first. Ties fall back to creation order." },
    },
    {
      name: "status",
      type: "select",
      required: true,
      // Every site query filters on status: "published".
      index: true,
      defaultValue: "draft",
      options: [
        { label: "Draft", value: "draft" },
        { label: "Published", value: "published" },
      ],
      admin: { position: "sidebar" },
    },
  ],
}
