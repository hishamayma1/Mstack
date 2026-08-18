import { MediaFrame } from "@/components/ui/media-frame"
import { SectionHeader } from "@/components/ui/section-header"
import { SectionCTA } from "@/components/ui/section-cta"
import { INDUSTRY_WALKTHROUGH } from "@/lib/content/industry-media"

// Explains what actually happens if you engage us, in three visual steps.
// Sits after the toolkit: by that point a visitor knows what they'd get, and
// this answers the next question — what does getting it involve?
//
// Rows alternate image side on desktop so the eye zig-zags down the page
// instead of scanning one column; on mobile every row stacks text-then-image.
export function IndustryWalkthroughSection({ industryTitle }: { industryTitle: string }) {
  return (
    <section id="how-it-works" className="py-28 px-6 md:px-12 lg:px-20 border-t border-white/[0.08]">
      <div className="max-w-6xl mx-auto">
        <SectionHeader
          eyebrow="HOW IT WORKS"
          title={"From First Call\nto Fully Running."}
          intro={`The same three steps for every ${industryTitle.toLowerCase()} client. No long discovery phase, no surprise invoices — you'll know what's happening at each stage.`}
        />

        <div className="space-y-4">
          {INDUSTRY_WALKTHROUGH.map((step, i) => {
            const imageFirst = i % 2 === 1
            return (
              <div
                key={step.n}
                className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-10 items-center rounded-2xl border border-white/[0.08] bg-[#10141f] p-6 md:p-8"
              >
                <div className={imageFirst ? "lg:order-2" : ""}>
                  <span className="font-pixel text-[11px] text-white/30 tracking-widest block mb-5">
                    {step.n}
                  </span>
                  <h3 className="text-2xl font-light tracking-tight mb-4">{step.title}</h3>
                  <p className="text-sm text-white/55 leading-relaxed mb-6">{step.description}</p>

                  <ul className="space-y-2.5">
                    {step.bullets.map((b) => (
                      <li key={b} className="flex items-start gap-3 text-sm text-white/70">
                        <span
                          aria-hidden="true"
                          className="mt-[7px] h-1 w-1 shrink-0 rounded-full bg-blue-400/70"
                        />
                        {b}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className={imageFirst ? "lg:order-1" : ""}>
                  <MediaFrame
                    src={step.media.src}
                    alt={step.media.alt}
                    label={step.media.label}
                    hint={step.media.hint}
                    aspect="10/7"
                    sizes="(max-width: 1024px) 100vw, 45vw"
                  />
                </div>
              </div>
            )
          })}
        </div>

        <SectionCTA
          text="Step one is free and takes 15 minutes. You'll get the audit findings whether or not you work with us."
          primaryLabel="Start With the Free Audit"
        />
      </div>
    </section>
  )
}
