'use server'

import { redirect } from 'next/navigation'
import { headers } from 'next/headers'
import { createClient } from '@/lib/supabase/server'
import { stripe } from '@/lib/stripe'

const PRICE_IDS: Record<string, string | undefined> = {
  starter: process.env.STRIPE_PRICE_STARTER,
  pro:     process.env.STRIPE_PRICE_PRO,
}

export async function startSubscription(formData: FormData): Promise<void> {
  const plan = formData.get('plan')

  if (plan !== 'starter' && plan !== 'pro') {
    throw new Error('Invalid plan.')
  }

  const priceId = PRICE_IDS[plan]
  if (!priceId) {
    throw new Error(`Stripe price ID for plan "${plan}" is not configured. Set STRIPE_PRICE_${plan.toUpperCase()} in your environment.`)
  }

  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const headersList = await headers()
  const host = headersList.get('host') ?? 'localhost:3000'
  const proto = host.startsWith('localhost') || host.startsWith('127.') ? 'http' : 'https'
  const appUrl = `${proto}://${host}`

  const session = await stripe.checkout.sessions.create({
    mode: 'subscription',
    customer_email: user.email,
    client_reference_id: user.id,
    line_items: [{ price: priceId, quantity: 1 }],
    metadata: { user_id: user.id, plan },
    success_url: `${appUrl}/dashboard?upgraded=1`,
    cancel_url:  `${appUrl}/upgrade`,
  })

  if (!session.url) throw new Error('Stripe did not return a checkout URL.')

  redirect(session.url)
}
