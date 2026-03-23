import { createClient } from '@/lib/supabase/server'
import { createServiceClient } from '@/lib/supabase/service'
import { getSessionAccess } from '@/lib/session-auth'
import { redirect } from 'next/navigation'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import JoinButton from './join-button'

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
  searchParams: Promise<{ guestToken?: string }>
}) {
  const [{ bookingId }, { guestToken }] = await Promise.all([params, searchParams])

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

  const st = booking.session_types as { title: string } | { title: string }[] | null
  const sessionTitle = Array.isArray(st) ? (st[0]?.title ?? 'Session') : (st?.title ?? 'Session')

  const backHref = isCoach ? '/dashboard/bookings' : '/'

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

        {/* Join button */}
        <JoinButton bookingId={bookingId} guestToken={guestToken} />

      </div>
    </div>
  )
}
