// Which accent hue each service wears. The hues themselves live in
// app/(frontend)/globals.css under [data-svc='…']; this file only decides
// which service gets which, so the mapping can change without touching CSS.
//
// Picked by meaning where there is one (security reads green, compliance reads
// red, AI reads magenta) and otherwise spread around the wheel so no two
// neighbouring cards on /solutions share a family.

export type ServiceTheme =
  | "blue"
  | "sky"
  | "emerald"
  | "violet"
  | "fuchsia"
  | "orange"
  | "rose"
  | "teal"
  | "amber"

const THEMES: ServiceTheme[] = [
  "blue",
  "sky",
  "emerald",
  "violet",
  "fuchsia",
  "orange",
  "rose",
  "teal",
  "amber",
]

const BY_SLUG: Record<string, ServiceTheme> = {
  "core-365": "blue",
  "cloud-365": "sky",
  "secure-365": "emerald",
  "managed-365": "violet",
  "intelligent-365": "fuchsia",
  migration: "orange",
  "security-compliance": "rose",
  "sharepoint-support": "teal",
  "teams-phone": "amber",
}

/**
 * The theme for a service. A service added in /admin that isn't listed above
 * still gets a stable colour — hashed from its slug — rather than falling back
 * to the brand blue every new card would otherwise share.
 */
export function serviceTheme(slug: string): ServiceTheme {
  const known = BY_SLUG[slug]
  if (known) return known

  let hash = 0
  for (const char of slug) hash = (hash * 31 + char.charCodeAt(0)) >>> 0
  return THEMES[hash % THEMES.length]
}
