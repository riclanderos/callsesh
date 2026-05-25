'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'

const navItems = [
  { label: 'Dashboard',     href: '/dashboard' },
  { label: 'Bookings',      href: '/dashboard/bookings' },
  { label: 'Clients',       href: '/dashboard/clients' },
  { label: 'Session Types', href: '/dashboard/session-types' },
  { label: 'Availability',  href: '/dashboard/availability' },
  { label: 'Settings',      href: '/dashboard/settings' },
]

export default function SidebarNav() {
  const pathname = usePathname()

  return (
    <aside className="fixed left-0 top-0 bottom-0 w-56 bg-zinc-950 border-r border-zinc-800 flex flex-col z-40 hidden lg:flex">
      {/* Logo */}
      <div className="px-5 py-5 border-b border-zinc-800/70 flex-shrink-0">
        <Image
          src="/images/CallSesh-Dark.png"
          alt="CallSesh"
          width={120}
          height={28}
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
              className={`flex items-center rounded-lg px-3 py-2 text-sm transition-colors ${
                isActive
                  ? 'bg-zinc-800 text-zinc-100 font-medium'
                  : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50'
              }`}
            >
              {item.label}
            </Link>
          )
        })}
      </nav>
    </aside>
  )
}
