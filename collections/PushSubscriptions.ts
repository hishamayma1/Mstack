import type { CollectionConfig } from "payload"

// One row per browser that has opted in to push notifications.
//
// A "subscription" is what the browser hands back when someone grants
// notification permission: an endpoint URL on that browser vendor's push
// service (Google, Mozilla, Apple), plus two keys used to encrypt the payload
// so the push service can relay it without being able to read it. Sending a
// notification means POSTing to that endpoint — which is why this is free:
// the push services are run by the browser vendors at no charge, and nothing
// here talks to a paid third party.
//
// Rows are written by the admin's own client through Payload's REST API, so
// no custom endpoint is needed. Access is restricted to logged-in users; this
// is staff-only, unlike the public-facing service-requests form.
export const PushSubscriptions: CollectionConfig = {
  slug: "push-subscriptions",
  labels: { singular: "Push Device", plural: "Push Devices" },
  admin: {
    group: "System",
    useAsTitle: "label",
    defaultColumns: ["label", "user", "createdAt"],
    description:
      "Browsers signed up for new-request alerts. Turn notifications on from the dashboard rather than adding rows here.",
    // The rows are opaque key material — useful to see and revoke, not to edit.
    hidden: false,
  },
  access: {
    read: ({ req }) => Boolean(req.user),
    create: ({ req }) => Boolean(req.user),
    update: ({ req }) => Boolean(req.user),
    delete: ({ req }) => Boolean(req.user),
  },
  fields: [
    {
      name: "endpoint",
      type: "text",
      required: true,
      unique: true,
      index: true,
      admin: {
        readOnly: true,
        description:
          "The browser's push-service URL. Unique, so re-enabling on the same browser updates this row instead of creating duplicates.",
      },
    },
    {
      name: "p256dh",
      type: "text",
      required: true,
      admin: { readOnly: true, description: "Public key used to encrypt the payload." },
    },
    {
      name: "auth",
      type: "text",
      required: true,
      admin: { readOnly: true, description: "Auth secret used to encrypt the payload." },
    },
    {
      name: "label",
      type: "text",
      required: false,
      admin: {
        description: 'Which browser this is, e.g. "Chrome on Windows". Set automatically.',
      },
    },
    {
      name: "user",
      type: "relationship",
      relationTo: "users",
      required: false,
      admin: { readOnly: true, description: "Who enabled notifications on this device." },
    },
  ],
}
