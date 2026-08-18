import { Tag } from "@/components/ui/tag"
import { RevealText } from "@/components/ui/reveal-text"
import { CTAButtons } from "@/components/ui/section-cta"
import { MediaFrame } from "@/components/ui/media-frame"
import { HEALTH_CHECK_DELIVERABLES } from "@/lib/content/site"
import { HEALTH_CHECK_MEDIA } from "@/lib/content/home-media"
import styles from "@/components/sections/shared/cta-backdrop.module.css"

// The page's primary conversion offer, sitting after the proof sections and
// before objection handling. It asks for 15 minutes rather than a budget,
// and every other CTA on the homepage points here or to /contact.
//
// Server component, and the backdrop is the same CSS-only treatment as the
// closing CTA — no image, no extra request.
export function LeadMagnetSection() {
  return (
    <section
      id="health-check"
      className={`${styles.backdrop} py-28 px-6 md:px-12 lg:px-20 border-t border-white/[0.08]`}
    >
      <div className={styles.glow} aria-hidden="true" />
      <div className={styles.floor} aria-hidden="true" />

      <div className="relative max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          <div>
            <Tag>FREE — NO COMMITMENT</Tag>
            <RevealText className="mt-5 text-4xl md:text-5xl font-light tracking-tight leading-[1.05]">
              {"The 15-Minute\nMicrosoft 365\nHealth Check."}
            </RevealText>
            <p className="mt-6 text-base text-white/55 leading-relaxed max-w-lg">
              We open your tenant, look at what you're paying for and what's actually
              configured, and tell you plainly where the gaps are. No sales deck, no
              obligation — you keep the findings either way.
            </p>

            <div className="mt-8">
              <CTAButtons
                primaryLabel="Book Your Health Check"
                secondaryLabel="Talk to Us First"
                secondaryHref="/contact"
              />
            </div>

            <p className="mt-5 text-xs text-white/35">
              Typically booked within 2 working days · Runs over Teams · No access changes made
            </p>
          </div>

          {/* The deliverable, shown as well as described: the report preview
              sits beside the list so "what you get" is literal. */}
          <div className="grid grid-cols-1 sm:grid-cols-5 gap-3">
            <MediaFrame
              src={HEALTH_CHECK_MEDIA.src}
              alt={HEALTH_CHECK_MEDIA.alt}
              label={HEALTH_CHECK_MEDIA.label}
              hint={HEALTH_CHECK_MEDIA.hint}
              aspect="9/11"
              sizes="(max-width: 640px) 100vw, 20vw"
              className="sm:col-span-2 border border-white/[0.08]"
            />

            <ul className="sm:col-span-3 rounded-2xl border border-white/[0.08] bg-[#10141f]/80 p-7 space-y-4">
              <li className="text-[11px] tracking-widest text-white/40 pb-1">WHAT YOU GET</li>
              {HEALTH_CHECK_DELIVERABLES.map((d) => (
                <li key={d} className="flex items-start gap-3">
                  <svg
                    aria-hidden="true"
                    width="15"
                    height="15"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="mt-[3px] shrink-0 text-blue-400/80"
                  >
                    <path d="M4 12.5l5 5L20 6.5" />
                  </svg>
                  <span className="text-sm text-white/70 leading-relaxed">{d}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  )
}
