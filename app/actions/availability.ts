'use server'

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import { slotsToRanges } from '@/lib/availability'

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
    rule_kind: 'override',
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
    rule_kind:   'recurring',
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
  revalidatePath('/book/[slug]', 'page')
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
  revalidatePath('/book/[slug]', 'page')
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
  revalidatePath('/book/[slug]', 'page')
}

/**
 * Slot-picker save: replaces all recurring rules for one day with ranges derived
 * from the submitted slot selection. Passing zero slots clears the day entirely.
 */
export async function saveRecurringDay(
  _prevState: string | null,
  formData: FormData
): Promise<string | null> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const dayRaw = formData.get('day_of_week') as string
  const day = parseInt(dayRaw, 10)
  if (isNaN(day) || day < 0 || day > 6) return 'Invalid day.'

  const slots = formData.getAll('slots') as string[]
  const ranges = slotsToRanges(slots)

  // Delete existing recurring rules for this day, then insert the new ranges.
  const { error: delErr } = await supabase
    .from('availability_rules')
    .delete()
    .eq('coach_id', user.id)
    .eq('day_of_week', day)
    .eq('rule_kind', 'recurring')

  if (delErr) return delErr.message

  if (ranges.length > 0) {
    const rows = ranges.map((r) => ({
      coach_id:    user.id,
      day_of_week: day,
      start_time:  r.start_time,
      end_time:    r.end_time,
      is_active:   true,
      rule_kind:   'recurring',
    }))
    const { error: insErr } = await supabase.from('availability_rules').insert(rows)
    if (insErr) return insErr.message
  }

  revalidatePath('/dashboard/availability')
  revalidatePath('/book/[slug]', 'page')
  return null
}

export async function createBlockedTime(
  _prevState: string | null,
  formData: FormData
): Promise<string | null> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  // blocked_times.coach_id has a FK to public.profiles(id).
  // Ensure the profile row exists so the insert doesn't violate the FK when the
  // coach hasn't saved their timezone settings yet.
  const { error: profileError } = await supabase
    .from('profiles')
    .upsert({ id: user.id }, { onConflict: 'id', ignoreDuplicates: true })
  if (profileError) return profileError.message

  const breakType  = formData.get('break_type') as string
  const startTime  = (formData.get('start_time') as string ?? '').trim()
  const endTime    = (formData.get('end_time')   as string ?? '').trim()

  if (!startTime) return 'Start time is required.'
  if (!endTime)   return 'End time is required.'
  if (endTime <= startTime) return 'End time must be after start time.'

  if (breakType === 'recurring') {
    const days = formData.getAll('days').map((d) => parseInt(d as string, 10))
    if (days.length === 0) return 'Select at least one day.'
    if (days.some((d) => isNaN(d) || d < 0 || d > 6)) return 'Invalid day selected.'

    const rows = days.map((day) => ({
      coach_id:    user.id,
      day_of_week: day,
      start_time:  startTime,
      end_time:    endTime,
    }))
    const { error } = await supabase.from('blocked_times').insert(rows)
    if (error) return error.message
  } else {
    const specificDate = (formData.get('specific_date') as string ?? '').trim()
    if (!specificDate) return 'A date is required.'
    const { error } = await supabase.from('blocked_times').insert({
      coach_id:      user.id,
      specific_date: specificDate,
      start_time:    startTime,
      end_time:      endTime,
    })
    if (error) return error.message
  }

  redirect('/dashboard/availability')
}

export async function deleteBlockedTime(formData: FormData): Promise<void> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const id = formData.get('id') as string

  const { error } = await supabase
    .from('blocked_times')
    .delete()
    .eq('id', id)
    .eq('coach_id', user.id)

  if (error) throw new Error(error.message)
  revalidatePath('/dashboard/availability')
  revalidatePath('/book/[slug]', 'page')
}
