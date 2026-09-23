import { getPayload } from "payload"
import config from "@payload-config"
import { cacheLife, cacheTag } from "next/cache"
import type { BlogPost, Media } from "@/payload-types"

// Flat, frontend-friendly shapes for /blog and /blog/[slug]. Everything the
// components need is derived here once, on the server, inside the cache —
// reading time, the table of contents, heading anchors, a formatted date — so
// no component has to walk Lexical JSON or ship a date library to the browser.

export type BlogImage = {
  url: string
  alt: string
  width: number | null
  height: number | null
}

/** Everything a card on /blog (or "Keep reading") needs. */
export type BlogCard = {
  id: string
  slug: string
  title: string
  excerpt: string
  tag: string
  publishedDate: string
  /** Pre-formatted, e.g. "Nov 10, 2025" — formatted in UTC so server and client agree. */
  dateLabel: string
  readingMinutes: number
  featured: boolean
  cover: BlogImage | null
  authorName: string
}

export type BlogTocItem = { id: string; text: string; level: 2 | 3 }

export type BlogAuthor = {
  name: string
  role: string
  bio: string
  linkedin: string | null
}

/** Everything a /blog/[slug] page renders. */
export type BlogPostDetail = BlogCard & {
  body: BlogPost["body"]
  toc: BlogTocItem[]
  faqs: BlogFaq[]
  keyTakeaways: string[]
  author: BlogAuthor
  updatedAt: string
}

export type BlogNeighbours = {
  /** The next-older article — "Previous" in reading order. */
  previous: BlogCard | null
  /** The next-newer article. */
  next: BlogCard | null
  related: BlogCard[]
}

const DEFAULT_AUTHOR = "MStack360 Team"
const WORDS_PER_MINUTE = 220

async function payloadClient() {
  return getPayload({ config })
}

// ── Lexical helpers ──────────────────────────────────────────────────────────

type LexicalNode = {
  type?: string
  tag?: string
  text?: string
  children?: LexicalNode[]
  fields?: Record<string, unknown>
  /** Added by annotateHeadings — the id the rendered heading and the TOC share. */
  anchor?: string
  [k: string]: unknown
}

function rootChildren(body: BlogPost["body"]): LexicalNode[] {
  return (body?.root?.children as LexicalNode[] | undefined) ?? []
}

// Keys inside a block's fields that hold settings or ids, not reader-facing text.
const NON_TEXT_KEYS = new Set(["id", "blockType", "blockName", "language", "tone", "layout", "mobile", "href", "url"])

// Every reader-facing string inside a block's fields, however deeply nested
// (steps, table rows and cells, FAQ answers...), so reading time counts them.
function fieldText(value: unknown, key = ""): string {
  if (NON_TEXT_KEYS.has(key)) return ""
  if (typeof value === "string") return value
  if (Array.isArray(value)) return value.map((v) => fieldText(v)).join(" ")
  if (value && typeof value === "object") {
    return Object.entries(value as Record<string, unknown>)
      .map(([k, v]) => fieldText(v, k))
      .join(" ")
  }
  return ""
}

function textOf(node: LexicalNode): string {
  if (typeof node.text === "string") return node.text
  const own = node.fields ? fieldText(node.fields) : ""
  const nested = (node.children ?? []).map(textOf).join(" ")
  return own ? `${own} ${nested}` : nested
}

export type BlogFaq = { question: string; answer: string }

// Questions from every FAQ block in the body, for FAQPage structured data.
function collectFaqs(body: BlogPost["body"]): BlogFaq[] {
  const out: BlogFaq[] = []
  for (const node of rootChildren(body)) {
    if (node.type !== "block" || node.fields?.blockType !== "FAQ") continue
    const items = Array.isArray(node.fields.items) ? (node.fields.items as Record<string, unknown>[]) : []
    for (const item of items) {
      const question = typeof item.question === "string" ? item.question.trim() : ""
      const answer = typeof item.answer === "string" ? item.answer.trim() : ""
      if (question && answer) out.push({ question, answer })
    }
  }
  return out
}

function countWords(body: BlogPost["body"]): number {
  const text = rootChildren(body).map(textOf).join(" ")
  const matches = text.match(/\S+/g)
  return matches ? matches.length : 0
}

function readingMinutes(body: BlogPost["body"], excerpt: string): number {
  const words = countWords(body) || excerpt.split(/\s+/).length
  return Math.max(1, Math.round(words / WORDS_PER_MINUTE))
}

function slugify(text: string): string {
  return (
    text
      .normalize("NFKD")
      .replace(/\p{M}/gu, "")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 64) || "section"
  )
}

// Gives every top-level h2/h3 a unique anchor and returns the matching table
// of contents. The anchor is written onto the node itself, so the renderer
// reads the exact id the TOC links to — the two can never drift apart, and
// two headings with the same text still get distinct ids.
function annotateHeadings(body: BlogPost["body"]): BlogTocItem[] {
  const seen = new Map<string, number>()
  const toc: BlogTocItem[] = []

  for (const node of rootChildren(body)) {
    if (node.type !== "heading" || (node.tag !== "h2" && node.tag !== "h3")) continue
    const text = textOf(node).trim()
    if (!text) continue

    const base = slugify(text)
    const n = seen.get(base) ?? 0
    seen.set(base, n + 1)
    const id = n === 0 ? base : `${base}-${n + 1}`

    node.anchor = id
    toc.push({ id, text, level: node.tag === "h2" ? 2 : 3 })
  }

  return toc
}

// ── Mapping ──────────────────────────────────────────────────────────────────

const DATE_FORMAT = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
  year: "numeric",
  timeZone: "UTC",
})

function formatDate(iso: string): string {
  const d = new Date(iso)
  return Number.isNaN(d.getTime()) ? "" : DATE_FORMAT.format(d)
}

// An upload field is only an object once populated (depth >= 1). Anything
// without a usable url resolves to null, so the component draws its own
// artwork instead of a broken <img>.
function toImage(field: BlogPost["coverImage"]): BlogImage | null {
  const media = field as Media | string | null | undefined
  if (!media || typeof media !== "object" || !media.url) return null
  return {
    url: media.url,
    alt: media.alt ?? "",
    width: media.width ?? null,
    height: media.height ?? null,
  }
}

function toCard(doc: BlogPost): BlogCard {
  return {
    id: String(doc.id),
    slug: doc.slug,
    title: doc.title,
    excerpt: doc.excerpt,
    tag: doc.tag,
    publishedDate: doc.publishedDate,
    dateLabel: formatDate(doc.publishedDate),
    readingMinutes: readingMinutes(doc.body, doc.excerpt),
    featured: Boolean(doc.featured),
    cover: toImage(doc.coverImage),
    authorName: doc.author?.name?.trim() || DEFAULT_AUTHOR,
  }
}

// ── Queries ──────────────────────────────────────────────────────────────────
// All tagged "blog-posts": the collection's afterChange hook marks that tag
// stale, so a publish in /admin reaches the site on the next visit.
//
// pagination: false skips the count query Payload would run to build page
// metadata nobody reads.

/**
 * Every published article, newest first, as cards. One cached read serves the
 * /blog index, the featured grid, topic counts, and every article page's
 * previous/next/related links.
 */
export async function getBlogPosts(): Promise<BlogCard[]> {
  "use cache"
  cacheLife("hours")
  cacheTag("blog-posts")

  const payload = await payloadClient()
  const { docs } = await payload.find({
    collection: "blog-posts",
    where: { status: { equals: "published" } },
    sort: "-publishedDate",
    depth: 1,
    pagination: false,
    // body is read only to count words — it never leaves this function, so
    // the index page's HTML carries a number, not the article text.
    select: {
      slug: true,
      title: true,
      excerpt: true,
      tag: true,
      publishedDate: true,
      featured: true,
      coverImage: true,
      author: true,
      body: true,
    },
  })

  return (docs as BlogPost[]).map(toCard)
}

/** Used by generateStaticParams — slugs only. */
export async function getBlogPostSlugs(): Promise<string[]> {
  "use cache"
  cacheLife("hours")
  cacheTag("blog-posts")

  const payload = await payloadClient()
  const { docs } = await payload.find({
    collection: "blog-posts",
    where: { status: { equals: "published" } },
    depth: 0,
    pagination: false,
    select: { slug: true },
  })
  return docs.map((doc) => doc.slug)
}

export async function getBlogPostBySlug(slug: string): Promise<BlogPostDetail | null> {
  "use cache"
  cacheLife("hours")
  cacheTag("blog-posts")

  const payload = await payloadClient()
  const { docs } = await payload.find({
    collection: "blog-posts",
    where: { slug: { equals: slug }, status: { equals: "published" } },
    limit: 1,
    depth: 1,
    pagination: false,
  })
  const doc = docs[0] as BlogPost | undefined
  if (!doc) return null

  const toc = annotateHeadings(doc.body)

  return {
    ...toCard(doc),
    body: doc.body ?? null,
    toc,
    faqs: collectFaqs(doc.body),
    keyTakeaways: (doc.keyTakeaways ?? []).map((k) => k.point).filter(Boolean),
    author: {
      name: doc.author?.name?.trim() || DEFAULT_AUTHOR,
      role: doc.author?.role?.trim() ?? "",
      bio: doc.author?.bio?.trim() ?? "",
      linkedin: doc.author?.linkedin?.trim() || null,
    },
    updatedAt: doc.updatedAt,
  }
}

/**
 * Previous / next in publish order, plus up to `limit` related articles —
 * same topic first, topped up with the most recent so the section is never
 * thin. Derived from the cached list, so it costs no extra query.
 */
export async function getBlogNeighbours(slug: string, tag: string, limit = 3): Promise<BlogNeighbours> {
  const posts = await getBlogPosts()
  const index = posts.findIndex((p) => p.slug === slug)

  const others = posts.filter((p) => p.slug !== slug)
  const sameTopic = others.filter((p) => p.tag === tag)
  const fill = others.filter((p) => p.tag !== tag)

  return {
    // Newest-first list: the older article sits after this one.
    previous: index >= 0 ? posts[index + 1] ?? null : null,
    next: index > 0 ? posts[index - 1] : null,
    related: [...sameTopic, ...fill].slice(0, limit),
  }
}
