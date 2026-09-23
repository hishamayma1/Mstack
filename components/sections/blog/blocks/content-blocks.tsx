import type { ReactNode } from "react"
import Link from "next/link"

// Server-rendered article blocks (see collections/blog-blocks.ts for the
// fields). Each renders one wrapper element directly under the prose
// container, so it picks up the body's vertical rhythm but none of its
// paragraph/list/link styling — those prose rules are scoped to direct
// children only.

/* eslint-disable @typescript-eslint/no-explicit-any */

type Fields = Record<string, any>
const list = <T,>(v: T[] | null | undefined): T[] => (Array.isArray(v) ? v : [])

const TITLE = "text-xl font-light tracking-tight text-foreground"

// ── Steps ────────────────────────────────────────────────────────────────────

export function StepsBlock({ fields }: { fields: Fields }) {
  const steps = list<{ id?: string; title: string; description?: string }>(fields.steps)
  if (steps.length === 0) return null
  const highlightLast = fields.highlightLast !== false
  const timeline = fields.layout === "timeline"

  return (
    <div>
      {fields.title ? <p className={`${TITLE} mb-5`}>{fields.title}</p> : null}
      <ol className={timeline ? "relative flex flex-col gap-3" : "grid grid-cols-1 sm:grid-cols-2 gap-3"}>
        {timeline ? (
          <span aria-hidden="true" className="absolute left-[19px] top-5 bottom-5 w-px bg-linear-to-b from-blue-500/50 via-teal/40 to-transparent" />
        ) : null}
        {steps.map((step, i) => {
          const last = highlightLast && i === steps.length - 1
          const n = String(i + 1).padStart(2, "0")
          return timeline ? (
            <li key={step.id ?? i} className="relative flex gap-4">
              <span
                className={`relative z-10 shrink-0 w-10 h-10 rounded-full border flex items-center justify-center font-mono text-xs ${
                  last ? "border-teal/50 bg-teal/15 text-teal" : "border-blue-500/40 bg-background text-blue-600 dark:text-blue-300"
                }`}
              >
                {n}
              </span>
              <div className="pt-2 pb-3">
                <p className="text-base text-foreground">{step.title}</p>
                {step.description ? <p className="mt-1 text-sm text-muted-foreground leading-relaxed">{step.description}</p> : null}
              </div>
            </li>
          ) : (
            <li
              key={step.id ?? i}
              className={`rounded-2xl border p-5 flex flex-col gap-1.5 ${
                last ? "border-teal/30 bg-teal/[0.06]" : "border-border bg-card"
              }`}
            >
              <span className={`font-mono text-[11px] tracking-wide ${last ? "text-teal" : "text-blue-600 dark:text-blue-300"}`}>
                Step {n}
              </span>
              <span className="text-base text-foreground leading-snug">{step.title}</span>
              {step.description ? <span className="text-sm text-muted-foreground leading-relaxed">{step.description}</span> : null}
            </li>
          )
        })}
      </ol>
    </div>
  )
}

// ── Table ────────────────────────────────────────────────────────────────────

// "yes / no / partial" (and ✓ ✗ ~) render as icons, so a comparison reads at a
// glance instead of as a wall of words.
function Cell({ value }: { value?: string | null }) {
  const raw = (value ?? "").trim()
  const v = raw.toLowerCase()
  if (["yes", "✓", "✔", "true", "y"].includes(v)) {
    return (
      <span className="inline-flex items-center gap-1.5 text-teal">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M5 12l5 5 9-10" />
        </svg>
        <span className="sr-only">Yes</span>
      </span>
    )
  }
  if (["no", "✗", "✘", "x", "false", "n"].includes(v)) {
    return (
      <span className="inline-flex items-center text-muted-foreground/70">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" aria-hidden="true">
          <path d="M6 6l12 12M18 6 6 18" />
        </svg>
        <span className="sr-only">No</span>
      </span>
    )
  }
  if (["partial", "~", "some", "limited"].includes(v)) {
    return (
      <span className="inline-flex items-center gap-1.5 text-amber-600 dark:text-amber-400">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" aria-hidden="true">
          <path d="M6 12h12" />
        </svg>
        <span className="text-xs">{v === "~" ? "Partial" : raw}</span>
      </span>
    )
  }
  return <>{raw || <span className="text-muted-foreground/50">—</span>}</>
}

export function ComparisonTableBlock({ fields }: { fields: Fields }) {
  const columns = list<{ id?: string; label: string; highlight?: boolean }>(fields.columns)
  const rows = list<{ id?: string; label?: string; cells?: { value?: string }[] }>(fields.rows)
  if (columns.length === 0 || rows.length === 0) return null

  const style = fields.style ?? {}
  const striped = style.striped !== false
  const pad = style.compact ? "px-4 py-2.5" : "px-5 py-4"
  const stack = style.mobile !== "scroll"
  const hasRowLabels = rows.some((r) => r.label?.trim())

  const cellsOf = (row: (typeof rows)[number]) => columns.map((_, i) => row.cells?.[i]?.value ?? "")

  return (
    <figure>
      {fields.caption ? <figcaption className={`${TITLE} mb-4`}>{fields.caption}</figcaption> : null}

      {/* Table — always on wider screens; on phones only when "scroll" is chosen. */}
      <div className={`${stack ? "hidden sm:block" : ""} overflow-x-auto rounded-2xl border border-border bg-card`}>
        <table className="w-full min-w-[32rem] border-collapse text-sm leading-relaxed">
          <thead>
            <tr>
              {hasRowLabels ? (
                <th scope="col" className={`${pad} text-left text-[11px] font-normal tracking-widest text-muted-foreground bg-foreground/[0.03] border-b border-border`}>
                  {fields.rowHeader ?? ""}
                </th>
              ) : null}
              {columns.map((c, i) => (
                <th
                  key={c.id ?? i}
                  scope="col"
                  className={`${pad} text-left text-[11px] font-normal tracking-widest border-b ${
                    c.highlight
                      ? "text-blue-600 dark:text-blue-300 bg-blue-500/10 border-blue-500/25"
                      : "text-muted-foreground bg-foreground/[0.03] border-border"
                  }`}
                >
                  {c.label.toUpperCase()}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, r) => (
              <tr key={row.id ?? r} className={striped && r % 2 === 1 ? "bg-foreground/[0.02]" : ""}>
                {hasRowLabels ? (
                  <th scope="row" className={`${pad} text-left font-normal text-foreground border-b border-border align-top`}>
                    {row.label}
                  </th>
                ) : null}
                {cellsOf(row).map((value, i) => (
                  <td
                    key={i}
                    className={`${pad} border-b border-border align-top ${
                      columns[i].highlight ? "bg-blue-500/[0.05] text-foreground" : "text-foreground/75"
                    }`}
                  >
                    <Cell value={value} />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Phones: each row becomes a card, so nothing needs a sideways scroll. */}
      {stack ? (
        <ul className="sm:hidden flex flex-col gap-3">
          {rows.map((row, r) => (
            <li key={row.id ?? r} className="rounded-2xl border border-border bg-card overflow-hidden">
              {row.label ? <p className="px-4 py-3 text-sm text-foreground border-b border-border bg-foreground/[0.03]">{row.label}</p> : null}
              <dl className="divide-y divide-border">
                {cellsOf(row).map((value, i) => (
                  <div key={i} className={`flex items-center justify-between gap-4 px-4 py-2.5 text-sm ${columns[i].highlight ? "bg-blue-500/[0.05]" : ""}`}>
                    <dt className={`text-xs tracking-wide ${columns[i].highlight ? "text-blue-600 dark:text-blue-300" : "text-muted-foreground"}`}>
                      {columns[i].label}
                    </dt>
                    <dd className="text-right text-foreground/80">
                      <Cell value={value} />
                    </dd>
                  </div>
                ))}
              </dl>
            </li>
          ))}
        </ul>
      ) : null}

      {fields.footnote ? <p className="mt-3 text-xs text-muted-foreground">{fields.footnote}</p> : null}
    </figure>
  )
}

// ── Pros & cons ──────────────────────────────────────────────────────────────

function PointList({ title, points, tone }: { title: string; points: { id?: string; point: string }[]; tone: "pro" | "con" }) {
  const pro = tone === "pro"
  return (
    <div className={`rounded-2xl border p-5 ${pro ? "border-teal/30 bg-teal/[0.05]" : "border-border bg-card"}`}>
      <p className={`text-[11px] tracking-widest ${pro ? "text-teal" : "text-muted-foreground"}`}>{title.toUpperCase()}</p>
      <ul className="mt-3 flex flex-col gap-2.5">
        {points.map((p, i) => (
          <li key={p.id ?? i} className="flex gap-2.5 text-sm leading-relaxed text-foreground/85">
            <span className={`mt-0.5 shrink-0 ${pro ? "text-teal" : "text-muted-foreground"}`} aria-hidden="true">
              {pro ? "+" : "−"}
            </span>
            {p.point}
          </li>
        ))}
      </ul>
    </div>
  )
}

export function ProsConsBlock({ fields }: { fields: Fields }) {
  const pros = list<{ id?: string; point: string }>(fields.pros)
  const cons = list<{ id?: string; point: string }>(fields.cons)
  if (pros.length === 0 && cons.length === 0) return null
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
      {pros.length ? <PointList title={fields.prosTitle || "Pros"} points={pros} tone="pro" /> : null}
      {cons.length ? <PointList title={fields.consTitle || "Cons"} points={cons} tone="con" /> : null}
    </div>
  )
}

// ── Key numbers ──────────────────────────────────────────────────────────────

export function StatsBlock({ fields }: { fields: Fields }) {
  const items = list<{ id?: string; value: string; label: string }>(fields.items)
  if (items.length === 0) return null
  const cols = items.length >= 4 ? "sm:grid-cols-4" : items.length === 3 ? "sm:grid-cols-3" : items.length === 2 ? "sm:grid-cols-2" : ""
  return (
    <dl className={`grid grid-cols-2 ${cols} gap-3`}>
      {items.map((s, i) => (
        <div key={s.id ?? i} className="rounded-2xl border border-border bg-card px-5 py-4">
          <dd className={`text-2xl md:text-3xl font-light font-ibm-plex ${i % 2 === 0 ? "text-blue-600 dark:text-blue-400" : "text-teal"}`}>
            {s.value}
          </dd>
          <dt className="mt-1 text-xs text-muted-foreground leading-relaxed">{s.label}</dt>
        </div>
      ))}
    </dl>
  )
}

// ── FAQ ──────────────────────────────────────────────────────────────────────
// <details> — no JavaScript, keyboard- and screen-reader friendly by default.

export function FAQBlock({ fields }: { fields: Fields }) {
  const items = list<{ id?: string; question: string; answer: string }>(fields.items)
  if (items.length === 0) return null
  return (
    <div>
      {fields.title ? <p className={`${TITLE} mb-4`}>{fields.title}</p> : null}
      <div className="rounded-2xl border border-border bg-card divide-y divide-border">
        {items.map((item, i) => (
          <details key={item.id ?? i} className="group">
            <summary className="flex items-center justify-between gap-4 px-5 py-4 cursor-pointer list-none [&::-webkit-details-marker]:hidden text-[0.95rem] text-foreground hover:bg-accent/30 transition-colors">
              {item.question}
              <span
                aria-hidden="true"
                className="shrink-0 w-6 h-6 rounded-full border border-border flex items-center justify-center text-muted-foreground transition-transform duration-300 group-open:rotate-45"
              >
                +
              </span>
            </summary>
            <p className="px-5 pb-5 -mt-1 text-sm text-muted-foreground leading-relaxed whitespace-pre-line">{item.answer}</p>
          </details>
        ))}
      </div>
    </div>
  )
}

// ── Pull quote ───────────────────────────────────────────────────────────────

export function PullQuoteBlock({ fields }: { fields: Fields }) {
  if (!fields.quote) return null
  return (
    <figure className="relative my-4 py-2 pl-8 border-l-2 border-teal">
      <span aria-hidden="true" className="absolute -left-1 -top-6 text-7xl leading-none font-serif text-teal/25 select-none">
        “
      </span>
      <blockquote className="text-xl md:text-2xl font-light leading-snug tracking-tight text-foreground">{fields.quote}</blockquote>
      {fields.attribution ? (
        <figcaption className="mt-4 text-xs tracking-wide text-muted-foreground">
          — {fields.attribution}
          {fields.role ? <span>, {fields.role}</span> : null}
        </figcaption>
      ) : null}
    </figure>
  )
}

// ── Inline CTA ───────────────────────────────────────────────────────────────

export function InlineCTABlock({ fields }: { fields: Fields }): ReactNode {
  const href: string = fields.href || "/contact"
  const external = /^https?:\/\//.test(href)
  const className =
    "shrink-0 inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-linear-to-br from-blue-600 to-cyan-600 text-white text-sm font-medium tracking-wide transition-[filter] duration-200 hover:brightness-110"
  const label = (
    <>
      {fields.buttonLabel || "Book a Free Call"} <span aria-hidden="true">→</span>
    </>
  )
  return (
    <aside className="relative overflow-hidden rounded-2xl border border-border bg-card p-6 md:p-7 flex flex-col md:flex-row md:items-center gap-5">
      <div
        aria-hidden="true"
        className="absolute -right-16 -top-16 w-56 h-56 rounded-full"
        style={{ background: "radial-gradient(circle, rgb(var(--teal-rgb) / 0.18), transparent 70%)" }}
      />
      <div className="relative flex-1">
        <p className="text-lg font-light leading-snug text-foreground">{fields.title}</p>
        {fields.text ? <p className="mt-1.5 text-sm text-muted-foreground leading-relaxed">{fields.text}</p> : null}
      </div>
      {external ? (
        <a href={href} target="_blank" rel="noopener noreferrer" className={`relative ${className}`}>
          {label}
        </a>
      ) : (
        <Link href={href} className={`relative ${className}`}>
          {label}
        </Link>
      )}
    </aside>
  )
}
