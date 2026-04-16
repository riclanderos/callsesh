import type { Metadata } from "next"
import Link from "next/link"

export const metadata: Metadata = {
  title: "Free Tools for Coaches | CallSesh",
  description: "Free tools for coaches to evaluate their software stack, including a coaching booking software cost calculator.",
  alternates: { canonical: "/tools" },
}

export default function ToolsPage() {
  return (
    <div className="min-h-screen bg-white text-zinc-900">
      <div className="max-w-5xl mx-auto px-6 py-12">

        <div className="mb-10">
          <Link href="/" className="text-sm font-semibold text-zinc-900 hover:text-zinc-700 transition-colors">
            CallSesh
          </Link>
        </div>

        <div className="mb-10 space-y-4">
          <span className="text-xs font-semibold text-zinc-600 uppercase tracking-widest">Free Tools</span>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight leading-tight text-zinc-900">
            Free Tools for Coaches
          </h1>
          <p className="text-zinc-700 leading-relaxed">
            Simple, free tools for coaches who want to evaluate their current software stack and make smarter decisions about the platforms they use. Trying to understand how much your current coaching tools cost? Start with{" "}
            <Link href="/tools/coach-tool-cost-calculator" className="underline underline-offset-2 hover:text-zinc-900 transition-colors">
              our calculator
            </Link>.
          </p>
        </div>

        <p className="text-zinc-700 leading-relaxed mb-8">
          Practical, free tools for coaches who want to understand costs, reduce lost revenue, and improve their booking setup.
        </p>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">

          <div className="bg-white border border-zinc-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow flex flex-col h-full">
            <div className="flex items-center gap-3 mb-2">
              <span className="text-xs font-medium text-zinc-500">Free Tool</span>
              <span className="text-xs font-medium text-indigo-600">Most Popular</span>
            </div>
            <h2 className="text-lg font-semibold tracking-tight text-zinc-900 mb-1.5">
              Coaching Booking Software Cost Calculator
            </h2>
            <p className="text-sm text-zinc-700 leading-relaxed mb-5 flex-1">
              Estimate how much you spend on scheduling, video, payments, and other coaching tools.
            </p>
            <Link
              href="/tools/coach-tool-cost-calculator"
              className="inline-flex items-center justify-center rounded-lg bg-zinc-900 px-5 py-2.5 text-sm font-semibold text-white hover:bg-zinc-800 transition-colors shadow-sm"
            >
              Open tool
            </Link>
          </div>

          <div className="bg-white border border-zinc-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow flex flex-col h-full">
            <span className="text-xs font-medium text-zinc-500 mb-2">Free Tool</span>
            <h2 className="text-lg font-semibold tracking-tight text-zinc-900 mb-1.5">
              Coaching Booking Software
            </h2>
            <p className="text-sm text-zinc-700 leading-relaxed mb-5 flex-1">
              Learn what coaching booking software should handle across scheduling, payments, and client bookings.
            </p>
            <Link
              href="/tools/coaching-booking-software"
              className="inline-flex items-center justify-center rounded-lg bg-zinc-900 px-5 py-2.5 text-sm font-semibold text-white hover:bg-zinc-800 transition-colors shadow-sm"
            >
              Read guide
            </Link>
          </div>

          <div className="bg-white border border-zinc-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow flex flex-col h-full">
            <span className="text-xs font-medium text-zinc-500 mb-2">Free Tool</span>
            <h2 className="text-lg font-semibold tracking-tight text-zinc-900 mb-1.5">
              No-Show Cost Calculator
            </h2>
            <p className="text-sm text-zinc-700 leading-relaxed mb-5 flex-1">
              See how much missed sessions are costing your coaching business.
            </p>
            <Link
              href="/tools/no-show-cost-calculator"
              className="inline-flex items-center justify-center rounded-lg bg-zinc-900 px-5 py-2.5 text-sm font-semibold text-white hover:bg-zinc-800 transition-colors shadow-sm"
            >
              Open tool
            </Link>
          </div>

          <div className="bg-white border border-zinc-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow flex flex-col h-full">
            <span className="text-xs font-medium text-zinc-500 mb-2">Free Tool</span>
            <h2 className="text-lg font-semibold tracking-tight text-zinc-900 mb-1.5">
              Session Notes Template Generator
            </h2>
            <p className="text-sm text-zinc-700 leading-relaxed mb-5 flex-1">
              Generate a simple coaching session notes template for common coaching session types.
            </p>
            <Link
              href="/tools/session-notes-template-generator"
              className="inline-flex items-center justify-center rounded-lg bg-zinc-900 px-5 py-2.5 text-sm font-semibold text-white hover:bg-zinc-800 transition-colors shadow-sm"
            >
              Open tool
            </Link>
          </div>

        </div>

      </div>
    </div>
  )
}
