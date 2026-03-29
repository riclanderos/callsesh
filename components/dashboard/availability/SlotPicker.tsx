'use client'

import { useActionState, useState } from 'react'
import { saveRecurringDay } from '@/app/actions/availability'
import { allPickerSlots } from '@/lib/availability'

const ALL_SLOTS = allPickerSlots()

// Display order: Mon → Sun
const DAY_ORDER = [1, 2, 3, 4, 5, 6, 0]

const DAY_SHORT: Record<number, string> = {
  0: 'Sun', 1: 'Mon', 2: 'Tue', 3: 'Wed', 4: 'Thu', 5: 'Fri', 6: 'Sat',
}
const DAY_FULL: Record<number, string> = {
  0: 'Sunday', 1: 'Monday', 2: 'Tuesday', 3: 'Wednesday',
  4: 'Thursday', 5: 'Friday', 6: 'Saturday',
}

/**
 * "9 AM" for :00 slots, "9:30" for :30 slots.
 * Hour markers carry AM/PM context; half-hour slots stay terse.
 */
function formatSlot(t: string): string {
  const [h, m] = t.split(':').map(Number)
  const hour = h % 12 || 12
  if (m === 0) {
    return `${hour} ${h >= 12 ? 'PM' : 'AM'}`
  }
  return `${hour}:${String(m).padStart(2, '0')}`
}

// ─── Per-day editor ────────────────────────────────────────────────────────────

function DayEditor({
  day,
  initialSelected,
}: {
  day: number
  initialSelected: string[]
}) {
  const [selected, setSelected] = useState<Set<string>>(() => new Set(initialSelected))
  const [error, formAction, pending] = useActionState(saveRecurringDay, null)

  function toggle(slot: string) {
    setSelected((prev) => {
      const next = new Set(prev)
      next.has(slot) ? next.delete(slot) : next.add(slot)
      return next
    })
  }

  return (
    <div className="p-5 space-y-4">
      {/* Slot grid */}
      <div className="grid grid-cols-4 sm:grid-cols-6 lg:grid-cols-8 gap-1.5">
        {ALL_SLOTS.map((slot) => {
          const on = selected.has(slot)
          return (
            <button
              key={slot}
              type="button"
              onClick={() => toggle(slot)}
              className={`rounded-md py-2 text-xs font-medium transition-colors select-none ${
                on
                  ? 'bg-white text-zinc-900'
                  : 'bg-zinc-800 text-zinc-500 hover:bg-zinc-700 hover:text-zinc-300'
              }`}
            >
              {formatSlot(slot)}
            </button>
          )
        })}
      </div>

      {/* Save row */}
      <form action={formAction} className="flex items-center gap-3 flex-wrap">
        <input type="hidden" name="day_of_week" value={day} />
        {[...selected].map((slot) => (
          <input key={slot} type="hidden" name="slots" value={slot} />
        ))}
        <button
          type="submit"
          disabled={pending}
          className="rounded-lg bg-white px-4 py-2 text-xs font-semibold text-zinc-900 hover:bg-zinc-100 disabled:opacity-50 transition-colors"
        >
          {pending ? 'Saving…' : `Save ${DAY_FULL[day]}`}
        </button>
        {selected.size === 0 && (
          <span className="text-xs text-zinc-600">Saving will clear all slots for this day.</span>
        )}
        {error && (
          <span className="text-xs text-red-400">{error}</span>
        )}
      </form>
    </div>
  )
}

// ─── Weekly picker (tabbed) ────────────────────────────────────────────────────

export default function SlotPicker({
  initialSelectedByDay,
}: {
  initialSelectedByDay: Partial<Record<number, string[]>>
}) {
  const [activeDay, setActiveDay] = useState(1) // default to Monday

  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-900 overflow-hidden">
      {/* Day tab strip */}
      <div className="flex border-b border-zinc-800 overflow-x-auto">
        {DAY_ORDER.map((day) => {
          const hasSavedSlots = (initialSelectedByDay[day]?.length ?? 0) > 0
          const isActive = activeDay === day
          return (
            <button
              key={day}
              type="button"
              onClick={() => setActiveDay(day)}
              className={`relative flex-1 min-w-[52px] py-3 text-xs font-medium transition-colors ${
                isActive
                  ? 'text-zinc-100 bg-zinc-800/60'
                  : 'text-zinc-500 hover:text-zinc-300'
              }`}
            >
              {DAY_SHORT[day]}
              {hasSavedSlots && (
                <span
                  className={`absolute top-2 right-1.5 h-1.5 w-1.5 rounded-full ${
                    isActive ? 'bg-indigo-400' : 'bg-indigo-600'
                  }`}
                />
              )}
            </button>
          )
        })}
      </div>

      {/* Render all editors; hide inactive ones to preserve unsaved state */}
      {DAY_ORDER.map((day) => (
        <div key={day} className={activeDay === day ? '' : 'hidden'}>
          <DayEditor
            // Key changes only when server data for this day changes (i.e. after a successful save),
            // causing DayEditor to re-initialise from the newly persisted state.
            key={`${day}:${(initialSelectedByDay[day] ?? []).slice().sort().join(',')}`}
            day={day}
            initialSelected={initialSelectedByDay[day] ?? []}
          />
        </div>
      ))}
    </div>
  )
}
