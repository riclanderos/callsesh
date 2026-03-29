'use client'

import { useEffect } from 'react'
import { updateTimezone } from '@/app/actions/profile'

/**
 * Silently auto-saves the browser's detected IANA timezone to the coach's
 * profile the first time they use the dashboard, before they've manually
 * configured one. Only fires when the current stored value is the UTC default.
 */
export default function TimezoneAutoDetect({
  currentTimezone,
}: {
  currentTimezone: string
}) {
  useEffect(() => {
    // Respect any timezone the coach has already set explicitly.
    if (currentTimezone !== 'UTC') return
    const detected = Intl.DateTimeFormat().resolvedOptions().timeZone
    if (!detected || detected === 'UTC') return
    const fd = new FormData()
    fd.set('timezone', detected)
    // Fire-and-forget — failures are silent; the coach can always set it manually.
    updateTimezone(null, fd).catch(() => undefined)
  }, []) // eslint-disable-line react-hooks/exhaustive-deps
  return null
}
