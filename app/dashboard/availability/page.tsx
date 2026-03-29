import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import SlotPicker from '@/components/dashboard/availability/SlotPicker'
import { rulesToSelectedSlots } from '@/lib/availability'

export default async function AvailabilityPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const { data: rules, error } = await supabase
    .from('availability_rules')
    .select('day_of_week, start_time, end_time')
    .eq('coach_id', user.id)
    .eq('rule_kind', 'recurring')
    .eq('is_active', true)
    .order('day_of_week', { ascending: true })
    .order('start_time', { ascending: true })

  if (error) throw new Error(error.message)

  // Convert stored rules into picker-ready slot sets, grouped by day.
  const initialSelectedByDay: Partial<Record<number, string[]>> = {}
  for (let day = 0; day <= 6; day++) {
    const dayRules = (rules ?? []).filter((r) => r.day_of_week === day)
    if (dayRules.length > 0) {
      initialSelectedByDay[day] = [...rulesToSelectedSlots(dayRules)]
    }
  }

  const hasRules = (rules ?? []).length > 0

  return (
    <div className="min-h-screen px-6 py-10">
      <div className="mx-auto max-w-3xl space-y-8">

        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="space-y-0.5">
            <h1 className="text-2xl font-semibold text-zinc-100">Availability</h1>
            <p className="text-sm text-zinc-500">
              Select the times you&apos;re available each week.
            </p>
          </div>
          <Link
            href="/dashboard"
            className="text-sm text-zinc-500 hover:text-zinc-300 transition-colors"
          >
            ← Dashboard
          </Link>
        </div>

        {/* Slot picker */}
        <SlotPicker initialSelectedByDay={initialSelectedByDay} />

        {/* Share prompt */}
        {hasRules && (
          <div className="rounded-xl border border-zinc-800 bg-zinc-900 px-5 py-4 flex items-center justify-between gap-4">
            <p className="text-sm text-zinc-400">
              Availability is set.{' '}
              <span className="text-zinc-500">Share your booking link from the dashboard.</span>
            </p>
            <Link
              href="/dashboard"
              className="flex-shrink-0 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-500 transition-colors"
            >
              Go to dashboard →
            </Link>
          </div>
        )}

      </div>
    </div>
  )
}
