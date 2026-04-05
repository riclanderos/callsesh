import { createClient } from '@/lib/supabase/server'
import { createServiceClient } from '@/lib/supabase/service'
import { getSessionAccess, getJoinWindowState } from '@/lib/session-auth'
import { redirect } from 'next/navigation'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import JoinButton from './join-button'
import { recordTranscriptConsent } from '@/app/actions/bookings'

function formatDate(d: string): string {
  const [year, month, day] = d.split('-').map(Number)
  return new Date(year, month - 1, day).toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

function formatTime(t: string): string {
  const [h, m] = t.split(':').map(Number)
  const period = h >= 12 ? 'PM' : 'AM'
  const hour = h % 12 || 12
  return `${hour}:${String(m).padStart(2, '0')} ${period}`
}

export default async function SessionPage({
  params,
  searchParams,
}: {
  params: Promise<{ bookingId: string }>
  searchParams: Promise<{ guestToken?: string; ended?: string }>
}) {
  const [{ bookingId }, { guestToken, ended }] = await Promise.all([params, searchParams])

  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const access = await getSessionAccess(bookingId, user, guestToken)

  if (!access) {
    if (!user && !guestToken) redirect('/login')
    notFound()
  }

  const { booking, isCoach } = access

  if (!booking.daily_room_name || !booking.daily_room_url) {
    return (
      <div className="flex min-h-screen items-center justify-center px-4">
        <div className="w-full max-w-sm rounded-xl border border-zinc-800 bg-zinc-900 p-8 text-center space-y-3">
          <div className="mx-auto h-10 w-10 rounded-full border border-zinc-700 bg-zinc-800 flex items-center justify-center">
            <svg className="h-5 w-5 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div className="space-y-1">
            <h1 className="font-semibold text-zinc-100">Room is being prepared</h1>
            <p className="text-sm text-zinc-500">
              Your session room is almost ready. Refresh the page in a moment.
            </p>
          </div>
        </div>
      </div>
    )
  }

  const { data: profile } = await createServiceClient()
    .from('profiles')
    .select('timezone')
    .eq('id', booking.coach_id)
    .single()

  const coachTimezone = profile?.timezone ?? 'UTC'

  const { state: windowState, minutesUntilOpen } = getJoinWindowState(
    booking.booking_date,
    booking.start_time,
    booking.end_time,
    coachTimezone,
  )

  // Mark session as completed on first join within the open window.
  // Fire-and-forget: a failed update must never block the participant from joining.
  if (windowState === 'open' && booking.session_status !== 'completed') {
    createServiceClient()
      .from('bookings')
      .update({
        session_status: 'completed',
        session_completed_at: new Date().toISOString(),
      })
      .eq('id', bookingId)
      .then(({ error }) => {
        if (error) console.error('[session] failed to mark session completed:', error.message)
      })
  }

  const st = booking.session_types as { title: string } | { title: string }[] | null
  const sessionTitle = Array.isArray(st) ? (st[0]?.title ?? 'Session') : (st?.title ?? 'Session')

  const backHref = isCoach ? '/dashboard/bookings' : '/'

  if (ended === '1') {
    return (
      <div className="flex min-h-screen items-center justify-center px-4">
        <div className="w-full max-w-sm rounded-xl border border-zinc-800 bg-zinc-900 p-8 space-y-6">
          <div className="space-y-1">
            <h1 className="text-xl font-semibold text-zinc-100">Session ended</h1>
            <p className="text-sm text-zinc-400">
              {isCoach
                ? 'Head back to your dashboard to see your upcoming bookings or review past sessions.'
                : 'Thanks for joining. The session has been completed.'}
            </p>
          </div>
          <div className="flex flex-col gap-3">
            {isCoach ? (
              <>
                <Link
                  href="/dashboard"
                  className="w-full rounded-lg bg-indigo-600 px-4 py-2.5 text-center text-sm font-semibold text-white hover:bg-indigo-500 transition-colors"
                >
                  Back to Dashboard
                </Link>
                <Link
                  href="/dashboard/bookings"
                  className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-2.5 text-center text-sm font-medium text-zinc-200 hover:border-zinc-600 hover:text-white transition-colors"
                >
                  View Bookings
                </Link>
              </>
            ) : (
              <Link
                href="/"
                className="w-full rounded-lg bg-indigo-600 px-4 py-2.5 text-center text-sm font-semibold text-white hover:bg-indigo-500 transition-colors"
              >
                Back to Home
              </Link>
            )}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen px-4 py-12">
      <div className="mx-auto max-w-lg space-y-6">

        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="space-y-0.5">
            <h1 className="text-2xl font-semibold tracking-tight text-zinc-100">{sessionTitle}</h1>
            <p className="text-xs font-medium uppercase tracking-wider text-zinc-500">
              {isCoach ? 'You are the coach' : 'Guest session'}
            </p>
          </div>
          {user && (
            <Link href={backHref} className="text-sm text-zinc-500 hover:text-zinc-300 transition-colors">
              ← {isCoach ? 'Bookings' : 'Home'}
            </Link>
          )}
        </div>

        {/* Booking details card */}
        <div className="rounded-xl border border-zinc-800 bg-zinc-900 divide-y divide-zinc-800">
          <div className="px-6 py-4 space-y-0.5">
            <p className="text-xs font-medium uppercase tracking-wider text-zinc-500">Guest</p>
            <p className="font-medium text-zinc-100">{booking.guest_name}</p>
          </div>
          <div className="px-6 py-4 space-y-0.5">
            <p className="text-xs font-medium uppercase tracking-wider text-zinc-500">Scheduled</p>
            <p className="text-sm text-zinc-200">
              {formatDate(booking.booking_date)} &middot;{' '}
              {formatTime(booking.start_time)} – {formatTime(booking.end_time)}
            </p>
            <p className="text-xs text-zinc-500 font-mono">{coachTimezone}</p>
          </div>
        </div>

        {/* Join button / time-gate */}
        {windowState === 'too_early' ? (
          <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-5 space-y-1 text-center">
            <p className="text-sm font-medium text-zinc-200">Session hasn't started yet</p>
            <p className="text-sm text-zinc-400">
              You can join in {minutesUntilOpen} minute{minutesUntilOpen === 1 ? '' : 's'}. Come back closer to the start time.
            </p>
          </div>
        ) : windowState === 'ended' ? (
          <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-5 text-center">
            <p className="text-sm font-medium text-zinc-400">This session has already ended.</p>
          </div>
        ) : !isCoach && booking.transcript_enabled && booking.transcript_consent_status === 'pending' ? (
          <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-5 space-y-4">
            <div className="space-y-1">
              <p className="text-sm font-semibold text-zinc-100">Transcript consent</p>
              <p className="text-sm text-zinc-400">
                Your coach has enabled session transcript. Do you consent to this session being transcribed?
              </p>
            </div>
            <div className="flex flex-col gap-2">
              <form action={recordTranscriptConsent}>
                <input type="hidden" name="booking_id" value={bookingId} />
                <input type="hidden" name="guest_token" value={guestToken ?? ''} />
                <input type="hidden" name="decision" value="consented" />
                <button
                  type="submit"
                  className="w-full rounded-xl bg-white py-3 text-center text-sm font-semibold text-zinc-900 hover:bg-zinc-100 transition-colors"
                >
                  Allow transcript
                </button>
              </form>
              <form action={recordTranscriptConsent}>
                <input type="hidden" name="booking_id" value={bookingId} />
                <input type="hidden" name="guest_token" value={guestToken ?? ''} />
                <input type="hidden" name="decision" value="declined" />
                <button
                  type="submit"
                  className="w-full rounded-xl border border-zinc-700 bg-zinc-800 py-3 text-center text-sm font-medium text-zinc-300 hover:border-zinc-600 hover:text-white transition-colors"
                >
                  Continue without transcript
                </button>
              </form>
            </div>
          </div>
        ) : (
          <JoinButton bookingId={bookingId} guestToken={guestToken} />
        )}

      </div>
    </div>
  )
}
