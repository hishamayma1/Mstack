import { TESTIMONIALS } from "@/lib/content/site"
import { AppLogoRow } from "@/components/ui/app-logo"

const STACK_SLUGS = ["teams", "sharepoint", "onedrive", "outlook", "entra", "defender", "copilot"] as const

// One quote, held still, next to the product marks — proof and platform in
// the same glance rather than a scrolling wall of six.
export function DemoProof() {
  const quote = TESTIMONIALS[0]

  return (
    <section id="proof" className="border-b border-border px-6 py-20 md:px-10 md:py-28">
      <div className="mx-auto grid w-full max-w-6xl gap-10 lg:grid-cols-2 lg:items-center lg:gap-16">
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-primary">Proof</p>
          <blockquote className="mt-4 text-xl font-medium leading-snug tracking-tight text-foreground sm:text-2xl">
            &ldquo;{quote.quote}&rdquo;
          </blockquote>
          <p className="mt-4 text-sm text-muted-foreground">— {quote.name}</p>
        </div>

        <div className="rounded-2xl border border-border bg-card p-6 md:p-8">
          <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">We work exclusively in</p>
          <AppLogoRow slugs={[...STACK_SLUGS]} size={32} title="The Microsoft products we work in" className="mt-4 gap-4" />
          <p className="mt-6 text-sm leading-relaxed text-muted-foreground">
            100% Microsoft native — no third-party platforms bolted on, nothing extra to license or secure.
          </p>
        </div>
      </div>
    </section>
  )
}
