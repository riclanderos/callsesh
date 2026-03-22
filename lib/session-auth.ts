// Server-only — uses the service client directly.
// Do not import this module from any client component.

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
      'id, coach_id, guest_name, guest_email, booking_date, start_time, end_time, status, daily_room_name, daily_room_url, guest_access_token, session_types(title)'
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
