import Link from "next/link"
import { Tag } from "@/components/ui/tag"
import type { ServiceKind } from "@/lib/cms/services"
import { serviceTheme } from "@/lib/service-theme"

type ServiceLink = { id: string; title: string; slug: string; kind: ServiceKind }

// Chips to the other services, split by kind so the five-level ladder reads
// as a ladder rather than as nine equivalent options.
export function ServiceRelatedSection({ services }: { services: ServiceLink[] }) {
  if (services.length === 0) return null

  const levels = services.filter((service) => service.kind === "level")
  const addons = services.filter((service) => service.kind === "addon")

  return (
    <section className="py-24 px-6 md:px-12 lg:px-20 border-t border-border">
      <div className="max-w-6xl mx-auto">
        <Tag>KEEP LOOKING</Tag>
        <h2 className="mt-5 text-2xl font-light tracking-tight">Other services we run.</h2>

        {[
          { heading: "Service levels", items: levels },
          { heading: "Add-on services", items: addons },
        ]
          .filter((group) => group.items.length > 0)
          .map((group) => (
            <div key={group.heading} className="mt-8">
              <span className="text-[11px] uppercase tracking-widest text-muted-foreground">
                {group.heading}
              </span>
              <div className="mt-3 flex flex-wrap gap-2">
                {group.items.map((service) => (
                  <Link
                    key={service.id}
                    href={`/solutions/${service.slug}`}
                    data-svc={serviceTheme(service.slug)}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-border bg-card text-sm text-muted-foreground hover:text-foreground hover:border-svc/40 hover:bg-svc/10 transition-all"
                  >
                    {/* Each chip wears its own service's colour, so the
                        palette doubles as a map of the catalogue. */}
                    <span aria-hidden="true" className="h-2 w-2 rounded-full bg-linear-to-br from-svc to-svc-2" />
                    {service.title}
                  </Link>
                ))}
              </div>
            </div>
          ))}
      </div>
    </section>
  )
}
