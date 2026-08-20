import { Section, SectionIntro, Chevron } from "@/components/ui/section"
import { PROCESS_STEPS } from "@/lib/content/site"

// Five steps, one rail.
//
// This was five bento cards, each on its own parallax layer with a different
// scroll depth, under an animated chevron track, beside a dashed image
// placeholder. All of that movement was fighting the one thing the section has
// to communicate: that these happen in order.
//
// So the order is now the design. A single hairline runs across the top of the
// row (down the left on mobile) with a marker per step, and each step is bare
// text against the band. No card, no border, no parallax — the rail does the
// grouping. This is the numbered-process pattern from Techquarter, and it
// reads at a glance.
export function ProcessSection() {
  return (
    <Section id="process" tone="raised" size="lg">
      <SectionIntro
        eyebrow="Our process"
        title={"How working with\nus actually goes."}
        lead="Five steps, no surprises. You can stop after step one and still walk away knowing exactly where you stand."
      />

      <ol className="mt-14 grid md:grid-cols-5 md:gap-5 md:border-t md:border-white/[0.07]">
        {PROCESS_STEPS.map((step) => (
          <li
            key={step.n}
            className="relative border-l border-white/[0.07] pb-9 pl-6 last:pb-0 md:border-l-0 md:pb-0 md:pl-0 md:pt-10"
          >
            <span
              aria-hidden="true"
              className="absolute left-0 top-1.5 h-2 w-2 -translate-x-1/2 rounded-full bg-blue-400/80 ring-4 ring-blue-500/10 md:top-0 md:translate-x-0 md:-translate-y-1/2"
            />
            <span className="font-ibm-plex text-[11px] tabular-nums tracking-[0.2em] text-white/25">
              {step.n}
            </span>
            <h3 className="mt-3 text-[1.0625rem] font-light leading-snug text-[#F3F5FA]">{step.title}</h3>
            <p className="mt-2 text-[0.9375rem] leading-[1.7] text-white/50">{step.desc}</p>
            <span className="mt-4 inline-block rounded-full border border-white/[0.08] bg-white/[0.03] px-2.5 py-1 text-[10px] uppercase tracking-[0.15em] text-white/45">
              {step.signal}
            </span>
          </li>
        ))}
      </ol>

      <a
        href="#health-check"
        className="group mt-14 inline-flex items-center gap-2 text-[0.9375rem] tracking-wide text-blue-300/85 transition-colors hover:text-blue-300"
      >
        Start with step one — a free 15-minute call
        <Chevron className="transition-transform group-hover:translate-x-0.5" />
      </a>
    </Section>
  )
}
