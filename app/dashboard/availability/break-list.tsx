'use client'

import { deleteBlockedTime } from '@/app/actions/availability'

const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

function formatTime(t: string): string {
  const [h, m] = t.split(':').map(Number)
  const period = h >= 12 ? 'PM' : 'AM'
  const hour = h % 12 || 12
  return `${hour}:${String(m).padStart(2, '0')} ${period}`
}

function formatDate(d: string): string {
  // d is YYYY-MM-DD from Postgres date column
  const [y, mo, day] = d.slice(0, 10).split('-').map(Number)
  return new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric' }).format(
    new Date(y, mo - 1, day)
  )
}

export type BlockedTime = {
  id: string
  day_of_week: number | null
  specific_date: string | null
  start_time: string
  end_time: string
}

export default function BreakList({ breaks }: { breaks: BlockedTime[] }) {
  if (breaks.length === 0) {
    return (
      <p className="text-sm text-zinc-600">No breaks added yet.</p>
    )
  }

  const recurring = breaks.filter((b) => b.day_of_week !== null)
  const specific  = breaks.filter((b) => b.specific_date !== null)

  // Group recurring by day_of_week for display
  const byDay = new Map<number, BlockedTime[]>()
  for (const b of recurring) {
    const day = b.day_of_week!
    const existing = byDay.get(day) ?? []
    existing.push(b)
    byDay.set(day, existing)
  }
  const sortedDays = Array.from(byDay.keys()).sort((a, z) => a - z)

  return (
    <div className="space-y-4">
      {sortedDays.length > 0 && (
        <div className="space-y-1">
          <p className="text-xs font-medium uppercase tracking-wider text-zinc-600">Weekly</p>
          <div className="rounded-xl border border-zinc-800 bg-zinc-900 divide-y divide-zinc-800">
            {sortedDays.map((day) =>
              byDay.get(day)!.map((b) => (
                <BreakRow key={b.id} label={DAYS[day]} block={b} />
              ))
            )}
          </div>
        </div>
      )}

      {specific.length > 0 && (
        <div className="space-y-1">
          <p className="text-xs font-medium uppercase tracking-wider text-zinc-600">One-time</p>
          <div className="rounded-xl border border-zinc-800 bg-zinc-900 divide-y divide-zinc-800">
            {specific
              .sort((a, z) => (a.specific_date! < z.specific_date! ? -1 : 1))
              .map((b) => (
                <BreakRow key={b.id} label={formatDate(b.specific_date!)} block={b} />
              ))}
          </div>
        </div>
      )}
    </div>
  )
}

function BreakRow({ label, block }: { label: string; block: BlockedTime }) {
  return (
    <div className="flex items-center justify-between px-4 py-3">
      <div className="space-y-0.5">
        <p className="text-xs font-medium text-zinc-400">{label}</p>
        <p className="text-sm text-zinc-200 tabular-nums">
          {formatTime(block.start_time)} – {formatTime(block.end_time)}
        </p>
      </div>
      <form action={deleteBlockedTime}>
        <input type="hidden" name="id" value={block.id} />
        <button
          type="submit"
          className="rounded px-2 py-1 text-xs text-zinc-600 hover:bg-zinc-800 hover:text-red-500 transition-colors"
        >
          Remove
        </button>
      </form>
    </div>
  )
}
