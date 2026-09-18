import Link from "next/link"
import { HERO_STATS } from "@/lib/content/site"

// A calm, static hero — no three.js backdrop, no scroll-triggered reveals.
// One headline, one sentence of proof, two calls to action, three numbers.
// Everything a first-time visitor needs to decide whether to keep scrolling
// is visible in the first screen, on any device, on first paint.
export function DemoHero() {
  return (
    <section id="top" className="relative overflow-hidden border-b border-border">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 -z-0 h-[520px] opacity-70"
        style={{
          background:
            "radial-gradient(60% 60% at 50% 0%, oklch(0.546 0.214 259.815 / 0.16), transparent 70%)",
        }}
      />

      <div className="relative mx-auto w-full max-w-4xl px-6 pb-20 pt-16 text-center md:px-10 md:pb-28 md:pt-24">
        <span className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3.5 py-1.5 text-xs font-medium text-muted-foreground">
          <span className="h-1.5 w-1.5 rounded-full bg-primary" aria-hidden="true" />
          Microsoft 365 consulting, done properly
        </span>

        <h1 className="mt-6 text-[2.5rem] font-semibold leading-[1.1] tracking-tight text-foreground sm:text-5xl md:text-6xl">
          We fix what&apos;s broken in your
          <span className="text-primary"> Microsoft 365.</span>
        </h1>

        <p className="mx-auto mt-6 max-w-xl text-base leading-relaxed text-muted-foreground md:text-lg">
          Wasted licences, weak security, and manual work — sorted inside the
          stack you already pay for. No new platform, no third-party sprawl.
        </p>

        <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link
            href="/contact"
            className="inline-flex w-full items-center justify-center rounded-full bg-primary px-6 py-3 text-sm font-medium text-primary-foreground transition-transform hover:scale-[1.02] active:scale-[0.98] sm:w-auto"
          >
            Book a free health check
          </Link>
          <a
            href="#solve"
            className="inline-flex w-full items-center justify-center rounded-full border border-border px-6 py-3 text-sm font-medium text-foreground transition-colors hover:bg-accent/60 sm:w-auto"
          >
            See what we solve
          </a>
        </div>

        <dl className="mx-auto mt-14 grid max-w-xl grid-cols-2 gap-6 sm:grid-cols-4">
          {HERO_STATS.map((stat) => (
            <div key={stat.label}>
              <dd className="text-2xl font-semibold tracking-tight text-foreground md:text-3xl">
                {stat.value}
              </dd>
              <dt className="mt-1 text-[11px] uppercase tracking-wide text-muted-foreground">
                {stat.label}
              </dt>
            </div>
          ))}
        </dl>
      </div>
    </section>
  )
}
