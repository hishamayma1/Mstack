import { SectionHeader } from "@/components/ui/section-header"
import { bandRangeLabel, formatMoney, type ServicePricing } from "@/lib/pricing"

// The whole ladder, laid out. The configurator above already tells a visitor
// what *they* pay; this answers the next question — what happens when they
// grow — which is the objection that otherwise arrives on the first call.
export function ServiceBandsSection({ pricing }: { pricing: ServicePricing }) {
  // Nothing meaningful to show for a price-on-application service, or one
  // whose bands an editor hasn't filled in yet.
  if (pricing.mode === "quote" || pricing.bands.length === 0) return null

  return (
    <section id="pricing" className="py-28 px-6 md:px-12 lg:px-20 border-t border-border">
      <div className="max-w-6xl mx-auto">
        <SectionHeader
          eyebrow="PRICE BANDS"
          title={"The Rate Falls\nAs You Grow."}
          intro="You move between bands automatically as your headcount changes — there's no renegotiation and no penalty for growing mid-term."
        />

        <div className="overflow-x-auto -mx-6 px-6 md:mx-0 md:px-0">
          <table className="w-full min-w-[520px] border-collapse text-left">
            <thead>
              <tr className="border-b border-border">
                <th className="py-4 pr-6 text-[11px] uppercase tracking-widest text-muted-foreground font-normal">
                  Band
                </th>
                <th className="py-4 pr-6 text-[11px] uppercase tracking-widest text-muted-foreground font-normal">
                  Headcount
                </th>
                <th className="py-4 text-right text-[11px] uppercase tracking-widest text-muted-foreground font-normal">
                  Per user / month
                </th>
              </tr>
            </thead>
            <tbody>
              {pricing.bands.map((band) => (
                <tr
                  key={`${band.minSeats}-${band.maxSeats ?? "plus"}`}
                  className="border-b border-border"
                >
                  <td className="py-5 pr-6 text-sm text-foreground">{band.label}</td>
                  <td className="py-5 pr-6 text-sm text-muted-foreground tabular-nums whitespace-nowrap">
                    {bandRangeLabel(band)}
                  </td>
                  <td className="py-5 text-right text-lg font-light tabular-nums whitespace-nowrap">
                    {formatMoney(band.pricePerSeat, pricing.currency)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {pricing.setupFee > 0 ? (
          <p className="mt-6 text-sm text-muted-foreground leading-relaxed max-w-2xl">
            A one-time onboarding fee of{" "}
            <span className="text-foreground/70">{formatMoney(pricing.setupFee, pricing.currency)}</span>{" "}
            covers the initial build and handover
            {pricing.setupFeeWaivedAtSeats !== null
              ? `, waived entirely at ${pricing.setupFeeWaivedAtSeats} users and above.`
              : "."}
          </p>
        ) : null}
      </div>
    </section>
  )
}
