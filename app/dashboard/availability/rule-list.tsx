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

function timeToMinutes(t: string): number {
  const [h, m] = t.split(':').map(Number)
  return h * 60 + m
}

function minutesToTime(mins: number): string {
  const h = Math.floor(mins / 60)
  const m = mins % 60
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`
}

type TimeRange = { start: number; end: number }

/**
 * Subtracts blocked ranges from a single availability range.
 * Returns the remaining contiguous windows, in order.
 * Handles multiple overlapping breaks correctly.
 */
function subtractBreaks(range: TimeRange, breaks: TimeRange[]): TimeRange[] {
  let result: TimeRange[] = [range]
  for (const brk of breaks) {
    const next: TimeRange[] = []
    for (const r of result) {
      if (brk.end <= r.start || brk.start >= r.end) {
        // No overlap — keep as-is
        next.push(r)
      } else {
        // Partial or full overlap — emit up to two sub-ranges
        if (brk.start > r.start) next.push({ start: r.start, end: brk.start })
        if (brk.end < r.end)   next.push({ start: brk.end,   end: r.end   })
        // If break covers the whole range, nothing is added (range disappears)
      }
    }
    result = next
  }
  return result
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

type Break = {
  day_of_week: number | null
  start_time: string
  end_time: string
}

function EditForm({ rule, onCancel }: { rule: Rule; onCancel: () => void }) {
  return (
    <div className="rounded-lg border border-zinc-700 bg-zinc-800/50 p-4 space-y-3">
      <form
        action={async (fd) => {
          await updateAvailabilityRule(fd)
          onCancel()
        }}
        className="space-y-3"
      >
        <input type="hidden" name="id" value={rule.id} />
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1">
            <label className="text-xs font-medium uppercase tracking-wider text-zinc-400">Start</label>
            <input
              type="time"
              name="start_time"
              defaultValue={rule.start_time.slice(0, 5)}
              required
              className="w-full rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm text-zinc-100 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/40 transition-colors"
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-medium uppercase tracking-wider text-zinc-400">End</label>
            <input
              type="time"
              name="end_time"
              defaultValue={rule.end_time.slice(0, 5)}
              required
              className="w-full rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm text-zinc-100 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/40 transition-colors"
            />
          </div>
        </div>
        <div className="flex gap-2">
          <button
            type="submit"
            className="rounded-lg bg-white px-3 py-1.5 text-xs font-semibold text-zinc-900 hover:bg-zinc-100 transition-colors"
          >
            Save
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="rounded-lg border border-zinc-700 px-3 py-1.5 text-xs text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200 transition-colors"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  )
}

function RuleRow({
  rule,
  isOverridden,
  effectiveWindows,
  editingId,
  setEditingId,
}: {
  rule: Rule
  isOverridden: boolean
  effectiveWindows: TimeRange[]
  editingId: string | null
  setEditingId: (id: string | null) => void
}) {
  if (editingId === rule.id) {
    return <EditForm rule={rule} onCancel={() => setEditingId(null)} />
  }

  return (
    <div className={`flex items-center justify-between py-2.5 ${isOverridden ? 'opacity-40' : ''}`}>
      <div className="flex items-start gap-2.5 min-w-0">
        <div className="space-y-0.5">
          {effectiveWindows.length === 0 ? (
            <span className="text-sm text-zinc-600">Fully blocked</span>
          ) : (
            effectiveWindows.map((w, i) => (
              <span
                key={i}
                className={`block text-sm tabular-nums ${
                  isOverridden ? 'line-through text-zinc-500' : 'text-zinc-200'
                }`}
              >
                {formatTime(minutesToTime(w.start))} – {formatTime(minutesToTime(w.end))}
              </span>
            ))
          )}
        </div>
        {isOverridden && (
          <span className="shrink-0 rounded border border-zinc-700 px-1.5 py-0.5 text-xs text-zinc-600 mt-0.5">
            Overridden
          </span>
        )}
        {!rule.is_active && !isOverridden && (
          <span className="shrink-0 rounded border border-zinc-700 px-1.5 py-0.5 text-xs text-zinc-500 mt-0.5">
            Inactive
          </span>
        )}
      </div>

      <div className="flex items-center gap-1 ml-4 shrink-0">
        <button
          type="button"
          onClick={() => setEditingId(rule.id)}
          className="rounded px-2 py-1 text-xs text-zinc-500 hover:bg-zinc-800 hover:text-zinc-300 transition-colors"
        >
          Edit
        </button>

        <form action={toggleAvailabilityRule}>
          <input type="hidden" name="id" value={rule.id} />
          <input type="hidden" name="is_active" value={String(rule.is_active)} />
          <button
            type="submit"
            className="rounded px-2 py-1 text-xs text-zinc-600 hover:bg-zinc-800 hover:text-zinc-400 transition-colors"
          >
            {rule.is_active ? 'Deactivate' : 'Activate'}
          </button>
        </form>

        <form action={deleteAvailabilityRule}>
          <input type="hidden" name="id" value={rule.id} />
          <button
            type="submit"
            className="rounded px-2 py-1 text-xs text-zinc-700 hover:bg-zinc-800 hover:text-red-500 transition-colors"
          >
            Delete
          </button>
        </form>
      </div>
    </div>
  )
}

export default function RuleList({ rules, breaks }: { rules: Rule[]; breaks: Break[] }) {
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

  // Index recurring breaks by day_of_week.
  // Specific-date breaks (day_of_week === null) only affect individual dates and are
  // not shown in the weekly schedule display.
  const breaksByDay = new Map<number, TimeRange[]>()
  for (const b of breaks) {
    if (b.day_of_week === null) continue
    const dayBreaks = breaksByDay.get(b.day_of_week) ?? []
    dayBreaks.push({ start: timeToMinutes(b.start_time), end: timeToMinutes(b.end_time) })
    breaksByDay.set(b.day_of_week, dayBreaks)
  }

  if (rules.length === 0) {
    return (
      <div className="rounded-xl border border-zinc-800 bg-zinc-900 px-6 py-8 text-center">
        <p className="text-sm text-zinc-500">No availability set yet. Add your first rule below.</p>
      </div>
    )
  }

  // Group rules by day_of_week, preserving sort order (day asc, start_time asc from server query).
  const byDay = new Map<number, Rule[]>()
  for (const rule of rules) {
    const existing = byDay.get(rule.day_of_week) ?? []
    existing.push(rule)
    byDay.set(rule.day_of_week, existing)
  }
  const sortedDays = Array.from(byDay.keys()).sort((a, b) => a - b)

  return (
    <section className="space-y-3">
      <p className="text-xs font-medium uppercase tracking-wider text-zinc-500">Your schedule</p>
      <div className="rounded-xl border border-zinc-800 bg-zinc-900 divide-y divide-zinc-800">
        {sortedDays.map((day) => {
          const dayRules = byDay.get(day)!
          const active = dayRules.filter((r) => !overriddenIds.has(r.id))
          const overridden = dayRules.filter((r) => overriddenIds.has(r.id))
          const dayBreaks = breaksByDay.get(day) ?? []

          return (
            <div key={day} className="px-5 py-4 space-y-1">
              {/* Day label */}
              <p className="text-xs font-semibold uppercase tracking-wider text-zinc-500 mb-2">
                {DAYS[day]}
              </p>

              {/* Active rows — display effective windows after break subtraction */}
              <div className="divide-y divide-zinc-800/60">
                {active.map((rule) => {
                  const ruleRange: TimeRange = {
                    start: timeToMinutes(rule.start_time),
                    end: timeToMinutes(rule.end_time),
                  }
                  // Only subtract breaks from active rules; inactive rules show raw range.
                  const effectiveWindows = rule.is_active
                    ? subtractBreaks(ruleRange, dayBreaks)
                    : [ruleRange]
                  return (
                    <RuleRow
                      key={rule.id}
                      rule={rule}
                      isOverridden={false}
                      effectiveWindows={effectiveWindows}
                      editingId={editingId}
                      setEditingId={setEditingId}
                    />
                  )
                })}
              </div>

              {/* Overridden rows — show raw range, no break subtraction needed */}
              {overridden.length > 0 && (
                <div className="mt-1 divide-y divide-zinc-800/40">
                  {overridden.map((rule) => (
                    <RuleRow
                      key={rule.id}
                      rule={rule}
                      isOverridden={true}
                      effectiveWindows={[{
                        start: timeToMinutes(rule.start_time),
                        end: timeToMinutes(rule.end_time),
                      }]}
                      editingId={editingId}
                      setEditingId={setEditingId}
                    />
                  ))}
                </div>
              )}
            </div>
          )
        })}
      </div>
    </section>
  )
}
