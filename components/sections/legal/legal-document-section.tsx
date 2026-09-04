import { LEGAL_DOCS } from "@/lib/content/site"
import styles from "./legal-document-section.module.css"

// Server component — all three documents render up front (no client tabs)
// so each is directly linkable and indexable at /legal#privacy-policy etc.
export function LegalDocumentSection() {
  return (
    <section className="py-24 px-6 md:px-12 lg:px-20 border-t border-border">
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-[200px_1fr] gap-12">
        <nav className={styles.nav} aria-label="Legal documents">
          {LEGAL_DOCS.map((doc) => (
            <a key={doc.id} href={`#${doc.id}`} className={styles.navLink}>
              {doc.title.toUpperCase()}
            </a>
          ))}
        </nav>

        <div className="flex flex-col gap-20">
          {LEGAL_DOCS.map((doc) => (
            <article key={doc.id} id={doc.id} className={styles.article}>
              <h2 className="text-3xl md:text-4xl font-light tracking-tight mb-2">{doc.title}</h2>
              <p className="text-xs text-muted-foreground tracking-wide mb-8">Last updated: {doc.updated}</p>
              <div className="flex flex-col gap-6">
                {doc.sections.map((s) => (
                  <div key={s.heading}>
                    <h3 className="text-base font-light text-foreground mb-2">{s.heading}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{s.body}</p>
                  </div>
                ))}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
