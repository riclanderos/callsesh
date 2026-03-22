import { NextRequest, NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import { createClient } from '@/lib/supabase/server'
import { createServiceClient } from '@/lib/supabase/service'
import { sendGuestConfirmation, sendCoachNotification } from '@/lib/email'
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

    const supabase = await createClient()

    const { error } = await supabase.from('bookings').insert({
      coach_id:                  m.coach_id,
      session_type_id:           m.session_type_id,
      guest_name:                m.guest_name,
      guest_email:               m.guest_email,
      booking_date:              m.booking_date,
      start_time:                m.start_time,
      end_time:                  m.end_time,
      status:                    'confirmed',
      stripe_checkout_session_id: session.id,
    })

    if (error) {
      // 23505 = unique_violation — duplicate webhook delivery; treat as success
      if ((error as { code?: string }).code === '23505') {
        return NextResponse.json({ received: true })
      }
      console.error('Webhook booking insert error:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    // Fetch coach email (requires service role) and session type title in parallel.
    const serviceClient = createServiceClient()
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
      const emailParams = {
        sessionTitle,
        bookingDate:   m.booking_date,
        startTime:     m.start_time,
        endTime:       m.end_time,
        guestName:     m.guest_name,
        guestEmail:    m.guest_email,
        coachEmail,
        coachTimezone,
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
