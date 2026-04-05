import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'

function formatDate(d: string): string {
  const [year, month, day] = d.split('-').map(Number)
  return new Date(year, month - 1, day).toLocaleDateString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric',
  })
}

export default async function ClientsPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  // Fetch all client identity rows for this coach.
  const { data: clientRows, error: clientError } = await supabase
    .from('coach_clients')
    .select('id, email, name')
    .eq('coach_id', user.id)

  if (clientError) throw new Error(clientError.message)

  // Fetch all non-cancelled bookings to compute session count + last date per client.
  const { data: bookingRows, error: bookingError } = await supabase
    .from('bookings')
    .select('coach_client_id, booking_date')
    .eq('coach_id', user.id)
    .neq('status', 'cancelled')
    .order('booking_date', { ascending: false })

  if (bookingError) throw new Error(bookingError.message)

  // Aggregate session count and last date by coach_client_id.
  const statsMap = new Map<string, { sessionCount: number; lastDate: string }>()
  for (const b of bookingRows ?? []) {
    const cid = b.coach_client_id as string | null
    if (!cid) continue
    const existing = statsMap.get(cid)
    if (!existing) {
      statsMap.set(cid, { sessionCount: 1, lastDate: b.booking_date as string })
    } else {
      existing.sessionCount++
      // booking_date is already sorted descending so first encountered is max.
    }
  }

  const clients = (clientRows ?? [])
    .map((c) => ({
      id:           c.id as string,
      email:        c.email as string,
      name:         (c.name as string | null) ?? (c.email as string),
      sessionCount: statsMap.get(c.id as string)?.sessionCount ?? 0,
      lastDate:     statsMap.get(c.id as string)?.lastDate ?? null,
    }))
    // Clients with no non-cancelled sessions are still shown; sort them last.
    .sort((a, b) => {
      if (!a.lastDate && !b.lastDate) return 0
      if (!a.lastDate) return 1
      if (!b.lastDate) return -1
      return b.lastDate.localeCompare(a.lastDate)
    })

  return (
    <div className="min-h-screen px-6 py-10">
      <div className="mx-auto max-w-3xl space-y-6">

        <div className="flex items-start justify-between">
          <div className="space-y-0.5">
            <h1 className="text-2xl font-semibold text-zinc-100">Clients</h1>
            <p className="text-sm text-zinc-400">
              {clients.length} client{clients.length !== 1 ? 's' : ''}
            </p>
          </div>
          <Link
            href="/dashboard"
            className="text-sm text-zinc-400 hover:text-zinc-300 transition-colors"
          >
            ← Dashboard
          </Link>
        </div>

        {clients.length === 0 && (
          <div className="rounded-xl border border-zinc-800 bg-zinc-900 px-6 py-10 text-center">
            <p className="text-sm text-zinc-400">No clients yet.</p>
          </div>
        )}

        <div className="space-y-2">
          {clients.map((c) => (
            <Link
              key={c.id}
              href={`/dashboard/clients/${c.id}`}
              className="flex items-center justify-between rounded-xl border border-zinc-800 bg-zinc-900 p-4 hover:border-zinc-700 transition-colors"
            >
              <div className="space-y-0.5">
                <p className="font-medium text-zinc-100">{c.name}</p>
                <p className="text-sm text-zinc-400">{c.email}</p>
              </div>
              <div className="text-right space-y-0.5">
                <p className="text-sm text-zinc-300">
                  {c.sessionCount} session{c.sessionCount !== 1 ? 's' : ''}
                </p>
                {c.lastDate && (
                  <p className="text-xs text-zinc-500">Last: {formatDate(c.lastDate)}</p>
                )}
              </div>
            </Link>
          ))}
        </div>

      </div>
    </div>
  )
}
