import { APIError, type CollectionConfig } from "payload"
import { revalidateTag } from "next/cache"
import {
  DEFAULT_ROLE,
  ROLES,
  ROLE_LABELS,
  assignableRoles,
  managersOnly,
  managersOnlyField,
  manageUsers,
  removeUsers,
  signedIn,
  type Role,
} from "./access"

// Auth-enabled collection — this is what powers /admin login.
//
// Only managers and administrators can create accounts (see collections/access.ts
// for what each role may do). A new account gets the Editor role unless a
// different one is picked. The very first account — created on the
// "create first user" screen of a fresh database — is always an Administrator.
//
// The profile fields double as the public byline: when someone creates a blog
// post or case study, its author is set to their account, and a blog post's
// "Written by" box is filled from the name / job title / bio / LinkedIn here.
// The avatar is shown in the dashboard (account icon, tables) and on blog
// posts the person wrote or is mentioned in.

// Blog pages read authors' and mentioned people's photos and names at render
// time from the "blog-posts" cache, so a profile edit has to mark it stale.
function revalidateBlog() {
  try {
    revalidateTag("blog-posts", "max")
  } catch {
    // Not in a request context (seed / CLI) — nothing cached to invalidate.
  }
}

export const Users: CollectionConfig = {
  slug: "users",
  admin: {
    group: "System",
    useAsTitle: "name",
    defaultColumns: ["name", "email", "role", "jobTitle"],
    description: "Everyone who can sign in to this dashboard. Only managers and administrators can add accounts.",
  },
  auth: true,
  access: {
    read: signedIn,
    create: managersOnly,
    update: manageUsers,
    delete: removeUsers,
  },
  hooks: {
    beforeChange: [
      async ({ data, operation, req }) => {
        if (operation !== "create") return data
        // A find, not payload.count: an unfiltered count becomes Mongo's
        // estimatedDocumentCount, which is not allowed inside the transaction
        // Payload wraps every create in.
        const { docs } = await req.payload.find({
          collection: "users",
          limit: 1,
          depth: 0,
          pagination: false,
          req,
        })
        if (docs.length === 0) data.role = "admin"
        return data
      },
    ],
    afterChange: [revalidateBlog],
    afterDelete: [revalidateBlog],
  },
  fields: [
    {
      name: "name",
      type: "text",
      validate: (value: string | null | undefined, { operation }: { operation?: string }) =>
        operation === "create" && !value?.trim() ? "A name is required." : true,
      admin: {
        description: "Full name. Shown as the author on blog posts and case studies.",
        components: { Cell: "/components/admin/user-name-cell#UserNameCell" },
      },
    },
    {
      name: "avatar",
      label: "Photo",
      type: "upload",
      relationTo: "media",
      filterOptions: { mimeType: { contains: "image" } },
      admin: {
        position: "sidebar",
        description:
          "A square photo works best. Shown on your account icon, in the dashboard tables, and on blog posts you write or are mentioned in. Initials are shown until one is added.",
      },
    },
    {
      name: "role",
      type: "select",
      required: true,
      defaultValue: DEFAULT_ROLE,
      saveToJWT: true,
      index: true,
      options: ROLES.map((value) => ({ label: ROLE_LABELS[value], value })),
      // Hide the roles this user can't hand out. Payload also validates the
      // saved value against this list, so it always keeps the account's current
      // role (an editor saving their own profile) and allows everything with no
      // signed-in user (first-user signup, seed). The hook below is the real check.
      filterOptions: ({ options, req, siblingData }) => {
        if (!req.user) return options
        const allowed: string[] = assignableRoles(req)
        const current = (siblingData as { role?: string } | undefined)?.role
        return options.filter((o) => {
          const value = typeof o === "string" ? o : o.value
          return allowed.includes(value) || value === current
        })
      },
      access: {
        create: managersOnlyField,
        update: managersOnlyField,
      },
      hooks: {
        beforeChange: [
          async ({ value, originalDoc, req }) => {
            // Local API / seed / first-user registration run without a user.
            if (!req.user) return value
            if (value === originalDoc?.role) return value
            if (!assignableRoles(req).includes(value as Role)) {
              throw new APIError(`You can't give an account the "${value}" role.`, 403, null, true)
            }
            // Never leave the dashboard without an Administrator.
            if (originalDoc?.role === "admin") {
              const { totalDocs } = await req.payload.count({
                collection: "users",
                where: { role: { equals: "admin" } },
                req,
              })
              if (totalDocs <= 1) {
                throw new APIError("This is the last Administrator. Make another account an Administrator first.", 400, null, true)
              }
            }
            return value
          },
        ],
      },
      admin: {
        position: "sidebar",
        description:
          "Administrator: full access. Manager: can add and manage non-admin accounts. Editor (default): writes content, edits only their own account.",
      },
    },
    {
      name: "jobTitle",
      type: "text",
      admin: { description: 'e.g. "Microsoft 365 Consultant". Shown next to the name in the blog "Written by" box.' },
    },
    {
      name: "bio",
      type: "textarea",
      admin: { description: "A sentence or two for the blog \"Written by\" box." },
    },
    {
      name: "linkedin",
      type: "text",
      admin: { description: "Full LinkedIn profile URL." },
    },
  ],
}
