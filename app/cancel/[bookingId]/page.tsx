import { timingSafeEqual } from 'crypto'
import { createServiceClient } from '@/lib/supabase/service'
import { notFound } from 'next/navigation'
import { cancelBookingAsGuest } from '@/app/actions/bookings'

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

export default async function GuestCancelPage({
  params,
  searchParams,
}: {
  params: Promise<{ bookingId: string }>
  searchParams: Promise<{ guestToken?: string }>
}) {
  const [{ bookingId }, { guestToken }] = await Promise.all([params, searchParams])

  if (!guestToken) notFound()

  const { data: booking } = await createServiceClient()
    .from('bookings')
    .select('id, guest_name, booking_date, start_time, end_time, status, guest_access_token, session_types(title)')
    .eq('id', bookingId)
    .single()

  if (!booking || !booking.guest_access_token) notFound()

  let tokenValid = false
  try {
    const provided = Buffer.from(guestToken, 'hex')
    const stored   = Buffer.from(booking.guest_access_token as string, 'hex')
    if (provided.length === stored.length) {
      tokenValid = timingSafeEqual(provided, stored)
    }
  } catch {
    // Malformed hex — mismatch.
  }

  if (!tokenValid) notFound()

  const st = booking.session_types as { title: string } | { title: string }[] | null
  const sessionTitle = Array.isArray(st) ? (st[0]?.title ?? 'Session') : (st?.title ?? 'Session')

  const alreadyCancelled = booking.status === 'cancelled'

  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-50 p-8">
      <div className="mx-auto max-w-md w-full space-y-6">

        {/* Header */}
        <div className="space-y-1">
          <h1 className="text-xl font-semibold tracking-tight">Cancel booking</h1>
          <p className="text-sm text-zinc-500">{sessionTitle}</p>
        </div>

        {/* Booking detail card */}
        <div className="rounded-xl border bg-white shadow-sm divide-y divide-zinc-100">
          <div className="px-5 py-4 space-y-0.5">
            <p className="text-xs font-medium uppercase tracking-wider text-zinc-400">Guest</p>
            <p className="text-sm font-medium text-zinc-900">{booking.guest_name}</p>
          </div>
          <div className="px-5 py-4 space-y-0.5">
            <p className="text-xs font-medium uppercase tracking-wider text-zinc-400">Scheduled</p>
            <p className="text-sm text-zinc-900">
              {formatDate(booking.booking_date)} &middot;{' '}
              {formatTime(booking.start_time)} – {formatTime(booking.end_time)}
            </p>
          </div>
        </div>

        {alreadyCancelled ? (
          <div className="rounded-xl border bg-white px-5 py-4 shadow-sm">
            <p className="text-sm text-zinc-500">This booking has already been cancelled.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Warning note */}
            <p className="text-xs text-zinc-400 leading-relaxed">
              Cancellation may be subject to the coach&apos;s refund policy. Once cancelled,
              this cannot be undone.
            </p>
            <form action={cancelBookingAsGuest}>
              <input type="hidden" name="booking_id"  value={bookingId} />
              <input type="hidden" name="guest_token" value={guestToken} />
              <button
                type="submit"
                className="w-full rounded-xl bg-red-600 py-3 text-sm font-semibold text-white hover:bg-red-700 transition-colors"
              >
                Confirm cancellation
              </button>
            </form>
          </div>
        )}

      </div>
    </div>
  )
}
