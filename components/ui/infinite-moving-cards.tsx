import { AppLogo } from "@/components/ui/app-logo"
import type { AppLogoSlug } from "@/lib/content/app-logos"
import motion from "@/components/ui/motion.module.css"

// ── Infinite moving cards ───────────────────────────────────────────────────
//
// Aceternity's component, rebuilt on the marquee this project already has.
//
// Three changes, all of them removing machinery rather than adding it:
//
//   No effect, no state, no client boundary. The original mounts, walks the
//   rendered <li>s, `cloneNode`s each one back into the list, then flips a
//   `start` flag to switch the animation on. That is a server-rendered list
//   being duplicated imperatively after paint — it renders nothing on the
//   server, jumps when the clones land, and appends a second set of clones
//   under React 19 StrictMode, which invokes the effect twice. The copies are
//   in the markup here instead, which is what they always were.
//
//   The keyframe is the one in globals.css that the technology strip already
//   uses: three copies translated by a third. Reusing it means this inherits
//   the `[style*="marqueeLeft"]` reduced-motion rule that is already there —
//   a reader who has asked for stillness gets a static row of cards, not a
//   marquee that ignores them.
//
//   `speed` is seconds rather than fast/normal/slow. The original's "fast" is
//   20s for the whole loop, which on cards of real copy is faster than anyone
//   reads; naming the number makes that a decision instead of a default.
//
// The strip is decorative *as a strip* — the same cards, three times over —
// so the copies are hidden from assistive tech and the first set carries the
// label.

export type MovingCard = {
  id: string
  quote: string
  name: string
  /** Small right-hand label — a topic, a role, a sector. */
  meta?: string
  logo?: AppLogoSlug
}

export function InfiniteMovingCards({
  items,
  ariaLabel,
  /** Seconds for one full pass. Longer is slower. */
  speed = 90,
  direction = "left",
  className = "",
}: {
  items: MovingCard[]
  ariaLabel: string
  speed?: number
  direction?: "left" | "right"
  className?: string
}) {
  if (items.length === 0) return null

  return (
    // Pausing under the pointer is the piece of the original's behaviour that
    // matters most here: a card that cannot be stopped cannot be finished.
    //
    // It has to travel as a custom property rather than as the obvious
    // `hover:[animation-play-state:paused]` on the strip. The `animation`
    // shorthand is set inline (the duration is a prop), an inline declaration
    // outranks any class, and the shorthand resets play-state — so the class
    // would lose every time. A variable set by the class and read by the
    // inline style has no such contest: it resolves before the cascade ever
    // compares the two.
    <div
      className={`${motion.marqueeMask} relative overflow-hidden hover:[--marquee-play:paused] ${className}`}
    >
      <div
        className="flex w-max gap-4"
        style={{
          animation: `marqueeLeft ${speed}s linear infinite`,
          animationDirection: direction === "right" ? "reverse" : undefined,
          animationPlayState: "var(--marquee-play, running)",
        }}
      >
        {[0, 1, 2].map((copy) => (
          <ul
            key={copy}
            className="flex shrink-0 gap-4"
            aria-label={copy === 0 ? ariaLabel : undefined}
            aria-hidden={copy === 0 ? undefined : true}
          >
            {items.map((item) => (
              <li
                key={`${copy}-${item.id}`}
                className="flex w-[300px] shrink-0 flex-col gap-4 rounded-2xl border border-white/[0.07] bg-[linear-gradient(180deg,#0E1424_0%,#0A0F1B_100%)] p-6 transition-colors duration-300 hover:border-blue-400/20 sm:w-[360px]"
              >
                <p className="flex-1 text-[0.9375rem] leading-[1.75] text-white/55">
                  <span aria-hidden="true" className="mr-1 text-white/20">
                    &ldquo;
                  </span>
                  {item.quote}
                  <span aria-hidden="true" className="ml-0.5 text-white/20">
                    &rdquo;
                  </span>
                </p>

                <div className="flex items-center gap-2.5 border-t border-white/[0.06] pt-4">
                  {item.logo ? <AppLogo slug={item.logo} size={20} /> : null}
                  <span className="text-[0.8125rem] font-light text-white/75">{item.name}</span>
                  {item.meta ? (
                    <span className="ml-auto text-[10px] uppercase tracking-[0.15em] text-white/35">
                      {item.meta}
                    </span>
                  ) : null}
                </div>
              </li>
            ))}
          </ul>
        ))}
      </div>
    </div>
  )
}
