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
    <div className="min-h-screen p-8">
      <div className="mx-auto max-w-3xl space-y-8">

        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-semibold">Settings</h1>
            <p className="mt-1 text-sm text-zinc-500">
              Manage your account preferences.
            </p>
          </div>
          <Link
            href="/dashboard"
            className="text-sm text-zinc-500 hover:text-black"
          >
            ← Dashboard
          </Link>
        </div>

        <div className="rounded-lg border p-6 space-y-4">
          <h2 className="font-medium">Timezone</h2>
          <TimezoneForm currentTimezone={currentTimezone} />
        </div>

      </div>
    </div>
  )
}
