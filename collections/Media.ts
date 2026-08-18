import type { CollectionConfig } from "payload"

// Upload-enabled collection for images/files used elsewhere in Payload
// (e.g. as a relationship field on future content collections).
export const Media: CollectionConfig = {
  slug: "media",
  admin: {
    group: "System",
    useAsTitle: "alt",
    description: "Images and files used across the site. Uploaded once, reused anywhere.",
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
    staticDir: "media",
    imageSizes: [
      { name: "thumbnail", width: 400, height: 300, position: "centre" },
      { name: "card", width: 768, height: 1024, position: "centre" },
    ],
    adminThumbnail: "thumbnail",
    mimeTypes: ["image/*"],
  },
}
