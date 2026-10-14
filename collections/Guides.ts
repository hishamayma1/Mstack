import type { CollectionConfig } from "payload"
import { revalidateOnChange } from "./revalidate"

const TAG_OPTIONS = ["Security", "Migration", "Power Platform", "Governance", "General"] as const

// Downloadable guides/checklists shown in the "Guides & Checklists" section
// of /resources. Only "Published" entries are fetched by the site.
export const Guides: CollectionConfig = {
  slug: "guides",
  admin: {
    group: "Resources",
    useAsTitle: "title",
    defaultColumns: ["title", "tag", "status", "publishedDate"],
    description: "Downloadable guides shown in the Guides section of /resources.",
  },
  access: {
    read: () => true,
  },
  hooks: revalidateOnChange("guides"),
  fields: [
    { name: "title", type: "text", required: true },
    {
      name: "slug",
      type: "text",
      required: true,
      unique: true,
      admin: { description: "URL-safe identifier, e.g. \"security-checklist\"." },
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
      name: "downloadUrl",
      type: "text",
      required: false,
      admin: { description: "Link to the hosted PDF/file. Leave blank if not yet available — the card just won't show a download link." },
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
    {
      name: "publishedDate",
      type: "date",
      required: true,
      defaultValue: () => new Date().toISOString(),
      admin: { position: "sidebar", date: { pickerAppearance: "dayOnly" } },
    },
  ],
}
