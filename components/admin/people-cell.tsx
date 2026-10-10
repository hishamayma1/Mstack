import type { DefaultServerCellComponentProps } from "payload"
import { mediaUrl, relationId } from "@/lib/people"
import { AvatarBadge } from "./avatar-badge"

// Table cell for fields that point at accounts — a post's Author and its
// Mentioned people. One person shows photo + name; several show overlapping
// photos + a count. Server component: the list only populates one level, so
// the accounts' photos are looked up here.
export async function PeopleCell({ cellData, payload }: DefaultServerCellComponentProps) {
  const values = Array.isArray(cellData) ? cellData : cellData ? [cellData] : []
  const ids = values.map(relationId).filter((id): id is string => Boolean(id))
  if (ids.length === 0) return <span className="mstack-people-cell__empty">—</span>

  const { docs } = await payload
    .find({
      collection: "users",
      where: { id: { in: ids } },
      depth: 1,
      pagination: false,
      overrideAccess: true,
      select: { name: true, email: true, avatar: true },
    })
    .catch(() => ({ docs: [] as { id: string; name?: string | null; email?: string | null; avatar?: unknown }[] }))

  const people = ids
    .map((id) => docs.find((d) => String(d.id) === id))
    .filter(Boolean)
    .map((d) => ({ name: d!.name?.trim() || d!.email || "Unnamed", url: mediaUrl(d!.avatar) }))
  if (people.length === 0) return <span className="mstack-people-cell__empty">—</span>

  if (people.length === 1) {
    return (
      <span className="mstack-people-cell">
        <AvatarBadge name={people[0].name} url={people[0].url} size="xs" />
        <span className="mstack-people-cell__name">{people[0].name}</span>
      </span>
    )
  }

  const shown = people.slice(0, 4)
  return (
    <span className="mstack-people-cell" title={people.map((p) => p.name).join(", ")}>
      <span className="mstack-avatar-stack">
        {shown.map((p) => (
          <AvatarBadge key={p.name} name={p.name} url={p.url} size="xs" />
        ))}
      </span>
      <span className="mstack-people-cell__name">{people.length} people</span>
    </span>
  )
}
