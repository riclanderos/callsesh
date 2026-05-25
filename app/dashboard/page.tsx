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
  searchParams: Promise<{ upgraded?: string; payout_refresh?: string; payout_connected?: string; signup?: string }>;
}) {
  const { upgraded, payout_refresh, payout_connected, signup } = await searchParams;
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

  // 30-day cutoff string used for the cancelled bookings count query.
  const last30DaysAgo = new Date()
  last30DaysAgo.setDate(last30DaysAgo.getDate() - 30)
  const last30Str = last30DaysAgo.toISOString().split('T')[0]

  const [
    { data: upcomingRaw },
    { data: sessionTypes },
    { count: usedCount },
    { sessionLimit, planName, planKey, hasLapsedSubscription },
    { count: availabilityCount },
    { data: earningsRaw },
    { count: clientCount },
    { count: cancelledCount },
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
    // Include completed (fulfilled) sessions — confirmed-only was a bug that
    // excluded all historical revenue from past sessions.
    // coach_client_id and session title are added here so booking metrics
    // (returning clients, top session type) can be computed from this single fetch.
    supabase
      .from('bookings')
      .select('booking_date, coach_client_id, session_types(title, price_cents)')
      .eq('coach_id', user.id)
      .in('status', ['confirmed', 'completed']),
    supabase
      .from('coach_clients')
      .select('id', { count: 'exact', head: true })
      .eq('coach_id', user.id),
    // Cancellations in the last 30 days — head-only count, no rows returned.
    supabase
      .from('bookings')
      .select('id', { count: 'exact', head: true })
      .eq('coach_id', user.id)
      .eq('status', 'cancelled')
      .gte('booking_date', last30Str),
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

  const cancelAtPeriodEnd = subscriptionRow?.cancel_at_period_end === true

  // True only when the period end timestamp is still in the future on the server clock.
  // Prevents "plan access ends on [past date]" from rendering during the window between
  // period expiry and webhook delivery.
  const periodEndInFuture =
    !!subscriptionRow?.current_period_end &&
    new Date(subscriptionRow.current_period_end) > new Date()

  // Render the "access ends" notice only when all three conditions hold:
  // cancellation is scheduled, the end date is still upcoming, and the
  // subscription is not already treated as lapsed (prevents contradictory UI).
  const showCancelNotice = cancelAtPeriodEnd && periodEndInFuture && !hasLapsedSubscription

  const accessEndDateLabel = subscriptionRow?.current_period_end
    ? new Date(subscriptionRow.current_period_end).toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric',  // unambiguous across years
        timeZone: 'UTC',  // server-rendered — pin to UTC to avoid host-tz drift
      })
    : null

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

  // ── Monthly revenue chart ────────────────────────────────────────────────
  // Use the coach's timezone-aware date so month boundaries match their locale.
  // `today` is already computed above with coachTimezone.
  const currentMonthKey = today.slice(0, 7) // 'YYYY-MM'

  // Prior month key without Date arithmetic to avoid month-rollover issues.
  const [cmY, cmM] = currentMonthKey.split('-').map(Number)
  const priorMonthKey = cmM === 1
    ? `${cmY - 1}-12`
    : `${cmY}-${String(cmM - 1).padStart(2, '0')}`

  // Build ordered array of the last 6 calendar months.
  const last6Months = Array.from({ length: 6 }, (_, i) => {
    const offset = 5 - i
    let y = cmY
    let m = cmM - offset
    while (m <= 0) { m += 12; y -= 1 }
    const key = `${y}-${String(m).padStart(2, '0')}`
    const label = new Date(y, m - 1, 1).toLocaleDateString('en-US', { month: 'short' })
    return { key, label }
  })

  // Bucket gross cents by 'YYYY-MM' from the corrected earningsRaw.
  const grossByMonth = new Map<string, number>()
  for (const b of earningsRaw ?? []) {
    const monthKey = (b.booking_date as string).slice(0, 7)
    const st = b.session_types as { price_cents: number } | { price_cents: number }[] | null
    const price = Array.isArray(st) ? (st[0]?.price_cents ?? 0) : (st?.price_cents ?? 0)
    grossByMonth.set(monthKey, (grossByMonth.get(monthKey) ?? 0) + price)
  }

  const monthlyData = last6Months.map(({ key, label }) => ({
    month: key,
    label,
    netCents: netCents(grossByMonth.get(key) ?? 0),
  }))

  const maxMonthNet    = Math.max(...monthlyData.map((d) => d.netCents), 1)
  const thisMonthNet   = monthlyData.find((d) => d.month === currentMonthKey)?.netCents ?? 0
  const priorMonthNet  = monthlyData.find((d) => d.month === priorMonthKey)?.netCents ?? 0
  const trendPct       = priorMonthNet > 0
    ? Math.round(((thisMonthNet - priorMonthNet) / priorMonthNet) * 100)
    : null
  const thisMonthSessions = (earningsRaw ?? []).filter(
    (b) => (b.booking_date as string).slice(0, 7) === currentMonthKey
  ).length
  const hasAnyRevenue = monthlyData.some((d) => d.netCents > 0)

  // ── Business activity metrics ────────────────────────────────────────────
  // Typed view of earningsRaw — adds coach_client_id and title without
  // disturbing the computeEarnings cast above (which only reads price_cents).
  type BookingsDataRow = {
    booking_date: string
    coach_client_id: string | null
    session_types: { title: string; price_cents: number } | { title: string; price_cents: number }[] | null
  }
  const bookingsData = (earningsRaw ?? []) as BookingsDataRow[]

  // This week: Mon–Sun in the coach's timezone.
  // Parse `today` (already tz-aware YYYY-MM-DD) without Date arithmetic on months.
  const [tY, tM, tD] = today.split('-').map(Number)
  const todayDateObj  = new Date(tY, tM - 1, tD)
  const dow           = todayDateObj.getDay() // 0=Sun … 6=Sat
  const daysFromMon   = dow === 0 ? 6 : dow - 1
  const monDate       = new Date(tY, tM - 1, tD - daysFromMon)
  const sunDate       = new Date(tY, tM - 1, tD + (6 - daysFromMon))
  const pad           = (n: number) => String(n).padStart(2, '0')
  const weekStart     = `${monDate.getFullYear()}-${pad(monDate.getMonth() + 1)}-${pad(monDate.getDate())}`
  const weekEnd       = `${sunDate.getFullYear()}-${pad(sunDate.getMonth() + 1)}-${pad(sunDate.getDate())}`
  const thisWeekCount = bookingsData.filter(
    (b) => b.booking_date >= weekStart && b.booking_date <= weekEnd
  ).length

  // Returning clients: coach_client_ids that appear more than once.
  const bookingsByClient = new Map<string, number>()
  for (const b of bookingsData) {
    if (b.coach_client_id) {
      bookingsByClient.set(b.coach_client_id, (bookingsByClient.get(b.coach_client_id) ?? 0) + 1)
    }
  }
  const returningClients = [...bookingsByClient.values()].filter((n) => n > 1).length

  // Top session type: most-booked title across all confirmed + completed sessions.
  // Only surfaced in the UI when there are 2+ distinct active session types,
  // so the signal is meaningful (single-type coaches already know their offering).
  const bookingsByType = new Map<string, number>()
  for (const b of bookingsData) {
    const st    = b.session_types
    const title = Array.isArray(st) ? (st[0]?.title ?? null) : (st?.title ?? null)
    if (title) bookingsByType.set(title, (bookingsByType.get(title) ?? 0) + 1)
  }
  const topSessionType: { title: string; count: number } | null =
    bookingsByType.size >= 2
      ? [...bookingsByType.entries()]
          .sort((a, b) => b[1] - a[1])
          .map(([title, count]) => ({ title, count }))[0] ?? null
      : null

  // Cancellation signal: amber when > 20% of last-30-day non-cancelled bookings.
  const cancelledLast30   = cancelledCount ?? 0
  const last30Total       = thisMonthSessions + cancelledLast30 // rough denominator
  const cancellationAmber = last30Total > 0 && cancelledLast30 / last30Total > 0.2

  return (
    <div className="min-h-screen px-6 py-10">
      <TimezoneAutoDetect currentTimezone={coachTimezone} />
      <TrackOnMount event="dashboard_viewed" />
      {signup === '1' && <TrackOnMount event="signup_completed" />}
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

        {/* Stats row */}
        <div className="space-y-2">
          <div className="grid grid-cols-3 gap-3">
            <div className="rounded-xl border border-zinc-800 bg-zinc-900 px-4 py-4 space-y-1">
              <p className="text-xs font-medium uppercase tracking-wider text-zinc-500">Upcoming</p>
              <p className="text-2xl font-bold text-zinc-100">{upcoming.length}</p>
            </div>
            <div className="rounded-xl border border-zinc-800 bg-zinc-900 px-4 py-4 space-y-1">
              <p className="text-xs font-medium uppercase tracking-wider text-zinc-500">Last 30 days</p>
              <p className="text-2xl font-bold text-zinc-100">{formatEarnings(netLast30)}</p>
            </div>
            <div className="rounded-xl border border-zinc-800 bg-zinc-900 px-4 py-4 space-y-1">
              <p className="text-xs font-medium uppercase tracking-wider text-zinc-500">All time</p>
              <p className="text-2xl font-bold text-zinc-100">{formatEarnings(netTotal)}</p>
            </div>
          </div>
          <p className="text-xs text-zinc-600 px-1">Net after 10% platform fee · Confirmed sessions only</p>
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
            <div className="rounded-xl border border-zinc-700 bg-zinc-900 p-5">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-3.5 min-w-0">
                  <div className="flex-shrink-0 h-10 w-10 rounded-full bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center mt-0.5">
                    <span className="text-sm font-bold text-indigo-300">
                      {toTitleCase(next.guest_name).split(' ').map((n: string) => n[0]).slice(0, 2).join('')}
                    </span>
                  </div>
                  <div className="space-y-1 min-w-0">
                    <p className="text-base font-semibold text-zinc-100">
                      {toTitleCase(next.guest_name)}
                    </p>
                    <p className="text-sm text-zinc-400">{next.sessionTitle}</p>
                    <RelativeTime
                      bookingDate={next.booking_date}
                      startTime={next.start_time}
                      endTime={next.end_time}
                    />
                    {(next as { client_message?: string | null }).client_message && (
                      <p className="text-sm text-zinc-500 pt-0.5 italic">
                        &ldquo;{(next as { client_message?: string | null }).client_message}&rdquo;
                      </p>
                    )}
                  </div>
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
                  className="flex items-center gap-3.5 px-4 py-3.5">
                  <div className="flex-shrink-0 h-8 w-8 rounded-full bg-zinc-700 flex items-center justify-center">
                    <span className="text-xs font-semibold text-zinc-300">
                      {toTitleCase(b.guest_name).split(' ').map((n: string) => n[0]).slice(0, 2).join('')}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0 flex items-center justify-between gap-4">
                    <div className="min-w-0 space-y-0.5">
                      <p className="text-sm font-medium text-zinc-100 truncate">
                        {toTitleCase(b.guest_name)}
                      </p>
                      <p className="text-xs text-zinc-500">
                        {formatDate(b.booking_date)} · {formatTime(b.start_time)}
                      </p>
                    </div>
                    <span className="flex-shrink-0 text-xs text-zinc-500 text-right">
                      {b.sessionTitle}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Booking links */}
        <section className="space-y-3">
          <p className="text-xs font-medium uppercase tracking-wider text-zinc-400">
            Share your booking links
          </p>
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

        {/* Manage */}
        <section className="space-y-3">
          <p className="text-xs font-medium uppercase tracking-wider text-zinc-400">
            Manage
          </p>
          <div className="grid grid-cols-2 gap-2">
            {[
              { title: 'Session Types', href: '/dashboard/session-types', desc: 'Manage your offerings' },
              { title: 'Bookings', href: '/dashboard/bookings', desc: 'View all appointments' },
              { title: 'Clients', href: '/dashboard/clients', desc: 'Client history & notes' },
              { title: 'Availability', href: '/dashboard/availability', desc: 'Set your schedule' },
            ].map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="rounded-xl border border-zinc-800 bg-zinc-900 px-4 py-3.5 hover:border-zinc-700 hover:bg-zinc-800/50 transition-colors">
                <p className="text-sm font-medium text-zinc-200">{item.title}</p>
                <p className="text-xs text-zinc-500 mt-0.5">{item.desc}</p>
              </Link>
            ))}
            {payoutState === 'ready' && (
              <form action={managePayouts} className="col-span-2">
                <button
                  type="submit"
                  className="w-full rounded-xl border border-zinc-800 bg-zinc-900 px-4 py-3.5 text-left hover:border-zinc-700 hover:bg-zinc-800/50 transition-colors">
                  <p className="text-sm font-medium text-zinc-200">Manage Payments</p>
                  <p className="text-xs text-zinc-500 mt-0.5">Payouts & Stripe dashboard</p>
                </button>
              </form>
            )}
          </div>
        </section>

        {/* Revenue Overview */}
        <section className="space-y-3">
          <p className="text-xs font-medium uppercase tracking-wider text-zinc-400">
            Revenue
          </p>
          <div className="rounded-xl border border-zinc-800 bg-zinc-900 px-5 pt-4 pb-5">

            {/* Hero metric + trend */}
            <div className="flex items-end justify-between gap-4 mb-4">
              <div>
                <p className="text-xs text-zinc-500 mb-1">This month</p>
                <p className="text-2xl font-bold text-zinc-100">{formatEarnings(thisMonthNet)}</p>
              </div>
              {trendPct !== null && (
                <p className={`text-sm font-medium pb-0.5 ${trendPct >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                  {trendPct >= 0 ? '↑' : '↓'} {Math.abs(trendPct)}% from last month
                </p>
              )}
            </div>

            {/* 6-month bar chart — current month is visually dominant */}
            {hasAnyRevenue ? (
              <div className="flex items-end gap-1 h-11">
                {monthlyData.map((d) => {
                  const isCurrent = d.month === currentMonthKey
                  // Current month always renders at least a 5% stub so it anchors the eye.
                  // Past months render at 2% minimum — visible but not distracting.
                  const heightPct = Math.max(
                    (d.netCents / maxMonthNet) * 100,
                    isCurrent ? 5 : 2,
                  )
                  return (
                    <div
                      key={d.month}
                      // Current month: 40% wider + small left margin to break the
                      // uniform rhythm and create a natural "history | now" pause.
                      className={`flex flex-col items-center gap-1.5 ${
                        isCurrent ? 'flex-[1.4] ml-1' : 'flex-1'
                      }`}
                    >
                      <div
                        className={`w-full transition-none ${
                          isCurrent
                            ? 'rounded bg-indigo-400'
                            : 'rounded-sm bg-zinc-700'
                        }`}
                        style={{ height: `${heightPct}%` }}
                        title={`${d.label}: ${formatEarnings(d.netCents)}`}
                      />
                      <span
                        className={`text-[10px] ${
                          isCurrent
                            ? 'text-zinc-300 font-medium'
                            : 'text-zinc-600'
                        }`}
                      >
                        {d.label}
                      </span>
                    </div>
                  )
                })}
              </div>
            ) : (
              <div className="h-11 flex items-center">
                <p className="text-xs text-zinc-600">
                  Revenue chart will appear once you have completed sessions
                </p>
              </div>
            )}

            {/* Supporting metrics */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-x-4 gap-y-3 mt-4 pt-4 border-t border-zinc-800">
              <div>
                <p className="text-xs text-zinc-500">Sessions</p>
                <p className="text-sm font-semibold text-zinc-100 mt-0.5">{used}</p>
              </div>
              <div>
                <p className="text-xs text-zinc-500">Avg / session</p>
                <p className="text-sm font-semibold text-zinc-100 mt-0.5">
                  {used > 0 && netTotal > 0 ? formatEarnings(Math.round(netTotal / used)) : '—'}
                </p>
              </div>
              <div>
                <p className="text-xs text-zinc-500">Clients</p>
                <p className="text-sm font-semibold text-zinc-100 mt-0.5">{clientCount ?? 0}</p>
              </div>
              <div>
                <p className="text-xs text-zinc-500">This month</p>
                <p className="text-sm font-semibold text-zinc-100 mt-0.5">
                  {thisMonthSessions} {thisMonthSessions === 1 ? 'session' : 'sessions'}
                </p>
              </div>
            </div>

            <p className="text-xs text-zinc-600 mt-3">
              Confirmed &amp; completed sessions · Net after 10% platform fee
            </p>
          </div>
        </section>

        {/* Business Activity — secondary operational insights, intentionally lighter
            visual weight than Revenue Overview so the hierarchy remains clear. */}
        {used > 0 && (
          <section className="space-y-3">
            <p className="text-xs font-medium uppercase tracking-wider text-zinc-400">
              Business Activity
            </p>
            <div className="rounded-xl border border-zinc-800 bg-zinc-900 px-4 py-3.5 space-y-3">
              <div className="grid grid-cols-3 gap-x-4">
                <div>
                  <p className="text-xs text-zinc-500">This week</p>
                  <p className="text-sm font-medium text-zinc-200 mt-0.5">{thisWeekCount}</p>
                </div>
                <div>
                  <p className="text-xs text-zinc-500">Cancelled (30d)</p>
                  <p className={`text-sm font-medium mt-0.5 ${cancellationAmber ? 'text-amber-400' : 'text-zinc-200'}`}>
                    {cancelledLast30}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-zinc-500">Returning clients</p>
                  <p className="text-sm font-medium text-zinc-200 mt-0.5">{returningClients}</p>
                </div>
              </div>
              {topSessionType && (
                <p className="text-xs text-zinc-500 pt-2 border-t border-zinc-800">
                  Most booked:{' '}
                  <span className="text-zinc-400">{topSessionType.title}</span>
                  <span className="text-zinc-600 mx-1.5">·</span>
                  <span className="text-zinc-600">{topSessionType.count} sessions</span>
                </p>
              )}
            </div>
          </section>
        )}

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
          {showCancelNotice && (
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
