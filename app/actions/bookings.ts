'use server'

import { timingSafeEqual } from 'crypto'
import { createClient } from '@/lib/supabase/server'
import { createServiceClient } from '@/lib/supabase/service'
import { getUserPlan } from '@/lib/plan'
import { generateSlots } from '@/lib/slots'
import { stripe } from '@/lib/stripe'
import {
  sendGuestCancelledByGuest,
  sendCoachGuestCancelled,
  sendGuestCancelledByCoach,
  type CancellationEmailParams,
} from '@/lib/email'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { headers } from 'next/headers'
import { dateToDayOfWeek } from '@/lib/booking'

export type CheckoutState =
  | null
  | { ok: true; checkoutUrl: string }
  | { ok: false; error: string }

/** Minimum minutes ahead a slot must start to be accepted server-side. */
const LEAD_TIME_MINUTES = 5


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
  const bookingDate = (formData.get('booking_date') as string).trim()
  const startTime = (formData.get('start_time') as string).trim()
  const guestName = (formData.get('guest_name') as string).trim()
  const guestEmail = (formData.get('guest_email') as string).trim().toLowerCase()
  // IANA timezone string detected in the browser; used for display only (not stored).
  const guestTimezone = ((formData.get('guest_timezone') as string) ?? '').trim()
  const clientMessage = ((formData.get('client_message') as string) ?? '').trim().slice(0, 300)

  if (!guestName) return { ok: false, error: 'Name is required.' }
  if (!guestEmail || !guestEmail.includes('@'))
    return { ok: false, error: 'A valid email is required.' }

  if (!/^\d{4}-\d{2}-\d{2}$/.test(bookingDate))
    return { ok: false, error: 'Invalid booking date.' }

  const dayOfWeek = dateToDayOfWeek(bookingDate)

  const supabase = await createClient()

  // Re-fetch session type server-side — never trust client-supplied values.
  const { data: sessionType } = await supabase
    .from('session_types')
    .select('id, coach_id, title, duration_minutes, price_cents, slug')
    .eq('id', sessionTypeId)
    .eq('is_active', true)
    .single()

  if (!sessionType) return { ok: false, error: 'Session not found.' }

  // Enforce plan session limit — resolve the coach's current plan then count usage.
  const [{ sessionLimit }, { count: usedCount }] = await Promise.all([
    getUserPlan(sessionType.coach_id),
    createServiceClient()
      .from('bookings')
      .select('id', { count: 'exact', head: true })
      .eq('coach_id', sessionType.coach_id)
      .neq('status', 'cancelled'),
  ])

  if ((usedCount ?? 0) >= sessionLimit)
    return { ok: false, error: 'This coach has reached their session limit and cannot accept new bookings at this time.' }

  // Fetch the coach's timezone and Stripe account via the service client —
  // profiles has no public SELECT policy; service key is safe here.
  const { data: profile } = await createServiceClient()
    .from('profiles')
    .select('timezone, stripe_account_id')
    .eq('id', sessionType.coach_id)
    .single()

  if (!profile?.stripe_account_id)
    return { ok: false, error: 'This coach has not connected a payment account and cannot accept bookings at this time.' }

  const coachTimezone = profile.timezone ?? 'UTC'
  const coachStripeAccountId = profile.stripe_account_id

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
    return { ok: false, error: 'This time slot is no longer available.' }

  const endTime = addMinutes(startTime, sessionType.duration_minutes)

  // Reject dates in the past and same-day slots that are too close to the current time.
  const todayInCoachTz = new Intl.DateTimeFormat('en-CA', { timeZone: coachTimezone }).format(new Date())
  if (bookingDate < todayInCoachTz)
    return { ok: false, error: 'This time slot is no longer available.' }
  if (bookingDate === todayInCoachTz) {
    const nowParts = new Intl.DateTimeFormat('en-US', {
      timeZone: coachTimezone, hour: 'numeric', minute: '2-digit', hour12: false,
    }).formatToParts(new Date())
    const nowH = parseInt(nowParts.find((p) => p.type === 'hour')?.value ?? '0', 10) % 24
    const nowM = parseInt(nowParts.find((p) => p.type === 'minute')?.value ?? '0', 10)
    const nowMinutes = nowH * 60 + nowM
    const [slotH, slotM] = startTime.split(':').map(Number)
    const slotMinutes = slotH * 60 + slotM
    if (slotMinutes < nowMinutes + LEAD_TIME_MINUTES)
      return { ok: false, error: 'This time slot is no longer available.' }
  }

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
    return { ok: false, error: 'This time slot is no longer available.' }

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
      coach_timezone:  coachTimezone,
      guest_timezone:  guestTimezone,
      ...(clientMessage ? { client_message: clientMessage } : {}),
    },
    payment_intent_data: {
      application_fee_amount: Math.round(sessionType.price_cents * 0.1),
      transfer_data: {
        destination: coachStripeAccountId,
      },
    },
    success_url: `${appUrl}/book/success?session_id={CHECKOUT_SESSION_ID}&slug=${sessionType.slug}${guestTimezone ? `&ctz=${encodeURIComponent(guestTimezone)}` : ''}`,
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
    .select('id, status, guest_access_token, coach_id, session_type_id, guest_name, guest_email, booking_date, start_time, end_time')
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

  // Send cancellation emails after successful update.
  try {
    const [{ data: sessionType }, { data: coachUser }, { data: profileData }] = await Promise.all([
      serviceClient.from('session_types').select('title').eq('id', booking.session_type_id).single(),
      serviceClient.auth.admin.getUserById(booking.coach_id),
      serviceClient.from('profiles').select('timezone').eq('id', booking.coach_id).single(),
    ])
    const coachEmail = coachUser.user?.email ?? ''
    const emailParams: CancellationEmailParams = {
      sessionTitle:  sessionType?.title ?? 'Session',
      bookingDate:   booking.booking_date,
      startTime:     booking.start_time,
      endTime:       booking.end_time,
      guestName:     booking.guest_name,
      guestEmail:    booking.guest_email,
      coachEmail,
      coachTimezone: profileData?.timezone ?? 'UTC',
    }
    console.log('Sending guest cancellation email', { bookingId, guestEmail: booking.guest_email })
    try {
      await sendGuestCancelledByGuest(emailParams)
    } catch (e) {
      console.error('[cancel] Guest cancellation email failed:', e)
    }
    if (coachEmail) {
      console.log('Sending coach cancellation email', { bookingId, coachEmail })
      try {
        await sendCoachGuestCancelled(emailParams)
      } catch (e) {
        console.error('[cancel] Coach notification email failed:', e)
      }
    } else {
      console.warn('[cancel] Coach email not found — skipping coach notification', { coach_id: booking.coach_id })
    }
  } catch (e) {
    console.error('[cancel] Cancellation email prep failed:', e)
  }

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
    .select('id, session_type_id, guest_name, guest_email, booking_date, start_time, end_time')

  if (error) throw new Error(`Cancellation failed: ${error.message}`)
  if (!data || data.length === 0)
    throw new Error('Booking not found or you are not authorised to cancel it.')

  // Send cancellation email to guest only (coach-initiated).
  try {
    const svc = createServiceClient()
    const [{ data: sessionType }, { data: profileData }, { data: coachUser }] = await Promise.all([
      svc.from('session_types').select('title').eq('id', data[0].session_type_id).single(),
      svc.from('profiles').select('timezone').eq('id', user.id).single(),
      svc.auth.admin.getUserById(user.id),
    ])
    const emailParams: CancellationEmailParams = {
      sessionTitle:  sessionType?.title ?? 'Session',
      bookingDate:   data[0].booking_date,
      startTime:     data[0].start_time,
      endTime:       data[0].end_time,
      guestName:     data[0].guest_name,
      guestEmail:    data[0].guest_email,
      coachEmail:    coachUser.user?.email ?? '',
      coachTimezone: profileData?.timezone ?? 'UTC',
    }
    console.log('Sending guest cancellation email', { bookingId, guestEmail: data[0].guest_email, initiator: 'coach' })
    await sendGuestCancelledByCoach(emailParams)
  } catch (e) {
    console.error('[cancel] Guest cancellation email failed:', e)
  }

  revalidatePath('/dashboard/bookings')
}
