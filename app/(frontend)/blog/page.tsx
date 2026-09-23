import type { Metadata } from "next"
import { PageShell } from "@/components/layout/page-shell"
import { BlogHero } from "@/components/sections/blog/blog-hero"
import { BlogFeaturedSection, pickFeatured } from "@/components/sections/blog/blog-featured-section"
import { BlogTopicsSection, getTopics } from "@/components/sections/blog/blog-topics-section"
import { BlogExplorer } from "@/components/sections/blog/blog-explorer"
import { FinalCTASection } from "@/components/sections/shared/final-cta-section"
import { getBlogPosts } from "@/lib/cms/blog"

export const metadata: Metadata = {
  title: "Blog | MStack360 — Microsoft 365 Guides From Real Projects",
  description:
    "Step-by-step Microsoft 365 guides on migrations, security, SharePoint and automation, written by the team that deploys them.",
  openGraph: {
    title: "The MStack360 Blog",
    description: "Microsoft 365, explained by the people who deploy it.",
    type: "website",
  },
}

// Server component. Every published article is read once through Payload's
// local API and cached under the "blog-posts" tag (lib/cms/blog.ts) — the
// collection's afterChange hook invalidates it on publish. The featured grid
// and topic cards are pure server HTML; only search, filtering and paging are
// client components, and they run against the list handed to them here, so
// there's no client-side fetch and no request per keystroke.
export default async function BlogPage() {
  const posts = await getBlogPosts()

  const featured = pickFeatured(posts)
  const topics = getTopics(posts)
  // Search needs only these four fields — not the cover, author or dates.
  const searchItems = posts.map(({ slug, title, tag, excerpt }) => ({ slug, title, tag, excerpt }))

  return (
    <PageShell>
      <BlogHero total={posts.length} items={searchItems} popular={topics.slice(0, 4).map((t) => t.name)} />
      {posts.length === 0 ? (
        <section className="pb-32 px-6 text-center">
          <p className="text-sm text-muted-foreground">The first articles are on their way. Check back soon.</p>
        </section>
      ) : (
        <>
          <BlogFeaturedSection posts={featured} />
          <BlogTopicsSection topics={topics} />
          <BlogExplorer posts={posts} />
        </>
      )}
      <FinalCTASection />
    </PageShell>
  )
}
