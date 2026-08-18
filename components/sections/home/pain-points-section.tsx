import { BentoCard } from "@/components/ui/bento-card"
import { MediaFrame } from "@/components/ui/media-frame"
import { MouseGlowGrid } from "@/components/ui/mouse-glow-grid"
import { SectionHeader } from "@/components/ui/section-header"
import { SectionCTA } from "@/components/ui/section-cta"
import { PAIN_POINTS } from "@/lib/content/site"
import { PROBLEM_MEDIA } from "@/lib/content/home-media"

// What each kind of problem costs, as a colour. Amber for money leaving,
// red for exposure, blue for time — consistent across the card border accent
// and the chip, so the grid can be scanned by colour before it's read.
const KIND_STYLE = {
  Cost: { chip: "text-amber-300/80 border-amber-400/25 bg-amber-400/10", dot: "bg-amber-400/80" },
  Risk: { chip: "text-rose-300/80 border-rose-400/25 bg-rose-400/10", dot: "bg-rose-400/80" },
  Time: { chip: "text-blue-300/80 border-blue-400/25 bg-blue-400/10", dot: "bg-blue-400/80" },
} as const

// Problem agitation, placed before the service menu. A visitor who has just
// recognised two or three of these reads the rest of the page as a solution
// rather than a catalogue — which is the whole point of putting it here.
//
// The layout is deliberately asymmetric: the "before" image anchors the left
// column on desktop while the symptoms stack beside it, so the section carries
// one image and six short cards rather than a wall of six paragraphs.
export function PainPointsSection() {
  return (
    <section id="challenges" className="py-28 px-6 md:px-12 lg:px-20 border-t border-white/[0.08]">
      <div className="max-w-6xl mx-auto">
        <SectionHeader
          eyebrow="SOUND FAMILIAR?"
          title={"You're Probably\nPaying for More\nThan You're Using."}
          intro="Almost every Microsoft 365 tenant we open has the same handful of problems. See how many you recognise."
        />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-3">
          <div className="lg:col-span-4 flex flex-col gap-3">
            <MediaFrame
              src={PROBLEM_MEDIA.src}
              alt={PROBLEM_MEDIA.alt}
              label={PROBLEM_MEDIA.label}
              hint={PROBLEM_MEDIA.hint}
              aspect="1/1"
              sizes="(max-width: 1024px) 100vw, 33vw"
              className="border border-white/[0.08]"
            />
            <div className="rounded-2xl border border-white/[0.08] bg-white/[0.02] p-6">
              <p className="text-sm text-white/55 leading-relaxed">
                Every one of these is fixable with licences you already hold.
              </p>
              <ul className="mt-4 flex flex-wrap gap-2">
                {(["Cost", "Risk", "Time"] as const).map((kind) => (
                  <li
                    key={kind}
                    className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-[10px] tracking-widest ${KIND_STYLE[kind].chip}`}
                  >
                    <span aria-hidden="true" className={`h-1 w-1 rounded-full ${KIND_STYLE[kind].dot}`} />
                    {kind.toUpperCase()}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <MouseGlowGrid className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-3 content-start">
            {PAIN_POINTS.map((p, i) => (
              <BentoCard key={p.symptom} className="p-6 flex flex-col" delay={i * 60}>
                <span
                  className={`self-start inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-[10px] tracking-widest mb-4 ${KIND_STYLE[p.kind].chip}`}
                >
                  <span aria-hidden="true" className={`h-1 w-1 rounded-full ${KIND_STYLE[p.kind].dot}`} />
                  {p.kind.toUpperCase()}
                </span>
                <h3 className="text-base font-light mb-2 leading-snug">{p.symptom}</h3>
                <p className="text-sm text-white/50 leading-relaxed">{p.cost}</p>
              </BentoCard>
            ))}
          </MouseGlowGrid>
        </div>

        <SectionCTA
          text="Recognise three or more? That's normal — and all of it is fixable with licences you already own."
          primaryLabel="Get a Free Health Check"
          primaryHref="#health-check"
          secondaryLabel="See How We Fix It"
          secondaryHref="#services"
        />
      </div>
    </section>
  )
}
