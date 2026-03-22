'use client'

import { useActionState } from 'react'
import { createAvailabilityRule } from '@/app/actions/availability'

const DAYS = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
]

export default function CreateAvailabilityRuleForm() {
  const [error, action, pending] = useActionState(createAvailabilityRule, null)

  return (
    <form action={action} className="space-y-4">
      <div className="space-y-1">
        <label htmlFor="day_of_week" className="text-sm font-medium">
          Day of week
        </label>
        <select
          id="day_of_week"
          name="day_of_week"
          required
          defaultValue=""
          className="w-full rounded border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-black"
        >
          <option value="" disabled>
            Select a day
          </option>
          {DAYS.map((day, i) => (
            <option key={day} value={i}>
              {day}
            </option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1">
          <label htmlFor="start_time" className="text-sm font-medium">
            Start time
          </label>
          <input
            id="start_time"
            name="start_time"
            type="time"
            required
            className="w-full rounded border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-black"
          />
        </div>

        <div className="space-y-1">
          <label htmlFor="end_time" className="text-sm font-medium">
            End time
          </label>
          <input
            id="end_time"
            name="end_time"
            type="time"
            required
            className="w-full rounded border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-black"
          />
        </div>
      </div>

      <div className="flex items-center gap-2">
        <input
          id="is_active"
          name="is_active"
          type="checkbox"
          defaultChecked
          className="rounded"
        />
        <label htmlFor="is_active" className="text-sm">
          Active
        </label>
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <button
        type="submit"
        disabled={pending}
        className="rounded bg-black px-4 py-2 text-sm font-medium text-white disabled:opacity-50"
      >
        {pending ? 'Saving…' : 'Add availability'}
      </button>
    </form>
  )
}
