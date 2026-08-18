// ─────────────────────────────────────────────────────────────────────────────
// IMAGE SLOTS FOR THE INDUSTRY PAGES — this is the only file you edit to
// replace the demo placeholders with real artwork.
//
// HOW TO REPLACE AN IMAGE
//   1. Drop the file in  public/images/industries/
//   2. Change that slot's `src` from  null  to  "/images/industries/your-file.webp"
//   3. Write a real `alt` — it's the accessible description, keep it specific.
//
// While `src` is null the page renders a labelled dashed frame at the right
// size instead, so the layout is complete during the demo. Nothing else needs
// to change when you swap one in.
// ─────────────────────────────────────────────────────────────────────────────

export type MediaSlot = {
  src: string | null
  alt: string
  /** Shown inside the placeholder — what this image should show. */
  label: string
  /** Shown under the label — export size / art direction. */
  hint: string
}

// Per-industry hero visual, sitting beside the headline. The first thing a
// visitor sees, so this wants to be the strongest image on the page.
export const INDUSTRY_HERO_MEDIA: Record<string, MediaSlot> = {
  healthcare: {
    src: null,
    alt: "",
    label: "Clinical team using Microsoft Teams on a ward tablet",
    hint: "1200×750 · photo or product screenshot",
  },
  "banking-finance": {
    src: null,
    alt: "",
    label: "Advisor reviewing a secure client dashboard",
    hint: "1200×750 · photo or product screenshot",
  },
  education: {
    src: null,
    alt: "",
    label: "Hybrid classroom running a Teams for Education lesson",
    hint: "1200×750 · photo or product screenshot",
  },
  manufacturing: {
    src: null,
    alt: "",
    label: "Shop-floor Power BI dashboard on a wall display",
    hint: "1200×750 · photo or product screenshot",
  },
  "retail-wholesale": {
    src: null,
    alt: "",
    label: "Store manager checking live stock on a tablet",
    hint: "1200×750 · photo or product screenshot",
  },
  hospitality: {
    src: null,
    alt: "",
    label: "Front desk and housekeeping coordinating in Teams",
    hint: "1200×750 · photo or product screenshot",
  },
  "professional-services": {
    src: null,
    alt: "",
    label: "Consultant working in a SharePoint client portal",
    hint: "1200×750 · photo or product screenshot",
  },
}

export const INDUSTRY_HERO_MEDIA_FALLBACK: MediaSlot = {
  src: null,
  alt: "",
  label: "Team working in Microsoft 365",
  hint: "1200×750 · photo or product screenshot",
}

// Thumbnail on each card in the /industries grid. Keep these visually
// consistent with each other — they're seen side by side.
export const INDUSTRY_CARD_MEDIA: Record<string, MediaSlot> = {
  healthcare: { src: null, alt: "", label: "Healthcare", hint: "800×450" },
  "banking-finance": { src: null, alt: "", label: "Banking & Finance", hint: "800×450" },
  education: { src: null, alt: "", label: "Education", hint: "800×450" },
  manufacturing: { src: null, alt: "", label: "Manufacturing", hint: "800×450" },
  "retail-wholesale": { src: null, alt: "", label: "Retail & Wholesale", hint: "800×450" },
  hospitality: { src: null, alt: "", label: "Hospitality", hint: "800×450" },
  "professional-services": { src: null, alt: "", label: "Professional Services", hint: "800×450" },
}

// The three-step "how this actually lands" walkthrough on each industry page.
// Same three steps for every sector — it's our process, not sector content —
// so one set of images covers all seven pages.
export type WalkthroughStep = {
  n: string
  title: string
  description: string
  bullets: string[]
  media: MediaSlot
}

export const INDUSTRY_WALKTHROUGH: WalkthroughStep[] = [
  {
    n: "01",
    title: "We Audit What You Already Have",
    description:
      "Before anything is bought or changed, we look inside your tenant: which licences you hold, what's switched on, what's misconfigured, and where your sector's risks actually sit.",
    bullets: [
      "Full licence and usage review",
      "Security and compliance gap report",
      "No commitment, no cost",
    ],
    media: {
      src: null,
      alt: "",
      label: "Tenant audit report — licence usage and security gaps",
      hint: "1000×700 · annotated screenshot",
    },
  },
  {
    n: "02",
    title: "We Configure Around How You Work",
    description:
      "We turn on and shape the tools your sector benefits from — access rules, automation, dashboards, device policies — and leave out the ones that would just add noise.",
    bullets: [
      "Sector-specific security baseline",
      "Automations built for your workflows",
      "Staff onboarded as it goes live",
    ],
    media: {
      src: null,
      alt: "",
      label: "Configuration in progress — policies, flows, dashboards",
      hint: "1000×700 · annotated screenshot",
    },
  },
  {
    n: "03",
    title: "We Stay On It",
    description:
      "Environments drift. We monitor, patch, review, and adjust as your business changes, so the setup that worked at go-live still works two years later.",
    bullets: [
      "Ongoing monitoring and support",
      "Regular posture reviews",
      "A named team that knows your setup",
    ],
    media: {
      src: null,
      alt: "",
      label: "Ongoing monitoring view — health, alerts, review cadence",
      hint: "1000×700 · annotated screenshot",
    },
  },
]

export function heroMediaFor(slug: string): MediaSlot {
  return INDUSTRY_HERO_MEDIA[slug] ?? INDUSTRY_HERO_MEDIA_FALLBACK
}

export function cardMediaFor(slug: string, title: string): MediaSlot {
  return INDUSTRY_CARD_MEDIA[slug] ?? { src: null, alt: "", label: title, hint: "800×450" }
}
