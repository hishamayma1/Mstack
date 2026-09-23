import { RevealText } from "@/components/ui/reveal-text"
import { Tag } from "@/components/ui/tag"
import { BlogSearch, type BlogSearchItem } from "@/components/sections/blog/blog-search"
import styles from "@/components/sections/shared/page-hero.module.css"

// /blog hero. Same backdrop and type scale as every other page hero, with the
// search box as the primary action — on a blog, "find the thing I came for"
// is the job, so it gets the spot a CTA would take elsewhere.
export function BlogHero({
  total,
  items,
  popular,
}: {
  total: number
  items: BlogSearchItem[]
  popular: string[]
}) {
  return (
    <section className="relative pt-36 md:pt-44 pb-16 md:pb-20 px-6 md:px-12 lg:px-20">
      <div className={`${styles.grid} overflow-hidden`} aria-hidden="true" />
      <div className={styles.glow} aria-hidden="true" />
      <div className="relative z-10 max-w-4xl mx-auto text-center">
        <div className="flex justify-center">
          <Tag>
            <span className="inline-flex items-center justify-center min-w-5 h-5 px-1.5 rounded-full bg-linear-to-br from-blue-600 to-cyan-600 text-white text-[10px] tracking-normal">
              {total}
            </span>
            THE MSTACK360 BLOG
          </Tag>
        </div>
        <RevealText
          as="h1"
          className="mt-5 text-5xl md:text-6xl lg:text-7xl font-light tracking-tight leading-[1.05]"
        >
          {"Microsoft 365, Explained by\nthe People Who Deploy It."}
        </RevealText>
        <p className="mt-6 text-base text-muted-foreground leading-relaxed max-w-2xl mx-auto">
          Step-by-step guides on migrations, security and automation — written from real client projects, not
          from the documentation.
        </p>
        <div className="mt-10">
          <BlogSearch items={items} popular={popular} />
        </div>
      </div>
    </section>
  )
}
