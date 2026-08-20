// ─────────────────────────────────────────────────────────────────────────────
// STATUS: nothing on the homepage reads this file at the moment.
//
// Every slot below is still `src: null`, and the redesign dropped the dashed
// <MediaFrame> placeholders from the homepage — a live page announcing IMAGE /
// "photo goes here" in four places was advertising what was missing rather than
// showing what is there.
//
// The briefs are kept because they are the art direction, not dead code. When
// the photography exists: set that slot's `src` and `alt`, then render a
// <MediaFrame> for it in the matching section — challenges-section.tsx,
// process-section.tsx, lead-magnet-section.tsx and differentiators-section.tsx
// respectively. The layouts all have a column free for one.
// ─────────────────────────────────────────────────────────────────────────────

// ─────────────────────────────────────────────────────────────────────────────
// IMAGE SLOTS FOR THE HOMEPAGE — the only file you edit to replace the
// placeholders with real artwork. Same contract as lib/content/industry-media.ts.
//
// HOW TO REPLACE AN IMAGE
//   1. Drop the file in  public/images/home/
//   2. Change that slot's `src` from  null  to  "/images/home/your-file.webp"
//   3. Write a real `alt` — it is the accessible description, keep it specific.
//
// While `src` is null, <MediaFrame> renders a labelled dashed frame at the right
// aspect ratio, so the layout is finished before the photography is.
// ─────────────────────────────────────────────────────────────────────────────

import type { MediaSlot } from "@/lib/content/industry-media"

export type { MediaSlot }

// Beside the pain points — the "before" state, so the problems have a face.
export const PROBLEM_MEDIA: MediaSlot = {
  src: null,
  alt: "",
  label: "The messy 'before': scattered files, unmanaged devices, an unread alert",
  hint: "1000×1000 · photo or annotated screenshot · square crop",
}

// The process rail — one image carrying all five steps, so the section reads as
// a single journey rather than five separate cards.
export const PROCESS_MEDIA: MediaSlot = {
  src: null,
  alt: "",
  label: "Us working through a tenant review with a client on Teams",
  hint: "1200×750 · photo · people, not screenshots",
}

// The health check offer — showing the deliverable makes the ask concrete.
export const HEALTH_CHECK_MEDIA: MediaSlot = {
  src: null,
  alt: "",
  label: "Page one of a real health check report, with findings visible",
  hint: "900×1100 · annotated screenshot · portrait crop",
}

// Why us — the team behind the promise.
export const TEAM_MEDIA: MediaSlot = {
  src: null,
  alt: "",
  label: "The MStack360 team, or a consultant mid-engagement",
  hint: "1200×675 · photo · candid, not stock",
}
