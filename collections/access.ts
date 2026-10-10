import type { Access, FieldAccess, PayloadRequest, Where } from "payload"

// Dashboard roles, highest first.
//   admin   — everything, including creating other admins.
//   manager — manages the team: creates accounts (manager or editor), edits
//             and removes non-admin accounts.
//   editor  — writes content; can only edit their own account.
export const ROLES = ["admin", "manager", "editor"] as const
export type Role = (typeof ROLES)[number]

export const ROLE_LABELS: Record<Role, string> = {
  admin: "Administrator",
  manager: "Manager",
  editor: "Editor",
}

export const DEFAULT_ROLE: Role = "editor"

type MaybeUser = { id?: string | number; role?: string | null } | null | undefined

export const roleOf = (user: MaybeUser): Role | null =>
  user && ROLES.includes(user.role as Role) ? (user.role as Role) : null

export const isAdmin = (user: MaybeUser) => roleOf(user) === "admin"
export const isManagerOrAdmin = (user: MaybeUser) => {
  const role = roleOf(user)
  return role === "admin" || role === "manager"
}

/** Roles the signed-in user may hand out. Managers can't create admins. */
export function assignableRoles(req: PayloadRequest): Role[] {
  if (isAdmin(req.user)) return [...ROLES]
  if (isManagerOrAdmin(req.user)) return ["manager", "editor"]
  return []
}

// ── Collection access ────────────────────────────────────────────────────────

export const signedIn: Access = ({ req }) => Boolean(req.user)

export const managersOnly: Access = ({ req }) => isManagerOrAdmin(req.user)

/** Admins: anyone. Managers: any non-admin, plus themselves. Editors: themselves. */
export const manageUsers: Access = ({ req }): boolean | Where => {
  const { user } = req
  if (!user) return false
  if (isAdmin(user)) return true
  if (isManagerOrAdmin(user)) {
    return { or: [{ role: { not_equals: "admin" } }, { id: { equals: user.id } }] }
  }
  return { id: { equals: user.id } }
}

/** Admins: anyone but themselves. Managers: non-admins but themselves. */
export const removeUsers: Access = ({ req }): boolean | Where => {
  const { user } = req
  if (!user) return false
  if (isAdmin(user)) return { id: { not_equals: user.id } }
  if (isManagerOrAdmin(user)) {
    return { and: [{ role: { not_equals: "admin" } }, { id: { not_equals: user.id } }] }
  }
  return false
}

// ── Field access ─────────────────────────────────────────────────────────────

export const managersOnlyField: FieldAccess = ({ req }) => isManagerOrAdmin(req.user)
