import Link from "next/link"
import { Tag } from "@/components/ui/tag"
import { stagger } from "@/lib/motion"
import type { BlogCard } from "@/lib/cms/blog"
import { BlogCover, BlogMeta, accentFor } from "@/components/sections/blog/blog-card"
import motion from "@/components/ui/motion.module.css"
import styles from "./blog.module.css"

// "Start with these" — one large card and two small ones. Editors choose them
// with the Featured checkbox; if fewer than three are ticked, the newest
// articles fill the gaps so the grid is never lopsided.
export function pickFeatured(posts: BlogCard[], count = 3): BlogCard[] {
  const featured = posts.filter((p) => p.featured)
  const rest = posts.filter((p) => !p.featured)
  return [...featured, ...rest].slice(0, count)
}

export function BlogFeaturedSection({ posts }: { posts: BlogCard[] }) {
  if (posts.length === 0) return null
  const [lead, ...side] = posts

  return (
    <section aria-labelledby="featured-heading" className="pb-8 px-6 md:px-12 lg:px-20">
      <div className="max-w-6xl mx-auto">
        <div className={`${motion.rise} mb-8`}>
          <Tag>EDITOR&apos;S PICKS</Tag>
          <h2 id="featured-heading" className="mt-4 text-3xl md:text-4xl font-light tracking-tight">
            Start with these.
          </h2>
        </div>

        <div className={`grid grid-cols-1 gap-3 ${side.length > 0 ? "lg:grid-cols-3 lg:grid-rows-2" : ""}`}>
          {/* The reveal sits on a wrapper: an animation with fill-mode "both"
              pins transform, which would cancel the card's hover lift. */}
          <div style={stagger(0)} className={`${motion.scaleIn} ${side.length > 0 ? "lg:col-span-2 lg:row-span-2" : ""}`}>
            <Link
              href={`/blog/${lead.slug}`}
              className={`${styles.card} group relative h-full flex flex-col justify-end min-h-[26rem] lg:min-h-[34rem] rounded-2xl border border-border bg-card overflow-hidden outline-none focus-visible:ring-2 focus-visible:ring-ring/50 hover:border-blue-500/30`}
            >
              <BlogCover cover={lead.cover} large priority sizes="(max-width: 1024px) 100vw, 760px" />
              {/* Scrim: keeps the copy legible over a real photo in either theme. */}
              <div
                aria-hidden="true"
                className="absolute inset-0 bg-linear-to-t from-card via-card/85 to-transparent"
              />
              <div className="relative p-7 md:p-10 max-w-2xl">
                <div className="flex flex-wrap items-center gap-2 mb-5">
                  <span className="px-3 py-1 rounded-full text-[11px] tracking-widest text-white bg-linear-to-br from-blue-600 to-cyan-600">
                    FEATURED
                  </span>
                  <span className="px-3 py-1 rounded-full text-[11px] tracking-widest text-foreground/80 border border-border bg-background/60">
                    {lead.tag}
                  </span>
                </div>
                <h3 className="text-2xl md:text-4xl font-light tracking-tight leading-[1.12] transition-colors group-hover:text-blue-600 dark:group-hover:text-blue-300/90">
                  {lead.title}
                </h3>
                <p className="mt-4 text-sm md:text-base text-muted-foreground leading-relaxed line-clamp-3">
                  {lead.excerpt}
                </p>
                <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-3">
                  <span className="inline-flex items-center gap-3 text-sm tracking-wide text-foreground">
                    Read the article
                    <span className="w-8 h-8 rounded-full flex items-center justify-center bg-foreground text-background">
                      <span className={styles.arrow} aria-hidden="true">→</span>
                    </span>
                  </span>
                  <BlogMeta post={lead} />
                </div>
              </div>
            </Link>
          </div>

          {side.map((post, i) => {
            const accent = accentFor(i + 1)
            return (
              <div key={post.id} style={stagger(i + 1)} className={motion.scaleIn}>
                <Link
                  href={`/blog/${post.slug}`}
                  className={`${styles.card} group relative h-full flex flex-col min-h-60 rounded-2xl border border-border bg-card overflow-hidden outline-none focus-visible:ring-2 focus-visible:ring-ring/50 ${accent.hoverCard}`}
                >
                  <div className="absolute inset-0 opacity-70">
                    <BlogCover cover={null} teal={accent.teal} sizes="1px" />
                  </div>
                  <div className="relative flex flex-col flex-1 p-7">
                    <span className="self-start px-3 py-1 rounded-full text-[11px] tracking-widest text-foreground/80 border border-border bg-background/70">
                      {post.tag}
                    </span>
                    <h3 className={`mt-5 text-lg font-light leading-snug tracking-tight transition-colors ${accent.hoverTitle}`}>
                      {post.title}
                    </h3>
                    <div className="mt-auto pt-6 flex items-center justify-between gap-4">
                      <BlogMeta post={post} />
                      <span className={`text-xs tracking-wide ${accent.link}`}>
                        Read <span className={styles.arrow} aria-hidden="true">→</span>
                      </span>
                    </div>
                  </div>
                </Link>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
