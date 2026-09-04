import Image from "next/image"
import { APP_LOGOS, type AppLogo as AppLogoDef, type AppLogoSlug } from "@/lib/content/app-logos"

// A product logo slot that degrades into a monogram tile.
//
// Set the product's `src` in lib/content/app-logos.ts and the real mark renders
// here; leave it null and you get an accented tile of the same size, so a row of
// logos keeps its rhythm either way. See that file for how to swap one in.

export function AppLogo({
  slug,
  size = 28,
  showName = false,
}: {
  slug: AppLogoSlug
  /** Rendered square size in px. */
  size?: number
  /** Show the product name beside the mark. */
  showName?: boolean
}) {
  const logo: AppLogoDef = APP_LOGOS[slug]
  const box = { width: size, height: size }

  // Widened to AppLogoDef above so the monogram fallback stays reachable to the
  // type checker: APP_LOGOS is `as const`, so once every entry has a literal
  // `src` string, narrowing on it collapses this else branch to `never`.
  const mark = logo.src ? (
    <Image
      src={logo.src}
      alt={showName ? "" : logo.name}
      width={size}
      height={size}
      // The marks are hand-sized SVGs of a few hundred bytes each. Routing
      // them through /_next/image would raster them at every density and, for
      // SVG, needs `images.dangerouslyAllowSVG` turned on globally. Serving
      // them straight out of /public is both smaller and sharper.
      unoptimized
      className="object-contain"
      style={box}
    />
  ) : (
    <span
      role={showName ? undefined : "img"}
      aria-label={showName ? undefined : logo.name}
      className="flex items-center justify-center rounded-[6px] border font-ibm-plex leading-none"
      style={{
        ...box,
        fontSize: Math.max(9, Math.round(size * 0.34)),
        color: `rgba(${logo.accent}, 1)`,
        borderColor: `rgba(${logo.accent}, 0.45)`,
        background: `rgba(${logo.accent}, 0.14)`,
      }}
    >
      {logo.monogram}
    </span>
  )

  if (!showName) return mark

  return (
    <span className="inline-flex items-center gap-2">
      {mark}
      <span className="text-xs text-muted-foreground tracking-wide whitespace-nowrap">{logo.name}</span>
    </span>
  )
}

// A horizontal set of marks — used on the service cards and in the hero
// marquee. `title` names the row for screen readers, since the marks
// themselves are decorative in that context.
export function AppLogoRow({
  slugs,
  size = 26,
  title,
  className = "",
}: {
  slugs: AppLogoSlug[]
  size?: number
  title: string
  className?: string
}) {
  return (
    <ul aria-label={title} className={`flex flex-wrap items-center gap-2 ${className}`}>
      {slugs.map((slug) => (
        <li key={slug} title={APP_LOGOS[slug].name}>
          <AppLogo slug={slug} size={size} />
        </li>
      ))}
    </ul>
  )
}
