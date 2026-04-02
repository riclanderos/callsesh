import type { Metadata } from 'next'
import MarketingPage from '@/components/pseo/MarketingPage'
import { getPage } from '@/lib/pseo'

const page = getPage('/coach-payment-processing')!

export const metadata: Metadata = {
  title: page.title,
  description: page.description,
}

export default function CoachPaymentProcessingPage() {
  return <MarketingPage page={page} />
}
