import Link from 'next/link'
import Image from 'next/image'
import { createServiceClient } from '@/lib/supabase/service'
import HeroWorkflow from './hero-workflow'

export default async function Home() {
  // Query the grant counter so promo copy disappears once the cap is reached.
  // Falls back to showing the offer on any DB error (safe for marketing).
  let grantsUsed = 0
  try {
    const { data } = await createServiceClient()
      .from('launch_offer_counter')
      .select('grants_used')
      .eq('id', 1)
      .maybeSingle()
    grantsUsed = data?.grants_used ?? 0
  } catch {
    grantsUsed = 0
  }
  const offerAvailable = grantsUsed < 10
  return (
    <div
      className="min-h-screen text-white"
      style={{ background: 'linear-gradient(to bottom, #020617, #09090b 20%, #09090b 80%, #020617)' }}
    >

      {/* ── Nav ── */}
      <header className="mx-auto max-w-5xl h-[72px] px-8 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <Image
            src="/images/CallSesh.svg"
            alt="CallSesh logo"
            width={220}
            height={60}
            priority
            className="h-[42px] w-auto"
          />
        </div>
        <div className="flex items-center gap-4">
          <Link
            href="/login"
            className="text-sm text-zinc-300 hover:text-zinc-100 transition-colors"
          >
            Log in
          </Link>
          <Link
            href="/signup"
            className="rounded-lg bg-indigo-600 px-4 py-1.5 text-sm font-semibold text-white hover:bg-indigo-500 transition-colors"
          >
            Get started
          </Link>
        </div>
      </header>

      {/* ── Hero ── */}
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/10 to-purple-500/10 pointer-events-none" />
      <section className="relative mx-auto max-w-5xl px-6 pt-12 pb-24 text-center space-y-8">
        <div className="space-y-4 max-w-2xl mx-auto">
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight leading-tight">
            Run the full coaching workflow — before, during, and after every session
          </h1>
          <p className="text-lg text-zinc-300 leading-relaxed">
            Booking, payments, video, session notes, recaps, and client history — all in one place.
          </p>
          <p className="text-sm text-zinc-400 leading-relaxed">
            Built for career coaches, fitness coaches, and consultants running paid sessions.
          </p>
          {offerAvailable && (
            <p className="text-sm text-zinc-200 leading-relaxed max-w-md mx-auto text-center">
              Start free — your first 10 sessions are on us.
            </p>
          )}
          <div className="pt-2">
            <Link
              href="/signup"
              className="inline-block rounded-xl bg-indigo-600 px-8 py-3.5 text-sm font-semibold text-white hover:bg-indigo-500 transition-colors shadow-lg shadow-indigo-500/20"
            >
              Create your booking page
            </Link>
            <p className="text-xs text-zinc-400 mt-3">No credit card required • Set up in under 2 minutes</p>
          </div>
        </div>

        {/* Hero workflow */}
        <HeroWorkflow />
      </section>
      </div>

      {/* ── Trust line ── */}
      <p className="text-center text-sm text-zinc-400 pb-4">From booking to recap — your entire coaching workflow in one place.</p>

      {/* ── Testimonial ── */}
      <section className="mx-auto max-w-5xl px-6 py-24 text-center space-y-6">
        <p className="text-xl text-zinc-200 leading-relaxed max-w-2xl mx-auto">
          &ldquo;I replaced Calendly and Zoom and set everything up in minutes. I booked my first paid session the same day.&rdquo;
        </p>
        <p className="text-sm text-zinc-400">&mdash; Daniel M., Fitness Coach</p>
      </section>

      {/* ── Value ── */}
      <section className="mx-auto max-w-6xl px-6 py-24">
        <h2 className="text-2xl font-semibold text-center mb-16">Everything you need to run coaching sessions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
          {[
            {
              title: 'Custom booking page for your clients',
              description: 'Share a single link. Clients pick a time and pay instantly — no back and forth.',
            },
            {
              title: 'Built-in payments with automatic payouts',
              description: 'Accept card payments and get paid directly to your bank after every session.',
            },
            {
              title: 'Video sessions included — no extra tools',
              description: 'A private video room opens automatically at session time. Nothing to install.',
            },
          ].map(({ title, description }) => (
            <div key={title} className="flex flex-col items-center text-center">
              <div className="w-full rounded-xl border border-white/10 shadow-lg shadow-black/40 mb-3 bg-zinc-900 px-6 py-8">
                <p className="text-lg font-semibold text-white mb-1">{title}</p>
                <p className="text-sm text-zinc-300">{description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Post-session workflow ── */}
      <section className="mx-auto max-w-6xl px-6 py-24">
        <div className="text-center mb-16 space-y-3">
          <h2 className="text-2xl font-semibold">The session doesn&apos;t end when the call does</h2>
          <p className="text-sm text-zinc-400 max-w-xl mx-auto">
            Most coaching tools stop at the call. CallSesh keeps working after — so nothing falls through the cracks.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            {
              title: 'Session Notes',
              description: 'Write private notes during or after every session. Stays linked to the booking.',
            },
            {
              title: 'Recaps & Action Steps',
              description: 'Document what happened, key takeaways, and exactly what the client should do next.',
            },
            {
              title: 'Client History',
              description: 'Every session, note, and recap for each client — in one place. No digging required.',
            },
            {
              title: 'Previous Session Context',
              description: 'See the last recap before a session starts. Walk in prepared, not scrambling.',
            },
            {
              title: 'One-click recap sharing',
              description: 'Copy a formatted recap or open a pre-filled email to the client in seconds.',
            },
            {
              title: 'Full workflow, one tool',
              description: 'From booking to follow-up — without switching between apps or losing track.',
            },
          ].map(({ title, description }) => (
            <div key={title} className="rounded-xl border border-white/10 shadow-lg shadow-black/40 bg-zinc-900 px-6 py-8">
              <p className="text-base font-semibold text-white mb-1">{title}</p>
              <p className="text-sm text-zinc-300">{description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Pricing ── */}
      <section className="mx-auto max-w-5xl px-6 py-24">
        <h2 className="text-2xl font-semibold text-center mb-4">Pricing</h2>
        <p className="text-sm text-zinc-400 text-center mb-16">Simple pricing. No hidden fees.</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-2xl mx-auto">

          {/* Starter */}
          <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-8 space-y-4">
            <div className="space-y-1">
              <p className="text-xs font-medium uppercase tracking-wider text-zinc-400">Starter</p>
              <p className="text-3xl font-bold text-zinc-100">$19.99<span className="text-base font-normal text-zinc-400">/mo</span></p>
            </div>
            <ul className="space-y-2 text-sm text-zinc-300">
              <li>Up to 40 sessions per month</li>
              <li>+10% per session</li>
            </ul>
            <p className="text-xs text-zinc-400">Free plan includes up to 10 sessions</p>
            <Link
              href="/signup"
              className="block w-full rounded-lg border border-zinc-700 px-4 py-2.5 text-center text-sm font-semibold text-zinc-200 hover:bg-zinc-800 transition-colors"
            >
              Get started
            </Link>
          </div>

          {/* Pro */}
          <div className="rounded-2xl border border-indigo-800 bg-zinc-900 p-8 space-y-4 ring-1 ring-indigo-900">
            <div className="space-y-1">
              <p className="text-xs font-medium uppercase tracking-wider text-indigo-400">Pro</p>
              <p className="text-3xl font-bold text-zinc-100">$49.99<span className="text-base font-normal text-zinc-400">/mo</span></p>
            </div>
            <ul className="space-y-2 text-sm text-zinc-300">
              <li>Unlimited sessions</li>
              <li>+10% per session</li>
            </ul>
            <Link
              href="/signup"
              className="block w-full rounded-lg bg-indigo-600 px-4 py-2.5 text-center text-sm font-semibold text-white hover:bg-indigo-500 transition-colors"
            >
              Start earning
            </Link>
          </div>

        </div>
        <p className="text-xs text-zinc-500 text-center mt-8">Start free. Upgrade only when you need it.</p>
      </section>

      {/* ── Final CTA ── */}
      <section className="mx-auto max-w-5xl px-6 py-24 text-center space-y-6">
        <h2 className="text-3xl font-bold tracking-tight">Run your full coaching workflow from one link</h2>
        <p className="text-zinc-300 text-base">
          Booking, payments, video, notes, recaps, and client history — set up in minutes.
        </p>
        <Link
          href="/signup"
          className="inline-block rounded-xl bg-indigo-600 px-8 py-3.5 text-sm font-semibold text-white hover:bg-indigo-500 transition-colors shadow-lg shadow-indigo-500/20"
        >
          Create your coaching page
        </Link>
      </section>

      {/* ── Footer ── */}
      <footer className="border-t border-zinc-800 py-8">
        <div className="mx-auto max-w-5xl px-6 space-y-6 text-xs text-zinc-600">
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-6">
            <div className="space-y-2">
              <p className="font-medium uppercase tracking-wider text-zinc-500">Product</p>
              <Link href="/coaching-booking-software" className="block hover:text-zinc-300 transition-colors">Coaching Booking Software</Link>
              <Link href="/coach-payment-processing" className="block hover:text-zinc-300 transition-colors">Coach Payment Processing</Link>
              <Link href="/video-coaching-platform" className="block hover:text-zinc-300 transition-colors">Video Coaching Platform</Link>
            </div>
            <div className="space-y-2">
              <p className="font-medium uppercase tracking-wider text-zinc-500">Compare</p>
              <Link href="/alternatives/calendly-for-coaches" className="block hover:text-zinc-300 transition-colors">Calendly for Coaches</Link>
            </div>
            <div className="space-y-2">
              <p className="font-medium uppercase tracking-wider text-zinc-500">Use Cases</p>
              <Link href="/for/business-coaches" className="block hover:text-zinc-300 transition-colors">Business Coaches</Link>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-zinc-800 pt-6">
            <span>© 2026 CallSesh by Landeros Systems</span>
            <div className="flex gap-4">
              <Link href="/privacy" className="hover:text-zinc-300 transition-colors">Privacy</Link>
              <Link href="/terms" className="hover:text-zinc-300 transition-colors">Terms</Link>
            </div>
          </div>
        </div>
      </footer>

    </div>
  )
}
