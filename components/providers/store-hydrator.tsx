"use client"

import { useEffect } from "react"
import { useUIStore } from "@/lib/store"

// Replays persisted UI state from sessionStorage after mount.
//
// The store is created with `skipHydration: true` so the first client render
// matches the server HTML exactly; this component then rehydrates, which is
// what makes a filtered list or an open FAQ survive a page refresh.
//
// Renders nothing and subscribes to nothing, so it never re-renders and never
// affects the tree around it. Mounted once in the frontend layout.
export function StoreHydrator() {
  useEffect(() => {
    useUIStore.persist.rehydrate()
  }, [])

  return null
}
