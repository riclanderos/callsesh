'use client'

import { useState } from 'react'

export default function JoinButton({
  bookingId,
  guestToken,
}: {
  bookingId: string
  guestToken?: string
}) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleJoin() {
    setLoading(true)
    setError(null)

    try {
      const res = await fetch(`/api/session/${bookingId}/token`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ guestToken: guestToken ?? null }),
      })

      if (!res.ok) {
        setError('Could not start the session. Please try again.')
        return
      }

      const { token, roomUrl } = (await res.json()) as {
        token: string
        roomUrl: string
      }

      // Navigate to Daily Prebuilt with the meeting token.
      window.location.href = `${roomUrl}?t=${token}`
    } catch {
      setError('Could not start the session. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-3">
      <button
        onClick={handleJoin}
        disabled={loading}
        className="w-full rounded-xl bg-black py-3.5 text-center text-sm font-semibold text-white hover:bg-zinc-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        {loading ? 'Starting session…' : 'Join session →'}
      </button>
      {error && (
        <p className="rounded-lg bg-red-50 px-3 py-2 text-center text-sm text-red-600">
          {error}
        </p>
      )}
    </div>
  )
}
