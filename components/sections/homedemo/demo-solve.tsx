const KIND_STYLE = {
  Cost: "text-amber-700 bg-amber-50 border-amber-200 dark:text-amber-300 dark:bg-amber-400/10 dark:border-amber-400/20",
  Risk: "text-rose-700 bg-rose-50 border-rose-200 dark:text-rose-300 dark:bg-rose-400/10 dark:border-rose-400/20",
  Time: "text-blue-700 bg-blue-50 border-blue-200 dark:text-blue-300 dark:bg-blue-400/10 dark:border-blue-400/20",
} as const

// Problem → fix, paired on one card. This is the page's core job: a visitor
// recognises their own situation on the left half of the card, and sees the
// concrete fix on the right half without following a link to find out.
const SOLVE_ITEMS: { kind: keyof typeof KIND_STYLE; problem: string; fix: string }[] = [
  {
    kind: "Cost",
    problem: "Paying for licences nobody uses",
    fix: "We audit every seat and tier, then right-size spend to what's actually switched on.",
  },
  {
    kind: "Risk",
    problem: "Security is whatever the default was",
    fix: "MFA, conditional access and a Zero Trust baseline — set once, enforced everywhere.",
  },
  {
    kind: "Risk",
    problem: "Files scattered across five places",
    fix: "One SharePoint structure with permissions that make sense, and a single version of the truth.",
  },
  {
    kind: "Time",
    problem: "IT support means waiting and hoping",
    fix: "A named team that already knows your tenant, with response times you can hold us to.",
  },
  {
    kind: "Time",
    problem: "The same manual work, every week",
    fix: "Approvals, onboarding and reporting rebuilt as governed Power Automate flows.",
  },
  {
    kind: "Cost",
    problem: "No idea if any of it is working",
    fix: "Adoption numbers and a security score, reviewed with you every quarter.",
  },
]

export function DemoSolve() {
  return (
    <section id="solve" className="border-b border-border bg-card/40 px-6 py-20 md:px-10 md:py-28">
      <div className="mx-auto w-full max-w-6xl">
        <div className="max-w-xl">
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-primary">What we solve</p>
          <h2 className="mt-3 text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
            Six problems almost every tenant has.
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
            Recognise two or three of these? That&apos;s the starting point — and every fix runs on licences you already hold.
          </p>
        </div>

        <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {SOLVE_ITEMS.map((item) => (
            <li
              key={item.problem}
              className="rounded-2xl border border-border bg-background p-5 transition-shadow hover:shadow-md"
            >
              <span
                className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-[10px] font-medium uppercase tracking-wide ${KIND_STYLE[item.kind]}`}
              >
                {item.kind}
              </span>
              <p className="mt-3 text-[15px] font-medium leading-snug text-foreground">{item.problem}</p>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{item.fix}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
