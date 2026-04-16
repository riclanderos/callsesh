"use client"

import { useState } from "react"
import Link from "next/link"

interface Tool {
  name: string
  cost: number
}

const defaultTools: Tool[] = [
  { name: "Calendly", cost: 15 },
  { name: "Zoom", cost: 15 },
  { name: "Stripe Fees", cost: 30 },
  { name: "Notion", cost: 10 },
]

export default function Calculator() {
  const [tools, setTools] = useState<Tool[]>(defaultTools)

  const monthlyTotal = tools.reduce((sum, t) => sum + (Number(t.cost) || 0), 0)
  const yearlyTotal = monthlyTotal * 12

  function updateName(index: number, name: string) {
    setTools(tools.map((t, i) => (i === index ? { ...t, name } : t)))
  }

  function updateCost(index: number, value: string) {
    const cost = parseFloat(value)
    setTools(tools.map((t, i) => (i === index ? { ...t, cost: isNaN(cost) ? 0 : cost } : t)))
  }

  function removeTool(index: number) {
    setTools(tools.filter((_, i) => i !== index))
  }

  function addTool() {
    setTools([...tools, { name: "", cost: 0 }])
  }

  return (
    <div className="min-h-screen bg-white text-zinc-900">
      <div className="max-w-2xl mx-auto px-6 py-12">

        {/* Breadcrumb */}
        <Link href="/tools" className="text-sm text-zinc-500 hover:text-zinc-700 transition-colors inline-block mb-8">
          ← Back to Free Tools
        </Link>

        {/* Header */}
        <div className="mb-10 space-y-4">
          <span className="text-xs font-semibold text-zinc-600 uppercase tracking-widest">Free Tool</span>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight leading-tight text-zinc-900">
            Coaching Booking Software Cost Calculator
          </h1>
          <p className="text-zinc-700 leading-relaxed">
            Compare the cost of coaching booking software, scheduling tools, and payment platforms you use today.
          </p>
          <p className="text-zinc-700 leading-relaxed">
            Most coaches cobble together multiple tools — coaching booking software like Calendly, scheduling software for coaches, video platforms, and coaching payment processing through Stripe or similar services. This calculator helps you see exactly what you spend across your full stack. Many coaches compare tools like Calendly, Zoom, and Stripe separately, but rarely see their combined monthly cost in one place.
          </p>
        </div>

        {/* Tool rows */}
        <div className="bg-white border border-zinc-200 rounded-2xl p-6 shadow-sm mb-6 space-y-3">
          <p className="text-xs font-semibold text-zinc-600 uppercase tracking-widest mb-4">Your Tools</p>
          {tools.map((tool, index) => (
            <div key={index} className="flex gap-3 items-center">
              <input
                type="text"
                value={tool.name}
                onChange={(e) => updateName(index, e.target.value)}
                placeholder="Tool name"
                className="flex-1 border border-zinc-200 rounded-lg px-3 py-2 text-sm text-zinc-900 placeholder-zinc-400 focus:outline-none focus:ring-1 focus:ring-zinc-300"
              />
              <div className="flex items-center border border-zinc-200 rounded-lg px-3 py-2 gap-1 focus-within:ring-1 focus-within:ring-zinc-300">
                <span className="text-zinc-400 text-sm">$</span>
                <input
                  type="number"
                  value={tool.cost}
                  min={0}
                  onChange={(e) => updateCost(index, e.target.value)}
                  className="w-20 text-sm text-zinc-900 outline-none"
                />
                <span className="text-zinc-400 text-xs">/mo</span>
              </div>
              <button
                onClick={() => removeTool(index)}
                className="text-zinc-400 hover:text-red-500 transition-colors text-sm px-2 py-1"
                aria-label="Remove tool"
              >
                Remove
              </button>
            </div>
          ))}
          <div className="pt-2">
            <button
              onClick={addTool}
              className="rounded-lg border border-zinc-200 px-4 py-2 text-sm font-semibold text-zinc-700 hover:bg-zinc-50 transition-colors"
            >
              + Add Tool
            </button>
          </div>
        </div>

        {/* Totals */}
        <div className="bg-zinc-50 border border-zinc-100 rounded-2xl p-6 mb-10">
          <div className="flex justify-between items-baseline mb-3">
            <span className="text-sm font-medium text-zinc-700">Monthly Total</span>
            <span className="text-2xl font-bold text-zinc-900">${monthlyTotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between items-baseline mb-5 pb-5 border-b border-zinc-200">
            <span className="text-sm font-medium text-zinc-700">Yearly Total</span>
            <span className="text-2xl font-bold text-zinc-900">${yearlyTotal.toFixed(2)}</span>
          </div>
          <p className="text-xs text-zinc-500 leading-relaxed">
            Many coaches use separate booking software, scheduling tools, and payment processors, which can increase total monthly costs.
          </p>
        </div>

        {/* Internal link */}
        <p className="text-sm text-zinc-600 mb-10">
          Looking for a complete solution?{" "}
          <Link href="/" className="text-zinc-700 underline underline-offset-2 hover:text-zinc-900 transition-colors">
            Explore coaching booking software
          </Link>
        </p>

        {/* FAQ */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold tracking-tight text-zinc-900 mb-8">Frequently Asked Questions</h2>
          <div className="space-y-7">
            <div>
              <h3 className="text-sm font-semibold text-zinc-900 mb-1.5">How much does coaching software cost?</h3>
              <p className="text-sm text-zinc-700 leading-relaxed">
                The monthly cost varies depending on which tools you use. Coaches often pay for coaching booking software, a video meeting tool, and payment processing separately. Combined, these subscriptions typically range from $30 to $100 or more per month — which adds up to $360–$1,200 or more on a yearly basis.
              </p>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-zinc-900 mb-1.5">What tools do online coaches usually pay for?</h3>
              <p className="text-sm text-zinc-700 leading-relaxed">
                Most online coaches pay for at least three categories of tools: coaching booking software or scheduling tools (like Calendly), a video meeting platform (like Zoom), and payment processing (like Stripe). Many also pay for note-taking or client management tools on top of that.
              </p>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-zinc-900 mb-1.5">Why do coaching software costs add up?</h3>
              <p className="text-sm text-zinc-700 leading-relaxed">
                Each tool solves one part of the problem. Scheduling tools handle availability, video meeting tools handle the session itself, and payment processing handles getting paid. Because no single tool covers everything, coaches end up paying multiple monthly subscription fees — and that total monthly cost can quietly grow over time.
              </p>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-zinc-900 mb-1.5">Can an all-in-one coaching platform reduce software costs?</h3>
              <p className="text-sm text-zinc-700 leading-relaxed">
                Yes. Replacing separate coaching booking software, scheduling tools, and payment processing with a single platform can significantly lower your monthly and yearly cost. An all-in-one platform also removes the friction of managing multiple accounts and integrations.
              </p>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="bg-zinc-50 border border-zinc-200 rounded-2xl p-8 text-center space-y-4 shadow-sm">
          <h2 className="text-2xl font-bold tracking-tight text-zinc-900">
            Replace your coaching booking software stack with one platform
          </h2>
          <p className="text-zinc-700 text-sm leading-relaxed">
            CallSesh combines booking, video sessions, and payments in one place — no extra subscriptions.
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
