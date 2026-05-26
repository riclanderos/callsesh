'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'

const navItems = [
  {
    label: 'Dashboard',
    href: '/dashboard',
    icon: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="1.5" y="1.5" width="5" height="5" rx="1" />
        <rect x="9.5" y="1.5" width="5" height="5" rx="1" />
        <rect x="1.5" y="9.5" width="5" height="5" rx="1" />
        <rect x="9.5" y="9.5" width="5" height="5" rx="1" />
      </svg>
    ),
  },
  {
    label: 'Bookings',
    href: '/dashboard/bookings',
    icon: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="1.5" y="2.5" width="13" height="11" rx="1.5" />
        <path d="M5 1.5v2M11 1.5v2M1.5 6.5h13" />
      </svg>
    ),
  },
  {
    label: 'Clients',
    href: '/dashboard/clients',
    icon: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="6" cy="5" r="2.5" />
        <path d="M1.5 14c0-2.5 2-4.5 4.5-4.5s4.5 2 4.5 4.5" />
        <path d="M11.5 7.5c1.4.3 2.5 1.6 2.5 3v2" />
        <circle cx="11.5" cy="4.5" r="2" />
      </svg>
    ),
  },
  {
    label: 'Session Types',
    href: '/dashboard/session-types',
    icon: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M1.5 5.5l6.5-4 6.5 4-6.5 4-6.5-4z" />
        <path d="M1.5 9.5l6.5 4 6.5-4" />
      </svg>
    ),
  },
  {
    label: 'Availability',
    href: '/dashboard/availability',
    icon: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="8" cy="8" r="6.5" />
        <path d="M8 4.5V8l2.5 1.5" />
      </svg>
    ),
  },
  {
    label: 'Settings',
    href: '/dashboard/settings',
    icon: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="8" cy="8" r="2" />
        <path d="M8 1v1.5M8 13.5V15M1 8h1.5M13.5 8H15M2.9 2.9l1.1 1.1M12 12l1.1 1.1M2.9 13.1L4 12M12 4l1.1-1.1" />
      </svg>
    ),
  },
]

const quickLinks = [
  {
    label: 'Session Types',
    href: '/dashboard/session-types',
    icon: (
      <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 2H2a1 1 0 00-1 1v7a1 1 0 001 1h7a1 1 0 001-1V8" />
        <path d="M7.5 1h3.5v3.5M11 1L6 6" />
      </svg>
    ),
  },
  {
    label: 'Availability',
    href: '/dashboard/availability',
    icon: (
      <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 2H2a1 1 0 00-1 1v7a1 1 0 001 1h7a1 1 0 001-1V8" />
        <path d="M7.5 1h3.5v3.5M11 1L6 6" />
      </svg>
    ),
  },
]

export default function SidebarNav() {
  const pathname = usePathname()

  return (
    <aside className="fixed left-0 top-0 bottom-0 w-56 bg-zinc-950 border-r border-zinc-800 flex flex-col z-40 hidden lg:flex">
      {/* Logo */}
      <div className="px-5 py-5 border-b border-zinc-800/70 flex-shrink-0">
        <Image
          src="/images/CallSesh.svg"
          alt="CallSesh"
          width={120}
          height={27}
          priority
          className="h-7 w-auto"
        />
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
        <p className="text-[10px] font-semibold uppercase tracking-wider text-zinc-600 px-3 mb-2">
          Menu
        </p>
        {navItems.map((item) => {
          const isActive =
            item.href === '/dashboard'
              ? pathname === '/dashboard'
              : pathname.startsWith(item.href)
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm transition-colors ${
                isActive
                  ? 'bg-zinc-800 text-zinc-100 font-medium'
                  : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50'
              }`}
            >
              <span className="flex-shrink-0">{item.icon}</span>
              {item.label}
            </Link>
          )
        })}
      </nav>

      {/* Quick links */}
      <div className="px-3 pb-4 border-t border-zinc-800/70 pt-3 flex-shrink-0">
        <p className="text-[10px] font-semibold uppercase tracking-wider text-zinc-600 px-3 mb-2">
          Quick links
        </p>
        {quickLinks.map((link) => (
          <Link
            key={link.label}
            href={link.href}
            className="flex items-center justify-between gap-2 rounded-lg px-3 py-2 text-sm text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800/50 transition-colors"
          >
            <span>{link.label}</span>
            <span className="flex-shrink-0">{link.icon}</span>
          </Link>
        ))}
      </div>
    </aside>
  )
}
