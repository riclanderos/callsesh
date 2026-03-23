'use client'

import { useState } from 'react'
import { useActionState } from 'react'
import { deleteSessionType } from '@/app/actions/session-types'

export default function DeleteSessionTypeButton({ id }: { id: string }) {
  const [confirming, setConfirming] = useState(false)
  const [message, action, pending] = useActionState(deleteSessionType, null)

  // Server returned a message: either a blocking error or the deactivation notice.
  if (message) {
    return (
      <p className="text-xs text-amber-400 max-w-xs text-right">{message}</p>
    )
  }

  if (confirming) {
    return (
      <div className="flex items-center gap-2 flex-shrink-0">
        <span className="text-xs text-zinc-400">Sure?</span>
        <form action={action}>
          <input type="hidden" name="id" value={id} />
          <button
            type="submit"
            disabled={pending}
            className="rounded-lg border border-red-900 px-2.5 py-1 text-xs text-red-400 hover:bg-zinc-800 disabled:opacity-50 transition-colors"
          >
            {pending ? 'Deleting…' : 'Yes, delete'}
          </button>
        </form>
        <button
          type="button"
          onClick={() => setConfirming(false)}
          className="rounded-lg border border-zinc-700 px-2.5 py-1 text-xs text-zinc-400 hover:bg-zinc-800 transition-colors"
        >
          Cancel
        </button>
      </div>
    )
  }

  return (
    <button
      type="button"
      onClick={() => setConfirming(true)}
      className="flex-shrink-0 rounded-lg border border-zinc-700 px-2.5 py-1 text-xs text-zinc-500 hover:border-red-900 hover:text-red-400 transition-colors"
    >
      Delete
    </button>
  )
}
