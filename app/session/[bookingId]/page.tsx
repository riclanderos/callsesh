import { createClient } from '@/lib/supabase/server'
import { createServiceClient } from '@/lib/supabase/service'
import { getSessionAccess } from '@/lib/session-auth'
import { redirect } from 'next/navigation'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import JoinButton from './join-button'

// "YYYY-MM-DD" → "Mon, Mar 24, 2026"
function formatDate(d: string): string {
  const [year, month, day] = d.split('-').map(Number)
  return new Date(year, month - 1, day).toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

// "HH:MM:SS" or "HH:MM" → "H:MM AM/PM"
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
  searchParams: Promise<{ guestToken?: string }>
}) {
  const [{ bookingId }, { guestToken }] = await Promise.all([params, searchParams])

  // ── 1. Auth ───────────────────────────────────────────────────────────────
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  // ── 2–4. Booking fetch + access check ────────────────────────────────────
  const access = await getSessionAccess(bookingId, user, guestToken)

  if (!access) {
    if (!user && !guestToken) redirect('/login')
    notFound()
  }

  const { booking, isCoach } = access

  // ── 5. Room must be provisioned ───────────────────────────────────────────
  if (!booking.daily_room_name || !booking.daily_room_url) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-50 p-8">
        <div className="max-w-sm w-full rounded-xl border bg-white p-8 shadow-sm text-center space-y-3">
          <div className="mx-auto h-10 w-10 rounded-full bg-zinc-100 flex items-center justify-center">
            <svg className="h-5 w-5 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div className="space-y-1">
            <h1 className="font-semibold">Room is being prepared</h1>
            <p className="text-sm text-zinc-500">
              Your session room is almost ready. Refresh the page in a moment.
            </p>
          </div>
        </div>
      </div>
    )
  }

  // ── 6. Resolve supporting data ────────────────────────────────────────────
  const { data: profile } = await createServiceClient()
    .from('profiles')
    .select('timezone')
    .eq('id', booking.coach_id)
    .single()

  const coachTimezone = profile?.timezone ?? 'UTC'

  const st = booking.session_types as { title: string } | { title: string }[] | null
  const sessionTitle = Array.isArray(st) ? (st[0]?.title ?? 'Session') : (st?.title ?? 'Session')

  const backHref = isCoach ? '/dashboard/bookings' : '/'

  // ── 7. Render ─────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-zinc-50 py-12 px-4">
      <div className="mx-auto max-w-lg space-y-6">

        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="space-y-0.5">
            <h1 className="text-2xl font-semibold tracking-tight">{sessionTitle}</h1>
            <p className="text-xs font-medium uppercase tracking-wider text-zinc-400">
              {isCoach ? 'You are the coach' : 'Guest session'}
            </p>
          </div>
          {user && (
            <Link href={backHref} className="text-sm text-zinc-400 hover:text-zinc-700 transition-colors">
              ← {isCoach ? 'Bookings' : 'Home'}
            </Link>
          )}
        </div>

        {/* Booking details card */}
        <div className="rounded-xl border bg-white shadow-sm divide-y divide-zinc-100">
          <div className="px-6 py-4 space-y-0.5">
            <p className="text-xs font-medium uppercase tracking-wider text-zinc-400">Guest</p>
            <p className="font-medium text-zinc-900">{booking.guest_name}</p>
          </div>
          <div className="px-6 py-4 space-y-0.5">
            <p className="text-xs font-medium uppercase tracking-wider text-zinc-400">Scheduled</p>
            <p className="text-sm text-zinc-900">
              {formatDate(booking.booking_date)} &middot;{' '}
              {formatTime(booking.start_time)} – {formatTime(booking.end_time)}
            </p>
            <p className="text-xs text-zinc-400">{coachTimezone}</p>
          </div>
        </div>

        {/* Join button */}
        <JoinButton bookingId={bookingId} guestToken={guestToken} />

      </div>
    </div>
  )
}
