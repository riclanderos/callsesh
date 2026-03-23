'use client'

import { useFormStatus } from 'react-dom'

export default function CancelButton() {
  const { pending } = useFormStatus()

  return (
    <button
      type="submit"
      disabled={pending}
      className="rounded-lg border border-zinc-700 px-3 py-1.5 text-xs text-red-400 hover:bg-zinc-800 hover:border-red-900 disabled:opacity-50 transition-colors"
    >
      {pending ? 'Cancelling…' : 'Cancel'}
    </button>
  )
}
