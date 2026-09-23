import Link from "next/link"
import { RevealText } from "@/components/ui/reveal-text"
import type { BlogPostDetail } from "@/lib/cms/blog"
import { BlogCover } from "@/components/sections/blog/blog-card"
import { AuthorAvatar } from "@/components/sections/blog/article-extras"
import styles from "@/components/sections/shared/page-hero.module.css"

// Article header: breadcrumb, title, standfirst, byline, then the cover.
// Centred and narrow so the title reads as one block; the cover spans the
// full content width underneath and is the page's LCP image, so it's
// prioritised.
export function ArticleHero({ post }: { post: BlogPostDetail }) {
  return (
    <section className="relative pt-32 md:pt-40 pb-10 px-6 md:px-12 lg:px-20 overflow-hidden">
      <div className={styles.grid} aria-hidden="true" />
      <div className={styles.glow} aria-hidden="true" />

      <div className="relative z-10 max-w-6xl mx-auto">
        <div className="max-w-3xl mx-auto text-center">
          <nav aria-label="Breadcrumb" className="mb-7">
            <ol className="flex flex-wrap items-center justify-center gap-2 text-xs text-muted-foreground tracking-wide">
              <li>
                <Link href="/blog" className="hover:text-foreground transition-colors">
                  Blog
                </Link>
              </li>
              <li aria-hidden="true">/</li>
              <li>
                <span className="px-2.5 py-0.5 rounded-full bg-accent/50 text-foreground/70">{post.tag}</span>
              </li>
              <li aria-hidden="true" className="hidden sm:block">/</li>
              <li aria-current="page" className="hidden sm:block max-w-[18rem] truncate text-foreground/60">
                {post.title}
              </li>
            </ol>
          </nav>

          <RevealText
            as="h1"
            stagger={2}
            className="text-4xl md:text-5xl lg:text-6xl font-light tracking-tight leading-[1.08]"
          >
            {post.title}
          </RevealText>

          <p className="mt-6 text-base md:text-lg text-muted-foreground leading-relaxed">{post.excerpt}</p>

          <div className="mt-8 flex items-center justify-center gap-3">
            <AuthorAvatar name={post.author.name} size="sm" />
            <div className="text-left">
              <p className="text-sm text-foreground">{post.author.name}</p>
              <p className="text-xs text-muted-foreground tracking-wide">
                <time dateTime={post.publishedDate}>{post.dateLabel}</time>
                <span aria-hidden="true"> · </span>
                {post.readingMinutes} min read
              </p>
            </div>
          </div>
        </div>

        <div className="relative mt-12 aspect-[16/9] md:aspect-[21/8] rounded-3xl border border-border bg-card overflow-hidden">
          <BlogCover cover={post.cover} large priority sizes="(max-width: 1280px) 100vw, 1152px" />
        </div>
      </div>
    </section>
  )
}
