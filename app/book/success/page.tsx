import Link from 'next/link'

export default function BookingSuccessPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-50 p-8">
      <div className="max-w-md w-full space-y-8 text-center">

        {/* Checkmark */}
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-50">
          <svg
            className="h-8 w-8 text-green-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2.5}
            aria-hidden="true"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>

        <div className="space-y-3">
          <h1 className="text-2xl font-semibold tracking-tight">You&apos;re booked!</h1>
          <p className="text-sm text-zinc-500 leading-relaxed">
            Payment confirmed. A confirmation email is on its way with your session
            details and a secure link to join the video call.
          </p>
        </div>

        <Link
          href="/"
          className="inline-block text-sm text-zinc-400 hover:text-zinc-700 transition-colors"
        >
          ← Back to home
        </Link>

      </div>
    </div>
  )
}
