import { AppLogo } from "@/components/ui/app-logo"
import { APP_LOGOS, STACK_LOGOS } from "@/lib/content/app-logos"

// The strip directly under the hero. One job: say what platform we build on,
// and show it.
//
// It used to also repeat three proof figures the hero had already printed
// forty pixels higher ("500+", "10+ years"). Those now live once, in the proof
// band further down, where they have room to be read. What is left is a single
// line of context and the stack itself — which is the pattern every reference
// site uses for the space under a hero.
//
// Server component; the marquee is a CSS keyframe (globals.css), so it
// animates with no JavaScript.
export function TrustBarSection() {
  return (
    <section className="overflow-hidden border-b border-white/[0.06] bg-[#0A0E17]">
      <p className="mx-auto max-w-6xl px-6 py-7 text-center text-[0.8125rem] tracking-wide text-white/40 md:px-10 lg:px-12">
        A Microsoft-native partner — we build only inside the stack you already pay for.
      </p>

      {/* Decorative: every product named here is named again in full on the
          service rows below. */}
      <div
        className="flex select-none border-t border-white/[0.06] py-5"
        style={{ animation: "marqueeLeft 44s linear infinite" }}
        aria-hidden="true"
      >
        {[...Array(3)].map((_, rep) => (
          <div key={rep} className="flex shrink-0">
            {STACK_LOGOS.map((slug) => (
              <span key={`${rep}-${slug}`} className="flex items-center gap-2.5 whitespace-nowrap px-8">
                <AppLogo slug={slug} size={20} />
                <span className="text-[11px] tracking-[0.15em] text-white/25">{APP_LOGOS[slug].name}</span>
              </span>
            ))}
          </div>
        ))}
      </div>
    </section>
  )
}
