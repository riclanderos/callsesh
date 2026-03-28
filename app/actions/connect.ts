'use server'

import { redirect } from 'next/navigation'
import { headers } from 'next/headers'
import { createClient } from '@/lib/supabase/server'
import { createServiceClient } from '@/lib/supabase/service'
import { stripe } from '@/lib/stripe'
import { syncStripeAccountStatus } from '@/lib/stripe-sync'

async function getAppUrl(): Promise<string> {
  const h = await headers()
  const host = h.get('host') ?? 'localhost:3000'
  const proto = host.startsWith('localhost') || host.startsWith('127.') ? 'http' : 'https'
  return `${proto}://${host}`
}

async function getOrCreateStripeAccountId(userId: string): Promise<string> {
  const svc = createServiceClient()
  const { data: profile } = await svc
    .from('profiles')
    .select('stripe_account_id')
    .eq('id', userId)
    .maybeSingle()

  let accountId = profile?.stripe_account_id ?? null

  if (!accountId) {
    const account = await stripe.accounts.create({ type: 'express' })
    accountId = account.id
    await svc
      .from('profiles')
      .update({ stripe_account_id: accountId })
      .eq('id', userId)
  }

  return accountId
}

/**
 * Creates or resumes a Stripe Express Connect onboarding session for the coach.
 * - If no stripe_account_id exists on the profile, creates a new Express account and stores it.
 * - Always generates a fresh account link so the URL is never stale.
 * - On completion, Stripe redirects to /dashboard?payout_setup=1.
 * - On refresh/timeout, Stripe redirects back to /dashboard so the coach can retry.
 */
export async function startConnectOnboarding(): Promise<void> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const appUrl = await getAppUrl()
  const accountId = await getOrCreateStripeAccountId(user.id)

  // Sync current status before generating the link so the DB is never stale
  // if the user bails out of onboarding without completing it.
  await syncStripeAccountStatus(user.id, accountId)

  const accountLink = await stripe.accountLinks.create({
    account: accountId,
    refresh_url: `${appUrl}/dashboard`,
    return_url: `${appUrl}/dashboard?payout_refresh=1`,
    type: 'account_onboarding',
  })

  redirect(accountLink.url)
}

/**
 * Opens the Stripe-hosted payout management UI for a coach with an existing account.
 * - For Express accounts that have completed onboarding, generates a login link to the
 *   Express dashboard where they can view payouts, update bank details, etc.
 * - Falls back to an account_update link if the account isn't eligible for login links yet.
 */
export async function managePayouts(): Promise<void> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await createServiceClient()
    .from('profiles')
    .select('stripe_account_id')
    .eq('id', user.id)
    .maybeSingle()

  const accountId = profile?.stripe_account_id ?? null
  if (!accountId) redirect('/dashboard')

  const appUrl = await getAppUrl()

  // Sync current Stripe status into DB before redirecting so the dashboard
  // reflects the latest state when the coach returns.
  await syncStripeAccountStatus(user.id, accountId)

  try {
    // Express accounts support login links — opens the Stripe Express dashboard.
    // No return_url available for login links; the coach navigates back manually.
    const loginLink = await stripe.accounts.createLoginLink(accountId)
    redirect(loginLink.url)
  } catch {
    // Account not yet eligible for login links (e.g. still under review).
    // Fall back to an account_update link so the coach can review/update their details.
    const accountLink = await stripe.accountLinks.create({
      account: accountId,
      refresh_url: `${appUrl}/dashboard`,
      return_url: `${appUrl}/dashboard?payout_refresh=1`,
      type: 'account_onboarding',
    })
    redirect(accountLink.url)
  }
}
