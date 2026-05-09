import type { Metadata } from 'next'
import MarketingPage from '@/components/pseo/MarketingPage'
import { getPage } from '@/lib/pseo'

const page = getPage('/coaching-scheduling-software')!

export const metadata: Metadata = {
  title: page.title,
  description: page.description,
}

export default function CoachingSchedulingSoftwarePage() {
  return <MarketingPage page={page} />
}
