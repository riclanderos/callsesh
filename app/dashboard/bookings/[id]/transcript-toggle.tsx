'use client'

import { useFormStatus } from 'react-dom'
import { toggleTranscript } from '@/app/actions/bookings'

function ToggleButton({ label }: { label: string }) {
  const { pending } = useFormStatus()
  return (
    <button
      type="submit"
      disabled={pending}
      className="rounded-lg border border-zinc-700 px-3 py-1.5 text-xs font-medium text-zinc-300 hover:bg-zinc-800 hover:border-zinc-600 disabled:opacity-50 transition-colors"
    >
      {pending ? 'Saving…' : label}
    </button>
  )
}

const consentLabels: Record<string, string> = {
  not_requested: 'Not requested',
  pending:       'Pending client consent',
  consented:     'Client consented',
  declined:      'Client declined',
}

const consentColors: Record<string, string> = {
  not_requested: 'text-zinc-500',
  pending:       'text-amber-400',
  consented:     'text-green-400',
  declined:      'text-zinc-400',
}

export default function TranscriptToggle({
  bookingId,
  transcriptEnabled,
  consentStatus,
}: {
  bookingId: string
  transcriptEnabled: boolean
  consentStatus: string
}) {
  return (
    <section className="rounded-xl border border-zinc-800 bg-zinc-900 p-5 space-y-3">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold text-zinc-100">Transcript</h2>
        <span className={`text-xs ${consentColors[consentStatus] ?? 'text-zinc-500'}`}>
          {consentLabels[consentStatus] ?? consentStatus}
        </span>
      </div>

      <p className="text-xs text-zinc-500">
        {transcriptEnabled
          ? 'Transcript is enabled. The client will be asked to consent before joining.'
          : 'Enable transcript to request client consent before the session.'}
      </p>

      <form action={toggleTranscript}>
        <input type="hidden" name="booking_id" value={bookingId} />
        <input
          type="hidden"
          name="transcript_enabled"
          value={transcriptEnabled ? 'false' : 'true'}
        />
        <ToggleButton
          label={transcriptEnabled ? 'Disable Transcript' : 'Enable Transcript'}
        />
      </form>
    </section>
  )
}
