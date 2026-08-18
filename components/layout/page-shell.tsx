import type { ReactNode } from "react"
import { MobileNav } from "@/components/layout/mobile-nav"
import { FloatingActions } from "@/components/layout/floating-actions"
import { SiteFooter } from "@/components/layout/site-footer"
import styles from "./page-shell.module.css"

// Shared shell for every non-home route: same dark background, fixed nav,
// and footer as the homepage, with zero client JS of its own — the nav's
// interactivity stays isolated to MobileNav. `children` is wrapped so the
// page fades in on mount (see page-shell.module.css); nav and footer sit
// outside that wrapper so they don't re-animate.
export function PageShell({ children }: { children: ReactNode }) {
  return (
    <div className="bg-[#0A0E17] text-[#F3F5FA] min-h-screen font-sans antialiased">
      <MobileNav />
      <div className={styles.enter}>{children}</div>
      <FloatingActions />
      <SiteFooter />
    </div>
  )
}
