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

    // Subscription checkout — upsert the user's subscription record.
    if (session.mode === 'subscription') {
      const userId       = session.client_reference_id ?? session.metadata?.user_id ?? null
      const customerId   = typeof session.customer    === 'string' ? session.customer    : session.customer?.id    ?? null
      const subId        = typeof session.subscription === 'string' ? session.subscription : session.subscription?.id ?? null
      const planKey      = session.metadata?.plan ?? 'free'

      console.log('[webhook] subscription checkout.session.completed', {
        event_id: event.id, checkout_session_id: session.id,
        user_id: userId, customer_id: customerId,
        subscription_id: subId, plan: planKey,
        customer_email: session.customer_details?.email ?? null,
      })

      if (userId && customerId && subId) {
        const sub = await stripe.subscriptions.retrieve(subId)
        const periodEnd = sub.items.data[0]?.current_period_end ?? null
        const { error } = await createServiceClient()
          .from('subscriptions')
          .upsert({
            user_id:                userId,
            stripe_customer_id:     customerId,
            stripe_subscription_id: subId,
            plan_key:               planKey,
            status:                 sub.status,
            current_period_end:     periodEnd ? new Date(periodEnd * 1000).toISOString() : null,
            updated_at:             new Date().toISOString(),
          }, { onConflict: 'user_id' })
        if (error) console.error('[webhook] subscription upsert error:', error.message)
        else console.log('[webhook] subscription upserted for user:', userId)
      } else {
        console.error('[webhook] subscription checkout missing ids — skipping upsert', { userId, customerId, subId })
      }

      return NextResponse.json({ received: true })
    }

    // One-time payment checkout (booking flow) — original handling below.
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
          // No booking found for this checkout session ID. This means the
          // unique_booking_slot index rejected the insert because a *different*
          // guest already booked the same slot. Returning 200 prevents Stripe
          // from retrying — retries cannot resolve a genuine slot conflict.
          console.error(
            '[webhook] slot conflict: unique_booking_slot violation for a different checkout session',
            { checkout_session_id: session.id, coach_id: m.coach_id, booking_date: m.booking_date, start_time: m.start_time }
          )
          return NextResponse.json({ received: true, conflict: 'slot_taken' })
        }

        if (existing.daily_room_name) {
          // Fully processed — nothing left to do.
          return NextResponse.json({ received: true })
        }

        // Room is missing (previous delivery crashed after insert).
        // Create it now; do not re-send emails.
        try {
          await provisionDailyRoom(existing.id)
        } catch (e) {
          console.error('Daily room provisioning failed (retry path) for booking', existing.id, e)
          return NextResponse.json({ error: 'Daily room provisioning failed.' }, { status: 500 })
        }
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

    // Re-fetch booking after provisioning to get daily_room_url and confirm status.
    const { data: confirmedBooking } = await serviceClient
      .from('bookings')
      .select('id, status, guest_access_token, daily_room_url')
      .eq('id', newBooking.id)
      .single()

    if (confirmedBooking?.status !== 'confirmed') {
      console.error('[webhook] Booking not confirmed after insert — skipping email', {
        booking_id: newBooking.id,
        status: confirmedBooking?.status ?? 'not found',
      })
      return NextResponse.json({ received: true })
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
      const guestSessionUrl = confirmedBooking.daily_room_url
        ?? `${appUrl}/session/${confirmedBooking.id}?guestToken=${confirmedBooking.guest_access_token ?? ''}`
      const guestCancelUrl  = `${appUrl}/cancel/${confirmedBooking.id}?guestToken=${confirmedBooking.guest_access_token ?? ''}`
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
      console.log('[webhook] Sending confirmation email', { booking_id: confirmedBooking.id, guest_email: m.guest_email })
      try {
        await Promise.all([
          sendGuestConfirmation(emailParams),
          sendCoachNotification(emailParams),
        ])
      } catch (e) {
        console.error('[webhook] Confirmation email failed:', e)
      }
    } else {
      console.error('Could not resolve coach email for booking notification:', m.coach_id)
    }
  }

  if (event.type === 'invoice.payment_succeeded') {
    const invoice = event.data.object as Stripe.Invoice
    const subDetails = invoice.parent?.type === 'subscription_details'
      ? invoice.parent.subscription_details
      : null
    const subIdRaw = subDetails?.subscription ?? null
    const subId    = typeof subIdRaw === 'string' ? subIdRaw : subIdRaw?.id ?? null
    const customerId = typeof invoice.customer === 'string' ? invoice.customer : invoice.customer?.id ?? null

    console.log('[webhook] invoice.payment_succeeded', {
      event_id:        event.id,
      invoice_id:      invoice.id,
      subscription_id: subId,
      customer_id:     customerId,
      customer_email:  invoice.customer_email ?? null,
      amount_paid:     invoice.amount_paid,
      currency:        invoice.currency,
      billing_reason:  invoice.billing_reason,
    })

    if (subId) {
      const sub = await stripe.subscriptions.retrieve(subId)
      const periodEnd = sub.items.data[0]?.current_period_end ?? null
      const { error } = await createServiceClient()
        .from('subscriptions')
        .update({
          status:             sub.status,
          current_period_end: periodEnd ? new Date(periodEnd * 1000).toISOString() : null,
          updated_at:         new Date().toISOString(),
        })
        .eq('stripe_subscription_id', subId)
      if (error) console.error('[webhook] invoice subscription update error:', error.message)
      else console.log('[webhook] subscription renewed for sub:', subId)
    }

    return NextResponse.json({ received: true })
  }

  if (event.type === 'customer.subscription.updated') {
    const sub = event.data.object as Stripe.Subscription
    console.log('Subscription updated', {
      event_id:             event.id,
      subscription_id:      sub.id,
      status:               sub.status,
      cancel_at_period_end: sub.cancel_at_period_end,
      current_period_end:   sub.items.data[0]?.current_period_end ?? null,
    })
    const { error } = await createServiceClient()
      .from('subscriptions')
      .update({
        status:               sub.status,
        cancel_at_period_end: sub.cancel_at_period_end,
        current_period_end:   sub.items.data[0]?.current_period_end
          ? new Date(sub.items.data[0].current_period_end * 1000).toISOString()
          : null,
        updated_at:           new Date().toISOString(),
      })
      .eq('stripe_subscription_id', sub.id)
    if (error) console.error('[webhook] customer.subscription.updated error:', error.message)
    return NextResponse.json({ received: true })
  }

  if (event.type === 'customer.subscription.deleted') {
    const sub = event.data.object as Stripe.Subscription
    console.log('Subscription deleted', { event_id: event.id, subscription_id: sub.id })
    const { error } = await createServiceClient()
      .from('subscriptions')
      .update({
        status:               'canceled',
        cancel_at_period_end: false,
        updated_at:           new Date().toISOString(),
      })
      .eq('stripe_subscription_id', sub.id)
    if (error) console.error('[webhook] customer.subscription.deleted error:', error.message)
    return NextResponse.json({ received: true })
  }

  if (event.type === 'subscription_schedule.updated') {
    const schedule = event.data.object as Stripe.SubscriptionSchedule
    const subIdRaw = schedule.subscription
    const subId = typeof subIdRaw === 'string' ? subIdRaw : subIdRaw?.id ?? null

    console.log('[webhook] subscription_schedule.updated — raw', {
      event_id:        event.id,
      schedule_id:     schedule.id,
      subscription_id: subId,
      phase_count:     (schedule.phases ?? []).length,
    })

    if (subId) {
      const now = Math.floor(Date.now() / 1000)
      const phases = schedule.phases ?? []

      // Normalize price to its ID regardless of whether Stripe expanded it.
      const toPriceId = (p: string | Stripe.Price | Stripe.DeletedPrice | null | undefined): string | null => {
        if (!p) return null
        return typeof p === 'string' ? p : p.id
      }

      // Current phase: started in the past. end_date may be null on the last phase —
      // treat null end_date as "still active" so the fallback works correctly.
      const currentPhase = phases.find(
        (p) => p.start_date <= now && (p.end_date === null || p.end_date > now)
      )
      const currentPriceId = toPriceId(currentPhase?.items[0]?.price)

      const futurePhases = phases.filter((p) => p.start_date > now)
      const futurePriceIds = futurePhases.map((p) => toPriceId(p.items[0]?.price))

      // Future phase: starts in the future and carries a different price.
      const hasFuturePhase = futurePriceIds.some((id) => id !== currentPriceId)

      console.log('[webhook] subscription_schedule.updated — phase analysis', {
        event_id:                       event.id,
        schedule_id:                    schedule.id,
        subscription_id:                subId,
        now,
        current_phase_start:            currentPhase?.start_date ?? null,
        current_phase_end:              currentPhase?.end_date ?? null,
        current_price_id:               currentPriceId,
        future_phase_price_ids:         futurePriceIds,
        has_future_phase_diff_price:    hasFuturePhase,
      })

      const updateResult = await createServiceClient()
        .from('subscriptions')
        .update({
          cancel_at_period_end: hasFuturePhase,
          updated_at:           new Date().toISOString(),
        })
        .eq('stripe_subscription_id', subId)

      console.log('[webhook] subscription_schedule.updated — supabase update result', {
        event_id:             event.id,
        subscription_id:      subId,
        cancel_at_period_end: hasFuturePhase,
        error:                updateResult.error?.message ?? null,
        status:               updateResult.status,
        count:                updateResult.count,
      })
    } else {
      console.warn('[webhook] subscription_schedule.updated — no subscription_id resolved, skipping update', {
        event_id:    event.id,
        schedule_id: schedule.id,
      })
    }

    return NextResponse.json({ received: true })
  }

  return NextResponse.json({ received: true })
}

