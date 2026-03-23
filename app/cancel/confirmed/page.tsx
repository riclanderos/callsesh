export default function CancelConfirmedPage() {
  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-md space-y-8 text-center">

        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border border-zinc-700 bg-zinc-800">
          <svg
            className="h-7 w-7 text-zinc-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
            aria-hidden="true"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </div>

        <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-8 space-y-3">
          <h1 className="text-2xl font-semibold tracking-tight text-zinc-100">Booking cancelled</h1>
          <p className="text-sm text-zinc-400 leading-relaxed">
            Your booking has been cancelled. If a refund applies, it will be
            processed according to the coach&apos;s cancellation policy.
          </p>
        </div>

      </div>
    </div>
  )
}
