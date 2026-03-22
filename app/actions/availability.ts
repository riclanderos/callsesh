'use server'

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

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
