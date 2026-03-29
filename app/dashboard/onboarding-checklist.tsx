import Link from 'next/link'

interface Props {
  hasSessionType: boolean
  hasAvailability: boolean
  hasBooking: boolean
  firstSessionSlug?: string
}

export default function OnboardingChecklist({
  hasSessionType,
  hasAvailability,
  hasBooking,
  firstSessionSlug,
}: Props) {
  if (hasSessionType && hasAvailability && hasBooking) return null

  const step3Done = hasSessionType && hasAvailability && hasBooking

  const steps = [
    { label: 'Create a session type',    done: hasSessionType },
    { label: 'Set your availability',    done: hasAvailability },
    { label: 'Receive your first booking', done: step3Done },
  ]

  let ctaHref: string
  let ctaLabel: string
  if (!hasSessionType) {
    ctaHref  = '/dashboard/session-types'
    ctaLabel = 'Create session type →'
  } else if (!hasAvailability) {
    ctaHref  = '/dashboard/availability'
    ctaLabel = 'Set availability →'
  } else {
    ctaHref  = firstSessionSlug ? `/book/${firstSessionSlug}` : '/dashboard/session-types'
    ctaLabel = 'Preview your booking page →'
  }

  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-6 space-y-5">
      <p className="text-xs font-medium uppercase tracking-wider text-zinc-500">Setup progress</p>

      <ol className="space-y-3">
        {steps.map(({ label, done }, i) => (
          <li key={label} className="flex items-center gap-3">
            <span
              className={`flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full border text-xs font-semibold ${
                done
                  ? 'border-green-800 bg-green-950 text-green-400'
                  : 'border-zinc-700 bg-zinc-800 text-zinc-500'
              }`}
            >
              {done ? '✓' : i + 1}
            </span>
            <span
              className={`text-sm ${
                done ? 'text-zinc-600 line-through decoration-zinc-700' : 'text-zinc-200'
              }`}
            >
              {label}
            </span>
          </li>
        ))}
      </ol>

      <div>
        <Link
          href={ctaHref}
          className="inline-block rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-indigo-500 transition-colors"
        >
          {ctaLabel}
        </Link>
        {hasSessionType && hasAvailability && (
          <p className="mt-2 text-xs text-zinc-500">
            Make sure everything looks right before sharing your link.
          </p>
        )}
      </div>
    </div>
  )
}
