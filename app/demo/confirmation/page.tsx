// Demo-only page — not linked from production UI, no real data access.
export default function DemoConfirmationPage() {
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

        <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-8 space-y-4 text-left">
          <div className="text-center space-y-1">
            <h1 className="text-2xl font-semibold tracking-tight text-zinc-100">You&apos;re booked!</h1>
            <p className="text-sm text-zinc-400">
              Payment confirmed. Check your email for session details and a secure join link.
            </p>
          </div>

          <div className="border-t border-zinc-800 pt-4 space-y-3">
            <div className="flex justify-between items-baseline gap-2">
              <span className="text-xs text-zinc-400 uppercase tracking-wider">Name</span>
              <span className="text-sm text-zinc-200 text-right">Sarah G.</span>
            </div>
            <div className="flex justify-between items-baseline gap-2">
              <span className="text-xs text-zinc-400 uppercase tracking-wider">Email</span>
              <span className="text-sm text-zinc-200 text-right">S.Gomes383@gmail.com</span>
            </div>
            <div className="flex justify-between items-baseline gap-2">
              <span className="text-xs text-zinc-400 uppercase tracking-wider">Coach</span>
              <span className="text-sm text-zinc-200 text-right">Alex Carter</span>
            </div>
            <div className="flex justify-between items-baseline gap-2">
              <span className="text-xs text-zinc-400 uppercase tracking-wider">Date</span>
              <span className="text-sm text-zinc-200 text-right">Thursday, May 12, 2026</span>
            </div>
            <div className="flex justify-between items-baseline gap-2">
              <span className="text-xs text-zinc-400 uppercase tracking-wider">Time</span>
              <span className="text-sm text-zinc-200 text-right">2:00 PM</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}
