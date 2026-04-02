import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import MarketingPage from '@/components/pseo/MarketingPage'
import { getPage, getPagesByPrefix } from '@/lib/pseo'

export const dynamicParams = false

export function generateStaticParams() {
  return getPagesByPrefix('/alternatives/').map((p) => ({
    slug: p.path.replace('/alternatives/', ''),
  }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const page = getPage(`/alternatives/${slug}`)
  if (!page) return {}
  return { title: page.title, description: page.description }
}

export default async function AlternativePage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const page = getPage(`/alternatives/${slug}`)
  if (!page) notFound()
  return <MarketingPage page={page} />
}
