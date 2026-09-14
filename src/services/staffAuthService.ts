import { supabase, isSupabaseConfigured } from '@/lib/supabase'

export type StaffRole = 'doctor' | 'receptionist' | 'admin'

export interface StaffUser {
  id: string
  username: string
  email: string
  fullName: string
  role: StaffRole
  assignedClinicId?: string | null
  assignedClinicName?: string | null
  phone?: string | null
  isActive: boolean
  createdAt: string
}

export interface StaffSession {
  userId: string
  username: string
  fullName: string
  role: StaffRole
  assignedClinicId?: string | null
  assignedClinicName?: string | null
  phone?: string | null
  loginTime: string
}

// ─── Constants ────────────────────────────────────────────────────────────────
const MAX_SESSION_HOURS = 8
const RATE_LIMIT_WINDOW_MS = 5 * 60 * 1000 // 5 minutes
const RATE_LIMIT_MAX_ATTEMPTS = 5
const RATE_LIMIT_COOLDOWN_MS = 60 * 1000 // 60 seconds lockout

// ─── Rate Limiter State (in-memory, per browser tab) ──────────────────────────
interface RateLimitState {
  attempts: { timestamp: number }[]
  lockedUntil: number | null
}

const rateLimitState: RateLimitState = {
  attempts: [],
  lockedUntil: null,
}

// ─── Password Validation ──────────────────────────────────────────────────────
export function validatePasswordStrength(password: string): { valid: boolean; error?: string } {
  if (!password || password.length < 8) {
    return { valid: false, error: 'Password must be at least 8 characters.' }
  }
  if (!/[a-z]/.test(password)) {
    return { valid: false, error: 'Password must contain at least one lowercase letter.' }
  }
  if (!/[A-Z]/.test(password)) {
    return { valid: false, error: 'Password must contain at least one uppercase letter.' }
  }
  if (!/[0-9]/.test(password)) {
    return { valid: false, error: 'Password must contain at least one digit.' }
  }
  return { valid: true }
}

// ─── Helpers ──────────────────────────────────────────────────────────────────
function requireSupabase() {
  if (!isSupabaseConfigured() || !supabase) {
    throw new Error('Database connection required. Supabase is not configured.')
  }
  return supabase
}

function checkRateLimit(): { allowed: boolean; retryAfterMs?: number } {
  const now = Date.now()

  // If currently locked out
  if (rateLimitState.lockedUntil && now < rateLimitState.lockedUntil) {
    return { allowed: false, retryAfterMs: rateLimitState.lockedUntil - now }
  }

  // Clear lockout if expired
  if (rateLimitState.lockedUntil && now >= rateLimitState.lockedUntil) {
    rateLimitState.lockedUntil = null
  }

  // Prune old attempts outside the window
  rateLimitState.attempts = rateLimitState.attempts.filter(
    (a) => now - a.timestamp < RATE_LIMIT_WINDOW_MS
  )

  return { allowed: true }
}

function recordFailedAttempt(): { locked: boolean; retryAfterMs?: number } {
  const now = Date.now()
  rateLimitState.attempts.push({ timestamp: now })

  // Prune old attempts
  rateLimitState.attempts = rateLimitState.attempts.filter(
    (a) => now - a.timestamp < RATE_LIMIT_WINDOW_MS
  )

  if (rateLimitState.attempts.length >= RATE_LIMIT_MAX_ATTEMPTS) {
    rateLimitState.lockedUntil = now + RATE_LIMIT_COOLDOWN_MS
    rateLimitState.attempts = [] // Reset counter after locking
    return { locked: true, retryAfterMs: RATE_LIMIT_COOLDOWN_MS }
  }

  return { locked: false }
}

function clearRateLimit() {
  rateLimitState.attempts = []
  rateLimitState.lockedUntil = null
}

// ─── Service ──────────────────────────────────────────────────────────────────
export const staffAuthService = {
  /**
   * Get the current authenticated session.
   * Reads from Supabase JWT — NOT from sessionStorage.
   * Enforces an 8-hour maximum session lifetime.
   */
  async getSession(): Promise<StaffSession | null> {
    try {
      const sb = requireSupabase()
      const { data: { session: supaSession } } = await sb.auth.getSession()

      if (!supaSession?.user) return null

      // Enforce max session lifetime (8 hours)
      const loginTime = supaSession.user.last_sign_in_at
      if (loginTime) {
        const elapsed = Date.now() - new Date(loginTime).getTime()
        if (elapsed > MAX_SESSION_HOURS * 60 * 60 * 1000) {
          await sb.auth.signOut()
          return null
        }
      }

      // Fetch the user profile from user_profiles using the JWT's user ID
      const { data: profile, error } = await sb
        .from('user_profiles')
        .select('id, username, email, full_name, role, assigned_clinic_id, phone, is_active')
        .eq('id', supaSession.user.id)
        .maybeSingle()

      if (error || !profile) return null

      if (!profile.is_active) {
        await sb.auth.signOut()
        return null
      }

      // Fetch clinic name separately (only if assigned)
      let assignedClinicName: string | null = null
      if (profile.assigned_clinic_id) {
        const { data: clinic } = await sb
          .from('clinics')
          .select('name')
          .eq('id', profile.assigned_clinic_id)
          .maybeSingle()
        assignedClinicName = clinic?.name || null
      }

      return {
        userId: profile.id,
        username: profile.username,
        fullName: profile.full_name,
        role: profile.role as StaffRole,
        assignedClinicId: profile.assigned_clinic_id || null,
        assignedClinicName,
        phone: profile.phone || null,
        loginTime: loginTime || new Date().toISOString(),
      }
    } catch {
      return null
    }
  },

  /**
   * Login with Username and Password.
   * Supabase-only — no local fallbacks, no hardcoded credentials.
   */
  async login(
    usernameInput: string,
    passwordInput: string
  ): Promise<{ success: boolean; session?: StaffSession; error?: string }> {
    const username = usernameInput.trim().toLowerCase()
    const password = passwordInput.trim()

    if (!username || !password) {
      return { success: false, error: 'Please enter both username and password.' }
    }

    // Rate limit check
    const rateCheck = checkRateLimit()
    if (!rateCheck.allowed) {
      const seconds = Math.ceil((rateCheck.retryAfterMs || 0) / 1000)
      return {
        success: false,
        error: `Too many failed attempts. Please try again in ${seconds} seconds.`,
      }
    }

    try {
      const sb = requireSupabase()

      // Single path: synthesize email and sign in with Supabase Auth
      const email = `${username}@orthobud.internal`
      const { error: authErr } = await sb.auth.signInWithPassword({
        email,
        password,
      })

      if (authErr) {
        const lockResult = recordFailedAttempt()
        if (lockResult.locked) {
          return {
            success: false,
            error: 'Too many failed attempts. Account locked for 60 seconds.',
          }
        }
        return { success: false, error: 'Invalid credentials.' }
      }

      // Auth succeeded — fetch the user profile (plain query, no join, to avoid PostgREST FK issues)
      const { data: { user } } = await sb.auth.getUser()
      if (!user) {
        return { success: false, error: 'Authentication error. Please try again.' }
      }

      const { data: profile, error: profileErr } = await sb
        .from('user_profiles')
        .select('id, username, email, full_name, role, assigned_clinic_id, phone, is_active')
        .eq('id', user.id)
        .maybeSingle()

      if (profileErr) {
        console.error('[staffAuthService] Profile fetch error:', profileErr)
        await sb.auth.signOut()
        return { success: false, error: `Profile query failed: ${profileErr.message}` }
      }

      if (!profile) {
        console.error('[staffAuthService] Profile not found for user ID:', user.id)
        await sb.auth.signOut()
        return { success: false, error: 'User profile not found. Contact administrator.' }
      }

      if (!profile.is_active) {
        await sb.auth.signOut()
        return { success: false, error: 'Account is deactivated. Please contact Administrator.' }
      }

      // Fetch clinic name separately (only if assigned)
      let assignedClinicName: string | null = null
      if (profile.assigned_clinic_id) {
        const { data: clinic } = await sb
          .from('clinics')
          .select('name')
          .eq('id', profile.assigned_clinic_id)
          .maybeSingle()
        assignedClinicName = clinic?.name || null
      }

      // Clear rate limiter on success
      clearRateLimit()

      const session: StaffSession = {
        userId: profile.id,
        username: profile.username,
        fullName: profile.full_name,
        role: profile.role as StaffRole,
        assignedClinicId: profile.assigned_clinic_id || null,
        assignedClinicName,
        phone: profile.phone || null,
        loginTime: new Date().toISOString(),
      }

      return { success: true, session }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'An unexpected error occurred.'
      return { success: false, error: message }
    }
  },

  /**
   * Sign out — clears Supabase session.
   */
  async logout(): Promise<void> {
    try {
      const sb = requireSupabase()
      await sb.auth.signOut()
    } catch (err) {
      console.error('Logout error:', err)
    }
  },

  /**
   * Get the current rate limit status (for UI feedback).
   */
  getRateLimitStatus(): { isLocked: boolean; retryAfterMs: number } {
    const now = Date.now()
    if (rateLimitState.lockedUntil && now < rateLimitState.lockedUntil) {
      return { isLocked: true, retryAfterMs: rateLimitState.lockedUntil - now }
    }
    return { isLocked: false, retryAfterMs: 0 }
  },

  /**
   * Fetch all staff members (Admin view).
   * Requires Supabase — no local fallback.
   */
  async getStaffUsers(): Promise<StaffUser[]> {
    const sb = requireSupabase()
    
    // 1. Fetch user profiles directly (plain query with no embedded join so NULL assigned_clinic_id is never filtered out)
    const { data, error } = await sb
      .from('user_profiles')
      .select('id, username, email, full_name, role, assigned_clinic_id, phone, is_active, created_at')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Failed to fetch staff from Supabase:', error)
      return []
    }

    // 2. Fetch clinics to map branch names
    const { data: clinicsData } = await sb
      .from('clinics')
      .select('id, name')

    const clinicMap = new Map((clinicsData || []).map((c: any) => [c.id, c.name]))

    return (data || []).map((item: any) => ({
      id: item.id,
      username: item.username,
      email: item.email,
      fullName: item.full_name,
      role: item.role as StaffRole,
      assignedClinicId: item.assigned_clinic_id,
      assignedClinicName: item.assigned_clinic_id ? clinicMap.get(item.assigned_clinic_id) || null : null,
      phone: item.phone,
      isActive: item.is_active,
      createdAt: item.created_at,
    }))
  },

  /**
   * Create a new Staff User (Admin action).
   * Calls Supabase RPC — no local fallback.
   */
  async createStaffUser(params: {
    username: string
    password: string
    fullName: string
    role: StaffRole
    email?: string | null
    clinicId?: string | null
    clinicName?: string | null
    phone?: string | null
  }): Promise<{ success: boolean; user?: StaffUser; error?: string }> {
    const cleanUsername = params.username.trim().toLowerCase()
    if (!cleanUsername || cleanUsername.length < 3) {
      return { success: false, error: 'Username must be at least 3 characters.' }
    }

    const pwCheck = validatePasswordStrength(params.password)
    if (!pwCheck.valid) {
      return { success: false, error: pwCheck.error }
    }

    if (!params.fullName.trim()) {
      return { success: false, error: 'Full Name is required.' }
    }
    if (params.role === 'receptionist' && !params.clinicId) {
      return { success: false, error: 'A clinic branch must be assigned for receptionists.' }
    }

    const sb = requireSupabase()
    let res = await sb.rpc('admin_create_staff_user', {
      p_username: cleanUsername,
      p_password: params.password,
      p_full_name: params.fullName.trim(),
      p_role: params.role,
      p_clinic_id: params.clinicId || null,
      p_phone: params.phone?.trim() || null,
      p_email: params.email?.trim() || null,
    })

    // Fallback: If live Supabase database still has the 6-arg version (without p_email), retry seamlessly
    if (res.error && res.error.message.includes('schema cache')) {
      res = await sb.rpc('admin_create_staff_user', {
        p_username: cleanUsername,
        p_password: params.password,
        p_full_name: params.fullName.trim(),
        p_role: params.role,
        p_clinic_id: params.clinicId || null,
        p_phone: params.phone?.trim() || null,
      })
    }

    const { data, error } = res

    if (error) {
      return { success: false, error: error.message }
    }
    if (data && !data.success) {
      return { success: false, error: data.error }
    }

    const newUser: StaffUser = {
      id: data.user_id,
      username: cleanUsername,
      email: data.email,
      fullName: params.fullName.trim(),
      role: params.role,
      assignedClinicId: params.clinicId || null,
      assignedClinicName: params.clinicName || null,
      phone: params.phone?.trim() || null,
      isActive: true,
      createdAt: new Date().toISOString(),
    }

    return { success: true, user: newUser }
  },

  /**
   * Reset staff password (Admin action).
   * Requires Supabase — no local fallback.
   */
  async resetStaffPassword(
    userId: string,
    newPassword: string
  ): Promise<{ success: boolean; error?: string }> {
    const pwCheck = validatePasswordStrength(newPassword)
    if (!pwCheck.valid) {
      return { success: false, error: pwCheck.error }
    }

    const sb = requireSupabase()
    const { data, error } = await sb.rpc('admin_reset_staff_password', {
      p_user_id: userId,
      p_new_password: newPassword,
    })

    if (error) return { success: false, error: error.message }
    if (data && !data.success) return { success: false, error: data.error }
    return { success: true }
  },

  /**
   * Toggle active status of a staff member.
   * Requires Supabase — no local fallback.
   */
  async toggleStaffStatus(
    userId: string,
    isActive: boolean
  ): Promise<{ success: boolean; error?: string }> {
    const sb = requireSupabase()
    const { data, error } = await sb.rpc('admin_toggle_staff_active', {
      p_user_id: userId,
      p_is_active: isActive,
    })

    if (error) return { success: false, error: error.message }
    if (data && !data.success) return { success: false, error: data.error }
    return { success: true }
  },

  /**
   * Permanently delete a staff member (Admin action).
   * Calls Supabase RPC — no local fallback.
   */
  async deleteStaffUser(
    userId: string
  ): Promise<{ success: boolean; error?: string }> {
    const sb = requireSupabase()
    const { data, error } = await sb.rpc('admin_delete_staff_user', {
      p_user_id: userId,
    })

    if (error) return { success: false, error: error.message }
    if (data && !data.success) return { success: false, error: data.error }
    return { success: true }
  },
}
