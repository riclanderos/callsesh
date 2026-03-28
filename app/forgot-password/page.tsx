'use client'

import { useState } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [pending, setPending] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setPending(true)
    setError(null)

    const supabase = createClient()
    const { error: authError } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: window.location.origin + '/reset-password',
    })

    setPending(false)

    if (authError) {
      setError(authError.message)
    } else {
      setSubmitted(true)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-sm space-y-6">

        <Link href="/login" className="text-xs text-zinc-600 hover:text-zinc-400 transition-colors">
          ← Back to log in
        </Link>

        <div className="space-y-1">
          <h1 className="text-2xl font-semibold text-zinc-100">Reset password</h1>
          <p className="text-sm text-zinc-500">
            {submitted
              ? 'Check your inbox for the reset link.'
              : "We'll send a reset link to your email."}
          </p>
        </div>

        {submitted ? (
          <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-6 space-y-3">
            <p className="text-sm font-semibold text-zinc-100">Check your email</p>
            <p className="text-sm text-zinc-400">
              A password reset link was sent to{' '}
              <span className="text-zinc-200">{email}</span>. It may take a
              minute to arrive.
            </p>
          </div>
        ) : (
          <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label
                  htmlFor="email"
                  className="text-xs font-medium uppercase tracking-wider text-zinc-300"
                >
                  Email
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-2.5 text-sm text-zinc-100 placeholder:text-zinc-500 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/40 transition-colors"
                />
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
                {pending ? 'Sending…' : 'Send reset link'}
              </button>
            </form>
          </div>
        )}

      </div>
    </div>
  )
}
