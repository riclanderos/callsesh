'use client'

import { useState, useEffect } from 'react'
import { useActionState } from 'react'
import { startCheckout, type CheckoutState } from '@/app/actions/bookings'

export type DaySlots = {
  day: number     // 0 = Sunday … 6 = Saturday
  slots: string[] // ["09:00", "09:30", …]
}

const DAYS = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
]

function formatTime(t: string): string {
  const [h, m] = t.split(':').map(Number)
  const period = h >= 12 ? 'PM' : 'AM'
  const hour = h % 12 || 12
  return `${hour}:${String(m).padStart(2, '0')} ${period}`
}

type Selected = { day: number; time: string }

export default function BookingForm({
  sessionTypeId,
  daySlots,
  coachTimezone,
}: {
  sessionTypeId: string
  daySlots: DaySlots[]
  coachTimezone: string
}) {
  const [selected, setSelected] = useState<Selected | null>(null)
  const [state, action, pending] = useActionState<CheckoutState, FormData>(
    startCheckout,
    null
  )

  useEffect(() => {
    if (state?.ok) {
      window.location.href = state.checkoutUrl
    }
  }, [state])

  if (state?.ok) {
    return (
      <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-8 text-center space-y-2">
        <p className="font-medium text-zinc-100">Redirecting to payment…</p>
        <p className="text-sm text-zinc-500">
          You&apos;re being taken to Stripe to complete your booking.
        </p>
      </div>
    )
  }

  const hasAnySlots = daySlots.some((d) => d.slots.length > 0)

  if (!hasAnySlots) {
    return (
      <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-6 text-center">
        <p className="text-sm text-zinc-500">
          No time slots available for this session length.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-4">

      {/* Timezone label */}
      <p className="text-xs text-zinc-500 px-1">All times in {coachTimezone}</p>

      {/* Slot grid */}
      <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-6 space-y-6">
        {daySlots.map(({ day, slots }) => {
          if (slots.length === 0) return null

          return (
            <div key={day} className="space-y-2.5">
              <p className="text-xs font-medium uppercase tracking-wider text-zinc-500">
                {DAYS[day]}
              </p>
              <div className="flex flex-wrap gap-2">
                {slots.map((slot) => {
                  const isSelected = selected?.day === day && selected?.time === slot

                  return (
                    <button
                      key={`${day}:${slot}`}
                      type="button"
                      onClick={() => setSelected(isSelected ? null : { day, time: slot })}
                      className={`rounded-lg border px-4 py-2 text-sm font-medium transition-colors ${
                        isSelected
                          ? 'border-white bg-white text-zinc-900'
                          : 'border-zinc-600 bg-zinc-800 text-zinc-100 hover:border-zinc-500 hover:text-white'
                      }`}
                    >
                      {formatTime(slot)}
                    </button>
                  )
                })}
              </div>
            </div>
          )
        })}
      </div>

      {/* Guest details form */}
      {selected && (
        <form action={action} className="space-y-4">
          <input type="hidden" name="session_type_id" value={sessionTypeId} />
          <input type="hidden" name="day_of_week" value={selected.day} />
          <input type="hidden" name="start_time" value={selected.time} />

          <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-6 space-y-5">
            <div className="pb-3 border-b border-zinc-700">
              <p className="text-sm font-medium text-zinc-100">
                {DAYS[selected.day]} at {formatTime(selected.time)}
              </p>
              <p className="text-xs text-zinc-100 mt-0.5">Enter your details to continue</p>
            </div>

            <div className="space-y-4">
              <div className="space-y-1.5">
                <label htmlFor="guest_name" className="text-xs font-medium uppercase tracking-wider text-zinc-100">
                  Your name
                </label>
                <input
                  id="guest_name"
                  name="guest_name"
                  type="text"
                  required
                  autoComplete="name"
                  placeholder="Jane Smith"
                  className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-2.5 text-sm text-zinc-100 placeholder:text-zinc-500 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/40 transition-colors"
                />
              </div>

              <div className="space-y-1.5">
                <label htmlFor="guest_email" className="text-xs font-medium uppercase tracking-wider text-zinc-100">
                  Your email
                </label>
                <input
                  id="guest_email"
                  name="guest_email"
                  type="email"
                  required
                  autoComplete="email"
                  placeholder="jane@example.com"
                  className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-2.5 text-sm text-zinc-100 placeholder:text-zinc-500 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/40 transition-colors"
                />
              </div>
            </div>

            {state?.ok === false && (
              <p className="rounded-lg border border-red-900 bg-red-950 px-3 py-2 text-sm text-red-400">
                {state.error}
              </p>
            )}

            <button
              type="submit"
              disabled={pending}
              className="w-full rounded-lg bg-indigo-600 py-3 text-sm font-semibold text-white hover:bg-indigo-500 disabled:opacity-50 transition-colors"
            >
              {pending ? 'Securing your session...' : 'Confirm & pay'}
            </button>
          </div>
        </form>
      )}

    </div>
  )
}
