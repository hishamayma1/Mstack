import Link from "next/link"

// Shared call-to-action primitives. Every section on the industries pages ends
// in one of these, so the page never presents information without a next step.
// Pure markup — no hooks, so server sections can render them directly.

export function CTAButtons({
  primaryLabel = "Book a Free Consultation",
  primaryHref = "/contact",
  secondaryLabel,
  secondaryHref,
  align = "left",
  size = "md",
}: {
  primaryLabel?: string
  primaryHref?: string
  secondaryLabel?: string
  secondaryHref?: string
  align?: "left" | "center"
  size?: "sm" | "md"
}) {
  const pad = size === "sm" ? "px-6 py-2.5" : "px-8 py-3"
  return (
    <div
      className={`flex flex-col sm:flex-row gap-3 ${align === "center" ? "justify-center" : "justify-start"}`}
    >
      <Link
        href={primaryHref}
        className={`${pad} bg-blue-600 text-white text-sm rounded-xl hover:bg-blue-500 transition-colors tracking-widest font-medium text-center whitespace-nowrap`}
      >
        {primaryLabel}
      </Link>
      {secondaryLabel && secondaryHref ? (
        <Link
          href={secondaryHref}
          className={`${pad} border border-white/15 text-white/75 text-sm rounded-xl hover:border-blue-500/40 hover:text-white hover:bg-white/[0.05] transition-all tracking-widest font-medium text-center whitespace-nowrap`}
        >
          {secondaryLabel}
        </Link>
      ) : null}
    </div>
  )
}

// The bar that closes a section: a one-line pitch on the left, the action on
// the right. Sits inside the section's own max-width container.
export function SectionCTA({
  text,
  primaryLabel = "Book a Free Consultation",
  primaryHref = "/contact",
  secondaryLabel,
  secondaryHref,
}: {
  text: string
  primaryLabel?: string
  primaryHref?: string
  secondaryLabel?: string
  secondaryHref?: string
}) {
  return (
    <div className="mt-10 rounded-2xl border border-white/[0.08] bg-white/[0.02] px-6 py-6 md:px-8 flex flex-col md:flex-row md:items-center gap-5 md:gap-8">
      <p className="text-sm text-white/60 leading-relaxed md:flex-1">{text}</p>
      <div className="shrink-0">
        <CTAButtons
          primaryLabel={primaryLabel}
          primaryHref={primaryHref}
          secondaryLabel={secondaryLabel}
          secondaryHref={secondaryHref}
          size="sm"
        />
      </div>
    </div>
  )
}
