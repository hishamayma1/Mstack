import type { Metadata } from "next"

import config from "@payload-config"
import "@payloadcms/next/css"
import { NotFoundPage, generatePageMetadata } from "@payloadcms/next/views"
import { importMap } from "../importMap"

// Same reasoning as page.tsx in this folder: Payload's admin not-found reads
// the session and renders at request time, so it opts out of prerender
// validation rather than pretending it can be static.
export const instant = false

type Args = {
  params: Promise<{
    segments: string[]
  }>
  searchParams: Promise<{
    [key: string]: string | string[]
  }>
}

export const generateMetadata = ({ params, searchParams }: Args): Promise<Metadata> =>
  generatePageMetadata({ config, params, searchParams })

const NotFound = ({ params, searchParams }: Args) =>
  NotFoundPage({ config, params, searchParams, importMap })

export default NotFound
