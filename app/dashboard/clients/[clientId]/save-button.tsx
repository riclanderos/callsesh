'use client'

import { useFormStatus } from 'react-dom'

export default function SaveButton({ label = 'Save' }: { label?: string }) {
  const { pending } = useFormStatus()

  return (
    <button
      type="submit"
      disabled={pending}
      className="rounded-lg bg-indigo-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-indigo-500 disabled:opacity-50 transition-colors"
    >
      {pending ? 'Saving…' : label}
    </button>
  )
}
