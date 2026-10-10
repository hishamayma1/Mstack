import type { ReactNode } from "react"

// The decoration every themed service card shares: a gradient rule across the
// top edge and a soft bloom in the corner, both in the card's own --svc hue.
// It's what lets the eye sort nine cards by colour before reading a title.
//
// Server component, purely presentational. Must sit inside an element that
// carries `data-svc` (BentoCard's `theme` prop does that) and is a `relative
// isolate` box — the layers sit at -z-10, behind the content but above the
// card's own background.
export function ServiceAccent() {
  return (
    <>
      <span
        aria-hidden="true"
        className="pointer-events-none absolute -z-10 inset-x-0 top-0 h-1 bg-linear-to-r from-svc to-svc-2"
      />
      <span
        aria-hidden="true"
        className="pointer-events-none absolute -z-10 -right-20 -top-20 h-52 w-52 rounded-full bg-svc/15 blur-3xl transition-opacity duration-500 group-hover:opacity-100 opacity-70"
      />
    </>
  )
}

/** The small gradient tile holding a card's ordinal — "01", "02"… */
export function ServiceIndex({ value }: { value: string }) {
  return (
    <span className="relative inline-flex h-9 w-9 items-center justify-center rounded-xl bg-linear-to-br from-svc to-svc-2 font-pixel text-[11px] tracking-wider text-white shadow-[0_6px_20px_-6px_var(--svc)]">
      {value}
    </span>
  )
}

/** A pill in the service's accent — tagline, kind. */
export function ServicePill({ children }: { children: ReactNode }) {
  return (
    <span className="relative inline-flex items-center gap-1.5 rounded-full border border-svc/25 bg-svc/10 px-3 py-1 text-[11px] tracking-widest text-svc-ink">
      {children}
    </span>
  )
}
