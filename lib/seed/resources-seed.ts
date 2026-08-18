// Seed data for the "blog-posts", "guides", "tools", and "faqs" Payload
// collections, inserted once by the onInit hook in payload.config.ts if
// each collection is empty. Mirrors the placeholder copy the site shipped
// with before these became CMS-managed.

export const BLOG_POSTS_SEED = [
  {
    title: "5 Signs Your Tenant Needs a Security Audit", slug: "5-signs-your-tenant-needs-a-security-audit",
    excerpt: "The early warning signs we look for before recommending a full Secure 365 engagement.",
    tag: "Security", status: "published" as const, publishedDate: "2025-11-10T00:00:00.000Z",
  },
  {
    title: "SharePoint vs. File Servers: Making the Switch", slug: "sharepoint-vs-file-servers",
    excerpt: "A practical breakdown of what changes for your team, and how to plan a smooth migration.",
    tag: "SharePoint", status: "published" as const, publishedDate: "2025-10-22T00:00:00.000Z",
  },
  {
    title: "Power Automate Workflows Every Business Should Have", slug: "power-automate-workflows-every-business-should-have",
    excerpt: "Five automations we build for almost every client in their first 90 days.",
    tag: "Automation", status: "published" as const, publishedDate: "2025-09-30T00:00:00.000Z",
  },
]

export const GUIDES_SEED = [
  {
    title: "Microsoft 365 Security Checklist", slug: "microsoft-365-security-checklist",
    description: "A downloadable checklist covering MFA, conditional access, and Defender baseline configuration.",
    tag: "Security", status: "published" as const, publishedDate: "2025-11-01T00:00:00.000Z",
  },
  {
    title: "Tenant Migration Readiness Assessment", slug: "tenant-migration-readiness-assessment",
    description: "Everything you need to evaluate before starting a cross-tenant or on-prem migration.",
    tag: "Migration", status: "published" as const, publishedDate: "2025-10-05T00:00:00.000Z",
  },
  {
    title: "Power Platform Governance Framework", slug: "power-platform-governance-framework",
    description: "How to roll out Power Apps and Power Automate without losing control of your environment.",
    tag: "Governance", status: "published" as const, publishedDate: "2025-09-12T00:00:00.000Z",
  },
]

export const TOOLS_SEED = [
  {
    title: "License Optimisation Calculator", slug: "license-optimisation-calculator",
    description: "Estimate potential savings by right-sizing your Microsoft 365 license mix.",
    tag: "Calculator", status: "published" as const, publishedDate: "2025-10-18T00:00:00.000Z",
  },
  {
    title: "Security Posture Scorecard", slug: "security-posture-scorecard",
    description: "A short self-assessment that scores your tenant against Zero Trust baselines.",
    tag: "Scorecard", status: "published" as const, publishedDate: "2025-09-25T00:00:00.000Z",
  },
]

export const FAQS_SEED = [
  {
    question: "Do you only work with Microsoft tools?",
    answer: "Yes, exclusively — deep focus is what makes us genuinely effective.",
    points: [
      { point: "Full coverage of Teams, SharePoint, OneDrive, Power Platform, Intune, and Microsoft Entra" },
      { point: "Maximum value extracted from the licences you already pay for" },
      { point: "No unnecessary tools, no vendor sprawl, and no compromise on security" },
      { point: "Every recommendation we make is purely in your best interest" },
    ],
    category: "General", order: 10, status: "published" as const,
  },
  {
    question: "What industries do you specialise in?",
    answer: "We serve a wide range of industries with a flexible, sector-aware approach.",
    points: [
      { point: "Healthcare, finance, education, manufacturing, retail, hospitality, and professional services" },
      { point: "Our 5-level model is designed to be adaptable to any sector or business size" },
      { point: "We take time to understand your specific industry challenges before recommending solutions" },
      { point: "Everything is tailored to fit how your business actually operates" },
    ],
    category: "Industries", order: 20, status: "published" as const,
  },
  {
    question: "How is our data protected with you?",
    answer: "Your data stays fully owned and controlled by you at all times.",
    points: [
      { point: "Engineers operate under a least-privilege model — only the minimum access required, no more" },
      { point: "All administrative actions are logged and auditable within your Microsoft 365 tenant" },
      { point: "No client data is downloaded or stored on personal devices — all work is done inside your secure environment" },
      { point: "Every team member is bound by confidentiality agreements, with zero data misuse incidents on record" },
    ],
    category: "Security", order: 30, status: "published" as const,
  },
  {
    question: "What is included in a free consultation?",
    answer: "A genuine, no-obligation 15-minute conversation where we listen first.",
    points: [
      { point: "We understand your current environment, challenges, and what matters most to your business" },
      { point: "You get an honest picture of which service level fits your situation" },
      { point: "We outline a realistic path forward with no script and no pressure" },
      { point: "If we are not the right fit for you, we will be upfront about it" },
    ],
    category: "General", order: 40, status: "published" as const,
  },
  {
    question: "What are your payment terms?",
    answer: "Payment is structured in clear phases aligned to project milestones.",
    points: [
      { point: "Projects are typically split into phases — commonly 25% per phase across 4 stages" },
      { point: "Monthly retainer support is billed at the start of each month" },
      { point: "We accept bank transfers and major credit cards" },
      { point: "All pricing is fully transparent with no hidden fees" },
    ],
    category: "Pricing", order: 50, status: "published" as const,
  },
  {
    question: "Do you offer warranty or post-project support?",
    answer: "Yes — every completed project includes a warranty period.",
    points: [
      { point: "2 to 6 weeks of complimentary post-project warranty support depending on scope" },
      { point: "Any adjustments or refinements are handled at no additional cost during this period" },
      { point: "Final payment is due only after the warranty period concludes" },
      { point: "This ensures your complete satisfaction before the engagement formally closes" },
    ],
    category: "Support", order: 60, status: "published" as const,
  },
  {
    question: "Do you offer monthly retainer support?",
    answer: "Yes, and this is where we do our best work.",
    points: [
      { point: "Day-to-day requests and proactive monitoring handled as they arise" },
      { point: "Ongoing security improvements and long-term roadmap planning included" },
      { point: "A dedicated partner who knows your environment inside and out" },
      { point: "No ticket queues, no strangers — just prompt support from someone genuinely invested in your success" },
    ],
    category: "Support", order: 70, status: "published" as const,
  },
]
