// ─────────────────────────────────────────────────────────────────────────────
// Seat-based pricing engine.
//
// This module is deliberately pure: no React, no Payload, no `window`. It is
// imported by BOTH sides of the configurator —
//
//   • the client component, to show a live quote as the visitor drags the
//     seat slider and ticks options, and
//   • the server action, to recompute that same quote from the database
//     before writing it to a Service Request.
//
// The server recomputation is the point. Everything the browser sends is
// untrusted, so the action never stores a total the client calculated; it
// stores what this engine produces from the CMS document. The client copy
// exists only so the visitor sees a number without a round trip. If an editor
// changes a rate between page render and submit, the stored quote is the new
// one — and because both sides run identical code, that's the only way the
// two can ever disagree.
// ─────────────────────────────────────────────────────────────────────────────

export type Currency = "GBP" | "USD" | "EUR" | "AED"

/** "per-seat" prices off headcount; "quote" collects the brief without pricing it. */
export type PricingMode = "per-seat" | "quote"

export type OptionPriceType = "per-seat-monthly" | "monthly-flat" | "one-time"

/**
 * One headcount band. `maxSeats: null` means "and above" — the open-ended top
 * band every ladder needs so there's no headcount that falls through.
 */
export type SeatBand = {
  minSeats: number
  maxSeats: number | null
  pricePerSeat: number
  label: string
}

export type ServiceOption = {
  id: string
  name: string
  description: string
  priceType: OptionPriceType
  amount: number
  defaultSelected: boolean
}

export type ServicePricing = {
  mode: PricingMode
  currency: Currency
  bands: SeatBand[]
  setupFee: number
  /**
   * Headcount at or above which the setup fee is waived. `null` means never —
   * the fee always applies. Used as a closing incentive on the larger bands.
   */
  setupFeeWaivedAtSeats: number | null
  minSeats: number
  maxSeats: number
  defaultSeats: number
  billingNote: string
  options: ServiceOption[]
}

export type QuoteLine = {
  label: string
  detail: string
  /** Monthly recurring contribution, in major currency units. */
  monthly: number
  /** One-time contribution, in major currency units. */
  oneTime: number
}

export type Quote = {
  seats: number
  band: SeatBand | null
  lines: QuoteLine[]
  monthlyTotal: number
  oneTimeTotal: number
  /** True when the service is priced on application, so totals are all zero. */
  quoteOnly: boolean
}

/** Clamps `seats` into the range the service actually sells, tolerating junk input. */
export function clampSeats(pricing: ServicePricing, seats: number): number {
  if (!Number.isFinite(seats)) return pricing.defaultSeats
  const floor = Math.max(1, Math.round(pricing.minSeats))
  const ceiling = Math.max(floor, Math.round(pricing.maxSeats))
  return Math.min(ceiling, Math.max(floor, Math.round(seats)))
}

/**
 * The band a headcount falls into.
 *
 * Bands are matched low to high so an editor can list them in any order and
 * still get the narrowest sensible match. If nothing matches — a gap in the
 * ladder, or a headcount above a closed top band — the highest band by
 * `minSeats` is used rather than returning nothing, because a configurator
 * that silently prices at zero is worse than one that prices at the top rate.
 */
export function findBand(bands: SeatBand[], seats: number): SeatBand | null {
  if (bands.length === 0) return null

  const sorted = [...bands].sort((a, b) => a.minSeats - b.minSeats)
  const match = sorted.find(
    (band) => seats >= band.minSeats && (band.maxSeats === null || seats <= band.maxSeats),
  )
  return match ?? sorted[sorted.length - 1]
}

function optionContribution(option: ServiceOption, seats: number): { monthly: number; oneTime: number; detail: string } {
  switch (option.priceType) {
    case "per-seat-monthly":
      return {
        monthly: option.amount * seats,
        oneTime: 0,
        detail: `${seats} × ${option.amount} per user / month`,
      }
    case "monthly-flat":
      return { monthly: option.amount, oneTime: 0, detail: "Flat, per month" }
    case "one-time":
      return { monthly: 0, oneTime: option.amount, detail: "One-time" }
  }
}

/**
 * The whole quote for a headcount and a set of ticked options.
 *
 * `selectedOptionIds` is filtered against the service's own options rather
 * than trusted, so an id that no longer exists (a stale page, a tampered
 * payload) contributes nothing instead of throwing.
 */
export function buildQuote(
  pricing: ServicePricing,
  rawSeats: number,
  selectedOptionIds: string[],
): Quote {
  const seats = clampSeats(pricing, rawSeats)
  const selected = new Set(selectedOptionIds)
  const chosen = pricing.options.filter((option) => selected.has(option.id))

  if (pricing.mode === "quote") {
    return {
      seats,
      band: null,
      lines: chosen.map((option) => ({
        label: option.name,
        detail: "Included in scope",
        monthly: 0,
        oneTime: 0,
      })),
      monthlyTotal: 0,
      oneTimeTotal: 0,
      quoteOnly: true,
    }
  }

  const band = findBand(pricing.bands, seats)
  const lines: QuoteLine[] = []

  if (band) {
    lines.push({
      label: band.label,
      detail: `${seats} × ${band.pricePerSeat} per user / month`,
      monthly: band.pricePerSeat * seats,
      oneTime: 0,
    })
  }

  // The waiver is checked against the clamped headcount, so the incentive
  // shown on the page is the one that gets stored on the request.
  const setupWaived =
    pricing.setupFeeWaivedAtSeats !== null && seats >= pricing.setupFeeWaivedAtSeats
  if (pricing.setupFee > 0 && !setupWaived) {
    lines.push({
      label: "Onboarding & setup",
      detail: "One-time",
      monthly: 0,
      oneTime: pricing.setupFee,
    })
  }

  for (const option of chosen) {
    const { monthly, oneTime, detail } = optionContribution(option, seats)
    lines.push({ label: option.name, detail, monthly, oneTime })
  }

  return {
    seats,
    band,
    lines,
    monthlyTotal: round2(lines.reduce((sum, line) => sum + line.monthly, 0)),
    oneTimeTotal: round2(lines.reduce((sum, line) => sum + line.oneTime, 0)),
    quoteOnly: false,
  }
}

/** Money is summed as floats, so trim the drift before it reaches a total. */
function round2(value: number): number {
  return Math.round(value * 100) / 100
}

const CURRENCY_SYMBOLS: Record<Currency, string> = {
  GBP: "£",
  USD: "$",
  EUR: "€",
  AED: "AED ",
}

/**
 * Formats money without `Intl`.
 *
 * `Intl.NumberFormat` resolves against the *runtime's* locale data, which is
 * not guaranteed to match between the Node server render and the browser
 * hydration of the same client component — and a mismatched total is exactly
 * the kind of hydration error that only shows up in production. Grouping by
 * hand is deterministic everywhere.
 */
export function formatMoney(amount: number, currency: Currency): string {
  const symbol = CURRENCY_SYMBOLS[currency] ?? ""
  const rounded = round2(Math.abs(amount))
  const hasPence = Math.round(rounded * 100) % 100 !== 0
  const fixed = rounded.toFixed(hasPence ? 2 : 0)
  const [whole, fraction] = fixed.split(".")
  const grouped = whole.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
  const sign = amount < 0 ? "-" : ""
  return `${sign}${symbol}${grouped}${fraction ? `.${fraction}` : ""}`
}

/** "1–10 users" / "251+ users" — the human label for a band. */
export function bandRangeLabel(band: SeatBand): string {
  return band.maxSeats === null
    ? `${band.minSeats}+ users`
    : `${band.minSeats}–${band.maxSeats} users`
}
