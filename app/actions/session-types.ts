'use server'

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

function toSlug(title: string): string {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
}

export async function createSessionType(
  _prevState: string | null,
  formData: FormData
): Promise<string | null> {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const title = (formData.get('title') as string).trim()
  const description = (formData.get('description') as string | null)?.trim() ?? ''
  const durationRaw = formData.get('duration_minutes') as string
  const priceRaw = formData.get('price_dollars') as string
  const isActive = formData.get('is_active') === 'on'

  const durationMinutes = parseInt(durationRaw, 10)
  const priceDollars = parseFloat(priceRaw)

  if (!title) return 'Title is required.'
  if (isNaN(durationMinutes) || durationMinutes < 1)
    return 'Duration must be at least 1 minute.'
  if (isNaN(priceDollars) || priceDollars < 0) return 'Price must be 0 or more.'

  const priceCents = Math.round(priceDollars * 100)
  const baseSlug = toSlug(title)
  // Append a short random suffix so slugs stay unique even with duplicate titles
  const slug = `${baseSlug}-${Math.random().toString(36).slice(2, 7)}`

  const { error } = await supabase.from('session_types').insert({
    coach_id: user.id,
    title,
    description,
    duration_minutes: durationMinutes,
    price_cents: priceCents,
    slug,
    is_active: isActive,
  })

  if (error) return error.message

  redirect('/dashboard/session-types')
}
