'use client'

import { useState } from 'react'

function buildRecapText(
  summary: string,
  keyPoints: string[],
  actionSteps: string[],
): string {
  const parts: string[] = []
  if (summary) parts.push(summary)
  if (keyPoints.length) {
    parts.push('Key Points:\n' + keyPoints.map((p) => `• ${p}`).join('\n'))
  }
  if (actionSteps.length) {
    parts.push('Action Steps:\n' + actionSteps.map((s) => `• ${s}`).join('\n'))
  }
  return parts.join('\n\n')
}

function buildEmailText(
  clientName: string,
  summary: string,
  keyPoints: string[],
  actionSteps: string[],
): string {
  const safeName = clientName?.trim() || 'there'
  const parts: string[] = [`Hi ${safeName},`]
  if (summary) parts.push(`Summary:\n${summary}`)
  if (keyPoints.length) {
    parts.push('Key Points:\n' + keyPoints.map((p) => `- ${p}`).join('\n'))
  }
  if (actionSteps.length) {
    parts.push('Action Steps:\n' + actionSteps.map((s) => `- ${s}`).join('\n'))
  }
  parts.push('Let me know if you have any questions.')
  return parts.join('\n\n')
}

export default function RecapCopy({
  clientName,
  clientEmail,
  summary,
  keyPoints,
  actionSteps,
}: {
  clientName: string
  clientEmail: string
  summary: string
  keyPoints: string[]
  actionSteps: string[]
}) {
  const [copied, setCopied] = useState<'recap' | 'email' | null>(null)

  const hasContent = summary || keyPoints.length > 0 || actionSteps.length > 0
  if (!hasContent) return null

  async function copy(type: 'recap' | 'email') {
    const text =
      type === 'recap'
        ? buildRecapText(summary, keyPoints, actionSteps)
        : buildEmailText(clientName, summary, keyPoints, actionSteps)
    await navigator.clipboard.writeText(text)
    setCopied(type)
    setTimeout(() => setCopied(null), 2000)
  }

  function openMailto() {
    if (!clientEmail) return
    const body = buildEmailText(clientName, summary, keyPoints, actionSteps)
    window.location.href =
      `mailto:${clientEmail}?subject=${encodeURIComponent('Session Recap')}&body=${encodeURIComponent(body)}`
  }

  return (
    <div className="flex gap-2 flex-wrap">
      <button
        onClick={() => copy('recap')}
        className="rounded-lg border border-zinc-700 px-3 py-1.5 text-xs text-zinc-400 hover:bg-zinc-800 hover:border-zinc-600 transition-colors"
      >
        {copied === 'recap' ? 'Copied' : 'Copy Recap'}
      </button>
      <button
        onClick={() => copy('email')}
        className="rounded-lg border border-zinc-700 px-3 py-1.5 text-xs text-zinc-400 hover:bg-zinc-800 hover:border-zinc-600 transition-colors"
      >
        {copied === 'email' ? 'Copied' : 'Copy Email Version'}
      </button>
      <button
        onClick={openMailto}
        disabled={!clientEmail}
        title={!clientEmail ? 'Client email not available' : undefined}
        className="rounded-lg border border-zinc-700 px-3 py-1.5 text-xs text-zinc-400 hover:bg-zinc-800 hover:border-zinc-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        Email Recap
      </button>
    </div>
  )
}
