import type { Metadata } from 'next'
import MarketingPage from '@/components/pseo/MarketingPage'
import { getPage } from '@/lib/pseo'

const page = getPage('/coaching-client-management-software')!

export const metadata: Metadata = {
  title: page.title,
  description: page.description,
}

export default function CoachingClientManagementSoftwarePage() {
  return <MarketingPage page={page} />
}
