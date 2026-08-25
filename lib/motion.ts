import type { CSSProperties } from "react"

// Stagger, expressed as scroll range rather than time.
//
// A scroll-driven animation has no clock to delay against — it is positioned
// on the element's journey through the viewport. So "the fourth card arrives
// after the third" becomes "the fourth card's animation starts 18% further
// into its entry range", which reads identically on screen and costs nothing
// in JavaScript.
//
// `step` is the gap between siblings in percentage points; `cap` stops a long
// list's last item from starting so late it never finishes on screen.
export function stagger(index: number, step = 6, cap = 30): CSSProperties {
  const start = Math.min(index * step, cap)
  return {
    "--m-start": `${start}%`,
    "--m-end": `${start + 46}%`,
  } as CSSProperties
}

// Same idea, but for animations that should finish later than an entrance —
// line draws and counters, which want to still be running while the reader is
// looking at them rather than being over before the element is fully on screen.
export function drawRange(index = 0, step = 8, cap = 40): CSSProperties {
  const start = Math.min(index * step, cap)
  return {
    "--m-start": `${start}%`,
    "--m-end": `${start + 55}%`,
  } as CSSProperties
}

// Parallax depth, in pixels of drift across the element's whole passage
// through the viewport. Positive values start the element low and end it
// high, which is the direction that reads as "further away".
//
// Keep these small. Above ~50px the row stops feeling like depth and starts
// feeling like the layout is broken, and on a short viewport the difference
// between the shallowest and deepest step is what the eye actually reads —
// not the absolute distance.
export function parallax(depth: number): CSSProperties {
  return { "--m-par": `${depth}px` } as CSSProperties
}
