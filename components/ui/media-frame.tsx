import Image from "next/image"

// An image slot that degrades into a labelled placeholder.
//
// Pass `src` and it renders the real image. Leave `src` null/undefined and it
// renders a dashed frame naming what belongs there and the size to export at —
// so the page reads as a finished layout during the demo, and swapping in the
// artwork later is a one-line change in lib/industry-media.ts.

export function MediaFrame({
  src,
  alt,
  label,
  hint,
  aspect = "16/10",
  className = "",
  priority = false,
  sizes = "(max-width: 768px) 100vw, 50vw",
}: {
  src?: string | null
  alt: string
  /** Shown in the placeholder: what image goes here. */
  label: string
  /** Shown under the label: recommended dimensions or art direction. */
  hint?: string
  /** CSS aspect ratio, e.g. "16/10", "4/3", "1/1". */
  aspect?: string
  className?: string
  priority?: boolean
  sizes?: string
}) {
  const frame = `relative overflow-hidden rounded-2xl ${className}`
  const style = { aspectRatio: aspect }

  if (src) {
    return (
      <div className={`${frame} border border-border bg-card`} style={style}>
        <Image src={src} alt={alt} fill sizes={sizes} priority={priority} className="object-cover" />
      </div>
    )
  }

  return (
    <div
      role="img"
      aria-label={`Placeholder: ${label}`}
      className={`${frame} border border-dashed border-border bg-card/40 flex items-center justify-center`}
      style={style}
    >
      {/* Faint grid so an empty frame still reads as a deliberate surface */}
      <div
        aria-hidden="true"
        className="absolute inset-0 opacity-60"
        style={{
          backgroundImage:
            "linear-gradient(rgba(var(--fg-rgb),0.035) 1px, transparent 1px), linear-gradient(90deg, rgba(var(--fg-rgb),0.035) 1px, transparent 1px)",
          backgroundSize: "32px 32px",
        }}
      />
      <div
        aria-hidden="true"
        className="absolute inset-0"
        style={{ background: "radial-gradient(420px circle at 50% 40%, rgba(59,130,246,0.10), transparent 65%)" }}
      />

      <div className="relative z-10 text-center px-6">
        <span className="font-pixel text-[10px] tracking-[0.25em] text-muted-foreground block mb-3">IMAGE</span>
        <span className="block text-sm text-muted-foreground leading-relaxed max-w-xs mx-auto">{label}</span>
        {hint ? (
          <span className="mt-2 block text-[11px] text-muted-foreground tracking-wide">{hint}</span>
        ) : null}
      </div>
    </div>
  )
}
