import Link from 'next/link'
import type { PseoPage } from '@/lib/pseo'
import MarketingNav from '@/components/marketing/MarketingNav'
import MarketingFooter from '@/components/marketing/MarketingFooter'

export default function MarketingPage({ page }: { page: PseoPage }) {
  const faqSchema =
    page.faq.length > 0
      ? {
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: page.faq.map(({ q, a }) => ({
            "@type": "Question",
            name: q,
            acceptedAnswer: { "@type": "Answer", text: a },
          })),
        }
      : null

  return (
    <div className="min-h-screen bg-white text-zinc-900">
      {faqSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
      )}

      <MarketingNav />

      {/* Hero */}
      <section className="mx-auto max-w-3xl px-6 pt-16 pb-20 text-center space-y-5">
        <h1 className="text-4xl sm:text-5xl font-bold tracking-tight leading-tight text-zinc-900">{page.h1}</h1>
        <p className="text-lg text-zinc-700 leading-relaxed">{page.intro}</p>
        {page.contextualNote && (
          <p className="text-sm text-zinc-600 leading-relaxed">
            {page.contextualNote.prefix}
            <Link href={page.contextualNote.href} className="text-zinc-700 underline underline-offset-2 hover:text-zinc-900 transition-colors">
              {page.contextualNote.linkText}
            </Link>
            {page.contextualNote.suffix}
          </p>
        )}
        <div className="pt-2">
          <Link
            href="/signup"
            className="inline-block rounded-lg bg-zinc-900 px-8 py-3.5 text-sm font-semibold text-white hover:bg-zinc-800 transition-colors shadow-sm"
          >
            Create your booking page
          </Link>
          <p className="text-xs text-zinc-500 mt-3">No credit card required · First 10 sessions free</p>
        </div>
      </section>

      {/* Who it's for */}
      <section className="mx-auto max-w-5xl px-6 py-16">
        <h2 className="text-xl font-semibold text-zinc-900 mb-6">Who this is for</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {page.forWho.map((item) => (
            <div key={item} className="flex items-start gap-3 rounded-xl border border-zinc-200 bg-white px-5 py-4 shadow-sm">
              <span className="mt-0.5 h-4 w-4 flex-shrink-0 rounded-full bg-zinc-200" aria-hidden="true" />
              <p className="text-sm text-zinc-700">{item}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Problem */}
      <section className="mx-auto max-w-5xl px-6 py-16">
        <div className="rounded-xl border border-zinc-200 bg-zinc-50 px-8 py-10 space-y-5">
          <h2 className="text-xl font-semibold text-zinc-900">{page.problem.heading}</h2>
          <ul className="space-y-4">
            {page.problem.points.map((point) => (
              <li key={point} className="flex items-start gap-3 text-sm text-zinc-700 leading-relaxed">
                <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-zinc-400" aria-hidden="true" />
                {point}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Solution */}
      <section className="mx-auto max-w-5xl px-6 py-16">
        <div className="rounded-xl border border-zinc-200 bg-white px-8 py-10 space-y-5 shadow-sm">
          <h2 className="text-xl font-semibold text-zinc-900">{page.solution.heading}</h2>
          <ul className="space-y-4">
            {page.solution.points.map((point) => (
              <li key={point} className="flex items-start gap-3 text-sm text-zinc-700 leading-relaxed">
                <svg className="mt-0.5 h-4 w-4 flex-shrink-0 text-zinc-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5} aria-hidden="true">
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
        <section className="bg-zinc-50 border-y border-zinc-100">
          <div className="mx-auto max-w-5xl px-6 py-16 space-y-6">
            <h2 className="text-xl font-semibold text-zinc-900">
              CallSesh vs. {page.comparison.theyLabel}
            </h2>
            <div className="rounded-xl border border-zinc-200 overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-zinc-200 bg-white">
                    <th className="px-6 py-3 text-left font-medium text-zinc-500 w-1/3">Feature</th>
                    <th className="px-6 py-3 text-left font-medium text-zinc-500 w-1/3">{page.comparison.theyLabel}</th>
                    <th className="px-6 py-3 text-left font-semibold text-zinc-900 w-1/3">CallSesh</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-zinc-100">
                  {page.comparison.rows.map((row) => (
                    <tr key={row.feature}>
                      <td className="px-6 py-4 text-zinc-700 font-medium">{row.feature}</td>
                      <td className="px-6 py-4 text-zinc-500">{row.them}</td>
                      <td className="px-6 py-4 text-zinc-900 font-medium">{row.us}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      )}

      {/* Workflow */}
      <section className="mx-auto max-w-5xl px-6 py-16">
        <h2 className="text-xl font-semibold text-zinc-900 mb-8">How it works</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {page.workflow.map(({ step, detail }, i) => (
            <div key={step} className="flex gap-4">
              <div className="flex-shrink-0 h-8 w-8 rounded-full bg-zinc-100 border border-zinc-200 flex items-center justify-center text-sm font-semibold text-zinc-700">
                {i + 1}
              </div>
              <div className="space-y-1">
                <p className="text-sm font-semibold text-zinc-900">{step}</p>
                <p className="text-sm text-zinc-700 leading-relaxed">{detail}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section className="mx-auto max-w-5xl px-6 py-16">
        <h2 className="text-xl font-semibold text-zinc-900 mb-8">Frequently asked questions</h2>
        <div className="space-y-6">
          {page.faq.map(({ q, a }) => (
            <div key={q} className="border-b border-zinc-100 pb-6 last:border-0">
              <p className="text-sm font-semibold text-zinc-900 mb-2">{q}</p>
              <p className="text-sm text-zinc-700 leading-relaxed">{a}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="bg-zinc-50 border-y border-zinc-100">
        <div className="mx-auto max-w-3xl px-6 py-24 text-center space-y-5">
          <h2 className="text-3xl font-bold tracking-tight text-zinc-900">{page.ctaHeading}</h2>
          <p className="text-zinc-700">{page.ctaBody}</p>
          <Link
            href="/signup"
            className="inline-block rounded-lg bg-zinc-900 px-8 py-3.5 text-sm font-semibold text-white hover:bg-zinc-800 transition-colors shadow-sm"
          >
            Create your coaching page →
          </Link>
        </div>
      </section>

      {/* Related pages */}
      {page.related.length > 0 && (
        <section className="mx-auto max-w-5xl px-6 py-16">
          <p className="text-xs font-semibold uppercase tracking-widest text-zinc-500 mb-4">Related</p>
          <div className="flex flex-wrap gap-3">
            {page.related.map(({ label, href }) => (
              <Link
                key={href}
                href={href}
                className="rounded-lg border border-zinc-200 px-4 py-2 text-sm text-zinc-600 hover:text-zinc-900 hover:border-zinc-400 transition-colors"
              >
                {label}
              </Link>
            ))}
          </div>
        </section>
      )}

      <MarketingFooter />
    </div>
  )
}
