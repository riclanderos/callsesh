// Server-only — DAILY_API_KEY is never exposed to the client.
// Do not import this module from any client component.

import { createServiceClient } from '@/lib/supabase/service'

const DAILY_API = 'https://api.daily.co/v1'

export interface DailyRoom {
  name: string
  url: string
}

/**
 * Creates a Daily video room for a booking.
 *
 * Room name is derived from the booking UUID so it is deterministic,
 * unpredictable, and safe to store. Daily room names must match
 * /^[a-zA-Z0-9-]+$/ and the resulting string is well within that.
 *
 * Throws on API errors so callers can catch and log explicitly.
 */
export async function createDailyRoom(bookingId: string): Promise<DailyRoom> {
  const apiKey = process.env.DAILY_API_KEY
  if (!apiKey) throw new Error('DAILY_API_KEY is not set')

  const res = await fetch(`${DAILY_API}/rooms`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      name: `booking-${bookingId}`,
      // privacy: 'private' once meeting token logic is added.
      // For now, 'public' lets both parties join without tokens.
      privacy: 'public',
    }),
  })

  if (!res.ok) {
    const text = await res.text()
    throw new Error(`Daily API error ${res.status}: ${text}`)
  }

  const data = (await res.json()) as { name: string; url: string }
  return { name: data.name, url: data.url }
}

/**
 * Creates a short-lived Daily meeting token scoped to a single room.
 *
 * - Expiry: 2 hours from issuance — long enough for a full session.
 * - isOwner: true for the coach (can mute others, end meeting, etc.).
 * - Token must be passed as ?t=<token> when navigating to the room URL.
 *
 * Throws on API errors so the caller (the token route) can return an
 * appropriate HTTP error without silently issuing a bad token.
 */
export async function createDailyMeetingToken(
  roomName: string,
  isOwner: boolean,
  redirectOnMeetingExit?: string
): Promise<string> {
  const apiKey = process.env.DAILY_API_KEY
  if (!apiKey) throw new Error('DAILY_API_KEY is not set')

  const exp = Math.floor(Date.now() / 1000) + 15 * 60 // 15 minutes

  const res = await fetch(`${DAILY_API}/meeting-tokens`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      properties: {
        room_name: roomName,
        exp,
        is_owner: isOwner,
        ...(redirectOnMeetingExit ? { redirect_on_meeting_exit: redirectOnMeetingExit } : {}),
      },
    }),
  })

  if (!res.ok) {
    const text = await res.text()
    throw new Error(`Daily token creation failed ${res.status}: ${text}`)
  }

  const data = (await res.json()) as { token: string }
  return data.token
}

/**
 * Creates a Daily room for the given booking ID and persists the result
 * to the bookings table. Errors are logged but do not throw so the caller
 * (the Stripe webhook) can still return 200 — a missing room is non-fatal
 * and can be remediated on the next Stripe retry.
 */
export async function provisionDailyRoom(bookingId: string): Promise<void> {
  // Allow createDailyRoom errors to propagate — the webhook catches them and
  // returns 500, which causes Stripe to retry. On retry the 23505 path runs
  // and attempts room creation again without re-inserting the booking or
  // re-sending emails.
  const room = await createDailyRoom(bookingId)

  const { error } = await createServiceClient()
    .from('bookings')
    .update({ daily_room_name: room.name, daily_room_url: room.url })
    .eq('id', bookingId)

  if (error) {
    // Also throw here so Stripe retries if the DB write fails.
    throw new Error(`Failed to store Daily room on booking ${bookingId}: ${error.message}`)
  }
}
