// Server-only — uses the service client directly.
// Do not import this module from any client component.

/** Minutes before the scheduled start time when the join window opens. */
export const JOIN_EARLY_MINUTES = 10

export type JoinWindowState = 'too_early' | 'open' | 'ended'

/**
 * Converts a wall-clock "HH:MM" or "HH:MM:SS" time on a "YYYY-MM-DD" date
 * in the given IANA timezone to a UTC Date. Uses the same single-pass offset
 * correction as lib/booking.ts convertTime.
 */
function wallClockToUTC(date: string, time: string, timezone: string): Date {
  const [y, mo, d] = date.split('-').map(Number)
  const [h, m] = time.split(':').map(Number)
  let utcMs = Date.UTC(y, mo - 1, d, h, m)
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: timezone, hour: 'numeric', minute: '2-digit', hour12: false,
  }).formatToParts(new Date(utcMs))
  const sh = parseInt(parts.find((p) => p.type === 'hour')?.value ?? '0', 10) % 24
  const sm = parseInt(parts.find((p) => p.type === 'minute')?.value ?? '0', 10)
  utcMs -= (sh * 60 + sm - (h * 60 + m)) * 60_000
  return new Date(utcMs)
}

/**
 * Returns whether `now` falls within the session join window:
 *   [startTime − JOIN_EARLY_MINUTES, endTime)
 *
 * All times are interpreted as wall-clock values in the coach's timezone.
 * `minutesUntilOpen` is set when state is 'too_early'.
 */
export function getJoinWindowState(
  bookingDate: string,
  startTime: string,
  endTime: string,
  coachTimezone: string,
  now: Date = new Date()
): { state: JoinWindowState; minutesUntilOpen?: number } {
  const startUTC = wallClockToUTC(bookingDate, startTime, coachTimezone)
  const endUTC   = wallClockToUTC(bookingDate, endTime,   coachTimezone)
  const nowMs    = now.getTime()
  const openMs   = startUTC.getTime() - JOIN_EARLY_MINUTES * 60_000

  if (nowMs < openMs) {
    return { state: 'too_early', minutesUntilOpen: Math.ceil((openMs - nowMs) / 60_000) }
  }
  if (nowMs >= endUTC.getTime()) {
    return { state: 'ended' }
  }
  return { state: 'open' }
}

import { timingSafeEqual } from 'crypto'
import { createServiceClient } from '@/lib/supabase/service'
import type { User } from '@supabase/supabase-js'

export type SessionBooking = {
  id: string
  coach_id: string
  guest_name: string
  guest_email: string
  booking_date: string
  start_time: string
  end_time: string
  status: string
  daily_room_name: string | null
  daily_room_url: string | null
  session_types: { title: string } | { title: string }[] | null
  transcript_enabled: boolean
  transcript_consent_status: string
  session_status: string
  session_completed_at: string | null
}

export type SessionAccess = {
  booking: SessionBooking
  isCoach: boolean
  isGuest: boolean
}

type BookingRow = SessionBooking & { guest_access_token: string | null }

/**
 * Validates that the caller is an authorized participant of the booking.
 *
 * Access rules:
 * - Coach:         user.id === booking.coach_id  (requires authenticated user)
 * - Authenticated guest: user.email === booking.guest_email
 * - Unauthenticated guest: guestToken matches booking.guest_access_token
 *                          (constant-time comparison via timingSafeEqual)
 *
 * Returns { booking, isCoach, isGuest } on success, stripping guest_access_token
 * from the returned booking so it is never exposed to callers.
 *
 * Returns null if the booking does not exist, is not confirmed, or the caller
 * is not a participant. Callers decide how to handle null.
 */
export async function getSessionAccess(
  bookingId: string,
  user: User | null,
  guestToken?: string | null
): Promise<SessionAccess | null> {
  const { data } = await createServiceClient()
    .from('bookings')
    .select(
      'id, coach_id, guest_name, guest_email, booking_date, start_time, end_time, status, daily_room_name, daily_room_url, guest_access_token, transcript_enabled, transcript_consent_status, session_status, session_completed_at, session_types(title)'
    )
    .eq('id', bookingId)
    .single()

  const row = data as BookingRow | null

  if (!row || row.status !== 'confirmed') return null

  const isCoach = !!user && user.id === row.coach_id
  const isGuest = !!user && user.email === row.guest_email

  // Unauthenticated guest path: constant-time token comparison.
  let isGuestToken = false
  if (!isCoach && !isGuest && guestToken && row.guest_access_token) {
    try {
      const provided = Buffer.from(guestToken, 'hex')
      const stored   = Buffer.from(row.guest_access_token, 'hex')
      if (provided.length === stored.length) {
        isGuestToken = timingSafeEqual(provided, stored)
      }
    } catch {
      // Malformed hex — treat as mismatch.
    }
  }

  if (!isCoach && !isGuest && !isGuestToken) return null

  // Strip the token before returning — callers must never see it.
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { guest_access_token: _tok, ...booking } = row

  return {
    booking: booking as SessionBooking,
    isCoach,
    isGuest: isGuest || isGuestToken,
  }
}
