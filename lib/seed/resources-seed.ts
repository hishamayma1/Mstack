// Seed data for the "blog-posts", "guides", "tools", and "faqs" Payload
// collections, inserted once by the onInit hook in payload.config.ts if
// each collection is empty. Mirrors the placeholder copy the site shipped
// with before these became CMS-managed.

// Builds the Lexical JSON shape the richText field expects. A plain string is
// a paragraph; the object forms cover what the article page renders
// specially — section headings (which build its table of contents), bullet
// lists, and the Callout / Code blocks registered on the blog-posts editor.
// `coverImage` isn't filled here: it's a media upload relation, and a text
// seed can't create one — the page draws its own cover art until a real
// image is added in /admin.
type RichEntry =
  | string
  | { h2: string }
  | { h3: string }
  | { ul: string[] }
  | { callout: { tone: "info" | "tip" | "warning"; title?: string; content: string } }
  | { code: { language: string; code: string } }
  // Any other block from collections/blog-blocks.ts, by slug.
  | { block: string; fields: Record<string, unknown> }

const base = { direction: "ltr" as const, format: "" as const, indent: 0, version: 1 }
const text = (t: string) => ({ type: "text", detail: 0, format: 0, mode: "normal" as const, style: "", text: t, version: 1 })

// Block nodes need an id; a stable one keeps re-seeds deterministic.
let blockCounter = 0
const blockId = () => (++blockCounter).toString(16).padStart(24, "0")

function node(entry: RichEntry) {
  if (typeof entry === "string") return { ...base, type: "paragraph", children: [text(entry)] }
  if ("h2" in entry) return { ...base, type: "heading", tag: "h2", children: [text(entry.h2)] }
  if ("h3" in entry) return { ...base, type: "heading", tag: "h3", children: [text(entry.h3)] }
  if ("ul" in entry) {
    return {
      ...base,
      type: "list",
      listType: "bullet",
      tag: "ul",
      start: 1,
      children: entry.ul.map((item, i) => ({ ...base, type: "listitem", value: i + 1, children: [text(item)] })),
    }
  }
  if ("block" in entry) {
    return { type: "block", version: 2, format: "", fields: { id: blockId(), blockName: "", blockType: entry.block, ...entry.fields } }
  }
  if ("callout" in entry) {
    return { type: "block", version: 2, format: "", fields: { id: blockId(), blockName: "", blockType: "Callout", ...entry.callout } }
  }
  return { type: "block", version: 2, format: "", fields: { id: blockId(), blockName: "", blockType: "Code", ...entry.code } }
}

function richText(entries: RichEntry[]) {
  return { root: { ...base, type: "root", children: entries.map(node) } }
}

export const BLOG_POSTS_SEED = [
  {
    title: "5 Signs Your Tenant Needs a Security Audit", slug: "5-signs-your-tenant-needs-a-security-audit",
    excerpt: "The early warning signs we look for before recommending a full Secure 365 engagement.",
    tag: "Security", status: "published" as const, publishedDate: "2025-11-10T00:00:00.000Z",
    featured: true,
    author: { name: "Maged", role: "Microsoft Entra & Security Expert" },
    keyTakeaways: [
      { point: "MFA that looks complete on paper usually has gaps in shared mailboxes and service accounts." },
      { point: "Conditional access only counts if it has been tested against a real unmanaged sign-in." },
      { point: "Standing Global Administrator assignments are the easiest win in almost every tenant." },
    ],
    body: richText([
      "Most tenants we audit have never had a formal security review — they've just accumulated defaults since the day someone in the office first signed up for Microsoft 365. That's not a criticism, it's just how the platform gets adopted. But a few patterns show up over and over in the tenants that are quietly exposed, and they're worth checking yourself before they become an incident.",
      { h2: "MFA with silent gaps" },
      "The first is MFA coverage that looks complete on paper but has silent gaps — a handful of shared mailboxes, a service account, or an admin who enrolled a second device and never re-verified it.",
      { h2: "Conditional access nobody tested" },
      "The second is conditional access policies that exist but were never tested against a real sign-in from an unmanaged device. A policy in report-only mode protects nothing.",
      { h2: "Admin roles that never expire" },
      "The third is sprawling admin role assignments: Global Administrator handed out to solve a one-off problem two years ago, and never revoked. You can list every permanent holder in a minute:",
      {
        code: {
          language: "powershell",
          code: 'Connect-MgGraph -Scopes "RoleManagement.Read.Directory"\n$role = Get-MgDirectoryRole -Filter "displayName eq \'Global Administrator\'"\nGet-MgDirectoryRoleMember -DirectoryRoleId $role.Id | Select-Object Id, AdditionalProperties',
        },
      },
      {
        callout: {
          tone: "tip",
          title: "Aim for two to four",
          content: "Keep two to four Global Administrators, one of them a break-glass account excluded from conditional access and monitored for every sign-in.",
        },
      },
      { h2: "Why it adds up" },
      "None of these individually causes a breach. Together, they're usually how one happens — an attacker doesn't need a zero-day when the front door has three keys under the mat. A tenant-wide audit takes a day or two and gives you a prioritized list instead of a vague sense that something might be wrong.",
      "If you recognize more than one of these in your own environment, that's the signal to book a review before it becomes an incident report instead of a checklist.",
    ]),
  },
  {
    title: "SharePoint vs. File Servers: Making the Switch", slug: "sharepoint-vs-file-servers",
    excerpt: "A practical breakdown of what changes for your team, and how to plan a smooth migration.",
    tag: "SharePoint", status: "published" as const, publishedDate: "2025-10-22T00:00:00.000Z",
    author: { name: "Omar Abdelmagied", role: "Microsoft 365 Consultant" },
    keyTakeaways: [
      { point: "SharePoint keeps the folder tree people know, and adds versions, co-authoring and finer permissions." },
      { point: "Redesign the structure before you move it — don't migrate a decade of chaos verbatim." },
      { point: "Audit permissions first, train briefly, and freeze the old server during cutover." },
    ],
    body: richText([
      "The most common objection we hear about moving off a file server isn't technical — it's \"our folder structure works fine, why touch it.\" Fair. But a file server and SharePoint solve different problems, and the gap becomes obvious the moment more than one person needs to open the same file, or someone needs access from outside the office.",
      { h2: "What actually changes" },
      {
        block: "ComparisonTable",
        fields: {
          rowHeader: "Capability",
          columns: [{ label: "File server" }, { label: "SharePoint", highlight: true }],
          rows: [
            { label: "Version history", cells: [{ value: "no" }, { value: "yes" }] },
            { label: "Two people editing one file", cells: [{ value: "no" }, { value: "yes" }] },
            { label: "Access outside the office", cells: [{ value: "VPN only" }, { value: "yes" }] },
            { label: "Per-file permissions", cells: [{ value: "partial" }, { value: "yes" }] },
            { label: "Recycle bin for users", cells: [{ value: "no" }, { value: "93 days" }] },
          ],
          style: { striped: true, compact: false, mobile: "stack" },
        },
      },
      "A file server gives you a folder tree and, usually, an all-or-nothing permission model per share. SharePoint gives you the same folder tree, but every file gets version history, co-authoring, and permissions that can be scoped per library or even per file without asking IT to touch a group policy.",
      { h2: "Redesign before you move" },
      "The migration itself is mechanical — the real work is deciding what the new structure should be, because copying a decade of accumulated folder chaos verbatim just moves the mess somewhere newer.",
      { h2: "A calm cutover" },
      {
        block: "Checklist",
        fields: {
          title: "Before go-live",
          items: [
            { label: "Audit who can reach every share today", detail: "Do this before the move, not after." },
            { label: "Agree the new library structure with each team" },
            { label: "Run a 30-minute co-authoring session", detail: "So people stop emailing attachments to themselves." },
            { label: "Set the old server to read-only for the freeze window" },
          ],
        },
      },
      "Done that way, the switch is a non-event for most staff — which is exactly the goal.",
    ]),
  },
  {
    title: "Power Automate Workflows Every Business Should Have", slug: "power-automate-workflows-every-business-should-have",
    excerpt: "Five automations we build for almost every client in their first 90 days.",
    tag: "Automation", status: "published" as const, publishedDate: "2025-09-30T00:00:00.000Z",
    author: { name: "Sam", role: "Power Platform Developer" },
    body: richText([
      "Every client engagement starts with a discovery conversation, and a handful of automations come up so often that we now consider them table stakes rather than nice-to-haves. None of them require premium connectors or custom development — they're built entirely on what's already included in a standard Microsoft 365 license.",
      { h2: "The five flows" },
      {
        block: "Steps",
        fields: {
          layout: "timeline",
          highlightLast: true,
          steps: [
            { title: "New-employee onboarding", description: "A form creates the account, assigns licences and groups, and tells IT and the manager." },
            { title: "Approval routing", description: "Expenses, time off and purchases move from email to Teams approvals with an audit trail." },
            { title: "Expiry reminders", description: "Anything with a compliance date nudges its owner before it lapses." },
            { title: "Automatic filing", description: "Attachments from an inbox or form land in the right SharePoint library." },
            { title: "Morning status digest", description: "Planner or list updates posted to a Teams channel, so nobody asks \"where are we on this\"." },
          ],
        },
      },
      { h2: "What it adds up to" },
      {
        block: "Stats",
        fields: {
          items: [
            { value: "5", label: "flows, all on standard licences" },
            { value: "0", label: "premium connectors needed" },
            { value: "90 days", label: "typical payback on the engagement" },
          ],
        },
      },
      "None of these are dramatic on their own. Together, they remove dozens of small manual steps a week, and that's usually where the ninety-day return on the whole engagement comes from.",
    ]),
  },
  {
    title: "What Power Platform Governance Actually Looks Like", slug: "what-power-platform-governance-actually-looks-like",
    excerpt: "How to let people build without losing track of what's running in your tenant.",
    tag: "Power Platform", status: "published" as const, publishedDate: "2025-08-18T00:00:00.000Z",
    body: richText([
      "\"Governance\" tends to sound like a euphemism for slowing everyone down, so it's worth being specific about what it actually means for Power Platform: knowing what environments exist, who can create new ones, where data can flow, and which apps are actually in use versus abandoned after a demo.",
      { h2: "Three decisions, made once" },
      { h3: "Environment strategy" },
      "Production apps live somewhere separate from someone's personal sandbox.",
      { h3: "Data loss prevention" },
      "Decide which connectors can mix in the same flow, so a well-meaning automation doesn't quietly push internal data to a personal Dropbox.",
      { h3: "A quarterly inventory" },
      "The biggest risk in most tenants isn't a malicious app — it's the twelve apps nobody remembers building that still have full permissions to a SharePoint site.",
      { h2: "Open building vs. locked down" },
      {
        block: "ProsCons",
        fields: {
          prosTitle: "With guardrails",
          pros: [
            { point: "Teams build what they need without waiting on IT" },
            { point: "Data can only flow where policy allows" },
            { point: "Orphaned apps are found every quarter" },
          ],
          consTitle: "Without them",
          cons: [
            { point: "Nobody knows what's running in production" },
            { point: "Connectors mix business and personal data" },
            { point: "Leavers' apps keep full permissions" },
          ],
        },
      },
      {
        block: "PullQuote",
        fields: {
          quote: "Done right, none of this is visible to the person building a legitimate app. The guardrails were just already there before they needed them.",
          attribution: "Sam",
          role: "Power Platform Developer",
        },
      },
    ]),
  },
  {
    title: "Cross-Tenant Migrations: What Actually Breaks", slug: "cross-tenant-migrations-what-actually-breaks",
    excerpt: "The parts of a Microsoft 365 migration that don't show up until go-live day.",
    tag: "Migration", status: "published" as const, publishedDate: "2025-07-25T00:00:00.000Z",
    featured: true,
    keyTakeaways: [
      { point: "Mailboxes and files rarely break a migration — the integrations around them do." },
      { point: "Anything that references the old tenant by ID has to be found before cutover." },
      { point: "A full inventory up front is the cheapest week of the whole project." },
    ],
    body: richText([
      "Most migration plans account for mailboxes, files, and Teams — the things everyone remembers to check. What actually causes go-live problems is almost always something adjacent: a third-party app that authenticates against the old tenant ID, a shared mailbox delegation that didn't carry over, or distribution list membership that silently resets.",
      { h2: "Scope creep in reverse" },
      "The pattern we see most often is someone assuming the migration is 'just email and files' until testing surfaces the five integrations that quietly depend on the old tenant:",
      {
        ul: [
          "Power BI reports pointing at an old dataset.",
          "A CRM connector authenticated with a service account that no longer exists.",
          "Conditional access policies that reference groups by ID rather than name.",
        ],
      },
      {
        callout: {
          tone: "warning",
          title: "Don't cut over on a Friday",
          content: "Integration failures surface on the first working day. Schedule the cutover so that day is one your team is fully staffed.",
        },
      },
      { h2: "Inventory before anything moves" },
      "The fix isn't more caution during the cutover — it's a proper inventory beforehand: every app, every integration, every delegated mailbox, mapped before a single account moves. Migrations that go smoothly aren't lucky, they're the ones where this inventory step wasn't skipped to save a week.",
    ]),
  },
  {
    title: "The Real Cost of 'We'll Just Use the Defaults'", slug: "the-real-cost-of-well-just-use-the-defaults",
    excerpt: "Why the out-of-the-box Microsoft 365 setup quietly costs more than a proper configuration.",
    tag: "General", status: "published" as const, publishedDate: "2025-06-14T00:00:00.000Z",
    body: richText([
      "Every Microsoft 365 tenant starts from the same defaults, and those defaults are designed to let any business get up and running in an afternoon — not to fit any specific business well. That's a reasonable trade-off for day one. The problem is most tenants never revisit it, and the defaults quietly stay in place for years.",
      { h2: "Where the cost shows up" },
      { h3: "Licensing" },
      "The default assignment process is 'give everyone the same tier' rather than matching seats to actual usage.",
      { h3: "Security" },
      "The out-of-the-box baseline is deliberately permissive so nothing breaks on day one, which means MFA, conditional access, and data loss prevention are all opt-in rather than default.",
      { h3: "Adoption" },
      "The default Teams and SharePoint structure is generic, so people fall back to email and shared drives instead of using what they're already paying for.",
      { h2: "The fix is a day, not a project" },
      "None of this requires a full platform overhaul. It requires someone to look at what's configured versus what's default, and make deliberate choices about the handful of settings that matter for your business. That's a day of work that usually pays for itself within a month.",
      {
        block: "InlineCTA",
        fields: {
          title: "Want us to do that day for you?",
          text: "We review your tenant against the defaults and hand you a prioritised list.",
          buttonLabel: "Book a Free Call",
          href: "/contact",
        },
      },
    ]),
  },
  {
    title: "Break Free From GoDaddy: Defederate to Microsoft 365 the Smart Way", slug: "defederate-godaddy-microsoft-365",
    excerpt: "Bought Microsoft 365 through GoDaddy? You're paying more and controlling less. Here's how to take your tenant back without losing a single email.",
    tag: "Migration", status: "published" as const, publishedDate: "2025-12-02T00:00:00.000Z",
    featured: true,
    author: {
      name: "Ahmed Masoud",
      role: "Founder & CEO",
      bio: "Ahmed and the MStack360 team deliver Microsoft 365 migrations, security and Power Platform projects for businesses across North America, Europe, Australia and the Middle East.",
    },
    keyTakeaways: [
      { point: "GoDaddy limits your admin access and security settings." },
      { point: "Defederation gives you full control and a free choice of billing partner." },
      { point: "Buy new licences first. Cancel GoDaddy last." },
    ],
    body: richText([
      "When you buy Microsoft 365 through GoDaddy, your tenant is federated. GoDaddy sits between you and Microsoft: your users sign in through a GoDaddy page, and your admin access is limited to what GoDaddy chooses to expose.",
      { h2: "Why leave GoDaddy" },
      "That means no full access to the Microsoft 365 admin center, fewer security controls, and billing you can't move to a partner of your choice. Defederation removes GoDaddy from the middle and hands the keys back to you.",
      {
        callout: {
          tone: "warning",
          title: "Don't cancel your GoDaddy subscription first",
          content: "Cancelling before new licences are in place can remove your users and their data. Buy and assign the new licences, then cancel.",
        },
      },
      { h2: "What changes for you" },
      {
        block: "ComparisonTable",
        fields: {
          columns: [{ label: "Through GoDaddy" }, { label: "After defederation", highlight: true }],
          rows: [
            { label: "Admin access", cells: [{ value: "partial" }, { value: "Full Global Admin" }] },
            { label: "Sign-in page", cells: [{ value: "GoDaddy branded" }, { value: "Microsoft, with your branding" }] },
            { label: "Conditional access & Defender", cells: [{ value: "no" }, { value: "yes" }] },
            { label: "Choice of billing partner", cells: [{ value: "no" }, { value: "yes" }] },
          ],
          style: { striped: true, compact: false, mobile: "stack" },
          footnote: "Exact admin limits vary by GoDaddy plan.",
        },
      },
      { h2: "The six steps" },
      {
        block: "Steps",
        fields: {
          layout: "grid",
          highlightLast: true,
          steps: [
            { title: "Take inventory", description: "List every user, licence, shared mailbox and domain." },
            { title: "Secure admin access", description: "Make sure you hold a working Global Admin account." },
            { title: "Buy new licences", description: "Purchase matching licences from Microsoft or your partner." },
            { title: "Remove federation", description: "Convert your domain from federated to managed." },
            { title: "Reset passwords, turn on MFA", description: "Users now sign in with Microsoft directly." },
            { title: "Swap licences, cancel GoDaddy", description: "Only once every user is on the new plan." },
          ],
        },
      },
      { h2: "Check your domain" },
      "Run this in PowerShell with the Microsoft Graph module to see whether your domain is still federated:",
      {
        code: {
          language: "powershell",
          code: 'Connect-MgGraph -Scopes "Domain.Read.All"\nGet-MgDomain | Select-Object Id, AuthenticationType',
        },
      },
      "If AuthenticationType shows Federated, GoDaddy is still in control. After the switch it should read Managed.",
      { h2: "After the switch" },
      "You now own your tenant. This is the right moment to review the settings GoDaddy never let you reach:",
      {
        block: "Checklist",
        fields: {
          title: "First week after defederation",
          items: [
            { label: "Turn on security defaults or conditional access" },
            { label: "Require MFA for every admin" },
            { label: "Create a break-glass admin account", detail: "Excluded from conditional access, monitored for every sign-in." },
            { label: "Set up SPF, DKIM and DMARC for your domain" },
            { label: "Decide on a backup for mail and OneDrive" },
          ],
        },
      },
      {
        block: "FAQ",
        fields: {
          title: "Questions we hear on every GoDaddy call",
          items: [
            { question: "Will users lose email during the switch?", answer: "No. Mailboxes stay in the same tenant — only who manages it changes. Plan the password reset for a quiet hour and users are back in within minutes." },
            { question: "Do we need to buy new licences?", answer: "Yes. GoDaddy licences end when you cancel, so matching licences from Microsoft or a partner must be assigned first." },
            { question: "How long does it take?", answer: "For most small businesses, the technical work is a single evening. The planning beforehand is what makes it uneventful." },
          ],
        },
      },
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
