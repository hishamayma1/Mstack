import { Section, SectionIntro } from "@/components/ui/section"
import { BRAND_BREAKDOWN, DIFFERENTIATORS, type Differentiator } from "@/lib/content/site"

// One mark per claim. Six identical badges made the grid read as one repeated
// point; six distinct shapes let it be scanned. Paths are 24×24, stroked, so
// they inherit the cell's text colour and weight.
const ICONS: Record<Differentiator["icon"], string> = {
  native: "M4 4h7v7H4zM13 4h7v7h-7zM4 13h7v7H4zM13 13h7v7h-7z",
  speed: "M13 2L4.5 13.5H11l-1 8.5 8.5-11.5H12z",
  scale: "M4 20V14M10 20V10M16 20V6M22 20V3",
  shield: "M12 2.5l7.5 3v6c0 4.5-3.1 8.4-7.5 10-4.4-1.6-7.5-5.5-7.5-10v-6z",
  support: "M9 11a3.5 3.5 0 100-7 3.5 3.5 0 000 7zM2.5 20.5a6.5 6.5 0 0113 0M17 8.5h4.5M19.25 6.25v4.5",
  partnership:
    "M7.5 12.5l3 3 6-6M4 6.5A2.5 2.5 0 016.5 4h11A2.5 2.5 0 0120 6.5v11a2.5 2.5 0 01-2.5 2.5h-11A2.5 2.5 0 014 17.5z",
}

// Why us.
//
// Two changes from the old version. The brand breakdown was three large cards
// with 4xl letters, taking a full row beside a dashed team-photo placeholder,
// to explain a name — it is now one slim strip, which is all that claim is
// worth. And the six differentiators are a shared grid rather than six
// floating bordered cards: single hairlines between cells, no card chrome, no
// hover glow. Six peers laid out as a table is legible in a way six cards
// stacked on the same dark surface never were.
export function DifferentiatorsSection() {
  return (
    <Section id="why-us" tone="base" size="lg">
      <SectionIntro
        eyebrow="Why MStack360"
        title={"What a Microsoft-native\npartner does differently."}
        lead="No third-party sprawl, no reselling someone else's platform. Everything we build lives in the tenant you already pay for."
      />

      {/* The name, explained in one line rather than one row of cards. */}
      <dl className="mt-10 grid gap-px overflow-hidden rounded-xl border border-white/[0.07] bg-white/[0.07] sm:grid-cols-3">
        {BRAND_BREAKDOWN.map((b) => (
          <div key={b.label} className="flex items-baseline gap-3 bg-[#0A0E17] px-5 py-4">
            <dt className="font-ibm-plex text-[1.125rem] font-light text-blue-300/90">{b.letter}</dt>
            <dd className="text-[0.8125rem] leading-[1.6] text-white/45">{b.desc.replace(/^Stands for /, "")}</dd>
          </div>
        ))}
      </dl>

      <ul className="mt-3 grid gap-px overflow-hidden rounded-2xl border border-white/[0.07] bg-white/[0.07] sm:grid-cols-2 lg:grid-cols-3">
        {DIFFERENTIATORS.map((d) => (
          <li key={d.title} className="bg-[#0A0E17] p-7 transition-colors hover:bg-white/[0.02]">
            <span className="mb-5 flex h-9 w-9 items-center justify-center rounded-lg border border-blue-500/25 bg-blue-500/10 text-blue-300/90">
              <svg
                width="17"
                height="17"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d={ICONS[d.icon]} />
              </svg>
            </span>
            <h3 className="text-[1.0625rem] font-light leading-snug text-[#F3F5FA]">{d.title}</h3>
            <p className="mt-2 text-[0.9375rem] leading-[1.7] text-white/50">{d.desc}</p>
          </li>
        ))}
      </ul>
    </Section>
  )
}
