import Link from 'next/link'
import Image from 'next/image'

export default function MarketingNav() {
  return (
    <header className="sticky top-0 z-50 bg-zinc-50 backdrop-blur-sm border-b border-zinc-200">
      <div className="mx-auto max-w-5xl px-6 h-16 flex items-center justify-between">
        <Link href="/">
          <Image
            src="/images/CallSesh-Dark.png"
            alt="CallSesh"
            width={140}
            height={32}
            priority
            className="h-8 w-auto transition-transform hover:scale-105"
          />
        </Link>
        <nav className="hidden sm:flex items-center gap-8 text-sm text-zinc-700">
          <Link href="/#how-it-works" className="hover:text-zinc-900 transition-colors">Solutions</Link>
          <Link href="/#pricing" className="hover:text-zinc-900 transition-colors">Pricing</Link>
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
  )
}
