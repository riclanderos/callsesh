interface Props {
  sessionsRemaining: number
  expiresAt: string // ISO timestamptz string from the DB
}

export default function LaunchOfferCard({ sessionsRemaining, expiresAt }: Props) {
  const expires = new Date(expiresAt)
  const msLeft = expires.getTime() - Date.now()
  const daysLeft = Math.max(0, Math.ceil(msLeft / (1000 * 60 * 60 * 24)))

  return (
    <div className="rounded-xl border border-indigo-900 bg-indigo-950/20 px-5 py-4 space-y-2">
      <p className="text-sm font-semibold text-indigo-300">Your free sessions are active</p>
      <ul className="space-y-0.5">
        <li className="text-sm text-indigo-400">
          {sessionsRemaining} session{sessionsRemaining !== 1 ? 's' : ''} remaining
        </li>
        <li className="text-sm text-indigo-400">
          {daysLeft > 0
            ? `${daysLeft} day${daysLeft !== 1 ? 's' : ''} left`
            : 'Expires today'}
        </li>
        <li className="text-sm text-indigo-400">Sessions up to 60 minutes are covered</li>
      </ul>
    </div>
  )
}
