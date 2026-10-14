import type { CSSProperties } from "react"
import styles from "./intro-animation.module.css"

const LETTERS = ["M", "S", "T", "A", "C", "K", "3", "6", "0"]

// Plays the intro once per browser session. Runs synchronously while the HTML
// is parsed — before the overlay below exists and before first paint — so a
// repeat visit never flashes the curtain. `data-intro-seen` on <html> hides
// the overlay (see the CSS) and tells HeroBackdrop not to wait for a curtain.
// On the visit that does play it, the attribute is set once the intro is
// over, so client-side navigation back to "/" doesn't replay it either.
// sessionStorage throws in some privacy modes; then the intro just plays.
const ONCE_PER_SESSION = `try{var d=document.documentElement;if(sessionStorage.getItem("intro-seen"))d.setAttribute("data-intro-seen","");else{sessionStorage.setItem("intro-seen","1");setTimeout(function(){d.setAttribute("data-intro-seen","")},3600)}}catch(e){}`

// Decorative brand intro. Server component — the whole sequence is CSS
// keyframes (see intro-animation.module.css), so beyond the one-line session
// check it ships no JavaScript, dismisses itself regardless of hydration, and
// never hides the hero underneath from crawlers or from users whose JS fails
// to load.
export function IntroAnimation() {
  return (
    <>
      <script dangerouslySetInnerHTML={{ __html: ONCE_PER_SESSION }} />
      <div className={styles.overlay} aria-hidden="true">
        <div className={styles.curtain} />

        <div className={styles.letters}>
          <div className={styles.row}>
            {LETTERS.map((letter, i) => (
              <span
                key={`${letter}-${i}`}
                className={`${styles.letter} font-sans font-bold text-foreground`}
                style={{ "--i": i } as CSSProperties}
              >
                {letter}
              </span>
            ))}
          </div>
        </div>
      </div>
    </>
  )
}
