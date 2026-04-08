import Link from 'next/link'

export const metadata = {
  title: 'Contact – CallSesh',
  description: 'Get in touch with the CallSesh team. We typically respond within 24 hours.',
}

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-zinc-950 text-white px-6 py-16">
      <div className="mx-auto max-w-3xl space-y-10">

        <div className="space-y-4">
          <Link href="/" className="text-xs text-zinc-600 hover:text-zinc-400 transition-colors">
            ← Back to home
          </Link>
          <div className="space-y-2">
            <h1 className="text-3xl font-semibold text-zinc-100">Contact</h1>
            <p className="text-sm text-zinc-500">We&apos;re here to help.</p>
          </div>
        </div>

        <div className="rounded-xl border border-zinc-800 bg-zinc-900 px-8 py-8 space-y-4">
          <p className="text-sm text-zinc-400 leading-relaxed">
            Have a question about CallSesh? Reach out and we&apos;ll get back to you.
          </p>
          <a
            href="mailto:support@landerossystems.com"
            className="inline-block text-indigo-400 hover:text-indigo-300 transition-colors font-medium"
          >
            support@landerossystems.com
          </a>
          <p className="text-xs text-zinc-600">We typically respond within 24 hours.</p>
        </div>

      </div>
    </div>
  )
}
