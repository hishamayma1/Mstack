import { getPayload } from "payload"
import config from "@payload-config"
import { cacheLife, cacheTag } from "next/cache"
import {
  bandRangeLabel,
  type Currency,
  type OptionPriceType,
  type PricingMode,
  type SeatBand,
  type ServiceOption,
  type ServicePricing,
} from "@/lib/pricing"

export type ServiceKind = "level" | "addon"

export type ServiceItem = { title: string; description: string }
export type ServiceStat = { value: string; label: string }
export type ServiceFAQ = { question: string; answer: string }

export type ServiceCard = {
  id: string
  title: string
  slug: string
  kind: ServiceKind
  tagline: string
  summary: string
  bestFor: string
  highlights: string[]
  /** Cheapest per-user rate across all bands — the "from £X" line on the hub card. */
  fromPricePerSeat: number | null
  currency: Currency
}

export type ServiceDetail = ServiceCard & {
  headline: string
  valueProp: string
  stats: ServiceStat[]
  includes: ServiceItem[]
  outcomes: ServiceItem[]
  faqs: ServiceFAQ[]
  ctaHeadline: string
  ctaSubtext: string
  pricing: ServicePricing
}

async function payloadClient() {
  return getPayload({ config })
}

// A Payload array field is `null` when never filled in and `[]` when an editor
// cleared it — both mean "nothing to show", so both collapse to an empty list
// rather than rendering an empty section.
function rows<T>(value: T[] | null | undefined): T[] {
  return value ?? []
}

/** Payload number fields come back `null` when blank; every price needs a number. */
function num(value: number | null | undefined, fallback: number): number {
  return typeof value === "number" && Number.isFinite(value) ? value : fallback
}

type RawBand = {
  minSeats: number
  maxSeats?: number | null
  pricePerSeat: number
  label?: string | null
  id?: string | null
}

type RawOption = {
  name: string
  description: string
  priceType: OptionPriceType
  amount: number
  defaultSelected?: boolean | null
  id?: string | null
}

function toBands(raw: RawBand[] | null | undefined): SeatBand[] {
  return rows(raw)
    .map((band) => {
      const seatBand: SeatBand = {
        minSeats: num(band.minSeats, 1),
        // `maxSeats` blank is meaningful, not missing: it's the open-ended top
        // band, so it must stay null rather than picking up a default.
        maxSeats: typeof band.maxSeats === "number" ? band.maxSeats : null,
        pricePerSeat: num(band.pricePerSeat, 0),
        label: "",
      }
      return { ...seatBand, label: band.label?.trim() || bandRangeLabel(seatBand) }
    })
    .sort((a, b) => a.minSeats - b.minSeats)
}

function toOptions(raw: RawOption[] | null | undefined): ServiceOption[] {
  return rows(raw).map((option, index) => ({
    // Payload gives every array row a stable id; the index is only a
    // fallback for rows created before one existed.
    id: option.id ? String(option.id) : `opt-${index}`,
    name: option.name,
    description: option.description,
    priceType: option.priceType,
    amount: num(option.amount, 0),
    defaultSelected: Boolean(option.defaultSelected),
  }))
}

type PricingSource = {
  pricingMode?: PricingMode | null
  currency?: Currency | null
  seatBands?: RawBand[] | null
  setupFee?: number | null
  setupFeeWaivedAtSeats?: number | null
  minSeats?: number | null
  maxSeats?: number | null
  defaultSeats?: number | null
  billingNote?: string | null
  options?: RawOption[] | null
}

/**
 * Turns a raw document into the shape lib/pricing.ts works with.
 *
 * The slider bounds are reconciled here rather than trusted: a max below the
 * min, or a default outside the range, is an easy thing to leave behind in the
 * admin UI and would otherwise ship a slider the visitor can't move.
 */
function toPricing(doc: PricingSource): ServicePricing {
  const minSeats = Math.max(1, num(doc.minSeats, 1))
  const maxSeats = Math.max(minSeats, num(doc.maxSeats, 500))
  const defaultSeats = Math.min(maxSeats, Math.max(minSeats, num(doc.defaultSeats, 25)))

  return {
    mode: doc.pricingMode ?? "per-seat",
    currency: doc.currency ?? "GBP",
    bands: toBands(doc.seatBands),
    setupFee: num(doc.setupFee, 0),
    setupFeeWaivedAtSeats:
      typeof doc.setupFeeWaivedAtSeats === "number" ? doc.setupFeeWaivedAtSeats : null,
    minSeats,
    maxSeats,
    defaultSeats,
    billingNote: doc.billingNote ?? "",
    options: toOptions(doc.options),
  }
}

function cheapestRate(bands: SeatBand[]): number | null {
  if (bands.length === 0) return null
  return bands.reduce((lowest, band) => Math.min(lowest, band.pricePerSeat), Infinity)
}

// Every query below fetches only what its caller renders — `depth: 0` because
// this collection has no relationships to populate, `pagination: false` to
// skip the count query nobody reads, and `select` so the hub grid doesn't drag
// down the full body copy of nine documents to render nine cards.

export async function getServices(): Promise<ServiceCard[]> {
  "use cache"
  cacheLife("hours")
  cacheTag("services")

  const payload = await payloadClient()
  const { docs } = await payload.find({
    collection: "services",
    where: { status: { equals: "published" } },
    sort: "order",
    depth: 0,
    pagination: false,
    select: {
      title: true,
      slug: true,
      kind: true,
      tagline: true,
      summary: true,
      bestFor: true,
      highlights: true,
      seatBands: true,
      currency: true,
      pricingMode: true,
    },
  })

  return docs.map((doc) => ({
    id: String(doc.id),
    title: doc.title,
    slug: doc.slug,
    kind: doc.kind,
    tagline: doc.tagline ?? "",
    summary: doc.summary,
    bestFor: doc.bestFor ?? "",
    highlights: rows(doc.highlights).map((h) => h.label),
    // "Price on application" services must not advertise a from-price, even
    // when bands were left behind from an earlier pricing model.
    fromPricePerSeat: doc.pricingMode === "quote" ? null : cheapestRate(toBands(doc.seatBands)),
    currency: doc.currency ?? "GBP",
  }))
}

/** Slugs only — for generateStaticParams, which needs nothing else. */
export async function getServiceSlugs(): Promise<string[]> {
  "use cache"
  cacheLife("hours")
  cacheTag("services")

  const payload = await payloadClient()
  const { docs } = await payload.find({
    collection: "services",
    where: { status: { equals: "published" } },
    depth: 0,
    pagination: false,
    select: { slug: true },
  })
  return docs.map((doc) => doc.slug)
}

/** Title + slug + kind — for the "Other Services" chips, which render nothing else. */
export async function getServiceLinks(): Promise<
  { id: string; title: string; slug: string; kind: ServiceKind }[]
> {
  "use cache"
  cacheLife("hours")
  cacheTag("services")

  const payload = await payloadClient()
  const { docs } = await payload.find({
    collection: "services",
    where: { status: { equals: "published" } },
    sort: "order",
    depth: 0,
    pagination: false,
    select: { title: true, slug: true, kind: true },
  })
  return docs.map((doc) => ({
    id: String(doc.id),
    title: doc.title,
    slug: doc.slug,
    kind: doc.kind,
  }))
}

export async function getServiceBySlug(slug: string): Promise<ServiceDetail | null> {
  "use cache"
  cacheLife("hours")
  cacheTag("services")

  const payload = await payloadClient()
  const { docs } = await payload.find({
    collection: "services",
    where: { slug: { equals: slug }, status: { equals: "published" } },
    limit: 1,
    depth: 0,
    pagination: false,
  })
  const doc = docs[0]
  if (!doc) return null

  const pricing = toPricing(doc)

  return {
    id: String(doc.id),
    title: doc.title,
    slug: doc.slug,
    kind: doc.kind,
    tagline: doc.tagline ?? "",
    summary: doc.summary,
    bestFor: doc.bestFor ?? "",
    highlights: rows(doc.highlights).map((h) => h.label),
    fromPricePerSeat: pricing.mode === "quote" ? null : cheapestRate(pricing.bands),
    currency: pricing.currency,

    headline: doc.headline || doc.title,
    valueProp: doc.valueProp,
    stats: rows(doc.stats).map((s) => ({ value: s.value, label: s.label })),
    includes: rows(doc.includes).map((i) => ({ title: i.title, description: i.description })),
    outcomes: rows(doc.outcomes).map((o) => ({ title: o.title, description: o.description })),
    faqs: rows(doc.faqs).map((f) => ({ question: f.question, answer: f.answer })),
    ctaHeadline: doc.ctaHeadline || `Ready to scope ${doc.title}?`,
    ctaSubtext:
      doc.ctaSubtext ||
      "Send us your configuration and we'll come back with a firm proposal — usually within one working day.",
    pricing,
  }
}

/**
 * Uncached pricing read, for the submit action only.
 *
 * Every other reader here is wrapped in `"use cache"`, which is right for
 * rendering — the page can serve a rate that's minutes old. It is not right
 * for writing a quote into your pipeline: that figure is what you'll be held
 * to on the call, so it's read straight from the database at the moment of
 * submission, cache bypassed.
 */
export async function getServicePricingForSubmission(slug: string): Promise<{
  id: string
  title: string
  slug: string
  pricing: ServicePricing
} | null> {
  const payload = await payloadClient()
  const { docs } = await payload.find({
    collection: "services",
    where: { slug: { equals: slug }, status: { equals: "published" } },
    limit: 1,
    depth: 0,
    pagination: false,
    select: {
      title: true,
      slug: true,
      pricingMode: true,
      currency: true,
      seatBands: true,
      setupFee: true,
      setupFeeWaivedAtSeats: true,
      minSeats: true,
      maxSeats: true,
      defaultSeats: true,
      billingNote: true,
      options: true,
    },
  })
  const doc = docs[0]
  if (!doc) return null

  return {
    id: String(doc.id),
    title: doc.title,
    slug: doc.slug,
    pricing: toPricing(doc),
  }
}
