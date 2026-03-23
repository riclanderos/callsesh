import Link from 'next/link'

export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-sm space-y-8 text-center">

        <div className="space-y-2">
          <h1 className="text-4xl font-bold tracking-tight text-zinc-100">CallSesh</h1>
          <p className="text-sm text-zinc-400">Run paid coaching calls in one link</p>
        </div>

        <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-6 space-y-3">
          <Link
            href="/signup"
            className="block w-full rounded-lg bg-white px-5 py-2.5 text-sm font-semibold text-zinc-900 hover:bg-zinc-100 transition-colors"
          >
            Sign up
          </Link>
          <Link
            href="/login"
            className="block w-full rounded-lg border border-zinc-700 px-5 py-2.5 text-sm font-medium text-zinc-300 hover:bg-zinc-800 hover:text-zinc-100 transition-colors"
          >
            Log in
          </Link>
        </div>

      </div>
    </div>
  )
}
