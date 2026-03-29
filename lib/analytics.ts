'use client'

import { useEffect, useRef } from 'react'
import posthog from 'posthog-js'

/** Fire a PostHog event. No-ops during SSR. */
export function track(event: string, properties?: Record<string, unknown>): void {
  if (typeof window === 'undefined') return
  posthog.capture(event, properties)
}

/**
 * Renders nothing; fires a single PostHog event on first client mount.
 * Safe to import and render from server components — capture runs client-side only.
 */
export function TrackOnMount({
  event,
  properties,
}: {
  event: string
  properties?: Record<string, unknown>
}) {
  const fired = useRef(false)
  useEffect(() => {
    if (fired.current) return
    fired.current = true
    track(event, properties)
  // event/properties are fixed per render; only fire once on mount.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  return null
}
