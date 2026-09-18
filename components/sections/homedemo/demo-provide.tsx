import Link from "next/link"
import type { ServiceCard } from "@/lib/cms/services"

// The five service levels, as a simple ranked list rather than a card wall —
// they're a progression (start here, move up when the business needs it),
// and a numbered list reads that ordering at a glance in a way five equal
// boxes don't.
export function DemoProvide({ levels }: { levels: ServiceCard[] }) {
  return (
    <section id="provide" className="border-b border-border px-6 py-20 md:px-10 md:py-28">
      <div className="mx-auto w-full max-w-6xl">
        <div className="max-w-xl">
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-primary">What we provide</p>
          <h2 className="mt-3 text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
            Five levels. Start where you are.
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
            Each level builds on the last — from a clean, well-licensed tenant through to a fully automated one.
          </p>
        </div>

        <ol className="mt-10 divide-y divide-border rounded-2xl border border-border bg-card">
          {levels.map((service, i) => (
            <li key={service.id}>
              <Link
                href={`/solutions/${service.slug}`}
                className="group flex flex-col gap-3 px-5 py-5 transition-colors hover:bg-accent/50 sm:flex-row sm:items-center sm:gap-6 sm:px-6"
              >
                <span className="text-sm font-medium text-muted-foreground sm:w-8">
                  {String(i + 1).padStart(2, "0")}
                </span>

                <div className="flex-1">
                  <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                    <span className="text-[15px] font-medium text-foreground">{service.title}</span>
                    {service.tagline ? (
                      <span className="text-sm text-muted-foreground">{service.tagline}</span>
                    ) : null}
                  </div>
                  {service.highlights.length > 0 ? (
                    <p className="mt-1 text-sm text-muted-foreground">
                      {service.highlights.slice(0, 3).join(" · ")}
                    </p>
                  ) : null}
                </div>

                <div className="flex items-center gap-3 sm:shrink-0">
                  {service.fromPricePerSeat != null ? (
                    <span className="text-sm font-medium text-foreground">
                      from £{service.fromPricePerSeat}/seat
                    </span>
                  ) : (
                    <span className="text-sm text-muted-foreground">Quote on request</span>
                  )}
                  <span
                    aria-hidden="true"
                    className="text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-foreground"
                  >
                    →
                  </span>
                </div>
              </Link>
            </li>
          ))}
        </ol>

        <p className="mt-6 text-sm text-muted-foreground">
          Need something specific instead — migration, SharePoint, Teams phone?{" "}
          <Link href="/solutions" className="font-medium text-primary hover:underline">
            See every service
          </Link>
        </p>
      </div>
    </section>
  )
}
