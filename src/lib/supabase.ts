import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || ''
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || ''

export const isSupabaseConfigured = (): boolean => {
  return Boolean(
    supabaseUrl &&
    supabaseAnonKey &&
    supabaseUrl.startsWith('https://') &&
    supabaseAnonKey.length > 20
  )
}

export const supabase = isSupabaseConfigured()
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null

/**
 * Returns the Supabase client or throws if not configured.
 * Use this in auth-critical paths to ensure we never silently
 * fall back to an insecure local mode.
 */
export function requireSupabase() {
  if (!supabase) {
    throw new Error('Supabase is not configured. Authentication requires a valid Supabase connection.')
  }
  return supabase
}
