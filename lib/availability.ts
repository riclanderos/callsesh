/** Step size for the slot picker, in minutes. */
export const SLOT_STEP = 30

/** Earliest slot start (inclusive), in minutes since midnight — 6:00 AM. */
export const SLOT_RANGE_START = 6 * 60

/** Latest slot end (exclusive), in minutes since midnight — 10:00 PM. */
export const SLOT_RANGE_END = 22 * 60

function timeToMinutes(t: string): number {
  const [h, m] = t.split(':').map(Number)
  return h * 60 + m
}

function minutesToTime(mins: number): string {
  const h = Math.floor(mins / 60)
  const m = mins % 60
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`
}

/**
 * All 30-minute slot start times within the picker range, as "HH:MM" strings.
 * ["06:00", "06:30", ..., "21:30"]
 */
export function allPickerSlots(): string[] {
  const slots: string[] = []
  for (let m = SLOT_RANGE_START; m < SLOT_RANGE_END; m += SLOT_STEP) {
    slots.push(minutesToTime(m))
  }
  return slots
}

/**
 * Converts a list of selected 30-minute slot start times into contiguous time ranges.
 * Non-contiguous gaps produce separate ranges.
 *
 * ["09:00", "09:30", "10:00", "14:00"] →
 *   [{start_time:"09:00", end_time:"10:30"}, {start_time:"14:00", end_time:"14:30"}]
 */
export function slotsToRanges(
  selected: string[]
): { start_time: string; end_time: string }[] {
  if (selected.length === 0) return []

  const sorted = [...selected].map(timeToMinutes).sort((a, b) => a - b)
  const ranges: { start_time: string; end_time: string }[] = []
  let rangeStart = sorted[0]
  let prev = sorted[0]

  for (let i = 1; i < sorted.length; i++) {
    if (sorted[i] === prev + SLOT_STEP) {
      prev = sorted[i]
    } else {
      ranges.push({ start_time: minutesToTime(rangeStart), end_time: minutesToTime(prev + SLOT_STEP) })
      rangeStart = sorted[i]
      prev = sorted[i]
    }
  }
  ranges.push({ start_time: minutesToTime(rangeStart), end_time: minutesToTime(prev + SLOT_STEP) })

  return ranges
}

/**
 * Hydrates a set of selected slot start times from stored availability rules.
 * Only slots that fall within the picker range and align to SLOT_STEP are included.
 */
export function rulesToSelectedSlots(
  rules: { start_time: string; end_time: string }[]
): Set<string> {
  const selected = new Set<string>()
  for (const rule of rules) {
    const start = timeToMinutes(rule.start_time)
    const end = timeToMinutes(rule.end_time)
    for (let m = start; m < end; m += SLOT_STEP) {
      if (m >= SLOT_RANGE_START && m < SLOT_RANGE_END) {
        selected.add(minutesToTime(m))
      }
    }
  }
  return selected
}
