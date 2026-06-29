import { useState } from 'react'
import { API_URL } from '../config'

type Mode = 'login' | 'register' | 'verify' | 'forgot' | 'reset'

export function AuthPages() {
  const [mode, setMode] = useState<Mode>('login')
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  // Fields
  const [name, setName] = useState('')
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [otp, setOtp] = useState('')
  const [newPassword, setNewPassword] = useState('')

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setSuccess(null)

    try {
      const res = await fetch(`${API_URL}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, username, email, password })
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.detail || 'Registration failed')
      
      setSuccess("Account created. Please enter the 6-digit verification code sent to your email.")
      setMode('verify')
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setSuccess(null)

    try {
      const res = await fetch(`${API_URL}/api/auth/verify-email`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp })
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.detail || 'Verification failed')

      setSuccess("Email verified successfully! You can now log in.")
      setMode('login')
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const res = await fetch(`${API_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username_or_email: username, password })
      })

      const data = await res.json()
      if (!res.ok) {
        if (res.status === 403) {
          // Redirect to verify email
          setEmail(username.includes('@') ? username : '')
          setMode('verify')
          throw new Error("Email not verified yet. A code has been re-sent to your address.")
        }
        throw new Error(data.detail || 'Login failed')
      }

      // Save credentials
      localStorage.setItem('token', data.access_token)
      localStorage.setItem('user', JSON.stringify(data.user))
      
      // Force reload to refresh router auth state
      window.location.href = '/'
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleForgot = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setSuccess(null)

    try {
      const res = await fetch(`${API_URL}/api/auth/forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.detail || 'Password reset request failed')

      setSuccess("A 6-digit OTP code has been dispatched to your email.")
      setMode('reset')
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setSuccess(null)

    try {
      const res = await fetch(`${API_URL}/api/auth/reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp, new_password: newPassword })
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.detail || 'Reset failed')

      setSuccess("Password updated successfully. You can now log in.")
      setMode('login')
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0a0e17] px-4 select-none">
      
      {/* Auth Card wrapper */}
      <div className="w-full max-w-md rounded-3xl border border-[var(--color-border)] bg-[var(--color-surface-raised)]/35 backdrop-blur-xl p-8 shadow-2xl relative overflow-hidden">
        
        {/* Subtle glowing backgrounds */}
        <div className="absolute top-[-50px] right-[-50px] h-32 w-32 rounded-full bg-[var(--color-accent)]/20 blur-3xl pointer-events-none" />
        <div className="absolute bottom-[-50px] left-[-50px] h-32 w-32 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none" />

        <div className="text-center mb-8">
          <h2 className="text-2xl font-black text-white tracking-tight flex items-center justify-center gap-1.5">
            <span>✨</span> Lumina AI
          </h2>
          <p className="text-xs text-[#8b93a7] mt-1.5 uppercase font-bold tracking-widest">
            {mode === 'login' && 'Sign In to continue'}
            {mode === 'register' && 'Create your account'}
            {mode === 'verify' && 'Verify your Email'}
            {mode === 'forgot' && 'Reset your password'}
            {mode === 'reset' && 'Create new password'}
          </p>
        </div>

        {error && (
          <div className="mb-4 rounded-xl border border-[var(--color-danger)] bg-[var(--color-danger)]/5 p-3 text-xs leading-relaxed text-[#f87171]">
            ❌ {error}
          </div>
        )}

        {success && (
          <div className="mb-4 rounded-xl border border-[var(--color-success)] bg-[var(--color-success)]/5 p-3 text-xs leading-relaxed text-emerald-400">
            ✓ {success}
          </div>
        )}

        {mode === 'login' && (
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="text-[10px] text-[#8b93a7] font-semibold block mb-1 uppercase tracking-wider">Username or Email</label>
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-2.5 text-xs outline-none focus:border-[var(--color-accent)] text-white"
              />
            </div>
            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="text-[10px] text-[#8b93a7] font-semibold block uppercase tracking-wider">Password</label>
                <button type="button" onClick={() => setMode('forgot')} className="text-[10px] text-[var(--color-accent-bright)] hover:underline">Forgot password?</button>
              </div>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-2.5 text-xs outline-none focus:border-[var(--color-accent)] text-white"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-[var(--color-accent)] py-3 text-xs font-bold text-white transition-all hover:bg-[var(--color-accent-bright)] shadow-md shadow-[var(--color-accent)]/10 mt-6"
            >
              {loading ? 'Logging in...' : 'Sign In'}
            </button>
            <p className="text-center text-xs text-[#8b93a7] mt-4">
              Don't have an account?{' '}
              <button type="button" onClick={() => setMode('register')} className="text-[var(--color-accent-bright)] hover:underline">Sign up</button>
            </p>
          </form>
        )}

        {mode === 'register' && (
          <form onSubmit={handleRegister} className="space-y-4">
            <div>
              <label className="text-[10px] text-[#8b93a7] font-semibold block mb-1 uppercase tracking-wider">Full Name</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-2.5 text-xs outline-none focus:border-[var(--color-accent)] text-white"
              />
            </div>
            <div>
              <label className="text-[10px] text-[#8b93a7] font-semibold block mb-1 uppercase tracking-wider">Username</label>
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-2.5 text-xs outline-none focus:border-[var(--color-accent)] text-white"
              />
            </div>
            <div>
              <label className="text-[10px] text-[#8b93a7] font-semibold block mb-1 uppercase tracking-wider">Email Address</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-2.5 text-xs outline-none focus:border-[var(--color-accent)] text-white"
              />
            </div>
            <div>
              <label className="text-[10px] text-[#8b93a7] font-semibold block mb-1 uppercase tracking-wider">Password</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-2.5 text-xs outline-none focus:border-[var(--color-accent)] text-white"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-[var(--color-accent)] py-3 text-xs font-bold text-white transition-all hover:bg-[var(--color-accent-bright)] mt-6"
            >
              {loading ? 'Creating account...' : 'Sign Up'}
            </button>
            <p className="text-center text-xs text-[#8b93a7] mt-4">
              Already have an account?{' '}
              <button type="button" onClick={() => setMode('login')} className="text-[var(--color-accent-bright)] hover:underline">Sign in</button>
            </p>
          </form>
        )}

        {mode === 'verify' && (
          <form onSubmit={handleVerify} className="space-y-4">
            <p className="text-xs text-[#8b93a7] text-center leading-relaxed">
              We generated a security code for <strong>{email || 'your email'}</strong>. Enter it below to unlock access.
            </p>
            <div>
              <label className="text-[10px] text-[#8b93a7] font-semibold block mb-1 uppercase tracking-wider">Verification OTP (6-digits)</label>
              <input
                type="text"
                required
                maxLength={6}
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                placeholder="000000"
                className="w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-2.5 text-xs outline-none focus:border-[var(--color-accent)] text-white tracking-widest text-center text-lg font-bold"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-[var(--color-accent)] py-3 text-xs font-bold text-white transition-all hover:bg-[var(--color-accent-bright)] mt-6"
            >
              {loading ? 'Confirming...' : 'Verify Email'}
            </button>
            <button type="button" onClick={() => setMode('login')} className="w-full text-center text-xs text-[#8b93a7] hover:underline mt-4">Back to Login</button>
          </form>
        )}

        {mode === 'forgot' && (
          <form onSubmit={handleForgot} className="space-y-4">
            <p className="text-xs text-[#8b93a7] leading-relaxed">
              Enter your verified email below. We will send a 6-digit OTP code to verify your identity.
            </p>
            <div>
              <label className="text-[10px] text-[#8b93a7] font-semibold block mb-1 uppercase tracking-wider">Email Address</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-2.5 text-xs outline-none focus:border-[var(--color-accent)] text-white"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-[var(--color-accent)] py-3 text-xs font-bold text-white transition-all hover:bg-[var(--color-accent-bright)] mt-6"
            >
              {loading ? 'Sending code...' : 'Get OTP Code'}
            </button>
            <button type="button" onClick={() => setMode('login')} className="w-full text-center text-xs text-[#8b93a7] hover:underline mt-4">Back to Login</button>
          </form>
        )}

        {mode === 'reset' && (
          <form onSubmit={handleReset} className="space-y-4">
            <p className="text-xs text-[#8b93a7] leading-relaxed">
              Please enter the 6-digit OTP code sent to your email, along with your new password.
            </p>
            <div>
              <label className="text-[10px] text-[#8b93a7] font-semibold block mb-1 uppercase tracking-wider">Verification OTP (6-digits)</label>
              <input
                type="text"
                required
                maxLength={6}
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                placeholder="000000"
                className="w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-2.5 text-xs outline-none focus:border-[var(--color-accent)] text-white text-center font-bold tracking-widest text-lg"
              />
            </div>
            <div>
              <label className="text-[10px] text-[#8b93a7] font-semibold block mb-1 uppercase tracking-wider">New Password</label>
              <input
                type="password"
                required
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-2.5 text-xs outline-none focus:border-[var(--color-accent)] text-white"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-[var(--color-accent)] py-3 text-xs font-bold text-white transition-all hover:bg-[var(--color-accent-bright)] mt-6"
            >
              {loading ? 'Saving password...' : 'Update Password'}
            </button>
            <button type="button" onClick={() => setMode('login')} className="w-full text-center text-xs text-[#8b93a7] hover:underline mt-4">Back to Login</button>
          </form>
        )}

      </div>
    </div>
  )
}
