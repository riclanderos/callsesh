import { createServiceClient } from '@/lib/supabase/service'
import { stripe } from '@/lib/stripe'

/**
 * Retrieves the current Stripe account status and writes it back to profiles.
 * Call this whenever returning from a Stripe-hosted onboarding or management
 * flow so the DB reflects what Stripe just recorded.
 *
 * Non-fatal: if Stripe is unreachable the DB retains its last known state and
 * the next successful call will catch up.
 */
export async function syncStripeAccountStatus(
  userId: string,
  accountId: string,
): Promise<void> {
  try {
    const acct = await stripe.accounts.retrieve(accountId)
    await createServiceClient()
      .from('profiles')
      .update({
        stripe_payouts_enabled: acct.payouts_enabled ?? false,
        stripe_charges_enabled: acct.charges_enabled ?? false,
      })
      .eq('id', userId)
  } catch {
    // Non-fatal — dashboard will show the last DB state.
  }
}
