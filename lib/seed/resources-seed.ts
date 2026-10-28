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
  | { callout: { tone: "info" | "tip" | "warning" | "success"; title?: string; content: string } }
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
  {
    title: "Ready to Modernise Your Business Phone System?", slug: "ready-to-modernise-your-business-phone-system",
    excerpt: "Teams Phone replaces the PBX in your closet with a cloud phone system built into Microsoft Teams. Here's how it works, how you connect it, and what it really costs.",
    tag: "General", status: "published" as const, publishedDate: "2026-08-07T19:56:04.000Z",
    keyTakeaways: [
      { point: "Your number follows you, not your desk: laptop, phone or tablet, same number everywhere." },
      { point: "You need two pieces: a Teams Phone licence (included in E5) and one of three ways to connect." },
      { point: "Teams Phone is often 30 to 60 percent cheaper than a PBX, but get a full quote, not the headline price." },
    ],
    body: richText([
      { h2: "What Teams Phone actually is" },
      "Teams Phone is a cloud based phone system built right into Microsoft Teams. There is no hardware box, no wiring, and no server rack. It is all software, which means you can get started in minutes rather than days. The most important thing to understand is that your phone number is no longer tied to a desk or a location. It is tied to you. When someone calls your business number, it rings on whichever device you are signed into, whether that is your laptop, your smartphone, or your tablet, and it uses the same number everywhere.",
      {
        callout: {
          tone: "info",
          title: "Why this matters",
          content: "You are not stuck at your desk to take business calls. Work from home, a coffee shop, or a client office, and your work phone goes with you. If someone calls your office number while you are at home, it rings on your laptop, you answer with your headset, and the caller has no idea you are not at your desk. Need to step away? Transfer the call to your smartphone and keep talking as you walk.",
        },
      },
      { h2: "How it replaces a traditional phone system" },
      "For decades, a business phone system meant a large box in a closet called a PBX, short for private branch exchange, that routed calls through copper wires. Teams Phone does the same job in software. Here is how the two compare.",
      {
        block: "ComparisonTable",
        fields: {
          columns: [{ label: "Traditional PBX" }, { label: "Teams Phone", highlight: true }],
          rows: [
            { label: "Where it lives", cells: [{ value: "A physical box in a closet in your office" }, { value: "Microsoft cloud data centres" }] },
            { label: "Wiring", cells: [{ value: "A phone line wired to every desk" }, { value: "An internet connection, nothing else" }] },
            { label: "Adding a new person", cells: [{ value: "Order a line, wait days, book a technician" }, { value: "Assign a licence and number in about 5 minutes" }] },
            { label: "Voicemail", cells: [{ value: "A separate system with its own storage" }, { value: "Built in, with transcription in Teams" }] },
            { label: "Replacement cycle", cells: [{ value: "Replace the whole box every 5 to 7 years" }, { value: "No hardware to age out or replace" }] },
          ],
          style: { striped: true, compact: false, mobile: "stack" },
        },
      },
      "Instead of buying and maintaining your own switchboard, you rent a spot on Microsoft's switchboard. Microsoft handles the complicated parts like routing, redundancy, and security updates. You just say which users get which numbers. That means a five person company can have the same phone system capabilities as a five thousand person company, with auto attendants, call queues, and voicemail transcription all included rather than bought as extra hardware. Your phone system scales with your business, so growing from 10 people to 50 just means more licences, not a bigger box in the closet.",
      { h2: "The three ways to connect to the phone network" },
      "Teams handles internal calls between people in your company for free. But to call a regular phone number, like a customer's mobile or a supplier's landline, you need a connection to the public telephone network, which is the network every phone in the world is connected to. Microsoft gives you three ways to get there.",
      {
        block: "ComparisonTable",
        fields: {
          columns: [{ label: "Microsoft calling plans" }, { label: "Operator Connect" }, { label: "Direct Routing" }],
          rows: [
            { label: "In short", cells: [{ value: "Simplest" }, { value: "Keep your carrier" }, { value: "Most flexible" }] },
            {
              label: "How it works",
              cells: [
                { value: "You buy phone numbers and calling minutes directly from Microsoft, and they handle everything. You do not need to speak to a phone carrier at all." },
                { value: "You keep your existing phone carrier, but they connect directly into Teams with no extra hardware needed. Your carrier manages the connection on their end." },
                { value: "You use your own equipment, a device called a session border controller, to connect your existing phone lines to Teams." },
              ],
            },
            {
              label: "Strengths",
              cells: [
                { value: "No carrier to manage, fully managed by Microsoft, quick to set up" },
                { value: "Use your existing phone carrier, no hardware to buy or manage, the simplicity of a managed service" },
                { value: "Keep existing phone lines and trunks, maximum control and flexibility, often the lowest cost option" },
              ],
            },
            {
              label: "Watch out for",
              cells: [
                { value: "Only available in certain countries, so offices where Microsoft does not offer it need another option" },
                { value: "Your carrier must support Operator Connect" },
                { value: "The most technical to set up, and needs someone who knows what they are doing, your own IT team or a partner" },
              ],
            },
            {
              label: "Best for",
              cells: [
                { value: "Organisations in countries where Microsoft calling plans are available" },
                { value: "Businesses that want an easy, managed experience with their current carrier" },
                { value: "Organisations with existing phone infrastructure and IT expertise" },
              ],
            },
          ],
          style: { striped: true, compact: false, mobile: "stack" },
          footnote: "All three deliver the full Teams experience: calls, voicemail, auto attendants, call queues and reporting.",
        },
      },
      {
        callout: {
          tone: "tip",
          title: "You are not locked into one approach",
          content: "A small business in the US might pick Microsoft calling plans for simplicity. A global company might use operator connect to keep local carriers in each region. A business that already has phone lines and a good carrier relationship might choose direct routing to save money. Do not let the technical names scare you, and know that a good partner can pick the right one for your situation. You do not need to become an expert on session border controllers.",
        },
      },
      { h2: "Licensing and costs, simplified" },
      "If you already have Microsoft 365, you are partway there because Teams is included in your subscription. But calling is an add on, and you need two separate pieces to make it work: a phone licence to unlock the phone system features, and a way to connect to the phone network, which is one of the three options above.",
      { h3: "1. A Teams Phone licence" },
      "This unlocks the phone system features like making and receiving calls, auto attendants, and voicemail. It costs roughly 8 to 10 US dollars per user each month. If you already have an E5 licence, this is included, so you do not need to buy it separately.",
      { h3: "2. A way to connect" },
      "On top of the phone licence, you add one of the three connection options. A Microsoft calling plan runs roughly 8 to 15 US dollars per user each month depending on the minutes you need. Operator connect and direct routing are often cheaper per minute but have different pricing structures.",
      {
        callout: {
          tone: "success",
          title: "Check your licence first, it can save you money",
          content: "If you have a Microsoft 365 E5 licence, the phone system is already included, so you do not need a separate Teams Phone licence. If you have E3 or Business Premium, you will need to add the Teams Phone licence yourself. You can check this in the Microsoft 365 admin centre under billing, and it takes about two minutes. Note that even with E5, the phone system does not include the calling connection, so you still need one of the three options above to call regular phone numbers.",
        },
      },
      "How does this compare to the old way? A traditional on premise PBX costs roughly 15 to 25 US dollars per user each month once you factor in hardware, maintenance contracts, and phone lines, and that is before the thousands of dollars of hardware you buy up front. Teams Phone is often 30 to 60 percent cheaper. For a 10 person company, Teams Phone might cost 150 to 250 US dollars per month in total, while a traditional PBX for the same company could easily run 300 to 500 US dollars per month plus the up front hardware.",
      {
        callout: {
          tone: "warning",
          title: "Watch the real world cost, not just the headline price",
          content: "The true cost can be two to three times the headline licence price once you add calling minutes, international calling, and support. Do not just look at the 10 dollar number and assume that is your total. Get a full quote before you decide, and remember to factor in your internet connection, since Teams Phone needs good internet to work well and you may need to upgrade a slow or unreliable line.",
        },
      },
      { h2: "What comes built in" },
      { h3: "Voicemail with transcription" },
      "When someone leaves a message, you get a written transcript right in your Teams chat, so you can read it instantly instead of dialling into a voicemail box. If you want the recording, you can play it back with one click, but most of the time the transcript is enough.",
      { h3: "Auto attendants" },
      "A virtual receptionist that greets callers and routes them to the right place, such as press one for sales, press two for support. It handles this automatically based on the time of day, the day of the week, and even holidays, and can play a different greeting when your office is closed.",
      { h3: "Call queues" },
      "When someone presses one for sales, the call goes into a queue and rings the first available person on that team. If everyone is busy, the caller hears music or a message while they wait, and the system spreads calls evenly so nobody gets overwhelmed.",
      { h3: "Delegation" },
      "An assistant can make and receive calls on behalf of a manager. When they call out, it shows up as the manager's number, so if a client calls back they reach the manager, not the assistant. It is a small thing that makes your company sound more professional.",
      { h3: "Call park" },
      "You put a call on hold and the system gives you a code. Walk to another room, pick up a different phone, enter the code, and the call connects. It is ideal for moving between meeting rooms or handing a call to a colleague elsewhere in the building.",
      { h3: "Presence integration" },
      "You can see if someone is already on a call before you ring them, because their status shows right next to their name. That means you know not to interrupt, and you waste fewer calls reaching voicemail because the person is already talking to someone else.",
      "A small law firm with three lawyers can set up an auto attendant on their main number where callers press one for the first lawyer, two for the second, and three for the third. If nobody answers, the call goes to voicemail and the lawyer gets a transcript in their Teams chat, then calls back from their laptop or phone. No receptionist, no extra hardware, no separate voicemail system, and it all works inside the app they already use for email and meetings.",
      { h2: "Security and reliability" },
      "Moving your phone system to the cloud can sound risky. What if it goes down, or someone listens in on your calls? Those are fair questions, and here is how Microsoft handles them.",
      {
        ul: [
          "Encryption in transit. Every call is scrambled as it travels between you and the other person, using the same security standards as online banking. For one to one calls, you can turn on end to end encryption so that not even Microsoft can listen in.",
          "99.999 percent uptime. Microsoft targets a level of uptime that works out to less than five minutes of downtime per year. Because calls run across multiple data centres, if one goes down another takes over automatically, which a single box in your office cannot match.",
          "Identity protection. Teams uses your Microsoft 365 login, so if you have multi factor authentication turned on, your phone system is protected by the same security. Someone cannot simply pick up a desk phone and make calls as you, because they need your credentials and your second factor.",
          "Compliance built in. Teams Phone supports standards like HIPAA for healthcare and GDPR for privacy. Recording and archiving are included, so if you are in a regulated industry you can record calls, store them securely, and produce them for audits without buying separate software.",
        ],
      },
      {
        callout: {
          tone: "info",
          title: "The same protection as the rest of Microsoft 365",
          content: "Your phone system is now as secure as the rest of your Microsoft 365 environment, so you do not need a separate security setup for your phones. The same policies that protect your email and files also protect your calls. In practice the cloud version is often more secure than an old on premise system, because Microsoft has security teams and infrastructure most small businesses could never afford on their own.",
        },
      },
      { h2: "How all the pieces connect" },
      "Teams Phone is not one single thing. It is a cloud PBX, a connection to the phone network, and a set of features, all wrapped in the Teams app you already use for chat and meetings. Here is how a single incoming call flows through the system from start to finish.",
      {
        block: "Steps",
        fields: {
          layout: "timeline",
          highlightLast: true,
          steps: [
            { title: "A customer calls your main number", description: "The auto attendant answers automatically and plays your greeting, with no person needed to pick up." },
            { title: "The caller chooses an option", description: "They press one for support, which sends the call into the right call queue for that team." },
            { title: "The queue rings the first available agent", description: "It rings on the agent's laptop. If that person is already on another call, the system rings the next available person instead." },
            { title: "If everyone is busy, the caller waits", description: "They hear music or a message on hold while the system keeps trying to connect them to someone." },
            { title: "If nobody answers, voicemail takes over", description: "The call goes to voicemail, the system transcribes the message, and the transcript lands in your Teams chat." },
            { title: "You read the transcript and call back", description: "You see who called and what they wanted, then call back from your laptop or phone. No missed calls, no lost messages." },
          ],
        },
      },
      "The magic is not any single feature. It is how they all connect. The auto attendant does not need someone to transfer calls, the call queue does not need someone to watch who is available, and voicemail does not need someone checking a separate inbox. It all just happens, so you do your job and the phone system handles the rest.",
      { h2: "Consultation to go live in 5 simple steps" },
      "Your journey to modern communication, structured, transparent, and fast.",
      {
        block: "Steps",
        fields: {
          layout: "grid",
          highlightLast: true,
          steps: [
            { title: "Discovery call", description: "We understand your needs and team structure in a focused 30 minute consultation. No pressure, just clarity." },
            { title: "Custom plan", description: "A tailored proposal with pricing and timeline, delivered within 24 to 48 hours. Exactly what you need, nothing you do not." },
            { title: "Setup and configuration", description: "We build your phone system in the background while you focus on business. Typically 2 to 5 days." },
            { title: "Number porting", description: "Seamless migration of your existing numbers, coordinated with your carrier. Zero downtime, zero disruption." },
            { title: "Training and handoff", description: "Comprehensive team training and complete documentation. Your team owns it confidently from day one." },
          ],
        },
      },
      {
        block: "InlineCTA",
        fields: {
          title: "Ready to modernise your business phone system?",
          text: "Stop wasting money on outdated phone systems. We check what your current licence already includes, recommend the connection option that fits your business, and build you a modern cloud based solution in just days. Free 15 minute intro call, no upfront costs for setup, live in 1 to 2 weeks.",
          buttonLabel: "Schedule free discovery call",
          href: "/contact",
        },
      },
    ]),
  },
  {
    title: "How to Restrict Who Can Create Teams in Your Tenant", slug: "how-to-restrict-who-can-create-teams-in-your-tenant",
    excerpt: "Teams creation is controlled by Microsoft 365 Group creation under the hood. One PowerShell script restricts it tenant-wide, with an optional group that keeps the right.",
    tag: "Security", status: "published" as const, publishedDate: "2026-08-06T21:40:33.000Z",
    keyTakeaways: [
      { point: "Restrict who can create Microsoft 365 Groups and Teams creation follows automatically." },
      { point: "Run the whole script: the first block creates the Group.Unified setting if your tenant lacks it." },
      { point: "It also blocks Planner plans, SharePoint team sites and anything else that creates a Group." },
    ],
    body: richText([
      "Teams creation is controlled by Microsoft 365 Group creation under the hood. Restrict who can create M365 Groups and Teams creation follows automatically. The script below applies that restriction tenant-wide and optionally allows a specific security group to bypass it.",
      { h2: "The PowerShell script" },
      {
        callout: {
          tone: "info",
          title: "Run the whole script, not just the bottom half",
          content: "The if block at the start checks whether the Group.Unified directory setting exists in your tenant and creates it if not. If the setting is missing and you skip that block, the Update-MgBetaDirectorySetting call at the end will fail with no useful error message.",
        },
      },
      {
        code: {
          language: "powershell",
          code: `Import-Module Microsoft.Graph.Beta.Identity.DirectoryManagement
Import-Module Microsoft.Graph.Beta.Groups
Connect-MgGraph -Scopes "Directory.ReadWrite.All", "Group.Read.All"

# Leave GroupName empty to block all users except Global Admins
$GroupName            = ""
$AllowGroupCreation   = "False"

$settingsObjectID = (Get-MgBetaDirectorySetting |
    Where-Object -Property Displayname -Value "Group.Unified" -EQ).id

if (!$settingsObjectID) {
    $params = @{
        templateId = "62375ab9-6b52-47ed-826b-58e47e0e304b"
        values = @(
            @{
                name  = "EnableMSStandardBlockedWords"
                value = $true
            }
        )
    }
    New-MgBetaDirectorySetting -BodyParameter $params
    $settingsObjectID = (Get-MgBetaDirectorySetting |
        Where-Object -Property Displayname -Value "Group.Unified" -EQ).Id
}

$groupId = (Get-MgBetaGroup -All |
    Where-Object { $_.displayname -eq $GroupName }).Id

$params = @{
    templateId = "62375ab9-6b52-47ed-826b-58e47e0e304b"
    values = @(
        @{
            name  = "EnableGroupCreation"
            value = $AllowGroupCreation
        }
        @{
            name  = "GroupCreationAllowedGroupId"
            value = $groupId
        }
    )
}
Update-MgBetaDirectorySetting -DirectorySettingId $settingsObjectID -BodyParameter $params

# Confirm the applied values
(Get-MgBetaDirectorySetting -DirectorySettingId $settingsObjectID).Values`,
        },
      },
      { h2: "Before you run this" },
      {
        block: "Checklist",
        fields: {
          title: "Before you run this",
          items: [
            {
              label: "Set your allowed group name",
              detail: "If you want a specific security group to retain the ability to create Teams and Groups, put its exact display name in $GroupName. Leave it empty to block all users across the tenant (Global Admins are always exempt regardless).",
            },
            {
              label: "Expect propagation delay",
              detail: "Changes to directory settings can take a few hours to reach all users across the tenant. Do not assume the setting failed if it does not take effect within minutes.",
            },
            {
              label: "Do not test with a Global Admin account",
              detail: "Global Admins can always create Groups and Teams regardless of this setting. If you test with your admin account and Teams creation still works, that is expected behaviour, not a sign the script failed. Test with a standard user account.",
            },
            {
              label: "Channel creation is a separate control",
              detail: "This script controls who can create new Teams and Groups. The ability to create channels within an existing Team is a different setting, managed under Teams meeting policies in the Teams admin center.",
            },
          ],
        },
      },
      {
        callout: {
          tone: "warning",
          title: "This setting affects more than Teams",
          content: "Restricting M365 Group creation also prevents those users from creating Planner plans, SharePoint team sites via the SharePoint start page, Yammer communities, and any other workload that provisions an M365 Group under the hood. Make sure the security group you put in $GroupName covers everyone who legitimately needs to create any of these resources, not just Teams.",
        },
      },
      "Microsoft reference: Manage who can create Microsoft 365 Groups, at learn.microsoft.com/en-us/microsoft-365/solutions/manage-creation-of-groups",
      {
        block: "InlineCTA",
        fields: {
          title: "Need help rolling this out across your tenant?",
          text: "We can review your current Group and Teams governance settings, identify gaps, and put together a policy that fits how your organisation actually works.",
          buttonLabel: "Book a session with MStack360",
          href: "/contact",
        },
      },
    ]),
  },
  {
    title: "Get Google Drive Files Into Teams in Five Steps", slug: "get-google-drive-files-into-teams-in-five-steps",
    excerpt: "You can share any Google Drive file in a Teams chat or channel by pasting its link. Teams builds a rich preview so people can identify and open it in a click.",
    tag: "General", status: "published" as const, publishedDate: "2026-08-06T21:32:03.000Z",
    keyTakeaways: [
      { point: "Paste a Google Drive link into any Teams chat or channel and Teams builds a rich preview." },
      { point: "Set access to \"Anyone with the link\" first, or your team hits a permissions error." },
      { point: "Previews work for Docs, Sheets, Slides and PDFs." },
    ],
    body: richText([
      "You can share any Google Drive file in a Teams chat or channel by pasting its link. Teams builds a rich preview so people can identify and open it in a click. Here is the full process.",
      { h2: "The five steps" },
      {
        block: "Steps",
        fields: {
          layout: "timeline",
          highlightLast: true,
          steps: [
            { title: "Open the file and start sharing", description: "In Google Drive, open the file you want to share and click the share icon at the top right. A dialog opens with the current access controls." },
            { title: "Set access to anyone with the link", description: "Click the \"Restricted\" drop down and choose \"Anyone with the link\" so your team members can open it. Google saves the change and shows an \"Access updated\" confirmation." },
            { title: "Copy the link", description: "Click \"Copy link\" at the bottom of the dialog. A \"Link copied\" message confirms the URL is on your clipboard. Click \"Done\" to close the dialog." },
            { title: "Paste it into Teams", description: "Switch to Microsoft Teams, open the chat or channel you want, click into the message box, paste the link, and click send." },
            { title: "Let the preview load", description: "After a moment, Teams generates a rich preview showing the file name and document type. This works for Docs, Sheets, Slides, and PDFs. Larger files and spreadsheets can take a few seconds." },
          ],
        },
      },
      {
        callout: {
          tone: "warning",
          title: "Set access before you share",
          content: "If you leave the file as \"Restricted\", your team members will hit a permissions error when they try to open it. If someone reports they cannot access a file, reopen the Google Drive share dialog and check the access level. Organization policies can sometimes override your sharing settings.",
        },
      },
      {
        block: "InlineCTA",
        fields: {
          title: "Want your whole team sharing files the right way?",
          text: "Without permission errors or one off fixes. MStack360 can set up clean, secure file sharing across Google Drive, SharePoint, and Teams for your business.",
          buttonLabel: "Book a call with MStack360",
          href: "/contact",
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
