import { createServiceClient } from '@/lib/supabase/service'

export type PlanKey = 'free' | 'starter' | 'pro'

/** Session limits per plan. Pro uses a large sentinel; treat any value ≥ this as unlimited. */
export const PLAN_LIMITS: Record<PlanKey, number> = {
  free:    10,
  starter: 40,
  pro:     999_999,
}

export const PLAN_NAMES: Record<PlanKey, string> = {
  free:    'Free',
  starter: 'Starter',
  pro:     'Pro',
}

/**
 * Returns the authenticated user's current plan and effective session limit.
 *
 * For paid plans (Starter / Pro) the limit comes from PLAN_LIMITS.
 *
 * For the free plan the limit comes from the launch offer:
 *   - If the coach was granted the offer, it hasn't expired, and sessions remain → limit = 10.
 *   - Otherwise → limit = 0 (no free sessions; coach must subscribe to accept bookings).
 *
 * This means coaches who were not granted the launch offer effectively cannot
 * accept bookings on the free plan and are prompted to subscribe.
 */
export async function getUserPlan(
  userId: string
): Promise<{ planKey: PlanKey; sessionLimit: number; planName: string }> {
  const svc = createServiceClient()

  const [{ data: sub }, { data: profile }] = await Promise.all([
    svc
      .from('subscriptions')
      .select('plan_key, status')
      .eq('user_id', userId)
      .in('status', ['active', 'trialing'])
      .maybeSingle(),
    svc
      .from('profiles')
      .select('launch_offer_eligible, launch_offer_sessions_remaining, launch_offer_expires_at')
      .eq('id', userId)
      .maybeSingle(),
  ])

  const planKey: PlanKey =
    sub?.plan_key === 'starter' ? 'starter'
    : sub?.plan_key === 'pro'   ? 'pro'
    : 'free'

  // Paid plans use fixed limits regardless of offer state.
  if (planKey !== 'free') {
    return { planKey, sessionLimit: PLAN_LIMITS[planKey], planName: PLAN_NAMES[planKey] }
  }

  // Free plan: session limit is the launch offer allowance — or 0 if the offer
  // was never granted, has expired, or the covered sessions are exhausted.
  const now = new Date()
  const notExpired =
    !profile?.launch_offer_expires_at ||
    new Date(profile.launch_offer_expires_at) > now

  const offerActive =
    profile?.launch_offer_eligible === true &&
    notExpired &&
    (profile?.launch_offer_sessions_remaining ?? 0) > 0

  return {
    planKey: 'free',
    sessionLimit: offerActive ? PLAN_LIMITS.free : 0,
    planName: PLAN_NAMES.free,
  }
}
