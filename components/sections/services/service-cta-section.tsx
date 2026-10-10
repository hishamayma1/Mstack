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
      className={`${styles.backdrop} py-32 px-6 md:px-12 lg:px-20 border-t border-border`}
    >
      <div className={styles.glow} aria-hidden="true" />
      <div className={styles.floor} aria-hidden="true" />
      <div className={styles.horizon} aria-hidden="true" />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(60%_55%_at_50%_100%,color-mix(in_oklch,var(--svc)_22%,transparent),transparent_70%)]"
      />

      <div className="relative max-w-2xl mx-auto text-center">
        <RevealText className="text-4xl md:text-5xl lg:text-6xl font-light tracking-tight leading-[1.05] mb-6">
          {headline}
        </RevealText>
        <p className="text-sm text-muted-foreground leading-relaxed mb-10">{subtext}</p>

        <div className="mb-8 flex flex-col sm:flex-row gap-3 justify-center">
          <a
            href="#configure"
            className="px-8 py-3 bg-linear-to-br from-svc to-svc-2 text-white text-sm rounded-xl shadow-[0_10px_30px_-10px_var(--svc)] transition-[filter] duration-200 hover:brightness-110 active:brightness-95 tracking-widest font-medium text-center whitespace-nowrap"
          >
            Build My Plan
          </a>
          <Link
            href="/contact"
            className="px-8 py-3 border border-border text-foreground/75 text-sm rounded-xl hover:border-svc/40 hover:text-foreground hover:bg-svc/[0.06] transition-all tracking-widest font-medium text-center whitespace-nowrap"
          >
            Book a Call Instead
          </Link>
        </div>

        <div className="flex items-center justify-center gap-6 flex-wrap">
          {TRUST_INDICATORS.map((indicator) => (
            <div key={indicator} className="flex items-center gap-2 text-xs text-muted-foreground">
              <span className="w-1 h-1 rounded-full bg-svc" />
              {indicator}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
