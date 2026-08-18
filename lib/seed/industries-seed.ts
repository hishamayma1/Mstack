// Seed data for the "industries" Payload collection, inserted once by the
// onInit hook in payload.config.ts if the collection is empty. The 7
// sectors listed in the site's sitemap, each with the specific problems
// we solve for that industry — shown on its /industries/[slug] page.
//
// The marketing fields (headline, stats, challenges, tools, outcomes, CTA copy)
// are merged in from lib/industry-content.ts rather than duplicated here, so
// there's one place to edit that copy. Databases seeded before those fields
// existed keep working: getIndustryBySlug() falls back to the same source.

import { INDUSTRY_CONTENT } from "@/lib/content/industries"

const BASE_INDUSTRIES = [
  {
    title: "Healthcare", slug: "healthcare", order: 10, status: "published" as const,
    summary: "Protect sensitive patient data with Microsoft Purview compliance tools, enforce HIPAA-aware access policies via Entra ID, and streamline care coordination through secure Teams channels.",
    solutions: [
      { title: "Patient Data Compliance", description: "Microsoft Purview sensitivity labels and DLP policies keep patient records classified and access-controlled automatically, without relying on staff to remember the rules." },
      { title: "Secure Care Coordination", description: "Teams channels with conditional access let clinical staff coordinate on cases without emailing sensitive files back and forth." },
      { title: "Access Governance", description: "Entra ID role-based access ensures only authorised staff can reach patient records, with a full audit trail of who accessed what and when." },
      { title: "Appointment & Intake Automation", description: "Power Automate workflows handle intake forms and appointment reminders, cutting no-shows and manual administrative work." },
    ],
  },
  {
    title: "Banking & Finance", slug: "banking-finance", order: 20, status: "published" as const,
    summary: "Enforce MFA, privileged identity management, and encrypted communication across your organisation with Microsoft Defender and Entra ID — keeping customer data and audit trails watertight.",
    solutions: [
      { title: "Regulatory-Grade Identity Security", description: "Entra ID Privileged Identity Management and enforced MFA across every account that touches financial data, with just-in-time access instead of standing admin rights." },
      { title: "Encrypted Client Communication", description: "Purview Message Encryption ensures sensitive statements and account details never leave the tenant unprotected, even when sent externally." },
      { title: "Audit-Ready Record Keeping", description: "Retention policies and eDiscovery are configured up front to meet financial compliance and audit requirements without a scramble at review time." },
      { title: "Fraud-Resistant Access Controls", description: "Conditional access policies block risky or impossible-travel sign-ins before they ever reach financial systems." },
    ],
  },
  {
    title: "Education", slug: "education", order: 30, status: "published" as const,
    summary: "Roll out Microsoft 365 EDU with Teams for hybrid classrooms, OneNote Class Notebooks for shared lesson plans, and Intune-managed devices that keep students focused and data protected.",
    solutions: [
      { title: "Hybrid Classroom Delivery", description: "Teams for Education rolled out and configured for both live and asynchronous hybrid learning, so no student falls behind." },
      { title: "Managed Student Devices", description: "Intune device policies keep school-issued devices locked down, content-filtered, and easy for IT to manage at scale." },
      { title: "Shared Lesson Planning", description: "OneNote Class Notebooks give every teacher a structured, collaborative space for curriculum and lesson plans." },
      { title: "Safeguarding & Access Control", description: "Entra ID groups and conditional access keep student data properly separated from staff systems and external access." },
    ],
  },
  {
    title: "Manufacturing", slug: "manufacturing", order: 40, status: "published" as const,
    summary: "Connect shop floor to back office with Power BI dashboards tracking production KPIs in real time, Power Apps for maintenance requests, and Teams for instant shift-handover communications.",
    solutions: [
      { title: "Real-Time Production Visibility", description: "Power BI dashboards pull shop-floor data into live KPI views, so managers see problems as they happen instead of in next week's report." },
      { title: "Maintenance Request Automation", description: "Power Apps forms route equipment issues straight to the right maintenance team, with status tracked from report to resolution." },
      { title: "Shift Handover Communication", description: "Teams channels structured by shift keep handover notes, incidents, and priorities from getting lost between crews." },
      { title: "Supply Chain Coordination", description: "SharePoint document libraries and Power Automate approvals connect suppliers and procurement without endless email threads." },
    ],
  },
  {
    title: "Retail & Wholesale", slug: "retail-wholesale", order: 50, status: "published" as const,
    summary: "Arm your sales team with Microsoft 365-connected data in Teams, automate reorder workflows in Power Automate, and give managers live inventory insights through Power BI reports.",
    solutions: [
      { title: "Inventory Visibility", description: "Power BI reports give managers live stock levels across every location, instead of relying on end-of-day spreadsheet exports." },
      { title: "Automated Reordering", description: "Power Automate workflows trigger purchase orders before stockouts happen, based on thresholds you set." },
      { title: "Connected Sales Teams", description: "Teams and SharePoint give frontline staff instant access to current product and pricing data on the floor." },
      { title: "Seasonal Staffing Support", description: "Streamlined Microsoft 365 provisioning gets seasonal hires access to exactly what they need, fast, and revokes it just as cleanly." },
    ],
  },
  {
    title: "Hospitality", slug: "hospitality", order: 60, status: "published" as const,
    summary: "Unify guest communications, staff scheduling, and property operations inside Microsoft Teams and Bookings — so every team member stays connected from front desk to housekeeping.",
    solutions: [
      { title: "Unified Property Operations", description: "Microsoft Teams and Bookings connect front desk, housekeeping, and management in one place instead of radios and sticky notes." },
      { title: "Guest Communication at Scale", description: "Automated booking confirmations and reminders via Power Automate reduce no-shows and manual front-desk work." },
      { title: "Multi-Property Consistency", description: "The same Microsoft 365 configuration and security baseline rolled out identically across every property you operate." },
      { title: "Staff Scheduling & Handoffs", description: "Shift-based Teams channels keep every incoming shift briefed on what happened before they arrive." },
    ],
  },
  {
    title: "Professional Services", slug: "professional-services", order: 70, status: "published" as const,
    summary: "Replace scattered inboxes and spreadsheets with SharePoint client portals, automated proposals in Power Automate, and project tracking in Planner — helping your firm deliver faster with fewer errors.",
    solutions: [
      { title: "Client Portals", description: "SharePoint-based client portals replace scattered email threads for document exchange, with proper permissions per client." },
      { title: "Automated Intake & Proposals", description: "Power Automate workflows generate and route proposals without a partner having to chase approvals manually." },
      { title: "Project & Case Tracking", description: "Planner boards keep every engagement visible and on schedule, with clear ownership at each stage." },
      { title: "Time & Billing Clarity", description: "Structured SharePoint lists and Power BI reporting tie delivered work directly to billing, cutting down on write-offs from lost time." },
    ],
  },
]

export const INDUSTRIES_SEED = BASE_INDUSTRIES.map((industry) => ({
  ...industry,
  ...INDUSTRY_CONTENT[industry.slug],
}))
