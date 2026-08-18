import { SectionHeader } from "@/components/ui/section-header"
import { SectionCTA } from "@/components/ui/section-cta"
import { MediaFrame } from "@/components/ui/media-frame"
import type { CaseStudyDetail } from "@/lib/cms/case-studies"

// Proof images. Unlike the hero and approach slots, this one renders nothing
// when empty rather than showing placeholders — a gallery is either evidence
// or it shouldn't be on the page.
export function CaseStudyGallery({ study }: { study: CaseStudyDetail }) {
  if (study.gallery.length === 0) return null

  const single = study.gallery.length === 1

  return (
    <section id="gallery" className="py-24 px-6 md:px-12 lg:px-20 border-t border-white/[0.08]">
      <div className="max-w-6xl mx-auto">
        <SectionHeader eyebrow="THE RESULTS" title={"What It Looks\nLike Now."} />

        <div className={`grid grid-cols-1 gap-3 ${single ? "" : "md:grid-cols-2"}`}>
          {study.gallery.map((item, i) => (
            <figure key={item.image.url}>
              <MediaFrame
                src={item.image.url}
                alt={item.image.alt}
                label={item.caption || "Result"}
                aspect={single ? "16/9" : "4/3"}
                sizes={single ? "100vw" : "(max-width: 768px) 100vw, 50vw"}
                priority={i === 0}
              />
              {item.caption ? (
                <figcaption className="mt-3 text-xs text-white/40 leading-relaxed">
                  {item.caption}
                </figcaption>
              ) : null}
            </figure>
          ))}
        </div>

        <SectionCTA
          text="We'd build the same kind of visibility into your environment — and show you what it would look like first."
          primaryLabel="Book a Free Consultation"
        />
      </div>
    </section>
  )
}
