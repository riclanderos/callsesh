import type { Metadata } from 'next'
import MarketingPage from '@/components/pseo/MarketingPage'
import { getPage } from '@/lib/pseo'

const page = getPage('/tools-for-coaching-business')!

export const metadata: Metadata = {
  title: page.title,
  description: page.description,
}

export default function ToolsForCoachingBusinessPage() {
  return <MarketingPage page={page} />
}
