'use server'

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'

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
  if (isNaN(durationMinutes) || durationMinutes < 15)
    return 'Duration must be at least 15 minutes.'
  if (durationMinutes > 180)
    return 'Duration cannot exceed 180 minutes.'
  if (durationMinutes % 15 !== 0)
    return 'Duration must be a multiple of 15 minutes.'
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

export async function deleteSessionType(
  _prevState: string | null,
  formData: FormData
): Promise<string | null> {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const id = (formData.get('id') as string ?? '').trim()
  if (!id) return 'Invalid session type.'

  // Verify ownership — only the owning coach can delete.
  const { data: sessionType } = await supabase
    .from('session_types')
    .select('id')
    .eq('id', id)
    .eq('coach_id', user.id)
    .single()

  if (!sessionType) return 'Session type not found.'

  // Check for future confirmed bookings.
  const today = new Date().toISOString().split('T')[0]
  const { count } = await supabase
    .from('bookings')
    .select('id', { count: 'exact', head: true })
    .eq('session_type_id', id)
    .eq('status', 'confirmed')
    .gte('booking_date', today)

  if (count && count > 0) {
    // Cannot hard-delete — deactivate instead so existing bookings are unaffected.
    await supabase
      .from('session_types')
      .update({ is_active: false })
      .eq('id', id)
      .eq('coach_id', user.id)
    revalidatePath('/dashboard/session-types')
    return `This session type has ${count} upcoming booking${count === 1 ? '' : 's'} and cannot be deleted. It has been deactivated instead.`
  }

  // Safe to hard-delete.
  const { error } = await supabase
    .from('session_types')
    .delete()
    .eq('id', id)
    .eq('coach_id', user.id)

  if (error) return error.message

  redirect('/dashboard/session-types')
}
