'use client'

import { useActionState, useState } from 'react'
import { createBlockedTime } from '@/app/actions/availability'

const DAYS = [
  { label: 'Sun', value: 0 },
  { label: 'Mon', value: 1 },
  { label: 'Tue', value: 2 },
  { label: 'Wed', value: 3 },
  { label: 'Thu', value: 4 },
  { label: 'Fri', value: 5 },
  { label: 'Sat', value: 6 },
]

const inputCls =
  'w-full rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-2.5 text-sm text-zinc-100 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/40 transition-colors'

const labelCls = 'text-xs font-medium uppercase tracking-wider text-zinc-300'

export default function BreakForm() {
  const [error, action, pending] = useActionState(createBlockedTime, null)
  const [breakType, setBreakType] = useState<'recurring' | 'specific'>('recurring')

  return (
    <form action={action} className="space-y-5">
      <input type="hidden" name="break_type" value={breakType} />

      {/* Type toggle */}
      <div className="flex gap-1 rounded-lg border border-zinc-700 bg-zinc-800 p-1 w-fit">
        <button
          type="button"
          onClick={() => setBreakType('recurring')}
          className={`rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
            breakType === 'recurring'
              ? 'bg-white text-zinc-900'
              : 'text-zinc-400 hover:text-zinc-200'
          }`}
        >
          Weekly (by day)
        </button>
        <button
          type="button"
          onClick={() => setBreakType('specific')}
          className={`rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
            breakType === 'specific'
              ? 'bg-white text-zinc-900'
              : 'text-zinc-400 hover:text-zinc-200'
          }`}
        >
          Specific date
        </button>
      </div>

      {/* Recurring: day checkboxes */}
      {breakType === 'recurring' && (
        <div className="space-y-1.5">
          <label className={labelCls}>Days</label>
          <div className="flex flex-wrap gap-2">
            {DAYS.map(({ label, value }) => (
              <label key={value} className="cursor-pointer select-none">
                <input type="checkbox" name="days" value={value} className="sr-only peer" />
                <span className="flex h-9 w-12 items-center justify-center rounded-lg border border-zinc-700 bg-zinc-800 text-sm font-medium text-zinc-400 transition-colors peer-checked:border-white peer-checked:bg-white peer-checked:text-zinc-900">
                  {label}
                </span>
              </label>
            ))}
          </div>
        </div>
      )}

      {/* Specific: date picker */}
      {breakType === 'specific' && (
        <div className="space-y-1.5">
          <label htmlFor="specific_date" className={labelCls}>Date</label>
          <input
            id="specific_date"
            name="specific_date"
            type="date"
            required
            className={inputCls}
          />
        </div>
      )}

      {/* Time range */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <label htmlFor="break_start_time" className={labelCls}>Start time</label>
          <input
            id="break_start_time"
            name="start_time"
            type="time"
            required
            className={inputCls}
          />
        </div>
        <div className="space-y-1.5">
          <label htmlFor="break_end_time" className={labelCls}>End time</label>
          <input
            id="break_end_time"
            name="end_time"
            type="time"
            required
            className={inputCls}
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
        {pending ? 'Saving…' : 'Add break'}
      </button>
    </form>
  )
}
