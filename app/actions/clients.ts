'use server'

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'

export async function saveClientNotes(formData: FormData): Promise<void> {
  const clientId = formData.get('client_id') as string
  const notes = ((formData.get('notes') as string) ?? '').trim()

  if (!clientId) throw new Error('Missing client_id.')

  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const { error } = await supabase
    .from('coach_clients')
    .update({ notes: notes || null })
    .eq('id', clientId)
    .eq('coach_id', user.id)

  if (error) throw new Error(`Failed to save client notes: ${error.message}`)
  revalidatePath(`/dashboard/clients/${clientId}`)
}
