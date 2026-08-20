import { Section, SectionIntro } from "@/components/ui/section"
import { RowList, Row } from "@/components/ui/row-list"
import { PAIN_POINTS } from "@/lib/content/site"

// What each kind of problem costs, as a colour: amber for money leaving, rose
// for exposure, blue for time. The dot and the chip use the same hue, so the
// list can be scanned by cost before a word of it is read.
const KIND = {
  Cost: { dot: "bg-amber-400/80", chip: "text-amber-200/70 bg-amber-400/[0.08] border-amber-400/20" },
  Risk: { dot: "bg-rose-400/80", chip: "text-rose-200/70 bg-rose-400/[0.08] border-rose-400/20" },
  Time: { dot: "bg-blue-400/80", chip: "text-blue-200/70 bg-blue-400/[0.08] border-blue-400/20" },
} as const

// Problem agitation, before the service menu — a visitor who recognises three
// of these reads the rest of the page as a solution rather than a catalogue.
//
// This was six bordered cards in a 2×3 grid beside a dashed image placeholder.
// Six equal cards invite comparison, which is the wrong instinct here: the
// visitor is meant to scan for the ones that describe *them*. A divided list
// scans; a card grid does not. The heading sticks alongside it on desktop, so
// the question stays on screen while the answers scroll past — the pattern
// Advania and Transparity both use for their long explanatory lists.
export function ChallengesSection() {
  return (
    <Section id="challenges" tone="base" size="lg">
      <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
        <div className="lg:col-span-5">
          <div className="lg:sticky lg:top-32">
            <SectionIntro
              eyebrow="Sound familiar?"
              title={"You're paying for more\nthan you're using."}
              lead="Almost every Microsoft 365 tenant we open has the same handful of problems. See how many you recognise."
            />

            <dl className="mt-8 flex flex-wrap gap-2">
              {(["Cost", "Risk", "Time"] as const).map((kind) => (
                <div
                  key={kind}
                  className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-[10px] uppercase tracking-[0.18em] ${KIND[kind].chip}`}
                >
                  <span aria-hidden="true" className={`h-1 w-1 rounded-full ${KIND[kind].dot}`} />
                  {kind}
                </div>
              ))}
            </dl>

            <p className="mt-6 max-w-sm text-[0.9375rem] leading-[1.7] text-white/45">
              Every one of these is fixable with licences you already hold.
            </p>
          </div>
        </div>

        <div className="lg:col-span-7">
          <RowList>
            {PAIN_POINTS.map((p, i) => (
              <Row
                key={p.symptom}
                index={String(i + 1).padStart(2, "0")}
                title={p.symptom}
                desc={p.cost}
                accent={KIND[p.kind].dot}
                meta={
                  <span
                    className={`rounded-full border px-2.5 py-1 text-[10px] uppercase tracking-[0.18em] ${KIND[p.kind].chip}`}
                  >
                    {p.kind}
                  </span>
                }
              />
            ))}
          </RowList>
        </div>
      </div>
    </Section>
  )
}
