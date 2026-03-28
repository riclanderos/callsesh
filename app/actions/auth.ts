'use server'

import { createClient } from '@/lib/supabase/server'
import { createServiceClient } from '@/lib/supabase/service'
import { redirect } from 'next/navigation'

export async function login(
  _prevState: string | null,
  formData: FormData
): Promise<string | null> {
  const email = formData.get('email') as string
  const password = formData.get('password') as string

  const supabase = await createClient()
  const { error } = await supabase.auth.signInWithPassword({ email, password })

  if (error) return error.message

  redirect('/dashboard')
}

export async function signup(
  _prevState: string | null,
  formData: FormData
): Promise<string | null> {
  const email = formData.get('email') as string
  const password = formData.get('password') as string

  const supabase = await createClient()
  const { data, error } = await supabase.auth.signUp({ email, password })

  if (error) return error.message

  // Atomically grant the launch offer if slots remain (cap = 10 coaches).
  // The DB function try_grant_launch_offer() serializes concurrent signups
  // at the row level, preventing more than 10 offers from being issued.
  // Non-fatal: a failure here does not block signup; the offer can be
  // granted manually via the service client if needed.
  if (data.user) {
    try {
      await createServiceClient().rpc('try_grant_launch_offer', {
        p_user_id: data.user.id,
      })
    } catch (e) {
      console.error('[signup] launch offer grant failed — coach may need manual grant:', e)
    }
  }

  redirect('/dashboard')
}

export async function logout() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  redirect('/login')
}
