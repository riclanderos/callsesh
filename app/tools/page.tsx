import type { Metadata } from "next"
import Link from "next/link"

export const metadata: Metadata = {
  title: "Free Tools for Coaches | CallSesh",
  description: "Free tools to help coaches evaluate their software stack, estimate costs, and find better solutions.",
}

export default function ToolsPage() {
  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-3">Free Tools for Coaches</h1>
      <p className="text-gray-600 mb-8">
        Simple, free tools for coaches who want to evaluate their current software stack and make smarter decisions about the platforms they use.
      </p>

      <div className="border rounded-lg p-5 hover:shadow-sm transition-shadow">
        <h2 className="text-lg font-semibold mb-1">
          Coaching Booking Software Cost Calculator
        </h2>
        <p className="text-gray-600 text-sm mb-4">
          Estimate how much you spend on scheduling, video, payments, and other coaching tools.
        </p>
        <Link
          href="/tools/coach-tool-cost-calculator"
          className="inline-block bg-indigo-600 text-white rounded px-4 py-2 text-sm font-medium hover:bg-indigo-700"
        >
          Open tool
        </Link>
      </div>
    </div>
  )
}
