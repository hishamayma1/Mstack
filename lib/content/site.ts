// Site content, kept separate from markup so copy changes never touch component logic.

import type { AppLogoSlug } from "@/lib/content/app-logos"

export type HeroStat = { value: string; label: string }

export const HERO_STATS: HeroStat[] = [
  { value: "500+", label: "Satisfied Clients" },
  { value: "100%", label: "Microsoft Native" },
  { value: "10+", label: "Years Experience" },
  { value: "5", label: "Service Levels" },
]

// The product list that used to live here now lives in lib/content/app-logos.ts,
// where each product carries its mark as well as its name — the hero and the
// trust bar both render it as logos (see STACK_LOGOS / HERO_LOGOS).

// ── Homepage: problem agitation ─────────────────────────────────────────────
// Sits between the hero and the services, so a visitor recognises their own
// situation before being shown a service menu. Each one is a symptom a buyer
// would describe themselves, not a product feature.
// `kind` drives the coloured indicator on the card — it tells the visitor what
// this problem costs them (money, exposure, or time) before they read a word.
export type PainPoint = { symptom: string; cost: string; kind: "Cost" | "Risk" | "Time" }

export const PAIN_POINTS: PainPoint[] = [
  {
    symptom: "You're paying for licences nobody uses",
    cost: "Tiers and seats billed every month, never switched on.",
    kind: "Cost",
  },
  {
    symptom: "Your security is whatever the default was",
    cost: "No MFA baseline, no conditional access, no idea who can reach what.",
    kind: "Risk",
  },
  {
    symptom: "Files live in five different places",
    cost: "Attachments, personal OneDrives, an old file server. Nobody trusts the current version.",
    kind: "Risk",
  },
  {
    symptom: "IT support means waiting and hoping",
    cost: "No named contact, no response times, every issue explained from scratch.",
    kind: "Time",
  },
  {
    symptom: "The same manual work, every week",
    cost: "Approvals, onboarding and reporting still done by hand.",
    kind: "Time",
  },
  {
    symptom: "Nobody can tell you if it's working",
    cost: "No adoption numbers, no security posture — just a monthly invoice.",
    kind: "Cost",
  },
]

// ── Homepage: lead magnet ───────────────────────────────────────────────────
// The primary conversion offer. Deliberately concrete and low-commitment —
// it asks for 15 minutes, not a budget.
export const HEALTH_CHECK_DELIVERABLES = [
  "A full licence and spend review — what you pay for versus what you use",
  "Your security posture scored against a Microsoft 365 baseline",
  "The three highest-impact fixes, ranked by effort",
  "A written summary you keep, whether or not you work with us",
]

// The five service levels and the four add-on services used to be hard-coded
// here. They now live in the `services` Payload collection
// (collections/Services.ts), because each one has its own page, its own price
// bands and its own configurator — none of which can be edited from a
// TypeScript constant. lib/cms/services.ts reads them; the copy that was here
// became lib/seed/services-seed.ts.

// `signal` is the indicator printed above each step — what it costs the client
// in time or money. It does the reassurance work the description used to do at
// three times the length.
export type ProcessStep = { n: string; title: string; desc: string; signal: string }

export const PROCESS_STEPS: ProcessStep[] = [
  { n: "01", title: "Discovery Call", desc: "We listen to the problem in your words.", signal: "15 min · free" },
  { n: "02", title: "Assessment", desc: "We audit the tenant and price the fix.", signal: "Written proposal" },
  { n: "03", title: "Implementation", desc: "Changes land without stopping your week.", signal: "Zero downtime" },
  { n: "04", title: "Ongoing Support", desc: "A named team that already knows your setup.", signal: "Named contact" },
  { n: "05", title: "Optimise & Report", desc: "Reviews, usage insight, and what's next.", signal: "Every quarter" },
]

export type BrandBreakdownItem = { letter: string; label: string; desc: string }

export const BRAND_BREAKDOWN: BrandBreakdownItem[] = [
  { letter: "M", label: "Microsoft", desc: "Stands for Microsoft — the platform we master" },
  { letter: "Stack", label: "Technology Stack", desc: "Stands for the full technology stack your business runs on" },
  { letter: "360", label: "Full Coverage", desc: "Stands for complete all-round coverage at every level" },
]

// `icon` selects the mark drawn on the card — see DIFFERENTIATOR_ICONS in
// components/sections/home/differentiators-section.tsx. Each card gets its own
// shape so the grid reads as six distinct claims, not one repeated badge.
export type Differentiator = {
  title: string
  desc: string
  icon: "native" | "speed" | "scale" | "shield" | "support" | "partnership"
}

export const DIFFERENTIATORS: Differentiator[] = [
  { title: "100% Microsoft Native", desc: "No third-party sprawl — we work in the stack you already pay for.", icon: "native" },
  { title: "Fast Execution", desc: "Scoped in days, delivered in weeks, not quarters.", icon: "speed" },
  { title: "Scalable Solutions", desc: "Start at your level, move up when the business needs it.", icon: "scale" },
  { title: "Security First", desc: "Zero Trust is the baseline, not an upsell.", icon: "shield" },
  { title: "Dedicated Support", desc: "A named team who already knows your tenant.", icon: "support" },
  { title: "Long-Term Partnership", desc: "We stay past go-live, because environments drift.", icon: "partnership" },
]

export type UseCase = { name: string; topic: string; quote: string }

export const USE_CASES: UseCase[] = [
  { name: "Sophia", topic: "SharePoint", quote: "Our clinic needs SharePoint permissions done properly and a staff intranet that's secure but easy to use." },
  { name: "Daniel", topic: "Security", quote: "We want MFA enforced, devices controlled, and phishing handled — end to end, not piecemeal." },
  { name: "Liam", topic: "Automation", quote: "One manual process eats hours every week. Can approvals and notifications just run themselves?" },
  { name: "Emily", topic: "Power Automate", quote: "We're drowning in Excel files. Replace them with SharePoint lists and workflows we can trust." },
  { name: "Camille", topic: "Power Apps", quote: "We need a simple internal app for daily operations, connected to our Microsoft 365 data." },
  { name: "Abdullah", topic: "IT Support", quote: "We want ongoing support we can rely on day to day, not another one-off project." },
]

// `slug` points at that sector's own page under /industries/[slug]. Two of the
// nine have no page yet (they aren't in the "industries" collection — see
// lib/seed/industries-seed.ts), so their slug is null and the homepage sends
// those visitors to the sector hub instead of a 404. Give one of them a page
// and the button follows automatically: add the slug here.
export type Industry = { num: string; title: string; desc: string; slug: string | null }

export const INDUSTRIES: Industry[] = [
  { num: "01", title: "Hospitality", slug: "hospitality", desc: "Unify guest communications, staff scheduling, and property operations inside Microsoft Teams and Bookings — so every team member stays connected from front desk to housekeeping." },
  { num: "02", title: "Professional Services", slug: "professional-services", desc: "Replace scattered inboxes and spreadsheets with SharePoint client portals, automated proposals in Power Automate, and project tracking in Planner — helping your firm deliver faster with fewer errors." },
  { num: "03", title: "Healthcare", slug: "healthcare", desc: "Protect sensitive patient data with Microsoft Purview compliance tools, enforce HIPAA-aware access policies via Entra ID, and streamline care coordination through secure Teams channels." },
  { num: "04", title: "Manufacturing", slug: "manufacturing", desc: "Connect shop floor to back office with Power BI dashboards tracking production KPIs in real time, Power Apps for maintenance requests, and Teams for instant shift-handover communications." },
  { num: "05", title: "Government & Public Sector", slug: null, desc: "Deploy Microsoft 365 configurations with conditional access, data loss prevention, and eDiscovery built in — meeting public-sector compliance requirements without sacrificing productivity." },
  { num: "06", title: "Retail & Wholesale", slug: "retail-wholesale", desc: "Arm your sales team with Microsoft 365-connected data in Teams, automate reorder workflows in Power Automate, and give managers live inventory insights through Power BI reports." },
  { num: "07", title: "Banking & Finance", slug: "banking-finance", desc: "Enforce MFA, privileged identity management, and encrypted communication across your organisation with Microsoft Defender and Entra ID — keeping customer data and audit trails watertight." },
  { num: "08", title: "Education", slug: "education", desc: "Roll out Microsoft 365 EDU with Teams for hybrid classrooms, OneNote Class Notebooks for shared lesson plans, and Intune-managed devices that keep students focused and data protected." },
  { num: "09", title: "Science, Research & Tech", slug: null, desc: "Scale research collaboration with SharePoint document libraries, co-authoring in Microsoft 365 Apps, and Entra B2B for secure external partner access — all without sacrificing IP protection." },
]

export type Testimonial = { name: string; quote: string }

export const TESTIMONIALS: Testimonial[] = [
  { name: "Kyle B.", quote: "Fantastic to work with on our migration project — smooth and stress-free." },
  { name: "Kara F.", quote: "Changed all our email addresses without any hiccups or interruption." },
  { name: "Tom C.", quote: "Patient and helped through every technical challenge, even late at night." },
  { name: "Andy R.", quote: "Terrific, knowledgeable, quick and flexible — rates that are more than fair." },
  { name: "Dana S.", quote: "Exceeded all my expectations with professionalism and attention to detail." },
  { name: "Michael R.", quote: "Set up our entire SharePoint environment from scratch. Very thorough." },
]

// FAQs now live in the "faqs" Payload collection (see collections/FAQs.ts)
// and are fetched dynamically — see lib/payload-resources.ts. Used by both
// the homepage and /resources FAQ accordion.

// `photo` points at public/team/. Those are 500x500 cut-out portraits on a
// transparent background — the card frame is square to match (see
// tilted-card.module.css) and supplies the backdrop the cut-out sits on. Replace
// a file keeping its name and the 1:1 transparent-PNG format and nothing else
// needs touching.
export type TeamMember = { name: string; title: string; bio: string; email: string; photo: string }

export const TEAM: TeamMember[] = [
  { name: "Ahmed Masoud", title: "Microsoft 365 Consultant", bio: "Founder and Microsoft 365 Lead Consultant. Specialised in security, migrations, and workflow optimisation.", email: "ahmed@mstack360.com", photo: "/team/ahmed-masoud.png" },
  { name: "Ahmed Ashraf", title: "Business Admin", bio: "Business administrator and quality specialist. Ensures smooth operations, clear communication, and top-quality delivery across all client projects.", email: "help@mstack360.com", photo: "/team/ahmed-ashraf.png" },
  { name: "Omar Abdelmagied", title: "Microsoft 365 Consultant", bio: "Microsoft 365 consultant skilled in SharePoint, OneDrive, and setup solutions. Supports our German-speaking clients.", email: "help@mstack360.com", photo: "/team/omar-abdelmagied.png" },
  { name: "Sam", title: "Digital Transformation, Power Platform", bio: "Power Platform expert specialising in Power Apps and Power Automate. Builds smart, automated solutions that simplify processes.", email: "help@mstack360.com", photo: "/team/sam.png" },
  { name: "Maged", title: "Microsoft Entra & Security Expert", bio: "Microsoft Entra and Azure specialist with deep expertise in security, compliance, and Intune management.", email: "help@mstack360.com", photo: "/team/maged.png" },
]

export const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "Solutions", href: "/solutions" },
  { label: "Industries", href: "/industries" },
  { label: "Case Studies", href: "/case-studies" },
  { label: "Resources", href: "/resources" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
] as const

export const LEGAL_LINKS = [
  { label: "Privacy Policy", href: "/legal#privacy-policy" },
  { label: "Terms of Service", href: "/legal#terms-of-service" },
  { label: "Cookie Policy", href: "/legal#cookie-policy" },
] as const

export const SOCIAL_LINKS = [
  { label: "LinkedIn", href: "#" },
  { label: "YouTube", href: "#" },
] as const

// ── Footer navigation ───────────────────────────────────────────────────────
// Grouped columns for the site footer. Every href points at a route or an
// anchor that actually exists — the industry slugs match the "industries"
// collection, and the #anchors match section ids on those pages.
export type FooterLink = { label: string; href: string }
export type FooterColumn = { heading: string; links: FooterLink[] }

export const FOOTER_COLUMNS: FooterColumn[] = [
  {
    heading: "Solutions",
    links: [
      { label: "Service Levels", href: "/solutions#services" },
      { label: "Migration", href: "/solutions#add-ons" },
      { label: "Security & Compliance", href: "/solutions#add-ons" },
      { label: "SharePoint Support", href: "/solutions#add-ons" },
      { label: "Teams Phone Support", href: "/solutions#add-ons" },
    ],
  },
  {
    heading: "Industries",
    links: [
      { label: "Healthcare", href: "/industries/healthcare" },
      { label: "Banking & Finance", href: "/industries/banking-finance" },
      { label: "Education", href: "/industries/education" },
      { label: "Manufacturing", href: "/industries/manufacturing" },
      { label: "Retail & Wholesale", href: "/industries/retail-wholesale" },
      { label: "Hospitality", href: "/industries/hospitality" },
      { label: "Professional Services", href: "/industries/professional-services" },
    ],
  },
  {
    heading: "Company",
    links: [
      { label: "About Us", href: "/about" },
      { label: "Case Studies", href: "/case-studies" },
      { label: "Our Process", href: "/#process" },
      { label: "Careers", href: "/about#careers" },
      { label: "Contact", href: "/contact" },
    ],
  },
  {
    heading: "Resources",
    links: [
      { label: "Guides & Articles", href: "/resources" },
      { label: "Calculators & Tools", href: "/resources" },
      { label: "FAQs", href: "/resources#faq" },
      { label: "Book a Consultation", href: "/contact" },
    ],
  },
]

// ── Desktop mega-menu content ───────────────────────────────────────────────
// The horizontal nav panels. Deliberately its own structure rather than reusing
// FOOTER_COLUMNS: the panels are wide enough to carry a one-line description
// per link plus a media/feature card, which the footer's bare label lists have
// no room for. Only the labels listed here get a panel — every other NAV_LINK
// stays a plain link.
export type NavMenuLink = { label: string; href: string; desc: string }
export type NavMenuGroup = { heading: string; links: NavMenuLink[] }

// The card on the right of each panel. `image` is the path to real art under
// public/ once it exists; while it's null the card renders a generated visual
// (accent gradient + the product marks in `logos`) at exactly the same size, so
// dropping a file in later changes nothing else.
export type NavMenuMedia = {
  eyebrow: string
  title: string
  desc: string
  cta: string
  href: string
  image: string | null
  logos: AppLogoSlug[]
}

export type NavMenu = { blurb: string; groups: NavMenuGroup[]; media: NavMenuMedia }

export const NAV_MENUS: Record<string, NavMenu> = {
  Solutions: {
    blurb: "Five levels, from a clean tenant to a fully automated one.",
    groups: [
      {
        heading: "Service Levels",
        links: [
          { label: "Core 365", href: "/solutions/core-365", desc: "Email and licences done right" },
          { label: "Cloud 365", href: "/solutions/cloud-365", desc: "SharePoint, OneDrive, Teams" },
          { label: "Secure 365", href: "/solutions/secure-365", desc: "Zero Trust as the baseline" },
          { label: "Managed 365", href: "/solutions/managed-365", desc: "We run it day to day" },
          { label: "Intelligent 365", href: "/solutions/intelligent-365", desc: "Automation and Copilot" },
        ],
      },
      {
        heading: "Add-on Services",
        links: [
          { label: "Migration", href: "/solutions/migration", desc: "Move tenants with zero data loss" },
          { label: "Security & Compliance", href: "/solutions/security-compliance", desc: "Hardening and audit readiness" },
          { label: "SharePoint Support", href: "/solutions/sharepoint-support", desc: "Architecture and permissions" },
          { label: "Teams Phone Support", href: "/solutions/teams-phone", desc: "Replace the legacy PBX" },
        ],
      },
    ],
    media: {
      eyebrow: "Free · 15 minutes",
      title: "Microsoft 365 Health Check",
      desc: "Licence spend, security posture, and the three fixes worth doing first.",
      cta: "Book a health check",
      href: "/contact",
      image: null,
      logos: ["microsoft-365", "entra", "power-automate", "defender"],
    },
  },
  Industries: {
    blurb: "Sector-specific configurations, not a generic rollout.",
    groups: [
      {
        heading: "Regulated",
        links: [
          { label: "Healthcare", href: "/industries/healthcare", desc: "Purview and HIPAA-aware access" },
          { label: "Banking & Finance", href: "/industries/banking-finance", desc: "PIM, MFA, watertight audit trails" },
          { label: "Education", href: "/industries/education", desc: "Microsoft 365 EDU and Intune devices" },
          { label: "Professional Services", href: "/industries/professional-services", desc: "Client portals and proposals" },
        ],
      },
      {
        heading: "Operations-led",
        links: [
          { label: "Manufacturing", href: "/industries/manufacturing", desc: "Shop floor to back office" },
          { label: "Retail & Wholesale", href: "/industries/retail-wholesale", desc: "Live inventory and reorder flows" },
          { label: "Hospitality", href: "/industries/hospitality", desc: "Guest comms and staff scheduling" },
          { label: "All sectors", href: "/industries", desc: "Nine industries we support" },
        ],
      },
    ],
    media: {
      eyebrow: "Proof",
      title: "Case Studies",
      desc: "What the same stack looks like across nine very different sectors.",
      cta: "Read case studies",
      href: "/case-studies",
      image: null,
      logos: ["sharepoint", "teams", "power-bi", "intune"],
    },
  },
  Resources: {
    blurb: "Everything we've written down, free to use.",
    groups: [
      {
        heading: "Learn",
        links: [
          { label: "Guides & Articles", href: "/resources", desc: "Practical Microsoft 365 walkthroughs" },
          { label: "FAQs", href: "/resources#faq", desc: "The questions we answer weekly" },
          { label: "Our Process", href: "/#process", desc: "How an engagement actually runs" },
        ],
      },
      {
        heading: "Use",
        links: [
          { label: "Calculators & Tools", href: "/resources", desc: "Size the spend before you commit" },
          { label: "Book a Consultation", href: "/contact", desc: "15 minutes, no obligation" },
          { label: "About MStack360", href: "/about", desc: "The team behind the work" },
        ],
      },
    ],
    media: {
      eyebrow: "Most read",
      title: "Copilot Readiness",
      desc: "What has to be true in your tenant before Copilot is worth paying for.",
      cta: "Open the guide",
      href: "/resources",
      image: null,
      logos: ["copilot", "purview", "onedrive", "outlook"],
    },
  },
}

// ── Industries page — the 7 sectors listed in the site's sitemap ───────────
export const SITEMAP_INDUSTRY_TITLES = [
  "Healthcare", "Banking & Finance", "Education", "Manufacturing",
  "Retail & Wholesale", "Hospitality", "Professional Services",
] as const

// Case studies now live in the "case-studies" Payload collection (see
// collections/CaseStudies.ts) and are fetched dynamically — see
// lib/payload-case-studies.ts and app/(frontend)/case-studies/page.tsx.

// Blog posts, guides, and tools now live in the "blog-posts", "guides",
// and "tools" Payload collections and are fetched dynamically — see
// lib/payload-resources.ts and app/(frontend)/resources/page.tsx.

// ── About page ───────────────────────────────────────────────────────────────
export type StoryMilestone = { year: string; title: string; desc: string }

export const OUR_STORY: StoryMilestone[] = [
  { year: "2015", title: "Founded on a simple idea", desc: "MStack360 started as a two-person consultancy helping small businesses get more out of the Microsoft 365 licenses they were already paying for." },
  { year: "2018", title: "Security became the focus", desc: "As client environments grew, so did the threats against them. We built out a dedicated Secure 365 practice around Zero Trust principles." },
  { year: "2021", title: "Automation and Power Platform", desc: "We expanded into Power Apps, Power Automate, and Power BI, helping clients replace manual processes with governed automation." },
  { year: "2026", title: "500+ clients, one platform", desc: "Today we support businesses across nine industries, all built exclusively on Microsoft's native stack — no third-party sprawl." },
]

export type CareerOpening = { title: string; type: string; location: string }

export const CAREER_OPENINGS: CareerOpening[] = [
  { title: "Microsoft 365 Consultant", type: "Full-time", location: "Remote" },
  { title: "Power Platform Developer", type: "Full-time", location: "Remote" },
  { title: "Security & Compliance Engineer", type: "Contract", location: "Remote" },
]

export const CAREERS_CULTURE = [
  "100% remote team spanning multiple time zones and languages",
  "Deep specialisation — every engineer works exclusively within the Microsoft ecosystem",
  "Client-first culture: no ticket queues, no scripts, just direct ownership",
  "Continuous Microsoft certification support and funded learning time",
]

export type Partner = { name: string; type: string }

export const PARTNERS: Partner[] = [
  { name: "Microsoft Solutions Partner", type: "Modern Work & Security" },
  { name: "Microsoft Solutions Partner", type: "Data & AI (Azure)" },
  { name: "CSP Direct Bill Partner", type: "Licensing" },
  { name: "Microsoft Certified: Security, Compliance, and Identity Fundamentals", type: "Certification" },
  { name: "Microsoft Certified: Power Platform Solution Architect", type: "Certification" },
  { name: "Microsoft Certified: Teams Administrator Associate", type: "Certification" },
]

// ── Legal page ───────────────────────────────────────────────────────────────
export type LegalDoc = { id: string; title: string; updated: string; sections: { heading: string; body: string }[] }

export const LEGAL_DOCS: LegalDoc[] = [
  {
    id: "privacy-policy", title: "Privacy Policy", updated: "January 2026",
    sections: [
      { heading: "Information We Collect", body: "We collect information you provide directly to us — such as your name, email address, and company details submitted through our contact forms or consultation bookings — along with limited technical data (browser type, pages visited) used to improve this website." },
      { heading: "How We Use Information", body: "Information you share with us is used solely to respond to your enquiry, deliver the services you have engaged us for, and, where you have opted in, to send occasional updates about our services." },
      { heading: "Data Sharing", body: "We do not sell client data. Information is shared only with the sub-processors required to deliver our services (e.g. Microsoft 365 itself) and never used outside the scope of the engagement you have agreed to." },
      { heading: "Your Rights", body: "You may request access to, correction of, or deletion of your personal data at any time by contacting us at privacy@mstack360.com." },
    ],
  },
  {
    id: "terms-of-service", title: "Terms of Service", updated: "January 2026",
    sections: [
      { heading: "Engagement Scope", body: "All services are scoped in writing prior to commencement. Work outside an agreed scope is treated as a change request and quoted separately before proceeding." },
      { heading: "Payment Terms", body: "Project work is typically billed in phases (commonly 25% per phase across four stages); monthly retainer support is billed at the start of each month. All pricing is transparent, with no hidden fees." },
      { heading: "Warranty", body: "Every completed project includes a complimentary post-project warranty period of two to six weeks, during which adjustments are handled at no additional cost." },
      { heading: "Limitation of Liability", body: "MStack360's liability for any engagement is limited to the fees paid for that specific engagement, except where liability cannot be limited by law." },
    ],
  },
  {
    id: "cookie-policy", title: "Cookie Policy", updated: "January 2026",
    sections: [
      { heading: "What Cookies We Use", body: "This site uses a minimal set of essential cookies required for the site to function, plus privacy-respecting analytics cookies used to understand aggregate traffic patterns." },
      { heading: "Managing Cookies", body: "You can disable non-essential cookies at any time through your browser settings. Disabling essential cookies may affect site functionality." },
    ],
  },
]

// ── Contact page ─────────────────────────────────────────────────────────────
export const CONTACT_METHODS = [
  { label: "General Enquiries", value: "help@mstack360.com" },
  { label: "New Business", value: "ahmed@mstack360.com" },
  { label: "Response Time", value: "Within 1 business day" },
] as const

export const CONTACT_TOPICS = [
  "Free Consultation", "Security & Compliance", "Migration", "Power Platform", "Managed Support", "Other",
] as const
