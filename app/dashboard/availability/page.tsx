import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import CreateAvailabilityRuleForm from './create-form'

const DAYS = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
]

// Converts "HH:MM:SS" or "HH:MM" to "H:MM AM/PM"
function formatTime(t: string): string {
  const [h, m] = t.split(':').map(Number)
  const period = h >= 12 ? 'PM' : 'AM'
  const hour = h % 12 || 12
  return `${hour}:${String(m).padStart(2, '0')} ${period}`
}

type AvailabilityRule = {
  id: string
  day_of_week: number
  start_time: string
  end_time: string
  is_active: boolean
}

export default async function AvailabilityPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const { data: rules, error } = await supabase
    .from('availability_rules')
    .select('id, day_of_week, start_time, end_time, is_active')
    .eq('coach_id', user.id)
    .order('day_of_week', { ascending: true })
    .order('start_time', { ascending: true })

  if (error) throw new Error(error.message)

  return (
    <div className="min-h-screen p-8">
      <div className="mx-auto max-w-3xl space-y-8">

        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-semibold">Availability</h1>
            <p className="mt-1 text-sm text-zinc-500">
              Set the days and times you&apos;re available for sessions.
            </p>
          </div>
          <Link
            href="/dashboard"
            className="text-sm text-zinc-500 hover:text-black"
          >
            ← Dashboard
          </Link>
        </div>

        {/* Existing rules */}
        {rules && rules.length > 0 ? (
          <div className="space-y-3">
            {(rules as AvailabilityRule[]).map((rule) => (
              <div
                key={rule.id}
                className="flex items-center justify-between rounded-lg border p-4"
              >
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">
                      {DAYS[rule.day_of_week]}
                    </span>
                    {!rule.is_active && (
                      <span className="rounded border px-1.5 py-0.5 text-xs text-zinc-400">
                        Inactive
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-zinc-500">
                    {formatTime(rule.start_time)} – {formatTime(rule.end_time)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-zinc-400">
            No availability set yet. Add your first rule below.
          </p>
        )}

        {/* Create form */}
        <div className="space-y-4 rounded-lg border p-6">
          <h2 className="font-medium">Add availability</h2>
          <CreateAvailabilityRuleForm />
        </div>

      </div>
    </div>
  )
}
