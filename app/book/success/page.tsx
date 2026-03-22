import Link from 'next/link'

export default function BookingSuccessPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-8">
      <div className="max-w-md w-full space-y-4 text-center">
        <h1 className="text-2xl font-semibold">You're booked!</h1>
        <p className="text-sm text-zinc-500">
          Your payment was successful. Check your email for a confirmation with
          all the session details.
        </p>
        <Link
          href="/"
          className="inline-block mt-4 text-sm text-zinc-500 hover:text-black"
        >
          ← Back to home
        </Link>
      </div>
    </div>
  )
}
