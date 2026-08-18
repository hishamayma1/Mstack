import Image from "next/image"
import Link from "next/link"
import type { ServerProps } from "payload"

// Sits at the very top of the admin sidebar, via `admin.components.beforeNavLinks`.
//
// Payload only renders `graphics.Icon` in the breadcrumb bar, which is an 18px
// square — far too small for a 2:1 lockup. The sidebar has no brand slot of its
// own, so this adds one: the full lockup, sized properly, linking home.
export function BrandNav({ payload }: Partial<ServerProps>) {
  const adminRoute = payload?.config?.routes?.admin ?? "/admin"

  return (
    <Link href={adminRoute} className="mstack-navbrand" aria-label="MStack360 dashboard home">
      <Image
        src="/Mstacklogo.webp"
        alt="MStack360"
        width={1024}
        height={512}
        priority
        unoptimized
      />
    </Link>
  )
}

export default BrandNav
