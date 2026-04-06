'use client'

import { useRef, useState, useTransition } from 'react'
import { saveClientNotes } from '@/app/actions/clients'

export default function ClientNotesForm({
  clientId,
  defaultValue,
}: {
  clientId: string
  defaultValue: string
}) {
  const [status, setStatus] = useState<'idle' | 'success'>('idle')
  const [isPending, startTransition] = useTransition()
  const formRef = useRef<HTMLFormElement>(null)

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const data = new FormData(formRef.current!)
    startTransition(async () => {
      await saveClientNotes(data)
      setStatus('success')
      setTimeout(() => setStatus('idle'), 2000)
    })
  }

  const label = isPending ? 'Saving…' : status === 'success' ? 'Saved' : 'Save Notes'

  return (
    <form ref={formRef} onSubmit={handleSubmit} className="space-y-3">
      <input type="hidden" name="client_id" value={clientId} />
      <textarea
        name="notes"
        defaultValue={defaultValue}
        rows={4}
        placeholder="Long-term notes about this client…"
        className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-2 text-sm text-zinc-100 placeholder-zinc-500 focus:border-indigo-500 focus:outline-none resize-y"
      />
      <div className="flex justify-end">
        <button
          type="submit"
          disabled={isPending}
          className="rounded-lg bg-indigo-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-indigo-500 disabled:opacity-50 transition-colors"
        >
          {label}
        </button>
      </div>
    </form>
  )
}
