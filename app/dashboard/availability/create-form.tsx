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
      <div className="space-y-1.5">
        <label htmlFor="day_of_week" className="text-xs font-medium uppercase tracking-wider text-zinc-300">
          Day of week
        </label>
        <select
          id="day_of_week"
          name="day_of_week"
          required
          defaultValue=""
          className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-2.5 text-sm text-zinc-100 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/40 transition-colors"
        >
          <option value="" disabled className="text-zinc-500">
            Select a day
          </option>
          {DAYS.map((day, i) => (
            <option key={day} value={i} className="bg-zinc-800 text-zinc-100">
              {day}
            </option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <label htmlFor="start_time" className="text-xs font-medium uppercase tracking-wider text-zinc-300">
            Start time
          </label>
          <input
            id="start_time"
            name="start_time"
            type="time"
            required
            className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-2.5 text-sm text-zinc-100 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/40 transition-colors"
          />
        </div>

        <div className="space-y-1.5">
          <label htmlFor="end_time" className="text-xs font-medium uppercase tracking-wider text-zinc-300">
            End time
          </label>
          <input
            id="end_time"
            name="end_time"
            type="time"
            required
            className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-2.5 text-sm text-zinc-100 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/40 transition-colors"
          />
        </div>
      </div>

      <div className="flex items-center gap-2">
        <input
          id="is_active"
          name="is_active"
          type="checkbox"
          defaultChecked
          className="rounded border-zinc-700 bg-zinc-800"
        />
        <label htmlFor="is_active" className="text-sm text-zinc-400">
          Active immediately
        </label>
      </div>

      {error && (
        <p className="rounded-lg border border-red-900 bg-red-950 px-3 py-2 text-sm text-red-400">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="rounded-lg bg-white px-4 py-2 text-sm font-semibold text-zinc-900 hover:bg-zinc-100 disabled:opacity-50 transition-colors"
      >
        {pending ? 'Saving…' : 'Add availability'}
      </button>
    </form>
  )
}
