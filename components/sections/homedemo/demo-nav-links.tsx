"use client"

import { useEffect, useState } from "react"

const LINKS = [
  { label: "What we solve", href: "#solve" },
  { label: "What we provide", href: "#provide" },
  { label: "How it works", href: "#process" },
  { label: "Proof", href: "#proof" },
] as const

// Scroll-spy nav links: the current section is tracked via
// IntersectionObserver and underlined, so a visitor can tell where they are
// on the page without hunting for a scrollbar position. Falls back to plain
// links (no active state) until mounted.
export function DemoNavLinks({ className = "" }: { className?: string }) {
  const [active, setActive] = useState<string | null>(null)

  useEffect(() => {
    const sections = LINKS.map((l) => document.getElementById(l.href.slice(1))).filter(
      (el): el is HTMLElement => el !== null
    )
    if (sections.length === 0) return

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActive(`#${entry.target.id}`)
        }
      },
      { rootMargin: "-45% 0px -50% 0px", threshold: 0 }
    )
    sections.forEach((section) => observer.observe(section))
    return () => observer.disconnect()
  }, [])

  return (
    <nav aria-label="Page sections" className={className}>
      {LINKS.map((link) => {
        const isActive = active === link.href
        return (
          <a
            key={link.href}
            href={link.href}
            aria-current={isActive ? "location" : undefined}
            className={`group relative whitespace-nowrap py-1 text-sm transition-colors ${
              isActive ? "text-foreground" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {link.label}
            <span
              aria-hidden="true"
              className={`absolute inset-x-0 -bottom-[3px] h-[1.5px] rounded-full bg-primary transition-transform duration-300 ease-out ${
                isActive ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"
              }`}
            />
          </a>
        )
      })}
    </nav>
  )
}
