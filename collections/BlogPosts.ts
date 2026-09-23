import type { CollectionConfig } from "payload"
import { revalidateTag } from "next/cache"
import {
  BlocksFeature,
  CodeBlock,
  EXPERIMENTAL_TableFeature,
  FixedToolbarFeature,
  lexicalEditor,
} from "@payloadcms/richtext-lexical"
import { BLOG_BLOCKS } from "./blog-blocks"

const TAG_OPTIONS = ["Security", "SharePoint", "Automation", "Power Platform", "Migration", "General"] as const

// Cached reads in lib/cms/blog.ts are tagged "blog-posts". Marking the tag
// stale on every save means a published edit shows up on the next visit
// instead of after the cacheLife window. `profile: "max"` is
// stale-while-revalidate, so the visitor who triggers the refresh still gets
// an instant response. Wrapped because this also runs from the onInit seed,
// outside any request, where there is no cache to revalidate.
function revalidateBlog() {
  try {
    revalidateTag("blog-posts", "max")
  } catch {
    // Not in a request context (seed / CLI) — nothing cached to invalidate.
  }
}

// Articles for /blog and /blog/[slug]. Only "Published" entries are fetched
// by the site (lib/cms/blog.ts).
export const BlogPosts: CollectionConfig = {
  slug: "blog-posts",
  admin: {
    group: "Resources",
    useAsTitle: "title",
    defaultColumns: ["title", "tag", "featured", "status", "publishedDate"],
    description: "Articles shown on /blog. Each one gets its own page at /blog/[slug].",
  },
  access: {
    read: () => true,
  },
  hooks: {
    afterChange: [revalidateBlog],
    afterDelete: [revalidateBlog],
  },
  fields: [
    { name: "title", type: "text", required: true },
    {
      name: "slug",
      type: "text",
      required: true,
      unique: true,
      index: true,
      admin: { description: "URL-safe identifier, e.g. \"security-audit-signs\" → /blog/security-audit-signs." },
    },
    {
      name: "excerpt",
      type: "textarea",
      required: true,
      admin: { description: "One or two sentences. Shown on cards, under the article title, and as the search snippet." },
    },
    {
      name: "tag",
      type: "select",
      required: true,
      options: TAG_OPTIONS.map((label) => ({ label, value: label })),
      admin: { description: "The topic. Drives the filters and topic cards on /blog." },
    },
    {
      name: "keyTakeaways",
      label: "In 30 seconds",
      type: "array",
      maxRows: 5,
      admin: { description: "Optional. Two to four one-line takeaways shown in a summary box at the top of the article." },
      fields: [{ name: "point", type: "text", required: true }],
    },
    {
      name: "body",
      type: "richText",
      required: false,
      admin: {
        description:
          "Full article. Use Heading 2 / Heading 3 for sections — they build the \"On this page\" navigation. Type \"/\" or use the + menu for blocks: steps, checklist, table, pros & cons, key numbers, FAQ, callout, quote, video, code.",
      },
      editor: lexicalEditor({
        features: ({ defaultFeatures }) => [
          ...defaultFeatures,
          FixedToolbarFeature(),
          EXPERIMENTAL_TableFeature(),
          BlocksFeature({
            blocks: [
              CodeBlock({
                defaultLanguage: "powershell",
                languages: {
                  powershell: "PowerShell",
                  bash: "Bash",
                  json: "JSON",
                  ts: "TypeScript",
                  plaintext: "Plain text",
                },
              }),
              ...BLOG_BLOCKS,
            ],
          }),
        ],
      }),
    },
    {
      name: "coverImage",
      type: "upload",
      relationTo: "media",
      required: false,
    },
    {
      name: "author",
      type: "group",
      admin: { description: "Shown under the title and in the \"Written by\" box." },
      fields: [
        { name: "name", type: "text", defaultValue: "MStack360 Team" },
        { name: "role", type: "text" },
        { name: "bio", type: "textarea" },
        { name: "linkedin", type: "text", admin: { description: "Full profile URL." } },
      ],
    },
    {
      name: "featured",
      type: "checkbox",
      defaultValue: false,
      admin: {
        position: "sidebar",
        description: "Pin to \"Start with these\" on /blog. The first featured post gets the large card.",
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
      admin: { position: "sidebar" },
    },
    {
      name: "publishedDate",
      type: "date",
      required: true,
      index: true,
      defaultValue: () => new Date().toISOString(),
      admin: { position: "sidebar", date: { pickerAppearance: "dayOnly" } },
    },
  ],
}
