"use client"

import { useAuth } from "@payloadcms/ui"
import { usePathname } from "next/navigation"
import { useEffect, useState } from "react"
import { mediaUrl, relationId } from "@/lib/people"
import { AvatarBadge } from "./avatar-badge"

// Replaces Payload's generic account icon (top-right of every dashboard page)
// with the signed-in user's photo, via `admin.avatar.Component`.

type AvatarUser = { name?: string | null; email?: string | null; avatar?: unknown }

/**
 * The signed-in user's avatar url. The auth user usually carries `avatar` as a
 * bare id, so it's looked up once through the public Media API.
 */
function useAvatarUrl(avatar: unknown): string | null {
  const direct = mediaUrl(avatar)
  const id = direct ? null : relationId(avatar)
  const [fetched, setFetched] = useState<{ id: string; url: string | null } | null>(null)

  useEffect(() => {
    if (!id) return
    let live = true
    fetch(`/api/media/${encodeURIComponent(id)}?depth=0`, { credentials: "include" })
      .then((res) => (res.ok ? res.json() : null))
      .then((doc) => {
        if (live) setFetched({ id, url: mediaUrl(doc) })
      })
      .catch(() => {})
    return () => {
      live = false
    }
  }, [id])

  return direct ?? (fetched && fetched.id === id ? fetched.url : null)
}

export function AccountAvatar() {
  const { user } = useAuth<AvatarUser>()
  const pathname = usePathname()
  const url = useAvatarUrl(user?.avatar)
  const name = user?.name?.trim() || user?.email || "Account"

  return (
    <AvatarBadge
      name={name}
      url={url}
      size="sm"
      className={pathname?.endsWith("/account") ? "mstack-avatar--active" : ""}
    />
  )
}
