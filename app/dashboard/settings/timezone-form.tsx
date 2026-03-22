'use client'

import { useActionState } from 'react'
import { updateTimezone } from '@/app/actions/profile'

// Curated list of common IANA timezone names.
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
      <div className="space-y-1">
        <label htmlFor="timezone" className="text-sm font-medium">
          Your timezone
        </label>
        <select
          id="timezone"
          name="timezone"
          defaultValue={currentTimezone}
          className="w-full rounded border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-black"
        >
          {TIMEZONES.map((tz) => (
            <option key={tz} value={tz}>
              {tz}
            </option>
          ))}
        </select>
        <p className="text-xs text-zinc-400">
          All your availability times and bookings are shown in this timezone.
        </p>
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <button
        type="submit"
        disabled={pending}
        className="rounded bg-black px-4 py-2 text-sm font-medium text-white disabled:opacity-50"
      >
        {pending ? 'Saving…' : 'Save timezone'}
      </button>
    </form>
  )
}
