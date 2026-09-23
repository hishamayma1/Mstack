import { getPayload } from "payload"
import config from "@payload-config"
import { cacheLife, cacheTag } from "next/cache"

// Flat, frontend-friendly shape shared by guides and tools —
// they render through the same ResourceGridExplorer component, so they're
// normalized to the same fields here rather than each keeping its own
// Payload document shape (richText body, group fields, etc.) downstream.
export type ResourceCard = {
  id: string
  title: string
  description: string
  tag: string
  href: string | null
  hrefLabel: string
}

export type FAQCard = {
  id: string
  question: string
  answer: string
  points: string[]
  category: string
}

async function payloadClient() {
  return getPayload({ config })
}

export async function getGuides(): Promise<ResourceCard[]> {
  "use cache"
  cacheLife("hours")
  cacheTag("guides")

  const payload = await payloadClient()
  const { docs } = await payload.find({
    collection: "guides",
    where: { status: { equals: "published" } },
    sort: "-publishedDate",
    limit: 100,
  })
  return docs.map((doc) => ({
    id: String(doc.id),
    title: doc.title,
    description: doc.description,
    tag: doc.tag,
    href: doc.downloadUrl ?? null,
    hrefLabel: "Download Guide",
  }))
}

export async function getTools(): Promise<ResourceCard[]> {
  "use cache"
  cacheLife("hours")
  cacheTag("tools")

  const payload = await payloadClient()
  const { docs } = await payload.find({
    collection: "tools",
    where: { status: { equals: "published" } },
    sort: "-publishedDate",
    limit: 100,
  })
  return docs.map((doc) => ({
    id: String(doc.id),
    title: doc.title,
    description: doc.description,
    tag: doc.tag,
    href: doc.url ?? null,
    hrefLabel: "Open Tool",
  }))
}

export async function getFAQs(): Promise<FAQCard[]> {
  "use cache"
  cacheLife("hours")
  cacheTag("faqs")

  const payload = await payloadClient()
  const { docs } = await payload.find({
    collection: "faqs",
    where: { status: { equals: "published" } },
    sort: "order",
    limit: 100,
  })
  return docs.map((doc) => ({
    id: String(doc.id),
    question: doc.question,
    answer: doc.answer,
    points: (doc.points ?? []).map((p) => p.point),
    category: doc.category,
  }))
}
