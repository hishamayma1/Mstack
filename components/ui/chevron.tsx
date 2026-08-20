// A right-pointing chevron at text size. Used on every row link and inline
// "next step" link, so "this goes somewhere" is one consistent signal across
// the page.
//
// Its own file rather than living in section.tsx: the client components that
// need it would otherwise pull RevealText and the whole section module into
// the client bundle along with it.
export function Chevron({ className = "" }: { className?: string }) {
  return (
    <svg aria-hidden="true" width="14" height="14" viewBox="0 0 14 14" fill="none" className={className}>
      <path
        d="M5 2.5L9.5 7 5 11.5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}
