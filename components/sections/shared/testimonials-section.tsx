import { PixelIcon } from "@/components/ui/pixel-icon"
import { RevealText } from "@/components/ui/reveal-text"
import { Tag } from "@/components/ui/tag"
import { SectionCTA } from "@/components/ui/section-cta"
import { TESTIMONIALS } from "@/lib/content/site"
import styles from "./testimonials-section.module.css"

// Pure CSS-driven marquee — no event handlers, so this stays a server
// component even though it "feels" animated.
export function TestimonialsSection() {
  return (
    <section id="testimonials" className="py-32 border-t border-border overflow-hidden">
      <div className="max-w-6xl mx-auto px-6 md:px-12 lg:px-20 mb-12">
        <PixelIcon type="platform" size={40} />
        <div className="mt-4"><Tag>CLIENT REVIEWS</Tag></div>
        <RevealText className="mt-5 text-4xl md:text-5xl font-light tracking-tight leading-[1.05]">
          {"What Our\nClients Say."}
        </RevealText>
        <p className="mt-5 text-sm text-muted-foreground leading-relaxed max-w-xl">
          500+ verified 5-star reviews from businesses across the globe. ★★★★★ Google Reviews.
        </p>
      </div>

      {/* Three copies of the list, translated by exactly one copy's width, so
          the loop is seamless. Copies 2 and 3 are hidden from assistive tech —
          the quotes are already announced once. */}
      <div className={`${styles.rail} border-y border-border overflow-hidden`}>
        <ul className={styles.track}>
          {[...Array(3)].map((_, rep) =>
            TESTIMONIALS.map((t) => (
              <li
                key={`${rep}-${t.name}`}
                aria-hidden={rep > 0 ? "true" : undefined}
                className="w-[320px] shrink-0 px-8 py-7 border-r border-border flex flex-col gap-3"
              >
                <div className="flex items-center justify-between gap-3">
                  <span className="text-sm text-foreground/85 font-light">{t.name}</span>
                  <span className="text-[11px] text-blue-600 dark:text-blue-400/90 tracking-[0.2em]" aria-label="5 out of 5">
                    ★★★★★
                  </span>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  <span aria-hidden="true" className="text-foreground/20 mr-1">&ldquo;</span>
                  {t.quote}
                  <span aria-hidden="true" className="text-foreground/20 ml-0.5">&rdquo;</span>
                </p>
              </li>
            )),
          )}
        </ul>
      </div>

      <div className="max-w-6xl mx-auto px-6 md:px-12 lg:px-20">
        <SectionCTA
          text="Want to hear the detail behind one of these? We'll walk you through the closest project to your situation."
          primaryLabel="Book a Free Consultation"
          secondaryLabel="Read Case Studies"
          secondaryHref="/case-studies"
        />
      </div>
    </section>
  )
}
