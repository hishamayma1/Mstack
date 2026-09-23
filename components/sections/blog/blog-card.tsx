import Image from "next/image"
import Link from "next/link"
import type { BlogCard as BlogCardData, BlogImage } from "@/lib/cms/blog"
import styles from "./blog.module.css"

// Pure markup — no hooks — so the server sections (featured grid, "Keep
// reading") and the client explorer all render the same card.

// Blue and teal alternate by position, as they do on every other grid on the
// site, so a row of cards never reads as one flat block of the same accent.
export function accentFor(index: number) {
  return index % 2 === 0
    ? {
        hoverCard: "hover:border-blue-500/30 hover:bg-accent/30 focus-visible:border-blue-500/40",
        hoverTitle: "group-hover:text-blue-600 dark:group-hover:text-blue-300/90",
        link: "text-blue-600 dark:text-blue-300/80",
        teal: false,
      }
    : {
        hoverCard: "hover:border-teal/30 hover:bg-teal/5 focus-visible:border-teal/40",
        hoverTitle: "group-hover:text-teal",
        link: "text-teal/90",
        teal: true,
      }
}

/** Real cover image when there is one, the CSS "stack" artwork when not. */
export function BlogCover({
  cover,
  teal = false,
  large = false,
  priority = false,
  sizes,
}: {
  cover: BlogImage | null
  teal?: boolean
  large?: boolean
  priority?: boolean
  sizes: string
}) {
  if (cover) {
    return (
      <Image
        src={cover.url}
        alt={cover.alt}
        fill
        sizes={sizes}
        priority={priority}
        className={`${styles.coverImg} object-cover`}
      />
    )
  }
  return (
    <div
      aria-hidden="true"
      className={`${styles.art} ${teal ? styles.artTeal : ""} ${large ? styles.artLarge : ""}`}
    >
      <div className={styles.bars}>
        <span className={styles.bar} />
        <span className={styles.bar} />
        <span className={styles.bar} />
      </div>
    </div>
  )
}

export function BlogMeta({ post, className = "" }: { post: BlogCardData; className?: string }) {
  return (
    <p className={`text-[11px] text-muted-foreground tracking-wide ${className}`}>
      <time dateTime={post.publishedDate}>{post.dateLabel}</time>
      <span aria-hidden="true"> · </span>
      {post.readingMinutes} min read
    </p>
  )
}

export function BlogCard({
  post,
  index,
  headingLevel = "h3",
  showExcerpt = true,
}: {
  post: BlogCardData
  index: number
  headingLevel?: "h2" | "h3"
  showExcerpt?: boolean
}) {
  const accent = accentFor(index)
  const Heading = headingLevel

  return (
    <Link
      href={`/blog/${post.slug}`}
      className={`${styles.card} group h-full flex flex-col rounded-2xl border border-border bg-card overflow-hidden outline-none focus-visible:ring-2 focus-visible:ring-ring/50 ${accent.hoverCard}`}
    >
      <div className="relative aspect-[16/9] border-b border-border overflow-hidden">
        <BlogCover cover={post.cover} teal={accent.teal} sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 380px" />
        <span className="absolute left-4 top-4 inline-flex items-center px-3 py-1 rounded-full text-[11px] tracking-widest text-foreground/80 bg-background/70 backdrop-blur-sm border border-border">
          {post.tag}
        </span>
      </div>

      <div className="flex flex-col flex-1 p-6 md:p-7">
        <BlogMeta post={post} className="mb-3" />
        <Heading className={`text-lg font-light leading-snug tracking-tight transition-colors ${accent.hoverTitle}`}>
          {post.title}
        </Heading>
        {showExcerpt ? (
          <p className="mt-3 text-sm text-muted-foreground leading-relaxed line-clamp-3">{post.excerpt}</p>
        ) : null}
        <span className={`mt-auto pt-6 text-xs tracking-wide ${accent.link}`}>
          Read article <span className={styles.arrow} aria-hidden="true">→</span>
        </span>
      </div>
    </Link>
  )
}
