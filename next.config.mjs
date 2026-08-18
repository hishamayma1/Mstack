import { withPayload } from "@payloadcms/next/withPayload"

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Cache Components (Next 16). Lets the Payload data-access functions in
  // lib/payload-*.ts opt into the framework cache with "use cache", so a
  // collection is read once and reused across every page and every request
  // that needs it, instead of once per page per build.
  cacheComponents: true,
  experimental: {
    // Enables app/global-not-found.tsx — the branded 404 for URLs that match
    // no route. Needed because this app has two root layouts ((frontend) and
    // (payload)), so there's no single root layout for Next to build a
    // global 404 from; without it, unmatched URLs get the framework default.
    globalNotFound: true,
  },
}

export default withPayload(nextConfig, { devBundleServerPackages: false })
