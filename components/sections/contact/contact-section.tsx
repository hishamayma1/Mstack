import { BentoCard } from "@/components/ui/bento-card"
import { CONTACT_METHODS } from "@/lib/content/site"
import styles from "./contact-section.module.css"

const BOOKING_URL = "https://outlook.office.com/book/testbookms@mstack360.com"

export function ContactSection() {
  return (
    <section className="py-24 px-6 md:px-12 lg:px-20 border-t border-white/[0.08]">
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-[1fr_1.4fr] gap-3 items-start">
        <div className="flex flex-col gap-3">
          {CONTACT_METHODS.map((m) => (
            <BentoCard key={m.label} className="p-6">
              <span className="text-xs uppercase tracking-widest text-white/40 block mb-2">{m.label}</span>
              <span className="text-base font-light text-[#F3F5FA]">{m.value}</span>
            </BentoCard>
          ))}
        </div>

        <BentoCard className="p-8">
          <h2 className="text-2xl font-light mb-1">Book a Time With Us</h2>
          <p className="text-sm text-white/55 leading-relaxed mb-6">
            Pick a slot that works for you — no phone tag, no back-and-forth emails.
          </p>
          <div className={styles.bookingFrame}>
            <iframe
              src={BOOKING_URL}
              title="Book a meeting with MStack"
              className={styles.bookingIframe}
              scrolling="yes"
            />
           


          </div>
        </BentoCard>
      </div>
    </section>
  )
}
