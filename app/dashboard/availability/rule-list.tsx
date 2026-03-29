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
  created_at: string
  rule_kind: string
}

export default function RuleList({ rules }: { rules: Rule[] }) {
  const [editingId, setEditingId] = useState<string | null>(null)

  // For each day with at least one override rule, recurring rules are overridden.
  const overrideDaySet = new Set(
    rules.filter((r) => r.rule_kind === 'override').map((r) => r.day_of_week)
  )
  const overriddenIds = new Set(
    rules
      .filter((r) => overrideDaySet.has(r.day_of_week) && r.rule_kind === 'recurring')
      .map((r) => r.id)
  )

  if (rules.length === 0) {
    return (
      <div className="rounded-xl border border-zinc-800 bg-zinc-900 px-6 py-8 text-center">
        <p className="text-sm text-zinc-500">No availability set yet. Add your first rule below.</p>
      </div>
    )
  }

  return (
    <section className="space-y-3">
      <p className="text-xs font-medium uppercase tracking-wider text-zinc-500">Your schedule</p>
      <div className="space-y-2">
        {rules.map((rule) =>
          editingId === rule.id ? (
            // ── Edit mode ───────────────────────────────────────────────────
            <div key={rule.id} className="rounded-xl border border-zinc-700 bg-zinc-900 p-5 space-y-4">
              <p className="text-sm font-medium text-zinc-100">{DAYS[rule.day_of_week]}</p>
              <form
                action={async (fd) => {
                  await updateAvailabilityRule(fd)
                  setEditingId(null)
                }}
                className="space-y-4"
              >
                <input type="hidden" name="id" value={rule.id} />
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium uppercase tracking-wider text-zinc-300">Start time</label>
                    <input
                      type="time"
                      name="start_time"
                      defaultValue={rule.start_time.slice(0, 5)}
                      required
                      className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-2 text-sm text-zinc-100 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/40 transition-colors"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium uppercase tracking-wider text-zinc-300">End time</label>
                    <input
                      type="time"
                      name="end_time"
                      defaultValue={rule.end_time.slice(0, 5)}
                      required
                      className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-2 text-sm text-zinc-100 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/40 transition-colors"
                    />
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    type="submit"
                    className="rounded-lg bg-white px-4 py-2 text-xs font-semibold text-zinc-900 hover:bg-zinc-100 transition-colors"
                  >
                    Save
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditingId(null)}
                    className="rounded-lg border border-zinc-700 px-4 py-2 text-xs text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          ) : (
            // ── Display mode ────────────────────────────────────────────────
            <div
              key={rule.id}
              className="flex items-center justify-between rounded-xl border border-zinc-800 bg-zinc-900 px-5 py-4"
            >
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <span className={`font-medium ${overriddenIds.has(rule.id) ? 'text-zinc-500' : 'text-zinc-100'}`}>
                    {DAYS[rule.day_of_week]}
                  </span>
                  {overriddenIds.has(rule.id) && (
                    <span className="rounded border border-zinc-700 px-1.5 py-0.5 text-xs text-zinc-600">
                      Overridden
                    </span>
                  )}
                  {!rule.is_active && !overriddenIds.has(rule.id) && (
                    <span className="rounded border border-zinc-700 px-1.5 py-0.5 text-xs text-zinc-500">
                      Inactive
                    </span>
                  )}
                </div>
                <p className={`text-sm ${overriddenIds.has(rule.id) ? 'text-zinc-700 line-through decoration-zinc-700' : 'text-zinc-500'}`}>
                  {formatTime(rule.start_time)} – {formatTime(rule.end_time)}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setEditingId(rule.id)}
                  className="rounded-lg border border-zinc-700 px-2.5 py-1.5 text-xs text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200 transition-colors"
                >
                  Edit
                </button>

                <form action={toggleAvailabilityRule}>
                  <input type="hidden" name="id" value={rule.id} />
                  <input type="hidden" name="is_active" value={String(rule.is_active)} />
                  <button
                    type="submit"
                    className="rounded-lg border border-zinc-700 px-2.5 py-1.5 text-xs text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200 transition-colors"
                  >
                    {rule.is_active ? 'Deactivate' : 'Activate'}
                  </button>
                </form>

                <form action={deleteAvailabilityRule}>
                  <input type="hidden" name="id" value={rule.id} />
                  <button
                    type="submit"
                    className="rounded-lg border border-zinc-700 px-2.5 py-1.5 text-xs text-red-500 hover:bg-zinc-800 hover:border-red-900 transition-colors"
                  >
                    Delete
                  </button>
                </form>
              </div>
            </div>
          )
        )}
      </div>
    </section>
  )
}
