'use client'

import { useState } from 'react'

export default function ManageBillingButton({
  label = 'Manage billing',
  className,
}: {
  label?: string
  className?: string
} = {}) {
  const [loading, setLoading] = useState(false)

  async function handleClick() {
    setLoading(true)
    try {
      const res = await fetch('/api/stripe/portal', { method: 'POST' })
      if (res.status === 404) {
        console.error('Manage billing: no billing account found.')
        return
      }
      const { url } = await res.json()
      if (url) window.location.href = url
    } finally {
      setLoading(false)
    }
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={loading}
      className={`rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-2 text-sm font-medium text-zinc-200 hover:border-zinc-600 hover:text-zinc-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed${className ? ` ${className}` : ''}`}
    >
      {loading ? 'Redirecting…' : label}
    </button>
  )
}
