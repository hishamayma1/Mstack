import type { Metadata } from "next"
import { PageShell } from "@/components/layout/page-shell"
import { PageHero } from "@/components/sections/shared/page-hero"
import { LegalDocumentSection } from "@/components/sections/legal/legal-document-section"

export const metadata: Metadata = {
  title: "Legal | MStack360 — Privacy, Terms & Cookie Policy",
  description: "MStack360's Privacy Policy, Terms of Service, and Cookie Policy.",
}

export default function LegalPage() {
  return (
    <PageShell>
      <PageHero eyebrow="LEGAL" title={"Privacy, Terms\n& Cookies."} />
      <LegalDocumentSection />
    </PageShell>
  )
}
