"use client"

import { useCallback, useEffect, useState } from "react"

// The "turn on browser notifications" control on the dashboard.
//
// Must be a client component: Notification permission, service workers and
// PushManager are all browser-only, and the permission prompt has to be
// triggered by a real user gesture — a browser will silently reject a
// permission request that isn't tied to a click.
//
// It talks to Payload's REST API directly rather than through a custom
// endpoint. The admin session cookie is already on the request, and
// collections/PushSubscriptions.ts restricts writes to logged-in users, so
// there's nothing a bespoke route would add.

type Status = "loading" | "unsupported" | "denied" | "off" | "on" | "working"

/**
 * The VAPID public key travels to the push service as raw bytes, but is
 * transported to us as base64url. `atob` only speaks standard base64, so the
 * URL-safe characters have to be swapped back and the padding restored.
 */
function urlBase64ToUint8Array(base64String: string): Uint8Array {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4)
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/")
  const raw = window.atob(base64)
  return Uint8Array.from([...raw].map((char) => char.charCodeAt(0)))
}

/** "Chrome on Windows" — enough to recognise a device in the list and revoke it. */
function describeBrowser(): string {
  const ua = navigator.userAgent
  const browser = /Edg\//.test(ua)
    ? "Edge"
    : /OPR\//.test(ua)
      ? "Opera"
      : /Chrome\//.test(ua)
        ? "Chrome"
        : /Safari\//.test(ua)
          ? "Safari"
          : /Firefox\//.test(ua)
            ? "Firefox"
            : "Browser"
  const os = /Windows/.test(ua)
    ? "Windows"
    : /Android/.test(ua)
      ? "Android"
      : /iPhone|iPad/.test(ua)
        ? "iOS"
        : /Mac OS X/.test(ua)
          ? "macOS"
          : /Linux/.test(ua)
            ? "Linux"
            : "device"
  return `${browser} on ${os}`
}

export function PushToggle() {
  const [status, setStatus] = useState<Status>("loading")
  const [error, setError] = useState<string | null>(null)

  const publicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY

  useEffect(() => {
    // Push needs a secure context. Browsers treat localhost as secure, so dev
    // works over plain http, but a LAN address like 192.168.x.x does not.
    const supported =
      typeof window !== "undefined" &&
      "serviceWorker" in navigator &&
      "PushManager" in window &&
      "Notification" in window

    if (!supported || !publicKey) {
      setStatus("unsupported")
      return
    }
    if (Notification.permission === "denied") {
      setStatus("denied")
      return
    }

    navigator.serviceWorker
      .getRegistration("/sw.js")
      .then((registration) => registration?.pushManager.getSubscription() ?? null)
      .then((subscription) => setStatus(subscription ? "on" : "off"))
      .catch(() => setStatus("off"))
  }, [publicKey])

  const enable = useCallback(async () => {
    setError(null)
    setStatus("working")
    try {
      const permission = await Notification.requestPermission()
      if (permission !== "granted") {
        setStatus(permission === "denied" ? "denied" : "off")
        return
      }

      const registration = await navigator.serviceWorker.register("/sw.js")
      // A worker that's still installing has no usable pushManager yet.
      await navigator.serviceWorker.ready

      const subscription = await registration.pushManager.subscribe({
        // Required by every browser: push messages must always be shown to the
        // user, never used for silent background work.
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(publicKey!),
      })

      const json = subscription.toJSON()
      const response = await fetch("/api/push-subscriptions", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          endpoint: json.endpoint,
          p256dh: json.keys?.p256dh,
          auth: json.keys?.auth,
          label: describeBrowser(),
        }),
      })

      if (!response.ok) {
        // `endpoint` is unique, so re-enabling on a browser Payload already
        // knows about is a duplicate-key error, not a real failure — the
        // device is subscribed either way.
        if (response.status !== 400) throw new Error(`Server responded ${response.status}`)
      }

      setStatus("on")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not enable notifications.")
      setStatus("off")
    }
  }, [publicKey])

  const disable = useCallback(async () => {
    setError(null)
    setStatus("working")
    try {
      const registration = await navigator.serviceWorker.getRegistration("/sw.js")
      const subscription = await registration?.pushManager.getSubscription()

      if (subscription) {
        // Delete our row first: if unsubscribing succeeded but the delete
        // failed, the server would keep pushing to a dead endpoint until it
        // 410s. This order leaves the harmless failure mode instead.
        await fetch(
          `/api/push-subscriptions?where[endpoint][equals]=${encodeURIComponent(subscription.endpoint)}`,
          { method: "DELETE", credentials: "include" },
        ).catch(() => undefined)
        await subscription.unsubscribe()
      }
      setStatus("off")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not turn notifications off.")
      setStatus("on")
    }
  }, [])

  if (status === "loading") return null

  if (status === "unsupported") {
    return (
      <p className="mstack-push mstack-push--muted">
        This browser can&apos;t show push notifications. Email alerts still work.
      </p>
    )
  }

  if (status === "denied") {
    return (
      <p className="mstack-push mstack-push--muted">
        Notifications are blocked for this site. Allow them in your browser&apos;s site settings
        (the icon beside the address bar), then reload.
      </p>
    )
  }

  return (
    <div className="mstack-push">
      <span className={`mstack-push__dot mstack-push__dot--${status === "on" ? "on" : "off"}`} />
      <span className="mstack-push__label">
        {status === "on" ? "Browser alerts are on for this device" : "Browser alerts are off"}
      </span>
      <button
        type="button"
        className="mstack-action"
        onClick={status === "on" ? disable : enable}
        disabled={status === "working"}
      >
        {status === "working" ? "Working…" : status === "on" ? "Turn off" : "Turn on"}
      </button>
      {error ? <span className="mstack-push__error">{error}</span> : null}
    </div>
  )
}

export default PushToggle
