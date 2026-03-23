'use client'

import { useActionState } from 'react'
import { createSessionType } from '@/app/actions/session-types'

export default function CreateSessionTypeForm() {
  const [error, action, pending] = useActionState(createSessionType, null)

  return (
    <form action={action} className="space-y-4">
      <div className="space-y-1.5">
        <label htmlFor="title" className="text-xs font-medium uppercase tracking-wider text-zinc-300">
          Title
        </label>
        <input
          id="title"
          name="title"
          type="text"
          required
          placeholder="e.g. 1-on-1 Coaching Call"
          className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-2.5 text-sm text-zinc-100 placeholder:text-zinc-500 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/40 transition-colors"
        />
      </div>

      <div className="space-y-1.5">
        <label htmlFor="description" className="text-xs font-medium uppercase tracking-wider text-zinc-300">
          Description
        </label>
        <textarea
          id="description"
          name="description"
          rows={3}
          placeholder="What's included in this session?"
          className="w-full resize-none rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-2.5 text-sm text-zinc-100 placeholder:text-zinc-500 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/40 transition-colors"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <label htmlFor="duration_minutes" className="text-xs font-medium uppercase tracking-wider text-zinc-300">
            Duration (min) · 15–180, in 15-min steps
          </label>
          <input
            id="duration_minutes"
            name="duration_minutes"
            type="number"
            required
            min={15}
            max={180}
            step={15}
            placeholder="60"
            className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-2.5 text-sm text-zinc-100 placeholder:text-zinc-500 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/40 transition-colors"
          />
        </div>

        <div className="space-y-1.5">
          <label htmlFor="price_dollars" className="text-xs font-medium uppercase tracking-wider text-zinc-300">
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
            className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-2.5 text-sm text-zinc-100 placeholder:text-zinc-500 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/40 transition-colors"
          />
        </div>
      </div>

      <div className="flex items-center gap-2">
        <input
          id="is_active"
          name="is_active"
          type="checkbox"
          defaultChecked
          className="rounded border-zinc-700 bg-zinc-800"
        />
        <label htmlFor="is_active" className="text-sm text-zinc-400">
          Active (visible to guests)
        </label>
      </div>

      {error && (
        <p className="rounded-lg border border-red-900 bg-red-950 px-3 py-2 text-sm text-red-400">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="rounded-lg bg-white px-4 py-2 text-sm font-semibold text-zinc-900 hover:bg-zinc-100 disabled:opacity-50 transition-colors"
      >
        {pending ? 'Creating…' : 'Create session type'}
      </button>
    </form>
  )
}
