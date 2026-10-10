import type { CollectionBeforeChangeHook, Field } from "payload"
import { isManagerOrAdmin, managersOnlyField } from "./access"

// The account that wrote a blog post or case study. Set automatically to
// whoever creates the document; only managers and administrators can
// reassign it afterwards (or pick someone else while creating).
export const createdByField: Field = {
  name: "createdBy",
  label: "Author",
  type: "relationship",
  relationTo: "users",
  index: true,
  access: {
    create: managersOnlyField,
    update: managersOnlyField,
  },
  admin: {
    position: "sidebar",
    description: "Set to your account when you create this. Managers and administrators can reassign it.",
    components: { Cell: "/components/admin/people-cell#PeopleCell" },
  },
}

// Teammates tagged on a blog post. Anyone who can edit the post can tag anyone
// with an account; they're shown with their photo on the article.
export const mentionsField: Field = {
  name: "mentions",
  label: "Mentioned people",
  type: "relationship",
  relationTo: "users",
  hasMany: true,
  admin: {
    description:
      "Tag teammates who worked on or are featured in this article. They're shown with their photo and title on the post.",
    components: { Cell: "/components/admin/people-cell#PeopleCell" },
  },
}

const idOf = (value: unknown): string | number | undefined =>
  value && typeof value === "object" ? (value as { id?: string | number }).id : (value as string | number | undefined)

/**
 * Stamps the signed-in user as the author on create. Editors can't set the
 * field (field access strips it), so for them it's always their own account;
 * a manager or admin who picked someone else keeps their choice.
 */
export const stampCreatedBy: CollectionBeforeChangeHook = ({ data, operation, req }) => {
  if (operation !== "create" || !req.user) return data
  if (!data.createdBy || !isManagerOrAdmin(req.user)) data.createdBy = req.user.id
  return data
}

/**
 * Keeps a blog post's public "Written by" byline in step with its author
 * account. On create, blank byline fields are filled from the account's
 * profile; when the author is reassigned, the byline is replaced with the new
 * account's profile. Text typed into the byline by hand otherwise wins.
 */
export const fillBylineFromAuthor: CollectionBeforeChangeHook = async ({ data, operation, originalDoc, req }) => {
  const authorId = idOf(data.createdBy)
  if (!authorId) return data

  const reassigned = operation === "update" && authorId !== idOf(originalDoc?.createdBy)
  if (operation !== "create" && !reassigned) return data

  const user = await req.payload
    .findByID({ collection: "users", id: authorId, depth: 0, req, overrideAccess: true })
    .catch(() => null)
  if (!user) return data

  const profile = {
    name: user.name?.trim() || "",
    role: user.jobTitle?.trim() || "",
    bio: user.bio?.trim() || "",
    linkedin: user.linkedin?.trim() || "",
  }
  const byline: Record<string, unknown> = { ...(data.author ?? {}) }
  for (const key of Object.keys(profile) as (keyof typeof profile)[]) {
    const typed = typeof byline[key] === "string" ? (byline[key] as string).trim() : ""
    if (reassigned || !typed) byline[key] = profile[key]
  }
  data.author = byline
  return data
}
