import config from "@payload-config"
import "@payloadcms/next/css"
import { handleServerFunctions, RootLayout } from "@payloadcms/next/layouts"
import { connection } from "next/server"
import type { ServerFunctionClient } from "payload"
import type { ReactNode } from "react"

import { importMap } from "./admin/importMap"
import "./custom.scss"

type Args = {
  children: ReactNode
}

const serverFunction: ServerFunctionClient = async (args) => {
  "use server"
  return handleServerFunctions({
    ...args,
    config,
    importMap,
  })
}

// Second root layout, alongside app/(frontend)/layout.tsx — Next.js
// supports multiple root layouts as long as no shared app/layout.tsx
// exists above both route groups. Payload's RootLayout renders its own
// <html>/<body>, independent of the marketing site's theme.
//
// ─────────────────────────────────────────────────────────────────────────────
// Why this layout opts out of prerendering, in two parts.
//
// `cacheComponents` (next.config.mjs) checks that every route can be
// prerendered. The admin can't be: Payload's own RootLayout resolves the
// session on every render, and initReq.ts reads `new Date()` while doing it.
// That call is in a third-party package, so caching or rewriting it isn't
// available to us — we have to stop the prerender before it runs.
//
// 1. `await connection()` does exactly that. It marks the point where
//    rendering waits for a real request, so everything below it (all of
//    Payload's code) is request-time and the clock read is no longer
//    "during prerendering". This is the documented fix for `new Date()`.
//
// 2. `instant = false` then allows the resulting blocking route. Without it,
//    Next flags the `connection()` call for sitting outside a <Suspense>
//    boundary — and there's no useful boundary to add, since Payload owns the
//    entire subtree and there is nothing static to show while it loads.
//
// Neither changes how the route behaves. The admin is an authenticated app
// shell that hits the database on every request; a blocking, request-time
// render is correct for it. Both are needed — the page-level export alone
// didn't clear this, because a page can't opt out of work its layout does
// above it.
// ─────────────────────────────────────────────────────────────────────────────
export const instant = false

const Layout = async ({ children }: Args) => {
  await connection()

  return (
    <RootLayout config={config} importMap={importMap} serverFunction={serverFunction}>
      {children}
    </RootLayout>
  )
}

export default Layout
