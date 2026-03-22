export default function CancelConfirmedPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-50 p-8">
      <div className="max-w-md w-full space-y-8 text-center">

        {/* Icon */}
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-zinc-100">
          <svg
            className="h-7 w-7 text-zinc-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
            aria-hidden="true"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </div>

        <div className="space-y-3">
          <h1 className="text-2xl font-semibold tracking-tight">Booking cancelled</h1>
          <p className="text-sm text-zinc-500 leading-relaxed">
            Your booking has been cancelled. If a refund applies, it will be
            processed according to the coach&apos;s cancellation policy.
          </p>
        </div>

      </div>
    </div>
  )
}
