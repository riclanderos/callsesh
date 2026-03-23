import Link from 'next/link'

const plans = [
  {
    name: 'Starter',
    price: '$19.99',
    period: 'per month',
    sessions: 'Up to 40 sessions',
    description: 'Everything you need to start coaching clients online.',
    features: ['40 bookings per month', 'All session types', 'Availability scheduling', 'Guest booking links'],
    highlight: true,
    cta: 'Upgrade to Starter',
  },
  {
    name: 'Pro',
    price: '$49.99',
    period: 'per month',
    sessions: 'Unlimited sessions',
    description: 'Built for coaches running a full-time practice.',
    features: ['Unlimited bookings', 'All session types', 'Availability scheduling', 'Guest booking links'],
    highlight: false,
    cta: 'Upgrade to Pro',
  },
]

export default function UpgradePage() {
  return (
    <div className="min-h-screen px-6 py-16">
      <div className="mx-auto max-w-3xl space-y-12">

        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-semibold text-zinc-100">Choose a plan</h1>
          <p className="text-sm text-zinc-500">
            Your free sessions have been used. Pick a plan to keep accepting bookings.
          </p>
        </div>

        {/* Plan cards */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`relative rounded-xl border p-6 space-y-6 ${
                plan.highlight
                  ? 'border-indigo-700 bg-indigo-950/30'
                  : 'border-zinc-800 bg-zinc-900'
              }`}
            >
              {plan.highlight && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full border border-indigo-700 bg-indigo-950 px-3 py-0.5 text-xs font-medium text-indigo-300">
                  Recommended
                </span>
              )}

              {/* Plan name + price */}
              <div className="space-y-1">
                <p className="text-xs font-medium uppercase tracking-wider text-zinc-500">{plan.name}</p>
                <div className="flex items-baseline gap-1.5">
                  <span className="text-3xl font-bold text-zinc-100">{plan.price}</span>
                  <span className="text-sm text-zinc-500">{plan.period}</span>
                </div>
                <p className="text-sm font-medium text-zinc-300">{plan.sessions}</p>
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
              <button
                type="button"
                disabled
                className={`w-full rounded-lg py-2.5 text-sm font-semibold transition-colors disabled:cursor-not-allowed ${
                  plan.highlight
                    ? 'bg-indigo-600 text-white disabled:opacity-70'
                    : 'border border-zinc-700 bg-zinc-800 text-zinc-300 disabled:opacity-50'
                }`}
              >
                {plan.cta}
              </button>
            </div>
          ))}
        </div>

        {/* Footer */}
        <p className="text-center text-xs text-zinc-600">
          Payment coming soon.{' '}
          <Link href="/dashboard" className="text-zinc-500 hover:text-zinc-300 transition-colors">
            Back to dashboard →
          </Link>
        </p>

      </div>
    </div>
  )
}
