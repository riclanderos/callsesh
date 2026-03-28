'use client'

import { useActionState } from 'react'
import Link from 'next/link'
import { login } from '@/app/actions/auth'
import PasswordInput from '@/components/ui/password-input'

export default function LoginPage() {
  const [error, action, pending] = useActionState(login, null)

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-sm space-y-6">

        <Link href="/" className="text-xs text-zinc-600 hover:text-zinc-400 transition-colors">
          ← Back to home
        </Link>

        <div className="space-y-1">
          <h1 className="text-2xl font-semibold text-zinc-100">Log in</h1>
          <p className="text-sm text-zinc-500">Welcome back to CallSesh</p>
        </div>

        <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-6 space-y-4">
          <form action={action} className="space-y-4">
            <div className="space-y-1.5">
              <label htmlFor="email" className="text-xs font-medium uppercase tracking-wider text-zinc-300">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                autoComplete="email"
                className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-2.5 text-sm text-zinc-100 placeholder:text-zinc-500 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/40 transition-colors"
              />
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label htmlFor="password" className="text-xs font-medium uppercase tracking-wider text-zinc-300">
                  Password
                </label>
                <Link
                  href="/forgot-password"
                  className="text-xs text-zinc-500 hover:text-zinc-300 transition-colors"
                >
                  Forgot your password?
                </Link>
              </div>
              <PasswordInput id="password" name="password" autoComplete="current-password" />
            </div>

            {error && (
              <p className="rounded-lg border border-red-900 bg-red-950 px-3 py-2 text-sm text-red-400">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={pending}
              className="w-full rounded-lg bg-indigo-600 py-2.5 text-sm font-semibold text-white hover:bg-indigo-500 disabled:opacity-50 transition-colors"
            >
              {pending ? 'Logging in…' : 'Log in'}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-3 pt-2">
            <div className="h-px flex-1 bg-zinc-800" />
            <span className="text-xs text-zinc-600">or</span>
            <div className="h-px flex-1 bg-zinc-800" />
          </div>

          {/* Magic link — functionality wired later */}
          <button
            type="button"
            className="w-full rounded-lg border border-zinc-700 bg-zinc-800 py-2.5 text-sm font-medium text-zinc-300 hover:border-zinc-600 hover:text-zinc-100 transition-colors"
          >
            Email me a sign-in link
          </button>

        </div>

        <p className="text-center text-sm text-zinc-400 pt-2">
          Don&apos;t have an account?{' '}
          <Link href="/signup" className="font-medium text-indigo-400 underline-offset-2 hover:text-indigo-300 hover:underline transition-colors">
            Sign up
          </Link>
        </p>

      </div>
    </div>
  )
}
