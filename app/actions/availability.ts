'use server'

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'

export async function createAvailabilityRule(
  _prevState: string | null,
  formData: FormData
): Promise<string | null> {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const dayRaw = formData.get('day_of_week') as string
  const startTime = (formData.get('start_time') as string).trim()
  const endTime = (formData.get('end_time') as string).trim()
  const isActive = formData.get('is_active') === 'on'

  const dayOfWeek = parseInt(dayRaw, 10)

  if (isNaN(dayOfWeek) || dayOfWeek < 0 || dayOfWeek > 6)
    return 'Please select a valid day of the week.'
  if (!startTime) return 'Start time is required.'
  if (!endTime) return 'End time is required.'
  if (endTime <= startTime) return 'End time must be after start time.'

  const { error } = await supabase.from('availability_rules').insert({
    coach_id: user.id,
    day_of_week: dayOfWeek,
    start_time: startTime,
    end_time: endTime,
    is_active: isActive,
  })

  if (error) return error.message

  redirect('/dashboard/availability')
}

export async function createBulkAvailabilityRules(
  _prevState: string | null,
  formData: FormData
): Promise<string | null> {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const days = formData.getAll('days').map((d) => parseInt(d as string, 10))
  const startTime = (formData.get('start_time') as string ?? '').trim()
  const endTime   = (formData.get('end_time')   as string ?? '').trim()

  if (days.length === 0) return 'Select at least one day.'
  if (days.some((d) => isNaN(d) || d < 0 || d > 6)) return 'Invalid day selected.'
  if (!startTime) return 'Start time is required.'
  if (!endTime)   return 'End time is required.'
  if (endTime <= startTime) return 'End time must be after start time.'

  const rows = days.map((day) => ({
    coach_id:    user.id,
    day_of_week: day,
    start_time:  startTime,
    end_time:    endTime,
    is_active:   true,
  }))

  const { error } = await supabase.from('availability_rules').insert(rows)

  if (error) return error.message

  redirect('/dashboard/availability')
}

export async function updateAvailabilityRule(formData: FormData): Promise<void> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const id         = formData.get('id') as string
  const start_time = (formData.get('start_time') as string).trim()
  const end_time   = (formData.get('end_time')   as string).trim()

  if (!id || !start_time || !end_time) throw new Error('All fields are required.')
  if (end_time <= start_time) throw new Error('End time must be after start time.')

  const { error } = await supabase
    .from('availability_rules')
    .update({ start_time, end_time })
    .eq('id', id)
    .eq('coach_id', user.id)

  if (error) throw new Error(error.message)
  revalidatePath('/dashboard/availability')
}

export async function toggleAvailabilityRule(formData: FormData): Promise<void> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const id        = formData.get('id') as string
  const is_active = formData.get('is_active') === 'true'

  const { error } = await supabase
    .from('availability_rules')
    .update({ is_active: !is_active })
    .eq('id', id)
    .eq('coach_id', user.id)

  if (error) throw new Error(error.message)
  revalidatePath('/dashboard/availability')
}

export async function deleteAvailabilityRule(formData: FormData): Promise<void> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const id = formData.get('id') as string

  const { error } = await supabase
    .from('availability_rules')
    .delete()
    .eq('id', id)
    .eq('coach_id', user.id)

  if (error) throw new Error(error.message)
  revalidatePath('/dashboard/availability')
}
