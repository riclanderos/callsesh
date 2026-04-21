import Link from 'next/link'
import Image from 'next/image'
import { createServiceClient } from '@/lib/supabase/service'

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
      <section className="mx-auto max-w-3xl px-6 pt-24 pb-20 text-center">
        <div className="space-y-6">
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight leading-tight text-zinc-900">
            Coaching Booking Software for Paid 1-on-1 Sessions
          </h1>
          <p className="text-lg text-zinc-700 leading-relaxed max-w-xl mx-auto">
            Booking, payments, video, session notes, recaps, and client history — without stitching together 5 different tools.
          </p>
          <p className="text-sm text-zinc-600">
            Built for coaches who run paid sessions online.
          </p>
          {offerAvailable && (
            <p className="text-sm text-zinc-700 leading-relaxed border border-zinc-200 bg-zinc-50 rounded-xl px-5 py-3.5 max-w-xl mx-auto text-left">
              <span className="font-medium text-zinc-900">Limited offer:</span> Start free — your first 10 sessions are on us.
            </p>
          )}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <Link
              href="/signup"
              className="inline-flex items-center justify-center rounded-lg bg-zinc-900 px-7 py-3 text-sm font-semibold text-white hover:bg-zinc-800 transition-colors shadow-sm"
            >
              Get started free
            </Link>
            <Link
              href="#pricing"
              className="inline-flex items-center justify-center rounded-lg border border-zinc-200 px-7 py-3 text-sm font-semibold text-zinc-600 hover:bg-zinc-50 transition-colors"
            >
              See pricing
            </Link>
          </div>
          <p className="text-sm text-zinc-400">No credit card required · Set up in under 2 minutes</p>
        </div>
      </section>

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

      {/* ── Value strip ── */}
      <div className="border-y border-zinc-100 bg-zinc-50">
        <div className="mx-auto max-w-5xl px-6 py-10">
          <p className="text-center text-xs uppercase tracking-[0.2em] text-zinc-500 mb-8">Why coaches use CallSesh</p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
            {[
              'No back-and-forth scheduling',
              'Get paid before the session',
              'Booking, payments, and video in one place',
            ].map((text) => (
              <p key={text} className="text-sm font-medium text-zinc-700">{text}</p>
            ))}
          </div>
        </div>
      </div>

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
