import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { headers } from 'next/headers'
import Link from 'next/link'
import CreateSessionTypeForm from './create-form'
import DeleteSessionTypeButton from './delete-button'
import { TrackOnMount } from '@/lib/analytics'

type SessionType = {
  id: string
  title: string
  description: string | null
  duration_minutes: number
  price_cents: number
  slug: string
  is_active: boolean
  created_at: string
}

export default async function SessionTypesPage({
  searchParams,
}: {
  searchParams: Promise<{ created?: string }>
}) {
  const { created } = await searchParams
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const headersList = await headers()
  const host = headersList.get('host') ?? 'localhost:3000'
  const proto = host.startsWith('localhost') || host.startsWith('127.') ? 'http' : 'https'
  const baseUrl = `${proto}://${host}`

  const { data: sessionTypes, error } = await supabase
    .from('session_types')
    .select('*')
    .eq('coach_id', user.id)
    .order('created_at', { ascending: false })

  if (error) throw new Error(error.message)

  return (
    <div className="min-h-screen px-6 py-10">
      {created === '1' && <TrackOnMount event="session_type_created" />}
      <div className="mx-auto max-w-4xl space-y-8">

        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="space-y-0.5">
            <h1 className="text-2xl font-semibold text-zinc-100">Session Types</h1>
            <p className="text-sm text-zinc-400">Define the coaching sessions you offer.</p>
          </div>
          <Link
            href="/dashboard"
            className="text-sm text-zinc-400 hover:text-zinc-300 transition-colors"
          >
            ← Dashboard
          </Link>
        </div>

        {/* Next-step nudge — shown when at least one session type exists */}
        {sessionTypes && sessionTypes.length > 0 && (
          <div className="rounded-xl border border-zinc-800 bg-zinc-900 px-5 py-4 flex items-center justify-between gap-4">
            <p className="text-sm text-zinc-400">
              Session type ready.{' '}
              <span className="text-zinc-400">Make sure your availability is set so clients can book.</span>
            </p>
            <Link
              href="/dashboard/availability"
              className="flex-shrink-0 rounded-lg border border-zinc-700 px-4 py-2 text-sm font-medium text-zinc-200 hover:bg-zinc-800 transition-colors"
            >
              Set availability →
            </Link>
          </div>
        )}

        {/* Existing session types */}
        {sessionTypes && sessionTypes.length > 0 ? (
          <section className="space-y-3">
            <p className="text-xs font-medium uppercase tracking-wider text-zinc-400">Your sessions</p>
            <div className="space-y-2">
              {(sessionTypes as SessionType[]).map((st) => (
                <div
                  key={st.id}
                  className="rounded-xl border border-zinc-800 bg-zinc-900 p-5"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="space-y-1.5 min-w-0">
                      <div className="flex items-center gap-2">
                        <h2 className="font-medium text-zinc-100">{st.title}</h2>
                        {!st.is_active && (
                          <span className="rounded border border-zinc-700 px-1.5 py-0.5 text-xs text-zinc-500">
                            Inactive
                          </span>
                        )}
                      </div>
                      {st.description && (
                        <p className="text-sm text-zinc-400">{st.description}</p>
                      )}
                      <p className="text-sm text-zinc-400">
                        {st.duration_minutes} min &middot; ${(st.price_cents / 100).toFixed(2)}
                      </p>
                      <p className="text-sm text-zinc-500 font-mono truncate">
                        <Link
                          href={`/book/${st.slug}`}
                          target="_blank"
                          className="hover:text-zinc-400 underline transition-colors"
                        >
                          {baseUrl}/book/{st.slug}
                        </Link>
                      </p>
                    </div>
                    <DeleteSessionTypeButton id={st.id} />
                  </div>
                </div>
              ))}
            </div>
          </section>
        ) : (
          <div className="rounded-xl border border-zinc-800 bg-zinc-900 px-6 py-8 text-center">
            <p className="text-sm text-zinc-400">No session types yet. Create your first one below.</p>
          </div>
        )}

        {/* Create form */}
        <section className="rounded-xl border border-zinc-800 bg-zinc-900 p-6 space-y-5">
          <div className="space-y-0.5">
            <h2 className="font-medium text-zinc-100">New Session Type</h2>
            <p className="text-sm text-zinc-400">Add a new session to your coaching offerings.</p>
          </div>
          <CreateSessionTypeForm />
        </section>

      </div>
    </div>
  )
}
