import { PixelIcon } from "@/components/ui/pixel-icon"
import { RevealText } from "@/components/ui/reveal-text"
import { Tag } from "@/components/ui/tag"
import { BentoCard } from "@/components/ui/bento-card"
import { MouseGlowGrid } from "@/components/ui/mouse-glow-grid"
import { AppLogo } from "@/components/ui/app-logo"
import { USE_CASES } from "@/lib/content/site"
import { USE_CASE_LOGOS } from "@/lib/content/app-logos"

export function UseCasesSection() {
  return (
    <section id="use-cases" className="py-32 px-6 md:px-12 lg:px-20 border-t border-white/[0.08]">
      <div className="max-w-6xl mx-auto">
        <div className="mb-16">
          <PixelIcon type="agents" size={40} />
          <div className="mt-4"><Tag>REAL QUESTIONS WE ANSWER</Tag></div>
          <RevealText className="mt-5 text-4xl md:text-5xl font-light tracking-tight leading-[1.05]">
            {"How Can We\nHelp You?"}
          </RevealText>
        </div>

        <MouseGlowGrid className="grid grid-cols-12 gap-3">
          {USE_CASES.map((u, i) => (
            <BentoCard key={u.name} className="col-span-12 md:col-span-6 lg:col-span-4 p-8 flex flex-col" delay={i * 60}>
              <div className="flex items-center justify-between gap-3 mb-5">
                <span className="flex items-center gap-2.5">
                  {/* The product we'd answer this with — swap the real mark in
                      via lib/content/app-logos.ts. */}
                  {USE_CASE_LOGOS[u.topic] ? (
                    <AppLogo slug={USE_CASE_LOGOS[u.topic]} size={24} />
                  ) : null}
                  <span className="text-sm font-light text-[#F3F5FA]">{u.name}</span>
                </span>
                <Tag>{u.topic}</Tag>
              </div>
              <p className="text-sm text-white/55 leading-relaxed">&ldquo;{u.quote}&rdquo;</p>
            </BentoCard>
          ))}
        </MouseGlowGrid>

        <div className="mt-12 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 rounded-2xl border border-white/[0.08] p-8 bg-white/[0.02]">
          <p className="text-base text-white/65 font-light">Sound like a challenge your business faces?</p>
          <a href="#final-cta" className="shrink-0 px-6 py-3 bg-blue-600 text-white text-sm rounded-xl hover:bg-blue-500 transition-colors tracking-wide font-medium">
            Let&apos;s Talk — Book a Free Call
          </a>
        </div>
      </div>
    </section>
  )
}
