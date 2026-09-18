import { RevealText } from "@/components/ui/reveal-text"
import { CTAButtons } from "@/components/ui/section-cta"
import styles from "@/components/sections/shared/cta-backdrop.module.css"

const TRUST_INDICATORS = ["No commitment", "Free 15-min call", "500+ clients served"]

// Per-industry closing CTA. Same CSS backdrop as the site-wide
// FinalCTASection, but with copy specific to the sector — the industry page
// uses this instead of the generic one so the last thing a visitor reads
// still speaks to their business.
export function IndustryCTASection({
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

      <div className="relative max-w-2xl mx-auto text-center">
        <RevealText className="text-4xl md:text-5xl lg:text-6xl font-light tracking-tight leading-[1.05] mb-6">
          {headline}
        </RevealText>
        <p className="text-sm text-muted-foreground leading-relaxed mb-10">{subtext}</p>

        <div className="mb-8">
          <CTAButtons
            primaryLabel="Book a Free Consultation"
            secondaryLabel="Contact Us"
            secondaryHref="/contact"
            align="center"
          />
        </div>

        <div className="flex items-center justify-center gap-6 flex-wrap">
          {TRUST_INDICATORS.map((t) => (
            <div key={t} className="flex items-center gap-2 text-xs text-muted-foreground">
              <span className="w-1 h-1 rounded-full bg-teal/60" />
              {t}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
