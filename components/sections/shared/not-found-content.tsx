import { ErrorStateSection, type ErrorLink } from "@/components/sections/shared/error-state-section"
import { CTAButtons } from "@/components/ui/section-cta"

// The body of the 404 page, shared by the two files that need it:
//
//   app/(frontend)/not-found.tsx  — a notFound() call inside a frontend route
//                                   (an unknown /industries/[slug], say)
//   app/global-not-found.tsx      — a URL that matches no route at all
//
// Both exist because this app has two root layouts, (frontend) and (payload).
// With more than one root layout there is no single layout for Next to compose
// a root not-found from, so unmatched URLs fall through to the framework
// default unless global-not-found handles them. Keeping the content here means
// the two entry points can never drift apart.

const SUGGESTIONS: ErrorLink[] = [
  {
    label: "Solutions",
    href: "/solutions",
    description: "The five Microsoft 365 service levels and our specialist add-ons.",
  },
  {
    label: "Industries",
    href: "/industries",
    description: "What we deploy for your sector, and why it needs it.",
  },
  {
    label: "Case Studies",
    href: "/case-studies",
    description: "Real deployments with the numbers the client measured.",
  },
  {
    label: "Resources",
    href: "/resources",
    description: "Guides, calculators, and answers to the common questions.",
  },
]

export function NotFoundContent() {
  return (
    <ErrorStateSection
      code="404"
      eyebrow="PAGE NOT FOUND"
      title={"That Page Isn't\nHere Anymore."}
      message="The link may be out of date, or the address might have a typo in it. Nothing is broken — this page just doesn't exist."
      actions={
        <CTAButtons
          primaryLabel="Back to Home"
          primaryHref="/"
          secondaryLabel="Contact Us"
          secondaryHref="/contact"
          align="center"
        />
      }
      links={SUGGESTIONS}
    />
  )
}
