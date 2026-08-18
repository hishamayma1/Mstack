import type { CollectionConfig } from "payload"

const TAG_OPTIONS = ["Calculator", "Assessment", "Scorecard", "General"] as const

// Free interactive tools shown in the "Calculators & Scorecards" section of
// /resources. Only "Published" entries are fetched by the site.
export const Tools: CollectionConfig = {
  slug: "tools",
  admin: {
    group: "Resources",
    useAsTitle: "title",
    defaultColumns: ["title", "tag", "status", "publishedDate"],
    description: "Free tools shown in the Tools section of /resources.",
  },
  access: {
    read: () => true,
  },
  fields: [
    { name: "title", type: "text", required: true },
    {
      name: "slug",
      type: "text",
      required: true,
      unique: true,
      admin: { description: "URL-safe identifier, e.g. \"license-calculator\"." },
    },
    {
      name: "description",
      type: "textarea",
      required: true,
    },
    {
      name: "tag",
      type: "select",
      required: true,
      options: TAG_OPTIONS.map((label) => ({ label, value: label })),
      admin: { description: "Drives the tag filter on /resources." },
    },
    {
      name: "url",
      type: "text",
      required: false,
      admin: { description: "Link to the tool itself, if it lives at its own URL. Leave blank if it's not live yet." },
    },
    {
      name: "status",
      type: "select",
      required: true,
      defaultValue: "draft",
      options: [
        { label: "Draft", value: "draft" },
        { label: "Published", value: "published" },
      ],
      admin: { position: "sidebar" },
    },
    {
      name: "publishedDate",
      type: "date",
      required: true,
      defaultValue: () => new Date().toISOString(),
      admin: { position: "sidebar", date: { pickerAppearance: "dayOnly" } },
    },
  ],
}
