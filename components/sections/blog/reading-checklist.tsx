"use client"

import type { BlogTocItem } from "@/lib/cms/blog"
import { jumpTo } from "@/components/sections/blog/use-reading-progress"
import styles from "./blog.module.css"

// The reading checklist's building blocks: a progress ring and the list of
// sections that tick themselves off once read. Shared by the desktop sidebar
// (article-toc.tsx) and the mobile bar (mobile-reading-bar.tsx).

export function ProgressRing({ percent, size = 36 }: { percent: number; size?: number }) {
  const stroke = 3
  const r = (size - stroke) / 2
  const c = 2 * Math.PI * r
  return (
    <span className="relative shrink-0 inline-flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="-rotate-90" aria-hidden="true">
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="currentColor" strokeWidth={stroke} className="text-border" />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke="url(#toc-ring)"
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={c * (1 - percent / 100)}
          className="transition-[stroke-dashoffset] duration-300 ease-out"
        />
        <defs>
          <linearGradient id="toc-ring" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="rgb(37 99 235)" />
            <stop offset="100%" stopColor="var(--teal)" />
          </linearGradient>
        </defs>
      </svg>
      <span className="absolute text-[9px] tabular-nums text-foreground/80">{percent}</span>
    </span>
  )
}

export function Checklist({
  items,
  active,
  onPick,
}: {
  items: BlogTocItem[]
  active: number
  onPick?: () => void
}) {
  return (
    <ol className="flex flex-col gap-0.5 border-l border-border">
      {items.map((item, i) => {
        const isActive = i === active
        const passed = i < active
        return (
          <li key={item.id}>
            <a
              href={`#${item.id}`}
              onClick={(e) => {
                e.preventDefault()
                jumpTo(item.id)
                onPick?.()
              }}
              aria-current={isActive ? "location" : undefined}
              className={`${styles.tocLink} flex items-start gap-2.5 py-2 pr-2 text-[13px] leading-snug rounded-r-lg ${
                item.level === 3 ? "pl-7" : "pl-4"
              } ${
                isActive
                  ? "text-foreground bg-accent/40"
                  : passed
                    ? "text-muted-foreground hover:text-foreground"
                    : "text-foreground/60 hover:text-foreground"
              }`}
            >
              <span className="mt-[2px] shrink-0 w-4 h-4 flex items-center justify-center" aria-hidden="true">
                {passed ? (
                  <span className="w-4 h-4 rounded-full bg-teal/15 text-teal flex items-center justify-center animate-[fade-up_0.3s_ease-out]">
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.4" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M5 12l5 5 9-10" />
                    </svg>
                  </span>
                ) : isActive ? (
                  <span className="w-4 h-4 rounded-full border-2 border-blue-500 flex items-center justify-center">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                  </span>
                ) : (
                  <span className="w-4 h-4 rounded-full border-2 border-foreground/20" />
                )}
              </span>
              <span className={passed ? "line-through decoration-foreground/20" : ""}>{item.text}</span>
              {passed ? <span className="sr-only"> (read)</span> : null}
            </a>
          </li>
        )
      })}
    </ol>
  )
}

export function statusLine(read: number, total: number) {
  if (read >= total) return "Finished — nice work"
  if (read === 0) return `${total} sections`
  return `${read} of ${total} sections read`
}
