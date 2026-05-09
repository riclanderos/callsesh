import type { Metadata } from 'next'
import Link from 'next/link'
import MarketingNav from '@/components/marketing/MarketingNav'
import MarketingFooter from '@/components/marketing/MarketingFooter'
import { getPagesByPrefix } from '@/lib/pseo'

export const metadata: Metadata = {
  title: 'Coaching Software Alternatives — CallSesh vs. Calendly, Zoom & Stripe',
  description:
    'See how CallSesh compares to Calendly, Zoom, and Stripe for coaches. One platform that replaces all three with built-in scheduling, payment, and video.',
  alternates: { canonical: '/alternatives' },
}

const descriptions: Record<string, string> = {
  'calendly-for-coaches':
    'Considering Calendly for a paid coaching practice? An honest look at where it works and where it falls short for paid sessions.',
  'calendly-alternative-for-coaches':
    'Ready to leave Calendly? See why coaches switch to CallSesh for scheduling with payment and video built in.',
  'zoom-alternative-for-coaching':
    'Zoom has no booking or payment layer. CallSesh generates a private video room for every booked, paid session automatically.',
  'stripe-alternative-for-coaches':
    'Stop configuring Stripe manually for every coaching tool. CallSesh wraps payment collection into the booking flow.',
}

export default function AlternativesHubPage() {
  const alternatives = getPagesByPrefix('/alternatives/')

  return (
    <div className="min-h-screen bg-white text-zinc-900">
      <MarketingNav />

      <section className="mx-auto max-w-3xl px-6 pt-16 pb-12 text-center space-y-4">
        <p className="text-xs font-semibold uppercase tracking-widest text-zinc-500">Compare</p>
        <h1 className="text-4xl sm:text-5xl font-bold tracking-tight leading-tight text-zinc-900">
          CallSesh vs. Your Current Tools
        </h1>
        <p className="text-lg text-zinc-700 leading-relaxed">
          Most coaches run their practice on Calendly, Zoom, and Stripe stitched together. CallSesh
          replaces all three with a single platform built for paid 1-on-1 sessions.
        </p>
      </section>

      <section className="mx-auto max-w-5xl px-6 pb-24">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {alternatives.map((p) => {
            const slug = p.path.replace('/alternatives/', '')
            return (
              <Link
                key={p.path}
                href={p.path}
                className="group rounded-xl border border-zinc-200 bg-white p-6 shadow-sm hover:border-zinc-400 hover:shadow-md transition-all space-y-3"
              >
                <p className="text-sm font-semibold text-zinc-900 group-hover:text-zinc-700 transition-colors">
                  {p.h1}
                </p>
                <p className="text-sm text-zinc-600 leading-relaxed">
                  {descriptions[slug] ?? p.intro.slice(0, 140) + '...'}
                </p>
                <p className="text-xs font-medium text-zinc-400 group-hover:text-zinc-600 transition-colors">
                  See comparison →
                </p>
              </Link>
            )
          })}
        </div>

        <div className="mt-16 rounded-xl border border-zinc-200 bg-zinc-50 px-8 py-10 text-center space-y-4">
          <h2 className="text-xl font-semibold text-zinc-900">
            Replace your entire coaching tool stack
          </h2>
          <p className="text-sm text-zinc-700 leading-relaxed">
            Scheduling, payment, and video — built for coaches who charge for their time. No
            integrations to configure.
          </p>
          <Link
            href="/signup"
            className="inline-block rounded-lg bg-zinc-900 px-8 py-3.5 text-sm font-semibold text-white hover:bg-zinc-800 transition-colors shadow-sm"
          >
            Create your booking page
          </Link>
          <p className="text-xs text-zinc-500">No credit card required · First 10 sessions free</p>
        </div>
      </section>

      <MarketingFooter />
    </div>
  )
}
