import { useState, useEffect, useCallback } from 'react'
import { Link } from 'react-router-dom'
import {
  Lock,
  User,
  Eye,
  EyeOff,
  AlertCircle,
  Loader2,
  Globe,
  ArrowRight,
  Timer,
} from 'lucide-react'
import { staffAuthService, StaffSession } from '@/services/staffAuthService'

interface AdminLoginProps {
  onLoginSuccess: (session: StaffSession) => void
}

export default function AdminLogin({ onLoginSuccess }: AdminLoginProps) {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [capsLockActive, setCapsLockActive] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Rate limit cooldown timer
  const [cooldownSeconds, setCooldownSeconds] = useState(0)

  // Poll rate limit status for countdown display
  useEffect(() => {
    if (cooldownSeconds <= 0) return
    const timer = setInterval(() => {
      const status = staffAuthService.getRateLimitStatus()
      if (!status.isLocked) {
        setCooldownSeconds(0)
      } else {
        setCooldownSeconds(Math.ceil(status.retryAfterMs / 1000))
      }
    }, 1000)
    return () => clearInterval(timer)
  }, [cooldownSeconds])

  // Listen for Caps Lock
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.getModifierState) {
        setCapsLockActive(e.getModifierState('CapsLock'))
      }
    }
    window.addEventListener('keydown', handleKey)
    window.addEventListener('keyup', handleKey)
    return () => {
      window.removeEventListener('keydown', handleKey)
      window.removeEventListener('keyup', handleKey)
    }
  }, [])

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      const res = await staffAuthService.login(username, password)
      if (res.success && res.session) {
        onLoginSuccess(res.session)
      } else {
        setError(res.error || 'Authentication failed. Please check your credentials.')
        // Check if rate limiter kicked in
        const status = staffAuthService.getRateLimitStatus()
        if (status.isLocked) {
          setCooldownSeconds(Math.ceil(status.retryAfterMs / 1000))
        }
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'An unexpected error occurred during login.'
      setError(message)
    } finally {
      setLoading(false)
    }
  }, [username, password, onLoginSuccess])

  const isLocked = cooldownSeconds > 0

  return (
    <div className="min-h-screen bg-[#070e1c] text-white flex flex-col justify-between relative overflow-hidden font-sans">
      {/* Dynamic Background Accents */}
      <div className="absolute -top-40 -left-40 w-96 h-96 rounded-full bg-teal/15 blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 -right-40 w-[500px] h-[500px] rounded-full bg-sky-500/10 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 left-1/3 w-96 h-96 rounded-full bg-indigo-500/10 blur-3xl pointer-events-none" />

      {/* Top Bar */}
      <header className="px-6 py-5 relative z-10 flex items-center justify-end border-b border-white/5">
        <Link
          to="/"
          className="text-xs font-display font-600 text-white/70 hover:text-white px-3.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 flex items-center gap-2 transition-all"
        >
          <Globe className="w-3.5 h-3.5" />
          <span>Patient Website</span>
        </Link>
      </header>

      {/* Main Login Card */}
      <main className="flex-1 flex items-center justify-center p-6 relative z-10 my-4">
        <div className="w-full max-w-md">
          {/* Glass Card */}
          <div className="bg-[#0b162c]/85 backdrop-blur-xl rounded-3xl border border-white/10 shadow-2xl p-8 relative overflow-hidden">
            <h1 className="font-display font-800 text-2xl text-white tracking-tight mb-6">
              Gateway Sign-In
            </h1>

            {/* Error Banner */}
            {error && (
              <div className="mb-6 p-3.5 rounded-2xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs flex items-start gap-2.5 animate-fadeIn">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-400 mt-0.5" />
                <span className="leading-snug">{error}</span>
              </div>
            )}

            {/* Rate Limit Cooldown Banner */}
            {isLocked && (
              <div className="mb-4 p-3 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-300 text-xs flex items-center gap-2.5 animate-fadeIn">
                <Timer className="w-4 h-4 shrink-0 text-amber-400" />
                <span>Too many failed attempts. Try again in <strong>{cooldownSeconds}s</strong></span>
              </div>
            )}

            {/* Caps Lock Alert */}
            {capsLockActive && (
              <div className="mb-4 p-2.5 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-300 text-[11px] flex items-center gap-2 animate-fadeIn">
                <AlertCircle className="w-3.5 h-3.5 shrink-0 text-amber-400" />
                <span>Caps Lock is ON</span>
              </div>
            )}

            {/* Login Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Username */}
              <div>
                <label className="block text-xs font-display font-600 text-white/80 mb-1.5">
                  Username
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-white/40 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    autoComplete="username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    disabled={isLocked}
                    className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white focus:outline-none focus:border-teal focus:ring-2 focus:ring-teal/20 transition-all font-display disabled:opacity-50"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-display font-600 text-white/80">
                    Password
                  </label>
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-white/40 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    autoComplete="current-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={isLocked}
                    className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-10 py-2.5 text-sm text-white focus:outline-none focus:border-teal focus:ring-2 focus:ring-teal/20 transition-all font-display disabled:opacity-50"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/80 transition-colors p-1 cursor-pointer"
                    tabIndex={-1}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading || isLocked}
                className="w-full mt-2 py-3 px-4 rounded-xl bg-gradient-to-r from-teal to-teal-dark hover:brightness-110 text-white font-display font-700 text-sm shadow-lg shadow-teal/25 flex items-center justify-center gap-2 transition-all disabled:opacity-60 disabled:cursor-not-allowed group cursor-pointer"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Verifying...</span>
                  </>
                ) : isLocked ? (
                  <>
                    <Timer className="w-4 h-4" />
                    <span>Locked ({cooldownSeconds}s)</span>
                  </>
                ) : (
                  <>
                    <span>Authenticate</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="px-6 py-4 relative z-10 border-t border-white/5 text-center text-xs text-white/40">
        Orthobud Orthopedic Care
      </footer>
    </div>
  )
}
