import Link from 'next/link'
import Image from 'next/image'
import type { PseoPage } from '@/lib/pseo'

export default function MarketingPage({ page }: { page: PseoPage }) {
  return (
    <div
      className="min-h-screen text-white"
      style={{ background: 'linear-gradient(to bottom, #020617, #09090b 20%, #09090b 80%, #020617)' }}
    >
      {/* Nav */}
      <header className="mx-auto max-w-5xl h-[72px] px-8 flex items-center justify-between">
        <Link href="/">
          <Image
            src="/images/CallSesh.svg"
            alt="CallSesh logo"
            width={220}
            height={60}
            priority
            className="h-[42px] w-auto"
          />
        </Link>
        <div className="flex items-center gap-4">
          <Link href="/login" className="text-sm text-zinc-300 hover:text-zinc-100 transition-colors">
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

      {/* Hero */}
      <section className="mx-auto max-w-3xl px-6 pt-16 pb-20 text-center space-y-5">
        <h1 className="text-4xl sm:text-5xl font-bold tracking-tight leading-tight">{page.h1}</h1>
        <p className="text-lg text-zinc-300 leading-relaxed">{page.intro}</p>
        <div className="pt-2">
          <Link
            href="/signup"
            className="inline-block rounded-xl bg-indigo-600 px-8 py-3.5 text-sm font-semibold text-white hover:bg-indigo-500 transition-colors shadow-lg shadow-indigo-500/20"
          >
            Create your booking page
          </Link>
          <p className="text-xs text-zinc-400 mt-3">No credit card required · First 10 sessions free</p>
        </div>
      </section>

      {/* Who it's for */}
      <section className="mx-auto max-w-5xl px-6 py-16">
        <h2 className="text-xl font-semibold text-zinc-100 mb-6">Who this is for</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {page.forWho.map((item) => (
            <div key={item} className="flex items-start gap-3 rounded-xl border border-zinc-800 bg-zinc-900 px-5 py-4">
              <span className="mt-0.5 h-4 w-4 flex-shrink-0 rounded-full bg-indigo-600" aria-hidden="true" />
              <p className="text-sm text-zinc-300">{item}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Problem */}
      <section className="mx-auto max-w-5xl px-6 py-16">
        <div className="rounded-xl border border-zinc-800 bg-zinc-900 px-8 py-10 space-y-5">
          <h2 className="text-xl font-semibold text-zinc-100">{page.problem.heading}</h2>
          <ul className="space-y-4">
            {page.problem.points.map((point) => (
              <li key={point} className="flex items-start gap-3 text-sm text-zinc-400 leading-relaxed">
                <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-zinc-500" aria-hidden="true" />
                {point}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Solution */}
      <section className="mx-auto max-w-5xl px-6 py-16">
        <div className="rounded-xl border border-indigo-900 bg-zinc-900 px-8 py-10 space-y-5">
          <h2 className="text-xl font-semibold text-zinc-100">{page.solution.heading}</h2>
          <ul className="space-y-4">
            {page.solution.points.map((point) => (
              <li key={point} className="flex items-start gap-3 text-sm text-zinc-300 leading-relaxed">
                <svg className="mt-0.5 h-4 w-4 flex-shrink-0 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5} aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
                {point}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Comparison table (optional) */}
      {page.comparison && (
        <section className="mx-auto max-w-5xl px-6 py-16">
          <h2 className="text-xl font-semibold text-zinc-100 mb-6">
            CallSesh vs. {page.comparison.theyLabel}
          </h2>
          <div className="rounded-xl border border-zinc-800 overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-zinc-800 bg-zinc-900">
                  <th className="px-6 py-3 text-left font-medium text-zinc-400 w-1/3">Feature</th>
                  <th className="px-6 py-3 text-left font-medium text-zinc-400 w-1/3">{page.comparison.theyLabel}</th>
                  <th className="px-6 py-3 text-left font-medium text-indigo-400 w-1/3">CallSesh</th>
                </tr>
              </thead>
              <tbody className="bg-zinc-950">
                {page.comparison.rows.map((row, i) => (
                  <tr key={row.feature} className={i < page.comparison!.rows.length - 1 ? 'border-b border-zinc-800' : ''}>
                    <td className="px-6 py-4 text-zinc-300 font-medium">{row.feature}</td>
                    <td className="px-6 py-4 text-zinc-500">{row.them}</td>
                    <td className="px-6 py-4 text-zinc-200">{row.us}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {/* Workflow */}
      <section className="mx-auto max-w-5xl px-6 py-16">
        <h2 className="text-xl font-semibold text-zinc-100 mb-8">How it works</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {page.workflow.map(({ step, detail }, i) => (
            <div key={step} className="flex gap-4">
              <div className="flex-shrink-0 h-8 w-8 rounded-full bg-indigo-600/20 border border-indigo-600/40 flex items-center justify-center text-sm font-semibold text-indigo-400">
                {i + 1}
              </div>
              <div className="space-y-1">
                <p className="text-sm font-semibold text-zinc-100">{step}</p>
                <p className="text-sm text-zinc-400 leading-relaxed">{detail}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section className="mx-auto max-w-5xl px-6 py-16">
        <h2 className="text-xl font-semibold text-zinc-100 mb-8">Frequently asked questions</h2>
        <div className="space-y-6">
          {page.faq.map(({ q, a }) => (
            <div key={q} className="border-b border-zinc-800 pb-6 last:border-0">
              <p className="text-sm font-semibold text-zinc-200 mb-2">{q}</p>
              <p className="text-sm text-zinc-400 leading-relaxed">{a}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-5xl px-6 py-24 text-center space-y-5">
        <h2 className="text-3xl font-bold tracking-tight">{page.ctaHeading}</h2>
        <p className="text-zinc-300">{page.ctaBody}</p>
        <Link
          href="/signup"
          className="inline-block rounded-xl bg-indigo-600 px-8 py-3.5 text-sm font-semibold text-white hover:bg-indigo-500 transition-colors shadow-lg shadow-indigo-500/20"
        >
          Create your coaching page →
        </Link>
      </section>

      {/* Related pages */}
      {page.related.length > 0 && (
        <section className="mx-auto max-w-5xl px-6 pb-16">
          <p className="text-xs font-medium uppercase tracking-wider text-zinc-500 mb-4">Related</p>
          <div className="flex flex-wrap gap-3">
            {page.related.map(({ label, href }) => (
              <Link
                key={href}
                href={href}
                className="rounded-lg border border-zinc-800 px-4 py-2 text-sm text-zinc-400 hover:text-zinc-200 hover:border-zinc-600 transition-colors"
              >
                {label}
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Footer */}
      <footer className="border-t border-zinc-800 py-8">
        <div className="mx-auto max-w-5xl px-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-zinc-600">
          <span>© 2026 CallSesh by Landeros Systems</span>
          <div className="flex gap-4">
            <Link href="/privacy" className="hover:text-zinc-300 transition-colors">Privacy</Link>
            <Link href="/terms" className="hover:text-zinc-300 transition-colors">Terms</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
