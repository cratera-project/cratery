import { createClient, type SupabaseClient } from '@supabase/supabase-js'
import type { AvatarConfig } from './avatar'

const supabaseUrl = (import.meta.env.VITE_SUPABASE_URL as string | undefined)?.trim()
const supabaseAnonKey = (import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined)?.trim()


export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey)

const url = supabaseUrl || 'https://placeholder.supabase.co'
const key =
  supabaseAnonKey ||
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBsYWNlaG9sZGVyIiwicm9sZSI6ImFub24iLCJpYXQiOjE2NDUxOTI4MDAsImV4cCI6MTk2MDc2ODgwMH0.placeholder'

export const supabase: SupabaseClient = createClient(url, key, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
    detectSessionInUrl: false,
  },
})

export type Profile = {
  id: string
  username: string
  avatar?: AvatarConfig | null
  created_at: string
}
