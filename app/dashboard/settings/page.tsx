import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import TimezoneForm from './timezone-form'

export default async function SettingsPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('timezone')
    .eq('id', user.id)
    .single()

  const currentTimezone = profile?.timezone ?? 'UTC'

  return (
    <div className="min-h-screen px-6 py-10">
      <div className="mx-auto max-w-4xl space-y-8">

        <div className="flex items-start justify-between">
          <div className="space-y-0.5">
            <h1 className="text-2xl font-semibold text-zinc-100">Settings</h1>
            <p className="text-sm text-zinc-500">Manage your account preferences.</p>
          </div>
          <Link
            href="/dashboard"
            className="text-sm text-zinc-500 hover:text-zinc-300 transition-colors"
          >
            ← Dashboard
          </Link>
        </div>

        <section className="rounded-xl border border-zinc-800 bg-zinc-900 p-6 space-y-5">
          <div className="space-y-0.5">
            <h2 className="font-medium text-zinc-100">Timezone</h2>
            <p className="text-xs text-zinc-500">
              All availability and booking times are shown in this timezone.
            </p>
          </div>
          <TimezoneForm currentTimezone={currentTimezone} />
        </section>

      </div>
    </div>
  )
}
