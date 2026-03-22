import Link from 'next/link'

export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center space-y-6">
        <h1 className="text-4xl font-bold">CallSesh</h1>
        <p className="text-zinc-500">Run paid coaching calls in one link</p>
        <div className="flex justify-center gap-3">
          <Link
            href="/signup"
            className="rounded bg-black px-5 py-2 text-sm font-medium text-white hover:bg-zinc-800"
          >
            Sign up
          </Link>
          <Link
            href="/login"
            className="rounded border px-5 py-2 text-sm font-medium hover:bg-zinc-50"
          >
            Log in
          </Link>
        </div>
      </div>
    </div>
  )
}
