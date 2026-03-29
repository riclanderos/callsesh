import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import CreateAvailabilityRuleForm from './create-form'
import BulkAvailabilityForm from './bulk-form'
import RuleList, { type Rule } from './rule-list'

export default async function AvailabilityPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const { data: rules, error } = await supabase
    .from('availability_rules')
    .select('id, day_of_week, start_time, end_time, is_active, created_at, rule_kind')
    .eq('coach_id', user.id)
    .order('day_of_week', { ascending: true })
    .order('start_time', { ascending: true })

  if (error) throw new Error(error.message)

  return (
    <div className="min-h-screen px-6 py-10">
      <div className="mx-auto max-w-4xl space-y-8">

        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="space-y-0.5">
            <h1 className="text-2xl font-semibold text-zinc-100">Availability</h1>
            <p className="text-sm text-zinc-500">Set the days and times you&apos;re available.</p>
          </div>
          <Link
            href="/dashboard"
            className="text-sm text-zinc-500 hover:text-zinc-300 transition-colors"
          >
            ← Dashboard
          </Link>
        </div>

        {/* Bulk setup */}
        <section className="rounded-xl border border-zinc-800 bg-zinc-900 p-6 space-y-5">
          <div className="space-y-0.5">
            <h2 className="font-medium text-zinc-100">Quick setup</h2>
            <p className="text-xs text-zinc-500">
              Apply the same hours to multiple days at once.
            </p>
          </div>
          <BulkAvailabilityForm />
        </section>

        {/* Existing rules */}
        <RuleList rules={(rules ?? []) as Rule[]} />

        {/* Share prompt — shown when at least one rule exists */}
        {rules && rules.length > 0 && (
          <div className="rounded-xl border border-zinc-800 bg-zinc-900 px-5 py-4 flex items-center justify-between gap-4">
            <p className="text-sm text-zinc-400">
              Availability is set.{' '}
              <span className="text-zinc-500">Head to your dashboard to copy and share your booking link.</span>
            </p>
            <Link
              href="/dashboard"
              className="flex-shrink-0 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-500 transition-colors"
            >
              Go to dashboard →
            </Link>
          </div>
        )}

        {/* Single-day form */}
        <section className="rounded-xl border border-zinc-800 bg-zinc-900 p-6 space-y-5">
          <div className="space-y-0.5">
            <h2 className="font-medium text-zinc-100">Add a specific day</h2>
            <p className="text-xs text-zinc-500">
              Overrides your regular hours for that day of the week.
            </p>
          </div>
          <CreateAvailabilityRuleForm />
        </section>

      </div>
    </div>
  )
}
