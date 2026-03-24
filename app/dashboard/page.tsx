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
  searchParams: Promise<{ upgraded?: string }>;
}) {
  const { upgraded } = await searchParams;
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

  const today = new Date().toISOString().split('T')[0];

  const [
    { data: upcomingRaw },
    { data: sessionTypes },
    { count: usedCount },
    { sessionLimit, planName, planKey },
  ] = await Promise.all([
    supabase
      .from('bookings')
      .select(
        'id, guest_name, booking_date, start_time, end_time, session_types(title)',
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
  ]);

  const { data: subscriptionRow } = await createServiceClient()
    .from('subscriptions')
    .select('cancel_at_period_end, current_period_end')
    .eq('user_id', user.id)
    .maybeSingle();

  const cancelAtPeriodEnd = subscriptionRow?.cancel_at_period_end === true;

  const downgradeDateLabel = subscriptionRow?.current_period_end
    ? new Date(subscriptionRow.current_period_end).toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
      })
    : null;

  const targetPlanName = planKey === 'pro' ? 'Starter' : 'a different plan';

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

  return (
    <div className="min-h-screen px-6 py-10">
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

        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <h1 className="text-2xl font-semibold text-zinc-100">
              Your dashboard
            </h1>
            <p className="text-sm text-zinc-500">{user.email}</p>
            {remaining <= 0 ? (
              <p className="text-xs font-medium text-amber-400">
                You&apos;ve used your free sessions.{' '}
                <a
                  href="/upgrade"
                  className="underline underline-offset-2 hover:text-amber-300 transition-colors">
                  Upgrade to continue
                </a>
              </p>
            ) : remaining <= 3 ? (
              <p className="text-xs font-medium text-amber-400">
                {remaining} session{remaining === 1 ? '' : 's'} remaining
              </p>
            ) : planKey === 'pro' ? (
              <p className="text-xs text-zinc-500">Unlimited sessions</p>
            ) : (
              <p className="text-xs text-zinc-500">
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

        {/* Next session */}
        <section className="space-y-3">
          <p className="text-xs font-medium uppercase tracking-wider text-zinc-500">
            Next session
          </p>
          {next ? (
            <div className="rounded-xl border border-indigo-900 bg-zinc-800/60 p-6">
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-1.5">
                  <p className="text-lg font-semibold text-zinc-100">
                    {toTitleCase(next.guest_name)}
                  </p>
                  <p className="text-sm text-zinc-400">{next.sessionTitle}</p>
                  <RelativeTime
                    bookingDate={next.booking_date}
                    startTime={next.start_time}
                    endTime={next.end_time}
                  />
                </div>
                <Link
                  href="/dashboard/bookings"
                  className="flex-shrink-0 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-500 transition-colors">
                  Open session
                </Link>
              </div>
            </div>
          ) : (
            <div className="rounded-xl border border-zinc-800 bg-zinc-900 px-5 py-6 text-center">
              <p className="text-sm text-zinc-500">No upcoming sessions.</p>
            </div>
          )}
        </section>

        {/* Upcoming sessions */}
        {rest.length > 0 && (
          <section className="space-y-3">
            <p className="text-xs font-medium uppercase tracking-wider text-zinc-500">
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
                    <p className="text-xs text-zinc-500">
                      {formatDate(b.booking_date)} · {formatTime(b.start_time)}
                    </p>
                  </div>
                  <span className="flex-shrink-0 text-xs text-zinc-500">
                    {b.sessionTitle}
                  </span>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Booking links */}
        <section className="space-y-3">
          <p className="text-xs font-medium uppercase tracking-wider text-zinc-500">
            Your booking links
          </p>
          {sessionTypes && sessionTypes.length > 0 ? (
            <div className="rounded-xl border border-zinc-800 bg-zinc-900 divide-y divide-zinc-800">
              {sessionTypes.map((st) => {
                const url = `${baseUrl}/book/${st.slug}`;
                return (
                  <div
                    key={st.id}
                    className="flex items-center justify-between px-5 py-4 gap-4">
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-zinc-100">
                        {st.title}
                      </p>
                      <p className="text-xs mt-0.5 truncate">
                        <span className="text-zinc-600">
                          {baseUrl.replace(/^https?:\/\//, '')}
                        </span>
                        <span className="text-zinc-300">/book/{st.slug}</span>
                      </p>
                    </div>
                    <CopyButton text={url} />
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="rounded-xl border border-zinc-800 bg-zinc-900 px-5 py-6 text-center">
              <p className="text-sm text-zinc-500">
                No active session types.{' '}
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
          <p className="text-xs font-medium uppercase tracking-wider text-zinc-500">
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
          <p className="text-xs font-medium uppercase tracking-wider text-zinc-500">
            Manage
          </p>
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
            {[
              { title: 'Session Types', href: '/dashboard/session-types' },
              { title: 'Bookings', href: '/dashboard/bookings' },
              { title: 'Availability', href: '/dashboard/availability' },
              { title: 'Settings', href: '/dashboard/settings' },
            ].map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="rounded-lg border border-zinc-800 px-4 py-2.5 text-sm text-zinc-500 hover:border-zinc-700 hover:text-zinc-300 transition-colors">
                {item.title} →
              </Link>
            ))}
          </div>
        </section>

        {/* Plan & usage */}
        <section className="space-y-3">
          <p className="text-xs font-medium uppercase tracking-wider text-zinc-500">
            Your plan
          </p>
          {remaining >= 1 && remaining <= 3 && (
            <p className="text-xs text-amber-400 px-1">
              You have {remaining} session{remaining === 1 ? '' : 's'} remaining
              before you hit your limit.{' '}
              <Link
                href="/upgrade"
                className="font-medium underline underline-offset-2 hover:text-amber-300 transition-colors">
                Upgrade
              </Link>
            </p>
          )}
          <PlanUsageCard
            sessionsUsed={used}
            sessionLimit={sessionLimit}
            planName={planName}
            planKey={planKey}
          />
          {cancelAtPeriodEnd && (
            <p className="text-xs text-zinc-500 px-1">
              Your plan will downgrade to {targetPlanName}
              {downgradeDateLabel ? ` on ${downgradeDateLabel}` : ' at the end of your billing period'}.
            </p>
          )}
        </section>
      </div>
    </div>
  );
}
