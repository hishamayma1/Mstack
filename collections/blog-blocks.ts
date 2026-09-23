import type { Block } from "payload"

// Content blocks for the blog-post editor (the "+" menu in the body field).
// Each one is rendered by components/sections/blog/blocks/*, in the site's
// design, so editors pick a *shape* for the content instead of hand-styling
// paragraphs. Keep field names stable — they are the stored JSON.

// A highlighted aside — a warning, a tip, a note.
export const CalloutBlock: Block = {
  slug: "Callout",
  labels: { singular: "Callout", plural: "Callouts" },
  fields: [
    {
      name: "tone",
      type: "select",
      required: true,
      defaultValue: "info",
      options: [
        { label: "Note", value: "info" },
        { label: "Tip", value: "tip" },
        { label: "Warning", value: "warning" },
        { label: "Success", value: "success" },
      ],
    },
    { name: "title", type: "text" },
    { name: "content", type: "textarea", required: true },
  ],
}

// Numbered steps — a procedure the reader follows in order.
export const StepsBlock: Block = {
  slug: "Steps",
  labels: { singular: "Steps", plural: "Steps" },
  fields: [
    { name: "title", type: "text", admin: { description: "Optional heading above the steps." } },
    {
      name: "layout",
      type: "select",
      defaultValue: "grid",
      options: [
        { label: "Grid (two columns of cards)", value: "grid" },
        { label: "Timeline (one column, connected)", value: "timeline" },
      ],
    },
    {
      name: "highlightLast",
      type: "checkbox",
      defaultValue: true,
      admin: { description: "Colour the final step as the finish line." },
    },
    {
      name: "steps",
      type: "array",
      required: true,
      minRows: 2,
      fields: [
        { name: "title", type: "text", required: true },
        { name: "description", type: "textarea" },
      ],
    },
  ],
}

// A checklist the reader can tick off. Progress is saved in their browser, so
// they can work through it across visits.
export const ChecklistBlock: Block = {
  slug: "Checklist",
  labels: { singular: "Interactive checklist", plural: "Interactive checklists" },
  fields: [
    { name: "title", type: "text", defaultValue: "Your checklist" },
    {
      name: "items",
      type: "array",
      required: true,
      minRows: 1,
      fields: [
        { name: "label", type: "text", required: true },
        { name: "detail", type: "text", admin: { description: "Optional one-line explanation." } },
      ],
    },
  ],
}

// A table editors can shape without touching HTML.
export const ComparisonTableBlock: Block = {
  slug: "ComparisonTable",
  labels: { singular: "Table", plural: "Tables" },
  fields: [
    { name: "caption", type: "text", admin: { description: "Optional title shown above the table." } },
    {
      name: "rowHeader",
      type: "text",
      admin: { description: "Optional label for the first (row-name) column, e.g. \"Feature\". Leave empty for none." },
    },
    {
      name: "columns",
      type: "array",
      required: true,
      minRows: 1,
      maxRows: 5,
      admin: { description: "The value columns, left to right." },
      fields: [
        { name: "label", type: "text", required: true },
        {
          name: "highlight",
          type: "checkbox",
          defaultValue: false,
          admin: { description: "Tint this column — use it for the recommended option." },
        },
      ],
    },
    {
      name: "rows",
      type: "array",
      required: true,
      minRows: 1,
      admin: {
        description:
          "One entry per row. Cells map to the columns in order. Type yes / no / partial (or ✓ / ✗ / ~) to show an icon instead of text.",
      },
      fields: [
        { name: "label", type: "text", admin: { description: "Row name (first column)." } },
        {
          name: "cells",
          type: "array",
          fields: [{ name: "value", type: "text" }],
        },
      ],
    },
    {
      name: "style",
      type: "group",
      fields: [
        { name: "striped", type: "checkbox", defaultValue: true, admin: { description: "Alternate row shading." } },
        { name: "compact", type: "checkbox", defaultValue: false, admin: { description: "Tighter rows for long tables." } },
        {
          name: "mobile",
          type: "select",
          defaultValue: "stack",
          options: [
            { label: "Stack rows as cards on phones", value: "stack" },
            { label: "Scroll sideways on phones", value: "scroll" },
          ],
        },
      ],
    },
    { name: "footnote", type: "text", admin: { description: "Optional small print under the table." } },
  ],
}

export const ProsConsBlock: Block = {
  slug: "ProsCons",
  labels: { singular: "Pros & cons", plural: "Pros & cons" },
  fields: [
    { name: "prosTitle", type: "text", defaultValue: "Pros" },
    { name: "pros", type: "array", required: true, fields: [{ name: "point", type: "text", required: true }] },
    { name: "consTitle", type: "text", defaultValue: "Cons" },
    { name: "cons", type: "array", required: true, fields: [{ name: "point", type: "text", required: true }] },
  ],
}

export const StatsBlock: Block = {
  slug: "Stats",
  labels: { singular: "Key numbers", plural: "Key numbers" },
  fields: [
    {
      name: "items",
      type: "array",
      required: true,
      minRows: 1,
      maxRows: 4,
      fields: [
        { name: "value", type: "text", required: true, admin: { description: "e.g. 40%, 3 days, $1,200" } },
        { name: "label", type: "text", required: true },
      ],
    },
  ],
}

export const FAQBlock: Block = {
  slug: "FAQ",
  labels: { singular: "FAQ", plural: "FAQs" },
  fields: [
    { name: "title", type: "text", defaultValue: "Frequently asked questions" },
    {
      name: "items",
      type: "array",
      required: true,
      minRows: 1,
      admin: { description: "Also published to search engines as FAQ rich results." },
      fields: [
        { name: "question", type: "text", required: true },
        { name: "answer", type: "textarea", required: true },
      ],
    },
  ],
}

export const PullQuoteBlock: Block = {
  slug: "PullQuote",
  labels: { singular: "Pull quote", plural: "Pull quotes" },
  fields: [
    { name: "quote", type: "textarea", required: true },
    { name: "attribution", type: "text" },
    { name: "role", type: "text" },
  ],
}

export const InlineCTABlock: Block = {
  slug: "InlineCTA",
  labels: { singular: "Call to action", plural: "Calls to action" },
  fields: [
    { name: "title", type: "text", required: true, defaultValue: "Rather have us do it for you?" },
    { name: "text", type: "textarea" },
    { name: "buttonLabel", type: "text", required: true, defaultValue: "Book a Free Call" },
    { name: "href", type: "text", required: true, defaultValue: "/contact" },
  ],
}

export const VideoBlock: Block = {
  slug: "Video",
  labels: { singular: "YouTube video", plural: "YouTube videos" },
  fields: [
    { name: "url", type: "text", required: true, admin: { description: "YouTube link (watch, share or shorts URL)." } },
    { name: "title", type: "text", required: true, admin: { description: "Describes the video for screen readers." } },
    { name: "caption", type: "text" },
  ],
}

export const BLOG_BLOCKS: Block[] = [
  CalloutBlock,
  StepsBlock,
  ChecklistBlock,
  ComparisonTableBlock,
  ProsConsBlock,
  StatsBlock,
  FAQBlock,
  PullQuoteBlock,
  InlineCTABlock,
  VideoBlock,
]
