'use client'

import { useFormStatus } from 'react-dom'

export default function CancelButton() {
  const { pending } = useFormStatus()

  return (
    <button
      type="submit"
      disabled={pending}
      className="rounded border px-3 py-1 text-sm text-red-600 hover:bg-red-50 disabled:opacity-50"
    >
      {pending ? 'Cancelling…' : 'Cancel'}
    </button>
  )
}
