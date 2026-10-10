// Small helpers shared by the dashboard and the public site for showing people
// (accounts, blog authors, mentioned teammates).

/** "Hisham Ayman" → "HA". Falls back to the first letter of an email. */
export function initials(name: string | null | undefined): string {
  const words = (name ?? "").split(/[\s@._-]+/).filter(Boolean)
  return (
    words
      .slice(0, 2)
      .map((w) => w[0]?.toUpperCase())
      .join("") || "?"
  )
}

/** The url of a populated upload field, or null when it's just an id / empty. */
export function mediaUrl(value: unknown): string | null {
  if (!value || typeof value !== "object") return null
  const url = (value as { url?: unknown }).url
  return typeof url === "string" && url ? url : null
}

/** The id of a relationship/upload value, whether populated or not. */
export function relationId(value: unknown): string | null {
  if (typeof value === "string" || typeof value === "number") return String(value)
  if (value && typeof value === "object" && "id" in value) {
    const id = (value as { id?: unknown }).id
    return typeof id === "string" || typeof id === "number" ? String(id) : null
  }
  return null
}
