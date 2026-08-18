// Seed data for the "case-studies" Payload collection, inserted once by the
// onInit hook in payload.config.ts if the collection is empty. Lets the
// /case-studies page have real content to search/filter on a fresh
// database, without requiring manual entry via /admin first.

import type { SITEMAP_INDUSTRY_TITLES } from "@/lib/content/site"

export type CaseStudySeed = {
  client: string
  slug: string
  industry: (typeof SITEMAP_INDUSTRY_TITLES)[number]
  challenge: string
  result: string
  stat: { value: string; label: string }
  status: "published"
  publishedDate: string
}

export const CASE_STUDIES_SEED: CaseStudySeed[] = [
  {
    client: "Regional Medical Group", slug: "regional-medical-group", industry: "Healthcare",
    challenge: "Patient records scattered across shared drives with no access controls, risking HIPAA-adjacent compliance failures.",
    result: "Migrated all records into a governed SharePoint structure with Purview sensitivity labels and Entra conditional access.",
    stat: { value: "0", label: "Compliance incidents since go-live" },
    status: "published", publishedDate: "2025-11-01T00:00:00.000Z",
  },
  {
    client: "Northbridge Legal Partners", slug: "northbridge-legal-partners", industry: "Professional Services",
    challenge: "Client files spread across personal inboxes, causing version conflicts and slow document turnaround.",
    result: "Rolled out SharePoint client portals with automated intake workflows in Power Automate and Planner-based case tracking.",
    stat: { value: "40%", label: "Faster document turnaround" },
    status: "published", publishedDate: "2025-10-15T00:00:00.000Z",
  },
  {
    client: "Alden Manufacturing Co.", slug: "alden-manufacturing-co", industry: "Manufacturing",
    challenge: "No visibility into shop-floor production data; managers relied on end-of-day paper reports.",
    result: "Built live Power BI dashboards fed by shop-floor sensors and a Power Apps maintenance request system.",
    stat: { value: "3x", label: "Faster issue response time" },
    status: "published", publishedDate: "2025-09-20T00:00:00.000Z",
  },
  {
    client: "Coastal Hospitality Group", slug: "coastal-hospitality-group", industry: "Hospitality",
    challenge: "Front desk, housekeeping, and management teams communicating through disconnected group chats and phone calls.",
    result: "Unified all property operations inside Microsoft Teams with Bookings integration and shift-based channels.",
    stat: { value: "500+", label: "Staff onboarded across 6 properties" },
    status: "published", publishedDate: "2025-08-05T00:00:00.000Z",
  },
  {
    client: "Ferris & Cole Retail", slug: "ferris-cole-retail", industry: "Retail & Wholesale",
    challenge: "Manual reorder spreadsheets led to frequent stockouts and duplicated purchase orders.",
    result: "Automated reorder workflows in Power Automate connected to live inventory reporting in Power BI.",
    stat: { value: "60%", label: "Reduction in stockout incidents" },
    status: "published", publishedDate: "2025-07-10T00:00:00.000Z",
  },
  {
    client: "Summit Valley School District", slug: "summit-valley-school-district", industry: "Education",
    challenge: "Hybrid classrooms lacked a consistent platform, and device management was handled manually per-school.",
    result: "Deployed Microsoft 365 EDU with Teams-based hybrid classrooms and Intune-managed device fleets district-wide.",
    stat: { value: "12", label: "Schools migrated in one term" },
    status: "published", publishedDate: "2025-06-01T00:00:00.000Z",
  },
]
