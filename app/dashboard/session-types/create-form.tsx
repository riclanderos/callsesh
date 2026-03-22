'use client'

import { useActionState } from 'react'
import { createSessionType } from '@/app/actions/session-types'

export default function CreateSessionTypeForm() {
  const [error, action, pending] = useActionState(createSessionType, null)

  return (
    <form action={action} className="space-y-4">
      <div className="space-y-1">
        <label htmlFor="title" className="text-sm font-medium">
          Title
        </label>
        <input
          id="title"
          name="title"
          type="text"
          required
          placeholder="e.g. 1-on-1 Coaching Call"
          className="w-full rounded border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-black"
        />
      </div>

      <div className="space-y-1">
        <label htmlFor="description" className="text-sm font-medium">
          Description
        </label>
        <textarea
          id="description"
          name="description"
          rows={3}
          placeholder="What's included in this session?"
          className="w-full resize-none rounded border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-black"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1">
          <label htmlFor="duration_minutes" className="text-sm font-medium">
            Duration (minutes)
          </label>
          <input
            id="duration_minutes"
            name="duration_minutes"
            type="number"
            required
            min={1}
            placeholder="60"
            className="w-full rounded border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-black"
          />
        </div>

        <div className="space-y-1">
          <label htmlFor="price_dollars" className="text-sm font-medium">
            Price (USD)
          </label>
          <input
            id="price_dollars"
            name="price_dollars"
            type="number"
            required
            min={0}
            step={0.01}
            placeholder="100.00"
            className="w-full rounded border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-black"
          />
        </div>
      </div>

      <div className="flex items-center gap-2">
        <input
          id="is_active"
          name="is_active"
          type="checkbox"
          defaultChecked
          className="rounded"
        />
        <label htmlFor="is_active" className="text-sm">
          Active
        </label>
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <button
        type="submit"
        disabled={pending}
        className="rounded bg-black px-4 py-2 text-sm font-medium text-white disabled:opacity-50"
      >
        {pending ? 'Creating…' : 'Create session type'}
      </button>
    </form>
  )
}
