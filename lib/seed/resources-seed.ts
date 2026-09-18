// Seed data for the "blog-posts", "guides", "tools", and "faqs" Payload
// collections, inserted once by the onInit hook in payload.config.ts if
// each collection is empty. Mirrors the placeholder copy the site shipped
// with before these became CMS-managed.

// Builds the Lexical JSON shape the richText field expects — one paragraph
// node per string. `coverImage` isn't filled here: it's a media upload
// relation, and a text seed can't create one — the card just falls back to
// its placeholder until a real image is added in /admin.
function richText(paragraphs: string[]) {
  return {
    root: {
      type: "root",
      direction: "ltr" as const,
      format: "" as const,
      indent: 0,
      version: 1,
      children: paragraphs.map((text) => ({
        type: "paragraph",
        direction: "ltr" as const,
        format: "" as const,
        indent: 0,
        version: 1,
        children: [{ type: "text", detail: 0, format: 0, mode: "normal" as const, style: "", text, version: 1 }],
      })),
    },
  }
}

export const BLOG_POSTS_SEED = [
  {
    title: "5 Signs Your Tenant Needs a Security Audit", slug: "5-signs-your-tenant-needs-a-security-audit",
    excerpt: "The early warning signs we look for before recommending a full Secure 365 engagement.",
    tag: "Security", status: "published" as const, publishedDate: "2025-11-10T00:00:00.000Z",
    body: richText([
      "Most tenants we audit have never had a formal security review — they've just accumulated defaults since the day someone in the office first signed up for Microsoft 365. That's not a criticism, it's just how the platform gets adopted. But a few patterns show up over and over in the tenants that are quietly exposed, and they're worth checking yourself before they become an incident.",
      "The first is MFA coverage that looks complete on paper but has silent gaps — a handful of shared mailboxes, a service account, or an admin who enrolled a second device and never re-verified it. The second is conditional access policies that exist but were never tested against a real sign-in from an unmanaged device. The third is sprawling admin role assignments: Global Administrator handed out to solve a one-off problem two years ago, and never revoked.",
      "None of these individually causes a breach. Together, they're usually how one happens — an attacker doesn't need a zero-day when the front door has three keys under the mat. A tenant-wide audit takes a day or two and gives you a prioritized list instead of a vague sense that something might be wrong.",
      "If you recognize more than one of these in your own environment, that's the signal to book a review before it becomes an incident report instead of a checklist.",
    ]),
  },
  {
    title: "SharePoint vs. File Servers: Making the Switch", slug: "sharepoint-vs-file-servers",
    excerpt: "A practical breakdown of what changes for your team, and how to plan a smooth migration.",
    tag: "SharePoint", status: "published" as const, publishedDate: "2025-10-22T00:00:00.000Z",
    body: richText([
      "The most common objection we hear about moving off a file server isn't technical — it's \"our folder structure works fine, why touch it.\" Fair. But a file server and SharePoint solve different problems, and the gap becomes obvious the moment more than one person needs to open the same file, or someone needs access from outside the office.",
      "A file server gives you a folder tree and, usually, an all-or-nothing permission model per share. SharePoint gives you the same folder tree, but every file gets version history, co-authoring, and permissions that can be scoped per library or even per file without asking IT to touch a group policy. The migration itself is mechanical — the real work is deciding what the new structure should be, because copying a decade of accumulated folder chaos verbatim just moves the mess somewhere newer.",
      "Plan for three things: a permissions audit before you migrate (not after), a short training session so people know co-authoring exists and stop emailing attachments to themselves, and a freeze window where the old server goes read-only while the new structure goes live. Done that way, the switch is a non-event for most staff — which is exactly the goal.",
    ]),
  },
  {
    title: "Power Automate Workflows Every Business Should Have", slug: "power-automate-workflows-every-business-should-have",
    excerpt: "Five automations we build for almost every client in their first 90 days.",
    tag: "Automation", status: "published" as const, publishedDate: "2025-09-30T00:00:00.000Z",
    body: richText([
      "Every client engagement starts with a discovery conversation, and a handful of automations come up so often that we now consider them table stakes rather than nice-to-haves. None of them require premium connectors or custom development — they're built entirely on what's already included in a standard Microsoft 365 license.",
      "The first is new-employee onboarding: a form submission that creates accounts, assigns licenses, adds the right group memberships, and notifies IT and the manager, instead of a checklist someone has to remember to run manually. The second is approval routing for anything currently happening over email — expense requests, time off, purchase approvals — replaced with a Teams-based approval flow that has an audit trail.",
      "The third is document expiration reminders for anything with a compliance date attached. The fourth is automatic filing: attachments from a specific inbox or form dropped straight into the right SharePoint library instead of sitting in someone's downloads folder. The fifth is a simple one that saves the most time in practice — a status digest that pulls from Planner or a SharePoint list and posts a summary to a Teams channel every morning, so nobody has to ask \"where are we on this\" in a meeting.",
      "None of these are dramatic on their own. Together, they remove dozens of small manual steps a week, and that's usually where the ninety-day return on the whole engagement comes from.",
    ]),
  },
  {
    title: "What Power Platform Governance Actually Looks Like", slug: "what-power-platform-governance-actually-looks-like",
    excerpt: "How to let people build without losing track of what's running in your tenant.",
    tag: "Power Platform", status: "published" as const, publishedDate: "2025-08-18T00:00:00.000Z",
    body: richText([
      "\"Governance\" tends to sound like a euphemism for slowing everyone down, so it's worth being specific about what it actually means for Power Platform: knowing what environments exist, who can create new ones, where data can flow, and which apps are actually in use versus abandoned after a demo.",
      "In practice this is a short list of decisions made once. Environment strategy — production apps live somewhere separate from someone's personal sandbox. Data loss prevention policies — which connectors can mix in the same flow, so a well-meaning automation doesn't quietly push internal data to a personal Dropbox. And an inventory review every quarter, because the biggest risk in most tenants isn't a malicious app, it's the twelve apps nobody remembers building that still have full permissions to a SharePoint site.",
      "Done right, none of this is visible to the person building a legitimate app for their team — it just means the guardrails were already there before they needed them.",
    ]),
  },
  {
    title: "Cross-Tenant Migrations: What Actually Breaks", slug: "cross-tenant-migrations-what-actually-breaks",
    excerpt: "The parts of a Microsoft 365 migration that don't show up until go-live day.",
    tag: "Migration", status: "published" as const, publishedDate: "2025-07-25T00:00:00.000Z",
    body: richText([
      "Most migration plans account for mailboxes, files, and Teams — the things everyone remembers to check. What actually causes go-live problems is almost always something adjacent: a third-party app that authenticates against the old tenant ID, a shared mailbox delegation that didn't carry over, or distribution list membership that silently resets.",
      "The pattern we see most often is scope creep in reverse — someone assumes the migration is 'just email and files' until testing surfaces the five integrations that quietly depend on the old tenant. Power BI reports pointing at an old dataset. A CRM connector authenticated with a service account that no longer exists. Conditional access policies that reference groups by ID rather than name.",
      "The fix isn't more caution during the cutover — it's a proper inventory beforehand: every app, every integration, every delegated mailbox, mapped before a single account moves. Migrations that go smoothly aren't lucky, they're the ones where this inventory step wasn't skipped to save a week.",
    ]),
  },
  {
    title: "The Real Cost of 'We'll Just Use the Defaults'", slug: "the-real-cost-of-well-just-use-the-defaults",
    excerpt: "Why the out-of-the-box Microsoft 365 setup quietly costs more than a proper configuration.",
    tag: "General", status: "published" as const, publishedDate: "2025-06-14T00:00:00.000Z",
    body: richText([
      "Every Microsoft 365 tenant starts from the same defaults, and those defaults are designed to let any business get up and running in an afternoon — not to fit any specific business well. That's a reasonable trade-off for day one. The problem is most tenants never revisit it, and the defaults quietly stay in place for years.",
      "The cost shows up in three places. Licensing, because the default assignment process is 'give everyone the same tier' rather than matching seats to actual usage. Security, because the out-of-the-box baseline is deliberately permissive so nothing breaks on day one, which means MFA, conditional access, and data loss prevention are all opt-in rather than default. And adoption, because the default Teams and SharePoint structure is generic, so people fall back to email and shared drives instead of using what they're already paying for.",
      "None of this requires a full platform overhaul to fix. It requires someone to actually look at what's configured versus what's default, and make deliberate choices about the handful of settings that matter for your specific business. That's a day of work that usually pays for itself within a month.",
    ]),
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
