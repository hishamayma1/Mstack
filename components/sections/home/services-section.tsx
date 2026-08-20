import Link from "next/link"
import { Section, SectionIntro, Chevron } from "@/components/ui/section"
import { RowList, Row } from "@/components/ui/row-list"
import { AppLogoRow } from "@/components/ui/app-logo"
import { LEVEL_LOGOS } from "@/lib/content/app-logos"
import { formatMoney } from "@/lib/pricing"
import type { ServiceCard } from "@/lib/cms/services"

// The five service levels, as the homepage shows them.
//
// /solutions still renders ServiceLevelsSection — the full card treatment,
// with highlights, "best for" and a build-plan link, which is right on a page
// someone landed on to compare. On the homepage that same grid was five dense
// cards in a three-column layout, so the last row sat half-empty and the eye
// had to compare five things it had no basis to compare yet.
//
// Here they are one ordered list instead: the levels are a *progression*, and
// a numbered list says that in a way a grid cannot. Name, one line, price,
// the products it deploys, and a way through to the page that sells it. This
// is the shape Transparity uses for its service menu.
//
// Levels arrive as a prop — the page already fetches services, so this
// component does no data access of its own.
export function HomeServicesSection({ levels }: { levels: ServiceCard[] }) {
  if (levels.length === 0) return null

  return (
    <Section id="services" tone="raised" size="lg">
      <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <SectionIntro
          eyebrow="Service levels"
          title={"Five levels to\ndigital excellence."}
          lead="A progressive journey from a clean tenant to an automated one. Start where you are — every level has its own page and its own pricing."
        />

        <Link
          href="/solutions"
          className="group inline-flex shrink-0 items-center gap-2 text-[0.875rem] tracking-wide text-blue-300/85 transition-colors hover:text-blue-300"
        >
          Compare all levels
          <Chevron className="transition-transform group-hover:translate-x-0.5" />
        </Link>
      </div>

      <RowList className="mt-12">
        {levels.map((level, i) => (
          <Row
            key={level.id}
            index={String(i + 1).padStart(2, "0")}
            title={level.title}
            desc={level.summary}
            href={`/solutions/${level.slug}`}
            meta={
              <span className="text-[0.8125rem] text-white/40 sm:text-right">
                {level.fromPricePerSeat !== null ? (
                  <>
                    from{" "}
                    <span className="font-ibm-plex text-[0.9375rem] text-white/85">
                      {formatMoney(level.fromPricePerSeat, level.currency)}
                    </span>
                    <span className="block text-[11px] text-white/30">per user / month</span>
                  </>
                ) : (
                  "Priced on application"
                )}
              </span>
            }
          >
            {/* The products this level actually deploys — recognisable before
                the service list is read. */}
            {LEVEL_LOGOS[level.title]?.length ? (
              <AppLogoRow
                slugs={LEVEL_LOGOS[level.title]}
                size={20}
                title={`Products included in ${level.title}`}
                className="mt-4"
              />
            ) : null}
          </Row>
        ))}
      </RowList>

      <p className="mt-8 max-w-3xl text-[0.875rem] leading-[1.7] text-white/40">
        All five levels are available as ongoing support models. We don&apos;t implement and leave —
        we support your full Microsoft 365 environment continuously, across every level, at the same
        time.
      </p>
    </Section>
  )
}
