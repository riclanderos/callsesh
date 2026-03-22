import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { cancelBooking } from '@/app/actions/bookings'
import CancelButton from './cancel-button'

type Booking = {
  id: string
  guest_name: string
  guest_email: string
  booking_date: string
  start_time: string
  end_time: string
  status: string
  sessionTitle: string
}

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

function statusBadge(status: string) {
  const styles: Record<string, string> = {
    confirmed: 'bg-green-50 text-green-700',
    cancelled: 'bg-zinc-100 text-zinc-400',
    completed: 'bg-blue-50 text-blue-700',
  }
  return (
    <span
      className={`rounded px-1.5 py-0.5 text-xs font-medium capitalize ${
        styles[status] ?? 'bg-zinc-100 text-zinc-500'
      }`}
    >
      {status}
    </span>
  )
}

export default async function BookingsPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const [{ data: rawData, error }, { data: profile }] = await Promise.all([
    supabase
      .from('bookings')
      .select('id, guest_name, guest_email, booking_date, start_time, end_time, status, session_types(title)')
      .eq('coach_id', user.id)
      .order('booking_date', { ascending: true })
      .order('start_time', { ascending: true }),
    supabase.from('profiles').select('timezone').eq('id', user.id).single(),
  ])

  if (error) throw new Error(error.message)

  const coachTimezone = profile?.timezone ?? 'UTC'

  // Normalise the session_types join (Supabase may return object or array).
  const bookings: Booking[] = (rawData ?? []).map((row) => {
    const st = row.session_types as { title: string } | { title: string }[] | null
    const sessionTitle = Array.isArray(st)
      ? (st[0]?.title ?? '—')
      : (st?.title ?? '—')
    return { ...row, sessionTitle }
  })

  // Split at today's date string so the list re-sorts correctly after midnight
  // without a server restart. booking_date is compared lexicographically, which
  // works correctly for ISO "YYYY-MM-DD" strings.
  const today = new Date().toISOString().split('T')[0]
  const upcoming = bookings.filter((b) => b.booking_date >= today)
  const past = bookings
    .filter((b) => b.booking_date < today)
    .reverse() // most recent past booking first

  return (
    <div className="min-h-screen p-8">
      <div className="mx-auto max-w-3xl space-y-8">

        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-semibold">Bookings</h1>
            <p className="mt-1 text-sm text-zinc-500">
              Your upcoming and past sessions &middot;{' '}
              <span className="font-mono">{coachTimezone}</span>
            </p>
          </div>
          <Link
            href="/dashboard"
            className="text-sm text-zinc-500 hover:text-black"
          >
            ← Dashboard
          </Link>
        </div>

        {bookings.length === 0 && (
          <p className="text-sm text-zinc-400">No bookings yet.</p>
        )}

        {/* Upcoming */}
        {upcoming.length > 0 && (
          <section className="space-y-3">
            <h2 className="text-sm font-medium text-zinc-500 uppercase tracking-wide">
              Upcoming
            </h2>
            <div className="space-y-3">
              {upcoming.map((b) => (
                <BookingRow key={b.id} booking={b} />
              ))}
            </div>
          </section>
        )}

        {/* Past */}
        {past.length > 0 && (
          <section className="space-y-3">
            <h2 className="text-sm font-medium text-zinc-500 uppercase tracking-wide">
              Past
            </h2>
            <div className="space-y-3">
              {past.map((b) => (
                <BookingRow key={b.id} booking={b} />
              ))}
            </div>
          </section>
        )}

      </div>
    </div>
  )
}

function BookingRow({ booking: b }: { booking: Booking }) {
  const isCancellable = b.status !== 'cancelled'

  return (
    <div className="flex items-start justify-between rounded-lg border p-4">
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <span className="font-medium">{b.guest_name}</span>
          {statusBadge(b.status)}
        </div>
        <p className="text-sm text-zinc-500">{b.guest_email}</p>
        <p className="text-sm text-zinc-500">{b.sessionTitle}</p>
        <p className="text-sm text-zinc-400">
          {formatDate(b.booking_date)} &middot;{' '}
          {formatTime(b.start_time)} – {formatTime(b.end_time)}
        </p>
      </div>

      {isCancellable && (
        <form action={cancelBooking}>
          <input type="hidden" name="booking_id" value={b.id} />
          <CancelButton />
        </form>
      )}
    </div>
  )
}
