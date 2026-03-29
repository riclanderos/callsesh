import { createClient } from '@/lib/supabase/server'
import { createServiceClient } from '@/lib/supabase/service'
import { generateSlots } from '@/lib/slots'
import { getUserPlan } from '@/lib/plan'
import Link from 'next/link'
import DateSelector from '@/components/booking/DateSelector'
import { upcomingDates, dateToDayOfWeek, type DateSlots } from '@/lib/booking'

// Always render fresh — availability and bookings must never be served from cache.
// This is belt-and-suspenders: the page is already dynamic because it accesses
// `params` (a Promise in Next.js 16) and calls cookies() via createClient().
export const dynamic = 'force-dynamic'

/** Minimum minutes ahead a slot must start to be shown on the booking page. */
const LEAD_TIME_MINUTES = 5

function timeToMinutes(t: string): number {
  const [h, m] = t.split(':').map(Number)
  return h * 60 + m
}

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
      <div className="flex min-h-screen items-center justify-center px-4">
        <div className="text-center space-y-2">
          <p className="text-base font-medium text-zinc-200">Session not available</p>
          <p className="text-sm text-zinc-500">This booking link is no longer active.</p>
        </div>
      </div>
    )
  }

  const serviceClient = createServiceClient()
  const [{ data: availability }, { data: profile }, { count: usedCount }, { sessionLimit }] = await Promise.all([
    supabase
      .from('availability_rules')
      .select('day_of_week, start_time, end_time, rule_kind')
      .eq('coach_id', session.coach_id)
      .eq('is_active', true)
      .order('day_of_week', { ascending: true })
      .order('start_time', { ascending: true }),
    serviceClient
      .from('profiles')
      .select('timezone')
      .eq('id', session.coach_id)
      .single(),
    serviceClient
      .from('bookings')
      .select('id', { count: 'exact', head: true })
      .eq('coach_id', session.coach_id)
      .neq('status', 'cancelled'),
    getUserPlan(session.coach_id),
  ])

  const atLimit = (usedCount ?? 0) >= sessionLimit

  const { data: { user: viewer } } = await supabase.auth.getUser()
  const isCoachOwner = viewer?.id === session.coach_id

  const coachTimezone = profile?.timezone ?? 'UTC'

  // Current time in coach's timezone for same-day lead-time filtering.
  const todayInCoachTz = new Intl.DateTimeFormat('en-CA', { timeZone: coachTimezone }).format(new Date())
  const nowParts = new Intl.DateTimeFormat('en-US', {
    timeZone: coachTimezone, hour: 'numeric', minute: '2-digit', hour12: false,
  }).formatToParts(new Date())
  const nowH = parseInt(nowParts.find((p) => p.type === 'hour')?.value ?? '0', 10) % 24
  const nowM = parseInt(nowParts.find((p) => p.type === 'minute')?.value ?? '0', 10)
  const nowMinutes = nowH * 60 + nowM

  // Override precedence: if ANY rule for a day has rule_kind='override', use only those.
  const allRules = availability ?? []
  const overrideDaySet = new Set(
    allRules.filter((r) => r.rule_kind === 'override').map((r) => r.day_of_week)
  )
  const effectiveRules = allRules.filter((r) =>
    overrideDaySet.has(r.day_of_week) ? r.rule_kind === 'override' : true
  )

  // Generate the upcoming 28-day window in the coach's timezone.
  const window28 = upcomingDates(28, coachTimezone)

  // Fetch all confirmed/completed bookings across the window in one query.
  let existingBookings: { booking_date: string; start_time: string; end_time: string }[] = []
  if (effectiveRules.length > 0) {
    const { data, error } = await serviceClient
      .from('bookings')
      .select('booking_date, start_time, end_time')
      .eq('coach_id', session.coach_id)
      .in('booking_date', window28)
      .in('status', ['confirmed', 'completed'])
    if (error) {
      console.error('[book] existingBookings query failed:', error.message)
    } else {
      existingBookings = data ?? []
    }
  }

  // Build DateSlots for each date in the window.
  const dateSlots: DateSlots[] = window28.map((date) => {
    const day = dateToDayOfWeek(date)
    const rulesForDay = effectiveRules.filter((r) => r.day_of_week === day)

    if (rulesForDay.length === 0) return { date, day, slots: [] }

    const bookingsOnDate = existingBookings.filter(
      (b) => String(b.booking_date).slice(0, 10) === date
    )

    const allSlots: string[] = []
    for (const rule of rulesForDay) {
      const slots = generateSlots(rule.start_time, rule.end_time, session.duration_minutes)
      const available = slots.filter((slot) => {
        const slotStart = timeToMinutes(slot)
        const slotEnd = slotStart + session.duration_minutes
        // Drop same-day slots that don't have enough lead time.
        if (date === todayInCoachTz && slotStart < nowMinutes + LEAD_TIME_MINUTES) return false
        // Drop slots that overlap an existing booking.
        if (bookingsOnDate.some((b) => {
          const bStart = timeToMinutes(b.start_time)
          const bEnd = timeToMinutes(b.end_time)
          return bStart < slotEnd && bEnd > slotStart
        })) return false
        return true
      })
      allSlots.push(...available)
    }

    return { date, day, slots: [...new Set(allSlots)].sort() }
  })

  const priceFormatted = `$${(session.price_cents / 100).toFixed(2)}`

  return (
    <div className="min-h-screen bg-zinc-950 px-4 py-12">
      <div className="mx-auto max-w-xl space-y-6">

        {/* Session header card */}
        <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-6 space-y-4">
          <div className="space-y-1">
            <h1 className="text-2xl font-semibold tracking-tight text-zinc-100">{session.title}</h1>
            {session.description && (
              <p className="text-sm text-zinc-100 leading-relaxed">{session.description}</p>
            )}
          </div>
          <div className="flex items-center gap-3 pt-1">
            <span className="inline-flex items-center rounded-full border border-zinc-600 bg-zinc-800 px-3 py-1 text-xs font-medium text-zinc-100">
              {session.duration_minutes} min
            </span>
            <span className="text-xl font-semibold text-zinc-100">{priceFormatted}</span>
          </div>
        </div>

        {/* Slot picker + booking form */}
        <div className="space-y-3">
          {atLimit ? (
            isCoachOwner ? (
              <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-8 space-y-5">
                <div className="space-y-2">
                  <p className="text-base font-semibold text-zinc-100">You&apos;ve reached your session limit</p>
                  <p className="text-sm text-zinc-400">Upgrade your plan to keep accepting bookings.</p>
                </div>
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                  <Link
                    href="/upgrade"
                    className="rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-indigo-500 transition-colors text-center"
                  >
                    See plans
                  </Link>
                  <Link
                    href="/dashboard"
                    className="text-sm text-zinc-500 hover:text-zinc-300 transition-colors text-center sm:text-left"
                  >
                    Back to dashboard
                  </Link>
                </div>
              </div>
            ) : (
              <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-8 space-y-2">
                <p className="text-base font-semibold text-zinc-100">This coach is not accepting new bookings right now</p>
                <p className="text-sm text-zinc-400">Please check back later or contact the coach directly.</p>
              </div>
            )
          ) : (
            <>
              <p className="text-xs font-medium uppercase tracking-wider text-zinc-500 px-1">
                Choose a time
              </p>
              <DateSelector
                sessionTypeId={session.id}
                dateSlots={dateSlots}
                coachTimezone={coachTimezone}
              />
            </>
          )}
        </div>

      </div>
    </div>
  )
}
