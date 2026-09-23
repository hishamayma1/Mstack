import Link from "next/link"
import type { BlogAuthor, BlogCard } from "@/lib/cms/blog"
import styles from "./blog.module.css"

// The smaller pieces around an article body. All server components.

function initials(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase())
    .join("")
}

export function AuthorAvatar({ name, size = "md" }: { name: string; size?: "sm" | "md" }) {
  const box = size === "sm" ? "w-10 h-10 text-xs" : "w-14 h-14 text-sm"
  return (
    <span
      aria-hidden="true"
      className={`${box} shrink-0 rounded-full flex items-center justify-center bg-linear-to-br from-blue-600 to-cyan-600 text-white tracking-wider`}
    >
      {initials(name)}
    </span>
  )
}

/** "In 30 seconds" — the editor's takeaways, above the body. */
export function KeyTakeaways({ points, minutes }: { points: string[]; minutes: number }) {
  if (points.length === 0) return null
  return (
    <div className="mb-12 rounded-2xl border border-blue-500/20 bg-accent/30 p-6 md:p-7">
      <p className="flex items-center gap-2 text-[11px] tracking-widest text-blue-600 dark:text-blue-300">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
          <circle cx="12" cy="12" r="9" />
          <path d="M12 7v5l3 2" />
        </svg>
        IN 30 SECONDS
        <span className="ml-auto text-muted-foreground tracking-wide normal-case">Full read: {minutes} min</span>
      </p>
      <ul className="mt-4 flex flex-col gap-3">
        {points.map((point) => (
          <li key={point} className="flex gap-3 text-[0.95rem] leading-relaxed text-foreground/85">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" className="mt-1 shrink-0 text-teal" aria-hidden="true">
              <path d="M5 12l5 5 9-10" />
            </svg>
            {point}
          </li>
        ))}
      </ul>
    </div>
  )
}

export function AuthorCard({ author }: { author: BlogAuthor }) {
  return (
    <div className="mt-14 rounded-2xl border border-border bg-card p-6 md:p-7 flex gap-5 items-start">
      <AuthorAvatar name={author.name} />
      <div>
        <p className="text-[11px] tracking-widest text-muted-foreground">WRITTEN BY</p>
        <p className="mt-1 text-lg font-light">
          {author.name}
          {author.role ? <span className="text-muted-foreground">, {author.role}</span> : null}
        </p>
        <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
          {author.bio ||
            "The MStack360 team delivers Microsoft 365 migrations, security and Power Platform projects for businesses across North America, Europe, Australia and the Middle East."}
        </p>
        {author.linkedin ? (
          <a
            href={author.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-3 inline-block text-xs tracking-wide text-blue-600 dark:text-blue-300/80 hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
          >
            Connect on LinkedIn →
          </a>
        ) : null}
      </div>
    </div>
  )
}

export function PrevNext({ previous, next }: { previous: BlogCard | null; next: BlogCard | null }) {
  if (!previous && !next) return null
  const card =
    "group flex flex-col gap-1.5 rounded-2xl border border-border bg-card p-5 hover:border-blue-500/30 hover:bg-accent/30"
  return (
    <nav aria-label="More articles" className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-3">
      {previous ? (
        <Link href={`/blog/${previous.slug}`} className={`${styles.card} ${card}`}>
          <span className="text-[11px] tracking-widest text-muted-foreground">← PREVIOUS</span>
          <span className="text-sm font-light leading-snug group-hover:text-blue-600 dark:group-hover:text-blue-300/90 transition-colors">
            {previous.title}
          </span>
        </Link>
      ) : (
        <span className="hidden sm:block" />
      )}
      {next ? (
        <Link href={`/blog/${next.slug}`} className={`${styles.card} ${card} sm:items-end sm:text-right`}>
          <span className="text-[11px] tracking-widest text-muted-foreground">NEXT →</span>
          <span className="text-sm font-light leading-snug group-hover:text-blue-600 dark:group-hover:text-blue-300/90 transition-colors">
            {next.title}
          </span>
        </Link>
      ) : null}
    </nav>
  )
}

/** Sidebar pitch — sticky alongside the article on wide screens. */
export function AsideCTA() {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-border bg-card p-6">
      <div
        aria-hidden="true"
        className="absolute -right-10 -top-10 w-36 h-36 rounded-full"
        style={{ background: "radial-gradient(circle, rgb(var(--teal-rgb) / 0.22), transparent 70%)" }}
      />
      <p className="relative text-base font-light leading-snug">Rather have us do it for you?</p>
      <p className="relative mt-2 text-xs text-muted-foreground leading-relaxed">
        A free 15-minute call. We look at your tenant and tell you what to fix first.
      </p>
      {/* Not CTAButtons: its nowrap + widest tracking is sized for full-width
          sections and overflowed this ~160px sidebar column. Same gradient
          and weight, but full width, tighter tracking, and allowed to wrap. */}
      <Link
        href="/contact"
        className={`${styles.card} group relative mt-5 flex w-full items-center justify-center gap-1.5 rounded-xl bg-linear-to-br from-blue-600 to-cyan-600 px-3 py-2.5 text-center text-[13px] font-medium text-white transition-[filter] duration-200 hover:brightness-110 active:brightness-95 outline-none focus-visible:ring-2 focus-visible:ring-ring/60 focus-visible:ring-offset-2 focus-visible:ring-offset-card`}
      >
        Book a Free Call
        <span className={styles.arrow} aria-hidden="true">
          →
        </span>
      </Link>
    </div>
  )
}
