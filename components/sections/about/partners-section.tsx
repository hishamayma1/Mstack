import { Tag } from "@/components/ui/tag"
import { BentoCard } from "@/components/ui/bento-card"
import { MouseGlowGrid } from "@/components/ui/mouse-glow-grid"
import { PARTNERS } from "@/lib/content/site"

export function PartnersSection() {
  return (
    <section id="partners" className="py-32 px-6 md:px-12 lg:px-20 border-t border-white/[0.08]">
      <div className="max-w-6xl mx-auto">
        <div className="mb-16 max-w-2xl">
          <Tag>PARTNERS &amp; CERTIFICATIONS</Tag>
          <h2 className="mt-5 text-4xl md:text-5xl font-light tracking-tight leading-[1.05]">
            Backed by Microsoft,<br />Proven by Credentials.
          </h2>
        </div>

        <MouseGlowGrid className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {PARTNERS.map((p, i) => (
            <BentoCard key={`${p.name}-${p.type}`} className="p-6 flex flex-col gap-2" delay={i * 50}>
              <div className="w-9 h-9 rounded-lg border border-blue-500/30 bg-blue-500/10 flex items-center justify-center mb-2">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-blue-300">
                  <path d="M12 2l2.4 7.2H22l-6 4.6 2.3 7.2L12 16.4l-6.3 4.6 2.3-7.2-6-4.6h7.6z" />
                </svg>
              </div>
              <p className="text-sm font-light text-[#F3F5FA] leading-snug">{p.name}</p>
              <span className="text-xs text-white/40 tracking-wide">{p.type}</span>
            </BentoCard>
          ))}
        </MouseGlowGrid>
      </div>
    </section>
  )
}
