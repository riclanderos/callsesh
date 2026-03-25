import Link from 'next/link'
import { createServiceClient } from '@/lib/supabase/service'

export default async function BookingSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ session_id?: string }>
}) {
  const { session_id } = await searchParams

  // Verify a real confirmed booking exists for this Stripe checkout session.
  // The service client bypasses RLS — this is a public page with no guest auth.
  let confirmed = false
  if (session_id) {
    const { data } = await createServiceClient()
      .from('bookings')
      .select('id')
      .eq('stripe_checkout_session_id', session_id)
      .eq('status', 'confirmed')
      .maybeSingle()

    confirmed = !!data
  }

  if (!confirmed) {
    return (
      <div className="flex min-h-screen items-center justify-center px-4">
        <div className="w-full max-w-md space-y-8 text-center">

          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border border-amber-900 bg-amber-950">
            <svg
              className="h-8 w-8 text-amber-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2.5}
              aria-hidden="true"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
            </svg>
          </div>

          <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-8 space-y-3">
            <h1 className="text-2xl font-semibold tracking-tight text-zinc-100">
              This time slot is no longer available
            </h1>
            <p className="text-sm text-zinc-400 leading-relaxed">
              Someone else booked this slot at the same time. Your booking was not completed.
            </p>
            <p className="text-sm text-zinc-500 leading-relaxed">
              If payment was collected, please contact{' '}
              <a
                href="mailto:support@landerossystems.com"
                className="text-indigo-400 hover:text-indigo-300 transition-colors"
              >
                support@landerossystems.com
              </a>{' '}
              and we&apos;ll arrange a full refund.
            </p>
          </div>

          <Link
            href="/"
            className="inline-block text-sm text-zinc-500 hover:text-zinc-300 transition-colors"
          >
            ← Back to home
          </Link>

        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-md space-y-8 text-center">

        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border border-green-900 bg-green-950">
          <svg
            className="h-8 w-8 text-green-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2.5}
            aria-hidden="true"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>

        <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-8 space-y-3">
          <h1 className="text-2xl font-semibold tracking-tight text-zinc-100">You&apos;re booked!</h1>
          <p className="text-sm text-zinc-400 leading-relaxed">
            Payment confirmed. A confirmation email is on its way with your session
            details and a secure link to join the video call.
          </p>
        </div>

        <Link
          href="/"
          className="inline-block text-sm text-zinc-500 hover:text-zinc-300 transition-colors"
        >
          ← Back to home
        </Link>

      </div>
    </div>
  )
}
