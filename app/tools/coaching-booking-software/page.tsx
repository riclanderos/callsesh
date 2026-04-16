import type { Metadata } from "next"
import Link from "next/link"

export const metadata: Metadata = {
  title: "Coaching Booking Software | CallSesh",
  description:
    "Explore coaching booking software and compare scheduling, payments, video, and all-in-one platform options for coaches.",
  alternates: { canonical: "/tools/coaching-booking-software" },
}

export default function CoachingBookingSoftwarePage() {
  return (
    <div className="min-h-screen bg-white text-zinc-900">
      <div className="max-w-2xl mx-auto px-6 py-12">

        {/* Home nav */}
        <div className="mb-10">
          <Link href="/" className="text-sm font-semibold text-zinc-900 hover:text-zinc-700 transition-colors">
            CallSesh
          </Link>
        </div>

        {/* Breadcrumb */}
        <Link href="/tools" className="text-sm text-zinc-500 hover:text-zinc-700 transition-colors inline-block mb-8">
          ← Back to Free Tools
        </Link>

        {/* Header */}
        <div className="mb-12 space-y-4">
          <span className="text-xs font-semibold text-zinc-600 uppercase tracking-widest">Guide</span>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight leading-tight text-zinc-900">
            Coaching Booking Software
          </h1>
          <p className="text-zinc-700 leading-relaxed">
            Coaching booking software helps coaches manage how clients schedule sessions, pay for their time, and show up to meetings. Most coaches piece together several separate tools to cover these needs — but the right platform can handle all of it in one place.
          </p>
        </div>

        {/* Sections */}
        <div className="space-y-10 mb-12">

          <div className="bg-white border border-zinc-200 rounded-2xl p-6 shadow-sm space-y-3">
            <span className="text-xs font-semibold text-zinc-600 uppercase tracking-widest">Scheduling</span>
            <h2 className="text-lg font-semibold tracking-tight text-zinc-900">
              Scheduling and availability
            </h2>
            <p className="text-sm text-zinc-700 leading-relaxed">
              Good coaching booking software lets clients see your real-time availability and book directly without back-and-forth emails. You set your session types, duration, and windows once — the software handles the rest. Look for tools that respect time zones and let you set buffer time between sessions.
            </p>
          </div>

          <div className="bg-white border border-zinc-200 rounded-2xl p-6 shadow-sm space-y-3">
            <span className="text-xs font-semibold text-zinc-600 uppercase tracking-widest">Payments</span>
            <h2 className="text-lg font-semibold tracking-tight text-zinc-900">
              Payments and booking flows
            </h2>
            <p className="text-sm text-zinc-700 leading-relaxed">
              Collecting payment at the time of booking removes the awkwardness of chasing invoices and ensures clients are committed before the session starts. Coaching booking software with built-in payment processing — rather than a separate Stripe integration — simplifies your setup and keeps your client experience seamless.
            </p>
          </div>

          <div className="bg-white border border-zinc-200 rounded-2xl p-6 shadow-sm space-y-3">
            <span className="text-xs font-semibold text-zinc-600 uppercase tracking-widest">All-in-one</span>
            <h2 className="text-lg font-semibold tracking-tight text-zinc-900">
              Replacing multiple separate tools
            </h2>
            <p className="text-sm text-zinc-700 leading-relaxed">
              Many coaches pay separately for scheduling software, a video meeting tool, payment processing, and client notes. These costs add up quickly and create friction between tools. An all-in-one platform combines booking, payments, video sessions, and session history under one roof — reducing both cost and complexity. Use our{" "}
              <Link
                href="/tools/coach-tool-cost-calculator"
                className="underline underline-offset-2 hover:text-zinc-900 transition-colors"
              >
                coaching booking software cost calculator
              </Link>{" "}
              to see exactly what you're spending across your current stack.
            </p>
          </div>

        </div>

        {/* CTA */}
        <div className="bg-zinc-50 border border-zinc-200 rounded-2xl p-8 text-center space-y-4 shadow-sm">
          <h2 className="text-2xl font-bold tracking-tight text-zinc-900">
            One platform for booking, payments, and video
          </h2>
          <p className="text-zinc-700 text-sm leading-relaxed">
            CallSesh replaces your coaching booking software stack with a single tool built for paid 1-on-1 sessions.
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
    </div>
  )
}
