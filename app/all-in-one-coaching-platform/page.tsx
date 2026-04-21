import type { Metadata } from 'next'
import MarketingPage from '@/components/pseo/MarketingPage'
import { getPage } from '@/lib/pseo'

const page = getPage('/all-in-one-coaching-platform')!

export const metadata: Metadata = {
  title: page.title,
  description: page.description,
}

export default function AllInOneCoachingPlatformPage() {
  return <MarketingPage page={page} />
}
