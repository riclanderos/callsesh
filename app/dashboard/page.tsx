import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { logout } from '@/app/actions/auth';

const sections = [
  {
    title: 'Session Types',
    description: 'Define the coaching sessions you offer.',
    href: '/dashboard/session-types',
  },
  {
    title: 'Bookings',
    description: 'View and manage upcoming sessions.',
    href: '/dashboard/bookings',
  },
  {
    title: 'Billing',
    description: 'Track payments and manage payouts.',
    href: null,
  },
  {
    title: 'Availability',
    description: "Set the days and times you're available.",
    href: '/dashboard/availability',
  },
  {
    title: 'Settings',
    description: 'Manage your timezone and account preferences.',
    href: '/dashboard/settings',
  },
];

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  return (
    <div className="min-h-screen p-8">
      <div className="mx-auto max-w-3xl space-y-8">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-semibold">CallSesh Dashboard</h1>
            <p className="mt-1 text-sm text-zinc-500">
              Welcome back, {user.email}
            </p>
          </div>
          <form action={logout}>
            <button
              type="submit"
              className="rounded border px-4 py-2 text-sm hover:bg-zinc-50">
              Log out
            </button>
          </form>
        </div>

        {/* Section cards */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {sections.map((section) => {
            const card = (
              <div className="space-y-1">
                <h2 className="font-medium">{section.title}</h2>
                <p className="text-sm text-zinc-500">{section.description}</p>
              </div>
            );

            return section.href ? (
              <Link
                key={section.title}
                href={section.href}
                className="rounded-lg border p-5 hover:bg-zinc-50 block">
                {card}
              </Link>
            ) : (
              <div
                key={section.title}
                className="rounded-lg border p-5 text-zinc-400 cursor-not-allowed">
                {card}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
