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
 * Three distinct states:
 *
 * 1. Active paid plan (Starter / Pro, status 'active' or 'trialing'):
 *    sessionLimit = PLAN_LIMITS[planKey], hasLapsedSubscription = false.
 *
 * 2. Lapsed paid plan (subscription row exists but status is not active/trialing):
 *    The coach previously subscribed. Their initial free allowance is permanently
 *    locked — do not restore it. sessionLimit = 0, hasLapsedSubscription = true.
 *
 * 3. Never subscribed (no subscription row at all):
 *    sessionLimit = launch offer allowance (10) if eligible, unexpired, and sessions
 *    remain; otherwise 0. hasLapsedSubscription = false.
 *
 * This ensures the initial 10-session onboarding allowance is a one-time grant,
 * not a permanent fallback that can be re-accessed after cancelling a paid plan.
 */
export async function getUserPlan(
  userId: string
): Promise<{ planKey: PlanKey; sessionLimit: number; planName: string; hasLapsedSubscription: boolean }> {
  const svc = createServiceClient()

  // Fetch the subscription row regardless of status — we need to detect lapsed state.
  const [{ data: sub }, { data: profile }] = await Promise.all([
    svc
      .from('subscriptions')
      .select('plan_key, status')
      .eq('user_id', userId)
      .maybeSingle(),
    svc
      .from('profiles')
      .select('launch_offer_eligible, launch_offer_sessions_remaining, launch_offer_expires_at')
      .eq('id', userId)
      .maybeSingle(),
  ])

  const isActivePaid = sub?.status === 'active' || sub?.status === 'trialing'

  // ── State 1: active paid plan ─────────────────────────────────────────────
  if (isActivePaid) {
    const planKey: PlanKey =
      sub?.plan_key === 'starter' ? 'starter'
      : sub?.plan_key === 'pro'   ? 'pro'
      : 'free'
    if (planKey !== 'free') {
      return { planKey, sessionLimit: PLAN_LIMITS[planKey], planName: PLAN_NAMES[planKey], hasLapsedSubscription: false }
    }
  }

  // ── State 2: lapsed paid plan ─────────────────────────────────────────────
  // A subscription row exists but it is not currently active or trialing.
  // Free allowance is permanently locked — block booking acceptance.
  if (sub && !isActivePaid) {
    return { planKey: 'free', sessionLimit: 0, planName: PLAN_NAMES.free, hasLapsedSubscription: true }
  }

  // ── State 3: never subscribed ─────────────────────────────────────────────
  // No subscription row at all. Apply the one-time launch offer allowance.
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
    hasLapsedSubscription: false,
  }
}
