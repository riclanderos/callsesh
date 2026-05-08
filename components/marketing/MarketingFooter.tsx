import Link from 'next/link'

export default function MarketingFooter() {
  return (
    <footer className="border-t border-zinc-100 bg-zinc-50 py-10">
      <div className="mx-auto max-w-5xl px-6 space-y-8 text-xs text-zinc-600">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
          <div className="space-y-2.5">
            <p className="font-semibold uppercase tracking-widest text-zinc-500">Product</p>
            <Link href="/coaching-booking-software" className="block hover:text-zinc-900 transition-colors">Coaching Booking Software</Link>
            <Link href="/coach-payment-processing" className="block hover:text-zinc-900 transition-colors">Coach Payment Processing</Link>
            <Link href="/video-coaching-platform" className="block hover:text-zinc-900 transition-colors">Video Coaching Platform</Link>
            <Link href="/all-in-one-coaching-platform" className="block hover:text-zinc-900 transition-colors">All-in-One Coaching Platform</Link>
            <Link href="/coaching-business-software" className="block hover:text-zinc-900 transition-colors">Coaching Business Software</Link>
            <Link href="/simple-coaching-booking-system" className="block hover:text-zinc-900 transition-colors">Simple Coaching Booking System</Link>
          </div>
          <div className="space-y-2.5">
            <p className="font-semibold uppercase tracking-widest text-zinc-500">Compare</p>
            <Link href="/alternatives/calendly-for-coaches" className="block hover:text-zinc-900 transition-colors">Calendly for Coaches</Link>
            <Link href="/alternatives/calendly-alternative-for-coaches" className="block hover:text-zinc-900 transition-colors">Calendly Alternative for Coaches</Link>
            <Link href="/alternatives/zoom-alternative-for-coaching" className="block hover:text-zinc-900 transition-colors">Zoom Alternative for Coaching</Link>
            <Link href="/alternatives/stripe-alternative-for-coaches" className="block hover:text-zinc-900 transition-colors">Stripe Alternative for Coaches</Link>
          </div>
          <div className="space-y-2.5">
            <p className="font-semibold uppercase tracking-widest text-zinc-500">Use Cases</p>
            <Link href="/for/business-coaches" className="block hover:text-zinc-900 transition-colors">Business Coaches</Link>
            <Link href="/for/life-coaches" className="block hover:text-zinc-900 transition-colors">Life Coaches</Link>
            <Link href="/for/fitness-coaches" className="block hover:text-zinc-900 transition-colors">Fitness Coaches</Link>
          </div>
          <div className="space-y-2.5">
            <p className="font-semibold uppercase tracking-widest text-zinc-500">Resources</p>
            <Link href="/tools" className="block hover:text-zinc-900 transition-colors">Free Tools</Link>
            <Link href="/tools-for-coaching-business" className="block hover:text-zinc-900 transition-colors">Tools for Coaching Business</Link>
            <Link href="/tools/coach-tool-cost-calculator" className="block hover:text-zinc-900 transition-colors">Coaching Cost Calculator</Link>
            <Link href="/tools/session-notes-template-generator" className="block hover:text-zinc-900 transition-colors">Session Notes Generator</Link>
            <Link href="/tools/no-show-cost-calculator" className="block hover:text-zinc-900 transition-colors">No-Show Cost Calculator</Link>
          </div>
        </div>
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-zinc-200 pt-6">
          <span>© 2026 CallSesh by Landeros Systems</span>
          <div className="flex gap-4">
            <Link href="/privacy" className="hover:text-zinc-900 transition-colors">Privacy</Link>
            <Link href="/terms" className="hover:text-zinc-900 transition-colors">Terms</Link>
            <Link href="/contact" className="hover:text-zinc-900 transition-colors">Contact</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
