import Link from "next/link"
import { Tag } from "@/components/ui/tag"
import { stagger } from "@/lib/motion"
import type { BlogCard as BlogCardData } from "@/lib/cms/blog"
import { BlogCard } from "@/components/sections/blog/blog-card"
import motion from "@/components/ui/motion.module.css"

// "Keep reading" under an article — same topic first, then the newest (see
// getBlogNeighbours), so a reader who finished always has a next step that
// isn't a sales pitch.
export function BlogRelatedSection({ posts, topic }: { posts: BlogCardData[]; topic: string }) {
  if (posts.length === 0) return null

  return (
    <section aria-labelledby="related-heading" className="py-24 px-6 md:px-12 lg:px-20 border-t border-border">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div className={`${motion.rise} max-w-xl`}>
            <Tag>KEEP READING</Tag>
            <h2 id="related-heading" className="mt-5 text-2xl md:text-3xl font-light tracking-tight leading-[1.15]">
              More on {topic} and beyond.
            </h2>
          </div>
          <Link
            href="/blog"
            className="text-xs text-blue-600 dark:text-blue-300/80 hover:text-blue-700 dark:hover:text-blue-300 transition-colors tracking-wide shrink-0"
          >
            All articles →
          </Link>
        </div>

        <ul className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {posts.map((post, i) => (
            <li key={post.id} style={stagger(i)} className={motion.riseSm}>
              <BlogCard post={post} index={i} />
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
