/* MStack360 push service worker.
 *
 * Deliberately minimal: it handles push delivery and notification clicks, and
 * nothing else. In particular it registers NO `fetch` handler, so it never
 * intercepts, caches or proxies a single request on the marketing site — a
 * service worker that caches would be a real hazard here, because the site is
 * statically prerendered and stale cached HTML is very hard to debug.
 *
 * It lives at the origin root so its scope covers /admin. Registration happens
 * only from the admin push toggle, so visitors to the public site never
 * install it.
 */

self.addEventListener("push", (event) => {
  if (!event.data) return

  let payload
  try {
    payload = event.data.json()
  } catch {
    // A push with a non-JSON body isn't ours; show something rather than
    // throwing, which would leave the user with the browser's generic
    // "This site has been updated in the background" notice.
    payload = { title: "MStack360", body: event.data.text() }
  }

  const title = payload.title || "New service request"

  event.waitUntil(
    self.registration.showNotification(title, {
      body: payload.body || "",
      icon: "/Mstacklogo.webp",
      badge: "/icon-light-32x32.png",
      // Repeat alerts for the same request replace each other instead of
      // stacking up on the lock screen.
      tag: payload.tag || "mstack-notification",
      // Quote requests are worth an explicit dismiss — without this the
      // notification auto-hides after a few seconds on desktop and is easy
      // to miss entirely.
      requireInteraction: true,
      data: { url: payload.url || "/admin" },
    }),
  )
})

self.addEventListener("notificationclick", (event) => {
  event.notification.close()

  const targetURL = new URL(event.notification.data?.url || "/admin", self.location.origin).href

  // Prefer focusing a tab that's already open on this origin and navigating it,
  // rather than opening a duplicate admin tab on every notification.
  event.waitUntil(
    self.clients.matchAll({ type: "window", includeUncontrolled: true }).then((clientList) => {
      for (const client of clientList) {
        if (new URL(client.url).origin === self.location.origin && "focus" in client) {
          return client.focus().then((focused) => {
            if ("navigate" in focused) return focused.navigate(targetURL)
            return focused
          })
        }
      }
      return self.clients.openWindow(targetURL)
    }),
  )
})

// A newly installed worker normally waits for every old tab to close. These
// two lines let an updated worker take over straight away, so a fix to this
// file doesn't sit dormant until the browser is fully restarted.
self.addEventListener("install", () => self.skipWaiting())
self.addEventListener("activate", (event) => event.waitUntil(self.clients.claim()))
