"use client"

import Image from "next/image"
import { useRef, type PointerEvent, type ReactNode } from "react"
import styles from "./tilted-card.module.css"

/*
 * Pointer-tilt card.
 *
 * Same effect and prop shape as React Bits' TiltedCard, implemented on CSS
 * custom properties instead of a motion library. Two reasons, both of which the
 * rest of components/ui already follows: it keeps a decorative desktop-only
 * hover out of the client bundle (no ~35 KB animation runtime for a tilt), and
 * it avoids a React render per pointermove — the handler writes CSS variables
 * straight onto the DOM node, so state never changes while the pointer moves.
 *
 * The card's rect is measured once on pointerenter and reused for the whole
 * gesture, so a fast pointermove doesn't force layout on every event. Nothing
 * is measured or listened to on touch devices: non-mouse pointers bail out on
 * the first event and the card just stays flat.
 *
 * `sizes` is required rather than defaulted, because getting it wrong is the
 * usual cause of oversized image downloads in a responsive grid.
 */
export function TiltedCard({
  src,
  alt,
  sizes,
  caption,
  overlay,
  priority = false,
  rotateAmplitude = 11,
  scaleOnHover = 1.04,
  className = "",
}: {
  src: string
  alt: string
  sizes: string
  caption?: string
  overlay?: ReactNode
  priority?: boolean
  rotateAmplitude?: number
  scaleOnHover?: number
  className?: string
}) {
  const rectRef = useRef<DOMRect | null>(null)

  const begin = (e: PointerEvent<HTMLElement>) => {
    if (e.pointerType !== "mouse") return
    const el = e.currentTarget
    rectRef.current = el.getBoundingClientRect()
    el.style.setProperty("--scale", String(scaleOnHover))
    el.dataset.tilting = "true"
  }

  const track = (e: PointerEvent<HTMLElement>) => {
    const rect = rectRef.current
    if (!rect || e.pointerType !== "mouse") return

    const el = e.currentTarget
    const px = e.clientX - rect.left
    const py = e.clientY - rect.top

    // -1..1 from the card's centre.
    const nx = (px - rect.width / 2) / (rect.width / 2)
    const ny = (py - rect.height / 2) / (rect.height / 2)

    // Vertical pointer movement tips the card away from the viewer, hence the
    // negated X rotation.
    el.style.setProperty("--rx", `${-ny * rotateAmplitude}deg`)
    el.style.setProperty("--ry", `${nx * rotateAmplitude}deg`)
    el.style.setProperty("--mx", `${px}px`)
    el.style.setProperty("--my", `${py}px`)
    // Caption trails the cursor, offset clear of it.
    el.style.setProperty("--cx", `${px + 14}px`)
    el.style.setProperty("--cy", `${py + 16}px`)
  }

  const end = (e: PointerEvent<HTMLElement>) => {
    const el = e.currentTarget
    rectRef.current = null
    delete el.dataset.tilting
    el.style.setProperty("--rx", "0deg")
    el.style.setProperty("--ry", "0deg")
    el.style.setProperty("--scale", "1")
  }

  return (
    <figure
      className={className ? `${styles.figure} ${className}` : styles.figure}
      onPointerEnter={begin}
      onPointerMove={track}
      onPointerLeave={end}
    >
      <div className={styles.inner}>
        <Image
          src={src}
          alt={alt}
          fill
          sizes={sizes}
          priority={priority}
          className={styles.image}
        />

        <span className={styles.sheen} aria-hidden="true" />

        {overlay && (
          <>
            <span className={styles.scrim} aria-hidden="true" />
            <div className={styles.overlay}>{overlay}</div>
          </>
        )}

        <span className={styles.border} aria-hidden="true" />
      </div>

      {caption && (
        <figcaption className={styles.caption} aria-hidden="true">
          {caption}
        </figcaption>
      )}
    </figure>
  )
}
