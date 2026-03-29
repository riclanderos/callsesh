import Link from 'next/link'
import { createServiceClient } from '@/lib/supabase/service'
import { tzAbbr, convertTime } from '@/lib/booking'
import { TrackOnMount } from '@/lib/analytics'

function formatDate(d: string): string {
  const [year, month, day] = d.split('-').map(Number)
  return new Date(year, month - 1, day).toLocaleDateString('en-US', {
    weekday: 'long', month: 'long', day: 'numeric', year: 'numeric',
  })
}

function formatTime(t: string): string {
  const [h, m] = t.split(':').map(Number)
  const period = h >= 12 ? 'PM' : 'AM'
  const hour = h % 12 || 12
  return `${hour}:${String(m).padStart(2, '0')} ${period}`
}

export default async function BookingSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ session_id?: string; slug?: string; ctz?: string }>
}) {
  const { session_id, slug, ctz } = await searchParams

  const svc = createServiceClient()

  type BookingRow = {
    id: string
    booking_date: string
    start_time: string
    end_time: string
    coach_id: string
    session_types: { title: string } | { title: string }[] | null
  }

  let confirmed = false
  let booking: BookingRow | null = null

  if (session_id) {
    const { data } = await svc
      .from('bookings')
      .select('id, booking_date, start_time, end_time, coach_id, session_types(title)')
      .eq('stripe_checkout_session_id', session_id)
      .eq('status', 'confirmed')
      .maybeSingle()

    if (data) {
      confirmed = true
      booking = data as BookingRow
    }
  }

  // Fetch coach timezone for confirmed bookings.
  let coachTimezone = 'UTC'
  if (booking?.coach_id) {
    const { data: profile } = await svc
      .from('profiles')
      .select('timezone')
      .eq('id', booking.coach_id)
      .single()
    coachTimezone = profile?.timezone ?? 'UTC'
  }

  if (!confirmed) {
    return (
      <div className="flex min-h-screen items-center justify-center px-4">
        <div className="w-full max-w-md space-y-8 text-center">

          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border border-amber-900 bg-amber-950">
            <svg
              className="h-8 w-8 text-amber-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2.5}
              aria-hidden="true"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
            </svg>
          </div>

          <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-8 space-y-3">
            <h1 className="text-2xl font-semibold tracking-tight text-zinc-100">
              This time slot is no longer available
            </h1>
            <p className="text-sm text-zinc-400 leading-relaxed">
              Someone else booked this slot at the same time. Your booking was not completed.
            </p>
            <p className="text-sm text-zinc-500 leading-relaxed">
              If payment was collected, please contact{' '}
              <a
                href="mailto:support@landerossystems.com"
                className="text-indigo-400 hover:text-indigo-300 transition-colors"
              >
                support@landerossystems.com
              </a>{' '}
              and we&apos;ll arrange a full refund.
            </p>
          </div>

          {slug && (
            <Link
              href={`/book/${slug}`}
              className="inline-block rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-indigo-500 transition-colors"
            >
              Choose another time
            </Link>
          )}

          <Link
            href="/"
            className="inline-block text-sm text-zinc-500 hover:text-zinc-300 transition-colors"
          >
            ← Back to home
          </Link>

        </div>
      </div>
    )
  }

  // Derive session title from the join result.
  const st = booking?.session_types
  const sessionTitle = Array.isArray(st) ? (st[0]?.title ?? '') : (st?.title ?? '')

  // Compute timezone-aware display values.
  const coachAbbr = tzAbbr(coachTimezone)
  const guestTimezone = ctz && ctz !== coachTimezone ? ctz : null
  const guestAbbr = guestTimezone ? tzAbbr(guestTimezone) : null
  const guestStart = guestTimezone && booking
    ? convertTime(booking.booking_date, booking.start_time, coachTimezone, guestTimezone)
    : null
  const guestEnd = guestTimezone && booking
    ? convertTime(booking.booking_date, booking.end_time, coachTimezone, guestTimezone)
    : null

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-md space-y-8 text-center">

        <TrackOnMount event="booking_completed" properties={{ session_id }} />
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border border-green-900 bg-green-950">
          <svg
            className="h-8 w-8 text-green-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2.5}
            aria-hidden="true"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>

        <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-8 space-y-4 text-left">
          <div className="text-center space-y-1">
            <h1 className="text-2xl font-semibold tracking-tight text-zinc-100">You&apos;re booked!</h1>
            <p className="text-sm text-zinc-400">
              Payment confirmed. Check your email for session details and a secure join link.
            </p>
          </div>

          {booking && (
            <div className="border-t border-zinc-800 pt-4 space-y-3">
              {sessionTitle && (
                <div className="flex justify-between items-baseline gap-2">
                  <span className="text-xs text-zinc-500 uppercase tracking-wider">Session</span>
                  <span className="text-sm text-zinc-200 text-right">{sessionTitle}</span>
                </div>
              )}
              <div className="flex justify-between items-baseline gap-2">
                <span className="text-xs text-zinc-500 uppercase tracking-wider">Date</span>
                <span className="text-sm text-zinc-200 text-right">{formatDate(booking.booking_date)}</span>
              </div>
              <div className="flex justify-between items-start gap-2">
                <span className="text-xs text-zinc-500 uppercase tracking-wider mt-0.5">Time</span>
                <div className="text-right space-y-0.5">
                  <p className="text-sm text-zinc-200">
                    {formatTime(booking.start_time)} – {formatTime(booking.end_time)}{' '}
                    <span className="text-zinc-500 text-xs">{coachAbbr}</span>
                  </p>
                  {guestStart && guestEnd && guestAbbr && (
                    <p className="text-xs text-zinc-500">
                      {formatTime(guestStart)} – {formatTime(guestEnd)}{' '}
                      <span className="text-zinc-600">{guestAbbr} · your time</span>
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        {slug && (
          <Link
            href={`/book/${slug}`}
            className="inline-block rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-indigo-500 transition-colors"
          >
            Book another session
          </Link>
        )}

      </div>
    </div>
  )
}
