'use client'

import { useActionState } from 'react'
import { updateTimezone } from '@/app/actions/profile'

const TIMEZONES = [
  'Pacific/Honolulu',
  'America/Anchorage',
  'America/Los_Angeles',
  'America/Denver',
  'America/Chicago',
  'America/New_York',
  'America/Halifax',
  'America/Sao_Paulo',
  'Europe/London',
  'Europe/Paris',
  'Europe/Berlin',
  'Europe/Helsinki',
  'Europe/Moscow',
  'Asia/Dubai',
  'Asia/Kolkata',
  'Asia/Bangkok',
  'Asia/Singapore',
  'Asia/Tokyo',
  'Australia/Perth',
  'Australia/Sydney',
  'Pacific/Auckland',
  'UTC',
]

export default function TimezoneForm({ currentTimezone }: { currentTimezone: string }) {
  const [error, action, pending] = useActionState(updateTimezone, null)

  return (
    <form action={action} className="space-y-4">
      <div className="space-y-1.5">
        <label htmlFor="timezone" className="text-xs font-medium uppercase tracking-wider text-zinc-300">
          Your timezone
        </label>
        <select
          id="timezone"
          name="timezone"
          defaultValue={currentTimezone}
          className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-2.5 text-sm text-zinc-100 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/40 transition-colors"
        >
          {TIMEZONES.map((tz) => (
            <option key={tz} value={tz} className="bg-zinc-800 text-zinc-100">
              {tz}
            </option>
          ))}
        </select>
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
        {pending ? 'Saving…' : 'Save timezone'}
      </button>
    </form>
  )
}
