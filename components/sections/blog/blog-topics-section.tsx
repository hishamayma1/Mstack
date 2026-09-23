import type { ReactNode } from "react"
import { Tag } from "@/components/ui/tag"
import { stagger } from "@/lib/motion"
import type { BlogCard } from "@/lib/cms/blog"
import { TopicJump } from "@/components/sections/blog/blog-search"
import motion from "@/components/ui/motion.module.css"

// "Browse by topic" — one card per tag that has at least one article, with a
// count and a line on what the topic covers. Each card filters the article
// grid below and scrolls to it.
//
// The topic list is derived from the articles themselves, so a new tag added
// to the collection shows up here with no code change; the blurbs and icons
// below are optional polish on top.

const TOPIC_COPY: Record<string, { blurb: string; icon: ReactNode }> = {
  Migration: {
    blurb: "Moving mail, files and tenants without losing a thing",
    icon: <path d="M4 12h13M13 6l6 6-6 6" />,
  },
  Security: {
    blurb: "MFA, conditional access and the audits that matter",
    icon: (
      <>
        <path d="M12 3l8 3v6c0 4.5-3.4 8.3-8 9-4.6-.7-8-4.5-8-9V6z" />
        <path d="M9 12l2 2 4-4" />
      </>
    ),
  },
  Automation: {
    blurb: "Power Automate flows that pay for themselves",
    icon: <path d="M13 3 5 13h6l-1 8 8-10h-6z" />,
  },
  "Power Platform": {
    blurb: "Apps, governance and letting people build safely",
    icon: (
      <>
        <rect x="3" y="3" width="7" height="7" rx="1.5" />
        <rect x="14" y="3" width="7" height="7" rx="1.5" />
        <rect x="3" y="14" width="7" height="7" rx="1.5" />
        <rect x="14" y="14" width="7" height="7" rx="1.5" />
      </>
    ),
  },
  SharePoint: {
    blurb: "Structure, permissions and life after the file server",
    icon: (
      <>
        <path d="M4 7a2 2 0 0 1 2-2h4l2 2h6a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2z" />
      </>
    ),
  },
  General: {
    blurb: "How we think about running Microsoft 365 well",
    icon: (
      <>
        <circle cx="12" cy="12" r="9" />
        <path d="M12 8v4l3 2" />
      </>
    ),
  },
}

const FALLBACK_ICON = <circle cx="12" cy="12" r="8" />

export type BlogTopic = { name: string; count: number }

export function getTopics(posts: BlogCard[]): BlogTopic[] {
  const counts = new Map<string, number>()
  for (const p of posts) counts.set(p.tag, (counts.get(p.tag) ?? 0) + 1)
  return [...counts.entries()]
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name))
}

export function BlogTopicsSection({ topics }: { topics: BlogTopic[] }) {
  if (topics.length < 2) return null

  return (
    <section aria-labelledby="topics-heading" className="py-16 px-6 md:px-12 lg:px-20">
      <div className="max-w-6xl mx-auto">
        <div className={`${motion.rise} mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4`}>
          <div>
            <Tag>LEARNING PATHS</Tag>
            <h2 id="topics-heading" className="mt-4 text-2xl md:text-3xl font-light tracking-tight">
              Browse by topic.
            </h2>
          </div>
          <p className="text-sm text-muted-foreground max-w-sm leading-relaxed">
            Pick a topic to filter every article below.
          </p>
        </div>

        <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {topics.map((topic, i) => {
            const copy = TOPIC_COPY[topic.name]
            const teal = i % 2 === 1
            return (
              <li key={topic.name} style={stagger(i, 5)} className={motion.riseSm}>
                <TopicJump
                  topic={topic.name}
                  className={`${motion.tile} group w-full h-full text-left flex items-center gap-4 rounded-2xl border border-border bg-card p-5 outline-none focus-visible:ring-2 focus-visible:ring-ring/50 ${
                    teal ? "hover:border-teal/30 hover:bg-teal/5" : "hover:border-blue-500/30 hover:bg-accent/30"
                  }`}
                >
                  <span
                    className={`${motion.tileIcon} shrink-0 w-12 h-12 rounded-xl border border-border flex items-center justify-center ${
                      teal ? "text-teal bg-teal/10" : "text-blue-600 dark:text-blue-400 bg-accent/50"
                    }`}
                    aria-hidden="true"
                  >
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                      {copy?.icon ?? FALLBACK_ICON}
                    </svg>
                  </span>
                  <span className="flex-1 min-w-0">
                    <span className="block text-base font-light text-foreground">{topic.name}</span>
                    <span className="block mt-0.5 text-xs text-muted-foreground leading-relaxed">
                      {topic.count} {topic.count === 1 ? "article" : "articles"}
                      {copy ? <> · {copy.blurb}</> : null}
                    </span>
                  </span>
                  <span
                    aria-hidden="true"
                    className={`shrink-0 transition-transform duration-300 group-hover:translate-x-1 ${teal ? "text-teal" : "text-blue-600 dark:text-blue-400"}`}
                  >
                    →
                  </span>
                </TopicJump>
              </li>
            )
          })}
        </ul>
      </div>
    </section>
  )
}
