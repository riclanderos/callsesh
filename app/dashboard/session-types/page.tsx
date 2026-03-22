import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { headers } from 'next/headers'
import Link from 'next/link'
import CreateSessionTypeForm from './create-form'

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

export default async function SessionTypesPage() {
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
    <div className="min-h-screen p-8">
      <div className="mx-auto max-w-3xl space-y-8">

        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-semibold">Session Types</h1>
            <p className="mt-1 text-sm text-zinc-500">
              Define the coaching sessions you offer.
            </p>
          </div>
          <Link
            href="/dashboard"
            className="text-sm text-zinc-500 hover:text-black"
          >
            ← Dashboard
          </Link>
        </div>

        {/* Existing session types */}
        {sessionTypes && sessionTypes.length > 0 ? (
          <div className="space-y-3">
            {(sessionTypes as SessionType[]).map((st) => (
              <div
                key={st.id}
                className="flex items-start justify-between rounded-lg border p-4"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h2 className="font-medium">{st.title}</h2>
                    {!st.is_active && (
                      <span className="rounded border px-1.5 py-0.5 text-xs text-zinc-400">
                        Inactive
                      </span>
                    )}
                  </div>
                  {st.description && (
                    <p className="text-sm text-zinc-500">{st.description}</p>
                  )}
                  <p className="text-sm text-zinc-400">
                    {st.duration_minutes} min &middot;{' '}
                    ${(st.price_cents / 100).toFixed(2)}
                  </p>
                  <p className="text-xs text-zinc-400 font-mono">
                    <Link
                      href={`/book/${st.slug}`}
                      target="_blank"
                      className="hover:text-black underline"
                    >
                      {baseUrl}/book/{st.slug}
                    </Link>
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-zinc-400">
            No session types yet. Create your first one below.
          </p>
        )}

        {/* Create form */}
        <div className="space-y-4 rounded-lg border p-6">
          <h2 className="font-medium">New Session Type</h2>
          <CreateSessionTypeForm />
        </div>

      </div>
    </div>
  )
}
