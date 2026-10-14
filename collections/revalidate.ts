import { revalidateTag } from "next/cache"

// Every reader in lib/cms/*.ts is wrapped in "use cache" with cacheLife("hours")
// and a cacheTag named after its collection. Without a hook marking that tag
// stale on save, an edit in /admin wouldn't reach the site until the cache
// window ran out. `profile: "max"` is stale-while-revalidate, so the visitor
// who triggers the refresh still gets an instant response.
//
// Wrapped because these hooks also run from the onInit seed and CLI scripts,
// outside any request, where there is no cache to revalidate.
export function revalidateCacheTag(tag: string) {
  return () => {
    try {
      revalidateTag(tag, "max")
    } catch {
      // Not in a request context (seed / CLI) — nothing cached to invalidate.
    }
  }
}

// Spread into a collection's `hooks` to revalidate on create, update and delete.
export function revalidateOnChange(tag: string) {
  const hook = revalidateCacheTag(tag)
  return { afterChange: [hook], afterDelete: [hook] }
}
