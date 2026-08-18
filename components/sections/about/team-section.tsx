import { PixelIcon } from "@/components/ui/pixel-icon"
import { RevealText } from "@/components/ui/reveal-text"
import { Tag } from "@/components/ui/tag"
import { TiltedCard } from "@/components/ui/tilted-card"
import { TEAM } from "@/lib/content/site"
import type { CSSProperties } from "react"
import reveal from "@/components/ui/reveal.module.css"
import styles from "./team-section.module.css"

// Team grid. Server component: TiltedCard is the only client boundary, and the
// name/title/bio/email markup is passed into it as an already-server-rendered
// `overlay`, so none of the card copy lands in the client bundle.
//
// BentoCard/MouseGlowGrid are deliberately not used here any more — the photo
// carries the card now, and layering the grid's pointer glow under a card that
// already tracks the pointer itself meant two effects fighting over the same
// gesture.
export function TeamSection() {
  return (
    <section id="team" className="py-32 px-6 md:px-12 lg:px-20 border-t border-white/[0.08]">
      <div className="max-w-6xl mx-auto">
        <div className="mb-16">
          <PixelIcon type="agents" size={40} />
          <div className="mt-4"><Tag>MSTACK360 TEAM</Tag></div>
          <RevealText className="mt-5 text-4xl md:text-5xl lg:text-6xl font-light tracking-tight leading-[1.05]">
            {"The Experts Behind\nYour Success."}
          </RevealText>
        </div>

        <div className={styles.grid}>
          {TEAM.map((m, i) => (
            <div
              key={m.name}
              className={`${reveal.reveal} ${styles.cell}`}
              // Same scroll-reveal stagger BentoCard applied, kept so this grid
              // still cascades in like every other section's.
              style={
                {
                  "--reveal-start": `${Math.min((i * 70) / 20, 24)}%`,
                  "--reveal-end": `${Math.min((i * 70) / 20, 24) + 42}%`,
                } as CSSProperties
              }
            >
              <TiltedCard
                src={m.photo}
                alt={`${m.name}, ${m.title}`}
                // Three across at lg, two at md, one below — matches .grid.
                // No `priority`: this section is well below the fold.
                sizes="(min-width: 1024px) 30vw, (min-width: 768px) 45vw, 92vw"
                caption={m.title}
                overlay={
                  <>
                    <h3 className={styles.name}>{m.name}</h3>
                    <span className={styles.role}>{m.title}</span>
                  </>
                }
              />

              <div className={styles.body}>
                <p className={styles.bio}>{m.bio}</p>
                <a href={`mailto:${m.email}`} className={styles.email}>
                  {m.email}
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
