"use client"

import { useState } from "react"

// YouTube id from watch, share (youtu.be), shorts and embed URLs.
export function youTubeId(url: string): string | null {
  try {
    const u = new URL(url)
    if (u.hostname.endsWith("youtu.be")) return u.pathname.slice(1) || null
    if (u.searchParams.get("v")) return u.searchParams.get("v")
    const m = u.pathname.match(/\/(?:shorts|embed|live)\/([\w-]{6,})/)
    return m ? m[1] : null
  } catch {
    return null
  }
}

// A click-to-play facade. A YouTube iframe costs ~1MB of script and a dozen
// requests on page load whether or not anyone presses play; this shows the
// thumbnail and loads the real player only on click. Uses the
// privacy-enhanced youtube-nocookie domain.
export function VideoBlock({ url, title, caption }: { url: string; title: string; caption?: string | null }) {
  const [playing, setPlaying] = useState(false)
  const id = youTubeId(url)
  if (!id) return null

  return (
    <figure>
      <div className="relative aspect-video rounded-2xl overflow-hidden border border-border bg-card">
        {playing ? (
          <iframe
            src={`https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0`}
            title={title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="absolute inset-0 w-full h-full"
          />
        ) : (
          <button type="button" onClick={() => setPlaying(true)} className="group absolute inset-0 w-full h-full" aria-label={`Play video: ${title}`}>
            {/* eslint-disable-next-line @next/next/no-img-element -- external thumbnail, sized by the frame */}
            <img
              src={`https://i.ytimg.com/vi/${id}/hqdefault.jpg`}
              alt=""
              loading="lazy"
              decoding="async"
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
            />
            <span className="absolute inset-0 bg-black/30 group-hover:bg-black/20 transition-colors" />
            <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 rounded-full bg-linear-to-br from-blue-600 to-cyan-600 text-white flex items-center justify-center shadow-lg transition-transform duration-300 group-hover:scale-110">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M8 5.5v13l11-6.5z" />
              </svg>
            </span>
          </button>
        )}
      </div>
      {caption ? <figcaption className="mt-3 text-xs text-muted-foreground text-center tracking-wide">{caption}</figcaption> : null}
    </figure>
  )
}
