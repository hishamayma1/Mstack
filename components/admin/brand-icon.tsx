import Image from "next/image"

// Replaces the Payload mark in the top-left of the admin sidebar.
//
// Registered in payload.config.ts under `admin.components.graphics.Icon`.
// Payload resolves that string through app/(payload)/admin/importMap.js, which
// is generated — after changing the path, re-run `pnpm payload generate:importmap`
// or the admin will keep rendering the old component.
//
// The lockup is 1024×512 with transparency; height is pinned in custom.scss
// (.mstack-brand) and the width follows, so the aspect ratio is never squashed
// by the sidebar's own layout.
export function BrandIcon() {
  return (
    <span className="mstack-brand mstack-brand--icon">
      <Image
        src="/Mstacklogo.webp"
        alt="MStack360"
        width={1024}
        height={512}
        priority
        // The admin is behind auth and never indexed, so there's no benefit to
        // running this through the image optimiser on every admin page load.
        unoptimized
      />
    </span>
  )
}

export default BrandIcon
