import type { Metadata } from 'next'
import MarketingPage from '@/components/pseo/MarketingPage'
import { getPage } from '@/lib/pseo'

const page = getPage('/online-coaching-platform')!

export const metadata: Metadata = {
  title: page.title,
  description: page.description,
}

export default function OnlineCoachingPlatformPage() {
  return <MarketingPage page={page} />
}
