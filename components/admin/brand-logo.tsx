import Image from "next/image"

// Replaces the Payload logo on the admin login screen.
//
// Registered under `admin.components.graphics.Logo`. Larger than BrandIcon and
// paired with a caption, because the login page is otherwise a single input
// card floating in space — the caption is what tells someone which system
// they've landed on before they type a password into it.
export function BrandLogo() {
  return (
    <span className="mstack-brand mstack-brand--logo">
      <Image
        src="/Mstacklogo.webp"
        alt="MStack360"
        width={1024}
        height={512}
        priority
        unoptimized
      />
      <span className="mstack-brand__caption">Content &amp; Sales Dashboard</span>
    </span>
  )
}

export default BrandLogo
