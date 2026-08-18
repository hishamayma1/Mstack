import { Fragment, type CSSProperties } from "react"
import styles from "./reveal.module.css"

type Piece =
  | { kind: "break" }
  | { kind: "word"; word: string; space: boolean; index: number }

// Splits text into words and reveals each with a staggered opacity + blur +
// translate, matching the intro animation's character.
//
// Server component: the stagger is expressed as a per-word scroll range on a
// native scroll-driven animation, so there is no IntersectionObserver and no
// hydration. Browsers without `animation-timeline` render the finished text.
//
// The separating space is rendered *outside* the span on purpose. Each word
// is an inline-block, and a trailing space inside an inline-block sits at the
// end of that box's only line, where CSS white-space processing drops it —
// which runs every word together.
export function RevealText({
  children,
  className = "",
  as: Tag = "h2",
  stagger = 3,   // % of the entry range between each word
  delay = 0,     // % offset before the first word
}: {
  children: string
  className?: string
  as?: "h1" | "h2" | "h3" | "p" | "span"
  stagger?: number
  delay?: number
}) {
  // Split on spaces but preserve explicit line breaks (rendered as <br />)
  const pieces: Piece[] = []
  let wordIndex = 0

  children.split(/(\n)/g).forEach((part) => {
    if (part === "\n") {
      pieces.push({ kind: "break" })
      return
    }
    const words = part.split(" ").filter(Boolean)
    words.forEach((word, i) => {
      pieces.push({ kind: "word", word, space: i < words.length - 1, index: wordIndex++ })
    })
  })

  return (
    <Tag className={className} style={{ display: "block" }}>
      {pieces.map((piece, i) => {
        if (piece.kind === "break") return <br key={`br-${i}`} />

        // Capped so a long heading's last word still lands inside the range.
        const start = Math.min(delay + piece.index * stagger, 30)

        return (
          <Fragment key={i}>
            <span
              className={styles.revealWord}
              style={
                {
                  "--reveal-start": `${start}%`,
                  "--reveal-end": `${start + 40}%`,
                } as CSSProperties
              }
            >
              {piece.word}
            </span>
            {piece.space ? " " : null}
          </Fragment>
        )
      })}
    </Tag>
  )
}
