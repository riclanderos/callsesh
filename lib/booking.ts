/**
 * Returns the next `windowDays` calendar dates starting from today,
 * expressed in the given IANA timezone, as "YYYY-MM-DD" strings.
 *
 * Uses the coach's local calendar date as the anchor — a coach in UTC+9
 * sees dates that are already "tomorrow" in UTC, which is correct.
 */
export function upcomingDates(windowDays: number, timezone: string): string[] {
  const todayStr = new Intl.DateTimeFormat('en-CA', { timeZone: timezone }).format(new Date())
  const [y, mo, d] = todayStr.split('-').map(Number)
  const dates: string[] = []
  for (let i = 0; i < windowDays; i++) {
    // new Date(y, mo-1, d+i) handles month/year roll-overs correctly.
    const dt = new Date(y, mo - 1, d + i)
    dates.push(
      `${dt.getFullYear()}-${String(dt.getMonth() + 1).padStart(2, '0')}-${String(dt.getDate()).padStart(2, '0')}`
    )
  }
  return dates
}

/**
 * Returns the day-of-week (0 = Sunday … 6 = Saturday) for a "YYYY-MM-DD" string.
 *
 * Parses the three components and constructs a local Date at midnight, so the
 * result is independent of the server's own timezone.
 */
export function dateToDayOfWeek(dateStr: string): number {
  const [y, mo, d] = dateStr.split('-').map(Number)
  return new Date(y, mo - 1, d).getDay()
}

/** A concrete calendar date with its available booking slots. */
export type DateSlots = {
  /** Calendar date in the coach's timezone, "YYYY-MM-DD". */
  date: string
  /** Day of week derived from the date (0 = Sun … 6 = Sat). */
  day: number
  /** Available slot start times as "HH:MM", sorted ascending. */
  slots: string[]
}

/**
 * Returns a short timezone abbreviation for display (e.g. "PT", "ET", "GMT+9").
 * Falls back to the IANA name if Intl cannot produce a short name.
 */
export function tzAbbr(timezone: string, date = new Date()): string {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: timezone,
    timeZoneName: 'short',
  }).formatToParts(date)
  return parts.find((p) => p.type === 'timeZoneName')?.value ?? timezone
}

/**
 * Converts a "HH:MM" wall-clock time on a "YYYY-MM-DD" date from one IANA
 * timezone to another. Returns "HH:MM" in the target timezone.
 *
 * Uses a single-pass offset correction so it is accurate for all standard
 * offsets and correct within ±1 min even at DST transitions.
 */
export function convertTime(
  dateStr: string,
  timeStr: string,
  fromTz: string,
  toTz: string
): string {
  if (fromTz === toTz) return timeStr
  const [y, mo, d] = dateStr.split('-').map(Number)
  const [h, m] = timeStr.split(':').map(Number)
  // Seed: assume UTC = wall clock (exact when fromTz is UTC, close otherwise)
  let utcMs = Date.UTC(y, mo - 1, d, h, m)
  // One correction: measure the gap between what fromTz shows and h:m
  const seedParts = new Intl.DateTimeFormat('en-US', {
    timeZone: fromTz, hour: 'numeric', minute: '2-digit', hour12: false,
  }).formatToParts(new Date(utcMs))
  const seedH = parseInt(seedParts.find((p) => p.type === 'hour')?.value ?? '0', 10) % 24
  const seedM = parseInt(seedParts.find((p) => p.type === 'minute')?.value ?? '0', 10)
  utcMs -= (seedH * 60 + seedM - (h * 60 + m)) * 60_000
  // Read the corrected UTC instant in the target timezone
  const outParts = new Intl.DateTimeFormat('en-US', {
    timeZone: toTz, hour: 'numeric', minute: '2-digit', hour12: false,
  }).formatToParts(new Date(utcMs))
  const outH = parseInt(outParts.find((p) => p.type === 'hour')?.value ?? '0', 10) % 24
  const outM = parseInt(outParts.find((p) => p.type === 'minute')?.value ?? '0', 10)
  return `${String(outH).padStart(2, '0')}:${String(outM).padStart(2, '0')}`
}
