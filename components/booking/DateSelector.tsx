'use client'

import { useState, useEffect, useRef } from 'react'
import { useActionState } from 'react'
import { startCheckout, type CheckoutState } from '@/app/actions/bookings'
import { tzAbbr, convertTime, type DateSlots } from '@/lib/booking'
import { track } from '@/lib/analytics'

const MONTH_SHORT = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']
const DAY_SHORT   = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat']
const DAY_FULL    = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday']
const MONTH_FULL  = ['January','February','March','April','May','June','July','August','September','October','November','December']

function formatTime(t: string): string {
  const [h, m] = t.split(':').map(Number)
  const period = h >= 12 ? 'PM' : 'AM'
  const hour = h % 12 || 12
  return `${hour}:${String(m).padStart(2, '0')} ${period}`
}

function GuestForm({
  action,
  pending,
  state,
  sessionTypeId,
  date,
  coachTime,
  coachTimezone,
  clientTimezone,
  isCoachOwner,
}: {
  action: (payload: FormData) => void
  pending: boolean
  state: CheckoutState
  sessionTypeId: string
  date: string
  coachTime: string
  coachTimezone: string
  clientTimezone: string
  isCoachOwner: boolean
}) {
  const [y, mo, d] = date.split('-').map(Number)
  const dt = new Date(y, mo - 1, d)
  const displayDate = `${DAY_FULL[dt.getDay()]}, ${MONTH_FULL[mo - 1]} ${d}`

  const tzDiffers = clientTimezone !== coachTimezone
  const clientTime = tzDiffers ? convertTime(date, coachTime, coachTimezone, clientTimezone) : coachTime
  const clientAbbr = tzAbbr(clientTimezone)
  const coachAbbr  = tzAbbr(coachTimezone)

  return (
    <form
      action={action}
      onSubmit={isCoachOwner ? (e) => e.preventDefault() : () => track('checkout_started', { session_type_id: sessionTypeId, date, slot: coachTime })}
      className="space-y-4"
    >
      <input type="hidden" name="session_type_id" value={sessionTypeId} />
      <input type="hidden" name="booking_date" value={date} />
      {/* start_time is always the coach-local slot time — used for availability validation */}
      <input type="hidden" name="start_time" value={coachTime} />
      <input type="hidden" name="guest_timezone" value={clientTimezone} />

      <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-6 space-y-5">
        <div className="pb-3 border-b border-zinc-700 space-y-0.5">
          <p className="text-sm font-medium text-zinc-100">{displayDate}</p>
          <p className="text-sm text-zinc-200">
            {formatTime(clientTime)}{' '}
            <span className="text-xs text-zinc-500">{clientAbbr}</span>
          </p>
          {tzDiffers && (
            <p className="text-xs text-zinc-600">
              {formatTime(coachTime)} {coachAbbr} · coach time
            </p>
          )}
          <p className="text-xs text-zinc-500 pt-1">Enter your details to continue</p>
        </div>

        <div className="space-y-4">
          <div className="space-y-1.5">
            <label
              htmlFor="guest_name"
              className="text-xs font-medium uppercase tracking-wider text-zinc-400"
            >
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
            <label
              htmlFor="guest_email"
              className="text-xs font-medium uppercase tracking-wider text-zinc-400"
            >
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

        {isCoachOwner ? (
          <div className="w-full rounded-lg bg-zinc-800 py-3 text-center text-sm font-medium text-zinc-500 select-none">
            You can&apos;t book your own session
          </div>
        ) : (
          <button
            type="submit"
            disabled={pending}
            className="w-full rounded-lg bg-indigo-600 py-3 text-sm font-semibold text-white hover:bg-indigo-500 disabled:opacity-50 transition-colors"
          >
            {pending ? 'Securing your session…' : 'Confirm & pay'}
          </button>
        )}
      </div>
    </form>
  )
}

export default function DateSelector({
  sessionTypeId,
  dateSlots,
  coachTimezone,
  isCoachOwner = false,
}: {
  sessionTypeId: string
  dateSlots: DateSlots[]
  coachTimezone: string
  isCoachOwner?: boolean
}) {
  const firstAvailable = dateSlots.find((ds) => ds.slots.length > 0)?.date ?? dateSlots[0]?.date ?? ''
  const [activeDate, setActiveDate] = useState(firstAvailable)
  const [selectedTime, setSelectedTime] = useState<string | null>(null)
  const [state, action, pending] = useActionState<CheckoutState, FormData>(startCheckout, null)
  const formWrapperRef = useRef<HTMLDivElement>(null)
  const lastScrolledKey = useRef<string | null>(null)
  // Default to coachTimezone to avoid hydration mismatch; updated after mount.
  const [clientTimezone, setClientTimezone] = useState(coachTimezone)
  useEffect(() => {
    setClientTimezone(Intl.DateTimeFormat().resolvedOptions().timeZone)
  }, [])

  useEffect(() => {
    if (state?.ok) window.location.href = state.checkoutUrl
  }, [state])

  useEffect(() => {
    setSelectedTime(null)
  }, [activeDate])

  useEffect(() => {
    if (!selectedTime) return
    const key = `${activeDate}:${selectedTime}`
    if (lastScrolledKey.current === key) return
    lastScrolledKey.current = key
    requestAnimationFrame(() => {
      const el = formWrapperRef.current
      if (!el) return
      const rect = el.getBoundingClientRect()
      if (rect.top < 0 || rect.bottom > window.innerHeight) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }
    })
  }, [selectedTime, activeDate])

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

  const hasAnySlots = dateSlots.some((ds) => ds.slots.length > 0)

  if (!hasAnySlots) {
    return (
      <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-6 text-center">
        <p className="text-sm text-zinc-500">No time slots available for this session length.</p>
      </div>
    )
  }

  const activeSlots = dateSlots.find((ds) => ds.date === activeDate)?.slots ?? []
  const tzDiffers   = clientTimezone !== coachTimezone
  const clientAbbr  = tzAbbr(clientTimezone)
  const coachAbbr   = tzAbbr(coachTimezone)

  return (
    <div className="space-y-3">
      {/* Single-line timezone context */}
      <div className="px-1">
        <p className="text-xs text-zinc-500">
          Times shown in your timezone{' '}
          <span className="text-zinc-400">({clientAbbr})</span>
        </p>
        {tzDiffers && (
          <p className="text-xs text-zinc-600">Coach is in {coachAbbr}</p>
        )}
      </div>

      <div className="rounded-xl border border-zinc-800 bg-zinc-900 overflow-hidden">
        {/* Scrollable date tab strip */}
        <div className="flex overflow-x-auto border-b border-zinc-800">
          {dateSlots.map(({ date, slots }) => {
            const [y, mo, d] = date.split('-').map(Number)
            const dt = new Date(y, mo - 1, d)
            const isActive = date === activeDate
            const hasSlots = slots.length > 0
            return (
              <button
                key={date}
                type="button"
                onClick={() => setActiveDate(date)}
                disabled={!hasSlots}
                className={`flex-shrink-0 flex flex-col items-center gap-0.5 px-3 py-3 min-w-[60px] text-xs font-medium transition-colors ${
                  !hasSlots
                    ? 'text-zinc-700 cursor-not-allowed'
                    : isActive
                    ? 'text-zinc-100 bg-zinc-800/60 border-b-2 border-indigo-500'
                    : 'text-zinc-500 hover:text-zinc-300'
                }`}
              >
                <span className="font-semibold">{DAY_SHORT[dt.getDay()]}</span>
                <span>{MONTH_SHORT[mo - 1]} {d}</span>
              </button>
            )
          })}
        </div>

        {/* Slot grid for the active date */}
        <div className="p-6 space-y-4">
          {activeSlots.length === 0 ? (
            <p className="text-sm text-zinc-500 text-center py-4">
              No availability on this date.
            </p>
          ) : (
            <div className="flex flex-wrap gap-2">
              {activeSlots.map((coachSlot) => {
                const isSelected = selectedTime === coachSlot
                // Display the slot in the client's local timezone
                const displayTime = tzDiffers
                  ? convertTime(activeDate, coachSlot, coachTimezone, clientTimezone)
                  : coachSlot
                return (
                  <button
                    key={coachSlot}
                    type="button"
                    onClick={() => {
                      const next = isSelected ? null : coachSlot
                      setSelectedTime(next)
                      if (next) track('slot_selected', { session_type_id: sessionTypeId, date: activeDate, slot: coachSlot })
                    }}
                    className={`rounded-lg border px-4 py-2 text-sm font-medium transition-colors ${
                      isSelected
                        ? 'border-white bg-white text-zinc-900'
                        : 'border-zinc-600 bg-zinc-800 text-zinc-100 hover:border-zinc-500 hover:text-white'
                    }`}
                  >
                    {formatTime(displayTime)}
                  </button>
                )
              })}
            </div>
          )}

          {selectedTime && (
            <div ref={formWrapperRef} className="mt-2">
              <GuestForm
                action={action}
                pending={pending}
                state={state}
                sessionTypeId={sessionTypeId}
                date={activeDate}
                coachTime={selectedTime}
                coachTimezone={coachTimezone}
                clientTimezone={clientTimezone}
                isCoachOwner={isCoachOwner}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
