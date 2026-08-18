import Link from "next/link"
import { RevealText } from "@/components/ui/reveal-text"
import { CTAButtons } from "@/components/ui/section-cta"
import styles from "./cta-backdrop.module.css"

const TRUST_INDICATORS = ["No commitment", "Free 15-min call", "500+ clients served"]

// Site-wide closing CTA. Pure static markup apart from the RevealText leaf,
// and the backdrop is CSS-only — no background image, no backdrop-filter.
export function FinalCTASection() {
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
          {"Ready to Transform Your\nMicrosoft 365 Environment?"}
        </RevealText>
        <p className="text-sm text-white/55 leading-relaxed mb-10">
          Get a free consultation and discover which level is right for your business.
        </p>

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
            <div key={t} className="flex items-center gap-2 text-xs text-white/40">
              <span className="w-1 h-1 rounded-full bg-blue-400/60" />
              {t}
            </div>
          ))}
        </div>

        <p className="mt-10 text-xs text-white/30">
          Prefer to browse first?{" "}
          <Link href="/solutions" className="text-blue-300/80 hover:text-blue-300 transition-colors">
            See our service levels →
          </Link>
        </p>
      </div>
    </section>
  )
}
