import { createClient } from '@/lib/supabase/server'
import { createServiceClient } from '@/lib/supabase/service'
import { generateSlots } from '@/lib/slots'
import BookingForm, { type DaySlots } from './booking-form'

export default async function BookingPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const supabase = await createClient()

  // Fetch active session type by slug
  const { data: session } = await supabase
    .from('session_types')
    .select('id, coach_id, title, description, duration_minutes, price_cents')
    .eq('slug', slug)
    .eq('is_active', true)
    .single()

  if (!session) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-zinc-500">This session is not available.</p>
      </div>
    )
  }

  // Fetch availability rules (anon client, public RLS policy) and coach
  // timezone (service client — profiles has no public SELECT policy) in parallel.
  const serviceClient = createServiceClient()
  const [{ data: availability }, { data: profile }] = await Promise.all([
    supabase
      .from('availability_rules')
      .select('day_of_week, start_time, end_time')
      .eq('coach_id', session.coach_id)
      .eq('is_active', true)
      .order('day_of_week', { ascending: true })
      .order('start_time', { ascending: true }),
    serviceClient
      .from('profiles')
      .select('timezone')
      .eq('id', session.coach_id)
      .single(),
  ])

  const coachTimezone = profile?.timezone ?? 'UTC'

  // Generate slots server-side and group by day
  const slotMap = new Map<number, string[]>()
  for (const rule of availability ?? []) {
    const slots = generateSlots(
      rule.start_time,
      rule.end_time,
      session.duration_minutes
    )
    const existing = slotMap.get(rule.day_of_week) ?? []
    slotMap.set(rule.day_of_week, [...existing, ...slots])
  }

  const daySlots: DaySlots[] = Array.from(slotMap.entries())
    .sort(([a], [b]) => a - b)
    .map(([day, slots]) => ({ day, slots: slots.sort() }))

  return (
    <div className="min-h-screen p-8">
      <div className="mx-auto max-w-xl space-y-8">

        {/* Session details */}
        <div className="space-y-3">
          <h1 className="text-2xl font-semibold">{session.title}</h1>
          {session.description && (
            <p className="text-zinc-500">{session.description}</p>
          )}
          <div className="flex items-center gap-2 text-sm text-zinc-500">
            <span>{session.duration_minutes} min</span>
            <span>&middot;</span>
            <span>${(session.price_cents / 100).toFixed(2)}</span>
          </div>
        </div>

        {/* Slot picker + booking form */}
        <div className="space-y-4">
          <h2 className="font-medium">Select a time</h2>
          {daySlots.length > 0 ? (
            <BookingForm
              sessionTypeId={session.id}
              daySlots={daySlots}
              coachTimezone={coachTimezone}
            />
          ) : (
            <p className="text-sm text-zinc-400">
              No availability set for this coach.
            </p>
          )}
        </div>

      </div>
    </div>
  )
}
