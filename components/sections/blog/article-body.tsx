import type { ReactNode } from "react"
import Image from "next/image"
import { RichText, type JSXConvertersFunction } from "@payloadcms/richtext-lexical/react"
import type { BlogPostDetail } from "@/lib/cms/blog"
import { CodeCopyButton } from "@/components/sections/blog/code-copy-button"
import {
  ComparisonTableBlock,
  FAQBlock,
  InlineCTABlock,
  ProsConsBlock,
  PullQuoteBlock,
  StatsBlock,
  StepsBlock,
} from "@/components/sections/blog/blocks/content-blocks"
import { ChecklistBlock } from "@/components/sections/blog/blocks/checklist-block"
import { VideoBlock } from "@/components/sections/blog/blocks/video-block"
import styles from "./blog.module.css"

// Server-rendered article body. Payload's Lexical → JSX converter does the
// walking; the overrides below only change how a node *looks*, so the page
// ships the article as plain HTML with a single tiny client leaf (the copy
// button on code blocks).

/* eslint-disable @typescript-eslint/no-explicit-any */

const LANGUAGE_LABEL: Record<string, string> = {
  powershell: "PowerShell",
  bash: "Bash",
  json: "JSON",
  ts: "TypeScript",
  plaintext: "Text",
}

const CALLOUT_TONE: Record<string, { box: string; icon: string; label: string; path: ReactNode }> = {
  info: {
    box: "border-blue-500/25 bg-blue-500/[0.06]",
    icon: "text-blue-600 dark:text-blue-400 bg-blue-500/10",
    label: "Note",
    path: (
      <>
        <circle cx="12" cy="12" r="9" />
        <path d="M12 11v5M12 8v.01" />
      </>
    ),
  },
  tip: {
    box: "border-teal/30 bg-teal/[0.06]",
    icon: "text-teal bg-teal/10",
    label: "Tip",
    path: <path d="M9 18h6M10 21h4M12 3a6 6 0 0 0-4 10.5c.6.6 1 1.4 1 2.5h6c0-1.1.4-1.9 1-2.5A6 6 0 0 0 12 3z" />,
  },
  success: {
    box: "border-emerald-500/30 bg-emerald-500/[0.06]",
    icon: "text-emerald-600 dark:text-emerald-400 bg-emerald-500/10",
    label: "Good to know",
    path: <path d="M5 12l5 5 9-10" />,
  },
  warning: {
    box: "border-amber-500/30 bg-amber-500/[0.07]",
    icon: "text-amber-600 dark:text-amber-400 bg-amber-500/10",
    label: "Warning",
    path: (
      <>
        <path d="M12 3 21 19H3z" />
        <path d="M12 10v4M12 17v.01" />
      </>
    ),
  },
}

// Internal links point at another document; map the collections that have
// public pages to their URLs.
function internalHref(linkNode: any): string {
  const doc = linkNode?.fields?.doc
  const value = doc?.value
  const slug = value && typeof value === "object" ? value.slug : null
  if (!slug) return "#"
  switch (doc.relationTo) {
    case "blog-posts":
      return `/blog/${slug}`
    case "case-studies":
      return `/case-studies/${slug}`
    case "industries":
      return `/industries/${slug}`
    case "services":
      return `/solutions/${slug}`
    default:
      return "#"
  }
}

function renderLink({ node, nodesToJSX }: any) {
  const children = nodesToJSX({ nodes: node.children })
  const fields = node.fields ?? {}
  const href = fields.linkType === "internal" ? internalHref(node) : fields.url ?? "#"
  const external = /^https?:\/\//.test(href)
  const newTab = Boolean(fields.newTab) || external
  return (
    <a href={href} target={newTab ? "_blank" : undefined} rel={newTab ? "noopener noreferrer" : undefined}>
      {children}
    </a>
  )
}

const converters: JSXConvertersFunction = ({ defaultConverters }) => ({
  ...defaultConverters,

  // Headings carry the anchor lib/cms/blog.ts assigned, which is the same id
  // the table of contents links to. The # link lets a reader copy a deep link.
  heading: ({ node, nodesToJSX }: any) => {
    const Tag = node.tag as "h2" | "h3" | "h4" | "h5" | "h6"
    const id: string | undefined = node.anchor
    return (
      <Tag id={id}>
        {nodesToJSX({ nodes: node.children })}
        {id ? (
          <a href={`#${id}`} className={styles.anchor} aria-label="Link to this section">
            #
          </a>
        ) : null}
      </Tag>
    )
  },

  link: renderLink,
  autolink: renderLink,

  upload: ({ node }: any) => {
    const media = node.value
    if (!media || typeof media !== "object" || !media.url) return null
    const isImage = typeof media.mimeType === "string" ? media.mimeType.startsWith("image/") : true
    if (!isImage) {
      return (
        <p>
          <a href={media.url} target="_blank" rel="noopener noreferrer">
            {media.filename ?? "Download file"}
          </a>
        </p>
      )
    }
    return (
      <figure>
        <Image
          src={media.url}
          alt={media.alt ?? ""}
          width={media.width ?? 1200}
          height={media.height ?? 675}
          sizes="(max-width: 768px) 100vw, 720px"
          className="w-full h-auto"
        />
        {media.alt ? (
          <figcaption className="mt-3 text-xs text-muted-foreground text-center tracking-wide">{media.alt}</figcaption>
        ) : null}
      </figure>
    )
  },

  // Payload's default table adds inline borders and padding; ours come from
  // the prose styles, and the frame scrolls on its own on a phone.
  table: ({ node, nodesToJSX }: any) => (
    <div className={styles.tableWrap}>
      <table>
        <tbody>{nodesToJSX({ nodes: node.children })}</tbody>
      </table>
    </div>
  ),
  tablerow: ({ node, nodesToJSX }: any) => <tr>{nodesToJSX({ nodes: node.children })}</tr>,
  tablecell: ({ node, nodesToJSX }: any) => {
    const Cell = node.headerState > 0 ? "th" : "td"
    return (
      <Cell
        colSpan={node.colSpan > 1 ? node.colSpan : undefined}
        rowSpan={node.rowSpan > 1 ? node.rowSpan : undefined}
        scope={Cell === "th" ? (node.headerState === 2 ? "row" : "col") : undefined}
      >
        {nodesToJSX({ nodes: node.children })}
      </Cell>
    )
  },

  blocks: {
    Code: ({ node }: any) => {
      const code: string = node.fields?.code ?? ""
      const language: string = node.fields?.language ?? "plaintext"
      if (!code.trim()) return null
      return (
        <div className="rounded-2xl overflow-hidden border border-white/10 bg-[#0b1220] shadow-[0_18px_40px_-24px_rgba(0,0,0,0.6)]">
          <div className="flex items-center justify-between gap-4 pl-5 pr-2 py-2 border-b border-white/10">
            <span className="font-mono text-[11px] tracking-wide text-white/55">
              {LANGUAGE_LABEL[language] ?? language}
            </span>
            <CodeCopyButton code={code} />
          </div>
          <pre className="m-0 overflow-x-auto px-5 py-4 text-[13px] leading-relaxed font-mono text-slate-200">
            <code>{code}</code>
          </pre>
        </div>
      )
    },

    Callout: ({ node }: any) => {
      const tone = CALLOUT_TONE[node.fields?.tone as string] ?? CALLOUT_TONE.info
      const title: string = node.fields?.title?.trim() || tone.label
      return (
        <aside role="note" className={`flex gap-4 rounded-2xl border px-5 py-4 ${tone.box}`}>
          <span className={`shrink-0 w-9 h-9 rounded-xl flex items-center justify-center ${tone.icon}`} aria-hidden="true">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              {tone.path}
            </svg>
          </span>
          <div className="text-[0.95rem] leading-relaxed">
            <p className="font-medium text-foreground">{title}</p>
            <p className="mt-1 whitespace-pre-line">{node.fields?.content}</p>
          </div>
        </aside>
      )
    },

    Steps: ({ node }: any) => <StepsBlock fields={node.fields ?? {}} />,
    ComparisonTable: ({ node }: any) => <ComparisonTableBlock fields={node.fields ?? {}} />,
    ProsCons: ({ node }: any) => <ProsConsBlock fields={node.fields ?? {}} />,
    Stats: ({ node }: any) => <StatsBlock fields={node.fields ?? {}} />,
    FAQ: ({ node }: any) => <FAQBlock fields={node.fields ?? {}} />,
    PullQuote: ({ node }: any) => <PullQuoteBlock fields={node.fields ?? {}} />,
    InlineCTA: ({ node }: any) => <InlineCTABlock fields={node.fields ?? {}} />,

    Checklist: ({ node }: any) => {
      const items = Array.isArray(node.fields?.items) ? node.fields.items : []
      if (items.length === 0) return null
      return <ChecklistBlock blockId={node.fields?.id ?? "checklist"} title={node.fields?.title} items={items} />
    },

    Video: ({ node }: any) =>
      node.fields?.url ? <VideoBlock url={node.fields.url} title={node.fields.title ?? "Video"} caption={node.fields.caption} /> : null,
  },
})

export function ArticleBody({ body }: { body: BlogPostDetail["body"] }) {
  if (!body) return null
  return (
    <RichText
      data={body as any}
      converters={converters}
      className={styles.prose}
      disableIndent
      disableTextAlign
    />
  )
}
