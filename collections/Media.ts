import type { CollectionConfig } from "payload"

// Every upload is compressed and converted to WebP by sharp on the server
// *before* it is stored. Files are stored on the UploadThing CDN (see the
// uploadthingStorage plugin in payload.config.ts), so only the optimised WebP
// versions ever reach it — never the original JPEG/PNG.
//
// Uploads go through the server rather than straight from the browser so that
// conversion always happens first. On Vercel that caps a single upload at the
// 4.5 MB function request limit.
const WEBP = { format: "webp", options: { quality: 80, effort: 4 } } as const

export const Media: CollectionConfig = {
  slug: "media",
  admin: {
    group: "System",
    useAsTitle: "alt",
    // "filename" renders as the image preview + file name in the list table.
    defaultColumns: ["filename", "alt", "filesize", "width", "height", "updatedAt"],
    description:
      "Images used across the site. Uploaded once, reused anywhere. Every image is compressed and converted to WebP automatically.",
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: "alt",
      type: "text",
      required: true,
    },
  ],
  upload: {
    // Only used if the UploadThing plugin is disabled (no token set).
    staticDir: "media",
    mimeTypes: ["image/*"],
    // One file per upload: the image itself, resized in place to at most
    // 2560px wide (never enlarged) and saved as WebP. No extra size copies.
    resizeOptions: { width: 2560, withoutEnlargement: true },
    formatOptions: WEBP,
    // The dashboard's previews use that same compressed file.
    adminThumbnail: ({ doc }) => (typeof doc.url === "string" ? doc.url : null),
  },
}
