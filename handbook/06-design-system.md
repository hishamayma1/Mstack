# 06 · Design System

The visual language of the site: colours, surfaces, type, motion and the components that encode them. **Change the system, not individual pages** — almost every visual decision is a token or a primitive.

---

## 1. Principles

1. **Tokens, not hex codes.** Colours come from CSS variables in `app/(frontend)/globals.css`, exposed to Tailwind as classes (`bg-card`, `text-muted-foreground`, `border-border`). A hard-coded `#2563eb` will look wrong in one of the two themes.
2. **Both themes, always.** Every visual change must be checked in light **and** dark mode.
3. **Tone separates ideas.** Sections are separated by alternating background *tones*, not by borders and headings alone.
4. **Quiet by default, loud on purpose.** Saturated blue (`contrast`) is reserved for the sections that ask for something.
5. **Motion is CSS, never required.** Animations enhance; content is never hidden behind an animation that might not run. Reduced-motion users get the finished state.
6. **Light type, generous space.** Headings use `font-light` with tight tracking; body text is ~15px with relaxed leading.

---

## 2. Colour tokens

Defined in `:root` (light) and `.dark` (dark) in `globals.css`, mapped to Tailwind in the `@theme inline` block.

| Token | Tailwind class | Used for |
|---|---|---|
| `--background` / `--foreground` | `bg-background` / `text-foreground` | Page ground and main text |
| `--card` / `--card-foreground` | `bg-card` | Raised surfaces, cards |
| `--primary` | `bg-primary`, `text-primary` | **The** brand action colour (blue, hue ≈ 260) |
| `--teal` | `text-teal`, `bg-teal` | Secondary accent — alternating icons, second gradient stops |
| `--muted` / `--muted-foreground` | `text-muted-foreground` | Secondary text, captions |
| `--accent` | `bg-accent` | Hover fills, tinted bands |
| `--border` / `--input` / `--ring` | `border-border`, `ring-ring` | Hairlines, inputs, focus rings |
| `--destructive` | `text-destructive` | Errors |
| `--chart-1…5` | `bg-chart-1…` | Data visuals |
| `--glass-bg` / `--glass-border` | `bg-glass`, `border-glass-border` | Frosted nav / dropdowns |
| `--svc` / `--svc-2` / `--svc-ink` | `bg-svc`, `text-svc-ink` | Per-service accent (below) |

Helper variables for hand-written CSS: `--fg-rgb`, `--surface-rgb`, `--accent-soft-rgb`, `--accent-strong-rgb`, `--teal-rgb` (use as `rgb(var(--fg-rgb) / 0.5)`), `--shadow-glass`, `--shadow-dropdown`, `--shadow-fab`.

Light mode has a soft blue/teal **page gradient** (`--page-gradient`); dark mode is flat near-black (`oklch(0.13 0.02 260)`).

Colours are written in **OKLCH** (`oklch(lightness chroma hue)`). To shift the whole brand hue, change the hue (third number) consistently across `--primary`, `--ring`, `--sidebar-primary`, `--chart-1` in both `:root` and `.dark`.

Radius: `--radius: 0.625rem` → `rounded-sm/md/lg/xl`.

---

## 3. Per-service accent themes

Each service page and card wears its own hue so the nine services are distinguishable at a glance.

```tsx
<div data-svc={serviceTheme(service.slug)}>   // e.g. data-svc="emerald"
  <span className="bg-svc text-white" />        // solid accent
  <span className="text-svc-ink" />             // accent as readable text
</div>
```

| Token | Meaning |
|---|---|
| `--svc` | Solid accent: fills, dots, borders, glows |
| `--svc-2` | Partner hue — second stop of gradients |
| `--svc-ink` | Accent as text (darker on light, lighter on dark) |

Available themes: `blue`, `sky`, `emerald`, `violet`, `fuchsia`, `orange`, `rose`, `teal`, `amber` (defined in `globals.css` as `[data-svc='…']` hue/lightness/chroma sets).

**Which service gets which** is decided in `lib/service-theme.ts` (`BY_SLUG`). A new service not in that map gets a stable colour hashed from its slug. To re-colour a service, edit `BY_SLUG`; to add a new hue, add a `[data-svc='name']` rule and add the name to `ServiceTheme` + `THEMES`.

Outside any `data-svc` wrapper, the tokens default to brand blue.

---

## 4. Section tones & sizes

`components/ui/section.tsx` is the structural primitive for page bands.

```tsx
<Section id="process" tone="blue" size="md" aurora={false}>
  <SectionIntro eyebrow="How it works" title="Four steps, no surprises" lead="…" />
  …
</Section>
```

| `tone` | Look | Use for |
|---|---|---|
| `base` | Transparent — the page ground | Default |
| `raised` | `bg-card` with top/bottom hairlines | Alternate bands |
| `accent` | Quiet tinted band | Rare emphasis |
| `blue` | Soft brand-blue wash (`.band-blue`) | Leaning on the brand colour without shouting |
| `contrast` | Deep saturated blue, forces dark styling (`.band-contrast`) | **Only** sections that ask for something (proof, the offer) |

| `size` | Vertical padding |
|---|---|
| `sm` | `py-12 md:py-14` |
| `md` | `py-20 md:py-28` (default) |
| `lg` | `py-24 md:py-32` |

Rules: never put two blue bands of the same strength next to each other; `aurora` (slow glow) only on bands the reader dwells on. Content width is `max-w-6xl`, horizontal padding `px-6 md:px-10 lg:px-12`.

Companions in the same file: `Eyebrow` (coloured caps kicker with a drawn rule) and `SectionIntro` (eyebrow + animated heading + lead at a fixed rhythm).

---

## 5. Typography

Loaded with `next/font/google` in `app/(frontend)/layout.tsx`:

| Font | Tailwind class | Role |
|---|---|---|
| **Geist** | `font-sans` (default) | Everything |
| **Geist Mono** | `font-mono` | Code |
| **IBM Plex Sans** | `font-ibm-plex` | Big numbers / stats |
| **Courier Prime** | `font-pixel` | Retro accents (footer watermark, timeline labels) |

Scale conventions:
- Section heading: `text-[2rem] md:text-[2.5rem] font-light leading-[1.12] tracking-tight`.
- Hero headings: larger, light weight; line breaks come from `\n` in the copy (`title={"Proof, Not Just\nPromises."}`).
- Body: `text-[0.975rem] leading-[1.75] text-muted-foreground`, max ~52ch.
- Labels / eyebrows: `text-[11px] uppercase tracking-[0.2em]`.

---

## 6. Motion

All motion is CSS — mostly **scroll-driven** (`animation-timeline: view()`), defined in `components/ui/motion.module.css`.

| Class | Effect |
|---|---|
| `rise` / `riseSm` | Fade up (full / half travel) |
| `slideL` / `slideR` | Arrive from the side |
| `scaleIn` | Settle in (cards, panels) |
| `fade`, `pop` | Simple fade / pop |
| `drawX` / `drawY` / `drawCheck` | Lines and ticks drawing themselves |
| `count` | Number counters |
| `parallax` | Subtle depth drift |
| `topLine` | The light line across the top of a non-base `Section` |
| `aurora` | Slow drifting glow |

Stagger is **data, not duplication** — set CSS variables from the item index with helpers in `lib/motion.ts`:

```tsx
import motion from "@/components/ui/motion.module.css"
import { stagger } from "@/lib/motion"

{items.map((item, i) => (
  <li key={item.id} className={motion.rise} style={stagger(i)}>…</li>
))}
```

Guarantees: every scroll animation is wrapped in `@supports (animation-timeline: view())` and `prefers-reduced-motion: no-preference`, so unsupported browsers and reduced-motion users see the final state. Marquees and theme transitions also stop under reduced motion.

Other motion pieces: `RevealText` (word-by-word heading reveal), `intro-animation.module.css` (homepage letter intro), `page-shell.module.css` (page fade-in), `floating-lines.tsx` (three.js backdrop).

---

## 7. Component library (`components/ui/`)

| Component | Purpose |
|---|---|
| `Section`, `Eyebrow`, `SectionIntro` | Page bands and section headings |
| `SectionHeader` | Older heading pattern used on inner pages |
| `BentoCard` (`bento-card.tsx`), `BentoGrid` (`bento.tsx`) | Card surfaces |
| `FeatureGrid`, `FeatureCard` | Feature card grids |
| `RowList`, `Row` | Hairline-divided lists (preferred over card walls for sequences/menus) |
| `Stat` | Big number + label |
| `Tag` | Small pill label |
| `CTAButtons`, `SectionCTA` | Primary/secondary button pair |
| `ServiceAccent`, `ServiceIndex`, `ServicePill` | Service-themed accents |
| `AppLogo`, `AppLogoRow` | Microsoft product marks (`lib/content/app-logos.ts`) |
| `MediaFrame` | Image slot with labelled placeholder when empty |
| `HeroBackdrop`, `MouseGlowGrid`, `floating-lines` | Decorative backgrounds |
| `InfiniteMovingCards` | Marquee (testimonials) |
| `StickyScroll`, `ScrollRail` | Sticky/scroll layouts |
| `TiltedCard` | 3D tilt-on-hover card |
| `RevealText` | Animated heading text |
| `PixelIcon`, `Chevron` | Icons |
| `ExplorerSearch`, `ExplorerFilterChips` | Search box + filter chips for explorers |
| `ThemeToggle` | Light/dark switch |
| `IntroAnimation` | Homepage intro |

Shared sections in `components/sections/shared/`: `PageHero`, `FinalCTASection`, `TestimonialsSection`, `ErrorStateSection`, `NotFoundContent`, `cta-backdrop`.

### Buttons (existing pattern)

```tsx
// Primary
className="px-8 py-3 bg-linear-to-br from-blue-600 to-cyan-600 text-white text-sm rounded-xl
           transition-[filter] duration-200 hover:brightness-110 active:brightness-95 tracking-widest font-medium"
// Secondary
className="px-8 py-3 border border-border text-muted-foreground text-sm rounded-xl
           hover:border-blue-500/40 hover:text-foreground hover:bg-accent/40 transition-all tracking-widest font-medium"
```

Prefer reusing `CTAButtons` over writing new button markup.

---

## 8. Styling rules

- **Tailwind first** for layout, spacing, colour, type.
- **CSS Modules** (`name.module.css` beside the component) for multi-step effects, keyframes, pseudo-elements, or anything that would make a class list unreadable.
- **No `tailwind.config.js`** — Tailwind v4 is configured in `globals.css`. Add design tokens there (`:root`, `.dark`, and `@theme inline`).
- Dark variants: `dark:` (custom variant: `.dark *`).
- Respect `prefers-reduced-motion` for any new animation.
- Mobile first: base classes for phones, `md:` / `lg:` / `xl:` for larger screens.
- Don't add `overflow-hidden` to section wrappers without reason — it breaks `position: sticky` in descendants.

---

## 9. The admin's look

The dashboard is forced dark (`payload.config.ts → admin.theme`) and restyled in `app/(payload)/custom.scss` to match the brand. Logo/icon components live in `components/admin/`. Favicon: `/icon-dark-32x32.png`.
