// Seed data for the "case-studies" Payload collection, inserted once by the
// onInit hook in payload.config.ts if the collection is empty. Lets the
// /case-studies page have real content to search/filter on a fresh
// database, without requiring manual entry via /admin first.
//
// Every field on the collection is filled in here except the four upload
// relations (heroImage, logo, approachImage, gallery) — those need an actual
// media asset uploaded through /admin first, which a text seed can't provide,
// so those sections render their labelled-placeholder / hidden fallback
// until someone adds real images.

import type { SITEMAP_INDUSTRY_TITLES } from "@/lib/content/site"

type Fact = { label: string; value: string }
type Step = { title: string; description: string }
type Metric = { value: string; label: string }
type Quote = { text: string; author: string; role: string }

export type CaseStudySeed = {
  client: string
  slug: string
  industry: (typeof SITEMAP_INDUSTRY_TITLES)[number]
  headline: string
  summary: string
  facts: Fact[]
  challenge: string
  challengePoints: { point: string }[]
  result: string
  approach: Step[]
  toolsUsed: { name: string }[]
  stat: { value: string; label: string }
  metrics: Metric[]
  quote: Quote
  status: "published"
  publishedDate: string
}

export const CASE_STUDIES_SEED: CaseStudySeed[] = [
  {
    client: "Regional Medical Group",
    slug: "regional-medical-group",
    industry: "Healthcare",
    headline: "Zero compliance incidents since go-live.",
    summary:
      "Patient records were scattered across shared drives with no access controls, risking HIPAA-adjacent compliance failures. We rebuilt records management on a governed Microsoft 365 foundation.",
    facts: [
      { label: "Size", value: "240 staff" },
      { label: "Locations", value: "6 clinics" },
      { label: "Timeline", value: "8 weeks" },
      { label: "Service Level", value: "Secure 365" },
    ],
    challenge:
      "Patient records were scattered across shared drives with no access controls, risking HIPAA-adjacent compliance failures. Front-desk and clinical staff shared one generic login for the records drive, so there was no way to know who had opened a file, and nothing stopped a departing employee from walking out with years of patient history on a USB drive.",
    challengePoints: [
      { point: "No audit trail for who accessed or edited patient files" },
      { point: "Departing staff retained access to shared drives for weeks after leaving" },
      { point: "Sensitive records had no labelling or encryption at rest" },
      { point: "IT had no way to prove compliance during a payer audit" },
    ],
    result:
      "We migrated all records into a governed SharePoint structure with Purview sensitivity labels and Entra conditional access, replacing the shared drive with per-clinic libraries that log every access.",
    approach: [
      { title: "Tenant audit and licence review", description: "Mapped every existing account, shared drive, and access path to understand the real exposure before touching anything." },
      { title: "Governed SharePoint migration", description: "Rebuilt the records structure as per-clinic document libraries with role-based permissions and version history." },
      { title: "Purview sensitivity labelling", description: "Applied automatic labels to patient files so sensitive records are encrypted and tracked wherever they're opened." },
      { title: "Conditional access rollout", description: "Enforced device compliance and MFA for anyone opening a patient record, on-site or remote." },
    ],
    toolsUsed: [
      { name: "SharePoint" },
      { name: "Microsoft Purview" },
      { name: "Entra ID" },
      { name: "Intune" },
    ],
    stat: { value: "0", label: "Compliance incidents since go-live" },
    metrics: [
      { value: "100%", label: "Patient files now under access control" },
      { value: "6", label: "Clinics migrated without downtime" },
      { value: "48 hrs", label: "Average offboarding-to-access-revoked time, down from 3 weeks" },
    ],
    quote: {
      text: "We went from crossing our fingers during audits to handing the auditor a report. That alone was worth the project.",
      author: "Dana Whitfield",
      role: "Practice Operations Director",
    },
    status: "published",
    publishedDate: "2025-11-01T00:00:00.000Z",
  },
  {
    client: "Northbridge Legal Partners",
    slug: "northbridge-legal-partners",
    industry: "Professional Services",
    headline: "40% faster document turnaround, firm-wide.",
    summary:
      "Client files were spread across personal inboxes, causing version conflicts and slow document turnaround. We gave every matter a single source of truth with automated intake.",
    facts: [
      { label: "Size", value: "65 staff" },
      { label: "Practice Areas", value: "4" },
      { label: "Timeline", value: "5 weeks" },
      { label: "Service Level", value: "Managed 365" },
    ],
    challenge:
      "Client files were spread across personal inboxes and desktop folders, causing version conflicts and slow document turnaround. Partners would attach the wrong revision to a client email, associates duplicated work because they couldn't see what had already been drafted, and matter status lived only in whoever's head last touched the file.",
    challengePoints: [
      { point: "No single source of truth for matter documents — every attorney kept their own copies" },
      { point: "Client intake was a manual email-and-spreadsheet process, prone to dropped requests" },
      { point: "Case status tracking existed only in individual inboxes, invisible to the rest of the team" },
    ],
    result:
      "We rolled out SharePoint client portals with automated intake workflows in Power Automate and Planner-based case tracking, giving every matter one authoritative folder and a visible pipeline.",
    approach: [
      { title: "Matter structure design", description: "Standardised a SharePoint site template per practice area so every new matter starts with the right folders and permissions automatically." },
      { title: "Automated intake workflow", description: "Built a Power Automate flow that turns a new-client form into a structured matter folder, checklist, and welcome email — no manual setup." },
      { title: "Client portal rollout", description: "Gave clients a branded, permissioned SharePoint portal to exchange documents instead of email attachments." },
      { title: "Planner-based case tracking", description: "Replaced inbox-based status tracking with shared Planner boards visible to the whole team." },
    ],
    toolsUsed: [
      { name: "SharePoint" },
      { name: "Power Automate" },
      { name: "Planner" },
      { name: "Microsoft Forms" },
    ],
    stat: { value: "40%", label: "Faster document turnaround" },
    metrics: [
      { value: "65", label: "Staff onboarded to the new matter structure" },
      { value: "0", label: "Lost-revision incidents since rollout" },
      { value: "3 days", label: "Average intake-to-active-matter time, down from 9" },
    ],
    quote: {
      text: "Associates stopped asking 'which version is current' in every meeting. That question alone used to eat an hour a week per matter.",
      author: "Marcus Feld",
      role: "Managing Partner",
    },
    status: "published",
    publishedDate: "2025-10-15T00:00:00.000Z",
  },
  {
    client: "Alden Manufacturing Co.",
    slug: "alden-manufacturing-co",
    industry: "Manufacturing",
    headline: "3x faster issue response on the shop floor.",
    summary:
      "Managers had no visibility into shop-floor production data and relied on end-of-day paper reports. We connected the floor to live dashboards and a maintenance request system.",
    facts: [
      { label: "Size", value: "310 staff" },
      { label: "Plants", value: "2" },
      { label: "Timeline", value: "10 weeks" },
      { label: "Service Level", value: "Secure 365 + Power Platform" },
    ],
    challenge:
      "Managers had no visibility into shop-floor production data; they relied on end-of-day paper reports that were often a full shift stale by the time anyone read them. A stalled line or a failing part could sit unreported for hours, and maintenance requests were phone calls and sticky notes that regularly got lost between shifts.",
    challengePoints: [
      { point: "Production data was only ever reviewed the next morning, a full shift late" },
      { point: "Maintenance requests were verbal handoffs between shifts, with no record" },
      { point: "No way to compare plant performance without manually re-keying paper logs" },
    ],
    result:
      "We built live Power BI dashboards fed by shop-floor sensors and a Power Apps maintenance request system, so issues surface the moment they happen instead of the next morning.",
    approach: [
      { title: "Shop-floor data audit", description: "Catalogued every existing sensor and PLC feed across both plants to find what could be tapped without new hardware." },
      { title: "Live Power BI dashboards", description: "Streamed production data into role-specific dashboards — line status for supervisors, throughput trends for plant managers." },
      { title: "Power Apps maintenance requests", description: "Replaced verbal handoffs with a tablet app that logs, timestamps, and routes maintenance requests to the right technician." },
      { title: "Cross-plant reporting", description: "Unified both plants' data into one Power BI workspace so leadership compares performance without re-keying anything." },
    ],
    toolsUsed: [
      { name: "Power BI" },
      { name: "Power Apps" },
      { name: "Power Automate" },
      { name: "SharePoint" },
    ],
    stat: { value: "3x", label: "Faster issue response time" },
    metrics: [
      { value: "2", label: "Plants unified onto one live reporting view" },
      { value: "92%", label: "Of maintenance requests now logged digitally" },
      { value: "17%", label: "Reduction in unplanned downtime, first quarter" },
    ],
    quote: {
      text: "The first time a supervisor caught a jam from the dashboard before the line even called it in, that's when the plant manager stopped asking if this was worth it.",
      author: "Renata Alden",
      role: "VP of Operations",
    },
    status: "published",
    publishedDate: "2025-09-20T00:00:00.000Z",
  },
  {
    client: "Coastal Hospitality Group",
    slug: "coastal-hospitality-group",
    industry: "Hospitality",
    headline: "500+ staff, one connected operation.",
    summary:
      "Front desk, housekeeping, and management teams were communicating through disconnected group chats and phone calls. We unified six properties inside Microsoft Teams.",
    facts: [
      { label: "Size", value: "500+ staff" },
      { label: "Properties", value: "6" },
      { label: "Timeline", value: "7 weeks" },
      { label: "Service Level", value: "Teams Voice + 365" },
    ],
    challenge:
      "Front desk, housekeeping, and management teams across six properties were communicating through a patchwork of personal group chats, walkie-talkies, and phone calls. A guest request could bounce between three group chats before reaching housekeeping, shift handoffs relied on whoever remembered to call the next person, and corporate had no consistent way to reach staff across properties at once.",
    challengePoints: [
      { point: "Guest requests routed through informal group chats with no accountability" },
      { point: "Shift handoffs depended on someone remembering to make a phone call" },
      { point: "No consistent scheduling system — each property ran its own spreadsheet" },
      { point: "Corporate announcements reached some properties days after others" },
    ],
    result:
      "We unified all property operations inside Microsoft Teams with Bookings integration and shift-based channels, giving every property the same structure and corporate one channel to reach everyone at once.",
    approach: [
      { title: "Property-by-property Teams rollout", description: "Deployed a standard Teams structure — front desk, housekeeping, maintenance, management — to all six properties on the same template." },
      { title: "Shift-based channels", description: "Replaced ad hoc group chats with channels scoped to each shift, so handoffs are a pinned message, not a phone call." },
      { title: "Bookings integration", description: "Connected Microsoft Bookings to housekeeping's Teams channel so room-turnover requests appear automatically." },
      { title: "Company-wide rollout and training", description: "Ran short in-person training at each property so staff were comfortable on Teams from week one, not month three." },
    ],
    toolsUsed: [
      { name: "Microsoft Teams" },
      { name: "Microsoft Bookings" },
      { name: "SharePoint" },
      { name: "Teams Phone" },
    ],
    stat: { value: "500+", label: "Staff onboarded across 6 properties" },
    metrics: [
      { value: "6", label: "Properties moved to one operating structure" },
      { value: "65%", label: "Fewer missed guest requests in the first month" },
      { value: "1", label: "Channel corporate now uses to reach every property at once" },
    ],
    quote: {
      text: "Six properties used to mean six different ways of doing things. Now a manager can cover a shift at a property they've never worked and know exactly where to look.",
      author: "Priya Nandakumar",
      role: "Director of Operations",
    },
    status: "published",
    publishedDate: "2025-08-05T00:00:00.000Z",
  },
  {
    client: "Ferris & Cole Retail",
    slug: "ferris-cole-retail",
    industry: "Retail & Wholesale",
    headline: "60% fewer stockouts, without adding headcount.",
    summary:
      "Manual reorder spreadsheets led to frequent stockouts and duplicated purchase orders. We automated reordering and connected it to live inventory reporting.",
    facts: [
      { label: "Size", value: "40 staff" },
      { label: "Locations", value: "5 stores + 1 warehouse" },
      { label: "Timeline", value: "6 weeks" },
      { label: "Service Level", value: "Power Platform + 365" },
    ],
    challenge:
      "Manual reorder spreadsheets, maintained by two buyers who didn't always talk to each other, led to frequent stockouts on fast-moving items and duplicated purchase orders on slow ones. By the time a stockout showed up in a weekly report, the store had usually already lost several days of sales on that item.",
    challengePoints: [
      { point: "Two buyers maintained separate reorder spreadsheets that regularly disagreed" },
      { point: "Stockouts weren't visible until the weekly manual inventory report" },
      { point: "Purchase orders were duplicated when both buyers reordered the same SKU" },
    ],
    result:
      "We automated reorder workflows in Power Automate, connected to live inventory reporting in Power BI, so both buyers work from the same real-time numbers and reorders trigger before shelves go empty.",
    approach: [
      { title: "Inventory data consolidation", description: "Merged both buyers' spreadsheets and the POS system's inventory feed into a single Power BI data model." },
      { title: "Live stock dashboards", description: "Built per-store and warehouse dashboards showing stock levels and days-of-supply, refreshed continuously instead of weekly." },
      { title: "Automated reorder triggers", description: "Set Power Automate flows to raise a draft purchase order the moment a SKU crosses its reorder point, tagged to one buyer to avoid duplicates." },
      { title: "Buyer handoff training", description: "Trained both buyers on the shared dashboard so reorder decisions are made from the same numbers, not two spreadsheets." },
    ],
    toolsUsed: [
      { name: "Power BI" },
      { name: "Power Automate" },
      { name: "SharePoint" },
      { name: "Excel" },
    ],
    stat: { value: "60%", label: "Reduction in stockout incidents" },
    metrics: [
      { value: "5", label: "Stores now on one live inventory view" },
      { value: "0", label: "Duplicate purchase orders since rollout" },
      { value: "2 days", label: "Average stockout-to-reorder time, down from 9" },
    ],
    quote: {
      text: "We stopped finding out about stockouts from customers asking why the shelf was empty. Now we see it coming days ahead.",
      author: "Owen Ferris",
      role: "Co-Owner",
    },
    status: "published",
    publishedDate: "2025-07-10T00:00:00.000Z",
  },
  {
    client: "Summit Valley School District",
    slug: "summit-valley-school-district",
    industry: "Education",
    headline: "12 schools migrated in a single term.",
    summary:
      "Hybrid classrooms lacked a consistent platform, and device management was handled manually per school. We deployed a district-wide Microsoft 365 EDU standard.",
    facts: [
      { label: "Size", value: "12 schools" },
      { label: "Students", value: "8,400" },
      { label: "Timeline", value: "One school term" },
      { label: "Service Level", value: "365 EDU + Intune" },
    ],
    challenge:
      "Hybrid classrooms lacked a consistent platform — some schools used Teams, others used a mix of email and paper handouts, and device management was handled manually, school by school, by whichever staff member happened to know the most about computers. A device issue at one school could take days to resolve, and there was no districtwide way to push a security update or lock a lost device.",
    challengePoints: [
      { point: "No consistent classroom platform — each school picked its own tools" },
      { point: "Device management was manual and inconsistent across all 12 schools" },
      { point: "IT had no way to push security updates or remotely lock lost devices district-wide" },
      { point: "Teachers new to a school had to relearn a different system each time" },
    ],
    result:
      "We deployed Microsoft 365 EDU with Teams-based hybrid classrooms and Intune-managed device fleets across the district, giving every school the same platform and IT one console to manage every device.",
    approach: [
      { title: "District-wide standards design", description: "Defined one Teams-for-Education classroom structure and device policy to be rolled out identically at all 12 schools." },
      { title: "Phased school rollout", description: "Migrated schools in waves through the term, starting with the two most tech-ready to build a repeatable playbook." },
      { title: "Intune device enrollment", description: "Enrolled every district device into Intune for centralized policy, patching, and remote lock/wipe capability." },
      { title: "Teacher onboarding", description: "Ran short per-school training sessions so every teacher started the following term on the same platform, no exceptions." },
    ],
    toolsUsed: [
      { name: "Microsoft Teams for Education" },
      { name: "Intune" },
      { name: "Entra ID" },
      { name: "SharePoint" },
    ],
    stat: { value: "12", label: "Schools migrated in one term" },
    metrics: [
      { value: "8,400", label: "Students on one consistent classroom platform" },
      { value: "100%", label: "District devices now centrally managed" },
      { value: "1", label: "Console IT now uses to patch or lock any device districtwide" },
    ],
    quote: {
      text: "For the first time, a teacher who transfers schools mid-year doesn't have to relearn anything. It's the same Teams setup everywhere.",
      author: "Karen Ibsen",
      role: "Director of Technology",
    },
    status: "published",
    publishedDate: "2025-06-01T00:00:00.000Z",
  },
]
