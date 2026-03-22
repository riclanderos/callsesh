'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function updateTimezone(
  _prevState: string | null,
  formData: FormData
): Promise<string | null> {
  const timezone = (formData.get('timezone') as string).trim()
  if (!timezone) return 'Timezone is required.'

  // Validate it is a real IANA timezone name.
  try {
    Intl.DateTimeFormat(undefined, { timeZone: timezone })
  } catch {
    return `"${timezone}" is not a valid IANA timezone.`
  }

  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const { error } = await supabase.from('profiles').upsert(
    { id: user.id, timezone, updated_at: new Date().toISOString() },
    { onConflict: 'id' }
  )

  if (error) return error.message

  revalidatePath('/dashboard/settings')
  return null
}
