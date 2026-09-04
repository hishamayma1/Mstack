import { Section, Eyebrow } from "@/components/ui/section"
import { RevealText } from "@/components/ui/reveal-text"
import { CTAButtons } from "@/components/ui/section-cta"
import { HEALTH_CHECK_DELIVERABLES } from "@/lib/content/site"

// The page's conversion offer, and — apart from the closing CTA — the only
// hard ask on it.
//
// The homepage used to end seven of its sections with a SectionCTA bar, so by
// the time a visitor reached this one they had already declined the same offer
// six times. Those bars are gone; the sections above now end in a single quiet
// text link where they end in anything at all, and every one of them points
// here. That is what makes this band land.
//
// The dashed "report preview" placeholder beside the list is gone too — an
// empty frame labelled IMAGE next to the words "here is what you get" was
// doing the opposite of its job.
export function LeadMagnetSection() {
  return (
    <Section id="health-check" tone="accent" size="lg">
      <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
        <div>
          <Eyebrow>Free — no commitment</Eyebrow>
          <RevealText
            stagger={2}
            className="mt-4 text-[2rem] font-light leading-[1.12] tracking-tight text-foreground md:text-[2.75rem]"
          >
            {"The 15-minute\nMicrosoft 365\nhealth check."}
          </RevealText>
          <p className="mt-6 max-w-[52ch] text-[0.975rem] leading-[1.8] text-muted-foreground">
            We open your tenant, look at what you&apos;re paying for against what&apos;s actually
            configured, and tell you plainly where the gaps are. No sales deck, no obligation — you
            keep the findings either way.
          </p>

          <div className="mt-9">
            <CTAButtons
              primaryLabel="Book Your Health Check"
              secondaryLabel="Talk to Us First"
              secondaryHref="/contact"
            />
          </div>

          <p className="mt-6 text-[0.75rem] leading-relaxed text-muted-foreground">
            Typically booked within 2 working days · Runs over Teams · No access changes made
          </p>
        </div>

        <div className="rounded-2xl border border-border bg-card/70 p-8 md:p-9">
          <p className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground">What you get</p>
          <ul className="mt-6 space-y-5">
            {HEALTH_CHECK_DELIVERABLES.map((d) => (
              <li key={d} className="flex items-start gap-3.5">
                <svg
                  aria-hidden="true"
                  width="15"
                  height="15"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="mt-[0.35em] shrink-0 text-blue-400/85"
                >
                  <path d="M4 12.5l5 5L20 6.5" />
                </svg>
                <span className="text-[0.9375rem] leading-[1.7] text-muted-foreground">{d}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </Section>
  )
}
