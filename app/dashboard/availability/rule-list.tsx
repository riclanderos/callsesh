'use client'

import { useState } from 'react'
import {
  updateAvailabilityRule,
  toggleAvailabilityRule,
  deleteAvailabilityRule,
} from '@/app/actions/availability'

const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

function formatTime(t: string): string {
  const [h, m] = t.split(':').map(Number)
  const period = h >= 12 ? 'PM' : 'AM'
  const hour = h % 12 || 12
  return `${hour}:${String(m).padStart(2, '0')} ${period}`
}

export type Rule = {
  id: string
  day_of_week: number
  start_time: string
  end_time: string
  is_active: boolean
}

export default function RuleList({ rules }: { rules: Rule[] }) {
  const [editingId, setEditingId] = useState<string | null>(null)

  if (rules.length === 0) {
    return (
      <p className="text-sm text-zinc-400">
        No availability set yet. Add your first rule below.
      </p>
    )
  }

  return (
    <div className="space-y-2">
      {rules.map((rule) =>
        editingId === rule.id ? (
          // ── Edit mode ────────────────────────────────────────────────────
          <div key={rule.id} className="rounded-lg border p-4 space-y-3">
            <p className="text-sm font-medium">{DAYS[rule.day_of_week]}</p>
            <form
              action={async (fd) => {
                await updateAvailabilityRule(fd)
                setEditingId(null)
              }}
              className="space-y-3"
            >
              <input type="hidden" name="id" value={rule.id} />
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs text-zinc-500">Start time</label>
                  <input
                    type="time"
                    name="start_time"
                    defaultValue={rule.start_time.slice(0, 5)}
                    required
                    className="w-full rounded border px-2 py-1.5 text-sm outline-none focus:ring-2 focus:ring-black"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs text-zinc-500">End time</label>
                  <input
                    type="time"
                    name="end_time"
                    defaultValue={rule.end_time.slice(0, 5)}
                    required
                    className="w-full rounded border px-2 py-1.5 text-sm outline-none focus:ring-2 focus:ring-black"
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  type="submit"
                  className="rounded bg-black px-3 py-1.5 text-xs font-medium text-white"
                >
                  Save
                </button>
                <button
                  type="button"
                  onClick={() => setEditingId(null)}
                  className="rounded border px-3 py-1.5 text-xs"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        ) : (
          // ── Display mode ─────────────────────────────────────────────────
          <div
            key={rule.id}
            className="flex items-center justify-between rounded-lg border p-4"
          >
            <div className="space-y-0.5">
              <div className="flex items-center gap-2">
                <span className="font-medium">{DAYS[rule.day_of_week]}</span>
                {!rule.is_active && (
                  <span className="rounded border px-1.5 py-0.5 text-xs text-zinc-400">
                    Inactive
                  </span>
                )}
              </div>
              <p className="text-sm text-zinc-500">
                {formatTime(rule.start_time)} – {formatTime(rule.end_time)}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setEditingId(rule.id)}
                className="rounded border px-2.5 py-1 text-xs hover:bg-zinc-50"
              >
                Edit
              </button>

              <form action={toggleAvailabilityRule}>
                <input type="hidden" name="id" value={rule.id} />
                <input type="hidden" name="is_active" value={String(rule.is_active)} />
                <button
                  type="submit"
                  className="rounded border px-2.5 py-1 text-xs hover:bg-zinc-50"
                >
                  {rule.is_active ? 'Deactivate' : 'Activate'}
                </button>
              </form>

              <form action={deleteAvailabilityRule}>
                <input type="hidden" name="id" value={rule.id} />
                <button
                  type="submit"
                  className="rounded border px-2.5 py-1 text-xs text-red-600 hover:bg-red-50"
                >
                  Delete
                </button>
              </form>
            </div>
          </div>
        )
      )}
    </div>
  )
}
