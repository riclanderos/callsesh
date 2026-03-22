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

  // Redirect to Stripe Checkout once the server action returns a URL
  useEffect(() => {
    if (state?.ok) {
      window.location.href = state.checkoutUrl
    }
  }, [state])

  // ── Redirecting screen ───────────────────────────────────────────────────
  if (state?.ok) {
    return (
      <div className="rounded-xl border bg-white p-8 shadow-sm text-center space-y-2">
        <p className="font-medium">Redirecting to payment…</p>
        <p className="text-sm text-zinc-400">
          You&apos;re being taken to Stripe to complete your booking.
        </p>
      </div>
    )
  }

  const hasAnySlots = daySlots.some((d) => d.slots.length > 0)

  if (!hasAnySlots) {
    return (
      <div className="rounded-xl border bg-white p-6 shadow-sm text-center">
        <p className="text-sm text-zinc-400">
          No time slots available for this session length.
        </p>
      </div>
    )
  }

  // ── Main view ────────────────────────────────────────────────────────────
  return (
    <div className="space-y-6">

      {/* Timezone label */}
      <p className="text-xs text-zinc-400 px-1">All times in {coachTimezone}</p>

      {/* Slot grid */}
      <div className="rounded-xl border bg-white p-6 shadow-sm space-y-6">
        {daySlots.map(({ day, slots }) => {
          if (slots.length === 0) return null

          return (
            <div key={day} className="space-y-2.5">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
                {DAYS[day]}
              </h3>
              <div className="flex flex-wrap gap-2">
                {slots.map((slot) => {
                  const isSelected =
                    selected?.day === day && selected?.time === slot

                  return (
                    <button
                      key={slot}
                      type="button"
                      onClick={() =>
                        setSelected(isSelected ? null : { day, time: slot })
                      }
                      className={`rounded-lg border px-4 py-2 text-sm font-medium transition-colors ${
                        isSelected
                          ? 'border-black bg-black text-white'
                          : 'border-zinc-200 bg-white text-zinc-700 hover:border-zinc-400 hover:bg-zinc-50'
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

      {/* Guest details form — appears once a slot is selected */}
      {selected && (
        <form action={action} className="space-y-4">
          {/* Hidden fields carry slot context to the server action */}
          <input type="hidden" name="session_type_id" value={sessionTypeId} />
          <input type="hidden" name="day_of_week" value={selected.day} />
          <input type="hidden" name="start_time" value={selected.time} />

          <div className="rounded-xl border bg-white p-6 shadow-sm space-y-5">
            <div className="pb-1 border-b border-zinc-100">
              <p className="text-sm font-medium">
                {DAYS[selected.day]} at {formatTime(selected.time)}
              </p>
              <p className="text-xs text-zinc-400 mt-0.5">Enter your details to continue</p>
            </div>

            <div className="space-y-4">
              <div className="space-y-1.5">
                <label htmlFor="guest_name" className="text-sm font-medium text-zinc-700">
                  Your name
                </label>
                <input
                  id="guest_name"
                  name="guest_name"
                  type="text"
                  required
                  autoComplete="name"
                  placeholder="Jane Smith"
                  className="w-full rounded-lg border border-zinc-200 px-3 py-2.5 text-sm outline-none focus:border-zinc-400 focus:ring-2 focus:ring-zinc-100 placeholder:text-zinc-300"
                />
              </div>

              <div className="space-y-1.5">
                <label htmlFor="guest_email" className="text-sm font-medium text-zinc-700">
                  Your email
                </label>
                <input
                  id="guest_email"
                  name="guest_email"
                  type="email"
                  required
                  autoComplete="email"
                  placeholder="jane@example.com"
                  className="w-full rounded-lg border border-zinc-200 px-3 py-2.5 text-sm outline-none focus:border-zinc-400 focus:ring-2 focus:ring-zinc-100 placeholder:text-zinc-300"
                />
              </div>
            </div>

            {state?.ok === false && (
              <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">
                {state.error}
              </p>
            )}

            <button
              type="submit"
              disabled={pending}
              className="w-full rounded-lg bg-black py-3 text-sm font-semibold text-white hover:bg-zinc-800 disabled:opacity-50 transition-colors"
            >
              {pending ? 'Redirecting…' : 'Proceed to payment →'}
            </button>
          </div>
        </form>
      )}

    </div>
  )
}
