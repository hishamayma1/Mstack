// ─────────────────────────────────────────────────────────────────────────────
// MICROSOFT PRODUCT LOGOS — the only file you edit to swap in real logo art.
//
// HOW TO ADD A REAL LOGO
//   1. Download the official mark from Microsoft's brand assets
//      (https://www.microsoft.com/design/brand — the product icon set) and drop
//      the SVG in  public/images/logos/
//   2. Change that product's `src` from  null  to  "/images/logos/teams.svg"
//
// Until `src` is set, <AppLogo> renders a monogram tile in the product's accent
// colour, so every logo row is laid out and spaced exactly as it will be with
// the real art in place. Nothing else changes when you swap one in.
//
// `accent` is only used by the placeholder tile — it is a hint of the product's
// familiar colour, not the trademarked mark itself.
// ─────────────────────────────────────────────────────────────────────────────

export type AppLogo = {
  /** Canonical product name, shown as the tooltip/alt text. */
  name: string
  /** Path under public/, or null while the real art is still missing. */
  src: string | null
  /** 1–2 characters for the placeholder tile. */
  monogram: string
  /** Placeholder tile accent, as an `r, g, b` triplet. */
  accent: string
}

export const APP_LOGOS = {
  teams: { name: "Microsoft Teams", src: null, monogram: "T", accent: "98, 100, 167" },
  sharepoint: { name: "SharePoint", src: null, monogram: "SP", accent: "3, 120, 124" },
  onedrive: { name: "OneDrive", src: null, monogram: "OD", accent: "0, 120, 212" },
  outlook: { name: "Outlook", src: null, monogram: "O", accent: "0, 114, 198" },
  exchange: { name: "Exchange Online", src: null, monogram: "EX", accent: "0, 114, 198" },
  "power-apps": { name: "Power Apps", src: null, monogram: "PA", accent: "116, 43, 164" },
  "power-automate": { name: "Power Automate", src: null, monogram: "PF", accent: "11, 83, 148" },
  "power-bi": { name: "Power BI", src: null, monogram: "BI", accent: "225, 175, 0" },
  intune: { name: "Microsoft Intune", src: null, monogram: "IN", accent: "0, 120, 212" },
  entra: { name: "Microsoft Entra", src: null, monogram: "EN", accent: "0, 150, 199" },
  defender: { name: "Microsoft Defender", src: null, monogram: "DF", accent: "56, 118, 191" },
  purview: { name: "Microsoft Purview", src: null, monogram: "PV", accent: "80, 140, 200" },
  copilot: { name: "Microsoft Copilot", src: null, monogram: "CP", accent: "116, 90, 220" },
  planner: { name: "Microsoft Planner", src: null, monogram: "PL", accent: "49, 117, 44" },
  bookings: { name: "Microsoft Bookings", src: null, monogram: "BK", accent: "3, 120, 124" },
  "microsoft-365": { name: "Microsoft 365", src: null, monogram: "365", accent: "0, 114, 198" },
} as const satisfies Record<string, AppLogo>

export type AppLogoSlug = keyof typeof APP_LOGOS

// The marquee under the hero: the stack we work in, in the order a buyer meets
// them (collaboration first, then platform, then security).
export const STACK_LOGOS: AppLogoSlug[] = [
  "teams", "sharepoint", "onedrive", "outlook",
  "power-apps", "power-automate", "power-bi",
  "intune", "entra", "defender",
]

// The hero row: the six products a visitor is most likely to recognise, kept
// short so the row never wraps against the headline.
export const HERO_LOGOS: AppLogoSlug[] = [
  "teams", "sharepoint", "onedrive", "power-automate", "power-bi", "entra",
]

// Which products each service level actually deploys. Kept here rather than
// derived from SERVICE_LEVELS.services, because those strings are sales copy
// ("MFA Enforcement") and this is a product list — they drift apart on purpose.
export const LEVEL_LOGOS: Record<string, AppLogoSlug[]> = {
  "Core 365": ["microsoft-365", "exchange", "outlook"],
  "Cloud 365": ["sharepoint", "onedrive", "teams"],
  "Secure 365": ["entra", "intune", "defender"],
  "Managed 365": ["intune", "purview", "microsoft-365"],
  "Intelligent 365": ["power-automate", "power-apps", "power-bi", "copilot"],
}

// The product behind each homepage use case, so a visitor scanning the grid can
// tell at a glance which of their questions we're answering with what.
export const USE_CASE_LOGOS: Record<string, AppLogoSlug> = {
  SharePoint: "sharepoint",
  Security: "defender",
  Automation: "power-automate",
  "Power Automate": "power-automate",
  "Power Apps": "power-apps",
  "IT Support": "microsoft-365",
}
