import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { createServiceClient } from '@/lib/supabase/service'

export const metadata: Metadata = {
  title: 'Coaching Booking Software That Replaces Calendly, Zoom & Stripe',
  description:
    'Run your coaching business in one place. Let clients book, pay, and join sessions without switching tools. Start free — first 10 sessions covered.',
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'Coaching Booking Software That Replaces Calendly, Zoom & Stripe',
    description:
      'Run your coaching business in one place. Let clients book, pay, and join sessions without switching tools. Start free — first 10 sessions covered.',
    url: '/',
    type: 'website',
  },
  twitter: {
    title: 'Coaching Booking Software That Replaces Calendly, Zoom & Stripe',
    description:
      'Run your coaching business in one place. Let clients book, pay, and join sessions without switching tools. Start free — first 10 sessions covered.',
  },
}

export default async function Home() {
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
    <div className="min-h-screen bg-white text-zinc-900">

      {/* ── Nav ── */}
      <header className="sticky top-0 z-50 bg-zinc-50 backdrop-blur-sm border-b border-zinc-200">
        <div className="mx-auto max-w-5xl px-6 h-16 flex items-center justify-between">
          <Image
            src="/images/CallSesh-Dark.png"
            alt="CallSesh"
            width={140}
            height={32}
            priority
            className="h-8 w-auto transition-transform hover:scale-105"
          />
          <nav className="hidden sm:flex items-center gap-8 text-sm text-zinc-700">
            <Link href="#how-it-works" className="hover:text-zinc-900 transition-colors">Solutions</Link>
            <Link href="#pricing" className="hover:text-zinc-900 transition-colors">Pricing</Link>
          </nav>
          <div className="flex items-center gap-4">
            <Link
              href="/login"
              className="text-sm text-zinc-700 hover:text-zinc-900 transition-colors hidden sm:block"
            >
              Sign in
            </Link>
            <Link
              href="/signup"
              className="rounded-lg bg-zinc-900 px-4 py-2 text-sm font-semibold text-white hover:bg-zinc-800 transition-colors shadow-sm"
            >
              Get started
            </Link>
          </div>
        </div>
      </header>

      {/* ── Hero ── */}
      <section className="mx-auto max-w-6xl px-6 pt-14 pb-10 overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.55fr] gap-8 lg:gap-12 items-center">

          {/* Left: copy */}
          <div className="space-y-6 text-center lg:text-left">
            <div className="flex justify-center lg:justify-start">
              <span className="inline-flex items-center rounded-full bg-zinc-100 px-3 py-1 text-xs font-medium text-zinc-600">
                Built for coaches who run paid 1-on-1 sessions
              </span>
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold tracking-tight leading-tight text-zinc-900">
              Coaching Booking Software for{' '}
              <span className="text-indigo-600">Paid 1-on-1 Sessions</span>
            </h1>
            <p className="text-lg text-zinc-600 leading-relaxed">
              Booking, payments, video, session notes, recaps, and client history — without stitching together 5 different tools.
            </p>
            {offerAvailable && (
              <div className="rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm text-zinc-700 text-left">
                <span className="font-medium text-zinc-900">Limited offer:</span> Start free — your first 10 sessions are on us.
              </div>
            )}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 pt-1">
              <Link
                href="/signup"
                className="inline-flex items-center justify-center rounded-lg bg-zinc-900 px-7 py-3 text-sm font-semibold text-white hover:bg-zinc-800 transition-colors shadow-sm w-full sm:w-auto"
              >
                Get started free
              </Link>
              <Link
                href="#pricing"
                className="inline-flex items-center justify-center rounded-lg border border-zinc-200 px-7 py-3 text-sm font-semibold text-zinc-600 hover:bg-zinc-50 transition-colors w-full sm:w-auto"
              >
                See pricing
              </Link>
            </div>
            <p className="text-sm text-zinc-400">No credit card required · Set up in under 2 minutes</p>
          </div>

          {/* Right: dashboard screenshot + overlay activity cards */}
          <div className="relative lg:py-10 lg:pr-0 lg:pl-4">

            {/* Soft glow behind dashboard — desktop only */}
            <div
              className="hidden lg:block absolute -inset-8 -z-10 rounded-[3rem] blur-3xl opacity-70"
              style={{ background: 'radial-gradient(ellipse at 52% 45%, #dde5ff 0%, transparent 58%)' }}
            />

            {/* Dashboard image — aggressive perspective tilt on desktop */}
            <div
              className="rounded-2xl overflow-hidden border border-zinc-300/40 shadow-[0_32px_100px_-8px_rgba(0,0,0,0.22)] lg:[transform:perspective(1200px)_rotateX(3deg)_rotateY(-18deg)_scale(1.04)]"
            >
              <Image
                src="/images/hero-image.png"
                alt="CallSesh coach dashboard"
                width={900}
                height={600}
                priority
                className="w-full block"
              />
            </div>

            {/* Overlay: New booking — top left */}
            <div className="hidden lg:flex absolute top-2 -left-2 bg-white rounded-xl border border-zinc-200 shadow-lg px-3 py-2.5 items-start gap-2.5 min-w-[184px]">
              <div className="flex-shrink-0 mt-0.5">
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="text-indigo-500">
                  <rect x="1" y="2" width="12" height="11" rx="1.75" stroke="currentColor" strokeWidth="1.25"/>
                  <path d="M1 5.5h12" stroke="currentColor" strokeWidth="1.25"/>
                  <path d="M4.5 1v2.5M9.5 1v2.5" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round"/>
                </svg>
              </div>
              <div>
                <p className="text-[11px] font-semibold text-indigo-600 leading-none mb-1">New booking</p>
                <p className="text-[11px] text-zinc-700 leading-snug">Marcus booked Strategy Call</p>
                <p className="text-[10px] text-zinc-400 mt-0.5">Today · 10:24 AM</p>
              </div>
            </div>

            {/* Overlay: Payment received — top right */}
            <div className="hidden lg:flex absolute top-2 -right-2 bg-white rounded-xl border border-zinc-200 shadow-lg px-3 py-2.5 items-start gap-2.5 min-w-[172px]">
              <div className="flex-shrink-0 mt-0.5">
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="text-emerald-500">
                  <circle cx="7" cy="7" r="6" stroke="currentColor" strokeWidth="1.25"/>
                  <path d="M4.5 7l2 2 3-3" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <div>
                <p className="text-[11px] font-semibold text-emerald-600 leading-none mb-1">Payment received</p>
                <p className="text-[11px] text-zinc-700 leading-snug">$240 from Alex Kim</p>
                <p className="text-[10px] text-zinc-400 mt-0.5">Today · 10:25 AM</p>
              </div>
            </div>

            {/* Overlay: Returning client — bottom left */}
            <div className="hidden lg:flex absolute bottom-16 -left-6 bg-white rounded-xl border border-zinc-200 shadow-lg px-3 py-2.5 items-start gap-2.5 min-w-[164px]">
              <div className="flex-shrink-0 mt-0.5">
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="text-zinc-500">
                  <circle cx="7" cy="4.5" r="2.5" stroke="currentColor" strokeWidth="1.25"/>
                  <path d="M2 12c0-2.21 2.239-4 5-4s5 1.79 5 4" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round"/>
                </svg>
              </div>
              <div>
                <p className="text-[11px] font-semibold text-zinc-600 leading-none mb-1">Returning client</p>
                <p className="text-[11px] text-zinc-700 leading-snug">Jordan rebooked</p>
                <p className="text-[10px] text-zinc-400 mt-0.5">Today · 9:15 AM</p>
              </div>
            </div>

            {/* Overlay: Upcoming session — bottom right */}
            <div className="hidden lg:flex absolute bottom-4 -right-6 bg-white rounded-xl border border-zinc-200 shadow-lg px-3 py-2.5 items-start gap-2.5 min-w-[184px]">
              <div className="flex-shrink-0 mt-0.5">
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="text-zinc-400">
                  <rect x="1" y="2" width="12" height="11" rx="1.75" stroke="currentColor" strokeWidth="1.25"/>
                  <path d="M1 5.5h12" stroke="currentColor" strokeWidth="1.25"/>
                  <path d="M4.5 1v2.5M9.5 1v2.5" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round"/>
                </svg>
              </div>
              <div>
                <p className="text-[11px] font-semibold text-zinc-500 leading-none mb-1">Upcoming session</p>
                <p className="text-[11px] text-zinc-700 leading-snug">Discovery Call with Sam</p>
                <p className="text-[10px] text-zinc-400 mt-0.5">Tomorrow · 11:00 AM</p>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* ── Feature strip — bridges hero into page content ── */}
      <div className="border-y border-zinc-100 bg-zinc-50">
        <div className="mx-auto max-w-5xl px-6 py-7">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-x-6 gap-y-5">

            <div className="flex items-center gap-2.5">
              <svg width="15" height="15" viewBox="0 0 15 15" fill="none" className="flex-shrink-0 text-zinc-400">
                <rect x="1.25" y="2.25" width="12.5" height="11.5" rx="1.75" stroke="currentColor" strokeWidth="1.2"/>
                <path d="M1.25 5.75h12.5" stroke="currentColor" strokeWidth="1.2"/>
                <path d="M5 1v2.5M10 1v2.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
              </svg>
              <span className="text-sm text-zinc-600">Accept bookings automatically</span>
            </div>

            <div className="flex items-center gap-2.5">
              <svg width="15" height="15" viewBox="0 0 15 15" fill="none" className="flex-shrink-0 text-zinc-400">
                <path d="M6 9.5a3.5 3.5 0 0 0 4.95 0l1.77-1.77a3.5 3.5 0 0 0-4.95-4.95l-.88.88" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
                <path d="M9 5.5a3.5 3.5 0 0 0-4.95 0L2.28 7.27a3.5 3.5 0 0 0 4.95 4.95l.88-.88" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
              </svg>
              <span className="text-sm text-zinc-600">Run sessions in one link</span>
            </div>

            <div className="flex items-center gap-2.5">
              <svg width="15" height="15" viewBox="0 0 15 15" fill="none" className="flex-shrink-0 text-zinc-400">
                <path d="M2.5 7.5h10M8.5 3.5l4 4-4 4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <span className="text-sm text-zinc-600">Turn free calls into paid sessions</span>
            </div>

            <div className="flex items-center gap-2.5">
              <svg width="15" height="15" viewBox="0 0 15 15" fill="none" className="flex-shrink-0 text-zinc-400">
                <rect x="1.25" y="1.25" width="5" height="5" rx="1" stroke="currentColor" strokeWidth="1.2"/>
                <rect x="8.75" y="1.25" width="5" height="5" rx="1" stroke="currentColor" strokeWidth="1.2"/>
                <rect x="1.25" y="8.75" width="5" height="5" rx="1" stroke="currentColor" strokeWidth="1.2"/>
                <rect x="8.75" y="8.75" width="5" height="5" rx="1" stroke="currentColor" strokeWidth="1.2"/>
              </svg>
              <span className="text-sm text-zinc-600">Replace Calendly, Zoom, and Stripe</span>
            </div>

          </div>
        </div>
      </div>

      {/* ── What is coaching booking software ── */}
      <section className="mx-auto max-w-3xl px-6 pb-16">
        <div className="border border-zinc-200 rounded-2xl p-8 bg-zinc-50 space-y-4">
          <h2 className="text-lg font-semibold text-zinc-900">What is coaching booking software?</h2>
          <p className="text-sm text-zinc-700 leading-relaxed">
            Coaching booking software lets clients schedule and pay for sessions directly — no email back-and-forth, no separate invoices, no manual video link coordination. The right tool handles all three in one flow: scheduling, upfront payment, and session delivery.
          </p>
          <p className="text-sm text-zinc-700 leading-relaxed">
            Most coaches piece this together with Calendly for scheduling, Zoom for video, and Stripe for payments. That works until an integration breaks, a client pays without booking, or the wrong Zoom link goes out. CallSesh is{' '}
            <Link href="/all-in-one-coaching-platform" className="underline underline-offset-2 hover:text-zinc-900 transition-colors">all-in-one coaching platform software</Link>{' '}
            that replaces all three — one link, one flow, one dashboard.
          </p>
          <div className="flex flex-wrap gap-x-6 gap-y-2 pt-1 text-sm">
            <Link href="/coaching-booking-software" className="text-zinc-700 underline underline-offset-2 hover:text-zinc-900 transition-colors">Coaching booking software guide</Link>
            <Link href="/coaching-business-software" className="text-zinc-700 underline underline-offset-2 hover:text-zinc-900 transition-colors">Coaching business software</Link>
            <Link href="/tools-for-coaching-business" className="text-zinc-700 underline underline-offset-2 hover:text-zinc-900 transition-colors">Tools for coaching business</Link>
          </div>
        </div>
      </section>

      {/* ── Free Tools ── */}
      <section className="mx-auto max-w-3xl px-6 pb-16">
        <div className="border border-zinc-200 rounded-2xl p-6 bg-zinc-50 space-y-4">
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <div>
              <h2 className="text-base font-semibold text-zinc-900">Free Tools for Coaches</h2>
              <p className="text-sm text-zinc-600 mt-0.5">Simple tools to help you evaluate and improve your coaching business setup.</p>
            </div>
            <Link href="/tools" className="text-xs text-zinc-500 hover:text-zinc-700 underline underline-offset-2 transition-colors whitespace-nowrap">
              View all free tools
            </Link>
          </div>
          <div className="bg-white border border-zinc-200 rounded-xl p-4 flex items-center justify-between gap-4 flex-wrap shadow-sm">
            <div>
              <p className="text-sm font-medium text-zinc-900">Coaching Booking Software Cost Calculator</p>
              <p className="text-xs text-zinc-600 mt-0.5">See how much you're paying across scheduling, video, and payment tools.</p>
            </div>
            <Link
              href="/tools/coach-tool-cost-calculator"
              className="rounded-lg border border-zinc-200 px-4 py-2 text-xs font-semibold text-zinc-700 hover:bg-zinc-50 transition-colors whitespace-nowrap"
            >
              Open tool
            </Link>
          </div>
        </div>
      </section>

      {/* ── Workflow cards ── */}
      <section id="how-it-works" className="mx-auto max-w-5xl px-6 pb-24">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            {
              step: '01',
              title: 'Set your availability',
              description: 'Define your schedule, session length, and pricing. Takes less than two minutes.',
              image: '/images/scheduling.png',
              alt: 'Scheduling setup',
            },
            {
              step: '02',
              title: 'Share your booking link',
              description: 'Send one link. Clients pick a time and pay instantly — no back and forth.',
              image: '/images/bookingConfirmation.png',
              alt: 'Booking confirmation',
            },
            {
              step: '03',
              title: 'Get paid when clients book',
              description: 'Payments hit your account automatically after every completed session.',
              image: '/images/payment_icon.png',
              alt: 'Payment received',
            },
          ].map(({ step, title, description, image, alt }) => (
            <div
              key={step}
              className="bg-white border border-zinc-200 rounded-2xl p-6 shadow-sm overflow-hidden space-y-4"
            >
              <div className="w-full bg-zinc-50 rounded-lg flex items-center justify-center p-4">
                <Image src={image} alt={alt} width={400} height={250} className="w-full h-auto object-contain rounded-lg" />
              </div>
              <div className="space-y-1.5">
                <span className="text-xs font-semibold text-zinc-600 uppercase tracking-widest">{step}</span>
                <h3 className="text-sm font-semibold text-zinc-900">{title}</h3>
                <p className="text-sm text-zinc-700 leading-relaxed">{description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Feature rows ── */}
      <section className="mx-auto max-w-5xl px-6 py-24 space-y-24">

        {/* Row 1: text left, image right */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-5">
            <span className="text-xs font-semibold text-zinc-600 uppercase tracking-widest">Payments</span>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-zinc-900 leading-snug">
              Accept paid bookings automatically
            </h2>
            <p className="text-zinc-700 leading-relaxed">
              Set your rate, share your link, and start earning. Stripe handles the payments and you get paid after each session — no invoicing, no chasing. Curious how much you're currently paying across tools? Try our <Link href="/tools/coach-tool-cost-calculator" className="underline underline-offset-2 hover:text-zinc-900 transition-colors">coaching booking software cost calculator</Link>.
            </p>
            <Link
              href="/signup"
              className="inline-flex items-center justify-center rounded-lg bg-zinc-900 px-5 py-2.5 text-sm font-semibold text-white hover:bg-zinc-800 transition-colors shadow-sm"
            >
              Start accepting bookings
            </Link>
          </div>
          <div className="w-full aspect-[4/3] rounded-2xl overflow-hidden bg-zinc-50 relative">
            <Image src="/images/payment.png" alt="Accept paid bookings preview" fill className="object-cover" />
          </div>
        </div>

        {/* Row 2: image left, text right */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="order-2 lg:order-1 w-full rounded-2xl overflow-hidden bg-zinc-50 flex items-center justify-center p-2">
            <Image src="/images/session_link.png" alt="Session link preview" width={500} height={300} className="w-full h-auto object-contain rounded-xl" />
          </div>
          <div className="order-1 lg:order-2 space-y-5">
            <span className="text-xs font-semibold text-zinc-600 uppercase tracking-widest">Sessions</span>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-zinc-900 leading-snug">
              Run coaching sessions in one link
            </h2>
            <p className="text-zinc-700 leading-relaxed">
              A private video room opens automatically at session time. No installs, no third-party tools — just show up and coach.
            </p>
            <Link
              href="/signup"
              className="inline-flex items-center justify-center rounded-lg bg-zinc-900 px-5 py-2.5 text-sm font-semibold text-white hover:bg-zinc-800 transition-colors shadow-sm"
            >
              See how it works
            </Link>
          </div>
        </div>

        {/* Row 3: text left, visual right — Discovery calls */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-5">
            <span className="text-xs font-semibold text-zinc-600 uppercase tracking-widest">Discovery Calls</span>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-zinc-900 leading-snug">
              Turn free intro calls into paid sessions
            </h2>
            <p className="text-zinc-700 leading-relaxed">
              Offer a free discovery call, let clients book instantly, then keep session notes and follow up with a paid booking link.
            </p>
            <Link
              href="/signup"
              className="inline-flex items-center justify-center rounded-lg bg-zinc-900 px-5 py-2.5 text-sm font-semibold text-white hover:bg-zinc-800 transition-colors shadow-sm"
            >
              Start with a free call
            </Link>
          </div>
          <div className="w-full aspect-[4/3] rounded-2xl bg-zinc-50 border border-zinc-200 flex flex-col items-center justify-center gap-4 p-8">
            <div className="flex items-center gap-3 w-full max-w-xs">
              <div className="flex-1 rounded-xl border border-zinc-200 bg-white px-4 py-3 shadow-sm text-center">
                <p className="text-xs font-semibold text-zinc-500 uppercase tracking-widest mb-0.5">Discovery</p>
                <p className="text-sm font-semibold text-zinc-900">Free · 20 min</p>
              </div>
              <span className="text-zinc-400 text-lg">→</span>
              <div className="flex-1 rounded-xl border border-zinc-900 bg-white px-4 py-3 shadow-sm text-center">
                <p className="text-xs font-semibold text-zinc-500 uppercase tracking-widest mb-0.5">Paid session</p>
                <p className="text-sm font-semibold text-zinc-900">$150 · 60 min</p>
              </div>
            </div>
            <p className="text-xs text-zinc-400 text-center">Free discovery call → Paid session</p>
          </div>
        </div>

      </section>

      {/* ── Comparison positioning ── */}
      <section className="bg-zinc-50 border-y border-zinc-100">
        <div className="mx-auto max-w-5xl px-6 py-16 space-y-10">
          <div className="text-center space-y-2">
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-zinc-900">
              Replace Calendly, Zoom, and Stripe with one tool
            </h2>
            <p className="text-zinc-700 max-w-xl mx-auto text-sm">
              Most coaches maintain three separate subscriptions to do what CallSesh handles end-to-end.
            </p>
          </div>
          <div className="overflow-x-auto rounded-xl border border-zinc-200">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-zinc-200 bg-white">
                  <th className="px-5 py-3 text-left font-medium text-zinc-500 w-1/3">Feature</th>
                  <th className="px-5 py-3 text-left font-medium text-zinc-500 w-1/3">Calendly + Zoom + Stripe</th>
                  <th className="px-5 py-3 text-left font-semibold text-zinc-900 w-1/3">CallSesh</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-zinc-100">
                {([
                  ['Scheduling', 'Calendly', '✓ Built in'],
                  ['Payment at booking', 'Stripe + manual integration', '✓ Required by default'],
                  ['Video sessions', 'Zoom — manual link per session', '✓ Auto-generated on booking'],
                  ['Session notes', 'Not included', '✓ Tied to each client'],
                  ['Single dashboard', 'Three separate apps', '✓ Everything in one place'],
                  ['Monthly cost', '$35–60+ across tools', 'From $19.99/mo'],
                ] as const).map(([feature, them, us]) => (
                  <tr key={feature}>
                    <td className="px-5 py-3.5 font-medium text-zinc-700">{feature}</td>
                    <td className="px-5 py-3.5 text-zinc-500">{them}</td>
                    <td className="px-5 py-3.5 text-zinc-900 font-medium">{us}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="flex flex-wrap justify-center gap-x-8 gap-y-2 text-sm">
            <Link href="/alternatives/calendly-alternative-for-coaches" className="text-zinc-600 underline underline-offset-2 hover:text-zinc-900 transition-colors">Calendly alternative for coaches</Link>
            <Link href="/alternatives/zoom-alternative-for-coaching" className="text-zinc-600 underline underline-offset-2 hover:text-zinc-900 transition-colors">Zoom alternative for coaching</Link>
            <Link href="/alternatives/stripe-alternative-for-coaches" className="text-zinc-600 underline underline-offset-2 hover:text-zinc-900 transition-colors">Stripe alternative for coaches</Link>
          </div>
        </div>
      </section>

      {/* ── Pricing ── */}
      <section id="pricing" className="bg-zinc-50 border-y border-zinc-100">
        <div className="mx-auto max-w-5xl px-6 py-24">
          <div className="text-center mb-12 space-y-2">
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-zinc-900">Simple pricing</h2>
            <p className="text-zinc-700">No hidden fees. No surprises.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 max-w-2xl mx-auto">

            {/* Starter */}
            <div className="bg-white border border-zinc-200 rounded-2xl p-8 shadow-sm space-y-6">
              <div className="space-y-1">
                <p className="text-xs font-semibold uppercase tracking-widest text-zinc-600">Starter</p>
                <p className="text-4xl font-bold text-zinc-900">$19.99<span className="text-base font-normal text-zinc-500">/mo</span></p>
              </div>
              <ul className="space-y-2.5 text-sm text-zinc-700">
                <li className="flex items-center gap-2.5">
                  <span className="text-zinc-500 text-base leading-none">✓</span> Up to 40 sessions per month
                </li>
                <li className="flex items-center gap-2.5">
                  <span className="text-zinc-500 text-base leading-none">✓</span> +10% per session
                </li>
              </ul>
              <Link
                href="/signup"
                className="block w-full rounded-lg border border-zinc-200 px-4 py-2.5 text-center text-sm font-semibold text-zinc-700 hover:bg-zinc-50 transition-colors"
              >
                Get started
              </Link>
            </div>

            {/* Pro */}
            <div className="bg-white border-2 border-zinc-900 rounded-2xl p-8 shadow-sm space-y-6">
              <div className="space-y-1">
                <p className="text-xs font-semibold uppercase tracking-widest text-zinc-900">Pro</p>
                <p className="text-4xl font-bold text-zinc-900">$49.99<span className="text-base font-normal text-zinc-500">/mo</span></p>
              </div>
              <ul className="space-y-2.5 text-sm text-zinc-700">
                <li className="flex items-center gap-2.5">
                  <span className="text-zinc-500 text-base leading-none">✓</span> Unlimited sessions
                </li>
                <li className="flex items-center gap-2.5">
                  <span className="text-zinc-500 text-base leading-none">✓</span> +10% per session
                </li>
              </ul>
              <Link
                href="/signup"
                className="block w-full rounded-lg bg-zinc-900 px-4 py-2.5 text-center text-sm font-semibold text-white hover:bg-zinc-800 transition-colors"
              >
                Start earning
              </Link>
            </div>

          </div>
          <p className="text-xs text-zinc-500 text-center mt-8">Start free. Upgrade when you're ready.</p>
        </div>
      </section>

      {/* ── Final CTA ── */}
      <section className="mx-auto max-w-3xl px-6 py-24 text-center space-y-5">
        <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-zinc-900">
          Ready to get paid for your expertise?
        </h2>
        <p className="text-zinc-700 text-base">
          Set up your booking page in minutes and start accepting paid sessions today. Wondering how much missed sessions are costing you? Try our{" "}
          <Link href="/tools/no-show-cost-calculator" className="underline underline-offset-2 hover:text-zinc-900 transition-colors">no-show cost calculator</Link>.
        </p>
        <div className="pt-2">
          <Link
            href="/signup"
            className="inline-flex items-center justify-center rounded-lg bg-zinc-900 px-8 py-3.5 text-sm font-semibold text-white hover:bg-zinc-800 transition-colors shadow-sm"
          >
            Get started free
          </Link>
          <p className="text-sm text-zinc-500 mt-4">No credit card required</p>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="border-t border-zinc-100 bg-zinc-50 py-10">
        <div className="mx-auto max-w-5xl px-6 space-y-8 text-xs text-zinc-600">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
            <div className="space-y-2.5">
              <p className="font-semibold uppercase tracking-widest text-zinc-500">Product</p>
              <Link href="/coaching-booking-software" className="block hover:text-zinc-600 transition-colors">Coaching Booking Software</Link>
              <Link href="/coach-payment-processing" className="block hover:text-zinc-600 transition-colors">Coach Payment Processing</Link>
              <Link href="/video-coaching-platform" className="block hover:text-zinc-600 transition-colors">Video Coaching Platform</Link>
              <Link href="/all-in-one-coaching-platform" className="block hover:text-zinc-600 transition-colors">All-in-One Coaching Platform</Link>
              <Link href="/coaching-business-software" className="block hover:text-zinc-600 transition-colors">Coaching Business Software</Link>
              <Link href="/simple-coaching-booking-system" className="block hover:text-zinc-600 transition-colors">Simple Coaching Booking System</Link>
            </div>
            <div className="space-y-2.5">
              <p className="font-semibold uppercase tracking-widest text-zinc-500">Compare</p>
              <Link href="/alternatives/calendly-for-coaches" className="block hover:text-zinc-600 transition-colors">Calendly for Coaches</Link>
              <Link href="/alternatives/calendly-alternative-for-coaches" className="block hover:text-zinc-600 transition-colors">Calendly Alternative for Coaches</Link>
              <Link href="/alternatives/zoom-alternative-for-coaching" className="block hover:text-zinc-600 transition-colors">Zoom Alternative for Coaching</Link>
              <Link href="/alternatives/stripe-alternative-for-coaches" className="block hover:text-zinc-600 transition-colors">Stripe Alternative for Coaches</Link>
            </div>
            <div className="space-y-2.5">
              <p className="font-semibold uppercase tracking-widest text-zinc-500">Use Cases</p>
              <Link href="/for/business-coaches" className="block hover:text-zinc-600 transition-colors">Business Coaches</Link>
              <Link href="/for/life-coaches" className="block hover:text-zinc-600 transition-colors">Life Coaches</Link>
              <Link href="/for/fitness-coaches" className="block hover:text-zinc-600 transition-colors">Fitness Coaches</Link>
            </div>
            <div className="space-y-2.5">
              <p className="font-semibold uppercase tracking-widest text-zinc-500">Resources</p>
              <Link href="/tools" className="block hover:text-zinc-600 transition-colors">Free Tools</Link>
              <Link href="/tools-for-coaching-business" className="block hover:text-zinc-600 transition-colors">Tools for Coaching Business</Link>
              <Link href="/tools/coach-tool-cost-calculator" className="block hover:text-zinc-600 transition-colors">Coaching Cost Calculator</Link>
              <Link href="/tools/session-notes-template-generator" className="block hover:text-zinc-600 transition-colors">Session Notes Generator</Link>
              <Link href="/tools/no-show-cost-calculator" className="block hover:text-zinc-600 transition-colors">No-Show Cost Calculator</Link>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-zinc-200 pt-6">
            <span>© 2026 CallSesh by Landeros Systems</span>
            <div className="flex gap-4">
              <Link href="/privacy" className="hover:text-zinc-600 transition-colors">Privacy</Link>
              <Link href="/terms" className="hover:text-zinc-600 transition-colors">Terms</Link>
              <Link href="/contact" className="hover:text-zinc-600 transition-colors">Contact</Link>
            </div>
          </div>
        </div>
      </footer>

    </div>
  )
}
