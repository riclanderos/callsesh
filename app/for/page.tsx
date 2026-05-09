import type { Metadata } from 'next'
import Link from 'next/link'
import MarketingNav from '@/components/marketing/MarketingNav'
import MarketingFooter from '@/components/marketing/MarketingFooter'
import { getPagesByPrefix } from '@/lib/pseo'

export const metadata: Metadata = {
  title: 'Coaching Software for Every Type of Coach — CallSesh',
  description:
    'CallSesh is coaching software built for paid 1-on-1 sessions. See how it works for business coaches, life coaches, fitness coaches, and more.',
  alternates: { canonical: '/for' },
}

export default function ForHubPage() {
  const verticals = getPagesByPrefix('/for/')

  return (
    <div className="min-h-screen bg-white text-zinc-900">
      <MarketingNav />

      <section className="mx-auto max-w-3xl px-6 pt-16 pb-12 text-center space-y-4">
        <p className="text-xs font-semibold uppercase tracking-widest text-zinc-500">Use Cases</p>
        <h1 className="text-4xl sm:text-5xl font-bold tracking-tight leading-tight text-zinc-900">
          Coaching Software Built for Your Practice
        </h1>
        <p className="text-lg text-zinc-700 leading-relaxed">
          Whether you coach executives, guide life transformations, or run online fitness sessions,
          your practice needs the same core tools: clients who book, pay upfront, and show up.
        </p>
      </section>

      <section className="mx-auto max-w-5xl px-6 pb-24">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {verticals.map((p) => (
            <Link
              key={p.path}
              href={p.path}
              className="group rounded-xl border border-zinc-200 bg-white p-6 shadow-sm hover:border-zinc-400 hover:shadow-md transition-all space-y-3"
            >
              <p className="text-sm font-semibold text-zinc-900 group-hover:text-zinc-700 transition-colors">
                {p.h1}
              </p>
              <p className="text-sm text-zinc-600 leading-relaxed">
                {p.intro.slice(0, 150)}...
              </p>
              <p className="text-xs font-medium text-zinc-400 group-hover:text-zinc-600 transition-colors">
                Learn more →
              </p>
            </Link>
          ))}
        </div>

        <div className="mt-16 rounded-xl border border-zinc-200 bg-zinc-50 px-8 py-10 text-center space-y-4">
          <h2 className="text-xl font-semibold text-zinc-900">
            One platform for every coaching practice
          </h2>
          <p className="text-sm text-zinc-700 leading-relaxed">
            Booking, payment, and video — built for coaches who charge for their time. First 10
            sessions free, no credit card required.
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
