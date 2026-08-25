import { Section, SectionIntro, Chevron } from "@/components/ui/section"
import motion from "@/components/ui/motion.module.css"
import { stagger, parallax } from "@/lib/motion"
import { PROCESS_STEPS } from "@/lib/content/site"

// Depth and baseline per step. Two separate ideas, both deliberately gentle:
//
//   depth  — how far the column drifts as it crosses the viewport. The wave
//            (deep, shallow, deepest, shallow, deep) means neighbours never
//            move together, which is what makes the row feel three-
//            dimensional. Uniform depths would just look like a slow scroll.
//   lift   — a static offset on desktop, so the five figures sit on two
//            baselines instead of one ruled line. This is the whole difference
//            between "a table of steps" and something that looks composed.
//
// Both are off on mobile, where a single column has no row to break up.
const DEPTH = [30, 14, 40, 14, 26]
const LIFT = ["", "md:mt-12", "", "md:mt-12", ""]

// Five steps, read as five figures.
//
// This was a hairline rail with bare text hung under it. Correct, and dull —
// it stated the sequence without ever making the reader want to follow it.
// The numbers were 11px grey ordinals doing nothing, when the numbers are the
// most legible thing the section owns.
//
// So the steps are built like the proof band's statistics: the numeral large
// and light in the same IBM Plex figures, the step name as its label, the
// detail underneath. The order arrives for free — nobody needs a rail to know
// that 03 follows 02 — which frees the layout to be staggered and drifting
// rather than ruled.
//
// The motion is scroll-driven CSS, so this stays a server component and ships
// no JavaScript. Firefox and anyone with reduced-motion on gets the same
// layout, standing still.
export function ProcessSection() {
  return (
    <Section id="process" tone="raised" size="lg">
      <SectionIntro
        eyebrow="Our process"
        title={"How working with\nus actually goes."}
        lead="Five steps, no surprises. You can stop after step one and still walk away knowing exactly where you stand."
      />

      <ol className="mt-16 grid gap-4 sm:grid-cols-2 md:mt-20 md:grid-cols-5 md:gap-5">
        {PROCESS_STEPS.map((step, i) => (
          <li
            key={step.n}
            className={`${motion.parallax} ${LIFT[i] ?? ""}`}
            style={parallax(DEPTH[i] ?? 20)}
          >
            {/* The parallax lives on the <li> and the entrance on the panel
                inside it — one element cannot carry two `animation`
                shorthands, and they want different ranges anyway. */}
            <div
              className={`${motion.rise} ${motion.tile} group h-full rounded-2xl border border-white/[0.06] bg-white/[0.02] p-5 hover:border-blue-400/25 hover:bg-white/[0.04] md:p-6`}
              style={stagger(i, 5)}
            >
              {/* The figure. Same scale and family as the proof band's
                  statistics, graded into blue at the baseline so it reads as
                  a number worth looking at rather than a list marker. */}
              <span
                aria-hidden="true"
                className="block bg-[linear-gradient(180deg,#F3F5FA_35%,rgba(96,165,250,0.5)_100%)] bg-clip-text font-ibm-plex text-[2.5rem] font-light leading-none tracking-tight text-transparent md:text-[2.75rem]"
              >
                {step.n}
              </span>

              {/* Spoken, since the numeral above is decorative to a screen
                  reader and "01" alone tells it nothing. */}
              <span className="sr-only">Step {Number(step.n)}: </span>

              <h3 className="mt-5 text-[1.0625rem] font-light leading-snug text-[#F3F5FA] transition-colors duration-300 group-hover:text-blue-100">
                {step.title}
              </h3>
              <p className="mt-2 text-[0.9375rem] leading-[1.7] text-white/50">{step.desc}</p>

              <span className="mt-5 inline-block rounded-full border border-white/[0.08] bg-white/[0.03] px-2.5 py-1 text-[10px] uppercase tracking-[0.15em] text-white/45 transition-colors duration-300 group-hover:border-blue-400/25 group-hover:text-blue-200/70">
                {step.signal}
              </span>
            </div>
          </li>
        ))}
      </ol>

      <a
        href="#health-check"
        className={`${motion.link} ${motion.fade} group mt-16 inline-flex items-center gap-2 text-[0.9375rem] tracking-wide text-blue-300/85 transition-colors hover:text-blue-300 md:mt-20`}
      >
        Start with step one — a free 15-minute call
        <Chevron className="transition-transform group-hover:translate-x-0.5" />
      </a>
    </Section>
  )
}
