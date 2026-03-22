import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import CreateAvailabilityRuleForm from './create-form'
import RuleList, { type Rule } from './rule-list'

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

        {/* Existing rules — edit / toggle / delete handled in RuleList */}
        <RuleList rules={(rules ?? []) as Rule[]} />

        {/* Create form */}
        <div className="space-y-4 rounded-lg border p-6">
          <h2 className="font-medium">Add availability</h2>
          <CreateAvailabilityRuleForm />
        </div>

      </div>
    </div>
  )
}
