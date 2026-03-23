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
 * Returns the authenticated user's current plan and session limit.
 * Defaults to the Free plan if no active paid subscription exists.
 * Uses the service client — safe to call from server actions and server components.
 */
export async function getUserPlan(
  userId: string
): Promise<{ planKey: PlanKey; sessionLimit: number; planName: string }> {
  const { data } = await createServiceClient()
    .from('subscriptions')
    .select('plan_key, status')
    .eq('user_id', userId)
    .in('status', ['active', 'trialing'])
    .maybeSingle()

  const planKey: PlanKey =
    data?.plan_key === 'starter' ? 'starter'
    : data?.plan_key === 'pro'   ? 'pro'
    : 'free'

  return {
    planKey,
    sessionLimit: PLAN_LIMITS[planKey],
    planName:     PLAN_NAMES[planKey],
  }
}
