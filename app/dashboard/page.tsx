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

function formatShortDate(dateStr: string): string {
  const [y, m, d] = dateStr.split('-').map(Number);
  return new Date(y, m - 1, d).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

function formatTimeAgo(dateStr: string): string {
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 7) return `${diffDays}d ago`;
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

// Simple SVG sparkline from an array of values
function Sparkline({ values, color = '#6366f1' }: { values: number[]; color?: string }) {
  const max = Math.max(...values, 1);
  const w = 80;
  const h = 24;
  const pad = 2;
  const points = values
    .map((v, i) => {
      const x = values.length < 2 ? w / 2 : (i / (values.length - 1)) * (w - pad * 2) + pad;
      const y = h - pad - ((v / max) * (h - pad * 2));
      return `${x},${y}`;
    })
    .join(' ');
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} fill="none" className="opacity-70">
      <polyline
        points={points}
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
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

  const { data: profileRow } = await createServiceClient()
    .from('profiles')
    .select('stripe_account_id, stripe_payouts_enabled, stripe_charges_enabled, timezone, launch_offer_eligible, launch_offer_sessions_remaining, launch_offer_expires_at')
    .eq('id', user.id)
    .maybeSingle()

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
  const today = new Intl.DateTimeFormat('en-CA', { timeZone: coachTimezone }).format(new Date())

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
    { data: activityRaw },
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
      .select('booking_date, coach_client_id, guest_name, session_types(title, price_cents)')
      .eq('coach_id', user.id)
      .in('status', ['confirmed', 'completed']),
    supabase
      .from('coach_clients')
      .select('id', { count: 'exact', head: true })
      .eq('coach_id', user.id),
    supabase
      .from('bookings')
      .select('id', { count: 'exact', head: true })
      .eq('coach_id', user.id)
      .eq('status', 'cancelled')
      .gte('booking_date', last30Str),
    // Recent activity: last 8 bookings by creation time, any status
    supabase
      .from('bookings')
      .select('id, guest_name, status, created_at, session_types(title)')
      .eq('coach_id', user.id)
      .order('created_at', { ascending: false })
      .limit(8),
  ]);

  const { data: subscriptionRow } = await createServiceClient()
    .from('subscriptions')
    .select('cancel_at_period_end, current_period_end')
    .eq('user_id', user.id)
    .maybeSingle();

  const hasStripeAccount = !!profileRow?.stripe_account_id
  const payoutsEnabled = profileRow?.stripe_payouts_enabled === true
  const chargesEnabled = profileRow?.stripe_charges_enabled === true

  let payoutState: PayoutState = 'no_account'
  if (hasStripeAccount) {
    if (payoutsEnabled) {
      payoutState = 'ready'
    } else if (chargesEnabled) {
      payoutState = 'verification_pending'
    } else {
      payoutState = 'setup_incomplete'
    }
  }

  if (payout_refresh === '1' && payoutState === 'ready') {
    redirect('/dashboard?payout_connected=1')
  }

  const offerEligible = profileRow?.launch_offer_eligible === true
  const offerExpiresAt = profileRow?.launch_offer_expires_at ?? null
  const offerNotExpired = !offerExpiresAt || new Date(offerExpiresAt) > new Date()
  const offerSessionsLeft = profileRow?.launch_offer_sessions_remaining ?? 0
  const showOfferCard = offerEligible && offerNotExpired && offerSessionsLeft > 0 && planKey === 'free' && !hasLapsedSubscription

  const cancelAtPeriodEnd = subscriptionRow?.cancel_at_period_end === true

  const periodEndInFuture =
    !!subscriptionRow?.current_period_end &&
    new Date(subscriptionRow.current_period_end) > new Date()

  const showCancelNotice = cancelAtPeriodEnd && periodEndInFuture && !hasLapsedSubscription

  const accessEndDateLabel = subscriptionRow?.current_period_end
    ? new Date(subscriptionRow.current_period_end).toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
        timeZone: 'UTC',
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

  const { totalCents, last30DaysCents } = computeEarnings(
    (earningsRaw ?? []) as Parameters<typeof computeEarnings>[0]
  );
  const netTotal  = netCents(totalCents);
  const netLast30 = netCents(last30DaysCents);

  // ── Monthly revenue chart ────────────────────────────────────────────────
  const currentMonthKey = today.slice(0, 7)
  const [cmY, cmM] = currentMonthKey.split('-').map(Number)
  const priorMonthKey = cmM === 1
    ? `${cmY - 1}-12`
    : `${cmY}-${String(cmM - 1).padStart(2, '0')}`

  const last6Months = Array.from({ length: 6 }, (_, i) => {
    const offset = 5 - i
    let y = cmY
    let m = cmM - offset
    while (m <= 0) { m += 12; y -= 1 }
    const key = `${y}-${String(m).padStart(2, '0')}`
    const label = new Date(y, m - 1, 1).toLocaleDateString('en-US', { month: 'short' })
    return { key, label }
  })

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

  const revenueSparkline = monthlyData.map((d) => d.netCents)

  // ── Business activity metrics ────────────────────────────────────────────
  type BookingsDataRow = {
    booking_date: string
    coach_client_id: string | null
    guest_name: string
    session_types: { title: string; price_cents: number } | { title: string; price_cents: number }[] | null
  }
  const bookingsData = (earningsRaw ?? []) as BookingsDataRow[]

  // This week: Mon–Sun
  const [tY, tM, tD] = today.split('-').map(Number)
  const todayDateObj  = new Date(tY, tM - 1, tD)
  const dow           = todayDateObj.getDay()
  const daysFromMon   = dow === 0 ? 6 : dow - 1
  const monDate       = new Date(tY, tM - 1, tD - daysFromMon)
  const sunDate       = new Date(tY, tM - 1, tD + (6 - daysFromMon))
  const pad           = (n: number) => String(n).padStart(2, '0')
  const weekStart     = `${monDate.getFullYear()}-${pad(monDate.getMonth() + 1)}-${pad(monDate.getDate())}`
  const weekEnd       = `${sunDate.getFullYear()}-${pad(sunDate.getMonth() + 1)}-${pad(sunDate.getDate())}`

  const weekRangeLabel = `${formatShortDate(weekStart)} – ${formatShortDate(weekEnd)}, ${weekStart.split('-')[0]}`

  const returningClients = (() => {
    const bookingsByClient = new Map<string, number>()
    for (const b of bookingsData) {
      if (b.coach_client_id) {
        bookingsByClient.set(b.coach_client_id, (bookingsByClient.get(b.coach_client_id) ?? 0) + 1)
      }
    }
    return [...bookingsByClient.values()].filter((n) => n > 1).length
  })()

  const cancelledLast30   = cancelledCount ?? 0
  const last30Total       = thisMonthSessions + cancelledLast30
  const cancellationAmber = last30Total > 0 && cancelledLast30 / last30Total > 0.2

  // ── Top session types (with revenue) ─────────────────────────────────────
  const sessionTypeRevenue = new Map<string, { bookings: number; netCents: number }>()
  for (const b of bookingsData) {
    const st    = b.session_types
    const title = Array.isArray(st) ? (st[0]?.title ?? null) : (st?.title ?? null)
    const price = Array.isArray(st) ? (st[0]?.price_cents ?? 0) : (st?.price_cents ?? 0)
    if (title) {
      const existing = sessionTypeRevenue.get(title) ?? { bookings: 0, netCents: 0 }
      sessionTypeRevenue.set(title, {
        bookings: existing.bookings + 1,
        netCents: existing.netCents + netCents(price),
      })
    }
  }
  const topSessionTypes = [...sessionTypeRevenue.entries()]
    .sort((a, b) => b[1].bookings - a[1].bookings)
    .slice(0, 5)

  // ── Top clients (by spending) ─────────────────────────────────────────────
  const clientMap = new Map<string, { name: string; sessions: number; netCents: number }>()
  for (const b of bookingsData) {
    const name  = toTitleCase(b.guest_name ?? 'Unknown')
    const st    = b.session_types
    const price = Array.isArray(st) ? (st[0]?.price_cents ?? 0) : (st?.price_cents ?? 0)
    const existing = clientMap.get(name) ?? { name, sessions: 0, netCents: 0 }
    clientMap.set(name, {
      name,
      sessions: existing.sessions + 1,
      netCents: existing.netCents + netCents(price),
    })
  }
  const topClients = [...clientMap.values()]
    .sort((a, b) => b.netCents - a.netCents)
    .slice(0, 5)

  // ── Recent activity ───────────────────────────────────────────────────────
  type ActivityRow = {
    id: string
    guest_name: string
    status: string
    created_at: string
    session_types: { title: string } | { title: string }[] | null
  }
  const recentActivity = ((activityRaw ?? []) as ActivityRow[]).map((b) => {
    const st    = b.session_types
    const title = Array.isArray(st) ? (st[0]?.title ?? '—') : (st?.title ?? '—')
    const name  = toTitleCase(b.guest_name ?? '')
    const time  = formatTimeAgo(b.created_at)
    if (b.status === 'completed') {
      return { id: b.id, type: 'completed' as const, label: 'Session completed', detail: `${title} with ${name}`, time }
    } else if (b.status === 'cancelled') {
      return { id: b.id, type: 'cancelled' as const, label: 'Session cancelled', detail: `${name} · ${title}`, time }
    } else {
      return { id: b.id, type: 'booking' as const, label: 'New booking', detail: `${name} booked ${title}`, time }
    }
  })

  // ── Bookings sparkline (by month) ─────────────────────────────────────────
  const bookingsByMonth = new Map<string, number>()
  for (const b of bookingsData) {
    const mk = (b.booking_date as string).slice(0, 7)
    bookingsByMonth.set(mk, (bookingsByMonth.get(mk) ?? 0) + 1)
  }
  const bookingsSparkline = last6Months.map(({ key }) => bookingsByMonth.get(key) ?? 0)

  return (
    <div className="px-6 py-8 min-h-screen">
      <TimezoneAutoDetect currentTimezone={coachTimezone} />
      <TrackOnMount event="dashboard_viewed" />
      {signup === '1' && <TrackOnMount event="signup_completed" />}

      <div className="space-y-6">

        {/* ── Page header ── */}
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-lg font-semibold text-zinc-100">Dashboard</h1>
            <p className="text-sm text-zinc-500 mt-0.5">Overview of your coaching business</p>
            {hasLapsedSubscription ? (
              <p className="text-sm font-medium text-amber-400 mt-1.5">
                Your plan has ended.{' '}
                <Link href="/upgrade" className="underline underline-offset-2 hover:text-amber-300 transition-colors">
                  Renew to continue
                </Link>
              </p>
            ) : remaining <= 0 && sessionLimit === 0 && used === 0 ? (
              <p className="text-sm font-medium text-amber-400 mt-1.5">
                Subscribe to start accepting bookings.{' '}
                <Link href="/upgrade" className="underline underline-offset-2 hover:text-amber-300 transition-colors">
                  See plans
                </Link>
              </p>
            ) : remaining <= 0 ? (
              <p className="text-sm font-medium text-amber-400 mt-1.5">
                You&apos;ve used your free sessions.{' '}
                <Link href="/upgrade" className="underline underline-offset-2 hover:text-amber-300 transition-colors">
                  Upgrade to continue
                </Link>
              </p>
            ) : remaining <= 3 ? (
              <p className="text-sm font-medium text-amber-400 mt-1.5">
                {remaining} session{remaining === 1 ? '' : 's'} remaining
              </p>
            ) : null}
          </div>
          <div className="flex items-center gap-3 flex-shrink-0">
            <div className="hidden sm:flex items-center gap-2 rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-1.5">
              <svg width="13" height="13" viewBox="0 0 13 13" fill="none" stroke="#71717a" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <rect x="1" y="1.5" width="11" height="9.5" rx="1.5" />
                <path d="M4 1v1.5M9 1v1.5M1 5h11" />
              </svg>
              <span className="text-xs text-zinc-500">{weekRangeLabel}</span>
            </div>
            <p className="text-sm text-zinc-500 hidden md:block truncate max-w-[200px]">{user.email}</p>
            <form action={logout}>
              <button
                type="submit"
                className="rounded-lg border border-zinc-700 px-3 py-1.5 text-sm text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200 transition-colors">
                Log out
              </button>
            </form>
          </div>
        </div>

        {/* ── Transient banners ── */}
        {upgraded === '1' && (
          <div className="rounded-xl border border-indigo-800 bg-indigo-950/40 px-5 py-4 space-y-0.5">
            <p className="text-sm font-semibold text-indigo-300">Your plan was updated</p>
            <p className="text-xs text-indigo-400">Your membership is active and your new limits are now available.</p>
          </div>
        )}
        {payout_connected === '1' && <PayoutSuccessBanner />}
        {payoutState !== 'ready' && <PayoutCard state={payoutState} />}
        {showOfferCard && (
          <LaunchOfferCard sessionsRemaining={offerSessionsLeft} expiresAt={offerExpiresAt!} />
        )}

        {/* ── KPI strip (4 cards with sparklines) ── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {/* Total revenue */}
          <div className="rounded-xl border border-zinc-800 bg-zinc-900 px-4 pt-3.5 pb-3 flex flex-col gap-1">
            <p className="text-xs font-medium text-zinc-500">Total revenue</p>
            <p className="text-2xl font-bold text-zinc-100">{formatEarnings(netTotal)}</p>
            <p className="text-xs text-zinc-600">{used} session{used !== 1 ? 's' : ''} total</p>
            <div className="mt-1">
              <Sparkline values={revenueSparkline} color="#6366f1" />
            </div>
          </div>

          {/* Bookings */}
          <div className="rounded-xl border border-zinc-800 bg-zinc-900 px-4 pt-3.5 pb-3 flex flex-col gap-1">
            <p className="text-xs font-medium text-zinc-500">Bookings</p>
            <p className="text-2xl font-bold text-zinc-100">{used}</p>
            <p className="text-xs text-zinc-600">{clientCount ?? 0} client{(clientCount ?? 0) !== 1 ? 's' : ''}</p>
            <div className="mt-1">
              <Sparkline values={bookingsSparkline} color="#818cf8" />
            </div>
          </div>

          {/* This month */}
          <div className="rounded-xl border border-zinc-800 bg-zinc-900 px-4 pt-3.5 pb-3 flex flex-col gap-1">
            <p className="text-xs font-medium text-zinc-500">This month</p>
            <p className="text-2xl font-bold text-zinc-100">{formatEarnings(thisMonthNet)}</p>
            {trendPct !== null ? (
              <p className={`text-xs font-medium ${trendPct >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                {trendPct >= 0 ? '↑' : '↓'} {Math.abs(trendPct)}% vs last month
              </p>
            ) : (
              <p className="text-xs text-zinc-600">{thisMonthSessions} session{thisMonthSessions !== 1 ? 's' : ''}</p>
            )}
            <div className="mt-1">
              <Sparkline values={revenueSparkline} color="#6366f1" />
            </div>
          </div>

          {/* Avg / session */}
          <div className="rounded-xl border border-zinc-800 bg-zinc-900 px-4 pt-3.5 pb-3 flex flex-col gap-1">
            <p className="text-xs font-medium text-zinc-500">Avg / session</p>
            <p className="text-2xl font-bold text-zinc-100">
              {used > 0 && netTotal > 0 ? formatEarnings(Math.round(netTotal / used)) : '—'}
            </p>
            <p className="text-xs text-zinc-600">{returningClients} returning client{returningClients !== 1 ? 's' : ''}</p>
            <div className="mt-1">
              <Sparkline
                values={revenueSparkline.map((v, i) => {
                  const bk = bookingsSparkline[i];
                  return bk > 0 ? Math.round(v / bk) : 0;
                })}
                color="#a5b4fc"
              />
            </div>
          </div>
        </div>

        {/* ── Onboarding checklist ── */}
        {upcoming.length === 0 && (
          <OnboardingChecklist
            hasSessionType={(sessionTypes ?? []).length > 0}
            hasAvailability={(availabilityCount ?? 0) > 0}
            hasBooking={(usedCount ?? 0) > 0}
            firstSessionSlug={sessionTypes?.[0]?.slug}
          />
        )}

        {/* ── Middle row: Revenue | Upcoming sessions | Recent activity ── */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_240px_240px] gap-4">

          {/* Revenue card */}
          <div className="rounded-xl border border-zinc-800 bg-zinc-900 px-5 pt-4 pb-5">
            <div className="flex items-end justify-between gap-4 mb-4">
              <div>
                <p className="text-xs font-medium text-zinc-500 mb-1">Revenue</p>
                <p className="text-2xl font-bold text-zinc-100">{formatEarnings(thisMonthNet)}</p>
                <p className="text-xs text-zinc-500 mt-0.5">This month</p>
              </div>
              {trendPct !== null && (
                <p className={`text-sm font-medium pb-0.5 ${trendPct >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                  {trendPct >= 0 ? '↑' : '↓'} {Math.abs(trendPct)}% from last month
                </p>
              )}
            </div>

            {/* 6-month bar chart */}
            {hasAnyRevenue ? (
              <div className="flex items-end gap-1 h-16">
                {monthlyData.map((d) => {
                  const isCurrent = d.month === currentMonthKey
                  const heightPct = Math.max((d.netCents / maxMonthNet) * 100, isCurrent ? 5 : 2)
                  return (
                    <div
                      key={d.month}
                      className={`flex flex-col items-center gap-1.5 ${isCurrent ? 'flex-[1.4] ml-1' : 'flex-1'}`}
                    >
                      <div
                        className={`w-full transition-none ${isCurrent ? 'rounded bg-indigo-400' : 'rounded-sm bg-zinc-700'}`}
                        style={{ height: `${heightPct}%` }}
                        title={`${d.label}: ${formatEarnings(d.netCents)}`}
                      />
                      <span className={`text-[10px] ${isCurrent ? 'text-zinc-300 font-medium' : 'text-zinc-600'}`}>
                        {d.label}
                      </span>
                    </div>
                  )
                })}
              </div>
            ) : (
              <div>
                {/* Ghost bars — decorative chart placeholder, no fake data */}
                <div className="flex items-end gap-1 h-16">
                  {[38, 55, 42, 68, 47, 30].map((h, i) => (
                    <div key={i} className="flex flex-col items-center gap-1.5 flex-1">
                      <div className="w-full rounded-sm bg-zinc-800/50" style={{ height: `${h}%` }} />
                      <span className="text-[10px] text-zinc-700">{last6Months[i]?.label ?? ''}</span>
                    </div>
                  ))}
                </div>
                <div className="mt-3 flex items-center justify-between gap-4">
                  <p className="text-xs text-zinc-600">Complete your first paid session to see earnings here.</p>
                  <Link
                    href="/dashboard/session-types"
                    className="text-xs text-indigo-400 hover:text-indigo-300 flex-shrink-0 transition-colors">
                    {sessionTypes && sessionTypes.length > 0 ? 'Share your link →' : 'Set up a session type →'}
                  </Link>
                </div>
              </div>
            )}

            {/* Supporting metrics */}
            <div className="grid grid-cols-4 gap-x-4 gap-y-3 mt-4 pt-4 border-t border-zinc-800">
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
                <p className="text-xs text-zinc-500">Last 30d</p>
                <p className="text-sm font-semibold text-zinc-100 mt-0.5">{formatEarnings(netLast30)}</p>
              </div>
            </div>
            <p className="text-xs text-zinc-600 mt-3">Confirmed &amp; completed sessions · Net after 10% platform fee</p>
          </div>

          {/* Upcoming sessions */}
          <div className="rounded-xl border border-zinc-800 bg-zinc-900 flex flex-col">
            <div className="px-4 pt-4 pb-3 border-b border-zinc-800 flex items-center justify-between flex-shrink-0">
              <p className="text-sm font-semibold text-zinc-100">Upcoming sessions</p>
              <Link
                href="/dashboard/bookings"
                className="text-xs text-zinc-500 hover:text-zinc-300 transition-colors">
                View all
              </Link>
            </div>

            {upcoming.length > 0 ? (
              <>
                <div className="divide-y divide-zinc-800 flex-1">
                  {upcoming.slice(0, 4).map((b) => {
                    return (
                      <div
                        key={b.id}
                        className="flex items-start gap-3 px-4 py-3"
                      >
                        <div className="flex-shrink-0 h-8 w-8 rounded-full bg-zinc-800 flex items-center justify-center text-xs font-bold text-zinc-300 mt-0.5">
                          {toTitleCase(b.guest_name).split(' ').map((n: string) => n[0]).slice(0, 2).join('')}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-zinc-100 truncate">{toTitleCase(b.guest_name)}</p>
                          <span className="inline-block mt-0.5 rounded-full bg-indigo-950/60 border border-indigo-800/50 text-indigo-300 text-[10px] px-2 py-0.5 truncate max-w-full">
                            {b.sessionTitle}
                          </span>
                          <p className="text-xs text-zinc-600 mt-0.5">
                            {formatDate(b.booking_date)} · {formatTime(b.start_time)}
                          </p>
                        </div>
                      </div>
                    )
                  })}
                </div>
                {next && (
                  <div className="px-4 py-3 border-t border-zinc-800 flex-shrink-0">
                    <RelativeTime
                      bookingDate={next.booking_date}
                      startTime={next.start_time}
                      endTime={next.end_time}
                    />
                  </div>
                )}
              </>
            ) : sessionTypes && sessionTypes.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center px-5 py-10 text-center space-y-3">
                <p className="text-sm text-zinc-400">You&apos;re not set up yet</p>
                <p className="text-xs text-zinc-600">Create a session type and set your availability to start accepting bookings.</p>
                <div className="flex flex-col gap-2 pt-1 w-full">
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
              <div className="flex-1 flex flex-col items-center justify-center px-5 py-10 text-center gap-4">
                <div className="h-10 w-10 rounded-full bg-zinc-800 flex items-center justify-center">
                  <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="#71717a" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="1.5" y="2.5" width="15" height="13" rx="2" />
                    <path d="M1.5 7h15M6 1.5v2M12 1.5v2" />
                  </svg>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium text-zinc-300">No upcoming sessions</p>
                  <p className="text-xs text-zinc-500 leading-relaxed">You&apos;re set up — share your booking link to start accepting clients.</p>
                </div>
                <Link
                  href="/dashboard/session-types"
                  className="text-xs font-medium text-indigo-400 hover:text-indigo-300 transition-colors">
                  Go to session types →
                </Link>
              </div>
            )}
          </div>

          {/* Recent activity */}
          <div className="rounded-xl border border-zinc-800 bg-zinc-900 flex flex-col">
            <div className="px-4 pt-4 pb-3 border-b border-zinc-800 flex items-center justify-between flex-shrink-0">
              <p className="text-sm font-semibold text-zinc-100">Recent activity</p>
            </div>

            {recentActivity.length > 0 ? (
              <div className="divide-y divide-zinc-800 flex-1">
                {recentActivity.slice(0, 6).map((item) => {
                  const iconBg =
                    item.type === 'completed' ? 'bg-indigo-600/20 text-indigo-400' :
                    item.type === 'cancelled'  ? 'bg-red-600/20 text-red-400' :
                    'bg-green-600/20 text-green-400'

                  const icon =
                    item.type === 'completed' ? (
                      <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M2 6l3 3 5-5" />
                      </svg>
                    ) : item.type === 'cancelled' ? (
                      <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round">
                        <path d="M3 3l6 6M9 3l-6 6" />
                      </svg>
                    ) : (
                      <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="1" y="1.5" width="10" height="9" rx="1.5" />
                        <path d="M4 1v1.5M8 1v1.5M1 5h10" />
                      </svg>
                    )

                  return (
                    <div key={item.id} className="flex items-start gap-3 px-4 py-3">
                      <div className={`flex-shrink-0 h-7 w-7 rounded-full flex items-center justify-center mt-0.5 ${iconBg}`}>
                        {icon}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium text-zinc-200">{item.label}</p>
                        <p className="text-xs text-zinc-500 truncate mt-0.5">{item.detail}</p>
                      </div>
                      <p className="text-[10px] text-zinc-600 flex-shrink-0 mt-0.5">{item.time}</p>
                    </div>
                  )
                })}
              </div>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center px-5 py-10 text-center gap-3">
                <div className="h-10 w-10 rounded-full bg-zinc-800 flex items-center justify-center">
                  <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="#71717a" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="9" cy="9" r="7.5" />
                    <path d="M9 4.5v4.5l2.5 1.5" />
                  </svg>
                </div>
                <div className="space-y-1.5">
                  <p className="text-sm font-medium text-zinc-300">No activity yet</p>
                  <p className="text-xs text-zinc-500 leading-relaxed max-w-[190px]">New bookings, completed sessions, and cancellations will appear here automatically.</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ── Bottom row: Top session types | Top clients ── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

          {/* Top session types */}
          <div className="space-y-4">
            <div className="rounded-xl border border-zinc-800 bg-zinc-900 overflow-hidden">
              <div className="px-4 pt-4 pb-3 border-b border-zinc-800 flex items-center justify-between">
                <p className="text-sm font-semibold text-zinc-100">Top session types</p>
                <Link href="/dashboard/session-types" className="text-xs text-zinc-500 hover:text-zinc-300 transition-colors">View all</Link>
              </div>
              {topSessionTypes.length > 0 ? (
                <div>
                  <div className="grid grid-cols-[1fr_64px_80px] px-4 py-2 border-b border-zinc-800/60">
                    <p className="text-[10px] font-semibold uppercase tracking-wider text-zinc-600">Session type</p>
                    <p className="text-[10px] font-semibold uppercase tracking-wider text-zinc-600 text-right">Bookings</p>
                    <p className="text-[10px] font-semibold uppercase tracking-wider text-zinc-600 text-right">Revenue</p>
                  </div>
                  <div className="divide-y divide-zinc-800/60">
                    {topSessionTypes.map(([title, data]) => (
                      <div key={title} className="grid grid-cols-[1fr_64px_80px] px-4 py-3 items-center">
                        <p className="text-sm font-medium text-zinc-200 truncate pr-3">{title}</p>
                        <p className="text-sm text-zinc-400 text-right">{data.bookings}</p>
                        <p className="text-sm text-zinc-300 font-medium text-right">{formatEarnings(data.netCents)}</p>
                      </div>
                    ))}
                  </div>
                </div>
              ) : sessionTypes && sessionTypes.length === 0 ? (
                <div className="px-4 py-8 text-center space-y-3">
                  <div className="h-10 w-10 rounded-full bg-zinc-800 flex items-center justify-center mx-auto">
                    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="#71717a" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M1.5 6l7-4 7 4-7 4-7-4z" />
                      <path d="M1.5 10.5l7 4 7-4" />
                    </svg>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-zinc-300">No session types yet</p>
                    <p className="text-xs text-zinc-600">Create your first session type to start accepting paid bookings.</p>
                  </div>
                  <Link
                    href="/dashboard/session-types"
                    className="inline-block rounded-lg bg-indigo-600 px-4 py-2 text-xs font-semibold text-white hover:bg-indigo-500 transition-colors">
                    Create a session type
                  </Link>
                </div>
              ) : (
                <div className="px-4 py-8 text-center space-y-1.5">
                  <p className="text-sm font-medium text-zinc-300">Your session types are ready</p>
                  <p className="text-xs text-zinc-600 leading-relaxed">Share your booking link to get your first booking — performance data will appear here automatically.</p>
                  <div className="pt-1">
                    <Link href="/dashboard/session-types" className="text-xs text-indigo-400 hover:text-indigo-300 transition-colors">
                      Share your link →
                    </Link>
                  </div>
                </div>
              )}
            </div>

            {/* Booking links */}
            <div className="rounded-xl border border-zinc-800 bg-zinc-900 overflow-hidden">
              <div className="px-4 pt-4 pb-3 border-b border-zinc-800 flex items-center justify-between">
                <p className="text-sm font-semibold text-zinc-100">Share your links</p>
              </div>
              {sessionTypes && sessionTypes.length > 0 ? (
                <div>
                  {/* Start-here callout for coaches with no bookings yet */}
                  {used === 0 && (
                    <div className="px-4 py-3 bg-indigo-950/30 border-b border-indigo-900/40 flex items-start gap-2.5">
                      <svg width="13" height="13" viewBox="0 0 13 13" fill="none" className="flex-shrink-0 mt-0.5 text-indigo-400" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round">
                        <circle cx="6.5" cy="6.5" r="5.5" />
                        <path d="M6.5 4.5v3.5M6.5 9.5v.25" strokeWidth="1.5" />
                      </svg>
                      <p className="text-xs text-indigo-300 leading-relaxed">Share this link with potential clients to get your first booking.</p>
                    </div>
                  )}
                  <div className="divide-y divide-zinc-800">
                    {sessionTypes.map((st, i) => {
                      const url = `${baseUrl}/book/${st.slug}`
                      return (
                        <div key={st.id} className="flex items-center justify-between px-4 py-3 gap-4">
                          <div className="min-w-0">
                            <div className="flex items-center gap-2">
                              <p className="text-sm font-medium text-zinc-200 truncate">{st.title}</p>
                              {i === 0 && sessionTypes.length > 1 && (
                                <span className="flex-shrink-0 rounded border border-zinc-700 px-1.5 py-0.5 text-xs text-zinc-500">
                                  Latest
                                </span>
                              )}
                            </div>
                            <p className="text-xs text-zinc-500 truncate mt-0.5">
                              {baseUrl.replace(/^https?:\/\//, '')}/book/{st.slug}
                            </p>
                          </div>
                          <CopyButton text={url} />
                        </div>
                      )
                    })}
                  </div>
                </div>
              ) : (
                <div className="px-5 py-8 text-center space-y-4">
                  <div className="h-10 w-10 rounded-full bg-zinc-800 flex items-center justify-center mx-auto">
                    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="#71717a" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M7.5 11a4.5 4.5 0 0 0 6.36 0l1.77-1.77a4.5 4.5 0 0 0-6.36-6.36l-1.13 1.13" />
                      <path d="M10.5 7a4.5 4.5 0 0 0-6.36 0L2.37 8.77a4.5 4.5 0 0 0 6.36 6.36l1.13-1.13" />
                    </svg>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-zinc-300">Ready to accept bookings?</p>
                    <p className="text-xs text-zinc-600 leading-relaxed">Create a session type to get your shareable booking link.</p>
                  </div>
                  <Link
                    href="/dashboard/session-types"
                    className="inline-block rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-500 transition-colors">
                    Create a session type
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* Right: Top clients + Plan */}
          <div className="space-y-4">
            {/* Top clients */}
            <div className="rounded-xl border border-zinc-800 bg-zinc-900 overflow-hidden">
              <div className="px-4 pt-4 pb-3 border-b border-zinc-800 flex items-center justify-between">
                <p className="text-sm font-semibold text-zinc-100">Top clients</p>
                <Link href="/dashboard/clients" className="text-xs text-zinc-500 hover:text-zinc-300 transition-colors">View all</Link>
              </div>
              {topClients.length > 0 ? (
                <div>
                  <div className="grid grid-cols-[1fr_64px_80px] px-4 py-2 border-b border-zinc-800/60">
                    <p className="text-[10px] font-semibold uppercase tracking-wider text-zinc-600">Client</p>
                    <p className="text-[10px] font-semibold uppercase tracking-wider text-zinc-600 text-right">Sessions</p>
                    <p className="text-[10px] font-semibold uppercase tracking-wider text-zinc-600 text-right">Spent</p>
                  </div>
                  <div className="divide-y divide-zinc-800/60">
                    {topClients.map((client) => {
                      const initials = client.name.split(' ').map((n) => n[0]).slice(0, 2).join('')
                      return (
                        <div key={client.name} className="grid grid-cols-[1fr_64px_80px] px-4 py-3 items-center gap-2">
                          <div className="flex items-center gap-2.5 min-w-0">
                            <div className="flex-shrink-0 h-7 w-7 rounded-full bg-zinc-800 flex items-center justify-center text-xs font-bold text-zinc-300">
                              {initials}
                            </div>
                            <div className="min-w-0">
                              <p className="text-sm font-medium text-zinc-200 truncate">{client.name}</p>
                              <p className="text-xs text-zinc-600">{client.sessions} session{client.sessions !== 1 ? 's' : ''}</p>
                            </div>
                          </div>
                          <p className="text-sm text-zinc-400 text-right">{client.sessions}</p>
                          <p className="text-sm text-zinc-300 font-medium text-right">{formatEarnings(client.netCents)}</p>
                        </div>
                      )
                    })}
                  </div>
                </div>
              ) : (
                <div className="px-4 py-8 text-center space-y-3">
                  <div className="h-10 w-10 rounded-full bg-zinc-800 flex items-center justify-center mx-auto">
                    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="#71717a" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="7" cy="6" r="3" />
                      <path d="M1.5 16c0-3 2.5-5.5 5.5-5.5s5.5 2.5 5.5 5.5" />
                      <path d="M13.5 9c1.66.33 3 1.84 3 3.5v2" />
                      <circle cx="13.5" cy="5.5" r="2.5" />
                    </svg>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-zinc-300">No clients yet</p>
                    <p className="text-xs text-zinc-600 leading-relaxed max-w-[200px] mx-auto">Clients are added automatically when someone books. Their sessions and spending will appear here.</p>
                  </div>
                  {sessionTypes && sessionTypes.length > 0 && (
                    <Link href="/dashboard/session-types" className="text-xs text-indigo-400 hover:text-indigo-300 transition-colors">
                      Share your booking link →
                    </Link>
                  )}
                </div>
              )}
            </div>

            {/* Plan & usage */}
            <div className="space-y-3">
              <p className="text-xs font-medium uppercase tracking-wider text-zinc-500">Your plan</p>
              {cancellationAmber && (
                <p className="text-xs text-amber-400">
                  High cancellation rate this month ({cancelledLast30} cancelled).
                </p>
              )}
              {remaining >= 1 && remaining <= 3 && (
                <p className="text-sm text-amber-400">
                  {remaining} session{remaining === 1 ? '' : 's'} remaining before you hit your limit.{' '}
                  {planKey === 'free' && (
                    <Link href="/upgrade" className="font-medium underline underline-offset-2 hover:text-amber-300 transition-colors">
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
                <p className="text-sm text-zinc-400">
                  Your plan access ends{accessEndDateLabel ? ` on ${accessEndDateLabel}` : ' at the end of your billing period'}.
                  You&apos;ll need to resubscribe to continue accepting bookings.
                </p>
              )}
            </div>

            {payoutState === 'ready' && (
              <form action={managePayouts}>
                <button
                  type="submit"
                  className="w-full rounded-xl border border-zinc-800 bg-zinc-900 px-4 py-3.5 text-left hover:border-zinc-700 hover:bg-zinc-800/50 transition-colors">
                  <p className="text-sm font-medium text-zinc-200">Manage Payments</p>
                  <p className="text-xs text-zinc-500 mt-0.5">Payouts &amp; Stripe dashboard</p>
                </button>
              </form>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
