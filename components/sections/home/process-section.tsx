import type { CSSProperties } from "react"
import { PixelIcon } from "@/components/ui/pixel-icon"
import { RevealText } from "@/components/ui/reveal-text"
import { Tag } from "@/components/ui/tag"
import { BentoCard } from "@/components/ui/bento-card"
import { MediaFrame } from "@/components/ui/media-frame"
import { MouseGlowGrid } from "@/components/ui/mouse-glow-grid"
import { SectionCTA } from "@/components/ui/section-cta"
import { PROCESS_STEPS } from "@/lib/content/site"
import { PROCESS_MEDIA } from "@/lib/content/home-media"
import styles from "./process-section.module.css"

// Five steps read as one journey, not five unrelated cards: arrows travel along
// the rail above them, each card leads with its own indicator ("15 min · free",
// "Zero downtime"), and the whole row drifts against the scroll so the section
// has depth. All of it is CSS — see process-section.module.css.
export function ProcessSection() {
  return (
    <section id="process" className="py-32 px-6 md:px-12 lg:px-20 border-t border-white/[0.08] overflow-hidden">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-end mb-14">
          <div className="lg:col-span-6">
            <PixelIcon type="workflow" size={40} />
            <div className="mt-4"><Tag>OUR PROCESS</Tag></div>
            <RevealText className="mt-5 text-4xl md:text-5xl font-light tracking-tight leading-[1.05]">
              {"How We Work\nWith You."}
            </RevealText>
            <p className="mt-5 text-sm text-white/55 leading-relaxed max-w-md">
              Five steps, no surprises. You can stop after step one and still walk away
              knowing where you stand.
            </p>
          </div>

          {/* The deepest parallax layer — it moves most, so it reads as sitting
              behind the copy beside it. */}
          <div className="lg:col-span-6">
            <div className={styles.parallax} style={{ "--depth": 1.6 } as CSSProperties}>
              <MediaFrame
                src={PROCESS_MEDIA.src}
                alt={PROCESS_MEDIA.alt}
                label={PROCESS_MEDIA.label}
                hint={PROCESS_MEDIA.hint}
                aspect="16/10"
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="border border-white/[0.08]"
              />
            </div>
          </div>
        </div>

        <div>
          {/* The rail: a marker per step, joined by hairlines with a chevron
              travelling along each one, so the eye is pulled through the five
              steps in order. Desktop only — the cards stack on narrow screens,
              where a horizontal rail would lie about the layout. */}
          <div aria-hidden="true" className="hidden lg:grid grid-cols-5 mb-5 px-1">
            {PROCESS_STEPS.map((step, i) => (
              <div key={step.n} className={styles.leg} style={{ "--i": i } as CSSProperties}>
                <span className="h-2 w-2 shrink-0 rounded-full bg-blue-400/70 ring-4 ring-blue-500/10" />
                <span className={`${styles.line} ${i === PROCESS_STEPS.length - 1 ? styles.lineEnd : ""}`}>
                  <span className={styles.arrowTrack}>
                    <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                      <path
                        d="M2 1.5L6 5l-4 3.5"
                        stroke="currentColor"
                        strokeWidth="1.4"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </span>
                </span>
              </div>
            ))}
          </div>

          <MouseGlowGrid className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
            {PROCESS_STEPS.map((step, i) => (
              // Wrapper carries the parallax so the card keeps its own scroll
              // reveal — two animations, two elements, no transform conflict.
              // Depth ramps along the row, so the five cards rake gently in the
              // direction of travel instead of zig-zagging out of alignment.
              <div
                key={step.n}
                className={styles.parallax}
                style={{ "--depth": 0.2 + i * 0.16 } as CSSProperties}
              >
                <BentoCard className="h-full p-6 flex flex-col min-h-[230px]" delay={i * 80}>
                  <div className="flex items-center gap-2.5 mb-5">
                    <span className="flex items-center justify-center h-7 w-7 rounded-lg border border-blue-500/30 bg-blue-500/10 font-pixel text-[10px] text-blue-300/90">
                      {step.n}
                    </span>
                    <span className="text-[10px] tracking-widest text-white/35">{step.signal.toUpperCase()}</span>
                  </div>
                  <h3 className="text-lg font-light mb-2.5 mt-auto">{step.title}</h3>
                  <p className="text-sm text-white/55 leading-relaxed">{step.desc}</p>
                </BentoCard>
              </div>
            ))}
          </MouseGlowGrid>
        </div>

        <SectionCTA
          text="Step one is a free 15-minute call. You'll leave it knowing where you stand, whether or not we work together."
          primaryLabel="Start With Step One"
          primaryHref="#health-check"
        />
      </div>
    </section>
  )
}
