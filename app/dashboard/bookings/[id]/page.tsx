import { createClient } from '@/lib/supabase/server'
import { redirect, notFound } from 'next/navigation'
import Link from 'next/link'
import { saveBookingNotes, saveBookingRecap } from '@/app/actions/bookings'
import SaveButton from './save-button'
import TranscriptToggle from './transcript-toggle'
import RecapCopy from './recap-copy'

function formatDate(d: string): string {
  const [year, month, day] = d.split('-').map(Number)
  return new Date(year, month - 1, day).toLocaleDateString('en-US', {
    weekday: 'short', month: 'short', day: 'numeric', year: 'numeric',
  })
}

function formatTime(t: string): string {
  const [h, m] = t.split(':').map(Number)
  const period = h >= 12 ? 'PM' : 'AM'
  const hour = h % 12 || 12
  return `${hour}:${String(m).padStart(2, '0')} ${period}`
}

export default async function BookingDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const { data: booking } = await supabase
    .from('bookings')
    .select(
      'id, guest_name, guest_email, booking_date, start_time, end_time, status, client_message, coach_notes, recap_summary, recap_key_points, recap_action_steps, recap_created_at, transcript_enabled, transcript_consent_status, session_types(title)'
    )
    .eq('id', id)
    .eq('coach_id', user.id)
    .single()

  if (!booking) notFound()

  const st = booking.session_types as { title: string } | { title: string }[] | null
  const sessionTitle = Array.isArray(st) ? (st[0]?.title ?? '—') : (st?.title ?? '—')

  const keyPointsText = ((booking.recap_key_points as string[] | null) ?? []).join('\n')
  const actionStepsText = ((booking.recap_action_steps as string[] | null) ?? []).join('\n')

  const statusStyles: Record<string, string> = {
    confirmed: 'bg-green-950 text-green-400 border border-green-900',
    cancelled:  'bg-zinc-800 text-zinc-500 border border-zinc-700',
    completed:  'bg-blue-950 text-blue-400 border border-blue-900',
  }

  return (
    <div className="min-h-screen px-6 py-10">
      <div className="mx-auto max-w-2xl space-y-6">

        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="space-y-0.5">
            <h1 className="text-xl font-semibold text-zinc-100">{booking.guest_name}</h1>
            <p className="text-sm text-zinc-400">{booking.guest_email}</p>
          </div>
          <Link
            href="/dashboard/bookings"
            className="text-sm text-zinc-400 hover:text-zinc-300 transition-colors"
          >
            ← Bookings
          </Link>
        </div>

        {/* Booking summary */}
        <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-5 space-y-2">
          <div className="flex items-center gap-2">
            <span className="text-sm text-zinc-200 font-medium">{sessionTitle}</span>
            <span
              className={`rounded px-1.5 py-0.5 text-xs font-medium capitalize ${
                statusStyles[booking.status] ?? 'bg-zinc-800 text-zinc-400 border border-zinc-700'
              }`}
            >
              {booking.status}
            </span>
          </div>
          <p className="text-sm text-zinc-400 font-mono">
            {formatDate(booking.booking_date)} · {formatTime(booking.start_time)} – {formatTime(booking.end_time)}
          </p>
          {booking.client_message && (
            <p className="text-sm text-zinc-300 border-t border-zinc-800 pt-2 mt-2">
              &ldquo;{booking.client_message}&rdquo;
            </p>
          )}
        </div>

        {/* Transcript */}
        <TranscriptToggle
          bookingId={booking.id}
          transcriptEnabled={booking.transcript_enabled as boolean ?? false}
          consentStatus={booking.transcript_consent_status as string ?? 'not_requested'}
        />

        {/* Session Notes */}
        <section className="rounded-xl border border-zinc-800 bg-zinc-900 p-5 space-y-3">
          <h2 className="text-sm font-semibold text-zinc-100">Session Notes</h2>
          <form action={saveBookingNotes} className="space-y-3">
            <input type="hidden" name="booking_id" value={booking.id} />
            <textarea
              name="coach_notes"
              defaultValue={booking.coach_notes ?? ''}
              rows={5}
              placeholder="Your private notes for this session…"
              className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-2 text-sm text-zinc-100 placeholder-zinc-500 focus:border-indigo-500 focus:outline-none resize-y"
            />
            <div className="flex justify-end">
              <SaveButton label="Save Notes" />
            </div>
          </form>
        </section>

        {/* Session Recap */}
        <section className="rounded-xl border border-zinc-800 bg-zinc-900 p-5 space-y-4">
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div className="flex items-baseline gap-3">
              <h2 className="text-sm font-semibold text-zinc-100">Session Recap</h2>
              {booking.recap_created_at && (
                <span className="text-xs text-zinc-500">
                  Saved {new Date(booking.recap_created_at as string).toLocaleDateString('en-US', {
                    month: 'short', day: 'numeric', year: 'numeric',
                  })}
                </span>
              )}
            </div>
            <RecapCopy
              clientName={booking.guest_name}
              summary={booking.recap_summary ?? ''}
              keyPoints={((booking.recap_key_points as string[] | null) ?? [])}
              actionSteps={((booking.recap_action_steps as string[] | null) ?? [])}
            />
          </div>
          <form action={saveBookingRecap} className="space-y-4">
            <input type="hidden" name="booking_id" value={booking.id} />
            <div className="space-y-1.5">
              <label className="text-xs font-medium uppercase tracking-wider text-zinc-400">
                Summary
              </label>
              <textarea
                name="recap_summary"
                defaultValue={booking.recap_summary ?? ''}
                rows={4}
                placeholder="What happened in this session…"
                className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-2 text-sm text-zinc-100 placeholder-zinc-500 focus:border-indigo-500 focus:outline-none resize-y"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-medium uppercase tracking-wider text-zinc-400">
                Key Points <span className="normal-case text-zinc-500">(one per line)</span>
              </label>
              <textarea
                name="recap_key_points"
                defaultValue={keyPointsText}
                rows={4}
                placeholder={`Discussed pricing strategy\nIdentified top 3 growth blockers`}
                className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-2 text-sm text-zinc-100 placeholder-zinc-500 focus:border-indigo-500 focus:outline-none resize-y"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-medium uppercase tracking-wider text-zinc-400">
                Action Steps <span className="normal-case text-zinc-500">(one per line)</span>
              </label>
              <textarea
                name="recap_action_steps"
                defaultValue={actionStepsText}
                rows={4}
                placeholder={`Draft a new outreach sequence by Friday\nSchedule follow-up call`}
                className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-2 text-sm text-zinc-100 placeholder-zinc-500 focus:border-indigo-500 focus:outline-none resize-y"
              />
            </div>
            <div className="flex justify-end">
              <SaveButton label="Save Recap" />
            </div>
          </form>
        </section>

      </div>
    </div>
  )
}
