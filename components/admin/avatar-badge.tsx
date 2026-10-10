import { initials } from "@/lib/people"

// A round avatar for the dashboard: the account's photo, or their initials on
// the brand gradient when they haven't uploaded one. No hooks, so it renders
// in both server cells and client components.
export function AvatarBadge({
  name,
  url,
  size = "md",
  className = "",
}: {
  name: string
  url: string | null
  size?: "xs" | "sm" | "md" | "lg"
  className?: string
}) {
  return (
    <span className={`mstack-avatar mstack-avatar--${size} ${className}`.trim()} title={name}>
      {url ? (
        // eslint-disable-next-line @next/next/no-img-element -- CDN image inside Payload's admin
        <img src={url} alt="" loading="lazy" decoding="async" />
      ) : (
        <span aria-hidden="true">{initials(name)}</span>
      )}
    </span>
  )
}
