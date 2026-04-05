'use client'

import { useState } from 'react'

export default function ClientSummaryCopy({
  name,
  notes,
  lastRecapSummary,
  lastActionSteps,
}: {
  name: string
  notes: string | null
  lastRecapSummary: string | null
  lastActionSteps: string[] | null
}) {
  const [copied, setCopied] = useState(false)

  const hasContent =
    notes || lastRecapSummary || (lastActionSteps ?? []).length > 0

  if (!hasContent) return null

  async function copy() {
    const parts: string[] = [`Client: ${name}`]
    if (notes) parts.push(`Notes:\n${notes}`)
    if (lastRecapSummary) parts.push(`Last Session Summary:\n${lastRecapSummary}`)
    if ((lastActionSteps ?? []).length > 0) {
      parts.push(
        'Action Steps:\n' + (lastActionSteps ?? []).map((s) => `- ${s}`).join('\n')
      )
    }
    await navigator.clipboard.writeText(parts.join('\n\n'))
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <button
      onClick={copy}
      className="rounded-lg border border-zinc-700 px-3 py-1.5 text-xs text-zinc-400 hover:bg-zinc-800 hover:border-zinc-600 transition-colors"
    >
      {copied ? 'Copied' : 'Copy Client Summary'}
    </button>
  )
}
