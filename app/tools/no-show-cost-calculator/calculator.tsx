"use client"

import { useState } from "react"
import Link from "next/link"
import MarketingNav from "@/components/marketing/MarketingNav"
import MarketingFooter from "@/components/marketing/MarketingFooter"

export default function Calculator() {
  const [sessionPrice, setSessionPrice] = useState<number>(100)
  const [missedSessions, setMissedSessions] = useState<number>(2)

  const monthlyLoss = (Number(sessionPrice) || 0) * (Number(missedSessions) || 0)
  const yearlyLoss = monthlyLoss * 12

  return (
    <div className="min-h-screen bg-white text-zinc-900">
      <MarketingNav />
      <div className="max-w-2xl mx-auto px-6 py-12">

        {/* Breadcrumb */}
        <Link href="/tools" className="text-sm text-zinc-500 hover:text-zinc-700 transition-colors inline-block mb-8">
          ← Back to Free Tools
        </Link>

        {/* Header */}
        <div className="mb-10 space-y-4">
          <span className="text-xs font-semibold text-zinc-600 uppercase tracking-widest">Free Tool</span>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight leading-tight text-zinc-900">
            No-Show Cost Calculator
          </h1>
          <p className="text-zinc-700 leading-relaxed">
            Every missed session is revenue you never recover. Enter your session rate and how many clients no-show each month to see exactly what it's costing your coaching business.
          </p>
        </div>

        {/* Inputs */}
        <div className="bg-white border border-zinc-200 rounded-2xl p-6 shadow-sm mb-6 space-y-5">
          <p className="text-xs font-semibold text-zinc-600 uppercase tracking-widest">Your Numbers</p>

          <div className="space-y-1.5">
            <label className="text-sm font-medium text-zinc-700" htmlFor="session-price">
              Session price
            </label>
            <div className="flex items-center border border-zinc-200 rounded-lg px-3 py-2 gap-1 focus-within:ring-1 focus-within:ring-zinc-300 w-40">
              <span className="text-zinc-400 text-sm">$</span>
              <input
                id="session-price"
                type="number"
                min={0}
                value={sessionPrice}
                onChange={(e) => setSessionPrice(parseFloat(e.target.value))}
                className="flex-1 text-sm text-zinc-900 outline-none"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium text-zinc-700" htmlFor="missed-sessions">
              Missed sessions per month
            </label>
            <div className="flex items-center border border-zinc-200 rounded-lg px-3 py-2 focus-within:ring-1 focus-within:ring-zinc-300 w-40">
              <input
                id="missed-sessions"
                type="number"
                min={0}
                value={missedSessions}
                onChange={(e) => setMissedSessions(parseFloat(e.target.value))}
                className="flex-1 text-sm text-zinc-900 outline-none"
              />
            </div>
          </div>
        </div>

        {/* Results */}
        <div className="bg-zinc-50 border border-zinc-100 rounded-2xl p-6 mb-10">
          <div className="flex justify-between items-baseline mb-3">
            <span className="text-sm font-medium text-zinc-700">Monthly Revenue Lost</span>
            <span className="text-2xl font-bold text-zinc-900">${monthlyLoss.toFixed(2)}</span>
          </div>
          <div className="flex justify-between items-baseline mb-5 pb-5 border-b border-zinc-200">
            <span className="text-sm font-medium text-zinc-700">Yearly Revenue Lost</span>
            <span className="text-2xl font-bold text-zinc-900">${yearlyLoss.toFixed(2)}</span>
          </div>
          <p className="text-xs text-zinc-500 leading-relaxed">
            Missed sessions can quietly cost coaching businesses thousands per year.
          </p>
        </div>

        {/* FAQ */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold tracking-tight text-zinc-900 mb-8">Frequently Asked Questions</h2>
          <div className="space-y-7">
            <div>
              <h3 className="text-sm font-semibold text-zinc-900 mb-1.5">How much do no-shows cost coaches?</h3>
              <p className="text-sm text-zinc-700 leading-relaxed">
                It depends on your session rate and how often clients miss appointments. A coach charging $100 per session with just two no-shows per month loses $2,400 per year — before accounting for the time spent following up or rescheduling.
              </p>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-zinc-900 mb-1.5">Why do coaching clients no-show?</h3>
              <p className="text-sm text-zinc-700 leading-relaxed">
                Clients are more likely to skip sessions when there's no financial commitment made in advance. Allowing clients to book without paying upfront removes the accountability that keeps them showing up. Requiring prepayment at booking is one of the most effective ways to reduce no-shows.
              </p>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-zinc-900 mb-1.5">Does charging upfront reduce no-shows?</h3>
              <p className="text-sm text-zinc-700 leading-relaxed">
                Yes. When clients pay at the time of booking, they have a direct financial reason to attend. Coaches who collect payment before sessions consistently report lower no-show rates than those who invoice after. It also eliminates the need to chase unpaid invoices when sessions do get missed.
              </p>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-zinc-900 mb-1.5">What's the best way to protect coaching revenue from no-shows?</h3>
              <p className="text-sm text-zinc-700 leading-relaxed">
                Require payment at booking, set a clear cancellation policy, and send automated reminders before sessions. Using coaching booking software that handles payment collection and reminders in one place removes the manual work and makes it easier to enforce your policy consistently.
              </p>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="bg-zinc-50 border border-zinc-200 rounded-2xl p-8 text-center space-y-4 shadow-sm">
          <h2 className="text-2xl font-bold tracking-tight text-zinc-900">
            Get paid before sessions happen
          </h2>
          <p className="text-zinc-700 text-sm leading-relaxed">
            CallSesh collects payment at booking — so missed sessions don't mean lost revenue.
          </p>
          <div className="pt-1">
            <Link
              href="/"
              className="inline-flex items-center justify-center rounded-lg bg-zinc-900 px-7 py-3 text-sm font-semibold text-white hover:bg-zinc-800 transition-colors shadow-sm"
            >
              Try CallSesh
            </Link>
          </div>
        </div>

      </div>
      <MarketingFooter />
    </div>
  )
}
