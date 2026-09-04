import { Section, SectionIntro } from "@/components/ui/section"
import { BentoGrid, BentoCard } from "@/components/ui/bento"
import { PAIN_POINTS } from "@/lib/content/site"

// What each kind of problem costs, as a colour: amber for money leaving, rose
// for exposure, blue for time. The chip uses the same hue in every cell, so
// the grid can be scanned by cost before a word of it is read.
const KIND = {
  Cost: "text-amber-200/70 bg-amber-400/[0.08] border-amber-400/20",
  Risk: "text-rose-200/70 bg-rose-400/[0.08] border-rose-400/20",
  Time: "text-blue-200/70 bg-blue-400/[0.08] border-blue-400/20",
} as const

// The shape of the grid, cell by cell. Kept out of the JSX because the whole
// point of a bento is the rhythm of the spans — 7/5, 5/7, 6/6 — and that is
// easier to check as a list than as six sets of props.
//
// `media: "top"` on the opening cell only: one picture entering from above
// anchors the grid, and repeating it would flatten the alternation back into
// a uniform wall. Every other cell drops its picture out of the bottom.
//
// ── Replacing the pictures ──────────────────────────────────────────────────
// `src` points at a placeholder in public/images/demo/. They are stand-ins
// drawn to be plausible, not real: no tenant data, no Microsoft product
// chrome. Drop a real screenshot in at the same path and nothing else here
// changes.
//
// What a replacement needs to be: wide (these are 1200×800, and 3:2 or wider
// is right — the card crops height, never width), dark, and readable in its
// top-left corner, because `object-left-top` anchors there while the rest
// runs off the card. `label` is only used when `src` is absent, so it can
// stay as documentation of what belongs in each slot.
const LAYOUT = [
  { span: 7, media: "top", minH: "min-h-[420px]", label: "Licence spend",
    src: "/images/demo/licence-spend.png", alt: "Licence usage report showing 19% of a paid tier in use" },
  { span: 5, media: "bottom", minH: "min-h-[420px]", label: "Security baseline",
    src: "/images/demo/security-baseline.png", alt: "Secure score at 31% with MFA and Conditional Access off" },
  { span: 5, media: "bottom", minH: "min-h-[400px]", label: "Storage sprawl",
    src: "/images/demo/storage-sprawl.png", alt: "One document found in five locations, none of them current" },
  { span: 7, media: "bottom", minH: "min-h-[400px]", label: "Support queue",
    src: "/images/demo/support-queue.png", alt: "Helpdesk queue with an eleven-day oldest ticket and no named contact" },
  { span: 6, media: "bottom", minH: "min-h-[380px]", label: "Manual process",
    src: "/images/demo/manual-process.png", alt: "Weekly approvals still done by hand, totalling over nine hours" },
  { span: 6, media: "bottom", minH: "min-h-[380px]", label: "Reporting",
    src: "/images/demo/reporting.png", alt: "A monthly report with no data, beside an invoice that arrives anyway" },
] as const

// Problem agitation, before the service menu — a visitor who recognises three
// of these reads the rest of the page as a solution rather than a catalogue.
//
// The heading is centred over the grid rather than parked in a sticky column:
// a bento is a single composition, and a column of copy pinned beside it
// competes with the cells for the same horizontal attention. Above it, the
// question is asked once and the grid answers it six times.
export function ChallengesSection() {
  return (
    <Section id="challenges" tone="base" size="lg">
      <SectionIntro
        align="center"
        eyebrow="Sound familiar?"
        title={"You're paying for more\nthan you're using."}
        lead="Almost every Microsoft 365 tenant we open has the same handful of problems. See how many you recognise."
      />

      <p className="mx-auto mt-6 max-w-md text-center text-[0.9375rem] leading-[1.7] text-muted-foreground">
        Every one of these is fixable with licences you already hold.
      </p>

      <BentoGrid className="mt-14 md:mt-16">
        {PAIN_POINTS.map((p, i) => {
          const cell = LAYOUT[i] ?? LAYOUT[LAYOUT.length - 1]
          return (
            <BentoCard
              key={p.symptom}
              order={i}
              title={p.symptom}
              desc={p.cost}
              span={cell.span}
              media={cell.media}
              minH={cell.minH}
              mediaLabel={cell.label}
              src={cell.src}
              alt={cell.alt}
              meta={
                <span
                  className={`shrink-0 rounded-full border px-2.5 py-1 text-[10px] uppercase tracking-[0.18em] ${KIND[p.kind]}`}
                >
                  {p.kind}
                </span>
              }
            />
          )
        })}
      </BentoGrid>
    </Section>
  )
}
