'use client'

import { useActionState } from 'react'
import { createBulkAvailabilityRules } from '@/app/actions/availability'

const DAYS = [
  { label: 'Sun', value: 0 },
  { label: 'Mon', value: 1 },
  { label: 'Tue', value: 2 },
  { label: 'Wed', value: 3 },
  { label: 'Thu', value: 4 },
  { label: 'Fri', value: 5 },
  { label: 'Sat', value: 6 },
]

export default function BulkAvailabilityForm() {
  const [error, action, pending] = useActionState(createBulkAvailabilityRules, null)

  return (
    <form action={action} className="space-y-5">

      {/* Day toggles */}
      <div className="space-y-1.5">
        <label className="text-xs font-medium uppercase tracking-wider text-zinc-300">
          Days
        </label>
        <div className="flex flex-wrap gap-2">
          {DAYS.map(({ label, value }) => (
            <label key={value} className="cursor-pointer select-none">
              <input
                type="checkbox"
                name="days"
                value={value}
                className="sr-only peer"
              />
              <span className="flex h-9 w-12 items-center justify-center rounded-lg border border-zinc-700 bg-zinc-800 text-sm font-medium text-zinc-400 transition-colors peer-checked:border-white peer-checked:bg-white peer-checked:text-zinc-900">
                {label}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Time range */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <label htmlFor="bulk_start_time" className="text-xs font-medium uppercase tracking-wider text-zinc-300">
            Start time
          </label>
          <input
            id="bulk_start_time"
            name="start_time"
            type="time"
            required
            className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-2.5 text-sm text-zinc-100 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/40 transition-colors"
          />
        </div>

        <div className="space-y-1.5">
          <label htmlFor="bulk_end_time" className="text-xs font-medium uppercase tracking-wider text-zinc-300">
            End time
          </label>
          <input
            id="bulk_end_time"
            name="end_time"
            type="time"
            required
            className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-2.5 text-sm text-zinc-100 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/40 transition-colors"
          />
        </div>
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
        {pending ? 'Applying…' : 'Apply to selected days'}
      </button>

    </form>
  )
}
