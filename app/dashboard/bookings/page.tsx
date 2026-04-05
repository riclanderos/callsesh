import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { cancelBooking } from '@/app/actions/bookings'
import CancelButton from './cancel-button'
import JoinSessionButton from './join-session-button'
import { tzAbbr } from '@/lib/booking'

type Booking = {
  id: string
  guest_name: string
  guest_email: string
  booking_date: string
  start_time: string
  end_time: string
  status: string
  sessionTitle: string
  client_message: string | null
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
    confirmed: 'bg-green-950 text-green-400 border border-green-900',
    cancelled: 'bg-zinc-800 text-zinc-500 border border-zinc-700',
    completed: 'bg-blue-950 text-blue-400 border border-blue-900',
  }
  return (
    <span
      className={`rounded px-1.5 py-0.5 text-xs font-medium capitalize ${
        styles[status] ?? 'bg-zinc-800 text-zinc-400 border border-zinc-700'
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
      .select('id, guest_name, guest_email, booking_date, start_time, end_time, status, client_message, session_types(title)')
      .eq('coach_id', user.id)
      .order('booking_date', { ascending: true })
      .order('start_time', { ascending: true }),
    supabase.from('profiles').select('timezone').eq('id', user.id).single(),
  ])

  if (error) throw new Error(error.message)

  const coachTimezone = profile?.timezone ?? 'UTC'

  const bookings: Booking[] = (rawData ?? []).map((row) => {
    const st = row.session_types as { title: string } | { title: string }[] | null
    const sessionTitle = Array.isArray(st)
      ? (st[0]?.title ?? '—')
      : (st?.title ?? '—')
    return { ...row, sessionTitle }
  })

  // Current date and time in the coach's timezone — used as the classification
  // boundary so bookings are never misclassified due to UTC/local offset.
  const todayInCoachTz = new Intl.DateTimeFormat('en-CA', { timeZone: coachTimezone }).format(new Date())
  const nowParts = new Intl.DateTimeFormat('en-US', {
    timeZone: coachTimezone, hour: 'numeric', minute: '2-digit', hour12: false,
  }).formatToParts(new Date())
  const nowH = parseInt(nowParts.find((p) => p.type === 'hour')?.value ?? '0', 10) % 24
  const nowM = parseInt(nowParts.find((p) => p.type === 'minute')?.value ?? '0', 10)
  const nowMinutes = nowH * 60 + nowM

  // A booking is Upcoming if it hasn't fully ended yet in the coach's timezone.
  // A booking is Past only once its end_time has passed on its booking_date.
  const upcoming = bookings.filter((b) => {
    if (b.booking_date > todayInCoachTz) return true
    if (b.booking_date < todayInCoachTz) return false
    const [eh, em] = b.end_time.split(':').map(Number)
    return eh * 60 + em > nowMinutes
  })
  const past = bookings.filter((b) => {
    if (b.booking_date < todayInCoachTz) return true
    if (b.booking_date > todayInCoachTz) return false
    const [eh, em] = b.end_time.split(':').map(Number)
    return eh * 60 + em <= nowMinutes
  }).reverse()

  return (
    <div className="min-h-screen px-6 py-10">
      <div className="mx-auto max-w-4xl space-y-8">

        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="space-y-0.5">
            <h1 className="text-2xl font-semibold text-zinc-100">Bookings</h1>
            <p className="text-sm text-zinc-400">
              {coachTimezone} · {tzAbbr(coachTimezone)}
            </p>
          </div>
          <Link
            href="/dashboard"
            className="text-sm text-zinc-400 hover:text-zinc-300 transition-colors"
          >
            ← Dashboard
          </Link>
        </div>

        {bookings.length === 0 && (
          <div className="rounded-xl border border-zinc-800 bg-zinc-900 px-6 py-10 text-center">
            <p className="text-sm text-zinc-400">No bookings yet.</p>
          </div>
        )}

        {/* Upcoming */}
        {upcoming.length > 0 && (
          <section className="space-y-3">
            <p className="text-xs font-medium uppercase tracking-wider text-zinc-400">Upcoming</p>
            <div className="space-y-2">
              {upcoming.map((b) => (
                <BookingRow key={b.id} booking={b} isUpcoming />
              ))}
            </div>
          </section>
        )}

        {/* Past */}
        {past.length > 0 && (
          <section className="space-y-3">
            <p className="text-xs font-medium uppercase tracking-wider text-zinc-400">Past</p>
            <div className="space-y-2">
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

function BookingRow({ booking: b, isUpcoming = false }: { booking: Booking; isUpcoming?: boolean }) {
  const isCancellable = b.status !== 'cancelled'
  const showJoin = isUpcoming && b.status === 'confirmed'

  return (
    <div className="flex items-start justify-between rounded-xl border border-zinc-800 bg-zinc-900 p-4">
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <span className="font-medium text-zinc-100">{b.guest_name}</span>
          {statusBadge(b.status)}
        </div>
        <p className="text-sm text-zinc-400">{b.sessionTitle}</p>
        {b.client_message && (
          <p className="text-sm text-zinc-300">&ldquo;{b.client_message}&rdquo;</p>
        )}
        <p className="text-sm text-zinc-400">{b.guest_email}</p>
        <p className="text-sm text-zinc-400 font-mono">
          {formatDate(b.booking_date)} · {formatTime(b.start_time)} – {formatTime(b.end_time)}
        </p>
      </div>

      <div className="flex flex-col items-end gap-2">
        {showJoin && (
          <JoinSessionButton
            bookingId={b.id}
            bookingDate={b.booking_date}
            startTime={b.start_time}
            endTime={b.end_time}
            formattedStartTime={formatTime(b.start_time)}
          />
        )}
        <Link
          href={`/dashboard/bookings/${b.id}`}
          className="text-xs text-zinc-400 hover:text-zinc-300 transition-colors"
        >
          Notes / Recap
        </Link>
        {isCancellable && (
          <form action={cancelBooking}>
            <input type="hidden" name="booking_id" value={b.id} />
            <CancelButton />
          </form>
        )}
      </div>
    </div>
  )
}
