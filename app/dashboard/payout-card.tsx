import { startConnectOnboarding, managePayouts } from '@/app/actions/connect'

export type PayoutState = 'no_account' | 'setup_incomplete' | 'verification_pending' | 'ready'

/**
 * Renders the payout readiness card for the top of the dashboard.
 * The 'ready' state is NOT rendered here — the dashboard shows a quieter
 * "Manage payouts" affordance in the Manage section instead.
 */
export default function PayoutCard({ state }: { state: PayoutState }) {
  if (state === 'ready') return null

  if (state === 'verification_pending') {
    return (
      <div className="rounded-xl border border-zinc-700 bg-zinc-900 p-6 space-y-4">
        <div className="space-y-1">
          <p className="text-xs font-medium uppercase tracking-wider text-zinc-400">Get paid</p>
          <p className="text-base font-semibold text-zinc-100">Verification in progress</p>
          <p className="text-sm text-zinc-400">
            Your payout details were submitted. Stripe is still reviewing your account before
            payouts are enabled.
          </p>
        </div>
        <form action={managePayouts}>
          <button
            type="submit"
            className="rounded-lg border border-zinc-700 bg-zinc-800 px-5 py-2.5 text-sm font-medium text-zinc-200 hover:bg-zinc-700 hover:text-white transition-colors"
          >
            Manage Payments →
          </button>
        </form>
      </div>
    )
  }

  // no_account | setup_incomplete — warning style
  const heading = state === 'no_account' ? 'Connect Payments' : 'Finish payment setup'
  const body =
    state === 'no_account'
      ? 'Connect your Stripe account so you can get paid for booked sessions.'
      : 'Your Stripe account exists, but onboarding is not complete yet.'
  const cta = state === 'no_account' ? 'Connect Payments →' : 'Continue setup →'

  return (
    <div className="rounded-xl border border-amber-900 bg-amber-950/20 p-6 space-y-4">
      <div className="space-y-1">
        <p className="text-xs font-medium uppercase tracking-wider text-amber-600">Get paid</p>
        <p className="text-base font-semibold text-zinc-100">{heading}</p>
        <p className="text-sm text-zinc-400">{body}</p>
      </div>
      <form action={startConnectOnboarding}>
        <button
          type="submit"
          className="rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-indigo-500 transition-colors"
        >
          {cta}
        </button>
      </form>
    </div>
  )
}
