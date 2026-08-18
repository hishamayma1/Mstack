import { PixelIcon } from "@/components/ui/pixel-icon"
import { RevealText } from "@/components/ui/reveal-text"
import { Tag } from "@/components/ui/tag"
import { BentoCard } from "@/components/ui/bento-card"
import { MediaFrame } from "@/components/ui/media-frame"
import { MouseGlowGrid } from "@/components/ui/mouse-glow-grid"
import { SectionCTA } from "@/components/ui/section-cta"
import { BRAND_BREAKDOWN, DIFFERENTIATORS, type Differentiator } from "@/lib/content/site"
import { TEAM_MEDIA } from "@/lib/content/home-media"

// One mark per claim. Six identical badges made the grid read as one repeated
// point; six distinct shapes let it be scanned. Paths are 24×24, stroked, so
// they inherit the card's text colour and weight.
const DIFFERENTIATOR_ICONS: Record<Differentiator["icon"], string> = {
  native: "M4 4h7v7H4zM13 4h7v7h-7zM4 13h7v7H4zM13 13h7v7h-7z",
  speed: "M13 2L4.5 13.5H11l-1 8.5 8.5-11.5H12z",
  scale: "M4 20V14M10 20V10M16 20V6M22 20V3",
  shield: "M12 2.5l7.5 3v6c0 4.5-3.1 8.4-7.5 10-4.4-1.6-7.5-5.5-7.5-10v-6z",
  support: "M9 11a3.5 3.5 0 100-7 3.5 3.5 0 000 7zM2.5 20.5a6.5 6.5 0 0113 0M17 8.5h4.5M19.25 6.25v4.5",
  partnership: "M7.5 12.5l3 3 6-6M4 6.5A2.5 2.5 0 016.5 4h11A2.5 2.5 0 0120 6.5v11a2.5 2.5 0 01-2.5 2.5h-11A2.5 2.5 0 014 17.5z",
}

export function DifferentiatorsSection() {
  return (
    <section id="why-us" className="py-32 px-6 md:px-12 lg:px-20 border-t border-white/[0.08]">
      <div className="max-w-6xl mx-auto">
        <div className="mb-14">
          <PixelIcon type="integrations" size={40} />
          <div className="mt-4"><Tag>WHY MSTACK360</Tag></div>
          <RevealText className="mt-5 text-4xl md:text-5xl font-light tracking-tight leading-[1.05]">
            {"The MStack360\nDifference."}
          </RevealText>
        </div>

        {/* Brand breakdown, beside the team shot — the name explained next to
            the people it belongs to. */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 mb-3">
          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-3 gap-3">
            {BRAND_BREAKDOWN.map((b, i) => (
              <BentoCard key={b.label} className="p-7 text-center flex flex-col items-center" delay={i * 80}>
                <div className="text-4xl font-light text-blue-400 mb-3 font-ibm-plex">{b.letter}</div>
                <div className="text-xs tracking-widest uppercase text-white/40 mb-2">{b.label}</div>
                <p className="text-sm text-white/55 leading-relaxed">{b.desc}</p>
              </BentoCard>
            ))}
          </div>

          <div className="lg:col-span-5">
            <MediaFrame
              src={TEAM_MEDIA.src}
              alt={TEAM_MEDIA.alt}
              label={TEAM_MEDIA.label}
              hint={TEAM_MEDIA.hint}
              aspect="16/9"
              sizes="(max-width: 1024px) 100vw, 40vw"
              className="h-full border border-white/[0.08]"
            />
          </div>
        </div>

        {/* 6 differentiators */}
        <MouseGlowGrid className="grid grid-cols-12 gap-3">
          {DIFFERENTIATORS.map((d, i) => (
            <BentoCard key={d.title} className="col-span-12 md:col-span-6 lg:col-span-4 p-7" delay={i * 60}>
              <div className="w-10 h-10 rounded-xl border border-blue-500/25 bg-blue-500/10 flex items-center justify-center mb-5 text-blue-300/90">
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d={DIFFERENTIATOR_ICONS[d.icon]} />
                </svg>
              </div>
              <h3 className="text-lg font-light mb-2">{d.title}</h3>
              <p className="text-sm text-white/55 leading-relaxed">{d.desc}</p>
            </BentoCard>
          ))}
        </MouseGlowGrid>

        <SectionCTA
          text="Worth 15 minutes to find out what a Microsoft-native partner would do differently with your tenant?"
          primaryLabel="Book a Free Health Check"
          primaryHref="#health-check"
          secondaryLabel="Read Our Story"
          secondaryHref="/about"
        />
      </div>
    </section>
  )
}
