import Link from 'next/link';

export default function PlanUsageCard({
  sessionsUsed,
  sessionLimit,
  planName = 'Free',
  planKey = 'free',
}: {
  sessionsUsed: number;
  sessionLimit: number;
  planName?: string;
  planKey?: string;
}) {
  const remaining = sessionLimit - sessionsUsed;
  const ctaLabel = planKey === 'free' ? 'Upgrade' : 'Membership';

  if (planKey === 'pro') {
    return (
      <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-5 space-y-4">
        <div className="space-y-1">
          <p className="text-xs font-medium uppercase tracking-wider text-zinc-500">
            {planName} plan
          </p>
          <p className="text-sm text-zinc-300">Unlimited sessions</p>
        </div>
        <div className="flex items-center gap-4">
          <Link
            href="/upgrade"
            className="rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-2 text-sm font-medium text-zinc-200 hover:border-zinc-600 hover:text-zinc-100 transition-colors">
            {ctaLabel}
          </Link>
        </div>
      </div>
    );
  }

  if (remaining <= 0) {
    return (
      <div className="rounded-xl border border-amber-900/60 bg-amber-950/20 p-5 space-y-4">
        <div className="space-y-1">
          <p className="text-xs font-medium uppercase tracking-wider text-zinc-500">
            {planName} plan
          </p>
          <p className="text-sm font-medium text-amber-400">
            Session limit reached
          </p>
          <p className="text-xs text-zinc-400">
            {sessionsUsed} of {sessionLimit} sessions used — upgrade to continue
            accepting bookings.
          </p>
        </div>
        <div className="flex items-center gap-4">
          <Link
            href="/upgrade"
            className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-500 transition-colors">
            {ctaLabel}
          </Link>
          {planKey === 'free' && (
            <Link
              href="/upgrade"
              className="text-sm text-zinc-400 hover:text-zinc-200 transition-colors">
              View pricing
            </Link>
          )}
        </div>
      </div>
    );
  }

  if (remaining <= 5) {
    return (
      <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-5 space-y-4">
        <div className="space-y-1">
          <p className="text-xs font-medium uppercase tracking-wider text-zinc-500">
            {planName} plan
          </p>
          <p className="text-sm font-medium text-amber-400">
            {remaining} session{remaining === 1 ? '' : 's'} remaining
          </p>
          <p className="text-xs text-zinc-500">
            {sessionsUsed} of {sessionLimit} sessions used
          </p>
        </div>
        <div className="flex items-center gap-4">
          <Link
            href="/upgrade"
            className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-500 transition-colors">
            {ctaLabel}
          </Link>
          {planKey === 'free' && (
            <Link
              href="/upgrade"
              className="text-sm text-zinc-400 hover:text-zinc-200 transition-colors">
              View pricing
            </Link>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-5 space-y-4">
      <div className="space-y-1">
        <p className="text-xs font-medium uppercase tracking-wider text-zinc-500">
          {planName} plan
        </p>
        <p className="text-sm text-zinc-300">
          {sessionsUsed} of {sessionLimit} sessions used
        </p>
        <p className="text-xs text-zinc-500">{remaining} remaining</p>
      </div>
      <div className="flex items-center gap-4">
        <Link
          href="/upgrade"
          className="rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-2 text-sm font-medium text-zinc-200 hover:border-zinc-600 hover:text-zinc-100 transition-colors">
          {ctaLabel}
        </Link>
        {planKey === 'free' && (
          <Link
            href="/upgrade"
            className="text-sm text-zinc-500 hover:text-zinc-300 transition-colors">
            View pricing
          </Link>
        )}
      </div>
    </div>
  );
}
