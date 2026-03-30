'use client';

import { useState } from 'react';
import Link from 'next/link';

async function openBillingPortal() {
  const res = await fetch('/api/stripe/portal', { method: 'POST' });
  if (!res.ok) {
    console.error('Billing portal request failed:', res.status);
    return;
  }
  const { url } = await res.json();
  if (url) window.location.href = url;
}

function PortalButton({
  label,
  variant = 'secondary',
}: {
  label: string;
  variant?: 'primary' | 'secondary';
}) {
  const [loading, setLoading] = useState(false);
  const cls =
    variant === 'primary'
      ? 'rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed'
      : 'rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-2 text-sm font-medium text-zinc-200 hover:border-zinc-600 hover:text-zinc-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed';
  return (
    <button
      type="button"
      disabled={loading}
      onClick={async () => {
        setLoading(true);
        await openBillingPortal();
        setLoading(false);
      }}
      className={cls}
    >
      {loading ? 'Redirecting…' : label}
    </button>
  );
}

export default function PlanUsageCard({
  sessionsUsed,
  sessionLimit,
  planName = 'Free',
  planKey = 'free',
  hasLapsed = false,
}: {
  sessionsUsed: number;
  sessionLimit: number;
  planName?: string;
  planKey?: string;
  hasLapsed?: boolean;
}) {
  const remaining = sessionLimit - sessionsUsed;
  // Paid users get a portal button; free users get the upgrade link.
  const cta =
    planKey === 'starter' || planKey === 'pro' ? (
      <PortalButton label="Manage subscription" />
    ) : (
      <Link
        href="/upgrade"
        className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-500 transition-colors">
        Upgrade
      </Link>
    );

  if (hasLapsed) {
    return (
      <div className="rounded-xl border border-amber-900/60 bg-amber-950/20 p-5 space-y-4">
        <div className="space-y-1">
          <p className="text-xs font-medium uppercase tracking-wider text-zinc-400">
            Plan access ended
          </p>
          <p className="text-sm font-medium text-amber-400">
            No active plan
          </p>
          <p className="text-sm text-zinc-400">
            Your paid plan has ended. Subscribe again to continue accepting bookings.
          </p>
        </div>
        <div className="flex items-center gap-4">
          <Link
            href="/upgrade"
            className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-500 transition-colors">
            See plans
          </Link>
        </div>
      </div>
    );
  }

  if (planKey === 'pro') {
    return (
      <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-5 space-y-4">
        <div className="space-y-1">
          <p className="text-xs font-medium uppercase tracking-wider text-zinc-400">
            {planName} plan
          </p>
          <p className="text-sm text-zinc-300">Unlimited sessions</p>
        </div>
        <div className="flex items-center gap-4">
          <PortalButton label="Manage subscription" />
        </div>
      </div>
    );
  }

  if (remaining <= 0) {
    return (
      <div className="rounded-xl border border-amber-900/60 bg-amber-950/20 p-5 space-y-4">
        <div className="space-y-1">
          <p className="text-xs font-medium uppercase tracking-wider text-zinc-400">
            {planName} plan
          </p>
          <p className="text-sm font-medium text-amber-400">
            Session limit reached
          </p>
          <p className="text-sm text-zinc-400">
            {sessionsUsed} of {sessionLimit} sessions used
            {planKey === 'free' ? ' — upgrade to continue accepting bookings.' : '.'}
          </p>
        </div>
        <div className="flex items-center gap-4">
          {cta}
        </div>
      </div>
    );
  }

  if (remaining <= 5) {
    return (
      <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-5 space-y-4">
        <div className="space-y-1">
          <p className="text-xs font-medium uppercase tracking-wider text-zinc-400">
            {planName} plan
          </p>
          <p className="text-sm font-medium text-amber-400">
            {remaining} session{remaining === 1 ? '' : 's'} remaining
          </p>
          <p className="text-sm text-zinc-400">
            {sessionsUsed} of {sessionLimit} sessions used
          </p>
        </div>
        <div className="flex items-center gap-4">
          {cta}
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-5 space-y-4">
      <div className="space-y-1">
        <p className="text-xs font-medium uppercase tracking-wider text-zinc-400">
          {planName} plan
        </p>
        <p className="text-sm text-zinc-300">
          {sessionsUsed} of {sessionLimit} sessions used
        </p>
        <p className="text-sm text-zinc-400">{remaining} remaining</p>
      </div>
      <div className="flex items-center gap-4">
        {cta}
      </div>
    </div>
  );
}
