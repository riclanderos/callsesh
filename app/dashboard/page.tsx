import { createClient } from '@/lib/supabase/server';
import { createServiceClient } from '@/lib/supabase/service';
import { redirect } from 'next/navigation';
import { headers } from 'next/headers';
import Link from 'next/link';
import { logout } from '@/app/actions/auth';
import CopyButton from './copy-button';
import RelativeTime from './relative-time';
import PlanUsageCard from '@/components/billing/plan-usage-card';
import { getUserPlan } from '@/lib/plan';
import OnboardingChecklist from './onboarding-checklist';
import PayoutCard, { type PayoutState } from './payout-card';
import { managePayouts } from '@/app/actions/connect';
import LaunchOfferCard from './launch-offer-card';
import { syncStripeAccountStatus } from '@/lib/stripe-sync';
import PayoutSuccessBanner from './payout-success-banner';
import { computeEarnings, netCents, formatEarnings } from '@/lib/earnings';
import TimezoneAutoDetect from '@/components/dashboard/TimezoneAutoDetect';
import { TrackOnMount } from '@/lib/analytics';

function toTitleCase(name: string): string {
  return name
    .trim()
    .split(/\s+/)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
    .join(' ');
}

function formatDate(d: string): string {
  const [year, month, day] = d.split('-').map(Number);
  return new Date(year, month - 1, day).toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  });
}

function formatTime(t: string): string {
  const [h, m] = t.split(':').map(Number);
  const period = h >= 12 ? 'PM' : 'AM';
  const hour = h % 12 || 12;
  return `${hour}:${String(m).padStart(2, '0')} ${period}`;
}

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ upgraded?: string; payout_refresh?: string; payout_connected?: string }>;
}) {
  const { upgraded, payout_refresh, payout_connected } = await searchParams;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect('/login');

  const headersList = await headers();
  const host = headersList.get('host') ?? 'localhost:3000';
  const proto =
    host.startsWith('localhost') || host.startsWith('127.') ? 'http' : 'https';
  const baseUrl = `${proto}://${host}`;

  // Fetch profile first so we can use the coach's timezone for accurate date
  // classification. Fetching separately with maybeSingle() prevents a query
  // error from silently returning null and masking a real stripe_account_id.
  const { data: profileRow } = await createServiceClient()
    .from('profiles')
    .select('stripe_account_id, stripe_payouts_enabled, stripe_charges_enabled, timezone, launch_offer_eligible, launch_offer_sessions_remaining, launch_offer_expires_at')
    .eq('id', user.id)
    .maybeSingle()

  // If returning from a Stripe onboarding/update flow, pull the latest account
  // status from Stripe and write it back to the DB before we derive payoutState.
  // This is the only place a live Stripe call happens — and only when needed.
  if (payout_refresh === '1' && profileRow?.stripe_account_id) {
    await syncStripeAccountStatus(user.id, profileRow.stripe_account_id)
    const { data: refreshed } = await createServiceClient()
      .from('profiles')
      .select('stripe_payouts_enabled, stripe_charges_enabled')
      .eq('id', user.id)
      .maybeSingle()
    if (refreshed && profileRow) {
      profileRow.stripe_payouts_enabled = refreshed.stripe_payouts_enabled
      profileRow.stripe_charges_enabled = refreshed.stripe_charges_enabled
    }
  }

  const coachTimezone = profileRow?.timezone ?? 'UTC'
  // Use the coach's local date so late-evening US coaches don't lose today's
  // upcoming bookings to a UTC date that's already rolled to tomorrow.
  const today = new Intl.DateTimeFormat('en-CA', { timeZone: coachTimezone }).format(new Date())

  const [
    { data: upcomingRaw },
    { data: sessionTypes },
    { count: usedCount },
    { sessionLimit, planName, planKey, hasLapsedSubscription },
    { count: availabilityCount },
    { data: earningsRaw },
  ] = await Promise.all([
    supabase
      .from('bookings')
      .select(
        'id, guest_name, booking_date, start_time, end_time, client_message, session_types(title)',
      )
      .eq('coach_id', user.id)
      .eq('status', 'confirmed')
      .gte('booking_date', today)
      .order('booking_date', { ascending: true })
      .order('start_time', { ascending: true })
      .limit(6),
    supabase
      .from('session_types')
      .select('id, title, slug')
      .eq('coach_id', user.id)
      .eq('is_active', true)
      .order('created_at', { ascending: false }),
    supabase
      .from('bookings')
      .select('id', { count: 'exact', head: true })
      .eq('coach_id', user.id)
      .neq('status', 'cancelled'),
    getUserPlan(user.id),
    supabase
      .from('availability_rules')
      .select('id', { count: 'exact', head: true })
      .eq('coach_id', user.id)
      .eq('is_active', true),
    supabase
      .from('bookings')
      .select('booking_date, session_types(price_cents)')
      .eq('coach_id', user.id)
      .eq('status', 'confirmed'),
  ]);

  const { data: subscriptionRow } = await createServiceClient()
    .from('subscriptions')
    .select('cancel_at_period_end, current_period_end')
    .eq('user_id', user.id)
    .maybeSingle();

  // Payout readiness — derived from DB fields kept in sync by the Stripe webhook.
  // No live Stripe API call needed; avoids latency and a hard dependency on Stripe
  // being reachable on every dashboard load.
  const hasStripeAccount = !!profileRow?.stripe_account_id
  const payoutsEnabled = profileRow?.stripe_payouts_enabled === true
  const chargesEnabled = profileRow?.stripe_charges_enabled === true

  let payoutState: PayoutState = 'no_account'
  if (hasStripeAccount) {
    if (payoutsEnabled) {
      payoutState = 'ready'
    } else if (chargesEnabled) {
      // Details submitted and charges enabled but payouts not yet unlocked —
      // Stripe is still verifying the account.
      payoutState = 'verification_pending'
    } else {
      payoutState = 'setup_incomplete'
    }
  }

  // After a successful payout sync, swap the transient ?payout_refresh param for
  // ?payout_connected=1 so the banner renders exactly once. The client component
  // immediately replaces the URL with /dashboard, so reloads never see the param.
  if (payout_refresh === '1' && payoutState === 'ready') {
    redirect('/dashboard?payout_connected=1')
  }

  // Launch offer visibility: show only while eligible, unexpired, sessions remain, and
  // the user has never had a paid subscription (lapsed users cannot reuse the allowance).
  const offerEligible = profileRow?.launch_offer_eligible === true
  const offerExpiresAt = profileRow?.launch_offer_expires_at ?? null
  const offerNotExpired = !offerExpiresAt || new Date(offerExpiresAt) > new Date()
  const offerSessionsLeft = profileRow?.launch_offer_sessions_remaining ?? 0
  const showOfferCard = offerEligible && offerNotExpired && offerSessionsLeft > 0 && planKey === 'free' && !hasLapsedSubscription

  const cancelAtPeriodEnd = subscriptionRow?.cancel_at_period_end === true;

  const accessEndDateLabel = subscriptionRow?.current_period_end
    ? new Date(subscriptionRow.current_period_end).toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
      })
    : null;

  const used = usedCount ?? 0;
  const remaining = sessionLimit - used;

  const upcoming = (upcomingRaw ?? []).map((row) => {
    const st = row.session_types as
      | { title: string }
      | { title: string }[]
      | null;
    const sessionTitle = Array.isArray(st)
      ? (st[0]?.title ?? '—')
      : (st?.title ?? '—');
    return { ...row, sessionTitle };
  });

  const next = upcoming[0] ?? null;
  const rest = upcoming.slice(1);

  const { totalCents, last30DaysCents } = computeEarnings(
    (earningsRaw ?? []) as Parameters<typeof computeEarnings>[0]
  );
  const netTotal  = netCents(totalCents);
  const netLast30 = netCents(last30DaysCents);

  return (
    <div className="min-h-screen px-6 py-10">
      <TimezoneAutoDetect currentTimezone={coachTimezone} />
      <TrackOnMount event="dashboard_viewed" />
      <div className="mx-auto max-w-4xl space-y-8">
        {/* Upgrade success banner */}
        {upgraded === '1' && (
          <div className="rounded-xl border border-indigo-800 bg-indigo-950/40 px-5 py-4 space-y-0.5">
            <p className="text-sm font-semibold text-indigo-300">
              Your plan was updated
            </p>
            <p className="text-xs text-indigo-400">
              Your membership is active and your new limits are now available.
            </p>
          </div>
        )}

        {/* Payout setup success banner — one-time, client strips param on mount */}
        {payout_connected === '1' && <PayoutSuccessBanner />}

        {/* Payout card — above setup checklist when not ready */}
        {payoutState !== 'ready' && <PayoutCard state={payoutState} />}

        {/* Launch offer notice — shown only while eligible, unexpired, and sessions remain */}
        {showOfferCard && (
          <LaunchOfferCard
            sessionsRemaining={offerSessionsLeft}
            expiresAt={offerExpiresAt!}
          />
        )}

        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <h1 className="text-2xl font-semibold text-zinc-100">
              Your dashboard
            </h1>
            <p className="text-sm text-zinc-300">{user.email}</p>
            {hasLapsedSubscription ? (
              <p className="text-sm font-medium text-amber-400">
                Your plan has ended.{' '}
                <Link
                  href="/upgrade"
                  className="underline underline-offset-2 hover:text-amber-300 transition-colors">
                  Renew to continue
                </Link>
              </p>
            ) : remaining <= 0 && sessionLimit === 0 && used === 0 ? (
              <p className="text-sm font-medium text-amber-400">
                Subscribe to start accepting bookings.{' '}
                <Link
                  href="/upgrade"
                  className="underline underline-offset-2 hover:text-amber-300 transition-colors">
                  See plans
                </Link>
              </p>
            ) : remaining <= 0 ? (
              <p className="text-sm font-medium text-amber-400">
                You&apos;ve used your free sessions.{' '}
                <Link
                  href="/upgrade"
                  className="underline underline-offset-2 hover:text-amber-300 transition-colors">
                  Upgrade to continue
                </Link>
              </p>
            ) : remaining <= 3 ? (
              <p className="text-sm font-medium text-amber-400">
                {remaining} session{remaining === 1 ? '' : 's'} remaining
              </p>
            ) : planKey === 'pro' ? (
              <p className="text-sm text-zinc-300">Unlimited sessions</p>
            ) : (
              <p className="text-sm text-zinc-300">
                {used} of {sessionLimit} sessions used
              </p>
            )}
          </div>
          <form action={logout}>
            <button
              type="submit"
              className="rounded-lg border border-zinc-700 px-4 py-2 text-sm text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200 transition-colors">
              Log out
            </button>
          </form>
        </div>


        {/* Onboarding checklist — hidden once any booking activity is visible */}
        {upcoming.length === 0 && (
          <OnboardingChecklist
            hasSessionType={(sessionTypes ?? []).length > 0}
            hasAvailability={(availabilityCount ?? 0) > 0}
            hasBooking={(usedCount ?? 0) > 0}
            firstSessionSlug={sessionTypes?.[0]?.slug}
          />
        )}

        {/* Next session */}
        <section className="space-y-3">
          <p className="text-xs font-medium uppercase tracking-wider text-zinc-400">
            Next session
          </p>
          {next ? (
            <div className="rounded-xl border border-indigo-900 bg-zinc-800/60 p-6">
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-1.5">
                  <p className="text-lg font-semibold text-zinc-100">
                    {toTitleCase(next.guest_name)}
                  </p>
                  <p className="text-sm text-zinc-300">{next.sessionTitle}</p>
                  <RelativeTime
                    bookingDate={next.booking_date}
                    startTime={next.start_time}
                    endTime={next.end_time}
                  />
                  {(next as { client_message?: string | null }).client_message && (
                    <p className="text-sm text-zinc-300 pt-1">
                      &ldquo;{(next as { client_message?: string | null }).client_message}&rdquo;
                    </p>
                  )}
                </div>
                <Link
                  href="/dashboard/bookings"
                  className="flex-shrink-0 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-500 transition-colors">
                  Open session
                </Link>
              </div>
            </div>
          ) : sessionTypes && sessionTypes.length === 0 ? (
            <div className="rounded-xl border border-zinc-800 bg-zinc-900 px-5 py-6 space-y-4">
              <div className="space-y-1">
                <p className="text-sm font-medium text-zinc-200">You&apos;re not set up yet</p>
                <p className="text-sm text-zinc-300">
                  Create a session type and set your availability to start accepting bookings.
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                <Link
                  href="/dashboard/session-types"
                  className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-500 transition-colors">
                  Create a session type
                </Link>
                <Link
                  href="/dashboard/availability"
                  className="rounded-lg border border-zinc-700 px-4 py-2 text-sm font-medium text-zinc-300 hover:bg-zinc-800 transition-colors">
                  Set availability
                </Link>
              </div>
            </div>
          ) : (
            <div className="rounded-xl border border-zinc-800 bg-zinc-900 px-5 py-6 space-y-1">
              <p className="text-sm text-zinc-300">No upcoming bookings yet.</p>
              <p className="text-sm text-zinc-300">
                Share your booking link below to start accepting sessions.
              </p>
            </div>
          )}
        </section>

        {/* Upcoming sessions */}
        {rest.length > 0 && (
          <section className="space-y-3">
            <p className="text-xs font-medium uppercase tracking-wider text-zinc-400">
              Upcoming
            </p>
            <div className="rounded-xl border border-zinc-800 bg-zinc-900 divide-y divide-zinc-800">
              {rest.map((b) => (
                <div
                  key={b.id}
                  className="flex items-center justify-between px-5 py-3.5 gap-4">
                  <div className="space-y-0.5 min-w-0">
                    <p className="text-sm font-medium text-zinc-100">
                      {toTitleCase(b.guest_name)}
                    </p>
                    <p className="text-sm text-zinc-300">
                      {formatDate(b.booking_date)} · {formatTime(b.start_time)}
                    </p>
                    {(b as { client_message?: string | null }).client_message && (
                      <p className="text-sm text-zinc-300 truncate">
                        &ldquo;{(b as { client_message?: string | null }).client_message}&rdquo;
                      </p>
                    )}
                  </div>
                  <span className="flex-shrink-0 text-sm text-zinc-300">
                    {b.sessionTitle}
                  </span>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Booking links */}
        <section className="space-y-3">
          <div className="space-y-0.5">
            <p className="text-xs font-medium uppercase tracking-wider text-zinc-400">
              Share your booking links
            </p>
            {sessionTypes && sessionTypes.length > 0 && (
              <p className="text-sm text-zinc-300">
                Send these links to clients so they can book a session.
              </p>
            )}
          </div>
          {sessionTypes && sessionTypes.length > 0 ? (
            <div className="rounded-xl border border-zinc-800 bg-zinc-900 divide-y divide-zinc-800">
              {sessionTypes.map((st, i) => {
                const url = `${baseUrl}/book/${st.slug}`;
                return (
                  <div
                    key={st.id}
                    className="flex items-center justify-between px-5 py-4 gap-4">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-medium text-zinc-100">
                          {st.title}
                        </p>
                        {i === 0 && sessionTypes.length > 1 && (
                          <span className="rounded border border-zinc-700 px-1.5 py-0.5 text-xs text-zinc-500">
                            Latest
                          </span>
                        )}
                      </div>
                      <p className="text-sm mt-0.5 truncate text-zinc-300 hover:text-zinc-100 transition-colors">
                        {baseUrl.replace(/^https?:\/\//, '')}/book/{st.slug}
                      </p>
                    </div>
                    <CopyButton text={url} />
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="rounded-xl border border-zinc-800 bg-zinc-900 px-5 py-6 space-y-2 text-center">
              <p className="text-sm text-zinc-300">No active session types yet.</p>
              <p className="text-sm text-zinc-300">
                Create a session type to get a shareable booking link.{' '}
                <Link
                  href="/dashboard/session-types"
                  className="text-indigo-400 hover:text-indigo-300 transition-colors">
                  Create one →
                </Link>
              </p>
            </div>
          )}
        </section>

        {/* Quick actions */}
        <section className="space-y-3">
          <p className="text-xs font-medium uppercase tracking-wider text-zinc-400">
            Quick actions
          </p>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/dashboard/availability"
              className="rounded-lg border border-zinc-600 bg-zinc-800 px-5 py-2.5 text-sm font-medium text-zinc-200 hover:border-zinc-500 hover:bg-zinc-700 hover:text-zinc-100 transition-colors">
              + Add availability
            </Link>
            <Link
              href="/dashboard/session-types"
              className="rounded-lg border border-zinc-600 bg-zinc-800 px-5 py-2.5 text-sm font-medium text-zinc-200 hover:border-zinc-500 hover:bg-zinc-700 hover:text-zinc-100 transition-colors">
              + New session type
            </Link>
          </div>
        </section>

        {/* Manage */}
        <section className="space-y-3">
          <p className="text-xs font-medium uppercase tracking-wider text-zinc-400">
            Manage
          </p>
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
            {[
              { title: 'Session Types', href: '/dashboard/session-types' },
              { title: 'Bookings', href: '/dashboard/bookings' },
              { title: 'Availability', href: '/dashboard/availability' },
            ].map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="rounded-lg border border-zinc-800 px-4 py-2.5 text-sm text-zinc-400 hover:border-zinc-700 hover:text-zinc-300 transition-colors">
                {item.title} →
              </Link>
            ))}
            {payoutState === 'ready' && (
              <form action={managePayouts}>
                <button
                  type="submit"
                  className="w-full rounded-lg border border-zinc-800 px-4 py-2.5 text-sm text-zinc-400 hover:border-zinc-700 hover:text-zinc-300 transition-colors text-left">
                  Manage Payments →
                </button>
              </form>
            )}
          </div>
        </section>

        {/* Earnings */}
        <section className="space-y-3">
          <p className="text-xs font-medium uppercase tracking-wider text-zinc-400">
            Earnings
          </p>
          <div className="rounded-xl border border-zinc-800 bg-zinc-900 px-5 py-4 space-y-3">
            <div className="flex items-center justify-between">
              <p className="text-sm text-zinc-300">Total earned</p>
              <p className="text-sm font-semibold text-zinc-100">{formatEarnings(netTotal)}</p>
            </div>
            <div className="flex items-center justify-between border-t border-zinc-800 pt-3">
              <p className="text-sm text-zinc-300">Last 30 days</p>
              <p className="text-sm font-semibold text-zinc-100">{formatEarnings(netLast30)}</p>
            </div>
            <p className="text-sm text-zinc-400">After 10% platform fee. Confirmed sessions only.</p>
          </div>
        </section>

        {/* Plan & usage */}
        <section className="space-y-3">
          <p className="text-xs font-medium uppercase tracking-wider text-zinc-400">
            Your plan
          </p>
          {remaining >= 1 && remaining <= 3 && (
            <p className="text-sm text-amber-400 px-1">
              You have {remaining} session{remaining === 1 ? '' : 's'} remaining
              before you hit your limit.{' '}
              {planKey === 'free' && (
                <Link
                  href="/upgrade"
                  className="font-medium underline underline-offset-2 hover:text-amber-300 transition-colors">
                  Upgrade
                </Link>
              )}
            </p>
          )}
          <PlanUsageCard
            sessionsUsed={used}
            sessionLimit={sessionLimit}
            planName={planName}
            planKey={planKey}
            hasLapsed={hasLapsedSubscription}
          />
          {cancelAtPeriodEnd && (
            <p className="text-sm text-zinc-300 px-1">
              Your plan access ends{accessEndDateLabel ? ` on ${accessEndDateLabel}` : ' at the end of your billing period'}.
              You&apos;ll need to resubscribe to continue accepting bookings.
            </p>
          )}
        </section>
      </div>
    </div>
  );
}
