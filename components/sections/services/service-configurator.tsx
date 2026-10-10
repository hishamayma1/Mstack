"use client"

import {
  useActionState,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
} from "react"
import { Tag } from "@/components/ui/tag"
import {
  buildQuote,
  clampSeats,
  formatMoney,
  type ServiceOption,
  type ServicePricing,
} from "@/lib/pricing"
import { submitServiceRequest } from "@/app/(frontend)/solutions/[slug]/actions"
import { INITIAL_SUBMIT_STATE, type SubmitState } from "@/lib/service-request-state"
import styles from "./service-configurator.module.css"

// The one client component on a service page. Everything above and below it
// is server-rendered, so the interactivity cost is scoped to this section.
//
// The quote shown here is computed by the same lib/pricing.ts the server
// action runs at submit — the client copy exists purely so the number moves
// with the slider instead of after a round trip. The stored figure is always
// the server's.

const START_OPTIONS = [
  { value: "asap", label: "As soon as possible" },
  { value: "1-3-months", label: "Within 1–3 months" },
  { value: "3-6-months", label: "In 3–6 months" },
  { value: "exploring", label: "Just exploring" },
] as const

function optionSuffix(option: ServiceOption, pricing: ServicePricing): string {
  if (pricing.mode === "quote") return "Included in scope"
  switch (option.priceType) {
    case "per-seat-monthly":
      return `+${formatMoney(option.amount, pricing.currency)} / user / mo`
    case "monthly-flat":
      return `+${formatMoney(option.amount, pricing.currency)} / mo`
    case "one-time":
      return `+${formatMoney(option.amount, pricing.currency)} one-time`
  }
}

export function ServiceConfigurator({
  slug,
  serviceTitle,
  pricing,
}: {
  slug: string
  serviceTitle: string
  pricing: ServicePricing
}) {
  const [seats, setSeats] = useState(pricing.defaultSeats)
  const [selectedIds, setSelectedIds] = useState<string[]>(() =>
    pricing.options.filter((option) => option.defaultSelected).map((option) => option.id),
  )

  const [state, formAction, pending] = useActionState<SubmitState, FormData>(
    // The slug is bound rather than sent as a hidden input, so the service a
    // request is filed against can't be swapped by editing the form.
    submitServiceRequest.bind(null, slug),
    INITIAL_SUBMIT_STATE,
  )

  const fieldId = useId()
  const confirmationRef = useRef<HTMLDivElement>(null)

  // On success the form (roughly a screen and a half of slider, options and
  // fields) is replaced by a short confirmation panel. The page collapses
  // underneath the scroll position, so a visitor who submitted from the bottom
  // of the form is left looking at the FAQ with no sign anything happened.
  // Pull the confirmation back into view.
  useEffect(() => {
    if (state.status !== "success") return
    confirmationRef.current?.scrollIntoView({ block: "center", behavior: "smooth" })
  }, [state.status])

  const quote = useMemo(() => buildQuote(pricing, seats, selectedIds), [pricing, seats, selectedIds])
  const priced = !quote.quoteOnly

  // Percentage along the track, for the CSS gradient fill. Guarded against a
  // zero-width range (min === max), which would otherwise divide by zero.
  const span = pricing.maxSeats - pricing.minSeats
  const fillPercent = span > 0 ? ((quote.seats - pricing.minSeats) / span) * 100 : 100

  function toggleOption(id: string) {
    setSelectedIds((current) =>
      current.includes(id) ? current.filter((value) => value !== id) : [...current, id],
    )
  }

  if (state.status === "success") {
    return (
      <section id="configure" className="py-24 px-6 md:px-12 lg:px-20 border-t border-border">
        <div
          ref={confirmationRef}
          // Announced to screen readers, which otherwise get no signal that the
          // form they submitted has been replaced by a confirmation.
          role="status"
          aria-live="polite"
          className="max-w-2xl mx-auto text-center rounded-2xl border border-svc/25 bg-svc/[0.06] p-10 md:p-14"
        >
          <div
            aria-hidden="true"
            className="mx-auto mb-6 h-12 w-12 rounded-full border border-svc/40 bg-svc/15 flex items-center justify-center text-svc-ink text-xl"
          >
            ✓
          </div>
          <h2 className="text-3xl font-light tracking-tight">Request received.</h2>
          <p className="mt-4 text-sm text-muted-foreground leading-relaxed">
            Your {serviceTitle} configuration for {quote.seats}{" "}
            {quote.seats === 1 ? "user" : "users"} is with our team. We&apos;ll review it and come
            back to you — usually within one working day — with a firm proposal.
          </p>
          <p className="mt-6 text-xs text-muted-foreground tracking-wide">
            Nothing has been charged. This is a quote request, not an order.
          </p>
        </div>
      </section>
    )
  }

  return (
    <section id="configure" className="py-24 px-6 md:px-12 lg:px-20 border-t border-border">
      <div className="max-w-6xl mx-auto">
        <div className="mb-12 max-w-2xl">
          <Tag>BUILD YOUR PLAN</Tag>
          <h2 className="mt-5 text-4xl md:text-5xl font-light tracking-tight leading-[1.05]">
            Size it to your team.
          </h2>
          <p className="mt-5 text-sm text-muted-foreground leading-relaxed">
            {priced
              ? "Set your headcount, pick the options you need, and see what it costs. No account, no card — you'll get a firm proposal from a human."
              : "Tell us your headcount and what's in scope. This engagement is priced individually, so we'll come back with a figure rather than guess at one here."}
          </p>
        </div>

        <form action={formAction} className="grid grid-cols-1 lg:grid-cols-[1.25fr_1fr] gap-6 items-start">
          {/* Seats and options travel with the submission as real form fields,
              so the request records exactly what was on screen. */}
          <input type="hidden" name="seats" value={quote.seats} />

          {/* ── Left: what they're configuring ───────────────────────────── */}
          <div className="flex flex-col gap-6">
            <div className="rounded-2xl border border-border bg-card p-8">
              <div className="flex items-end justify-between gap-4 mb-8">
                <div>
                  <label
                    htmlFor={`${fieldId}-seats`}
                    className="text-xs uppercase tracking-widest text-muted-foreground block mb-2"
                  >
                    How many people?
                  </label>
                  <p className="text-xs text-muted-foreground leading-relaxed max-w-xs">
                    Everyone who needs a Microsoft 365 account — including part-time staff and
                    shared devices.
                  </p>
                </div>
                <div className="text-right shrink-0">
                  <span
                    key={quote.seats}
                    className={`${styles.totalPulse} block text-4xl font-light tabular-nums leading-none`}
                  >
                    {quote.seats}
                  </span>
                  <span className="text-[11px] text-muted-foreground tracking-widest">USERS</span>
                </div>
              </div>

              <input
                id={`${fieldId}-seats`}
                type="range"
                min={pricing.minSeats}
                max={pricing.maxSeats}
                step={1}
                value={quote.seats}
                onChange={(event) => setSeats(Number(event.target.value))}
                className={styles.slider}
                style={{ "--fill": `${fillPercent}%` } as CSSProperties}
                aria-valuetext={`${quote.seats} users`}
              />

              <div className="mt-3 flex items-center justify-between text-[11px] text-muted-foreground tabular-nums">
                <span>{pricing.minSeats}</span>
                <span>{pricing.maxSeats}+</span>
              </div>

              {/* A number field beside the slider, because dragging to an exact
                  headcount at the top of a 500-seat range is unreasonable. */}
              <div className="mt-6 pt-6 border-t border-border flex items-center gap-3">
                <label htmlFor={`${fieldId}-seats-exact`} className="text-xs text-muted-foreground">
                  Or type it exactly
                </label>
                <input
                  id={`${fieldId}-seats-exact`}
                  type="number"
                  inputMode="numeric"
                  min={pricing.minSeats}
                  max={pricing.maxSeats}
                  value={seats}
                  onChange={(event) => setSeats(Number(event.target.value))}
                  // Clamping on blur rather than on change lets someone clear
                  // the field and retype without it fighting them mid-edit.
                  onBlur={() => setSeats((current) => clampSeats(pricing, current))}
                  className="w-24 px-3 py-2 rounded-lg bg-accent/40 border border-border text-sm text-foreground tabular-nums focus:border-svc/50 focus:outline-none transition-colors"
                />
                {priced && quote.band ? (
                  <span className="ml-auto text-[11px] text-svc-ink tracking-wide">
                    {quote.band.label} band
                  </span>
                ) : null}
              </div>
            </div>

            {pricing.options.length > 0 ? (
              <div className="rounded-2xl border border-border bg-card p-8">
                <h3 className="text-xs uppercase tracking-widest text-muted-foreground mb-1">
                  {priced ? "Add to your plan" : "What's in scope"}
                </h3>
                <p className="text-xs text-muted-foreground mb-6">
                  {priced
                    ? "Optional — tick what applies and the estimate updates."
                    : "Tick everything that applies so we scope it accurately."}
                </p>

                <div className="flex flex-col gap-2">
                  {pricing.options.map((option) => {
                    const checked = selectedIds.includes(option.id)
                    return (
                      <label
                        key={option.id}
                        className={`flex gap-4 p-4 rounded-xl border cursor-pointer transition-colors ${
                          checked
                            ? "border-svc/40 bg-svc/[0.07]"
                            : "border-border bg-card hover:border-foreground/20"
                        }`}
                      >
                        <input
                          type="checkbox"
                          name="options"
                          value={option.id}
                          checked={checked}
                          onChange={() => toggleOption(option.id)}
                          className="mt-1 h-4 w-4 shrink-0 accent-(--svc)"
                        />
                        <span className="flex-1 min-w-0">
                          <span className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                            <span className="text-sm text-foreground">{option.name}</span>
                            <span className="text-[11px] text-svc-ink tracking-wide whitespace-nowrap">
                              {optionSuffix(option, pricing)}
                            </span>
                          </span>
                          <span className="block mt-1.5 text-xs text-muted-foreground leading-relaxed">
                            {option.description}
                          </span>
                        </span>
                      </label>
                    )
                  })}
                </div>
              </div>
            ) : null}
          </div>

          {/* ── Right: the quote and the details we need to send it ───────── */}
          <div className={styles.stickyPanel}>
            <div className="relative rounded-2xl border border-svc/25 bg-card overflow-hidden shadow-[0_24px_60px_-30px_var(--svc)]">
              <span
                aria-hidden="true"
                className="pointer-events-none absolute inset-x-0 top-0 h-1 bg-linear-to-r from-svc to-svc-2"
              />
              <div className="p-8 border-b border-border">
                <span className="text-xs uppercase tracking-widest text-muted-foreground">
                  {priced ? "Your estimate" : "Your request"}
                </span>

                {priced ? (
                  <>
                    <div className="mt-5 flex flex-col gap-2">
                      {quote.lines.map((line, index) => (
                        <div
                          key={`${line.label}-${index}`}
                          className="flex items-baseline justify-between gap-4 text-xs"
                        >
                          <span className="text-muted-foreground min-w-0">
                            {line.label}
                            <span className="block text-muted-foreground mt-0.5">{line.detail}</span>
                          </span>
                          <span className="text-foreground/70 tabular-nums whitespace-nowrap">
                            {formatMoney(
                              line.monthly > 0 ? line.monthly : line.oneTime,
                              pricing.currency,
                            )}
                            {line.monthly > 0 ? "/mo" : ""}
                          </span>
                        </div>
                      ))}
                    </div>

                    <div className="mt-6 pt-6 border-t border-border">
                      <div className="flex items-baseline justify-between gap-4">
                        <span className="text-sm text-muted-foreground">Monthly</span>
                        <span
                          key={quote.monthlyTotal}
                          className={`${styles.totalPulse} text-3xl font-light tabular-nums`}
                        >
                          {formatMoney(quote.monthlyTotal, pricing.currency)}
                        </span>
                      </div>
                      {quote.oneTimeTotal > 0 ? (
                        <div className="mt-3 flex items-baseline justify-between gap-4">
                          <span className="text-sm text-muted-foreground">One-time</span>
                          <span
                            key={quote.oneTimeTotal}
                            className={`${styles.totalPulse} text-xl font-light tabular-nums text-foreground/80`}
                          >
                            {formatMoney(quote.oneTimeTotal, pricing.currency)}
                          </span>
                        </div>
                      ) : null}
                    </div>
                  </>
                ) : (
                  <p className="mt-4 text-sm text-muted-foreground leading-relaxed">
                    Priced individually. Send us the configuration and we&apos;ll come back with a
                    firm figure — usually within one working day.
                  </p>
                )}

                {pricing.billingNote ? (
                  <p className="mt-5 text-[11px] text-muted-foreground leading-relaxed">
                    {pricing.billingNote}
                  </p>
                ) : null}
              </div>

              {/* ── Contact details ───────────────────────────────────────── */}
              <div className="p-8 flex flex-col gap-4">
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Where should we send the proposal?
                </p>

                <Field
                  id={`${fieldId}-fullName`}
                  name="fullName"
                  label="Full name"
                  required
                  autoComplete="name"
                  error={state.fieldErrors.fullName}
                />
                <Field
                  id={`${fieldId}-workEmail`}
                  name="workEmail"
                  label="Work email"
                  type="email"
                  required
                  autoComplete="email"
                  error={state.fieldErrors.workEmail}
                />
                <Field
                  id={`${fieldId}-companyName`}
                  name="companyName"
                  label="Company"
                  required
                  autoComplete="organization"
                  error={state.fieldErrors.companyName}
                />
                <Field
                  id={`${fieldId}-jobTitle`}
                  name="jobTitle"
                  label="Job title"
                  autoComplete="organization-title"
                />
                <Field
                  id={`${fieldId}-phone`}
                  name="phone"
                  label="Phone"
                  type="tel"
                  autoComplete="tel"
                />

                <div className="flex flex-col gap-1.5">
                  <label
                    htmlFor={`${fieldId}-preferredStart`}
                    className="text-[11px] uppercase tracking-widest text-muted-foreground"
                  >
                    Timeline
                  </label>
                  <select
                    id={`${fieldId}-preferredStart`}
                    name="preferredStart"
                    defaultValue="1-3-months"
                    className="px-3.5 py-2.5 rounded-lg bg-accent/40 border border-border text-sm text-foreground focus:border-svc/50 focus:outline-none transition-colors"
                  >
                    {START_OPTIONS.map((option) => (
                      <option key={option.value} value={option.value} className="bg-card">
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label
                    htmlFor={`${fieldId}-message`}
                    className="text-[11px] uppercase tracking-widest text-muted-foreground"
                  >
                    Anything we should know?
                  </label>
                  <textarea
                    id={`${fieldId}-message`}
                    name="message"
                    rows={3}
                    placeholder="Current setup, deadlines, anything unusual…"
                    className="px-3.5 py-2.5 rounded-lg bg-accent/40 border border-border text-sm text-foreground placeholder:text-muted-foreground focus:border-svc/50 focus:outline-none transition-colors resize-y"
                  />
                </div>

                {/* Honeypot — hidden from people, irresistible to bots. Not
                    `display: none`, which some bots skip; off-screen and
                    removed from the tab order instead. */}
                <div aria-hidden="true" className="absolute left-[-9999px] w-px h-px overflow-hidden">
                  <label htmlFor={`${fieldId}-website`}>Website</label>
                  <input id={`${fieldId}-website`} type="text" name="website" tabIndex={-1} autoComplete="off" />
                </div>

                {state.status === "error" && state.message ? (
                  <p
                    role="alert"
                    className="text-xs text-red-300 bg-red-500/10 border border-red-500/25 rounded-lg px-3.5 py-2.5 leading-relaxed"
                  >
                    {state.message}
                  </p>
                ) : null}

                <button
                  type="submit"
                  disabled={pending}
                  className="mt-1 w-full px-6 py-3.5 bg-linear-to-br from-svc to-svc-2 text-white shadow-[0_10px_30px_-10px_var(--svc)] text-sm rounded-xl transition-[filter] duration-200 hover:brightness-110 active:brightness-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:brightness-100 tracking-widest font-medium"
                >
                  {pending ? "Sending…" : priced ? "Send My Configuration" : "Request a Price"}
                </button>

                <p className="text-[11px] text-muted-foreground leading-relaxed text-center">
                  No payment is taken. A human reviews every request and replies personally.
                </p>
              </div>
            </div>
          </div>
        </form>
      </div>
    </section>
  )
}

function Field({
  id,
  name,
  label,
  type = "text",
  required = false,
  autoComplete,
  error,
}: {
  id: string
  name: string
  label: string
  type?: string
  required?: boolean
  autoComplete?: string
  error?: string
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-[11px] uppercase tracking-widest text-muted-foreground">
        {label}
        {required ? <span className="text-svc-ink/70"> *</span> : null}
      </label>
      <input
        id={id}
        name={name}
        type={type}
        required={required}
        autoComplete={autoComplete}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? `${id}-error` : undefined}
        className={`px-3.5 py-2.5 rounded-lg bg-accent/40 border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none transition-colors ${
          error ? "border-red-500/50" : "border-border focus:border-svc/50"
        }`}
      />
      {error ? (
        <span id={`${id}-error`} className="text-[11px] text-red-300">
          {error}
        </span>
      ) : null}
    </div>
  )
}
