// Sticky sub-nav for an industry page. Sits below the fixed site nav and lets
// a visitor jump straight to the part they came for — the toolkit, usually —
// instead of scrolling through five full-height sections to find it.
// Server-rendered: plain anchors, no scroll-spy, so it costs no client JS.
//
// `top-[88px]` clears the fixed MobileNav (top-4, ~52px tall) with room to
// spare; sections carry a matching scroll-margin-top from globals.css.

type NavItem = { id: string; label: string }

export function IndustryPageNav({ items }: { items: NavItem[] }) {
  if (items.length < 2) return null

  return (
    <div className="sticky top-[88px] z-30 px-6 md:px-12 lg:px-20 -mb-4">
      <div className="max-w-6xl mx-auto">
        <nav
          aria-label="On this page"
          className="rounded-2xl border border-white/[0.08] px-3 py-2 flex items-center gap-1 overflow-x-auto"
          style={{
            backdropFilter: "blur(16px)",
            WebkitBackdropFilter: "blur(16px)",
            background: "rgba(16,20,31,0.72)",
          }}
        >
          {items.map((item) => (
            <a
              key={item.id}
              href={`#${item.id}`}
              className="shrink-0 px-3.5 py-1.5 rounded-xl text-[11px] tracking-wide text-white/55 hover:text-white hover:bg-white/[0.06] transition-colors"
            >
              {item.label}
            </a>
          ))}
          <a
            href="#final-cta"
            className="ml-auto shrink-0 px-4 py-1.5 rounded-xl text-[11px] tracking-wide text-blue-300 border border-blue-500/40 hover:text-white hover:border-blue-400 hover:bg-blue-500/20 transition-all"
          >
            BOOK A CALL
          </a>
        </nav>
      </div>
    </div>
  )
}
