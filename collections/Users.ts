import type { CollectionConfig } from "payload"

// Auth-enabled collection — this is what powers /admin login. Left blank
// beyond the auth requirement; add fields (role, name, etc.) as needed.
export const Users: CollectionConfig = {
  slug: "users",
  admin: {
    group: "System",
    useAsTitle: "email",
    description: "Everyone who can sign in to this dashboard.",
  },
  auth: true,
  fields: [],
}
