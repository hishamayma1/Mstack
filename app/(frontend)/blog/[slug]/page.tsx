import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { PageShell } from "@/components/layout/page-shell"
import { ArticleHero } from "@/components/sections/blog/article-hero"
import { ArticleBody } from "@/components/sections/blog/article-body"
import { ArticleToc } from "@/components/sections/blog/article-toc"
import { MobileReadingBar } from "@/components/sections/blog/mobile-reading-bar"
import { ArticleShare } from "@/components/sections/blog/article-share"
import {
  AsideCTA,
  AuthorCard,
  KeyTakeaways,
  PrevNext,
} from "@/components/sections/blog/article-extras"
import { BlogRelatedSection } from "@/components/sections/blog/blog-related-section"
import { FinalCTASection } from "@/components/sections/shared/final-cta-section"
import { getBlogNeighbours, getBlogPostBySlug, getBlogPostSlugs } from "@/lib/cms/blog"
import styles from "@/components/sections/blog/blog.module.css"

const ARTICLE_ID = "article"
const SITE_URL = process.env.NEXT_PUBLIC_SERVER_URL?.replace(/\/$/, "") ?? ""

// One static page per published article, prerendered at build. Articles
// published later render on first request and are then served from the
// cache; edits in /admin invalidate the "blog-posts" tag, so the next visit
// gets the new version without a rebuild.
export async function generateStaticParams() {
  const slugs = await getBlogPostSlugs()
  return slugs.map((slug) => ({ slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const post = await getBlogPostBySlug(slug)

  // An unknown slug renders not-found.tsx, but metadata resolves from this
  // route — returning {} would leave the 404 showing the site-wide default.
  if (!post) {
    return {
      title: "Page Not Found | MStack360",
      description: "That article doesn't exist. Browse everything on the MStack360 blog.",
      robots: { index: false, follow: true },
    }
  }

  return {
    title: `${post.title} | MStack360 Blog`,
    description: post.excerpt,
    authors: [{ name: post.author.name }],
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: "article",
      publishedTime: post.publishedDate,
      modifiedTime: post.updatedAt,
      authors: [post.author.name],
      tags: [post.tag],
      images: post.cover ? [{ url: post.cover.url, alt: post.cover.alt }] : undefined,
    },
    twitter: {
      card: post.cover ? "summary_large_image" : "summary",
      title: post.title,
      description: post.excerpt,
    },
  }
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const post = await getBlogPostBySlug(slug)
  if (!post) notFound()

  const { previous, next, related } = await getBlogNeighbours(post.slug, post.tag)
  const hasToc = post.toc.length >= 2

  // Structured data so search engines show the article with its date and
  // author, and the breadcrumb trail instead of a bare URL.
  const url = SITE_URL ? `${SITE_URL}/blog/${post.slug}` : undefined
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BlogPosting",
        headline: post.title,
        description: post.excerpt,
        datePublished: post.publishedDate,
        dateModified: post.updatedAt,
        timeRequired: `PT${post.readingMinutes}M`,
        articleSection: post.tag,
        author: { "@type": post.author.name === "MStack360 Team" ? "Organization" : "Person", name: post.author.name },
        publisher: { "@type": "Organization", name: "MStack360" },
        image: post.cover ? (SITE_URL && post.cover.url.startsWith("/") ? `${SITE_URL}${post.cover.url}` : post.cover.url) : undefined,
        mainEntityOfPage: url,
        url,
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Blog", item: SITE_URL ? `${SITE_URL}/blog` : undefined },
          { "@type": "ListItem", position: 2, name: post.title, item: url },
        ],
      },
      // FAQ blocks in the body become FAQ rich results in search.
      ...(post.faqs.length
        ? [
            {
              "@type": "FAQPage",
              mainEntity: post.faqs.map((f) => ({
                "@type": "Question",
                name: f.question,
                acceptedAnswer: { "@type": "Answer", text: f.answer },
              })),
            },
          ]
        : []),
    ],
  }

  return (
    <PageShell>
      <script
        type="application/ld+json"
        // Escaping "<" keeps a title containing "</script>" from ending the tag.
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
      />

      {/* Reading progress — CSS scroll timeline, no JS. */}
      <div className={styles.progress} aria-hidden="true">
        <div className={styles.progressFill} />
      </div>

      <ArticleHero post={post} />

      <div className="px-6 md:px-12 lg:px-20 pb-24">
        <div
          className={`max-w-6xl mx-auto grid grid-cols-1 gap-10 xl:gap-14 ${
            hasToc ? "lg:grid-cols-[200px_minmax(0,1fr)] xl:grid-cols-[210px_minmax(0,1fr)_210px]" : "xl:grid-cols-[minmax(0,1fr)_210px]"
          }`}
        >
          {hasToc ? (
            <aside className="hidden lg:block">
              <div className="sticky top-28">
                <ArticleToc items={post.toc} articleId={ARTICLE_ID} />
              </div>
            </aside>
          ) : null}

          <article id={ARTICLE_ID} className="min-w-0 w-full max-w-[720px] mx-auto">
            {hasToc ? <MobileReadingBar items={post.toc} articleId={ARTICLE_ID} /> : null}
            <KeyTakeaways points={post.keyTakeaways} minutes={post.readingMinutes} />
            <ArticleBody body={post.body} />

            {/* Share + CTA inline where there's no right-hand sidebar. */}
            <div className="xl:hidden mt-14 flex flex-col gap-6">
              <div className="flex flex-wrap items-center gap-4">
                <span className="text-[11px] tracking-widest text-muted-foreground">SHARE THIS ARTICLE</span>
                <ArticleShare title={post.title} />
              </div>
              <AsideCTA />
            </div>

            <AuthorCard author={post.author} />
            <PrevNext previous={previous} next={next} />
          </article>

          <aside className="hidden xl:block">
            <div className="sticky top-28 flex flex-col gap-8">
              <div>
                <p className="mb-3 text-[11px] tracking-widest text-foreground/80">SHARE</p>
                <ArticleShare title={post.title} />
              </div>
              <AsideCTA />
            </div>
          </aside>
        </div>
      </div>

      <BlogRelatedSection posts={related} topic={post.tag} />
      <FinalCTASection />
    </PageShell>
  )
}
