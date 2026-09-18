import type { Metadata } from "next"
import { DemoHeader } from "@/components/sections/homedemo/demo-header"
import { DemoHero } from "@/components/sections/homedemo/demo-hero"
import { DemoSolve } from "@/components/sections/homedemo/demo-solve"
import { DemoProvide } from "@/components/sections/homedemo/demo-provide"
import { DemoProcess } from "@/components/sections/homedemo/demo-process"
import { DemoProof } from "@/components/sections/homedemo/demo-proof"
import { DemoCta } from "@/components/sections/homedemo/demo-cta"
import { DemoFooter } from "@/components/sections/homedemo/demo-footer"
import { getServices } from "@/lib/cms/services"

export const metadata: Metadata = {
  title: "Homepage Concept | MStack360",
  description: "A simple, modern homepage design concept for MStack360, focused on what we solve and what we provide.",
  robots: { index: false, follow: false },
}

// A standalone homepage redesign concept at /homedemo. It shares the site's
// tokens, fonts and theme provider (inherited from the (frontend) layout)
// but none of its chrome or existing homepage sections — new header, new
// footer, new section components under components/sections/homedemo/, so
// the live homepage (app/(frontend)/page.tsx) is untouched.
//
// Structure is deliberately short and linear — one page, four questions a
// visitor actually has, answered in order: what's wrong (solve), what we'd
// do about it (provide), what working with us looks like (process), and why
// believe any of it (proof) — closing on the one offer everything points at.
export default async function HomeDemoPage() {
  const services = await getServices()
  const levels = services.filter((service) => service.kind === "level")

  return (
    <div className="min-h-screen bg-background font-sans text-foreground antialiased">
      <DemoHeader />
      <DemoHero />
      <DemoSolve />
      <DemoProvide levels={levels} />
      <DemoProcess />
      <DemoProof />
      <DemoCta />
      <DemoFooter />
    </div>
  )
}
