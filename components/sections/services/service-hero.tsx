import Link from "next/link"
import { RevealText } from "@/components/ui/reveal-text"
import { Tag } from "@/components/ui/tag"
import { ServicePill } from "@/components/ui/service-accent"
import { formatMoney, type Currency } from "@/lib/pricing"
import type { ServiceStat } from "@/lib/cms/services"
import styles from "@/components/sections/shared/page-hero.module.css"

// Server component. Shares the decorative backdrop with PageHero so a service
// page opens the same way every other sub-page does, but carries the extra
// commercial furniture a service needs: a from-price and a jump link straight
// to the configurator.
export function ServiceHero({
  title,
  tagline,
  headline,
  valueProp,
  stats,
  fromPricePerSeat,
  currency,
  kind,
}: {
  title: string
  tagline: string
  headline: string
  valueProp: string
  stats: ServiceStat[]
  fromPricePerSeat: number | null
  currency: Currency
  kind: "level" | "addon"
}) {
  return (
    <section className="relative pt-36 md:pt-44 pb-16 px-6 md:px-12 lg:px-20 overflow-hidden">
      <div className={styles.grid} aria-hidden="true" />
      {/* The page-hero glow, recoloured to this service's accent pair. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-0 bg-[radial-gradient(640px_circle_at_50%_-10%,color-mix(in_oklch,var(--svc)_24%,transparent),transparent_60%),radial-gradient(520px_circle_at_88%_10%,color-mix(in_oklch,var(--svc-2)_18%,transparent),transparent_65%)]"
      />

      <div className="relative z-10 max-w-6xl mx-auto">
        <nav aria-label="Breadcrumb" className="mb-8 text-[11px] tracking-widest text-muted-foreground">
          <Link href="/solutions" className="hover:text-foreground transition-colors">
            SOLUTIONS
          </Link>
          <span className="mx-2" aria-hidden="true">
            /
          </span>
          <span className="text-svc-ink">{title.toUpperCase()}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-[1.3fr_1fr] gap-10 lg:gap-16 items-start">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <ServicePill>
                <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-svc" />
                {kind === "level" ? "SERVICE LEVEL" : "ADD-ON SERVICE"}
              </ServicePill>
              {tagline ? <Tag>{tagline.toUpperCase()}</Tag> : null}
            </div>

            <RevealText
              as="h1"
              className="mt-5 text-5xl md:text-6xl lg:text-7xl font-light tracking-tight leading-[1.05]"
            >
              {headline}
            </RevealText>

            <span
              aria-hidden="true"
              className="mt-7 block h-1 w-24 rounded-full bg-linear-to-r from-svc to-svc-2"
            />

            <p className="mt-6 text-base text-muted-foreground leading-relaxed max-w-xl">{valueProp}</p>

            <div className="mt-9 flex flex-col sm:flex-row gap-3">
              <a
                href="#configure"
                className="px-8 py-3 bg-linear-to-br from-svc to-svc-2 text-white text-sm rounded-xl shadow-[0_10px_30px_-10px_var(--svc)] transition-[filter] duration-200 hover:brightness-110 active:brightness-95 tracking-widest font-medium text-center"
              >
                Build My Plan
              </a>
              <Link
                href="/contact"
                className="px-8 py-3 border border-border text-foreground/75 text-sm rounded-xl hover:border-svc/40 hover:text-foreground hover:bg-svc/[0.06] transition-all tracking-widest font-medium text-center"
              >
                Talk to Someone
              </Link>
            </div>
          </div>

          {/* Price card. Only rendered when there's a real rate to show —
              a "from £0" on a price-on-application service would be a lie. */}
          <div className="relative overflow-hidden rounded-2xl border border-svc/25 bg-card p-8 shadow-[0_24px_60px_-30px_var(--svc)]">
            <span
              aria-hidden="true"
              className="pointer-events-none absolute inset-x-0 top-0 h-1 bg-linear-to-r from-svc to-svc-2"
            />
            {fromPricePerSeat !== null ? (
              <>
                <span className="text-xs uppercase tracking-widest text-muted-foreground">Starting from</span>
                <div className="mt-3 flex items-baseline gap-2">
                  <span className="text-5xl font-light tabular-nums">
                    {formatMoney(fromPricePerSeat, currency)}
                  </span>
                  <span className="text-sm text-muted-foreground">/ user / month</span>
                </div>
                <p className="mt-3 text-xs text-muted-foreground leading-relaxed">
                  The per-user rate falls as your headcount rises. Set yours below to see the exact
                  figure.
                </p>
              </>
            ) : (
              <>
                <span className="text-xs uppercase tracking-widest text-muted-foreground">Pricing</span>
                <div className="mt-3 text-3xl font-light">On application</div>
                <p className="mt-3 text-xs text-muted-foreground leading-relaxed">
                  Scoped individually — configure what you need below and we&apos;ll price it,
                  usually within one working day.
                </p>
              </>
            )}

            {stats.length > 0 ? (
              <div className="mt-7 pt-7 border-t border-border grid grid-cols-3 gap-4">
                {stats.map((stat) => (
                  <div key={stat.label}>
                    <div
                      className="text-xl font-light text-svc-ink"
                    >
                      {stat.value}
                    </div>
                    <div className="mt-1 text-[10px] uppercase tracking-widest text-muted-foreground leading-snug">
                      {stat.label}
                    </div>
                  </div>
                ))}
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  )
}
