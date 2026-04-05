import { createClient } from '@/lib/supabase/server'
import { redirect, notFound } from 'next/navigation'
import Link from 'next/link'

function formatDate(d: string): string {
  const [year, month, day] = d.split('-').map(Number)
  return new Date(year, month - 1, day).toLocaleDateString('en-US', {
    weekday: 'short', month: 'short', day: 'numeric', year: 'numeric',
  })
}

function formatTime(t: string): string {
  const [h, m] = t.split(':').map(Number)
  const period = h >= 12 ? 'PM' : 'AM'
  const hour = h % 12 || 12
  return `${hour}:${String(m).padStart(2, '0')} ${period}`
}

const statusStyles: Record<string, string> = {
  confirmed: 'bg-green-950 text-green-400 border border-green-900',
  cancelled:  'bg-zinc-800 text-zinc-500 border border-zinc-700',
  completed:  'bg-blue-950 text-blue-400 border border-blue-900',
}

export default async function ClientDetailPage({
  params,
}: {
  params: Promise<{ clientId: string }>
}) {
  const { clientId } = await params

  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  // Verify ownership and fetch client identity.
  const { data: client, error: clientError } = await supabase
    .from('coach_clients')
    .select('id, email, name')
    .eq('id', clientId)
    .eq('coach_id', user.id)
    .maybeSingle()

  console.log('[client-detail] params:', { clientId })
  console.log('[client-detail] client query result:', { client, error: clientError?.message ?? null })

  if (clientError) throw new Error(clientError.message)
  if (!client) notFound()

  // All bookings for this client under this coach, newest first.
  const { data: bookings, error } = await supabase
    .from('bookings')
    .select(
      'id, guest_name, booking_date, start_time, end_time, status, client_message, coach_notes, recap_summary, recap_key_points, recap_action_steps, session_types(title)'
    )
    .eq('coach_client_id', clientId)
    .eq('coach_id', user.id)
    .order('booking_date', { ascending: false })
    .order('start_time', { ascending: false })

  if (error) throw new Error(error.message)

  // Prefer the stored name on the client record; fall back to latest booking guest_name.
  const displayName =
    (client.name as string | null)?.trim() ||
    (bookings ?? []).find((b) => (b.guest_name as string).trim())?.guest_name ||
    (client.email as string)

  return (
    <div className="min-h-screen px-6 py-10">
      <div className="mx-auto max-w-2xl space-y-6">

        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="space-y-0.5">
            <h1 className="text-xl font-semibold text-zinc-100">{displayName as string}</h1>
            <p className="text-sm text-zinc-400">{client.email as string}</p>
          </div>
          <Link
            href="/dashboard/clients"
            className="text-sm text-zinc-400 hover:text-zinc-300 transition-colors"
          >
            ← Clients
          </Link>
        </div>

        {(!bookings || bookings.length === 0) && (
          <div className="rounded-xl border border-zinc-800 bg-zinc-900 px-6 py-10 text-center">
            <p className="text-sm text-zinc-400">No sessions yet.</p>
          </div>
        )}

        {/* Sessions */}
        <div className="space-y-3">
          {(bookings ?? []).map((b) => {
            const st = b.session_types as { title: string } | { title: string }[] | null
            const sessionTitle = Array.isArray(st) ? (st[0]?.title ?? '—') : (st?.title ?? '—')
            const keyPoints = (b.recap_key_points as string[] | null) ?? []
            const actionSteps = (b.recap_action_steps as string[] | null) ?? []
            const hasRecap = b.recap_summary || keyPoints.length > 0 || actionSteps.length > 0
            const hasNotes = !!b.coach_notes

            return (
              <div
                key={b.id as string}
                className="rounded-xl border border-zinc-800 bg-zinc-900 p-5 space-y-4"
              >
                {/* Session header */}
                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-0.5">
                    <p className="text-sm font-medium text-zinc-200">{sessionTitle}</p>
                    <p className="text-xs text-zinc-400 font-mono">
                      {formatDate(b.booking_date as string)} · {formatTime(b.start_time as string)} – {formatTime(b.end_time as string)}
                    </p>
                    {b.client_message && (
                      <p className="text-xs text-zinc-400 italic mt-1">
                        &ldquo;{b.client_message as string}&rdquo;
                      </p>
                    )}
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span
                      className={`rounded px-1.5 py-0.5 text-xs font-medium capitalize ${
                        statusStyles[b.status as string] ?? 'bg-zinc-800 text-zinc-400 border border-zinc-700'
                      }`}
                    >
                      {b.status as string}
                    </span>
                    <Link
                      href={`/dashboard/bookings/${b.id as string}`}
                      className="text-xs text-zinc-500 hover:text-zinc-300 transition-colors"
                    >
                      Edit
                    </Link>
                  </div>
                </div>

                {/* Notes */}
                {hasNotes && (
                  <div className="border-t border-zinc-800 pt-3 space-y-1">
                    <p className="text-xs font-medium uppercase tracking-wider text-zinc-500">Notes</p>
                    <p className="text-sm text-zinc-300 whitespace-pre-wrap">{b.coach_notes as string}</p>
                  </div>
                )}

                {/* Recap */}
                {hasRecap && (
                  <div className="border-t border-zinc-800 pt-3 space-y-3">
                    <p className="text-xs font-medium uppercase tracking-wider text-zinc-500">Recap</p>
                    {b.recap_summary && (
                      <p className="text-sm text-zinc-300 whitespace-pre-wrap">{b.recap_summary as string}</p>
                    )}
                    {keyPoints.length > 0 && (
                      <div className="space-y-1">
                        <p className="text-xs text-zinc-500">Key Points</p>
                        <ul className="space-y-0.5">
                          {keyPoints.map((pt, i) => (
                            <li key={i} className="text-sm text-zinc-300 flex gap-2">
                              <span className="text-zinc-600 shrink-0">·</span>
                              {pt}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                    {actionSteps.length > 0 && (
                      <div className="space-y-1">
                        <p className="text-xs text-zinc-500">Action Steps</p>
                        <ul className="space-y-0.5">
                          {actionSteps.map((step, i) => (
                            <li key={i} className="text-sm text-zinc-300 flex gap-2">
                              <span className="text-zinc-600 shrink-0">{i + 1}.</span>
                              {step}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                )}

                {/* Empty state */}
                {!hasNotes && !hasRecap && (
                  <div className="border-t border-zinc-800 pt-3">
                    <p className="text-xs text-zinc-600">No notes or recap saved.</p>
                  </div>
                )}
              </div>
            )
          })}
        </div>

      </div>
    </div>
  )
}
