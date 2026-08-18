import { getPayload } from "payload"
import config from "@payload-config"
import { cacheLife, cacheTag } from "next/cache"
import {
  INDUSTRY_CONTENT,
  INDUSTRY_CONTENT_FALLBACK,
  type IndustryChallenge,
  type IndustryMarketing,
  type IndustryOutcome,
  type IndustryStat,
  type IndustryTool,
} from "@/lib/content/industries"

export type IndustrySolution = { title: string; description: string }
export type { IndustryChallenge, IndustryOutcome, IndustryStat, IndustryTool }

export type IndustryCard = {
  id: string
  title: string
  slug: string
  summary: string
  /** First few tool names, used as chips on the hub grid card. */
  toolNames: string[]
  solutionCount: number
}

export type IndustryDetail = IndustryCard & IndustryMarketing & {
  solutions: IndustrySolution[]
}

async function payloadClient() {
  return getPayload({ config })
}

// A Payload array field is `null` when never filled in and `[]` when an editor
// cleared it — both mean "nothing to show", so both fall through to the
// built-in content rather than rendering an empty section.
function orFallback<T>(cmsValue: T[] | null | undefined, fallback: T[]): T[] {
  return cmsValue && cmsValue.length > 0 ? cmsValue : fallback
}

function contentFor(slug: string): IndustryMarketing {
  return INDUSTRY_CONTENT[slug] ?? INDUSTRY_CONTENT_FALLBACK
}

// Every query here is tuned to fetch only what the caller renders:
//
//   depth: 0        — this collection has no relationship fields, so the
//                     default depth of 2 makes Payload walk (and populate)
//                     nothing, at a cost.
//   pagination:false— skips the extra count query Payload issues to build
//                     page metadata that none of these callers read.
//   select          — returns just the fields used, instead of the whole
//                     document. The hub grid needs 5 of the 12 fields.

export async function getIndustries(): Promise<IndustryCard[]> {
  "use cache"
  cacheLife("hours")
  cacheTag("industries")

  const payload = await payloadClient()
  const { docs } = await payload.find({
    collection: "industries",
    where: { status: { equals: "published" } },
    sort: "order",
    depth: 0,
    pagination: false,
    // The card shows title, summary, tool chips and a solution count — it
    // never touches headline, valueProp, stats, challenges, outcomes or the
    // CTA copy, which are the bulk of the document.
    select: {
      title: true,
      slug: true,
      summary: true,
      solutions: true,
      tools: true,
    },
  })
  return docs.map((doc) => {
    const content = contentFor(doc.slug)
    const tools = orFallback(doc.tools, content.tools)
    return {
      id: String(doc.id),
      title: doc.title,
      slug: doc.slug,
      summary: doc.summary,
      toolNames: tools.slice(0, 4).map((t) => t.name),
      solutionCount: doc.solutions?.length ?? 0,
    }
  })
}

// Used by generateStaticParams — slugs only, no need to pull full docs.
export async function getIndustrySlugs(): Promise<string[]> {
  "use cache"
  cacheLife("hours")
  cacheTag("industries")

  const payload = await payloadClient()
  const { docs } = await payload.find({
    collection: "industries",
    where: { status: { equals: "published" } },
    depth: 0,
    pagination: false,
    select: { slug: true },
  })
  return docs.map((doc) => doc.slug)
}

/**
 * Title + slug only — for the "Other Sectors" chips at the bottom of an
 * industry page, which render nothing else. That section was previously
 * calling getIndustries(), pulling summaries, solutions and tool arrays for
 * all seven sectors to render seven text links.
 */
export async function getIndustryLinks(): Promise<{ id: string; title: string; slug: string }[]> {
  "use cache"
  cacheLife("hours")
  cacheTag("industries")

  const payload = await payloadClient()
  const { docs } = await payload.find({
    collection: "industries",
    where: { status: { equals: "published" } },
    sort: "order",
    depth: 0,
    pagination: false,
    select: { title: true, slug: true },
  })
  return docs.map((doc) => ({ id: String(doc.id), title: doc.title, slug: doc.slug }))
}

export async function getIndustryBySlug(slug: string): Promise<IndustryDetail | null> {
  "use cache"
  cacheLife("hours")
  cacheTag("industries")

  const payload = await payloadClient()
  const { docs } = await payload.find({
    collection: "industries",
    where: { slug: { equals: slug }, status: { equals: "published" } },
    limit: 1,
    depth: 0,
    pagination: false,
  })
  const doc = docs[0]
  if (!doc) return null

  const content = contentFor(doc.slug)
  const tools = orFallback(doc.tools, content.tools)

  return {
    id: String(doc.id),
    title: doc.title,
    slug: doc.slug,
    summary: doc.summary,
    solutions: doc.solutions.map((s) => ({ title: s.title, description: s.description })),
    solutionCount: doc.solutions.length,
    toolNames: tools.slice(0, 4).map((t) => t.name),

    headline: doc.headline || content.headline,
    valueProp: doc.valueProp || content.valueProp,
    stats: orFallback(doc.stats, content.stats).map((s) => ({ value: s.value, label: s.label })),
    challenges: orFallback(doc.challenges, content.challenges).map((c) => ({
      title: c.title,
      description: c.description,
    })),
    tools: tools.map((t) => ({
      name: t.name,
      category: t.category,
      whatItIs: t.whatItIs,
      whyYouNeedIt: t.whyYouNeedIt,
    })),
    outcomes: orFallback(doc.outcomes, content.outcomes).map((o) => ({
      title: o.title,
      description: o.description,
    })),
    ctaHeadline: doc.ctaHeadline || content.ctaHeadline,
    ctaSubtext: doc.ctaSubtext || content.ctaSubtext,
  }
}
