import { Tag } from "@/components/ui/tag"
import { RevealText } from "@/components/ui/reveal-text"
import { BentoCard } from "@/components/ui/bento-card"
import { OUR_STORY } from "@/lib/content/site"

export function OurStorySection() {
  return (
    <section id="our-story" className="py-32 px-6 md:px-12 lg:px-20 border-t border-border">
      <div className="max-w-6xl mx-auto">
        <div className="mb-16 max-w-2xl">
          <Tag>OUR STORY</Tag>
          <RevealText className="mt-5 text-4xl md:text-5xl font-light tracking-tight leading-[1.05]">
            {"A Decade of Going\nAll-In on Microsoft."}
          </RevealText>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {OUR_STORY.map((m, i) => (
            <BentoCard key={m.year} className="p-7 flex flex-col min-h-[220px]" delay={i * 80}>
              <span
                className={`font-pixel text-[11px] tracking-widest block mb-6 ${
                  i % 2 === 0 ? "text-blue-600 dark:text-blue-400/80" : "text-teal"
                }`}
              >
                {m.year}
              </span>
              <h3 className="text-lg font-light mb-3 mt-auto">{m.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{m.desc}</p>
            </BentoCard>
          ))}
        </div>
      </div>
    </section>
  )
}
