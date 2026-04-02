import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createServiceClient } from '@/lib/supabase/service'
import { getSessionAccess, getJoinWindowState } from '@/lib/session-auth'
import { createDailyMeetingToken } from '@/lib/daily'

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ bookingId: string }> }
): Promise<NextResponse> {
  const { bookingId } = await params

  // ── 1. Auth ───────────────────────────────────────────────────────────────
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Parse optional guestToken from the JSON body.
  let guestToken: string | null = null
  try {
    const body = await req.json() as { guestToken?: string }
    guestToken = body.guestToken ?? null
  } catch {
    // No body or non-JSON body — fine, guestToken stays null.
  }

  // ── 2–4. Booking fetch + access check ────────────────────────────────────
  const access = await getSessionAccess(bookingId, user, guestToken)
  if (!access) {
    return NextResponse.json({ error: 'Not found.' }, { status: 404 })
  }

  // ── 5. Room must be provisioned ───────────────────────────────────────────
  // Deliberately opaque 404 — no information leakage.
  if (!access.booking.daily_room_name) {
    return NextResponse.json({ error: 'Not found.' }, { status: 404 })
  }

  // ── 6. Time-gate: enforce join window ────────────────────────────────────
  const { data: coachProfile } = await createServiceClient()
    .from('profiles')
    .select('timezone')
    .eq('id', access.booking.coach_id)
    .single()

  const coachTimezone = coachProfile?.timezone ?? 'UTC'
  const { state: windowState, minutesUntilOpen } = getJoinWindowState(
    access.booking.booking_date,
    access.booking.start_time,
    access.booking.end_time,
    coachTimezone,
  )

  if (windowState === 'too_early') {
    const mins = minutesUntilOpen ?? 0
    return NextResponse.json(
      { error: `The session hasn't started yet. You can join in ${mins} minute${mins === 1 ? '' : 's'}.` },
      { status: 423 }
    )
  }
  if (windowState === 'ended') {
    return NextResponse.json(
      { error: 'This session has already ended.' },
      { status: 423 }
    )
  }

  // ── 7. Build exit redirect URL ────────────────────────────────────────────
  const origin = req.nextUrl.origin
  const exitBase = `${origin}/session/${bookingId}?ended=1`
  const redirectOnMeetingExit = access.isCoach
    ? exitBase
    : guestToken
      ? `${exitBase}&guestToken=${encodeURIComponent(guestToken)}`
      : exitBase

  // ── 8. Issue token ────────────────────────────────────────────────────────
  let token: string
  try {
    token = await createDailyMeetingToken(
      access.booking.daily_room_name,
      access.isCoach,
      redirectOnMeetingExit,
    )
  } catch (e) {
    console.error('Failed to create Daily meeting token for booking', bookingId, e)
    return NextResponse.json({ error: 'Could not create session token.' }, { status: 500 })
  }

  return NextResponse.json({ token, roomUrl: access.booking.daily_room_url })
}
