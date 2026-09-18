import { PROCESS_STEPS } from "@/lib/content/site"

// A plain numbered row instead of a connected timeline graphic — five steps
// read fine as a list, and it removes every point where a connector line has
// to be redrawn per breakpoint.
export function DemoProcess() {
  return (
    <section id="process" className="border-b border-border bg-card/40 px-6 py-20 md:px-10 md:py-28">
      <div className="mx-auto w-full max-w-6xl">
        <div className="max-w-xl">
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-primary">How it works</p>
          <h2 className="mt-3 text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
            Five steps, no surprises.
          </h2>
        </div>

        <ol className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-5">
          {PROCESS_STEPS.map((step) => (
            <li key={step.n} className="rounded-2xl border border-border bg-background p-5">
              <span className="text-2xl font-semibold text-primary/40">{step.n}</span>
              <p className="mt-3 text-[15px] font-medium text-foreground">{step.title}</p>
              <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{step.desc}</p>
              <p className="mt-3 text-xs font-medium uppercase tracking-wide text-muted-foreground/80">
                {step.signal}
              </p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
