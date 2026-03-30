'use client'

import { useActionState, useState, useEffect, useRef } from 'react'
import { saveRecurringDay, saveBulkRecurringDays } from '@/app/actions/availability'
import { allPickerSlots } from '@/lib/availability'

const ALL_SLOTS = allPickerSlots()

// Display order: Mon → Sun
const DAY_ORDER = [1, 2, 3, 4, 5, 6, 0]

const DAY_SHORT: Record<number, string> = {
  0: 'Sun', 1: 'Mon', 2: 'Tue', 3: 'Wed', 4: 'Thu', 5: 'Fri', 6: 'Sat',
}
const DAY_FULL: Record<number, string> = {
  0: 'Sunday', 1: 'Monday', 2: 'Tuesday', 3: 'Wednesday',
  4: 'Thursday', 5: 'Friday', 6: 'Saturday',
}

function formatSlot(t: string): string {
  const [h, m] = t.split(':').map(Number)
  const hour = h % 12 || 12
  if (m === 0) return `${hour} ${h >= 12 ? 'PM' : 'AM'}`
  return `${hour}:${String(m).padStart(2, '0')}`
}

function eqSet(a: Set<string>, b: Set<string>): boolean {
  if (a.size !== b.size) return false
  for (const v of a) if (!b.has(v)) return false
  return true
}

// ─── Per-day editor ────────────────────────────────────────────────────────────

function DayEditor({
  day,
  currentSlots,
  onToggle,
  savedSlots,
  onSaved,
  onRevert,
  otherDays,
  onBulkSaved,
}: {
  day: number
  /** Controlled by SlotPicker so copy/revert can write to any day without a remount. */
  currentSlots: Set<string>
  onToggle: (slot: string) => void
  /**
   * The last-saved slot set for this day, owned by SlotPicker so it remains
   * accurate after saves and can be used as the revert target.
   */
  savedSlots: Set<string>
  onSaved: (slots: string[]) => void
  onRevert: () => void
  /** Other days available as copy targets, with their DB-saved slot state. */
  otherDays: { day: number; label: string; hasSavedSlots: boolean }[]
  /** Called after a successful bulk save with the days that were saved. */
  onBulkSaved: (savedDays: number[], slots: string[]) => void
}) {
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saved'>('idle')
  const [actionError, formAction, pending] = useActionState(saveRecurringDay, null)
  const wasPending = useRef(false)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  // Copy panel state
  const [copyOpen, setCopyOpen] = useState(false)
  const [copyTargets, setCopyTargets] = useState<Set<number>>(new Set())
  const [bulkPending, setBulkPending] = useState(false)
  const [bulkSaved, setBulkSaved] = useState<number[]>([])
  const [bulkErrors, setBulkErrors] = useState<{ day: number; error: string }[]>([])
  const bulkTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const dirty = !eqSet(currentSlots, savedSlots)
  const canSave = dirty && !pending
  const isSaved = saveStatus === 'saved'

  const conflictingCount = [...copyTargets].filter(
    (d) => otherDays.find((od) => od.day === d)?.hasSavedSlots
  ).length

  // Serialize current slots for stable effect dependency.
  const slotKey = [...currentSlots].sort().join(',')

  // Clear saved status whenever the slot selection changes (toggle, copy, or revert).
  useEffect(() => {
    setSaveStatus((prev) => {
      if (prev === 'saved') {
        if (timerRef.current) {
          clearTimeout(timerRef.current)
          timerRef.current = null
        }
        return 'idle'
      }
      return prev
    })
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slotKey])

  // Detect successful save: pending flipped true → false with no error.
  useEffect(() => {
    if (wasPending.current && !pending) {
      if (actionError === null) {
        setSaveStatus('saved')
        onSaved([...currentSlots])
        if (timerRef.current) clearTimeout(timerRef.current)
        timerRef.current = setTimeout(() => {
          setSaveStatus('idle')
          timerRef.current = null
        }, 2000)
      }
    }
    wasPending.current = pending
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pending, actionError])

  useEffect(() => () => {
    if (timerRef.current) clearTimeout(timerRef.current)
    if (bulkTimerRef.current) clearTimeout(bulkTimerRef.current)
  }, [])

  async function handleCopyAndSave() {
    if (copyTargets.size === 0 || bulkPending) return
    setBulkPending(true)
    setBulkSaved([])
    setBulkErrors([])
    try {
      const { saved, failed } = await saveBulkRecurringDays([...copyTargets], [...currentSlots])
      setBulkSaved(saved)
      setBulkErrors(failed)
      if (saved.length > 0) {
        onBulkSaved(saved, [...currentSlots])
        if (failed.length === 0) {
          // Full success: auto-close after 2s
          if (bulkTimerRef.current) clearTimeout(bulkTimerRef.current)
          bulkTimerRef.current = setTimeout(() => {
            setCopyOpen(false)
            setCopyTargets(new Set())
            setBulkSaved([])
            bulkTimerRef.current = null
          }, 2000)
        }
      }
    } catch (e) {
      setBulkErrors([{ day: -1, error: e instanceof Error ? e.message : 'Unknown error' }])
    } finally {
      setBulkPending(false)
    }
  }

  return (
    <div className="p-5 space-y-4">
      {/* Slot grid — disabled while save is in flight */}
      <div className="grid grid-cols-4 sm:grid-cols-6 lg:grid-cols-8 gap-1.5">
        {ALL_SLOTS.map((slot) => {
          const on = currentSlots.has(slot)
          return (
            <button
              key={slot}
              type="button"
              onClick={() => onToggle(slot)}
              disabled={pending}
              className={`rounded-md py-2 text-xs font-medium transition-colors select-none disabled:pointer-events-none disabled:opacity-50 ${
                on
                  ? 'bg-white text-zinc-900'
                  : 'bg-zinc-800 text-zinc-500 hover:bg-zinc-700 hover:text-zinc-300'
              }`}
            >
              {formatSlot(slot)}
            </button>
          )
        })}
      </div>

      {/* Save row */}
      <form action={formAction} className="flex items-center gap-3 flex-wrap">
        <input type="hidden" name="day_of_week" value={day} />
        {[...currentSlots].map((slot) => (
          <input key={slot} type="hidden" name="slots" value={slot} />
        ))}
        <button
          type="submit"
          disabled={!canSave}
          className={`rounded-lg px-4 py-2 text-xs font-semibold transition-colors ${
            isSaved
              ? 'bg-green-600 text-white cursor-default'
              : canSave
              ? 'bg-white text-zinc-900 hover:bg-zinc-100'
              : 'bg-zinc-800 text-zinc-600 cursor-default'
          }`}
        >
          {pending ? 'Saving…' : isSaved ? 'Saved ✓' : `Save ${DAY_FULL[day]}`}
        </button>

        {/* Revert — only visible when there are unsaved changes */}
        {dirty && !pending && (
          <button
            type="button"
            onClick={onRevert}
            className="text-xs text-zinc-400 hover:text-zinc-300 transition-colors"
          >
            Revert
          </button>
        )}

        {canSave && currentSlots.size === 0 && (
          <span className="text-xs text-zinc-600">Saving will clear all slots for this day.</span>
        )}
        {/* Hide the error once the user has reverted (dirty=false means no pending change) */}
        {actionError && dirty && (
          <span className="text-xs text-red-400">{actionError}</span>
        )}
      </form>

      {/* Copy to other days — only shown when this day has slots to copy */}
      {currentSlots.size > 0 && (
        <div className="pt-1 border-t border-zinc-800/60">
          {!copyOpen ? (
            <button
              type="button"
              onClick={() => {
                setCopyOpen(true)
                setBulkSaved([])
                setBulkErrors([])
              }}
              className="text-xs text-zinc-400 hover:text-zinc-300 transition-colors"
            >
              Copy to other days →
            </button>
          ) : (
            <div className="space-y-3">
              <p className="text-xs text-zinc-500">Copy these slots to:</p>

              {/* Target day pills */}
              <div className="flex flex-wrap gap-1.5">
                {otherDays.map(({ day: d, label, hasSavedSlots }) => {
                  const selected = copyTargets.has(d)
                  const wasSaved = bulkSaved.includes(d)
                  return (
                    <button
                      key={d}
                      type="button"
                      disabled={bulkPending}
                      onClick={() =>
                        setCopyTargets((prev) => {
                          const next = new Set(prev)
                          next.has(d) ? next.delete(d) : next.add(d)
                          return next
                        })
                      }
                      className={`rounded-md px-3 py-1.5 text-xs font-medium transition-colors disabled:pointer-events-none disabled:opacity-60 ${
                        wasSaved
                          ? 'bg-green-700/60 text-green-300'
                          : selected
                          ? 'bg-indigo-600 text-white'
                          : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700 hover:text-zinc-200'
                      }`}
                    >
                      {label}
                      {/* Dot indicates this day already has saved DB slots */}
                      {hasSavedSlots && !wasSaved && (
                        <span className={`ml-1.5 inline-block h-1 w-1 rounded-full align-middle ${selected ? 'bg-indigo-300' : 'bg-zinc-500'}`} />
                      )}
                    </button>
                  )
                })}
              </div>

              {/* Overwrite warning — shown when ≥1 selected target already has saved DB slots */}
              {copyTargets.size > 0 && conflictingCount > 0 && bulkSaved.length === 0 && (
                <p className="text-xs text-amber-500/90">
                  {conflictingCount === 1 ? '1 day' : `${conflictingCount} days`} already{' '}
                  {conflictingCount === 1 ? 'has' : 'have'} saved slots and will be replaced.
                </p>
              )}

              {/* Success feedback */}
              {bulkSaved.length > 0 && (
                <p className="text-xs text-green-400">
                  Saved to {bulkSaved.map((d) => DAY_SHORT[d]).join(', ')} ✓
                  {bulkErrors.length > 0 && ' — some days failed (see below)'}
                </p>
              )}

              {/* Per-day error feedback */}
              {bulkErrors.map((e) => (
                <p key={e.day} className="text-xs text-red-400">
                  {e.day === -1 ? 'Error' : DAY_FULL[e.day]}: {e.error}
                </p>
              ))}

              {/* Actions */}
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  disabled={copyTargets.size === 0 || bulkPending}
                  onClick={handleCopyAndSave}
                  className="rounded-lg bg-indigo-600 px-4 py-1.5 text-xs font-semibold text-white hover:bg-indigo-500 disabled:opacity-40 disabled:pointer-events-none transition-colors"
                >
                  {bulkPending
                    ? 'Saving…'
                    : conflictingCount > 0 && copyTargets.size > 0
                    ? 'Replace & Save'
                    : 'Copy & Save'}
                </button>
                <button
                  type="button"
                  disabled={bulkPending}
                  onClick={() => {
                    setCopyOpen(false)
                    setCopyTargets(new Set())
                    setBulkSaved([])
                    setBulkErrors([])
                    if (bulkTimerRef.current) {
                      clearTimeout(bulkTimerRef.current)
                      bulkTimerRef.current = null
                    }
                  }}
                  className="text-xs text-zinc-500 hover:text-zinc-300 transition-colors disabled:opacity-40 disabled:pointer-events-none"
                >
                  {bulkSaved.length > 0 && bulkErrors.length === 0 ? 'Close' : 'Cancel'}
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

// ─── Weekly picker (tabbed) ────────────────────────────────────────────────────

export default function SlotPicker({
  initialSelectedByDay,
}: {
  initialSelectedByDay: Partial<Record<number, string[]>>
}) {
  const [activeDay, setActiveDay] = useState(1) // default to Monday

  // currentSlotsByDay is lifted here so copy/revert can write to any day without a remount.
  const [currentSlotsByDay, setCurrentSlotsByDay] = useState<Record<number, Set<string>>>(() => {
    const init: Record<number, Set<string>> = {}
    for (const day of DAY_ORDER) {
      init[day] = new Set(initialSelectedByDay[day] ?? [])
    }
    return init
  })

  // savedSlotsByDay is the single source of truth for what is persisted in the DB.
  const [savedSlotsByDay, setSavedSlotsByDay] = useState<Record<number, Set<string>>>(() => {
    const init: Record<number, Set<string>> = {}
    for (const day of DAY_ORDER) {
      init[day] = new Set(initialSelectedByDay[day] ?? [])
    }
    return init
  })

  const [recentlySaved, setRecentlySaved] = useState<Set<number>>(new Set())
  const tabTimerRefs = useRef<Partial<Record<number, ReturnType<typeof setTimeout>>>>({})

  function handleToggle(day: number, slot: string) {
    setCurrentSlotsByDay((prev) => {
      const next = new Set(prev[day])
      next.has(slot) ? next.delete(slot) : next.add(slot)
      return { ...prev, [day]: next }
    })
  }

  /** Restores the current slot selection for one day to its last-saved state. */
  function handleRevert(day: number) {
    setCurrentSlotsByDay((prev) => ({
      ...prev,
      [day]: new Set(savedSlotsByDay[day]),
    }))
  }

  /** Marks a day as saved — updates savedSlotsByDay and triggers the tab dot animation. */
  function markSaved(day: number, slots: string[]) {
    const saved = new Set(slots)
    setSavedSlotsByDay((prev) => ({ ...prev, [day]: saved }))
    setRecentlySaved((prev) => new Set([...prev, day]))
    if (tabTimerRefs.current[day]) clearTimeout(tabTimerRefs.current[day]!)
    tabTimerRefs.current[day] = setTimeout(() => {
      setRecentlySaved((prev) => {
        const next = new Set(prev)
        next.delete(day)
        return next
      })
      delete tabTimerRefs.current[day]
    }, 2000)
  }

  function handleSaved(day: number, slots: string[]) {
    markSaved(day, slots)
  }

  /** Called after a successful bulk save to update both current and saved state. */
  function handleBulkSaved(savedDays: number[], slots: string[]) {
    setCurrentSlotsByDay((prev) => {
      const next = { ...prev }
      for (const day of savedDays) {
        next[day] = new Set(slots)
      }
      return next
    })
    for (const day of savedDays) {
      markSaved(day, slots)
    }
  }

  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-900 overflow-hidden">
      {/* Day tab strip */}
      <div className="flex border-b border-zinc-800 overflow-x-auto">
        {DAY_ORDER.map((day) => {
          const hasSavedSlots = savedSlotsByDay[day].size > 0
          const justSaved = recentlySaved.has(day)
          const isActive = activeDay === day
          return (
            <button
              key={day}
              type="button"
              onClick={() => setActiveDay(day)}
              className={`relative flex-1 min-w-[52px] py-3 text-xs font-medium transition-colors ${
                isActive
                  ? 'text-zinc-100 bg-zinc-800/60'
                  : 'text-zinc-500 hover:text-zinc-300'
              }`}
            >
              {DAY_SHORT[day]}
              {(hasSavedSlots || justSaved) && (
                <span
                  className={`absolute top-2 right-1.5 h-1.5 w-1.5 rounded-full transition-colors ${
                    justSaved
                      ? 'bg-green-500'
                      : isActive
                      ? 'bg-indigo-400'
                      : 'bg-indigo-600'
                  }`}
                />
              )}
            </button>
          )
        })}
      </div>

      {/* All editors rendered; inactive ones are hidden to preserve unsaved state */}
      {DAY_ORDER.map((day) => {
        const otherDays = DAY_ORDER.filter((d) => d !== day).map((d) => ({
          day: d,
          label: DAY_SHORT[d],
          // hasSavedSlots reflects DB-persisted state so the overwrite warning
          // and indicator accurately signal what would be replaced on disk.
          hasSavedSlots: savedSlotsByDay[d].size > 0,
        }))
        return (
          <div key={day} className={activeDay === day ? '' : 'hidden'}>
            <DayEditor
              day={day}
              currentSlots={currentSlotsByDay[day]}
              onToggle={(slot) => handleToggle(day, slot)}
              savedSlots={savedSlotsByDay[day]}
              onSaved={(slots) => handleSaved(day, slots)}
              onRevert={() => handleRevert(day)}
              otherDays={otherDays}
              onBulkSaved={handleBulkSaved}
            />
          </div>
        )
      })}
    </div>
  )
}
