import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { startSubscription } from '@/app/actions/subscription'

const SESSION_LIMIT = 10

const plans = [
  {
    name: 'Free',
    price: '$0',
    period: '',
    sessions: '10 sessions total',
    description: 'Get started with your first coaching clients at no cost.',
    features: [
      '10 bookings total',
      'All session types',
      'Availability scheduling',
      'Guest booking links',
    ],
    badge: null,
    isCurrent: true,
    ctaLabel: 'Current plan',
    ctaStyle: 'current' as const,
    planKey: null,
    priceClass: 'text-zinc-100',
    sessionsClass: 'text-zinc-300',
  },
  {
    name: 'Starter',
    price: '$19.99',
    period: 'per month',
    sessions: '40 sessions / month',
    description: 'Everything you need to run a growing coaching practice.',
    features: [
      '40 bookings per month',
      'All session types',
      'Availability scheduling',
      'Guest booking links',
    ],
    badge: 'Most popular',
    isCurrent: false,
    ctaLabel: 'Upgrade to Starter',
    ctaStyle: 'primary' as const,
    planKey: 'starter',
    priceClass: 'text-zinc-100',
    sessionsClass: 'text-zinc-300',
  },
  {
    name: 'Pro',
    price: '$49.99',
    period: 'per month',
    sessions: 'Unlimited sessions',
    description: 'Built for coaches running a full-time practice.',
    features: [
      'Unlimited bookings',
      'All session types',
      'Availability scheduling',
      'Guest booking links',
    ],
    badge: null,
    isCurrent: false,
    ctaLabel: 'Upgrade to Pro',
    ctaStyle: 'secondary' as const,
    planKey: 'pro',
    priceClass: 'text-zinc-300',
    sessionsClass: 'text-zinc-500',
  },
]

export default async function UpgradePage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  let remaining = SESSION_LIMIT

  if (user) {
    const { count } = await supabase
      .from('bookings')
      .select('id', { count: 'exact', head: true })
      .eq('coach_id', user.id)
      .neq('status', 'cancelled')
    remaining = SESSION_LIMIT - (count ?? 0)
  }

  const isBlocked = remaining <= 0

  return (
    <div className="min-h-screen px-6 py-16">
      <div className="mx-auto max-w-5xl space-y-12">

        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-semibold text-zinc-100">Choose a plan</h1>
          <p className="text-sm text-zinc-500">
            {isBlocked
              ? "You've used all your free sessions. Upgrade to keep accepting bookings."
              : 'Choose a plan to grow your coaching business.'}
          </p>
        </div>

        {/* Plan cards */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`relative rounded-xl border p-6 space-y-6 ${
                plan.badge
                  ? 'border-indigo-700 bg-indigo-950/30'
                  : 'border-zinc-800 bg-zinc-900'
              }`}
            >
              {plan.badge && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full border border-indigo-700 bg-indigo-950 px-3 py-0.5 text-xs font-medium text-indigo-300">
                  {plan.badge}
                </span>
              )}

              {plan.isCurrent && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full border border-zinc-700 bg-zinc-900 px-3 py-0.5 text-xs font-medium text-zinc-400">
                  Current plan
                </span>
              )}

              {/* Plan name + price */}
              <div className="space-y-1">
                <p className="text-xs font-medium uppercase tracking-wider text-zinc-500">
                  {plan.name}
                </p>
                <div className="flex items-baseline gap-1.5">
                  <span className={`text-3xl font-bold ${plan.priceClass}`}>{plan.price}</span>
                  {plan.period && (
                    <span className="text-sm text-zinc-500">{plan.period}</span>
                  )}
                </div>
                <p className={`text-sm font-medium ${plan.sessionsClass}`}>{plan.sessions}</p>
              </div>

              {/* Description */}
              <p className="text-sm text-zinc-400 leading-relaxed">{plan.description}</p>

              {/* Features */}
              <ul className="space-y-2">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-center gap-2 text-sm text-zinc-400">
                    <span className="text-zinc-600">—</span>
                    {f}
                  </li>
                ))}
              </ul>

              {/* CTA */}
              {plan.ctaStyle === 'current' && (
                <button
                  type="button"
                  disabled
                  className="w-full rounded-lg border border-zinc-700 bg-zinc-800 py-2.5 text-sm font-semibold text-zinc-500 cursor-default"
                >
                  {plan.ctaLabel}
                </button>
              )}
              {plan.ctaStyle === 'primary' && (
                <form action={startSubscription}>
                  <input type="hidden" name="plan" value={plan.planKey!} />
                  <button
                    type="submit"
                    className="w-full rounded-lg bg-indigo-600 py-2.5 text-sm font-semibold text-white hover:bg-indigo-500 transition-colors"
                  >
                    {plan.ctaLabel}
                  </button>
                </form>
              )}
              {plan.ctaStyle === 'secondary' && (
                <form action={startSubscription}>
                  <input type="hidden" name="plan" value={plan.planKey!} />
                  <button
                    type="submit"
                    className="w-full rounded-lg border border-zinc-700 bg-zinc-800 py-2.5 text-sm font-semibold text-zinc-200 hover:border-zinc-600 hover:text-zinc-100 transition-colors"
                  >
                    {plan.ctaLabel}
                  </button>
                </form>
              )}
            </div>
          ))}
        </div>

        {/* Footer */}
        <p className="text-center text-xs text-zinc-600">
          <Link href="/dashboard" className="text-zinc-500 hover:text-zinc-300 transition-colors">
            Back to dashboard →
          </Link>
        </p>

      </div>
    </div>
  )
}
