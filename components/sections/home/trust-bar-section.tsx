import Link from "next/link"
import { AppLogo } from "@/components/ui/app-logo"
import { APP_LOGOS, STACK_LOGOS } from "@/lib/content/app-logos"

const PROOF = [
  { value: "500+", label: "Clients served" },
  { value: "★★★★★", label: "Google reviews" },
  { value: "10+", label: "Years on Microsoft 365" },
]

// Credibility strip directly under the hero — the first thing a visitor sees
// after the pitch is evidence, before any ask. Server component; the marquee
// is a CSS keyframe (see globals.css), so it animates with no JavaScript.
export function TrustBarSection() {
  return (
    <section className="border-t border-white/[0.08] overflow-hidden">
      <div className="max-w-6xl mx-auto px-6 md:px-12 lg:px-20 py-10 flex flex-col lg:flex-row lg:items-center gap-8 lg:gap-14">
        <dl className="flex items-center gap-8 shrink-0">
          {PROOF.map((p) => (
            <div key={p.label}>
              <dd className="text-lg font-light text-blue-300/90 font-ibm-plex leading-none">{p.value}</dd>
              <dt className="mt-1.5 text-[11px] text-white/40 tracking-wide">{p.label}</dt>
            </div>
          ))}
        </dl>

        <p className="text-sm text-white/45 leading-relaxed lg:flex-1">
          A Microsoft-native partner — we work only in the stack you already pay for.{" "}
          <Link href="/case-studies" className="text-blue-300/80 hover:text-blue-300 transition-colors">
            See the results →
          </Link>
        </p>
      </div>

      {/* Technology marquee — the marks plus their names, so the stack is
          recognisable at a glance and still readable. Decorative: the same
          products are named in full on the service cards below. */}
      <div
        className="flex border-t border-white/[0.08] py-4 select-none"
        style={{ animation: "marqueeLeft 40s linear infinite" }}
        aria-hidden="true"
      >
        {[...Array(3)].map((_, rep) => (
          <div key={rep} className="flex shrink-0">
            {STACK_LOGOS.map((slug) => (
              <span
                key={`${rep}-${slug}`}
                className="px-7 flex items-center gap-2.5 whitespace-nowrap"
              >
                <AppLogo slug={slug} size={22} />
                <span className="text-xs text-white/30 tracking-widest">{APP_LOGOS[slug].name}</span>
              </span>
            ))}
          </div>
        ))}
      </div>
    </section>
  )
}
