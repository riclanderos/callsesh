'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

/**
 * One-time banner shown after a successful Stripe payout connection.
 * Strips ?payout_connected=1 from the URL on mount so the banner never
 * reappears on subsequent reloads or back-navigation.
 */
export default function PayoutSuccessBanner() {
  const router = useRouter()

  useEffect(() => {
    const timer = setTimeout(() => {
      router.replace('/dashboard')
    }, 3000)
    return () => clearTimeout(timer)
  }, [router])

  return (
    <div className="rounded-xl border border-green-900 bg-green-950/30 px-5 py-4 space-y-0.5">
      <p className="text-sm font-semibold text-green-400">Payout account connected</p>
      <p className="text-xs text-green-700">
        You&apos;re all set — payouts will be sent to your Stripe account after each session.
      </p>
    </div>
  )
}
