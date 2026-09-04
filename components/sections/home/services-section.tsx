import Link from "next/link"
import { Section, SectionIntro, Chevron } from "@/components/ui/section"
import { StickyScroll, type StickyScrollItem } from "@/components/ui/sticky-scroll"
import { LEVEL_LOGOS } from "@/lib/content/app-logos"
import { formatMoney } from "@/lib/pricing"
import type { ServiceCard } from "@/lib/cms/services"

// The five service levels, as the homepage shows them.
//
// /solutions still renders ServiceLevelsSection — the full card treatment,
// with highlights, "best for" and a build-plan link, which is right on a page
// someone landed on to compare. On the homepage this was a hairline row list:
// correct about the progression, but it gave the five levels nothing to look
// at, and the products each one deploys were reduced to a row of 20px marks
// nobody could read.
//
// A sticky scroll reveal fixes exactly that. The levels stay a sequence — you
// still walk 01 through 05 in order — but the level you are standing on gets a
// panel of its own, at a size where the Microsoft products it deploys are
// named and legible. Below `lg` it degrades to the same ordered list with each
// level's detail inline; see components/ui/sticky-scroll.tsx.
//
// Levels arrive as a prop — the page already fetches services, so this
// component does no data access of its own.
export function HomeServicesSection({ levels }: { levels: ServiceCard[] }) {
  if (levels.length === 0) return null

  const items: StickyScrollItem[] = levels.map((level, i) => ({
    id: level.id,
    index: String(i + 1).padStart(2, "0"),
    title: level.title,
    desc: level.summary,
    logos: LEVEL_LOGOS[level.title],
    href: `/solutions/${level.slug}`,
    cta: `Explore ${level.title}`,
    meta:
      level.fromPricePerSeat !== null ? (
        <>
          from{" "}
          <span className="font-ibm-plex text-[0.9375rem] text-foreground/85">
            {formatMoney(level.fromPricePerSeat, level.currency)}
          </span>
          <span className="text-muted-foreground"> per user / month</span>
        </>
      ) : (
        "Priced on application"
      ),
  }))

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
          className="group inline-flex shrink-0 items-center gap-2 text-[0.875rem] tracking-wide text-blue-600 dark:text-blue-300/85 transition-colors hover:text-blue-500 dark:hover:text-blue-300"
        >
          Compare all levels
          <Chevron className="transition-transform group-hover:translate-x-0.5" />
        </Link>
      </div>

      <div className="mt-12 md:mt-16">
        <StickyScroll items={items} ariaLabel="Service levels" />
      </div>

      <p className="mt-12 max-w-3xl text-[0.875rem] leading-[1.7] text-muted-foreground">
        All five levels are available as ongoing support models. We don&apos;t implement and leave —
        we support your full Microsoft 365 environment continuously, across every level, at the same
        time.
      </p>
    </Section>
  )
}
