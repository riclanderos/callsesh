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
      <div className="flex min-h-screen items-center justify-center bg-zinc-50 p-8">
        <div className="text-center space-y-2">
          <p className="text-lg font-medium">Session not available</p>
          <p className="text-sm text-zinc-500">This booking link is no longer active.</p>
        </div>
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

  const priceFormatted = `$${(session.price_cents / 100).toFixed(2)}`

  return (
    <div className="min-h-screen bg-zinc-50 py-12 px-4">
      <div className="mx-auto max-w-xl space-y-8">

        {/* Session header */}
        <div className="rounded-xl border bg-white p-6 space-y-4 shadow-sm">
          <div className="space-y-1">
            <h1 className="text-2xl font-semibold tracking-tight">{session.title}</h1>
            {session.description && (
              <p className="text-sm text-zinc-500 leading-relaxed">{session.description}</p>
            )}
          </div>
          <div className="flex items-center gap-3 pt-1">
            <span className="inline-flex items-center rounded-full bg-zinc-100 px-3 py-1 text-xs font-medium text-zinc-700">
              {session.duration_minutes} min
            </span>
            <span className="text-xl font-semibold">{priceFormatted}</span>
          </div>
        </div>

        {/* Slot picker + booking form */}
        <div className="space-y-3">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-zinc-400 px-1">
            Choose a time
          </h2>

          {daySlots.length > 0 ? (
            <BookingForm
              sessionTypeId={session.id}
              daySlots={daySlots}
              coachTimezone={coachTimezone}
            />
          ) : (
            <div className="rounded-xl border bg-white p-6 shadow-sm text-center space-y-1">
              <p className="text-sm font-medium text-zinc-700">No availability yet</p>
              <p className="text-xs text-zinc-400">
                This coach hasn&apos;t set up their schedule. Check back soon.
              </p>
            </div>
          )}
        </div>

      </div>
    </div>
  )
}
