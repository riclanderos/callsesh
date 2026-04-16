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
    <div className="max-w-2xl mx-auto p-6">
      <Link href="/tools" className="text-sm text-gray-500 hover:text-gray-700 inline-block mb-4">
        ← Back to Free Tools
      </Link>
      <h1 className="text-3xl font-bold mb-3">
        Coaching Booking Software Cost Calculator
      </h1>
      <p className="text-gray-600 mb-6">
        Compare the cost of coaching booking software, scheduling tools, and payment platforms you use today.
      </p>

      <p className="text-gray-700 mb-6">
        Most coaches cobble together multiple tools — coaching booking software like Calendly, scheduling software for coaches, video platforms, and coaching payment processing through Stripe or similar services. This calculator helps you see exactly what you spend across your full stack.
      </p>

      <div className="space-y-3 mb-6">
        {tools.map((tool, index) => (
          <div key={index} className="flex gap-3 items-center">
            <input
              type="text"
              value={tool.name}
              onChange={(e) => updateName(index, e.target.value)}
              placeholder="Tool name"
              className="flex-1 border rounded px-3 py-2 text-sm"
            />
            <div className="flex items-center border rounded px-3 py-2 gap-1">
              <span className="text-gray-500 text-sm">$</span>
              <input
                type="number"
                value={tool.cost}
                min={0}
                onChange={(e) => updateCost(index, e.target.value)}
                className="w-20 text-sm outline-none"
              />
              <span className="text-gray-400 text-xs">/mo</span>
            </div>
            <button
              onClick={() => removeTool(index)}
              className="text-red-500 hover:text-red-700 text-sm px-2 py-1"
              aria-label="Remove tool"
            >
              Remove
            </button>
          </div>
        ))}
      </div>

      <button
        onClick={addTool}
        className="border border-gray-300 rounded px-4 py-2 text-sm hover:bg-gray-50 mb-8"
      >
        + Add Tool
      </button>

      <div className="bg-gray-50 border rounded-lg p-5 mb-8">
        <div className="flex justify-between text-base font-medium mb-2">
          <span>Monthly Total</span>
          <span>${monthlyTotal.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-base font-medium mb-4">
          <span>Yearly Total</span>
          <span>${yearlyTotal.toFixed(2)}</span>
        </div>
        <p className="text-gray-500 text-xs">
          Many coaches use separate booking software, scheduling tools, and payment processors, which can increase total monthly costs.
        </p>
      </div>

      <div className="text-sm text-gray-600 mb-6">
        Looking for a complete solution?{" "}
        <Link href="/" className="text-indigo-600 hover:underline">
          Explore coaching booking software
        </Link>
      </div>

      <div className="bg-indigo-50 border border-indigo-100 rounded-lg p-6 text-center">
        <h2 className="text-xl font-semibold mb-2">
          Replace your coaching booking software stack with one platform
        </h2>
        <p className="text-gray-600 text-sm mb-4">
          CallSesh combines booking, video sessions, and payments in one place — no extra subscriptions.
        </p>
        <Link
          href="/"
          className="inline-block bg-indigo-600 text-white rounded px-4 py-2 text-sm font-medium hover:bg-indigo-700"
        >
          Try CallSesh
        </Link>
      </div>
    </div>
  )
}
