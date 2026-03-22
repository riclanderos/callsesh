import { NextRequest, NextResponse } from 'next/server'
import { randomBytes } from 'crypto'
import { stripe } from '@/lib/stripe'
import { createServiceClient } from '@/lib/supabase/service'
import { sendGuestConfirmation, sendCoachNotification } from '@/lib/email'
import { provisionDailyRoom } from '@/lib/daily'
import Stripe from 'stripe'

export async function POST(req: NextRequest): Promise<NextResponse> {
  const body = await req.text()
  const sig = req.headers.get('stripe-signature') ?? ''
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET

  if (!webhookSecret) {
    return NextResponse.json({ error: 'Webhook secret not configured.' }, { status: 500 })
  }

  let event: Stripe.Event
  try {
    event = stripe.webhooks.constructEvent(body, sig, webhookSecret)
  } catch {
    return NextResponse.json({ error: 'Invalid signature.' }, { status: 400 })
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session
    const m = session.metadata

    if (
      !m?.coach_id ||
      !m?.session_type_id ||
      !m?.guest_name ||
      !m?.guest_email ||
      !m?.booking_date ||
      !m?.start_time ||
      !m?.end_time
    ) {
      return NextResponse.json({ error: 'Missing metadata.' }, { status: 400 })
    }

    const serviceClient = createServiceClient()

    const generatedToken = randomBytes(32).toString('hex')
    console.log('[webhook] generated guest_access_token length:', generatedToken.length)

    const { error: insertError } = await serviceClient.from('bookings').insert({
      coach_id:                   m.coach_id,
      session_type_id:            m.session_type_id,
      guest_name:                 m.guest_name,
      guest_email:                m.guest_email,
      booking_date:               m.booking_date,
      start_time:                 m.start_time,
      end_time:                   m.end_time,
      status:                     'confirmed',
      stripe_checkout_session_id: session.id,
      guest_access_token:         generatedToken,
    })

    console.log('[webhook] insert error:', insertError ?? 'none')

    if (insertError) {
      if ((insertError as { code?: string }).code === '23505') {
        // Duplicate webhook delivery — booking already exists.
        // Check whether the Daily room was created in the previous delivery.
        const { data: existing } = await serviceClient
          .from('bookings')
          .select('id, daily_room_name')
          .eq('stripe_checkout_session_id', session.id)
          .single()

        if (!existing) {
          // Booking not found — transient DB read failure. Return 500 so
          // Stripe retries rather than permanently dropping room creation.
          console.error('Duplicate webhook but could not find booking for session:', session.id)
          return NextResponse.json({ error: 'Booking lookup failed.' }, { status: 500 })
        }

        if (existing.daily_room_name) {
          // Fully processed — nothing left to do.
          return NextResponse.json({ received: true })
        }

        // Room is missing (previous delivery crashed after insert).
        // Create it now; do not re-send emails.
        await provisionDailyRoom(existing.id)
        return NextResponse.json({ received: true })
      }

      console.error('Webhook booking insert error:', insertError)
      return NextResponse.json({ error: insertError.message }, { status: 500 })
    }

    // Fresh insert succeeded. Resolve the new booking's UUID via the
    // stripe_checkout_session_id (service client bypasses RLS).
    const { data: newBooking, error: selectError } = await serviceClient
      .from('bookings')
      .select('id, guest_access_token')
      .eq('stripe_checkout_session_id', session.id)
      .single()

    console.log('[webhook] post-insert select error:', selectError ?? 'none')
    console.log('[webhook] post-insert guest_access_token:', newBooking
      ? (newBooking.guest_access_token === null
          ? 'NULL — column missing or migration not applied'
          : `present, length ${(newBooking.guest_access_token as string).length}`)
      : 'row not found')

    if (newBooking) {
      try {
        await provisionDailyRoom(newBooking.id)
      } catch (e) {
        console.error('Daily room provisioning failed for booking', newBooking.id, e)
        return NextResponse.json({ error: 'Daily room provisioning failed.' }, { status: 500 })
      }
    } else {
      // Booking row not found immediately after insert — transient DB read
      // failure. Return 500 so Stripe retries and the 23505 path recovers.
      console.error('Could not resolve booking id after insert for session:', session.id)
      return NextResponse.json({ error: 'Booking lookup failed after insert.' }, { status: 500 })
    }

    // Fetch coach email, session title, and timezone in parallel.
    const [{ data: coachData }, { data: sessionType }, { data: profile }] = await Promise.all([
      serviceClient.auth.admin.getUserById(m.coach_id),
      serviceClient
        .from('session_types')
        .select('title')
        .eq('id', m.session_type_id)
        .single(),
      serviceClient
        .from('profiles')
        .select('timezone')
        .eq('id', m.coach_id)
        .single(),
    ])

    const coachEmail = coachData.user?.email
    const sessionTitle = sessionType?.title ?? 'Session'
    const coachTimezone = profile?.timezone ?? 'UTC'

    if (coachEmail) {
      const appUrl = process.env.APP_URL ?? ''
      const guestSessionUrl = `${appUrl}/session/${newBooking.id}?guestToken=${newBooking.guest_access_token ?? ''}`
      const guestCancelUrl  = `${appUrl}/cancel/${newBooking.id}?guestToken=${newBooking.guest_access_token ?? ''}`
      const emailParams = {
        sessionTitle,
        bookingDate:   m.booking_date,
        startTime:     m.start_time,
        endTime:       m.end_time,
        guestName:     m.guest_name,
        guestEmail:    m.guest_email,
        coachEmail,
        coachTimezone,
        guestSessionUrl,
        guestCancelUrl,
      }
      await Promise.all([
        sendGuestConfirmation(emailParams).catch((e) =>
          console.error('Guest confirmation email failed:', e)
        ),
        sendCoachNotification(emailParams).catch((e) =>
          console.error('Coach notification email failed:', e)
        ),
      ])
    } else {
      console.error('Could not resolve coach email for booking notification:', m.coach_id)
    }
  }

  return NextResponse.json({ received: true })
}

