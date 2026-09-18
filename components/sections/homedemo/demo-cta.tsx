import Link from "next/link"
import { HEALTH_CHECK_DELIVERABLES } from "@/lib/content/site"

// The single conversion offer on the page. Deliberately concrete — a
// 15-minute call and a written summary, not "get in touch".
export function DemoCta() {
  return (
    <section className="px-6 py-20 md:px-10 md:py-28">
      <div className="mx-auto w-full max-w-3xl rounded-3xl border border-border bg-card px-6 py-12 text-center sm:px-12 sm:py-16">
        <p className="text-xs font-medium uppercase tracking-[0.2em] text-primary">Free · 15 minutes</p>
        <h2 className="mt-3 text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
          Get your Microsoft 365 health check.
        </h2>

        <ul className="mx-auto mt-7 max-w-md space-y-2.5 text-left">
          {HEALTH_CHECK_DELIVERABLES.map((item) => (
            <li key={item} className="flex items-start gap-2.5 text-sm text-muted-foreground">
              <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" aria-hidden="true" />
              {item}
            </li>
          ))}
        </ul>

        <Link
          href="/contact"
          className="mt-8 inline-flex items-center justify-center rounded-full bg-primary px-7 py-3 text-sm font-medium text-primary-foreground transition-transform hover:scale-[1.02] active:scale-[0.98]"
        >
          Book my free call
        </Link>
      </div>
    </section>
  )
}
