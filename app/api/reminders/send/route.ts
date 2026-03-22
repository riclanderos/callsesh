import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/service'
import { sendGuestReminder } from '@/lib/email'

// ── Reminder windows ──────────────────────────────────────────────────────────
// Wide windows absorb cron jitter and DST edge cases.
const WINDOW_24H_MIN_MIN = 23 * 60   // 1380 minutes
const WINDOW_24H_MAX_MIN = 25 * 60   // 1500 minutes
const WINDOW_1H_MIN_MIN  = 50        // minutes
const WINDOW_1H_MAX_MIN  = 70        // minutes

/**
 * Converts a wall-clock booking time (YYYY-MM-DD + HH:MM[:SS] in a given
 * IANA timezone) to an absolute UTC Date.
 *
 * Strategy: treat the local time as UTC to get an initial guess, then measure
 * the UTC offset the target timezone has at that instant and correct for it.
 * One iteration is sufficient because the offset is stable across the small
 * correction we apply.
 */
function sessionStartUtc(bookingDate: string, startTime: string, timezone: string): Date {
  const hhmm = startTime.slice(0, 5) // normalise HH:MM:SS → HH:MM
  const guess = new Date(`${bookingDate}T${hhmm}:00Z`)

  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: timezone,
    year: 'numeric', month: '2-digit', day: '2-digit',
    hour: '2-digit', minute: '2-digit', second: '2-digit',
    hour12: false,
  }).formatToParts(guess)

  const p = Object.fromEntries(parts.map(({ type, value }) => [type, value]))
  // hour can be "24" at midnight in some locales
  const hour = p.hour === '24' ? '00' : p.hour
  const localAsUtc = new Date(`${p.year}-${p.month}-${p.day}T${hour}:${p.minute}:${p.second}Z`)

  const offsetMs = guess.getTime() - localAsUtc.getTime()
  return new Date(guess.getTime() - offsetMs)
}

export async function GET(req: NextRequest): Promise<NextResponse> {
  // ── Auth ────────────────────────────────────────────────────────────────────
  // If CRON_SECRET is set, require it as a Bearer token.
  // In local dev without the var, the route is open for easy manual testing.
  const cronSecret = process.env.CRON_SECRET
  if (cronSecret) {
    const auth = req.headers.get('authorization') ?? ''
    if (auth !== `Bearer ${cronSecret}`) {
      return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 })
    }
  }

  const serviceClient = createServiceClient()
  const nowUtc = new Date()
  const appUrl = process.env.APP_URL ?? ''

  // ── Fetch candidates ────────────────────────────────────────────────────────
  // Look back 2 days so bookings never permanently fall through if the cron
  // misses a run. The JS window check below filters out stale rows.
  const lookbackDate = new Date(nowUtc.getTime() - 2 * 24 * 60 * 60 * 1000)
  const lookbackStr  = lookbackDate.toISOString().split('T')[0]

  type ReminderBooking = {
    id: string
    coach_id: string
    guest_name: string
    guest_email: string
    booking_date: string
    start_time: string
    end_time: string
    guest_access_token: string | null
    reminder_24h_sent: boolean
    reminder_1h_sent: boolean
    session_types: { title: string } | { title: string }[] | null
  }

  const { data: rawBookings, error: fetchError } = await serviceClient
    .from('bookings')
    .select('id, coach_id, guest_name, guest_email, booking_date, start_time, end_time, guest_access_token, reminder_24h_sent, reminder_1h_sent, session_types(title)')
    .eq('status', 'confirmed')
    .gte('booking_date', lookbackStr)
    .or('reminder_24h_sent.eq.false,reminder_1h_sent.eq.false')

  const bookings = rawBookings as ReminderBooking[] | null

  if (fetchError) {
    console.error('[reminders] failed to fetch bookings:', fetchError)
    return NextResponse.json({ error: 'Failed to fetch bookings.' }, { status: 500 })
  }

  if (!bookings || bookings.length === 0) {
    return NextResponse.json({ ok: true, sent24h: 0, sent1h: 0, errors: 0 })
  }

  // ── Batch-fetch coach timezones ─────────────────────────────────────────────
  // profiles has no FK from bookings so we cannot use an embedded select.
  const coachIds = [...new Set(bookings.map((b) => b.coach_id))]
  const { data: profiles } = await serviceClient
    .from('profiles')
    .select('id, timezone')
    .in('id', coachIds)

  const timezoneByCoach: Record<string, string> = Object.fromEntries(
    (profiles ?? []).map((p) => [p.id, p.timezone])
  )

  // ── Process each booking ────────────────────────────────────────────────────
  const results = { sent24h: 0, sent1h: 0, errors: 0 }

  for (const booking of bookings) {
    const timezone = timezoneByCoach[booking.coach_id] ?? 'UTC'

    // Resolve session title (Supabase may return object or array for joins).
    const st = booking.session_types as { title: string } | { title: string }[] | null
    const sessionTitle = Array.isArray(st) ? (st[0]?.title ?? 'Session') : (st?.title ?? 'Session')

    let startUtc: Date
    try {
      startUtc = sessionStartUtc(booking.booking_date, booking.start_time, timezone)
    } catch {
      console.error('[reminders] could not compute start UTC for booking', booking.id)
      results.errors++
      continue
    }

    const minutesUntil = (startUtc.getTime() - nowUtc.getTime()) / 60_000

    console.log(
      '[reminders] candidate', booking.id,
      '| minutesUntil:', Math.round(minutesUntil),
      '| 24h_sent:', booking.reminder_24h_sent,
      '| 1h_sent:', booking.reminder_1h_sent
    )

    const token = booking.guest_access_token ?? ''
    const guestSessionUrl = `${appUrl}/session/${booking.id}?guestToken=${token}`
    const guestCancelUrl  = `${appUrl}/cancel/${booking.id}?guestToken=${token}`

    const emailParams = {
      sessionTitle,
      bookingDate:    booking.booking_date,
      startTime:      booking.start_time,
      endTime:        booking.end_time,
      guestName:      booking.guest_name,
      guestEmail:     booking.guest_email,
      coachEmail:     '',      // not used in reminder template
      coachTimezone:  timezone,
      guestSessionUrl,
      guestCancelUrl,
    }

    // ── 24h reminder ──────────────────────────────────────────────────────────
    if (
      !booking.reminder_24h_sent &&
      minutesUntil >= WINDOW_24H_MIN_MIN &&
      minutesUntil <= WINDOW_24H_MAX_MIN
    ) {
      try {
        await sendGuestReminder(emailParams, '24h')
        await serviceClient
          .from('bookings')
          .update({ reminder_24h_sent: true })
          .eq('id', booking.id)
        console.log('[reminders] sent 24h reminder for booking', booking.id)
        results.sent24h++
      } catch (e) {
        console.error('[reminders] 24h send failed for booking', booking.id, e)
        results.errors++
      }
    }

    // ── 1h reminder ───────────────────────────────────────────────────────────
    if (
      !booking.reminder_1h_sent &&
      minutesUntil >= WINDOW_1H_MIN_MIN &&
      minutesUntil <= WINDOW_1H_MAX_MIN
    ) {
      try {
        await sendGuestReminder(emailParams, '1h')
        await serviceClient
          .from('bookings')
          .update({ reminder_1h_sent: true })
          .eq('id', booking.id)
        console.log('[reminders] sent 1h reminder for booking', booking.id)
        results.sent1h++
      } catch (e) {
        console.error('[reminders] 1h send failed for booking', booking.id, e)
        results.errors++
      }
    }
  }

  return NextResponse.json({ ok: true, ...results })
}
