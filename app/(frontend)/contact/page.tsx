import type { Metadata } from "next"
import { PageShell } from "@/components/layout/page-shell"
import { PageHero } from "@/components/sections/shared/page-hero"
import { ContactSection } from "@/components/sections/contact/contact-section"

export const metadata: Metadata = {
  title: "Contact | MStack360 — Book a Free Consultation",
  description: "Get in touch with MStack360 for a free, no-obligation 15-minute Microsoft 365 consultation.",
}

export default function ContactPage() {
  return (
    <PageShell>
      <PageHero
        eyebrow="CONTACT"
        title={"Let's Talk About\nYour Environment."}
        subtitle="A genuine, no-obligation conversation — we listen first, then outline a realistic path forward."
      />
      <ContactSection />
    </PageShell>
  )
}
