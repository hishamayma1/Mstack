import type { CaseStudyDetail } from "@/lib/cms/case-studies"

// "At a glance" facts and the deployed-tools chips. Returns null when neither
// is filled in, so a study with only the core fields renders a shorter page
// rather than an empty band.
export function CaseStudyFacts({ study }: { study: CaseStudyDetail }) {
  if (study.facts.length === 0 && study.toolsUsed.length === 0) return null

  return (
    <section className="py-16 px-6 md:px-12 lg:px-20 border-t border-border">
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16">
        {study.facts.length > 0 ? (
          <div>
            <h2 className="text-[11px] tracking-widest text-muted-foreground mb-5">AT A GLANCE</h2>
            <dl className="divide-y divide-border border-y border-border">
              {study.facts.map((f) => (
                <div key={f.label} className="flex items-baseline justify-between gap-6 py-3.5">
                  <dt className="text-sm text-muted-foreground">{f.label}</dt>
                  <dd className="text-sm text-foreground/80 text-right">{f.value}</dd>
                </div>
              ))}
            </dl>
          </div>
        ) : null}

        {study.toolsUsed.length > 0 ? (
          <div>
            <h2 className="text-[11px] tracking-widest text-muted-foreground mb-5">WHAT WE DEPLOYED</h2>
            <ul className="flex flex-wrap gap-2">
              {study.toolsUsed.map((t) => (
                <li
                  key={t}
                  className="px-3.5 py-2 rounded-xl border border-border bg-accent/20 text-xs text-muted-foreground tracking-wide"
                >
                  {t}
                </li>
              ))}
            </ul>
          </div>
        ) : null}
      </div>
    </section>
  )
}
