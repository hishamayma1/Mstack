"use client"

import type { BlogTocItem } from "@/lib/cms/blog"
import { useReadingProgress } from "@/components/sections/blog/use-reading-progress"
import { Checklist, ProgressRing, statusLine } from "@/components/sections/blog/reading-checklist"

// Desktop "On this page" sidebar (lg+): every section of the article as a
// row that ticks itself off once read, with overall progress as a ring.
// Below lg the same state is shown by MobileReadingBar.

export function ArticleToc({ items, articleId }: { items: BlogTocItem[]; articleId: string }) {
  const { active, percent } = useReadingProgress(items, articleId)
  const read = Math.max(0, Math.min(active, items.length))

  return (
    <nav aria-label="On this page">
      <div className="flex items-center gap-3 mb-4">
        <ProgressRing percent={percent} />
        <div className="min-w-0">
          <p className="text-[11px] tracking-widest text-foreground/80">ON THIS PAGE</p>
          <p className={`text-[11px] tracking-wide ${read >= items.length ? "text-teal" : "text-muted-foreground"}`} aria-live="polite">
            {statusLine(read, items.length)}
          </p>
        </div>
      </div>
      <Checklist items={items} active={active} />
    </nav>
  )
}
