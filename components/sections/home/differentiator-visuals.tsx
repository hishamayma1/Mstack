import type { CSSProperties, ReactNode } from "react"
import { AppLogo } from "@/components/ui/app-logo"
import type { AppLogoSlug } from "@/lib/content/app-logos"
import type { Differentiator } from "@/lib/content/site"
import s from "./differentiator-visuals.module.css"

// ── The six panels ──────────────────────────────────────────────────────────
//
// One per "why us" cell, filling the top of it — Aceternity's skeletons, with
// the placeholder bars and stock avatars replaced by something that actually
// says what the claim underneath says. All of them are decorative: the copy in
// the cell carries the meaning, so every panel is aria-hidden.
//
// Server components. Every movement is a CSS transition off the cell's hover
// or a keyframe loop; see the stylesheet beside this file.

// The dotted, clipped ground each panel sits on.
function Frame({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <div
      aria-hidden="true"
      className={`${s.dots} relative flex min-h-[9rem] w-full flex-1 overflow-hidden rounded-xl border border-white/[0.06] bg-[#0B111C] p-4 ${className}`}
    >
      {children}
    </div>
  )
}

// A stand-in for a row of UI — a mark, then a bar. The building block of the
// two "splay" panels, exactly as in the original.
function Pill({ slug, width, reverse = false }: { slug?: AppLogoSlug; width: string; reverse?: boolean }) {
  return (
    <div
      style={{ width }}
      className={`flex items-center gap-2 rounded-full border border-white/[0.09] bg-[#0A0E17] p-1.5 ${
        reverse ? "ml-auto flex-row-reverse" : ""
      }`}
    >
      {slug ? (
        <AppLogo slug={slug} size={18} />
      ) : (
        <span className="h-[18px] w-[18px] shrink-0 rounded-full bg-[linear-gradient(135deg,#60A5FA,#2563EB)]" />
      )}
      <span className="h-2 w-full rounded-full bg-white/[0.08]" />
    </div>
  )
}

// 01 — Microsoft native: three product rows that fan apart under the pointer.
// The marks are real products, so the claim ("we work in the stack you pay
// for") is visible before the sentence under it is read.
function NativeVisual() {
  return (
    <Frame>
      <div
        className={`${s.splay} flex w-full flex-col justify-center gap-2.5`}
        style={{ "--splay-tilt": "0.8deg" } as CSSProperties}
      >
        <Pill slug="teams" width="100%" />
        <Pill slug="sharepoint" width="78%" reverse />
        <Pill slug="power-automate" width="92%" />
      </div>
    </Frame>
  )
}

// 02 — Fast execution: a gradient that drifts on its own behind bars that
// sweep out to full width on hover. The demo's animated-gradient skeleton and
// its filling-bars skeleton, doing one job together.
function SpeedVisual() {
  return (
    <Frame className="p-0">
      <span aria-hidden="true" className={`${s.drift} absolute inset-0 opacity-25`} />
      <div className={`${s.sweep} relative flex w-full flex-col justify-center gap-2.5 p-4`}>
        {["92%", "64%", "78%", "48%"].map((w, i) => (
          <span
            key={w + i}
            style={{ width: w }}
            className="h-2.5 rounded-full bg-[linear-gradient(90deg,rgba(96,165,250,0.85),rgba(37,99,235,0.25))]"
          />
        ))}
      </div>
    </Frame>
  )
}

// 03 — Scalable: columns resting at just over half height, standing up on
// hover. The resting state is the point — it should look like there is room
// left in it.
function ScaleVisual() {
  return (
    <Frame className="items-end">
      <div className={`${s.climb} flex h-full w-full items-end gap-2`}>
        {[38, 52, 44, 70, 86, 100].map((h, i) => (
          <span
            key={h}
            style={{ height: `${h}%`, transitionDelay: `${i * 45}ms` }}
            className="flex-1 rounded-t-md bg-[linear-gradient(180deg,rgba(96,165,250,0.75),rgba(37,99,235,0.12))]"
          />
        ))}
      </div>
    </Frame>
  )
}

// 04 — Security first: layers with a line travelling down them, looping on
// its own rather than waiting for a pointer. This is the one claim about
// something that runs continuously, so it is the one panel that never stops.
function SecurityVisual() {
  return (
    <Frame>
      <div className="relative flex w-full flex-col justify-center gap-2.5">
        {[
          { label: "Identity", w: "100%" },
          { label: "Device", w: "86%" },
          { label: "Data", w: "72%" },
        ].map((row) => (
          <div
            key={row.label}
            style={{ width: row.w }}
            className="flex items-center gap-2 rounded-lg border border-white/[0.09] bg-[#0A0E17] px-2.5 py-2"
          >
            <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-blue-400/80" />
            <span className="font-ibm-plex text-[10px] uppercase tracking-[0.18em] text-white/35">
              {row.label}
            </span>
            <span className="ml-auto h-1.5 w-8 rounded-full bg-white/[0.08]" />
          </div>
        ))}

        <span
          className={`${s.scan} pointer-events-none absolute inset-x-0 top-0 h-px bg-[linear-gradient(90deg,transparent,rgba(96,165,250,0.9),transparent)]`}
          style={{ "--scan-travel": "104px" } as CSSProperties}
        />
      </div>
    </Frame>
  )
}

// 05 — Dedicated support: two message bubbles that fan apart on hover. The
// demo's chat skeleton, without the borrowed avatar.
function SupportVisual() {
  return (
    <Frame>
      <div className={`${s.splay} flex w-full flex-col justify-center gap-2.5`}>
        <div className="flex items-start gap-2 rounded-2xl border border-white/[0.09] bg-[#0A0E17] p-2.5">
          <span className="mt-0.5 h-6 w-6 shrink-0 rounded-full bg-[linear-gradient(135deg,#60A5FA,#2563EB)]" />
          <span className="text-[11px] leading-[1.6] text-white/40">
            Conditional Access is blocking a new starter.
          </span>
        </div>
        <div className="ml-auto flex w-[82%] items-center justify-end gap-2 rounded-full border border-blue-400/25 bg-blue-500/[0.08] p-2.5">
          <span className="text-[11px] text-blue-200/70">On it — same team as last time.</span>
          <span className="h-5 w-5 shrink-0 rounded-full bg-blue-400/70" />
        </div>
      </div>
    </Frame>
  )
}

// 06 — Long-term partnership: three cards sitting askew that straighten into
// a row on hover. The demo's fourth skeleton, read as a timeline instead of
// three opinions.
function PartnershipVisual() {
  return (
    <Frame>
      <div className={`${s.converge} flex w-full items-stretch gap-2.5`}>
        {[
          { k: "Year 1", v: "Migrate" },
          { k: "Year 2", v: "Secure" },
          { k: "Year 3", v: "Automate" },
        ].map((c) => (
          <div
            key={c.k}
            className="flex w-1/3 flex-col items-center justify-center gap-2 rounded-2xl border border-white/[0.09] bg-[#0A0E17] p-3 text-center"
          >
            <span className="font-ibm-plex text-[10px] uppercase tracking-[0.18em] text-white/30">
              {c.k}
            </span>
            <span className="text-[0.8125rem] font-light text-white/70">{c.v}</span>
            <span className="h-1 w-8 rounded-full bg-blue-400/40" />
          </div>
        ))}
      </div>
    </Frame>
  )
}

// Keyed by the same `icon` discriminator the copy already carries, so a new
// differentiator picks up its panel without a second lookup table to keep in
// step.
export const DIFFERENTIATOR_VISUALS: Record<Differentiator["icon"], ReactNode> = {
  native: <NativeVisual />,
  speed: <SpeedVisual />,
  scale: <ScaleVisual />,
  shield: <SecurityVisual />,
  support: <SupportVisual />,
  partnership: <PartnershipVisual />,
}
