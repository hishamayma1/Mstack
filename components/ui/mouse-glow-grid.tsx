"use client"

import type { ReactNode, MouseEvent } from "react"

// Thin client shell around a grid of BentoCards. Only the onMouseMove
// handler needs the client boundary — server section components pass
// their (server-rendered) card markup in as `children`, which is composed
// on the server and simply slotted in here, so this wrapper doesn't pull
// the grid contents into the client bundle.
export function MouseGlowGrid({ className = "", children }: { className?: string; children: ReactNode }) {
  const handleMouse = (e: MouseEvent<HTMLDivElement>) => {
    const el = e.currentTarget
    const rect = el.getBoundingClientRect()
    el.style.setProperty("--mouse-x", `${e.clientX - rect.left}px`)
    el.style.setProperty("--mouse-y", `${e.clientY - rect.top}px`)
  }

  return (
    <div className={className} onMouseMove={handleMouse}>
      {children}
    </div>
  )
}
