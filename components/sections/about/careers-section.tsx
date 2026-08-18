import { Tag } from "@/components/ui/tag"
import { BentoCard } from "@/components/ui/bento-card"
import { CAREER_OPENINGS, CAREERS_CULTURE } from "@/lib/content/site"

export function CareersSection() {
  return (
    <section id="careers" className="py-32 px-6 md:px-12 lg:px-20 border-t border-white/[0.08]">
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12">
        <div>
          <Tag>CAREERS</Tag>
          <h2 className="mt-5 text-4xl md:text-5xl font-light tracking-tight leading-[1.05] mb-8">
            Join a Team That<br />Only Does Microsoft.
          </h2>
          <ul className="space-y-3">
            {CAREERS_CULTURE.map((c) => (
              <li key={c} className="flex gap-3 text-sm text-white/55 leading-relaxed">
                <div className="w-1 h-1 rounded-full bg-blue-400/50 shrink-0 mt-2" />
                {c}
              </li>
            ))}
          </ul>
        </div>

        <div className="flex flex-col gap-3">
          {CAREER_OPENINGS.map((o) => (
            <BentoCard key={o.title} className="p-6 flex items-center justify-between gap-4 flex-wrap">
              <div>
                <h3 className="text-base font-light mb-1">{o.title}</h3>
                <span className="text-xs text-white/40 tracking-wide">{o.location}</span>
              </div>
              <Tag>{o.type}</Tag>
            </BentoCard>
          ))}
          <a
            href="mailto:help@mstack360.com?subject=Careers%20at%20MStack360"
            className="mt-2 text-center px-6 py-3 border border-white/15 text-white/75 text-sm rounded-xl hover:border-blue-500/40 hover:text-white hover:bg-white/[0.05] transition-all tracking-wide font-medium"
          >
            Don&apos;t see your role? Reach out anyway
          </a>
        </div>
      </div>
    </section>
  )
}
