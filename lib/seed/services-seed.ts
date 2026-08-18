// One-time seed for the `services` collection, so a fresh database has all
// nine /solutions/[slug] pages live instead of shipping empty.
//
// The copy is lifted from what the site already said in lib/content/site.ts
// (SERVICE_LEVELS and SOLUTION_ADDONS) so nothing contradicts the hub page.
//
// ── ABOUT THE NUMBERS ───────────────────────────────────────────────────────
// The rates below are PLACEHOLDERS. They are shaped like real MSP pricing —
// per-user rates that fall as headcount rises, a one-time onboarding fee
// waived on larger deals — but they are not your rates. Set them in
// /admin → Services → [service] → Pricing before this goes anywhere near a
// customer. Seeding only runs against an empty collection, so editing them
// there is permanent; nothing here will overwrite your changes later.
// ────────────────────────────────────────────────────────────────────────────

type SeedBand = { minSeats: number; maxSeats?: number; pricePerSeat: number; label?: string }
type SeedOption = {
  name: string
  description: string
  priceType: "per-seat-monthly" | "monthly-flat" | "one-time"
  amount: number
  defaultSelected?: boolean
}

// The same four-rung ladder across every priced service, so a customer moving
// up a level sees a consistent shape and only the rate changes.
function ladder(rates: [number, number, number, number]): SeedBand[] {
  return [
    { minSeats: 1, maxSeats: 10, pricePerSeat: rates[0], label: "Starter" },
    { minSeats: 11, maxSeats: 50, pricePerSeat: rates[1], label: "Growth" },
    { minSeats: 51, maxSeats: 250, pricePerSeat: rates[2], label: "Scale" },
    // Open-ended top rung — no headcount falls off the end of the ladder.
    { minSeats: 251, pricePerSeat: rates[3], label: "Enterprise" },
  ]
}

const SUPPORT_OPTION: SeedOption = {
  name: "Priority support (1-hour response)",
  description:
    "Named engineer, one-hour response target on P1 incidents, and out-of-hours cover for critical outages.",
  priceType: "per-seat-monthly",
  amount: 3,
}

const REVIEW_OPTION: SeedOption = {
  name: "Quarterly business review",
  description:
    "A half-day on-site or remote review each quarter: licence spend, security posture, and what's worth doing next.",
  priceType: "monthly-flat",
  amount: 150,
}

export const SERVICES_SEED: Record<string, unknown>[] = [
  {
    slug: "core-365",
    kind: "level",
    status: "published",
    order: 10,
    title: "Core 365",
    tagline: "The Foundation",
    headline: "Email and licences,\ndone properly once.",
    valueProp:
      "The groundwork everything else sits on: a correctly configured tenant, mailboxes migrated without a lost message, and licences that match your actual headcount rather than the one you had two years ago. Most tenants we inherit are paying for seats nobody uses.",
    stats: [
      { value: "0", label: "Emails lost in migration" },
      { value: "2 wks", label: "Typical time to live" },
      { value: "18%", label: "Average licence saving" },
    ],
    includes: [
      {
        title: "Mailbox migration",
        description:
          "Every mailbox, calendar and contact moved from your current host — on-prem Exchange, Google Workspace or another tenant — with mail flowing throughout.",
      },
      {
        title: "Tenant setup",
        description:
          "A clean Microsoft 365 tenant built to the naming, domain and admin standards you'll still be glad of in three years.",
      },
      {
        title: "Exchange Online & DNS configuration",
        description:
          "SPF, DKIM and DMARC configured properly, so your mail lands in inboxes instead of spam folders and nobody can spoof your domain.",
      },
      {
        title: "Licence optimisation",
        description:
          "We audit what you're paying for against what's actually assigned and in use, then right-size it. This alone often covers the setup fee.",
      },
    ],
    outcomes: [
      {
        title: "Email that just works",
        description: "No more mystery delivery failures, no more mailboxes at capacity.",
      },
      {
        title: "A licence bill you can explain",
        description: "Every seat accounted for, and a monthly figure that matches your headcount.",
      },
      {
        title: "A foundation that scales",
        description:
          "Built so the next four levels layer on top without anything having to be undone first.",
      },
    ],
    pricingMode: "per-seat",
    currency: "GBP",
    seatBands: ladder([6, 5, 4, 3.5]),
    setupFee: 750,
    setupFeeWaivedAtSeats: 100,
    minSeats: 1,
    maxSeats: 500,
    defaultSeats: 15,
    billingNote:
      "Estimate covers our service only — Microsoft licence costs are billed separately and depend on the plan you choose. 12-month term, billed monthly, 30 days' notice.",
    options: [
      {
        name: "Migration from a legacy platform",
        description:
          "Coming from on-prem Exchange, Google Workspace or another tenant, rather than starting fresh. Covers the cutover weekend.",
        priceType: "one-time",
        amount: 900,
      },
      {
        name: "End-user training session",
        description:
          "A live 90-minute walkthrough of Outlook, Teams and OneDrive for your staff, recorded so new joiners can watch it later.",
        priceType: "one-time",
        amount: 450,
      },
      SUPPORT_OPTION,
    ],
    faqs: [
      {
        question: "Will we lose email during the migration?",
        answer:
          "No. Mail flows to both the old and new systems during the cutover window, so nothing is dropped. We migrate the bulk of the data before the switch and sync the remainder afterwards.",
      },
      {
        question: "Do we have to buy licences through you?",
        answer:
          "No. We'll work with whatever you already have, including licences bought direct from Microsoft or through another partner. If you'd rather consolidate, we can take that over — but it isn't a condition.",
      },
    ],
    ctaHeadline: "Let's get the foundation right.",
    ctaSubtext:
      "Send us your headcount and current setup — we'll come back with a firm price and a migration date.",
    summary:
      "Email and Office apps configured correctly, on licences that match your headcount. Mailbox migration, tenant setup, DNS and licence optimisation.",
    bestFor: "New tenants & startups",
    highlights: [
      { label: "Mailbox Migration" },
      { label: "Tenant Setup" },
      { label: "DNS Configuration" },
      { label: "Licence Optimisation" },
    ],
  },

  {
    slug: "cloud-365",
    kind: "level",
    status: "published",
    order: 20,
    title: "Cloud 365",
    tagline: "The Hub",
    headline: "One place to work,\nnot five.",
    valueProp:
      "SharePoint, OneDrive and Teams configured as a single working environment instead of three products that happen to be in the same subscription. The file server goes away, and people stop emailing each other attachments.",
    stats: [
      { value: "1", label: "Place files live" },
      { value: "0", label: "On-prem file servers" },
      { value: "3 wks", label: "Typical rollout" },
    ],
    includes: [
      {
        title: "SharePoint architecture",
        description:
          "A site and permission structure designed around how your teams actually work, not a flat dump of the old shared drive.",
      },
      {
        title: "OneDrive rollout",
        description:
          "Known Folder Move so Desktop, Documents and Pictures sync automatically — staff get backup and versioning without changing a habit.",
      },
      {
        title: "Teams as the front door",
        description:
          "Channels mapped to your SharePoint structure, so a file posted in Teams lands somewhere sensible and findable.",
      },
      {
        title: "Outlook onboarding",
        description:
          "Shared mailboxes, calendars, distribution groups and signatures configured consistently across the business.",
      },
    ],
    outcomes: [
      {
        title: "Files have one home",
        description: "No more three versions of the same document in three different places.",
      },
      {
        title: "Remote work stops being a special case",
        description: "The same environment from the office, the kitchen table, or a client site.",
      },
      {
        title: "The file server can be retired",
        description: "Along with its backup regime, its UPS, and the replacement it was due.",
      },
    ],
    pricingMode: "per-seat",
    currency: "GBP",
    seatBands: ladder([9, 7.5, 6, 5]),
    setupFee: 1200,
    setupFeeWaivedAtSeats: 150,
    minSeats: 1,
    maxSeats: 500,
    defaultSeats: 25,
    billingNote:
      "Estimate covers our service only — Microsoft licence costs are billed separately. Includes Core 365 foundations if you don't already have them. 12-month term, billed monthly.",
    options: [
      {
        name: "File server decommission",
        description:
          "We migrate the remaining shares, verify nothing's been missed, and take the old server out of service cleanly.",
        priceType: "one-time",
        amount: 1400,
      },
      {
        name: "Teams Phone System",
        description:
          "Replace the legacy PBX with Teams calling: number porting, auto-attendants and call queues.",
        priceType: "per-seat-monthly",
        amount: 4,
      },
      {
        name: "Intranet home site",
        description:
          "A branded SharePoint landing page with news, policies and the links people actually ask for.",
        priceType: "one-time",
        amount: 2200,
      },
      SUPPORT_OPTION,
    ],
    faqs: [
      {
        question: "What happens to our existing folder structure?",
        answer:
          "We map it before we move it. Anything actively used comes across into a structure that makes sense; anything untouched for years gets archived rather than carried forward. You approve the map before migration starts.",
      },
      {
        question: "Do we need to keep the file server as a backup?",
        answer:
          "We usually leave it read-only for 30 days after cutover as a safety net, then decommission it. SharePoint and OneDrive keep versioned copies, so the ongoing backup case is much weaker than people expect.",
      },
    ],
    ctaHeadline: "Bring it all into one place.",
    ctaSubtext:
      "Tell us your headcount and where your files live today — we'll map the move and price it.",
    summary:
      "SharePoint, OneDrive and Teams as one working environment instead of five. Architecture, rollout and onboarding, with the file server retired.",
    bestFor: "Teams switching from file servers",
    highlights: [
      { label: "SharePoint" },
      { label: "OneDrive" },
      { label: "Teams" },
      { label: "Teams Phone" },
    ],
  },

  {
    slug: "secure-365",
    kind: "level",
    status: "published",
    order: 30,
    title: "Secure 365",
    tagline: "The Shield",
    headline: "Zero Trust,\nin practice.",
    valueProp:
      "MFA everywhere, conditional access that reflects how your business actually operates, managed devices, and threat protection that someone is watching. Not a policy document — a configuration you can demonstrate to an auditor or an insurer.",
    stats: [
      { value: "100%", label: "Accounts on MFA" },
      { value: "24/7", label: "Threat monitoring" },
      { value: "0", label: "Unmanaged devices" },
    ],
    includes: [
      {
        title: "MFA enforcement",
        description:
          "Multi-factor on every account including admins and service accounts, rolled out with a comms plan so it doesn't stop anyone working on day one.",
      },
      {
        title: "Conditional Access",
        description:
          "Policies built around your risk: block legacy authentication, restrict access by location and device state, step up for sensitive apps.",
      },
      {
        title: "Intune device management",
        description:
          "Company and BYOD devices enrolled, encrypted and compliant — with the ability to wipe company data from a lost phone without touching personal photos.",
      },
      {
        title: "Defender for Business",
        description:
          "Endpoint protection, attack surface reduction rules, and phishing defence configured and monitored rather than merely licensed.",
      },
    ],
    outcomes: [
      {
        title: "Nobody logs in without MFA",
        description: "The single control that stops the overwhelming majority of account takeovers.",
      },
      {
        title: "A lost laptop is an inconvenience",
        description: "Encrypted, remotely wipeable, and no longer a notifiable data breach.",
      },
      {
        title: "Insurance and audit questions get shorter",
        description: "Because the answer to each one is a screenshot rather than a project.",
      },
    ],
    pricingMode: "per-seat",
    currency: "GBP",
    seatBands: ladder([14, 12, 10, 8.5]),
    setupFee: 1500,
    setupFeeWaivedAtSeats: 200,
    minSeats: 1,
    maxSeats: 500,
    defaultSeats: 35,
    billingNote:
      "Estimate covers our service only — Microsoft licence costs (Business Premium or E3/E5 plus add-ons) are billed separately. 12-month term, billed monthly.",
    options: [
      {
        name: "Cyber Essentials Plus readiness",
        description:
          "We map your tenant against the scheme's controls, close the gaps, and prepare the evidence pack for assessment.",
        priceType: "one-time",
        amount: 2400,
      },
      {
        name: "Security awareness training",
        description:
          "Simulated phishing campaigns and short monthly training, with reporting on who's improving and who needs a word.",
        priceType: "per-seat-monthly",
        amount: 2,
      },
      {
        name: "Incident response retainer",
        description:
          "Guaranteed engineer availability within 2 hours if something goes wrong, plus a rehearsed response plan.",
        priceType: "monthly-flat",
        amount: 400,
      },
      REVIEW_OPTION,
    ],
    faqs: [
      {
        question: "Will MFA slow our staff down?",
        answer:
          "Barely. With Conditional Access configured properly, a known user on a compliant device in a usual location isn't prompted every time — the friction lands on the sign-ins that actually look unusual.",
      },
      {
        question: "We already have antivirus. Is this a replacement?",
        answer:
          "Usually yes, and usually cheaper. Defender for Business is included in Microsoft 365 Business Premium, so most clients are already paying for it and running a third-party product alongside. We'll tell you honestly if yours is worth keeping.",
      },
      {
        question: "Can you help with an insurance questionnaire?",
        answer:
          "Yes — we complete the technical sections for clients on this level as part of the service. Most of the questions map directly to controls we've already configured.",
      },
    ],
    ctaHeadline: "Make the answer to every security question 'yes'.",
    ctaSubtext:
      "Configure your headcount and requirements — we'll send a firm proposal and a hardening timeline.",
    summary:
      "Zero Trust in practice: MFA enforcement, Conditional Access, Intune device management and Defender for Business, configured and monitored.",
    bestFor: "Companies handling sensitive data",
    highlights: [
      { label: "MFA Enforcement" },
      { label: "Conditional Access" },
      { label: "Intune MDM" },
      { label: "Defender" },
    ],
  },

  {
    slug: "managed-365",
    kind: "level",
    status: "published",
    order: 40,
    title: "Managed 365",
    tagline: "The Control Center",
    headline: "We run it,\nday to day.",
    valueProp:
      "Your Microsoft 365 environment becomes our responsibility: monitored, governed, patched, and supported by a named team that already knows your setup. Joiners and leavers handled the same day, every time, without anyone chasing.",
    stats: [
      { value: "24/7", label: "Proactive monitoring" },
      { value: "< 1 hr", label: "P1 response" },
      { value: "Same day", label: "Joiners & leavers" },
    ],
    includes: [
      {
        title: "Proactive monitoring",
        description:
          "Service health, licence consumption, security alerts and backup status watched continuously — we usually know before you do.",
      },
      {
        title: "User lifecycle management",
        description:
          "Starters provisioned with the right access on day one; leavers disabled, mailbox delegated and licence reclaimed the same day.",
      },
      {
        title: "Helpdesk support",
        description:
          "Your staff raise tickets directly with us. A named team, not a queue that starts from scratch every time.",
      },
      {
        title: "Policy and configuration governance",
        description:
          "Regular checks that nothing has drifted: no rogue tenant settings, no sharing links quietly opened to the world.",
      },
      {
        title: "Health reporting",
        description:
          "A monthly report you can hand to your board — what happened, what it cost, what we recommend next.",
      },
    ],
    outcomes: [
      {
        title: "IT stops landing on someone's desk by accident",
        description: "No more 'the office manager who's good with computers' being the escalation path.",
      },
      {
        title: "Leavers actually lose access",
        description: "Same day, every time — the control most businesses assume they have and don't.",
      },
      {
        title: "Problems get fixed before they're reported",
        description: "Most of what we resolve, your staff never notice happened.",
      },
    ],
    pricingMode: "per-seat",
    currency: "GBP",
    seatBands: ladder([22, 19, 16, 14]),
    setupFee: 2000,
    setupFeeWaivedAtSeats: 250,
    minSeats: 5,
    maxSeats: 1000,
    defaultSeats: 50,
    billingNote:
      "Estimate covers our service only — Microsoft licence costs are billed separately. Includes unlimited helpdesk tickets during business hours. 12-month term, billed monthly.",
    options: [
      {
        name: "Out-of-hours support",
        description:
          "Evening and weekend cover for businesses that don't stop at 5pm — retail, hospitality and manufacturing shifts.",
        priceType: "per-seat-monthly",
        amount: 5,
      },
      {
        name: "Third-party backup",
        description:
          "Independent backup of Exchange, SharePoint, OneDrive and Teams with long retention — beyond Microsoft's own recycle bins.",
        priceType: "per-seat-monthly",
        amount: 3.5,
        defaultSelected: true,
      },
      {
        name: "On-site days",
        description: "A scheduled engineer on site each month for the work that's easier in person.",
        priceType: "monthly-flat",
        amount: 650,
      },
      REVIEW_OPTION,
    ],
    faqs: [
      {
        question: "Does this replace our internal IT person?",
        answer:
          "It doesn't have to. Plenty of our clients keep an internal person for the business-specific work and hand us the Microsoft 365 platform. Others use us as the whole function. Both work — tell us which you're after.",
      },
      {
        question: "What counts as unlimited support?",
        answer:
          "Anything to do with your Microsoft 365 environment and the devices we manage. Project work — a migration, a new office, a Power Platform build — is scoped and quoted separately so it never quietly eats the retainer.",
      },
      {
        question: "How quickly do you respond?",
        answer:
          "One hour for a P1 (something is down and people can't work), four hours for a P2, next working day for everything else. These are contractual, not aspirational.",
      },
    ],
    ctaHeadline: "Hand it over.",
    ctaSubtext:
      "Configure your headcount and support needs — we'll send a proposal with response times in writing.",
    summary:
      "We own the environment day to day — monitoring, governance, joiners and leavers, and a named helpdesk team that already knows your setup.",
    bestFor: "Businesses wanting a hands-off IT team",
    highlights: [
      { label: "Proactive Monitoring" },
      { label: "User Lifecycle" },
      { label: "Helpdesk Support" },
      { label: "Health Reporting" },
    ],
  },

  {
    slug: "intelligent-365",
    kind: "level",
    status: "published",
    order: 50,
    title: "Intelligent 365",
    tagline: "The Engine",
    headline: "Automate the work\nnobody should be doing.",
    valueProp:
      "Power Platform automation, live dashboards, and a tenant that's genuinely ready for Copilot rather than merely licensed for it. We find the processes eating your team's week and take them off the list.",
    stats: [
      { value: "12+ hrs", label: "Saved per process, monthly" },
      { value: "Live", label: "Dashboards, not spreadsheets" },
      { value: "Ready", label: "For Copilot rollout" },
    ],
    includes: [
      {
        title: "Process discovery",
        description:
          "We sit with your team and find the repetitive work: approvals chased by email, data retyped between systems, reports rebuilt every Monday.",
      },
      {
        title: "Power Automate flows",
        description:
          "The approvals, notifications and hand-offs automated, with proper error handling so a failed run gets noticed rather than silently skipped.",
      },
      {
        title: "Power Apps",
        description:
          "Purpose-built internal apps for the jobs a spreadsheet has outgrown — site inspections, asset registers, request forms.",
      },
      {
        title: "Power BI dashboards",
        description:
          "Live reporting from the systems you already run, so the numbers in the board pack are the same numbers on the floor.",
      },
      {
        title: "Copilot readiness",
        description:
          "The unglamorous prerequisite: permissions cleaned up and oversharing closed, so Copilot surfaces what people should see and nothing else.",
      },
    ],
    outcomes: [
      {
        title: "The Monday report builds itself",
        description: "And it's right, because nobody is copying figures between spreadsheets.",
      },
      {
        title: "Approvals stop being a bottleneck",
        description: "Requests route themselves, chase themselves, and record who approved what.",
      },
      {
        title: "Copilot becomes worth paying for",
        description: "Rather than an expensive way to surface documents nobody was meant to find.",
      },
    ],
    pricingMode: "per-seat",
    currency: "GBP",
    seatBands: ladder([30, 26, 22, 19]),
    setupFee: 3500,
    setupFeeWaivedAtSeats: 300,
    minSeats: 10,
    maxSeats: 1000,
    defaultSeats: 75,
    billingNote:
      "Estimate covers our service only — Microsoft licence costs, including Copilot and any premium Power Platform connectors, are billed separately. 12-month term, billed monthly.",
    options: [
      {
        name: "Copilot deployment & training",
        description:
          "Rollout plan, permissions remediation, and hands-on training so people use it for real work instead of trying it twice.",
        priceType: "one-time",
        amount: 3200,
      },
      {
        name: "Additional automated process",
        description:
          "Each engagement includes three processes. This adds a further one — discovery, build, test and handover.",
        priceType: "one-time",
        amount: 1800,
      },
      {
        name: "Dedicated automation engineer",
        description:
          "A named engineer with reserved capacity each month for continuous improvement, not just break-fix.",
        priceType: "monthly-flat",
        amount: 1200,
      },
      REVIEW_OPTION,
    ],
    faqs: [
      {
        question: "How do you decide what to automate first?",
        answer:
          "By hours saved against effort to build. We map your candidate processes on both axes in discovery and start with the top-right corner. You'll see that map before anyone writes a flow.",
      },
      {
        question: "What happens if an automation breaks?",
        answer:
          "Every flow we build has error handling and alerting, and they're monitored under the same agreement as the rest of your environment. A failed run raises a ticket with us, not a mystery for you.",
      },
      {
        question: "Is our tenant ready for Copilot?",
        answer:
          "Probably not yet — most aren't. The usual blocker is oversharing: files and sites open to 'everyone' that nobody notices until Copilot starts citing them. That cleanup is included here.",
      },
    ],
    ctaHeadline: "Find out what's automatable.",
    ctaSubtext:
      "Configure your team size and tell us your biggest time sink — we'll come back with what we'd tackle first.",
    summary:
      "Power Platform automation, live Power BI dashboards, and a tenant genuinely ready for Copilot. We take the repetitive work off your team.",
    bestFor: "Organisations ready to automate & scale",
    highlights: [
      { label: "Power Automate" },
      { label: "Power Apps" },
      { label: "Power BI" },
      { label: "Copilot Readiness" },
    ],
  },

  // ── Add-on services ───────────────────────────────────────────────────────

  {
    slug: "migration",
    kind: "addon",
    status: "published",
    order: 60,
    title: "Migration",
    tagline: "Move Once, Properly",
    headline: "Migrated without\nlosing a thing.",
    valueProp:
      "Moving to Microsoft 365 from on-prem servers, Google Workspace, or another tenant — planned and executed with zero data loss and minimal downtime. Scoped as a project, priced once we know what's actually there.",
    stats: [
      { value: "0", label: "Data loss, ever" },
      { value: "Weekend", label: "Typical cutover window" },
      { value: "30 days", label: "Rollback safety net" },
    ],
    includes: [
      {
        title: "Pre-migration audit",
        description:
          "We inventory what you have before quoting: mailbox sizes, shared drives, public folders, the things everyone forgot were still running.",
      },
      {
        title: "Migration plan and cutover date",
        description:
          "A written plan with a named date, a rollback position, and an agreed definition of done. Signed off before anything moves.",
      },
      {
        title: "Data migration",
        description:
          "Mail, calendars, contacts, files and permissions moved across with fidelity checks at each stage rather than a hopeful bulk copy.",
      },
      {
        title: "Hypercare",
        description:
          "Two weeks of elevated support after cutover, when the odd edge case always surfaces. Old platform stays available read-only for 30 days.",
      },
    ],
    outcomes: [
      {
        title: "Monday morning is uneventful",
        description: "Which is the entire point of a migration done properly.",
      },
      {
        title: "Nothing gets left behind",
        description: "Including the archive nobody mentioned until the week after go-live.",
      },
      {
        title: "The old platform can be switched off",
        description: "With a verified, evidenced migration behind you rather than a hunch.",
      },
    ],
    // Priced on application: scope varies too much between a 12-person Google
    // Workspace move and a multi-domain Exchange consolidation for a headcount
    // slider to produce a number anyone should rely on.
    pricingMode: "quote",
    currency: "GBP",
    minSeats: 1,
    maxSeats: 2000,
    defaultSeats: 30,
    billingNote:
      "Migrations are scoped individually — the figure depends on data volume and source platform, not headcount alone. Tell us what you're moving from and we'll price it within one working day.",
    options: [
      {
        name: "From on-premises Exchange",
        description: "Hybrid or cutover migration from a self-hosted Exchange server.",
        priceType: "one-time",
        amount: 0,
      },
      {
        name: "From Google Workspace",
        description: "Gmail, Drive, Calendar and Groups moved into Microsoft 365.",
        priceType: "one-time",
        amount: 0,
      },
      {
        name: "Tenant-to-tenant",
        description: "Merger, acquisition or demerger — consolidating or splitting existing tenants.",
        priceType: "one-time",
        amount: 0,
      },
      {
        name: "File server / NAS shares",
        description: "Shared drives moved into SharePoint and OneDrive with permissions preserved.",
        priceType: "one-time",
        amount: 0,
      },
    ],
    faqs: [
      {
        question: "How long will it take?",
        answer:
          "Two to six weeks for most businesses under 100 people, with the actual cutover over a weekend. Data volume drives the timeline more than headcount does.",
      },
      {
        question: "Can we go back if something's wrong?",
        answer:
          "Yes. The source platform stays intact and read-only for 30 days after cutover. We don't decommission anything until you've confirmed you're happy.",
      },
    ],
    ctaHeadline: "Tell us what you're moving.",
    ctaSubtext: "We'll audit the source, plan the move, and give you a fixed price and a date.",
    summary:
      "Seamless migration to Microsoft 365 from legacy on-prem servers, Google Workspace, or another tenant — zero data loss, minimal downtime.",
    bestFor: "Businesses leaving a legacy platform",
    highlights: [
      { label: "On-Prem Exchange" },
      { label: "Google Workspace" },
      { label: "Tenant-to-Tenant" },
      { label: "File Servers" },
    ],
  },

  {
    slug: "security-compliance",
    kind: "addon",
    status: "published",
    order: 70,
    title: "Security & Compliance",
    tagline: "Audit-Ready",
    headline: "Provable security,\nnot promised security.",
    valueProp:
      "A dedicated hardening and governance engagement covering Zero Trust architecture, regulatory alignment and audit-ready evidence across your whole tenant. For businesses that have to demonstrate their controls, not just have them.",
    stats: [
      { value: "Evidence", label: "For every control" },
      { value: "Quarterly", label: "Posture reviews" },
      { value: "1", label: "Report your auditor accepts" },
    ],
    includes: [
      {
        title: "Tenant security assessment",
        description:
          "A full review against Microsoft Secure Score and CIS benchmarks, with findings ranked by risk and effort rather than dumped as a 200-page export.",
      },
      {
        title: "Zero Trust hardening",
        description:
          "Identity, device, application and data controls implemented as a coherent architecture instead of a pile of individually enabled settings.",
      },
      {
        title: "Data governance with Purview",
        description:
          "Sensitivity labels, retention policies and DLP rules built around the data you actually hold and the rules you're actually subject to.",
      },
      {
        title: "Audit evidence pack",
        description:
          "Documented controls, configuration exports and policy records, maintained continuously so an audit request doesn't become a fire drill.",
      },
    ],
    outcomes: [
      {
        title: "Audits stop being events",
        description: "The evidence is already assembled, because it's maintained rather than gathered.",
      },
      {
        title: "Sensitive data stays where it belongs",
        description: "DLP catches the accidental send before it leaves, not after.",
      },
      {
        title: "The security questionnaire gets answered in an hour",
        description: "Instead of being passed around for three weeks.",
      },
    ],
    pricingMode: "per-seat",
    currency: "GBP",
    seatBands: ladder([11, 9, 7.5, 6]),
    setupFee: 2800,
    setupFeeWaivedAtSeats: 250,
    minSeats: 5,
    maxSeats: 1000,
    defaultSeats: 40,
    billingNote:
      "Estimate covers our service only. Some controls require Microsoft 365 E5 or specific add-ons — we'll tell you which during the assessment, before you commit to anything.",
    options: [
      {
        name: "Cyber Essentials Plus certification support",
        description: "Gap analysis, remediation and evidence preparation through to assessment.",
        priceType: "one-time",
        amount: 2400,
      },
      {
        name: "ISO 27001 alignment",
        description:
          "Mapping your Microsoft 365 controls to Annex A, with the documentation your auditor will ask for.",
        priceType: "one-time",
        amount: 4500,
      },
      {
        name: "Penetration test coordination",
        description:
          "We brief the testers, manage the engagement, and remediate what they find. Test fees billed at cost.",
        priceType: "one-time",
        amount: 1200,
      },
      {
        name: "Continuous compliance monitoring",
        description: "Automated drift detection with alerts when a control silently stops being true.",
        priceType: "monthly-flat",
        amount: 350,
        defaultSelected: true,
      },
    ],
    faqs: [
      {
        question: "Do we need E5 licences for this?",
        answer:
          "For the full Purview capability set, some of it yes. But a great deal is achievable on Business Premium, and we'll always tell you what a licence upgrade actually buys before recommending one.",
      },
      {
        question: "Can you work alongside our existing auditor?",
        answer:
          "Yes, and it's usually the fastest route. We'll take their control framework as the input and map our work directly to it.",
      },
    ],
    ctaHeadline: "Make your controls provable.",
    ctaSubtext:
      "Configure your headcount and compliance requirements — we'll scope the assessment and price the work.",
    summary:
      "Dedicated hardening covering Zero Trust architecture, regulatory alignment, and audit-ready governance across your entire tenant.",
    bestFor: "Regulated and audited businesses",
    highlights: [
      { label: "Zero Trust" },
      { label: "Microsoft Purview" },
      { label: "DLP & Retention" },
      { label: "Audit Evidence" },
    ],
  },

  {
    slug: "sharepoint-support",
    kind: "addon",
    status: "published",
    order: 80,
    title: "SharePoint Support",
    tagline: "Architecture & Upkeep",
    headline: "SharePoint that people\nactually want to use.",
    valueProp:
      "Ongoing architecture, permissions cleanup, intranet design and site migrations, handled by engineers who live in SharePoint daily. For the businesses whose SharePoint grew organically and now nobody can find anything.",
    stats: [
      { value: "0", label: "Sites shared with 'Everyone'" },
      { value: "1", label: "Findable structure" },
      { value: "Ongoing", label: "Not a one-off cleanup" },
    ],
    includes: [
      {
        title: "Information architecture",
        description:
          "A site, hub and metadata structure designed for how people search, so search actually returns the right document.",
      },
      {
        title: "Permissions remediation",
        description:
          "Broken inheritance untangled, orphaned sharing links revoked, and access rebuilt on groups rather than a decade of individual grants.",
      },
      {
        title: "Intranet design and build",
        description:
          "A branded home site with news, policies, and the handful of links people ask for most — built to be maintained by your team, not by us.",
      },
      {
        title: "Ongoing site support",
        description:
          "New sites provisioned to standard, structural changes handled, and a monthly check that nothing has drifted.",
      },
    ],
    outcomes: [
      {
        title: "Search returns the right thing",
        description: "Because the metadata and structure finally support it.",
      },
      {
        title: "Nobody has access they shouldn't",
        description: "And you can prove it — the prerequisite for ever turning Copilot on.",
      },
      {
        title: "New sites don't recreate the mess",
        description: "Provisioning follows a template, so the structure holds as you grow.",
      },
    ],
    pricingMode: "per-seat",
    currency: "GBP",
    seatBands: ladder([7, 6, 5, 4]),
    setupFee: 1800,
    setupFeeWaivedAtSeats: 200,
    minSeats: 5,
    maxSeats: 1000,
    defaultSeats: 40,
    billingNote:
      "Estimate covers our service only. The one-time fee covers the initial architecture review and permissions remediation; the monthly covers ongoing support and governance.",
    options: [
      {
        name: "Intranet home site build",
        description: "Branded landing page with news, policies, org chart and quick links.",
        priceType: "one-time",
        amount: 2200,
      },
      {
        name: "Legacy SharePoint migration",
        description: "SharePoint 2013/2016/2019 on-premises moved to SharePoint Online.",
        priceType: "one-time",
        amount: 3600,
      },
      {
        name: "Document management workflows",
        description: "Approval routing, version control and retention applied to your key document sets.",
        priceType: "one-time",
        amount: 1500,
      },
      SUPPORT_OPTION,
    ],
    faqs: [
      {
        question: "Our SharePoint is a mess. Is it salvageable?",
        answer:
          "Almost always, and usually more cheaply than starting again. We audit what's actively used — typically a fraction of what exists — restructure that, and archive the rest.",
      },
      {
        question: "Can our own team maintain it afterwards?",
        answer:
          "That's how we build it. You get documentation and training, and the ongoing support exists for the structural work, not for adding a page to the intranet.",
      },
    ],
    ctaHeadline: "Get SharePoint under control.",
    ctaSubtext:
      "Configure your headcount and what needs fixing — we'll audit the current state and price the work.",
    summary:
      "Ongoing SharePoint architecture, permissions cleanup, intranet design and site migrations, by engineers who live in SharePoint daily.",
    bestFor: "Teams whose SharePoint grew organically",
    highlights: [
      { label: "Architecture" },
      { label: "Permissions" },
      { label: "Intranet Design" },
      { label: "Site Migrations" },
    ],
  },

  {
    slug: "teams-phone",
    kind: "addon",
    status: "published",
    order: 90,
    title: "Teams Phone Support",
    tagline: "Retire the PBX",
    headline: "Your phone system,\ninside Teams.",
    valueProp:
      "Microsoft Teams Phone deployment, number porting, auto-attendants and call routing — replacing a legacy PBX with a fully cloud-native system your staff already know how to use.",
    stats: [
      { value: "0", label: "Handsets required" },
      { value: "Ported", label: "Keep every number" },
      { value: "Anywhere", label: "Desk, mobile, home" },
    ],
    includes: [
      {
        title: "Number porting",
        description:
          "Every existing number moved across, including main lines and DDIs, coordinated with your current provider so nothing goes dark.",
      },
      {
        title: "Auto-attendants and call queues",
        description:
          "The menus, routing and hunt groups your business runs on, rebuilt in Teams and documented so you can change them yourself.",
      },
      {
        title: "Device rollout",
        description:
          "Headsets, desk phones and meeting room hardware where they're genuinely needed — and softphone-only where they aren't.",
      },
      {
        title: "PBX decommission",
        description:
          "The old system taken out of service and the line rental cancelled, which is where most of the saving actually comes from.",
      },
    ],
    outcomes: [
      {
        title: "The desk phone stops mattering",
        description: "Calls follow the person, not the desk — office, home, or a client site.",
      },
      {
        title: "The line rental bill disappears",
        description: "Usually the single largest saving in the whole engagement.",
      },
      {
        title: "Changing a call flow takes minutes",
        description: "Instead of a support ticket with your telecoms provider and a two-week wait.",
      },
    ],
    pricingMode: "per-seat",
    currency: "GBP",
    seatBands: ladder([8, 7, 6, 5]),
    setupFee: 1400,
    setupFeeWaivedAtSeats: 150,
    minSeats: 3,
    maxSeats: 1000,
    defaultSeats: 25,
    billingNote:
      "Estimate covers our service and support only — Microsoft Teams Phone licences and your calling plan or SIP trunk are billed separately. Hardware quoted at cost.",
    options: [
      {
        name: "Number porting",
        description: "Bringing existing numbers across from your current provider, including main lines and DDIs.",
        priceType: "one-time",
        amount: 650,
        defaultSelected: true,
      },
      {
        name: "Meeting room hardware setup",
        description: "Teams Rooms configured and certified in your meeting spaces. Hardware billed at cost.",
        priceType: "one-time",
        amount: 900,
      },
      {
        name: "Contact centre integration",
        description: "Queue reporting, wallboards and supervisor tools for teams that handle call volume.",
        priceType: "per-seat-monthly",
        amount: 12,
      },
      {
        name: "Call recording & compliance",
        description: "Recording with retention and search, for regulated or quality-monitored environments.",
        priceType: "per-seat-monthly",
        amount: 6,
      },
    ],
    faqs: [
      {
        question: "Can we keep our existing numbers?",
        answer:
          "Yes. Porting is standard and we manage it end to end with your current provider. It typically takes two to four weeks, which we plan around rather than wait for.",
      },
      {
        question: "Do we need to buy new handsets?",
        answer:
          "Most people don't need one at all — a headset and the Teams app covers it. We usually recommend desk phones only for reception and shared spaces.",
      },
      {
        question: "What happens if the internet goes down?",
        answer:
          "Calls fail over to mobiles automatically, which is more resilience than a traditional PBX offered. We configure that as part of the rollout.",
      },
    ],
    ctaHeadline: "Cancel the line rental.",
    ctaSubtext:
      "Configure your headcount and call handling needs — we'll price the rollout and the porting.",
    summary:
      "Microsoft Teams Phone deployment, number porting, auto-attendants and call routing — replacing legacy PBX with a cloud-native phone system.",
    bestFor: "Businesses on a legacy PBX",
    highlights: [
      { label: "Number Porting" },
      { label: "Auto-Attendants" },
      { label: "Call Queues" },
      { label: "PBX Decommission" },
    ],
  },
]
