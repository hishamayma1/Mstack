// One-off: bring an existing database's blog posts up to the current seed.
//
//   pnpm seed:blog              create missing seed posts; upgrade seed posts
//                               that still hold the original plain-paragraph
//                               body (no headings, no blocks)
//   pnpm seed:blog --overwrite  also replace seed posts an editor has changed
//
// payload.config.ts only seeds a collection when it is empty, so a database
// created before the blog redesign never receives the new headings, blocks,
// takeaways and authors. Posts whose slug isn't in the seed are never touched.
import { getPayload } from "payload"
import config from "../payload.config"
import { BLOG_POSTS_SEED } from "../lib/seed/resources-seed"

type Node = { type?: string; children?: Node[] }

// A body with no heading and no block is the original seed text (or close to
// it) — safe to upgrade. Anything richer was shaped by an editor.
function isPlain(body: unknown): boolean {
  const children = ((body as { root?: { children?: Node[] } } | null)?.root?.children ?? []) as Node[]
  return !children.some((n) => n.type === "heading" || n.type === "block")
}

async function main() {
  const overwrite = process.argv.includes("--overwrite")
  const payload = await getPayload({ config })

  let created = 0
  let updated = 0
  let skipped = 0

  for (const post of BLOG_POSTS_SEED) {
    const { docs } = await payload.find({
      collection: "blog-posts",
      where: { slug: { equals: post.slug } },
      limit: 1,
      depth: 0,
      pagination: false,
    })
    const existing = docs[0]

    if (!existing) {
      await payload.create({ collection: "blog-posts", data: post as never })
      payload.logger.info(`created  ${post.slug}`)
      created++
      continue
    }

    if (!overwrite && !isPlain(existing.body)) {
      payload.logger.info(`skipped  ${post.slug} (already edited — pass --overwrite to replace)`)
      skipped++
      continue
    }

    // Leave status and publish date as the editor has them.
    const { status: _status, publishedDate: _date, ...content } = post
    await payload.update({
      collection: "blog-posts",
      id: existing.id,
      data: content as never,
    })
    payload.logger.info(`updated  ${post.slug}`)
    updated++
  }

  payload.logger.info(`Done: ${created} created, ${updated} updated, ${skipped} skipped.`)
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err)
    process.exit(1)
  })
