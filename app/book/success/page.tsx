import Link from 'next/link'

export default function BookingSuccessPage() {
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
