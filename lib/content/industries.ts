// Marketing + toolkit content for each industry page.
//
// These fields also exist on the "industries" Payload collection so editors can
// override them per industry in /admin. Because the collection was seeded before
// those fields existed, existing docs have them empty — getIndustryBySlug() falls
// back to the entry here, keyed by slug, so every industry page renders complete
// content regardless of what's in the database. CMS values always win when present.

export type IndustryStat = { value: string; label: string }
export type IndustryChallenge = { title: string; description: string }
export type IndustryOutcome = { title: string; description: string }

// One Microsoft product we deploy for this sector. `whatItIs` is deliberately
// jargon-free — it's read by buyers, not admins — and `whyYouNeedIt` ties the
// product to a problem this specific industry actually has.
export type IndustryTool = {
  name: string
  category: string
  whatItIs: string
  whyYouNeedIt: string
}

export type IndustryMarketing = {
  headline: string
  valueProp: string
  stats: IndustryStat[]
  challenges: IndustryChallenge[]
  tools: IndustryTool[]
  outcomes: IndustryOutcome[]
  ctaHeadline: string
  ctaSubtext: string
}

export const INDUSTRY_CONTENT: Record<string, IndustryMarketing> = {
  healthcare: {
    headline: "Microsoft 365 That Protects\nEvery Patient Record.",
    valueProp:
      "Clinical teams need to move fast without putting patient data at risk. We configure Microsoft 365 so compliance is enforced by the platform — not by asking busy staff to remember the rules.",
    stats: [
      { value: "HIPAA", label: "Aware Configuration" },
      { value: "24/7", label: "Monitored Access" },
      { value: "40%", label: "Less Admin Time" },
    ],
    challenges: [
      { title: "Patient data leaves the building", description: "Records get emailed, downloaded to personal devices, and shared with external specialists — with no record of where they ended up." },
      { title: "Audits become fire drills", description: "When a compliance review lands, nobody can produce a clean trail of who accessed which record and when." },
      { title: "Clinical staff work around IT", description: "If the secure way is the slow way, teams default to WhatsApp and personal email to get patients seen." },
      { title: "Admin work eats clinical hours", description: "Intake forms, appointment reminders, and referral chasing are still manual, pulling staff away from care." },
    ],
    tools: [
      { name: "Microsoft Purview", category: "Compliance", whatItIs: "Automatically labels and classifies sensitive documents, then blocks them from being shared where they shouldn't be.", whyYouNeedIt: "Patient records stay protected even when a staff member makes an honest mistake — the platform stops the share before it happens." },
      { name: "Microsoft Entra ID", category: "Identity", whatItIs: "Controls who can sign in, from which device, and what they're allowed to open once they're in.", whyYouNeedIt: "A receptionist and a consultant should not see the same records. Entra enforces that automatically, with a full audit trail." },
      { name: "Microsoft Teams", category: "Collaboration", whatItIs: "Secure chat, calls, and shared channels that keep case discussions inside your tenant.", whyYouNeedIt: "Care coordination happens in one protected place instead of scattered across personal phones and inboxes." },
      { name: "Microsoft Intune", category: "Device Management", whatItIs: "Manages laptops, tablets, and phones remotely — including wiping a lost device.", whyYouNeedIt: "A tablet left in a waiting room stops being a data breach and becomes a hardware replacement." },
      { name: "Power Automate", category: "Automation", whatItIs: "Runs repetitive processes for you — forms, reminders, approvals, handoffs.", whyYouNeedIt: "Intake and appointment reminders run themselves, cutting no-shows and returning hours to clinical staff." },
      { name: "Microsoft Defender", category: "Security", whatItIs: "Detects phishing, ransomware, and suspicious sign-ins before they reach your users.", whyYouNeedIt: "Healthcare is the most targeted sector for ransomware — Defender is the layer that stops the first click." },
    ],
    outcomes: [
      { title: "Compliance you can evidence", description: "Access logs, retention policies, and classification are already in place when the auditor asks." },
      { title: "Clinicians stop working around IT", description: "The secure path becomes the fastest path, so staff actually use it." },
      { title: "Hours back per week", description: "Automated intake and reminders remove the manual admin that was never clinical work." },
    ],
    ctaHeadline: "Ready to Secure\nYour Patient Data?",
    ctaSubtext: "Book a free 15-minute call and we'll walk through where your current Microsoft 365 setup leaves patient data exposed.",
  },

  "banking-finance": {
    headline: "Audit-Ready Microsoft 365\nfor Financial Firms.",
    valueProp:
      "Regulators don't accept good intentions. We configure Microsoft 365 so identity, encryption, and record keeping meet financial-sector expectations by default — and stay that way.",
    stats: [
      { value: "100%", label: "MFA Enforced" },
      { value: "0", label: "Standing Admin Rights" },
      { value: "7yr", label: "Retention Ready" },
    ],
    challenges: [
      { title: "Standing admin access everywhere", description: "Too many accounts hold permanent elevated rights — the single biggest finding in most financial IT audits." },
      { title: "Client data sent unprotected", description: "Statements and account details go out as ordinary email attachments that can be forwarded anywhere." },
      { title: "Retention is a scramble", description: "eDiscovery requests turn into weeks of manual searching because nothing was configured up front." },
      { title: "Credential-based fraud", description: "One reused password on one account is all an attacker needs to reach financial systems." },
    ],
    tools: [
      { name: "Entra ID Privileged Identity Management", category: "Identity", whatItIs: "Grants admin rights only for the minutes they're actually needed, then takes them away again.", whyYouNeedIt: "Removes the standing-privilege finding auditors raise every time, without slowing your IT team down." },
      { name: "Conditional Access", category: "Access Control", whatItIs: "Checks the user, device, and location on every sign-in and blocks anything that looks wrong.", whyYouNeedIt: "A login from an impossible location is stopped before it ever touches client accounts." },
      { name: "Purview Message Encryption", category: "Data Protection", whatItIs: "Encrypts sensitive emails so only the intended recipient can open them — even outside your organisation.", whyYouNeedIt: "Client statements stay protected after they leave your tenant, and can be revoked if sent in error." },
      { name: "Purview Retention & eDiscovery", category: "Compliance", whatItIs: "Keeps records for exactly as long as regulation requires, and finds them on demand.", whyYouNeedIt: "An eDiscovery request becomes a search, not a project." },
      { name: "Microsoft Defender", category: "Security", whatItIs: "Blocks phishing, impersonation, and malicious attachments across email and files.", whyYouNeedIt: "Finance is the top target for business email compromise — Defender catches the invoice fraud attempt first." },
      { name: "Power BI", category: "Reporting", whatItIs: "Turns your operational data into live dashboards leadership can actually read.", whyYouNeedIt: "Risk, performance, and compliance posture visible in real time instead of a month-end deck." },
    ],
    outcomes: [
      { title: "Clean audit findings", description: "Privileged access, encryption, and retention controls documented and demonstrable." },
      { title: "Fraud attempts stopped early", description: "Conditional access and Defender block the sign-in and the email before money moves." },
      { title: "Faster regulatory response", description: "Records are retained and searchable, so requests are answered in hours." },
    ],
    ctaHeadline: "Ready for Your\nNext Audit?",
    ctaSubtext: "Book a free 15-minute call and we'll identify the gaps a regulator would flag in your current tenant.",
  },

  education: {
    headline: "Microsoft 365 Education,\nRolled Out Properly.",
    valueProp:
      "Licences alone don't make a hybrid classroom work. We deploy Microsoft 365 EDU so teaching runs smoothly, devices stay managed, and student data stays where it belongs.",
    stats: [
      { value: "1:1", label: "Device Ready" },
      { value: "EDU", label: "Licensing Optimised" },
      { value: "100%", label: "Safeguarding Aligned" },
    ],
    challenges: [
      { title: "Hybrid learning falls apart", description: "Lessons are delivered on whatever tool a teacher found themselves, so nothing is consistent or recoverable." },
      { title: "Student devices go unmanaged", description: "School-issued laptops come back full of unapproved apps, with no filtering and no way to reset them at scale." },
      { title: "Staff and student data mix", description: "Shared drives and loose permissions mean students can reach files they never should." },
      { title: "Lesson content lives on personal drives", description: "When a teacher leaves, years of curriculum leaves with them." },
    ],
    tools: [
      { name: "Teams for Education", category: "Classroom", whatItIs: "A structured digital classroom for live lessons, assignments, and marking in one place.", whyYouNeedIt: "Every class runs the same way, and a student who misses a session can catch up without chasing a teacher." },
      { name: "OneNote Class Notebook", category: "Curriculum", whatItIs: "A shared notebook with a private section per student and a shared library for the class.", whyYouNeedIt: "Curriculum and lesson plans stay with the school, structured and searchable, not on a personal laptop." },
      { name: "Microsoft Intune", category: "Device Management", whatItIs: "Deploys, locks down, filters, and remotely resets school devices at scale.", whyYouNeedIt: "One IT person can manage a thousand student devices, and a returned laptop is ready for the next student in minutes." },
      { name: "Microsoft Entra ID", category: "Identity", whatItIs: "Separate identity groups for students, staff, and guests with different access rules for each.", whyYouNeedIt: "Safeguarding stops depending on someone remembering to set the right folder permission." },
      { name: "SharePoint", category: "Content", whatItIs: "Central document libraries for policies, curriculum, and departmental resources.", whyYouNeedIt: "Institutional knowledge stays with the institution when staff move on." },
      { name: "Power Automate", category: "Automation", whatItIs: "Automates permission slips, absence reporting, and internal approvals.", whyYouNeedIt: "Admin staff stop rekeying forms and chasing signatures by email." },
    ],
    outcomes: [
      { title: "Consistent teaching delivery", description: "Every classroom runs on the same platform, in person or remote." },
      { title: "Devices that stay managed", description: "Filtered, patched, and resettable without touching each machine." },
      { title: "Safeguarding by design", description: "Student data is separated from staff systems at the identity layer." },
    ],
    ctaHeadline: "Ready to Get More\nFrom Your EDU Licences?",
    ctaSubtext: "Book a free 15-minute call and we'll review what your Microsoft 365 EDU tenant is capable of but isn't doing yet.",
  },

  manufacturing: {
    headline: "Connect the Shop Floor\nto the Back Office.",
    valueProp:
      "Production data trapped in spreadsheets is data you can't act on. We use Microsoft 365 to put live operational visibility in front of the people who make decisions.",
    stats: [
      { value: "Live", label: "Production KPIs" },
      { value: "-30%", label: "Downtime Reporting Lag" },
      { value: "24/7", label: "Shift Coverage" },
    ],
    challenges: [
      { title: "You find out about problems too late", description: "Production issues surface in next week's report, long after the shift where they could have been fixed." },
      { title: "Maintenance requests get lost", description: "Equipment faults are reported verbally or on paper, then disappear until something breaks properly." },
      { title: "Shift handovers lose context", description: "The incoming crew inherits problems nobody wrote down." },
      { title: "Supplier coordination by email thread", description: "Purchase approvals and delivery changes are buried in inboxes with no shared status." },
    ],
    tools: [
      { name: "Power BI", category: "Analytics", whatItIs: "Live dashboards that pull data from your production and ERP systems into one screen.", whyYouNeedIt: "Managers see output, scrap, and downtime as it happens instead of reading about it a week later." },
      { name: "Power Apps", category: "Custom Apps", whatItIs: "Simple mobile and tablet forms built for your process, usable with gloves on the floor.", whyYouNeedIt: "A maintenance issue is logged in seconds and routed straight to the right team with a tracked status." },
      { name: "Microsoft Teams", category: "Collaboration", whatItIs: "Channels structured by shift, line, or site for messages, files, and handover notes.", whyYouNeedIt: "Every incoming shift starts briefed, with the last shift's incidents in writing." },
      { name: "Power Automate", category: "Automation", whatItIs: "Routes approvals, alerts, and notifications automatically based on rules you set.", whyYouNeedIt: "Purchase approvals and downtime alerts move without anyone chasing them." },
      { name: "SharePoint", category: "Documents", whatItIs: "Controlled libraries for work instructions, certifications, and supplier documents.", whyYouNeedIt: "Operators always work from the current revision, and audits find the right document first time." },
      { name: "Microsoft Intune", category: "Device Management", whatItIs: "Manages shared floor tablets and kiosks, including shared-device sign-in.", whyYouNeedIt: "Shop floor devices stay locked to their job and are replaced without an IT visit." },
    ],
    outcomes: [
      { title: "Problems visible in the shift", description: "Live KPIs mean issues are addressed while they still cost you one shift, not one week." },
      { title: "Maintenance with a paper trail", description: "Every fault tracked from report to resolution, with time-to-fix you can measure." },
      { title: "Cleaner handovers", description: "Structured shift channels mean nothing important is lost between crews." },
    ],
    ctaHeadline: "Ready to See Your\nProduction Data Live?",
    ctaSubtext: "Book a free 15-minute call and we'll map which of your production numbers could be on a live dashboard this quarter.",
  },

  "retail-wholesale": {
    headline: "Stock, Staff, and Stores\nin One Connected View.",
    valueProp:
      "Retail runs on knowing what you have and what's moving. We connect Microsoft 365 to your operational data so every location works from the same current picture.",
    stats: [
      { value: "Live", label: "Stock Visibility" },
      { value: "-25%", label: "Stockout Risk" },
      { value: "Days→Hrs", label: "Seasonal Onboarding" },
    ],
    challenges: [
      { title: "Stock levels are a day out of date", description: "Managers plan from end-of-day exports, so decisions are always one step behind the shelf." },
      { title: "Reordering depends on someone noticing", description: "Purchase orders get raised after the stockout, not before it." },
      { title: "Floor staff can't answer customers", description: "Current pricing, availability, and promotions live in a system nobody on the floor can reach." },
      { title: "Seasonal hiring overwhelms IT", description: "Onboarding forty temporary staff takes days, and offboarding them properly never quite happens." },
    ],
    tools: [
      { name: "Power BI", category: "Analytics", whatItIs: "Live reports on stock, sales, and margin across every location in one dashboard.", whyYouNeedIt: "Area managers compare stores in real time instead of reconciling spreadsheets on Monday." },
      { name: "Power Automate", category: "Automation", whatItIs: "Triggers actions automatically when a threshold is crossed — like raising a reorder.", whyYouNeedIt: "Reorders fire before the shelf is empty, based on rules you set once." },
      { name: "Microsoft Teams", category: "Collaboration", whatItIs: "Store-level channels for shift comms, promotions, and head-office announcements.", whyYouNeedIt: "A pricing change reaches every floor team the same day it's decided." },
      { name: "SharePoint", category: "Content", whatItIs: "A single library for product data, planograms, and store operating procedures.", whyYouNeedIt: "Floor staff answer customer questions from current information, not a printout from March." },
      { name: "Microsoft Entra ID", category: "Identity", whatItIs: "Automated account provisioning and instant, complete deprovisioning.", whyYouNeedIt: "Seasonal hires get exactly the access they need on day one — and lose all of it the day they leave." },
      { name: "Power Apps", category: "Custom Apps", whatItIs: "Tablet apps for stock counts, price checks, and store audits.", whyYouNeedIt: "Stock counts stop being a clipboard exercise that gets typed up later." },
    ],
    outcomes: [
      { title: "Fewer stockouts", description: "Threshold-driven reordering catches gaps before customers do." },
      { title: "Stores that compare fairly", description: "One live dashboard, one definition of every number, every location." },
      { title: "Seasonal scaling without IT panic", description: "Provisioning and offboarding run to a repeatable, auditable process." },
    ],
    ctaHeadline: "Ready to Run Every\nStore From One View?",
    ctaSubtext: "Book a free 15-minute call and we'll show you what live inventory reporting would look like across your locations.",
  },

  hospitality: {
    headline: "One System From\nFront Desk to Housekeeping.",
    valueProp:
      "Hospitality runs on handoffs. We use Microsoft 365 to connect every department and every property so nothing is lost between a radio call and a shift change.",
    stats: [
      { value: "All", label: "Departments Connected" },
      { value: "-20%", label: "No-Show Rate" },
      { value: "1", label: "Standard Per Property" },
    ],
    challenges: [
      { title: "Departments run on radios and sticky notes", description: "Front desk, housekeeping, and maintenance all track the same room differently, and none of it is recorded." },
      { title: "Guest communication is manual", description: "Confirmations and reminders are sent by hand, so they're inconsistent and no-shows stay high." },
      { title: "Every property is configured differently", description: "What works at one site can't be supported at the next because nothing was standardised." },
      { title: "High staff turnover, slow onboarding", description: "Each new starter needs accounts set up from scratch, and leavers keep access far too long." },
    ],
    tools: [
      { name: "Microsoft Teams", category: "Operations", whatItIs: "Department and shift channels with mobile-first chat for staff who aren't at a desk.", whyYouNeedIt: "Housekeeping, front desk, and maintenance coordinate in one thread with a record of what was agreed." },
      { name: "Microsoft Bookings", category: "Guest Experience", whatItIs: "Online booking pages for restaurants, spa treatments, and facilities, synced to staff calendars.", whyYouNeedIt: "Guests book themselves in and the right team sees it instantly — no double bookings, no phone tag." },
      { name: "Power Automate", category: "Automation", whatItIs: "Sends confirmations, reminders, and follow-ups automatically at the right moment.", whyYouNeedIt: "No-shows fall and the front desk stops spending its morning on reminder calls." },
      { name: "Microsoft Entra ID", category: "Identity", whatItIs: "Standardised account creation and removal across every property you operate.", whyYouNeedIt: "A new starter is productive on shift one, and a leaver's access ends the same day." },
      { name: "SharePoint", category: "Documents", whatItIs: "Shared libraries for SOPs, brand standards, and compliance records per property.", whyYouNeedIt: "Every site works to the same standard, and head office can prove it." },
      { name: "Power BI", category: "Analytics", whatItIs: "Occupancy, revenue, and service dashboards across single or multiple properties.", whyYouNeedIt: "Property performance is comparable at a glance instead of assembled by hand each month." },
    ],
    outcomes: [
      { title: "Nothing lost at handover", description: "Shift channels keep every incident and request in writing, visible to the next crew." },
      { title: "Fewer no-shows", description: "Automated confirmations and reminders do the chasing for you." },
      { title: "Consistency across properties", description: "One configuration baseline rolled out identically to every site." },
    ],
    ctaHeadline: "Ready to Connect\nEvery Department?",
    ctaSubtext: "Book a free 15-minute call and we'll map how your properties could run on one shared Microsoft 365 standard.",
  },

  "professional-services": {
    headline: "Bill More Hours.\nChase Fewer Emails.",
    valueProp:
      "Professional firms lose margin in the gaps — untracked time, chased approvals, lost documents. We use Microsoft 365 to close those gaps without adding another system to learn.",
    stats: [
      { value: "-40%", label: "Proposal Turnaround" },
      { value: "100%", label: "Client Doc Traceability" },
      { value: "Less", label: "Time Written Off" },
    ],
    challenges: [
      { title: "Client documents live in email threads", description: "The current version is whichever attachment someone opened last, and nobody is sure who has what." },
      { title: "Proposals wait on approvals", description: "A partner signature holds up a deal for days because the chase is manual." },
      { title: "Engagements have no shared status", description: "Only the lead knows where a project actually stands, and it stays that way until something slips." },
      { title: "Billable time gets written off", description: "Work delivered and time recorded don't line up, so hours quietly disappear at invoicing." },
    ],
    tools: [
      { name: "SharePoint", category: "Client Portals", whatItIs: "Secure, branded portals where each client sees only their own documents.", whyYouNeedIt: "Document exchange leaves email entirely, with permissions and a version history per client." },
      { name: "Power Automate", category: "Automation", whatItIs: "Generates and routes proposals, engagement letters, and approvals automatically.", whyYouNeedIt: "Proposals go out in hours instead of days, and approvals chase themselves." },
      { name: "Microsoft Planner", category: "Project Tracking", whatItIs: "Shared boards showing every engagement, its stage, and who owns the next step.", whyYouNeedIt: "Anyone can see where a matter stands without interrupting the person running it." },
      { name: "Power BI", category: "Reporting", whatItIs: "Utilisation, realisation, and pipeline dashboards built from your own data.", whyYouNeedIt: "You see which engagements are actually profitable while there's still time to act." },
      { name: "Microsoft Teams", category: "Collaboration", whatItIs: "A channel per client or matter, keeping conversations, files, and meetings together.", whyYouNeedIt: "Context stays with the engagement instead of scattered across personal inboxes." },
      { name: "Microsoft Purview", category: "Compliance", whatItIs: "Classifies confidential client material and controls where it can travel.", whyYouNeedIt: "Client confidentiality obligations are enforced by the platform, not by trust alone." },
    ],
    outcomes: [
      { title: "Faster proposals out the door", description: "Automated generation and routing turns a multi-day chase into a same-day send." },
      { title: "Engagements visible to the whole firm", description: "Shared boards replace status meetings and forwarded email chains." },
      { title: "Less time written off", description: "Delivered work ties back to billing, so fewer hours vanish before invoicing." },
    ],
    ctaHeadline: "Ready to Stop\nLosing Billable Hours?",
    ctaSubtext: "Book a free 15-minute call and we'll pinpoint where your firm's margin is leaking into manual admin.",
  },
}

// Neutral content used if an industry is added in /admin without filling in the
// marketing fields and without a matching entry above — the page still renders
// a complete, on-brand structure rather than collapsing to a bare list.
export const INDUSTRY_CONTENT_FALLBACK: IndustryMarketing = {
  headline: "Microsoft 365,\nBuilt Around Your Sector.",
  valueProp:
    "Every industry runs Microsoft 365 differently. We configure security, automation, and support around how your business actually operates.",
  stats: [
    { value: "500+", label: "Clients Served" },
    { value: "10+", label: "Years Experience" },
    { value: "100%", label: "Microsoft Native" },
  ],
  challenges: [],
  tools: [],
  outcomes: [],
  ctaHeadline: "Ready to Talk\nAbout Your Sector?",
  ctaSubtext: "Book a free 15-minute call and we'll walk through what Microsoft 365 could do for your business.",
}
