'use client'

import { useState } from 'react'

const DAYS = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
]

// Converts "HH:MM" → "H:MM AM/PM"
function formatTime(t: string): string {
  const [h, m] = t.split(':').map(Number)
  const period = h >= 12 ? 'PM' : 'AM'
  const hour = h % 12 || 12
  return `${hour}:${String(m).padStart(2, '0')} ${period}`
}

export type DaySlots = {
  day: number   // 0 = Sunday … 6 = Saturday
  slots: string[] // ["09:00", "09:30", …]
}

export default function SlotPicker({ daySlots }: { daySlots: DaySlots[] }) {
  // selected is "day:HH:MM", e.g. "1:09:00"
  const [selected, setSelected] = useState<string | null>(null)

  const hasAnySlots = daySlots.some((d) => d.slots.length > 0)

  if (!hasAnySlots) {
    return (
      <p className="text-sm text-zinc-400">
        No time slots available for this session length.
      </p>
    )
  }

  return (
    <div className="space-y-6">
      {daySlots.map(({ day, slots }) => {
        if (slots.length === 0) return null

        return (
          <div key={day} className="space-y-2">
            <h3 className="text-sm font-medium">{DAYS[day]}</h3>
            <div className="flex flex-wrap gap-2">
              {slots.map((slot) => {
                const key = `${day}:${slot}`
                const isSelected = selected === key

                return (
                  <button
                    key={slot}
                    type="button"
                    onClick={() => setSelected(isSelected ? null : key)}
                    className={`rounded border px-3 py-1.5 text-sm transition-colors ${
                      isSelected
                        ? 'border-black bg-black text-white'
                        : 'hover:border-zinc-400'
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
  )
}
