import webpush from "web-push"
import type { Payload } from "payload"
import type { ServiceRequest } from "@/payload-types"
import { formatMoney, type Currency } from "@/lib/pricing"

// ─────────────────────────────────────────────────────────────────────────────
// New-service-request alerts: email + browser push.
//
// Called from the `afterChange` hook on the service-requests collection, so it
// fires however a request was created — the public configurator today, the
// REST API or a seeded import tomorrow.
//
// Rule for everything in this file: a notification failure must never fail the
// submission. The lead is already safely in the database by the time this
// runs; losing the alert is an inconvenience, losing the lead is not. Every
// path is wrapped, and the worst case is a line in the server log.
// ─────────────────────────────────────────────────────────────────────────────

/** Recipients for the email alert. Comma-separated so several people can be copied. */
function emailRecipients(): string[] {
  return (process.env.NOTIFY_EMAIL_TO || "")
    .split(",")
    .map((address) => address.trim())
    .filter(Boolean)
}

function siteURL(): string {
  return (process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:3000").replace(/\/$/, "")
}

/**
 * A one-line summary of the money, used as the email subject and the push
 * notification body — the bit that has to be readable on a lock screen.
 */
function moneyLine(doc: ServiceRequest): string {
  if (doc.priceOnApplication) return "Price on application"

  const currency = (doc.currency as Currency) || "GBP"
  const monthly = doc.estimatedMonthly ?? 0
  const oneTime = doc.estimatedOneTime ?? 0

  const parts: string[] = []
  if (monthly > 0) parts.push(`${formatMoney(monthly, currency)}/mo`)
  if (oneTime > 0) parts.push(`${formatMoney(oneTime, currency)} setup`)
  return parts.length > 0 ? parts.join(" + ") : "No estimate"
}

const START_LABELS: Record<string, string> = {
  asap: "As soon as possible",
  "1-3-months": "Within 1–3 months",
  "3-6-months": "In 3–6 months",
  exploring: "Just exploring",
}

function escapeHTML(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
}

function buildEmail(doc: ServiceRequest): { subject: string; text: string; html: string } {
  const money = moneyLine(doc)
  const subject = `New quote request — ${doc.companyName} (${money})`
  const docURL = `${siteURL()}/admin/collections/service-requests/${doc.id}`

  const options = (doc.selectedOptions || [])
    .map((option) => option.name)
    .filter((name): name is string => Boolean(name))

  const rows: [string, string][] = [
    ["Service", `${doc.serviceTitle}${doc.bandLabel ? ` · ${doc.bandLabel} band` : ""}`],
    ["Team size", `${doc.seats} ${doc.seats === 1 ? "user" : "users"}`],
    ["Estimate", money],
    ["Add-ons", options.length > 0 ? options.join(", ") : "None"],
    ["Contact", `${doc.fullName}${doc.jobTitle ? `, ${doc.jobTitle}` : ""}`],
    ["Company", doc.companyName],
    ["Email", doc.workEmail],
    ["Phone", doc.phone || "—"],
    ["Timeline", doc.preferredStart ? (START_LABELS[doc.preferredStart] ?? doc.preferredStart) : "—"],
  ]

  const text = [
    subject,
    "",
    ...rows.map(([label, value]) => `${label}: ${value}`),
    "",
    doc.message ? `Notes:\n${doc.message}` : "",
    "",
    `Open in dashboard: ${docURL}`,
  ]
    .filter(Boolean)
    .join("\n")

  // Deliberately plain, table-based HTML with inline styles. Mail clients
  // strip <style> blocks and have no CSS grid — and this only ever has to look
  // right in your own inbox, so it optimises for surviving Outlook over looking
  // like the website.
  const html = `
<div style="font-family:system-ui,-apple-system,'Segoe UI',Roboto,sans-serif;background:#0a0e17;padding:28px;color:#e6eaf3">
  <div style="max-width:560px;margin:0 auto;background:#10141f;border:1px solid #1e2637;border-radius:14px;overflow:hidden">
    <div style="padding:22px 26px;border-bottom:1px solid #1e2637">
      <div style="font-size:11px;letter-spacing:.16em;text-transform:uppercase;color:#3b82f6">New quote request</div>
      <div style="font-size:22px;font-weight:300;margin-top:6px;color:#fff">${escapeHTML(doc.companyName)}</div>
      <div style="font-size:14px;color:#7987a8;margin-top:4px">${escapeHTML(doc.serviceTitle)} · ${escapeHTML(money)}</div>
    </div>
    <table role="presentation" cellpadding="0" cellspacing="0" style="width:100%;border-collapse:collapse">
      ${rows
        .map(
          ([label, value]) => `
      <tr>
        <td style="padding:11px 26px;font-size:12px;color:#7987a8;width:120px;vertical-align:top;border-bottom:1px solid #171c2c">${escapeHTML(label)}</td>
        <td style="padding:11px 26px 11px 0;font-size:14px;color:#e6eaf3;border-bottom:1px solid #171c2c">${escapeHTML(value)}</td>
      </tr>`,
        )
        .join("")}
    </table>
    ${
      doc.message
        ? `<div style="padding:18px 26px;border-bottom:1px solid #171c2c">
      <div style="font-size:12px;color:#7987a8;margin-bottom:6px">Notes</div>
      <div style="font-size:14px;line-height:1.6;color:#e6eaf3;white-space:pre-wrap">${escapeHTML(doc.message)}</div>
    </div>`
        : ""
    }
    <div style="padding:22px 26px">
      <a href="${docURL}" style="display:inline-block;background:#2563eb;color:#fff;text-decoration:none;padding:11px 20px;border-radius:8px;font-size:14px">Open in dashboard</a>
      <div style="margin-top:14px;font-size:12px;color:#586488">
        Reply to <a href="mailto:${escapeHTML(doc.workEmail)}" style="color:#3b82f6">${escapeHTML(doc.workEmail)}</a> to contact them directly.
      </div>
    </div>
  </div>
</div>`.trim()

  return { subject, text, html }
}

async function sendEmail(payload: Payload, doc: ServiceRequest): Promise<void> {
  const to = emailRecipients()
  if (to.length === 0) {
    payload.logger.warn(
      "[notify] NOTIFY_EMAIL_TO is not set — skipping the email alert for a new service request.",
    )
    return
  }

  const { subject, text, html } = buildEmail(doc)

  // Payload routes this through the configured email adapter. With no SMTP
  // credentials set, that adapter logs to the console instead of sending,
  // which is the intended dev behaviour rather than an error.
  await payload.sendEmail({ to: to.join(","), subject, text, html })
}

/** True once the VAPID pair is present; without it web-push cannot sign anything. */
function pushConfigured(): boolean {
  return Boolean(process.env.VAPID_PUBLIC_KEY && process.env.VAPID_PRIVATE_KEY)
}

async function sendPush(payload: Payload, doc: ServiceRequest): Promise<void> {
  if (!pushConfigured()) {
    payload.logger.warn("[notify] VAPID keys are not set — skipping browser push.")
    return
  }

  webpush.setVapidDetails(
    process.env.VAPID_SUBJECT || "mailto:admin@mstack360.com",
    process.env.VAPID_PUBLIC_KEY!,
    process.env.VAPID_PRIVATE_KEY!,
  )

  const { docs: subscriptions } = await payload.find({
    collection: "push-subscriptions",
    depth: 0,
    pagination: false,
    limit: 200,
  })
  if (subscriptions.length === 0) return

  const notification = JSON.stringify({
    title: `New request — ${doc.companyName}`,
    body: `${doc.serviceTitle} · ${doc.seats} users · ${moneyLine(doc)}`,
    // Read by public/sw.js to focus or open the right page on click.
    url: `/admin/collections/service-requests/${doc.id}`,
    // Collapses repeat alerts on the lock screen rather than stacking them.
    tag: `service-request-${doc.id}`,
  })

  const results = await Promise.allSettled(
    subscriptions.map((sub) =>
      webpush.sendNotification(
        {
          endpoint: sub.endpoint,
          keys: { p256dh: sub.p256dh, auth: sub.auth },
        },
        notification,
      ),
    ),
  )

  // 404/410 mean the browser has permanently discarded that subscription —
  // the user revoked permission, cleared site data, or uninstalled. Those rows
  // are dead weight that would be retried on every future request, so prune
  // them. Any other failure is transient and left alone to retry next time.
  const dead: string[] = []
  results.forEach((result, index) => {
    if (result.status !== "rejected") return
    const statusCode = (result.reason as { statusCode?: number })?.statusCode
    if (statusCode === 404 || statusCode === 410) {
      dead.push(String(subscriptions[index].id))
    } else {
      payload.logger.warn(`[notify] Push to one device failed (${statusCode ?? "unknown"}).`)
    }
  })

  if (dead.length > 0) {
    await payload.delete({
      collection: "push-subscriptions",
      where: { id: { in: dead } },
    })
    payload.logger.info(`[notify] Pruned ${dead.length} expired push subscription(s).`)
  }
}

/**
 * Fires both channels for one new request.
 *
 * Email and push are dispatched together and settled independently, so a dead
 * SMTP server doesn't cost you the push, and vice versa.
 */
export async function notifyNewServiceRequest(payload: Payload, doc: ServiceRequest): Promise<void> {
  const results = await Promise.allSettled([sendEmail(payload, doc), sendPush(payload, doc)])

  for (const result of results) {
    if (result.status === "rejected") {
      payload.logger.error(`[notify] Alert channel failed: ${String(result.reason)}`)
    }
  }
}
