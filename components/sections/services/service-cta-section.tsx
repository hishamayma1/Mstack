import Link from "next/link"
import { RevealText } from "@/components/ui/reveal-text"
import styles from "@/components/sections/shared/cta-backdrop.module.css"

const TRUST_INDICATORS = ["No card required", "Reviewed by a human", "Reply within 1 working day"]

// Per-service closing CTA. Same backdrop as the site-wide FinalCTASection,
// but the primary action points back up at the configurator rather than at
// /contact — someone who has read the whole page should be sent to the thing
// that captures their configuration, not to a generic contact form.
export function ServiceCTASection({
  headline,
  subtext,
}: {
  headline: string
  subtext: string
}) {
  return (
    <section
      id="final-cta"
      className={`${styles.backdrop} py-32 px-6 md:px-12 lg:px-20 border-t border-white/[0.08]`}
    >
      <div className={styles.glow} aria-hidden="true" />
      <div className={styles.floor} aria-hidden="true" />
      <div className={styles.horizon} aria-hidden="true" />

      <div className="relative max-w-2xl mx-auto text-center">
        <RevealText className="text-4xl md:text-5xl lg:text-6xl font-light tracking-tight leading-[1.05] mb-6">
          {headline}
        </RevealText>
        <p className="text-sm text-white/55 leading-relaxed mb-10">{subtext}</p>

        <div className="mb-8 flex flex-col sm:flex-row gap-3 justify-center">
          <a
            href="#configure"
            className="px-8 py-3 bg-blue-600 text-white text-sm rounded-xl hover:bg-blue-500 transition-colors tracking-widest font-medium text-center whitespace-nowrap"
          >
            Build My Plan
          </a>
          <Link
            href="/contact"
            className="px-8 py-3 border border-white/15 text-white/75 text-sm rounded-xl hover:border-blue-500/40 hover:text-white hover:bg-white/[0.05] transition-all tracking-widest font-medium text-center whitespace-nowrap"
          >
            Book a Call Instead
          </Link>
        </div>

        <div className="flex items-center justify-center gap-6 flex-wrap">
          {TRUST_INDICATORS.map((indicator) => (
            <div key={indicator} className="flex items-center gap-2 text-xs text-white/40">
              <span className="w-1 h-1 rounded-full bg-blue-400/60" />
              {indicator}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
