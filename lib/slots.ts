/** Converts "HH:MM:SS" or "HH:MM" to minutes since midnight. */
function timeToMinutes(t: string): number {
  const [h, m] = t.split(':').map(Number)
  return h * 60 + m
}

/** Converts minutes since midnight back to "HH:MM". */
function minutesToTime(mins: number): string {
  const h = Math.floor(mins / 60)
  const m = mins % 60
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`
}

/**
 * Returns every valid slot start time within [startTime, endTime) such that
 * a session of durationMinutes fits entirely before endTime.
 *
 * Example: start=17:00, end=18:00, duration=30 → ["17:00", "17:30"]
 * Example: start=17:00, end=17:20, duration=30 → []   (window too short)
 */
export function generateSlots(
  startTime: string,
  endTime: string,
  durationMinutes: number
): string[] {
  const start = timeToMinutes(startTime)
  const end = timeToMinutes(endTime)
  const slots: string[] = []

  for (let t = start; t + durationMinutes <= end; t += durationMinutes) {
    slots.push(minutesToTime(t))
  }

  return slots
}
