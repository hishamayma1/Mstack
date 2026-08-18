"use server"

import { getPayload } from "payload"
import config from "@payload-config"
import { buildQuote } from "@/lib/pricing"
import { getServicePricingForSubmission } from "@/lib/cms/services"
// `SubmitState` and the initial value live in a normal module — a "use server"
// file can only export async functions. See lib/service-request-state.ts.
import type { SubmitState } from "@/lib/service-request-state"

// Deliberately permissive: this exists to catch typos like "name@company",
// not to adjudicate RFC 5322. Anything stricter rejects real addresses, and
// the real validation is that a human replies to it.
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

const PREFERRED_START_VALUES = new Set(["asap", "1-3-months", "3-6-months", "exploring"])

/** Trims, collapses whitespace, and caps length so no single field can bloat a document. */
function text(formData: FormData, key: string, maxLength: number): string {
  const raw = formData.get(key)
  if (typeof raw !== "string") return ""
  return raw.replace(/\s+/g, " ").trim().slice(0, maxLength)
}

function multiline(formData: FormData, key: string, maxLength: number): string {
  const raw = formData.get(key)
  if (typeof raw !== "string") return ""
  return raw.trim().slice(0, maxLength)
}

function fail(fieldErrors: Record<string, string>, message: string): SubmitState {
  return { status: "error", message, fieldErrors }
}

/**
 * Records a configured quote request against a service.
 *
 * Two things this does NOT do, both on purpose:
 *
 *  1. It does not trust any figure from the browser. `seats` and the ticked
 *     option ids are inputs; every price is recomputed here from the current
 *     database document via buildQuote(). A visitor editing the DOM changes
 *     what they see, not what you're quoted.
 *
 *  2. It does not take payment. This is a lead, and it lands in
 *     /admin → Sales → Service Requests as "New" for you to review and follow
 *     up on.
 */
export async function submitServiceRequest(
  slug: string,
  _prevState: SubmitState,
  formData: FormData,
): Promise<SubmitState> {
  // Honeypot. A real person never sees this field, so anything in it is a bot.
  // Returning success rather than an error keeps the bot from learning it was
  // caught and retrying with the field left blank.
  if (text(formData, "website", 200) !== "") {
    return { status: "success", message: "Thanks — we'll be in touch shortly.", fieldErrors: {} }
  }

  const fullName = text(formData, "fullName", 120)
  const workEmail = text(formData, "workEmail", 160).toLowerCase()
  const companyName = text(formData, "companyName", 160)
  const jobTitle = text(formData, "jobTitle", 120)
  const phone = text(formData, "phone", 40)
  const preferredStartRaw = text(formData, "preferredStart", 40)
  const message = multiline(formData, "message", 4000)

  const fieldErrors: Record<string, string> = {}
  if (!fullName) fieldErrors.fullName = "Please tell us your name."
  if (!workEmail) fieldErrors.workEmail = "We need an email address to reply to."
  else if (!EMAIL_PATTERN.test(workEmail)) fieldErrors.workEmail = "That doesn't look like a valid email address."
  if (!companyName) fieldErrors.companyName = "Please tell us your company name."

  if (Object.keys(fieldErrors).length > 0) {
    return fail(fieldErrors, "Please check the highlighted fields.")
  }

  // Read pricing uncached — the stored estimate has to reflect the rates as
  // they are right now, not as they were when the page was last cached.
  const service = await getServicePricingForSubmission(slug)
  if (!service) {
    return fail({}, "That service is no longer available. Please pick another, or contact us directly.")
  }

  const seats = Number(formData.get("seats"))
  const selectedOptionIds = formData
    .getAll("options")
    .filter((value): value is string => typeof value === "string")

  const quote = buildQuote(service.pricing, seats, selectedOptionIds)
  const chosenOptions = service.pricing.options.filter((option) =>
    selectedOptionIds.includes(option.id),
  )

  try {
    const payload = await getPayload({ config })
    await payload.create({
      collection: "service-requests",
      // The Local API bypasses access control by default, which is what lets
      // this write succeed while `create` stays closed to the public REST
      // endpoint. See collections/ServiceRequests.ts.
      data: {
        status: "new",
        fullName,
        workEmail,
        companyName,
        jobTitle: jobTitle || undefined,
        phone: phone || undefined,
        preferredStart: PREFERRED_START_VALUES.has(preferredStartRaw)
          ? (preferredStartRaw as "asap" | "1-3-months" | "3-6-months" | "exploring")
          : undefined,
        message: message || undefined,

        service: service.id,
        // Snapshotted alongside the relationship so the request stays readable
        // if the service is renamed or deleted later.
        serviceTitle: service.title,
        serviceSlug: service.slug,

        seats: quote.seats,
        bandLabel: quote.band?.label,
        currency: service.pricing.currency,
        estimatedMonthly: quote.monthlyTotal,
        estimatedOneTime: quote.oneTimeTotal,
        priceOnApplication: quote.quoteOnly,
        selectedOptions: chosenOptions.map((option) => ({
          name: option.name,
          priceType: option.priceType,
          amount: option.amount,
        })),
        quoteBreakdown: quote.lines.map((line) => ({
          label: line.label,
          detail: line.detail,
          monthly: line.monthly,
          oneTime: line.oneTime,
        })),
        sourcePath: `/solutions/${service.slug}`,
      },
    })
  } catch (error) {
    // The visitor gets a route to a human rather than a stack trace; the
    // detail goes to the server log where it's actually useful.
    console.error("[service-request] Failed to record submission", error)
    return fail(
      {},
      "Something went wrong saving your request. Please try again, or email us directly and we'll pick it up.",
    )
  }

  return {
    status: "success",
    message: "Thanks — your configuration is with us.",
    fieldErrors: {},
  }
}
