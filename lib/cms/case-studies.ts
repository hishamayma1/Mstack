import { getPayload } from "payload"
import config from "@payload-config"
import { cacheLife, cacheTag } from "next/cache"
import type { Media } from "@/payload-types"

// Flat, frontend-friendly shapes — keeps Payload's document structure (media
// relation objects, group fields, array wrappers like {point: string}) out of
// the components.

/**
 * A resolved upload field. `alt` comes from the media document (it's required
 * there), so images carry their real description rather than a guess made at
 * render time.
 */
export type CaseStudyImage = {
  url: string
  alt: string
  width: number | null
  height: number | null
}

/** What the /case-studies index and the industry-page list need. */
export type CaseStudyCard = {
  id: string
  client: string
  slug: string
  industry: string
  challenge: string
  result: string
  stat: { value: string; label: string }
  logoUrl: string | null
  heroImage: CaseStudyImage | null
  publishedDate: string
}

export type CaseStudyMetric = { value: string; label: string }
export type CaseStudyFact = { label: string; value: string }
export type CaseStudyStep = { title: string; description: string }
export type CaseStudyQuote = { text: string; author: string; role: string }
export type CaseStudyGalleryItem = { image: CaseStudyImage; caption: string }

/** Everything a /case-studies/[slug] page renders. */
export type CaseStudyDetail = CaseStudyCard & {
  headline: string
  summary: string
  facts: CaseStudyFact[]
  challengePoints: string[]
  approach: CaseStudyStep[]
  approachImage: CaseStudyImage | null
  toolsUsed: string[]
  metrics: CaseStudyMetric[]
  gallery: CaseStudyGalleryItem[]
  quote: CaseStudyQuote | null
}

async function payloadClient() {
  return getPayload({ config })
}

// depth: 1 is required wherever `logo` is read — it's a relationship to the
// media collection, and depth 0 returns the id instead of the file. Queries
// that don't render a logo use depth 0.
//
// pagination: false skips the extra count query Payload runs to build page
// metadata that none of these callers read.

type UploadField = Media | string | number | null | undefined

function logoUrl(logo: UploadField): string | null {
  return logo && typeof logo === "object" ? logo.url ?? null : null
}

// An upload field is only an object once it's been populated (depth >= 1);
// unpopulated it's just an id, and an empty one is null. Anything without a
// usable url resolves to null so the component falls back to a placeholder
// rather than rendering a broken <img>.
function toImage(field: UploadField): CaseStudyImage | null {
  if (!field || typeof field !== "object" || !field.url) return null
  return {
    url: field.url,
    alt: field.alt ?? "",
    width: field.width ?? null,
    height: field.height ?? null,
  }
}

/* eslint-disable @typescript-eslint/no-explicit-any */
function toCard(doc: any): CaseStudyCard {
  return {
    id: String(doc.id),
    client: doc.client,
    slug: doc.slug,
    industry: doc.industry,
    challenge: doc.challenge,
    result: doc.result,
    stat: { value: doc.stat?.value ?? "", label: doc.stat?.label ?? "" },
    logoUrl: logoUrl(doc.logo),
    heroImage: toImage(doc.heroImage),
    publishedDate: doc.publishedDate ?? "",
  }
}

export async function getCaseStudies(): Promise<CaseStudyCard[]> {
  "use cache"
  cacheLife("hours")
  cacheTag("case-studies")

  const payload = await payloadClient()
  const { docs } = await payload.find({
    collection: "case-studies",
    where: { status: { equals: "published" } },
    sort: "-publishedDate",
    depth: 1,
    pagination: false,
    // The index card never touches the long-form fields.
    select: {
      client: true,
      slug: true,
      industry: true,
      challenge: true,
      result: true,
      stat: true,
      logo: true,
      heroImage: true,
      publishedDate: true,
    },
  })

  return docs.map(toCard)
}

/**
 * Case studies for one industry.
 *
 * The industry page used to call getCaseStudies() and filter in JavaScript,
 * which meant reading and mapping every published study — and populating each
 * one's logo — to render the two or three that match.
 *
 * Industries and case studies share one title taxonomy on purpose
 * (SITEMAP_INDUSTRY_TITLES), so an equality match on the title is correct.
 */
export async function getCaseStudiesByIndustry(industry: string): Promise<CaseStudyCard[]> {
  "use cache"
  cacheLife("hours")
  cacheTag("case-studies")

  const payload = await payloadClient()
  const { docs } = await payload.find({
    collection: "case-studies",
    where: {
      status: { equals: "published" },
      industry: { equals: industry },
    },
    sort: "-publishedDate",
    depth: 1,
    pagination: false,
    select: {
      client: true,
      slug: true,
      industry: true,
      challenge: true,
      result: true,
      stat: true,
      logo: true,
      heroImage: true,
      publishedDate: true,
    },
  })

  return docs.map(toCard)
}

/** Used by generateStaticParams — slugs only. */
export async function getCaseStudySlugs(): Promise<string[]> {
  "use cache"
  cacheLife("hours")
  cacheTag("case-studies")

  const payload = await payloadClient()
  const { docs } = await payload.find({
    collection: "case-studies",
    where: { status: { equals: "published" } },
    depth: 0,
    pagination: false,
    select: { slug: true },
  })
  return docs.map((doc) => doc.slug)
}

export async function getCaseStudyBySlug(slug: string): Promise<CaseStudyDetail | null> {
  "use cache"
  cacheLife("hours")
  cacheTag("case-studies")

  const payload = await payloadClient()
  const { docs } = await payload.find({
    collection: "case-studies",
    where: { slug: { equals: slug }, status: { equals: "published" } },
    limit: 1,
    depth: 1,
    pagination: false,
  })
  const doc = docs[0]
  if (!doc) return null

  // A Payload array field is null when never filled in and [] when cleared —
  // both mean "hide this section", so both normalise to an empty array and
  // the component decides not to render.
  const quoteText = doc.quote?.text?.trim()

  return {
    ...toCard(doc),
    headline: doc.headline || doc.client,
    summary: doc.summary || doc.result,
    facts: (doc.facts ?? []).map((f) => ({ label: f.label, value: f.value })),
    challengePoints: (doc.challengePoints ?? []).map((p) => p.point),
    approach: (doc.approach ?? []).map((s) => ({ title: s.title, description: s.description })),
    approachImage: toImage(doc.approachImage),
    toolsUsed: (doc.toolsUsed ?? []).map((t) => t.name),
    metrics: (doc.metrics ?? []).map((m) => ({ value: m.value, label: m.label })),
    // Rows whose upload didn't resolve are dropped rather than rendered as an
    // empty frame — a gallery slot with no image isn't a placeholder, it's a
    // mistake, and the section can simply be shorter.
    gallery: (doc.gallery ?? []).flatMap((g) => {
      const image = toImage(g.image)
      return image ? [{ image, caption: g.caption ?? "" }] : []
    }),
    quote: quoteText
      ? { text: quoteText, author: doc.quote?.author ?? "", role: doc.quote?.role ?? "" }
      : null,
  }
}

/**
 * Other studies to show at the bottom of a detail page: same industry first,
 * topped up with the most recent from anywhere so the section is never thin.
 * Excludes the study being viewed.
 */
export async function getRelatedCaseStudies(
  slug: string,
  industry: string,
  limit = 3
): Promise<CaseStudyCard[]> {
  "use cache"
  cacheLife("hours")
  cacheTag("case-studies")

  const payload = await payloadClient()
  // `as const` matters: without it the literals widen to `boolean`, and
  // Payload's select type only accepts `true`.
  const baseSelect = {
    client: true,
    slug: true,
    industry: true,
    challenge: true,
    result: true,
    stat: true,
    logo: true,
    heroImage: true,
    publishedDate: true,
  } as const

  const { docs: sameIndustry } = await payload.find({
    collection: "case-studies",
    where: {
      status: { equals: "published" },
      industry: { equals: industry },
      slug: { not_equals: slug },
    },
    sort: "-publishedDate",
    limit,
    depth: 1,
    pagination: false,
    select: baseSelect,
  })

  if (sameIndustry.length >= limit) return sameIndustry.map(toCard)

  // Top up. `not_in` keeps the already-selected ones out so there are no
  // duplicates, and the query asks only for the shortfall.
  const exclude = [slug, ...sameIndustry.map((d) => d.slug)]
  const { docs: fill } = await payload.find({
    collection: "case-studies",
    where: {
      status: { equals: "published" },
      slug: { not_in: exclude },
    },
    sort: "-publishedDate",
    limit: limit - sameIndustry.length,
    depth: 1,
    pagination: false,
    select: baseSelect,
  })

  return [...sameIndustry, ...fill].map(toCard)
}
