import Link from 'next/link'
import MarketingNav from '@/components/marketing/MarketingNav'
import MarketingFooter from '@/components/marketing/MarketingFooter'

export const metadata = {
  title: 'Contact – CallSesh',
  description: 'Get in touch with the CallSesh team. We typically respond within 24 hours.',
}

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-white text-zinc-900">
      <MarketingNav />

      <div className="mx-auto max-w-3xl px-6 py-16 space-y-10">

        <div className="space-y-4">
          <Link href="/" className="text-xs text-zinc-500 hover:text-zinc-700 transition-colors">
            ← Back to home
          </Link>
          <div className="space-y-2">
            <h1 className="text-3xl font-semibold text-zinc-900">Contact</h1>
            <p className="text-sm text-zinc-500">We&apos;re here to help.</p>
          </div>
        </div>

        <div className="rounded-xl border border-zinc-200 bg-zinc-50 px-8 py-8 space-y-4">
          <p className="text-sm text-zinc-700 leading-relaxed">
            Have a question about CallSesh? Reach out and we&apos;ll get back to you.
          </p>
          <a
            href="mailto:support@landerossystems.com"
            className="inline-block text-zinc-900 font-medium underline underline-offset-2 hover:text-zinc-700 transition-colors"
          >
            support@landerossystems.com
          </a>
          <p className="text-xs text-zinc-500">We typically respond within 24 hours.</p>
        </div>

      </div>

      <MarketingFooter />
    </div>
  )
}
