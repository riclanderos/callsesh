'use client'

import { useActionState, useState, useEffect, useRef } from 'react'
import { saveRecurringDay } from '@/app/actions/availability'
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

/**
 * "9 AM" for :00 slots, "9:30" for :30 slots.
 * Hour markers carry AM/PM context; half-hour slots stay terse.
 */
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
  initialSelected,
  onSaved,
}: {
  day: number
  initialSelected: string[]
  /** Called with the newly-saved slot list after each successful save. */
  onSaved: (slots: string[]) => void
}) {
  // savedSlots = what is currently persisted in the DB for this day.
  // Initialised from server data; updated locally after each successful save so
  // we never need to remount this component to re-sync with the server.
  const [savedSlots, setSavedSlots] = useState<Set<string>>(() => new Set(initialSelected))
  const [currentSlots, setCurrentSlots] = useState<Set<string>>(() => new Set(initialSelected))
  // 'saved' shows the green success state for 2 s; 'idle' is the default.
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saved'>('idle')
  const [actionError, formAction, pending] = useActionState(saveRecurringDay, null)

  const wasPending = useRef(false)
  // Single timer per DayEditor; cleared before each new save so timers never overlap.
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  // dirty = user has unsaved changes relative to what's in the DB
  const dirty = !eqSet(currentSlots, savedSlots)
  // canSave is the single source of truth for button enable/disable
  const canSave = dirty && !pending
  const isSaved = saveStatus === 'saved'

  // Detect successful save: pending flipped true → false with no error.
  // Toggles are disabled while pending, so currentSlots is stable here.
  useEffect(() => {
    if (wasPending.current && !pending) {
      if (actionError === null) {
        const saved = [...currentSlots]
        setSavedSlots(new Set(currentSlots))
        setSaveStatus('saved')
        onSaved(saved)
        // Guard against overlapping timers on repeated rapid saves
        if (timerRef.current) clearTimeout(timerRef.current)
        timerRef.current = setTimeout(() => {
          setSaveStatus('idle')
          timerRef.current = null
        }, 2000)
      }
    }
    wasPending.current = pending
  // currentSlots is intentionally excluded: it is stable during pending (toggles
  // are disabled) so the closure value is always the slots that were submitted.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pending, actionError])

  // Clean up any in-flight timer when the component is removed from the DOM.
  useEffect(() => () => { if (timerRef.current) clearTimeout(timerRef.current) }, [])

  function toggle(slot: string) {
    // Any user edit immediately cancels the success state and re-evaluates dirty.
    if (saveStatus === 'saved') {
      setSaveStatus('idle')
      if (timerRef.current) {
        clearTimeout(timerRef.current)
        timerRef.current = null
      }
    }
    setCurrentSlots((prev) => {
      const next = new Set(prev)
      next.has(slot) ? next.delete(slot) : next.add(slot)
      return next
    })
  }

  return (
    <div className="p-5 space-y-4">
      {/* Slot grid — disabled while save is in flight to prevent mid-save edits */}
      <div className="grid grid-cols-4 sm:grid-cols-6 lg:grid-cols-8 gap-1.5">
        {ALL_SLOTS.map((slot) => {
          const on = currentSlots.has(slot)
          return (
            <button
              key={slot}
              type="button"
              onClick={() => toggle(slot)}
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
        {canSave && currentSlots.size === 0 && (
          <span className="text-xs text-zinc-600">Saving will clear all slots for this day.</span>
        )}
        {actionError && (
          <span className="text-xs text-red-400">{actionError}</span>
        )}
      </form>
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
  // Tracks the current persisted slot count per day so the tab dot stays accurate
  // after saves without requiring a page re-render or component remount.
  const [savedSlotsByDay, setSavedSlotsByDay] = useState<Partial<Record<number, string[]>>>(
    () => initialSelectedByDay
  )
  // Tracks which days were recently saved for the green tab-dot feedback.
  const [recentlySaved, setRecentlySaved] = useState<Set<number>>(new Set())
  // One timer ref per day — prevents overlapping timers when the same day is saved
  // multiple times in quick succession (timer from save N-1 won't clear save N early).
  const tabTimerRefs = useRef<Partial<Record<number, ReturnType<typeof setTimeout>>>>({})

  function handleSaved(day: number, slots: string[]) {
    setSavedSlotsByDay((prev) => ({ ...prev, [day]: slots }))
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

  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-900 overflow-hidden">
      {/* Day tab strip */}
      <div className="flex border-b border-zinc-800 overflow-x-auto">
        {DAY_ORDER.map((day) => {
          const hasSavedSlots = (savedSlotsByDay[day]?.length ?? 0) > 0
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

      {/* Render all editors hidden when inactive — preserves unsaved state on tab switch.
          Stable key (day number only) prevents remounts; DayEditor owns its own state. */}
      {DAY_ORDER.map((day) => (
        <div key={day} className={activeDay === day ? '' : 'hidden'}>
          <DayEditor
            day={day}
            initialSelected={initialSelectedByDay[day] ?? []}
            onSaved={(slots) => handleSaved(day, slots)}
          />
        </div>
      ))}
    </div>
  )
}
