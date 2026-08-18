import type { CSSProperties } from "react"
import styles from "./intro-animation.module.css"

const LETTERS = ["M", "S", "T", "A", "C", "K", "3", "6", "0"]

// Decorative brand intro. Server component — the whole sequence is CSS
// keyframes (see intro-animation.module.css), so it ships no JavaScript,
// dismisses itself regardless of hydration, and never hides the hero
// underneath from crawlers or from users whose JS fails to load.
export function IntroAnimation() {
  return (
    <div className={styles.overlay} aria-hidden="true">
      <div className={styles.curtain} />

      <div className={styles.letters}>
        <div className={styles.row}>
          {LETTERS.map((letter, i) => (
            <span
              key={`${letter}-${i}`}
              className={`${styles.letter} font-sans font-bold text-[#F3F5FA]`}
              style={{ "--i": i } as CSSProperties}
            >
              {letter}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}
