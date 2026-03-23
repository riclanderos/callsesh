'use server'

import { timingSafeEqual } from 'crypto'
import { createClient } from '@/lib/supabase/server'
import { createServiceClient } from '@/lib/supabase/service'
import { generateSlots } from '@/lib/slots'
import { stripe } from '@/lib/stripe'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { headers } from 'next/headers'

export type CheckoutState =
  | null
  | { ok: true; checkoutUrl: string }
  | { ok: false; error: string }

/**
 * Returns the next occurrence of dayOfWeek (0=Sun…6=Sat) starting from
 * tomorrow (in the coach's timezone), as a "YYYY-MM-DD" string.
 */
function nextOccurrence(dayOfWeek: number, timezone: string): string {
  // Resolve today's calendar date in the coach's timezone so that coaches in
  // non-UTC zones don't see their next slot land on the wrong day.
  const todayStr = new Intl.DateTimeFormat('en-CA', { timeZone: timezone }).format(new Date())
  const [y, mo, d] = todayStr.split('-').map(Number)
  const today = new Date(y, mo - 1, d) // midnight local (server) — only the date part matters

  const tomorrow = new Date(today)
  tomorrow.setDate(today.getDate() + 1)

  const daysUntil = (dayOfWeek - tomorrow.getDay() + 7) % 7
  const target = new Date(tomorrow)
  target.setDate(tomorrow.getDate() + daysUntil)

  const ty = target.getFullYear()
  const tm = String(target.getMonth() + 1).padStart(2, '0')
  const td = String(target.getDate()).padStart(2, '0')
  return `${ty}-${tm}-${td}`
}

/** Adds minutes to a "HH:MM" string and returns a "HH:MM" string. */
function addMinutes(time: string, minutes: number): string {
  const [h, m] = time.split(':').map(Number)
  const total = h * 60 + m + minutes
  const hh = String(Math.floor(total / 60) % 24).padStart(2, '0')
  const mm = String(total % 60).padStart(2, '0')
  return `${hh}:${mm}`
}

export async function startCheckout(
  _prevState: CheckoutState,
  formData: FormData
): Promise<CheckoutState> {
  const sessionTypeId = formData.get('session_type_id') as string
  const dayOfWeekRaw = formData.get('day_of_week') as string
  const startTime = (formData.get('start_time') as string).trim()
  const guestName = (formData.get('guest_name') as string).trim()
  const guestEmail = (formData.get('guest_email') as string).trim().toLowerCase()

  if (!guestName) return { ok: false, error: 'Name is required.' }
  if (!guestEmail || !guestEmail.includes('@'))
    return { ok: false, error: 'A valid email is required.' }

  const dayOfWeek = parseInt(dayOfWeekRaw, 10)
  if (isNaN(dayOfWeek) || dayOfWeek < 0 || dayOfWeek > 6)
    return { ok: false, error: 'Invalid day selected.' }

  const supabase = await createClient()

  // Re-fetch session type server-side — never trust client-supplied values.
  const { data: sessionType } = await supabase
    .from('session_types')
    .select('id, coach_id, title, duration_minutes, price_cents, slug')
    .eq('id', sessionTypeId)
    .eq('is_active', true)
    .single()

  if (!sessionType) return { ok: false, error: 'Session not found.' }

  // Enforce free-tier session limit — count all non-cancelled bookings for this coach.
  const SESSION_LIMIT = 10
  const { count: usedCount } = await createServiceClient()
    .from('bookings')
    .select('id', { count: 'exact', head: true })
    .eq('coach_id', sessionType.coach_id)
    .neq('status', 'cancelled')

  if ((usedCount ?? 0) >= SESSION_LIMIT)
    return { ok: false, error: 'This coach has reached their free session limit and cannot accept new bookings at this time.' }

  // Fetch the coach's timezone via the service client — profiles has no public
  // SELECT policy; this action runs server-side only so the service key is safe.
  const { data: profile } = await createServiceClient()
    .from('profiles')
    .select('timezone')
    .eq('id', sessionType.coach_id)
    .single()

  const coachTimezone = profile?.timezone ?? 'UTC'

  // Validate that the submitted start_time is a real slot for this coach/day.
  const { data: rules } = await supabase
    .from('availability_rules')
    .select('start_time, end_time')
    .eq('coach_id', sessionType.coach_id)
    .eq('day_of_week', dayOfWeek)
    .eq('is_active', true)

  const validSlots = (rules ?? []).flatMap((r) =>
    generateSlots(r.start_time, r.end_time, sessionType.duration_minutes)
  )

  if (!validSlots.includes(startTime))
    return { ok: false, error: 'Selected time is no longer available.' }

  const bookingDate = nextOccurrence(dayOfWeek, coachTimezone)
  const endTime = addMinutes(startTime, sessionType.duration_minutes)

  // Conflict check — early fast-fail before touching Stripe.
  // Note: a second conflict check happens in the webhook at booking creation
  // time, but the window between checkout initiation and payment completion
  // is not protected (see race-condition notes in README).
  const { data: isTaken, error: conflictError } = await supabase.rpc(
    'is_slot_taken',
    {
      p_coach_id:     sessionType.coach_id,
      p_booking_date: bookingDate,
      p_start_time:   startTime,
      p_end_time:     endTime,
    }
  )

  if (conflictError)
    return { ok: false, error: 'Could not verify slot availability. Please try again.' }
  if (isTaken)
    return { ok: false, error: 'This time was just booked. Please choose another slot.' }

  // Build the absolute base URL from the incoming request host.
  const headersList = await headers()
  const host = headersList.get('host') ?? 'localhost:3000'
  const proto =
    host.startsWith('localhost') || host.startsWith('127.') ? 'http' : 'https'
  const appUrl = `${proto}://${host}`

  // Create the Stripe Checkout session.
  // All booking data is passed as metadata so the webhook can create the
  // booking row after payment completes — without trusting the client.
  const checkoutSession = await stripe.checkout.sessions.create({
    mode: 'payment',
    customer_email: guestEmail,
    line_items: [
      {
        quantity: 1,
        price_data: {
          currency: 'usd',
          unit_amount: sessionType.price_cents,
          product_data: {
            name: sessionType.title,
            description: `${sessionType.duration_minutes} min session`,
          },
        },
      },
    ],
    metadata: {
      coach_id:        sessionType.coach_id,
      session_type_id: sessionType.id,
      guest_name:      guestName,
      guest_email:     guestEmail,
      booking_date:    bookingDate,
      start_time:      startTime,
      end_time:        endTime,
    },
    success_url: `${appUrl}/book/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url:  `${appUrl}/book/${sessionType.slug}`,
  })

  if (!checkoutSession.url) {
    return { ok: false, error: 'Could not create checkout session. Please try again.' }
  }

  return { ok: true, checkoutUrl: checkoutSession.url }
}

/**
 * Cancels a booking on behalf of an unauthenticated guest.
 * Authorization is via constant-time comparison of the guest_access_token
 * stored on the booking — no auth session required.
 */
export async function cancelBookingAsGuest(formData: FormData): Promise<void> {
  const bookingId  = formData.get('booking_id')  as string
  const guestToken = formData.get('guest_token') as string

  if (!bookingId || !guestToken) throw new Error('Invalid request.')

  const serviceClient = createServiceClient()
  const { data: booking } = await serviceClient
    .from('bookings')
    .select('id, status, guest_access_token')
    .eq('id', bookingId)
    .single()

  if (!booking || !booking.guest_access_token) throw new Error('Booking not found.')

  // Constant-time token comparison — identical to the pattern in session-auth.ts.
  let tokenValid = false
  try {
    const provided = Buffer.from(guestToken, 'hex')
    const stored   = Buffer.from(booking.guest_access_token as string, 'hex')
    if (provided.length === stored.length) {
      tokenValid = timingSafeEqual(provided, stored)
    }
  } catch {
    // Malformed hex — treat as mismatch.
  }

  if (!tokenValid) throw new Error('Invalid token.')

  // If already cancelled, redirect to success — idempotent outcome.
  if (booking.status === 'cancelled') redirect('/cancel/confirmed')

  const { error } = await serviceClient
    .from('bookings')
    .update({ status: 'cancelled' })
    .eq('id', bookingId)

  if (error) throw new Error(`Cancellation failed: ${error.message}`)

  redirect('/cancel/confirmed')
}

export async function cancelBooking(formData: FormData): Promise<void> {
  const bookingId = formData.get('booking_id') as string

  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const { data, error } = await supabase
    .from('bookings')
    .update({ status: 'cancelled' })
    .eq('id', bookingId)
    .eq('coach_id', user.id)
    .select('id')

  if (error) throw new Error(`Cancellation failed: ${error.message}`)
  if (!data || data.length === 0)
    throw new Error('Booking not found or you are not authorised to cancel it.')

  revalidatePath('/dashboard/bookings')
}
