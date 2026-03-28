'use client'

import Image from 'next/image'
import { Fragment, useEffect, useState } from 'react'

const steps = [
  {
    src: '/images/availability.png',
    alt: 'Weekly schedule with time slots selected',
    label: 'Set your availability',
    // Focus upper portion — the day/time grid
    objectPosition: 'center 15%',
    featured: false,
  },
  {
    src: '/images/coachingSetup.png',
    alt: 'Booking page with time selected and CTA button',
    label: 'Clients book instantly',
    // Focus lower portion — selected slot + Book Session button
    objectPosition: 'center 72%',
    featured: true,
  },
  {
    src: '/images/payment.png',
    alt: 'Payment confirmation with session earnings',
    label: 'Get paid automatically',
    objectPosition: 'center center',
    featured: false,
  },
]

export default function HeroWorkflow() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    const id = setTimeout(() => setMounted(true), 40)
    return () => clearTimeout(id)
  }, [])

  return (
    <div className="mx-auto w-full max-w-5xl">
      <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-0">
        {steps.map((step, i) => (
          <Fragment key={step.label}>
            {/* ── Card ── */}
            <div
              className={[
                'flex-1 group rounded-2xl overflow-hidden bg-zinc-900',
                'transition-all duration-300 ease-out',
                'hover:-translate-y-1',
                step.featured
                  ? [
                      'border border-indigo-700/60',
                      'ring-1 ring-indigo-500/30',
                      'shadow-[0_0_40px_rgba(99,102,241,0.25)]',
                      'sm:scale-[1.06] sm:z-10',
                    ].join(' ')
                  : 'border border-zinc-800 shadow-md shadow-black/40',
                mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3',
              ].join(' ')}
              style={{
                transitionDelay: mounted ? `${i * 110}ms` : '0ms',
              }}
            >
              {/* Image crop — 16:10 window into the UI screenshot */}
              <div className="relative overflow-hidden" style={{ aspectRatio: '16 / 10' }}>
                <Image
                  src={step.src}
                  alt={step.alt}
                  fill
                  className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.03]"
                  style={{ objectPosition: step.objectPosition }}
                  sizes="(max-width: 640px) 100vw, 33vw"
                />
              </div>

              {/* Label */}
              <div className="px-4 py-3 text-center border-t border-zinc-800/70">
                <p className="text-sm font-semibold text-zinc-200 tracking-tight">
                  {step.label}
                </p>
              </div>
            </div>

            {/* ── Connector arrow between cards (desktop only) ── */}
            {i < steps.length - 1 && (
              <div className="hidden sm:flex items-center justify-center flex-shrink-0 px-2">
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 18 18"
                  fill="none"
                  className="text-zinc-700"
                >
                  <path
                    d="M3 9h12M11 5l4 4-4 4"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
            )}
          </Fragment>
        ))}
      </div>
    </div>
  )
}
