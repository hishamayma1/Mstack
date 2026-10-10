import Link from "next/link"
import type { ServerProps } from "payload"
import { mediaUrl, relationId } from "@/lib/people"
import { AvatarBadge } from "./avatar-badge"
import { PushToggle } from "./push-toggle"

// Rendered above the collection cards on /admin, via
// `admin.components.beforeDashboard`.
//
// Payload's stock dashboard is a flat grid of collection cards — it tells you
// what exists, never what needs you. This puts the pipeline first: how many
// quote requests are untouched, how many are mid-conversation, and a direct
// link into each filtered list.
//
// Server component. It receives the Payload instance through ServerProps, so
// it queries directly rather than going back out over HTTP to its own API.

type StatTone = "urgent" | "active" | "neutral"

type Stat = {
  label: string
  value: number
  hint: string
  href: string
  tone: StatTone
}

/**
 * Counts are best-effort. A failure here (database blip, a collection renamed
 * mid-deploy) must not take down the whole dashboard — the collection cards
 * below this panel are the actual navigation, and they'd be lost with it.
 */
async function safeCount(fn: () => Promise<{ totalDocs: number }>): Promise<number> {
  try {
    const { totalDocs } = await fn()
    return totalDocs
  } catch {
    return 0
  }
}

export async function DashboardWelcome({ payload, user }: ServerProps) {
  const adminRoute = payload?.config?.routes?.admin ?? "/admin"
  const requestsPath = `${adminRoute}/collections/service-requests`
  const servicesPath = `${adminRoute}/collections/services`

  const [newRequests, inProgress, wonRequests, draftServices] = await Promise.all([
    safeCount(() =>
      payload.count({ collection: "service-requests", where: { status: { equals: "new" } } }),
    ),
    safeCount(() =>
      payload.count({
        collection: "service-requests",
        where: { status: { in: ["reviewing", "contacted", "proposal-sent"] } },
      }),
    ),
    safeCount(() =>
      payload.count({ collection: "service-requests", where: { status: { equals: "won" } } }),
    ),
    safeCount(() =>
      payload.count({ collection: "services", where: { status: { equals: "draft" } } }),
    ),
  ])

  // Payload's list view reads its filters from the query string, so these link
  // straight into a pre-filtered queue instead of the unfiltered collection.
  const stats: Stat[] = [
    {
      label: "New requests",
      value: newRequests,
      hint: newRequests === 0 ? "Nothing waiting" : "Waiting for a first response",
      href: `${requestsPath}?where[status][equals]=new`,
      tone: newRequests > 0 ? "urgent" : "neutral",
    },
    {
      label: "In progress",
      value: inProgress,
      hint: "Reviewing, contacted or quoted",
      href: `${requestsPath}?where[status][not_equals]=new`,
      tone: "active",
    },
    {
      label: "Won",
      value: wonRequests,
      hint: "Closed and signed",
      href: `${requestsPath}?where[status][equals]=won`,
      tone: "neutral",
    },
    {
      label: "Draft services",
      value: draftServices,
      hint: draftServices === 0 ? "All services are live" : "Not visible on the site yet",
      href: `${servicesPath}?where[status][equals]=draft`,
      tone: draftServices > 0 ? "active" : "neutral",
    },
  ]

  // `user` is typed optional on ServerProps. Greet by first name when the
  // account has one, else by the email handle.
  const profile = (user ?? {}) as { name?: string | null; email?: string | null; avatar?: unknown }
  const fullName = profile.name?.trim() || null
  const greetingName =
    fullName?.split(/\s+/)[0] ?? (typeof profile.email === "string" ? profile.email.split("@")[0] : null)

  // The auth user carries `avatar` as an id; resolve it to a URL here.
  let avatarUrl = mediaUrl(profile.avatar)
  const avatarId = avatarUrl ? null : relationId(profile.avatar)
  if (avatarId) {
    const media = await payload.findByID({ collection: "media", id: avatarId, depth: 0 }).catch(() => null)
    avatarUrl = mediaUrl(media)
  }

  return (
    <section className="mstack-dash">
      <header className="mstack-dash__header">
        <AvatarBadge name={fullName ?? profile.email ?? "You"} url={avatarUrl} size="lg" className="mstack-dash__avatar" />
        <p className="mstack-dash__eyebrow">MStack360 Dashboard</p>
        <h1 className="mstack-dash__title">
          {greetingName ? `Welcome back, ${greetingName}.` : "Welcome back."}
        </h1>
        <p className="mstack-dash__subtitle">
          {newRequests > 0
            ? `${newRequests} quote ${newRequests === 1 ? "request needs" : "requests need"} a reply.`
            : "No new quote requests. Everything is worked."}
        </p>
      </header>

      <div className="mstack-dash__stats">
        {stats.map((stat) => (
          <Link
            key={stat.label}
            href={stat.href}
            className={`mstack-stat mstack-stat--${stat.tone}`}
          >
            <span className="mstack-stat__value">{stat.value}</span>
            <span className="mstack-stat__label">{stat.label}</span>
            <span className="mstack-stat__hint">{stat.hint}</span>
          </Link>
        ))}
      </div>

      <div className="mstack-dash__actions">
        <Link className="mstack-action mstack-action--primary" href={requestsPath}>
          Open the request queue
        </Link>
        <Link className="mstack-action" href={servicesPath}>
          Edit services &amp; pricing
        </Link>
        <a className="mstack-action" href="/solutions" target="_blank" rel="noreferrer">
          View the live site ↗
        </a>
      </div>

      {/* The only client component in this panel — permission prompts and the
          PushManager are browser-only. */}
      <PushToggle />
    </section>
  )
}

export default DashboardWelcome
