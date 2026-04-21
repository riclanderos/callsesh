import type { Metadata } from 'next'
import MarketingPage from '@/components/pseo/MarketingPage'
import { getPage } from '@/lib/pseo'

const page = getPage('/simple-coaching-booking-system')!

export const metadata: Metadata = {
  title: page.title,
  description: page.description,
}

export default function SimpleCoachingBookingSystemPage() {
  return <MarketingPage page={page} />
}
