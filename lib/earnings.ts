export interface EarningsSummary {
  totalCents: number
  last30DaysCents: number
}

type EarningsRow = {
  booking_date: string
  session_types: { price_cents: number } | { price_cents: number }[] | null
}

export function computeEarnings(rows: EarningsRow[]): EarningsSummary {
  const cutoff = new Date()
  cutoff.setDate(cutoff.getDate() - 30)
  const cutoffStr = cutoff.toISOString().split('T')[0]

  let totalCents = 0
  let last30DaysCents = 0

  for (const b of rows) {
    const st = b.session_types
    const price = Array.isArray(st)
      ? (st[0]?.price_cents ?? 0)
      : (st?.price_cents ?? 0)
    totalCents += price
    if (b.booking_date >= cutoffStr) {
      last30DaysCents += price
    }
  }

  return { totalCents, last30DaysCents }
}

/** Deducts the 10% platform fee from a gross amount in cents. */
export function netCents(grossCents: number): number {
  return grossCents - Math.round(grossCents * 0.1)
}

export function formatEarnings(cents: number): string {
  return '$' + (cents / 100).toFixed(2)
}
