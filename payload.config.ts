import path from "path"
import { fileURLToPath } from "url"
import { mongooseAdapter } from "@payloadcms/db-mongodb"
import { nodemailerAdapter } from "@payloadcms/email-nodemailer"
import { lexicalEditor } from "@payloadcms/richtext-lexical"
import { uploadthingStorage } from "@payloadcms/storage-uploadthing"
import { buildConfig, type CollectionSlug, type Payload } from "payload"
import sharp from "sharp"

import { Users } from "./collections/Users"
import { Media } from "./collections/Media"
import { CaseStudies } from "./collections/CaseStudies"
import { BlogPosts } from "./collections/BlogPosts"
import { Guides } from "./collections/Guides"
import { Tools } from "./collections/Tools"
import { FAQs } from "./collections/FAQs"
import { Industries } from "./collections/Industries"
import { Services } from "./collections/Services"
import { ServiceRequests } from "./collections/ServiceRequests"
import { PushSubscriptions } from "./collections/PushSubscriptions"
import { CASE_STUDIES_SEED } from "./lib/seed/case-studies-seed"
import { BLOG_POSTS_SEED, GUIDES_SEED, TOOLS_SEED, FAQS_SEED } from "./lib/seed/resources-seed"
import { INDUSTRIES_SEED } from "./lib/seed/industries-seed"
import { SERVICES_SEED } from "./lib/seed/services-seed"

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

// SMTP is only wired up once credentials are actually present — with an
// empty user/pass, nodemailer would fail to authenticate on every auth
// email Payload tries to send, so the safer default without credentials
// is to leave `email` unset and let Payload log emails to the console.
const emailAdapter =
  process.env.SMTP_USER && process.env.SMTP_PASS
    ? nodemailerAdapter({
        defaultFromAddress: process.env.EMAIL_FROM_ADDRESS || process.env.SMTP_USER,
        defaultFromName: process.env.EMAIL_FROM_NAME || "MStack360",
        transportOptions: {
          host: process.env.SMTP_HOST || "smtp.office365.com",
          port: Number(process.env.SMTP_PORT) || 587,
          secure: false, // STARTTLS on port 587, standard for Office 365 SMTP AUTH
          auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS,
          },
        },
      })
    : undefined

// Seeds a collection once, if it's empty. Wrapped defensively at both
// levels: Next.js runs onInit once per build/dev worker process, so
// concurrent workers can race to seed the same collection at once — a
// failure here (lock contention, a duplicate slug from a sibling worker
// winning the race) should never take down the build or dev server.
async function seedCollection(payload: Payload, slug: CollectionSlug, docs: Record<string, unknown>[]) {
  try {
    const { totalDocs } = await payload.count({ collection: slug })
    if (totalDocs > 0) return

    for (const data of docs) {
      try {
        await payload.create({ collection: slug, data })
      } catch (err) {
        payload.logger.warn(`Skipped seeding "${slug}" doc "${data.slug ?? data.question}": ${(err as Error).message}`)
      }
    }
    payload.logger.info(`Seeded ${slug}.`)
  } catch (err) {
    payload.logger.warn(`Seed check skipped for "${slug}": ${(err as Error).message}`)
  }
}

// There must always be an Administrator, or nobody can create admins or
// manage the team. Accounts created before roles existed have no `role` and
// all had full access, so those are promoted first. If every account already
// has a role but none is an admin, the oldest account (the site owner) is
// promoted. Once any admin exists this is a no-op.
async function backfillAdminRole(payload: Payload) {
  try {
    const { totalDocs: admins } = await payload.count({ collection: "users", where: { role: { equals: "admin" } } })
    if (admins > 0) return
    const { docs } = await payload.update({
      collection: "users",
      where: { role: { exists: false } },
      data: { role: "admin" },
    })
    if (docs.length) {
      payload.logger.info(`Gave ${docs.length} existing account(s) the Administrator role.`)
      return
    }
    const { docs: oldest } = await payload.find({ collection: "users", sort: "createdAt", limit: 1, depth: 0 })
    if (!oldest[0]) return
    await payload.update({ collection: "users", id: oldest[0].id, data: { role: "admin" } })
    payload.logger.info(`No Administrator found — gave the oldest account (${oldest[0].email}) the Administrator role.`)
  } catch (err) {
    payload.logger.warn(`Role backfill skipped: ${(err as Error).message}`)
  }
}

export default buildConfig({
  admin: {
    user: Users.slug,

    // Forced dark, matching the marketing site's palette. The admin is an
    // extension of the brand, not a separate tool, and a single theme means
    // the custom styles in app/(payload)/custom.scss only have one set of
    // surfaces to be correct against. Set to "all" to restore the switcher.
    theme: "dark",

    meta: {
      titleSuffix: " · MStack360",
      description: "MStack360 content and sales dashboard.",
      icons: [{ rel: "icon", type: "image/png", url: "/icon-dark-32x32.png" }],
    },

    // The account icon (top right) shows the signed-in user's photo.
    avatar: { Component: "/components/admin/account-avatar#AccountAvatar" },

    components: {
      graphics: {
        Icon: "/components/admin/brand-icon#BrandIcon",
        Logo: "/components/admin/brand-logo#BrandLogo",
      },
      // The lockup at the top of the sidebar. Payload renders `graphics.Icon`
      // only in the breadcrumb bar, so the sidebar needs its own brand slot.
      beforeNavLinks: ["/components/admin/brand-nav#BrandNav"],
      // Pipeline summary above the collection cards on /admin.
      beforeDashboard: ["/components/admin/dashboard-welcome#DashboardWelcome"],
    },

    // Component paths above are resolved from this directory. It defaults to
    // process.cwd(), which is the repo root when running `next dev`/`next build`
    // — but pinning it to the config's own directory keeps the admin working
    // when Payload's CLI is invoked from somewhere else.
    importMap: {
      baseDir: path.resolve(dirname),
    },
  },

  // Order here is the order of the sidebar. Collections are grouped via
  // `admin.group` on each one; within the nav, groups appear in the order
  // their first collection appears in this array. So this list is arranged as
  // a working day reads — the sales inbox first, the things you sell next,
  // then the pages that market them, then the plumbing.
  collections: [
    // Sales
    ServiceRequests,
    Services,
    // Website
    Industries,
    CaseStudies,
    // Resources
    BlogPosts,
    Guides,
    Tools,
    FAQs,
    // System
    Media,
    Users,
    PushSubscriptions,
  ],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || "",
  typescript: {
    outputFile: path.resolve(dirname, "payload-types.ts"),
  },
  db: mongooseAdapter({
    url: process.env.DATABASE_URI || "",
  }),
  email: emailAdapter,
  sharp,
  plugins: [
    // Media files live on the UploadThing CDN instead of the local disk (which
    // doesn't persist on Vercel). Images are already compressed to WebP by the
    // Media collection's upload settings before this adapter sends them.
    // `disablePayloadAccessControl` makes each file's `url` the direct CDN
    // link rather than a /api/media/file/... route proxied through this app —
    // fine because Media is publicly readable anyway.
    uploadthingStorage({
      enabled: Boolean(process.env.UPLOADTHING_TOKEN),
      collections: {
        media: { disablePayloadAccessControl: true },
      },
      options: {
        token: process.env.UPLOADTHING_TOKEN,
        acl: "public-read",
      },
    }),
  ],
  // One-time seed so content pages have real data on a fresh database,
  // instead of shipping empty until someone fills in /admin.
  onInit: async (payload) => {
    await backfillAdminRole(payload)
    await seedCollection(payload, "case-studies", CASE_STUDIES_SEED)
    await seedCollection(payload, "blog-posts", BLOG_POSTS_SEED)
    await seedCollection(payload, "guides", GUIDES_SEED)
    await seedCollection(payload, "tools", TOOLS_SEED)
    await seedCollection(payload, "faqs", FAQS_SEED)
    await seedCollection(payload, "industries", INDUSTRIES_SEED)
    // Note: no seed for "service-requests" — that collection is filled by
    // visitors, and an empty inbox is the correct initial state.
    await seedCollection(payload, "services", SERVICES_SEED)
  },
})
