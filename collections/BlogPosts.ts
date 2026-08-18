import type { CollectionConfig } from "payload"

const TAG_OPTIONS = ["Security", "SharePoint", "Automation", "Power Platform", "Migration", "General"] as const

// Articles shown in the "From the Blog" section of /resources. Only
// "Published" entries are fetched by the site (lib/payload-resources.ts).
export const BlogPosts: CollectionConfig = {
  slug: "blog-posts",
  admin: {
    group: "Resources",
    useAsTitle: "title",
    defaultColumns: ["title", "tag", "status", "publishedDate"],
    description: "Articles shown in the Blog section of /resources.",
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
      admin: { description: "URL-safe identifier, e.g. \"security-audit-signs\"." },
    },
    {
      name: "excerpt",
      type: "textarea",
      required: true,
      admin: { description: "Short summary shown on the card." },
    },
    {
      name: "tag",
      type: "select",
      required: true,
      options: TAG_OPTIONS.map((label) => ({ label, value: label })),
      admin: { description: "Drives the tag filter on /resources." },
    },
    {
      name: "body",
      type: "richText",
      required: false,
      admin: { description: "Full article body — reserved for a future article detail page." },
    },
    {
      name: "coverImage",
      type: "upload",
      relationTo: "media",
      required: false,
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
