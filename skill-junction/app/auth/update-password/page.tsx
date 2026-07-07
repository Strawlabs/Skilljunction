'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function UpdatePasswordPage() {
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [strength, setStrength] = useState(0)
  const router = useRouter()
  const supabase = createClient()

  // Listen for RECOVERY event from Supabase auth (handles URL hash token)
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'PASSWORD_RECOVERY') {
        // User is now in recovery session, allow password update
      }
    })
    return () => subscription.unsubscribe()
  }, [])

  const calcStrength = (val: string) => {
    let score = 0
    if (val.length >= 8) score++
    if (/[A-Z]/.test(val)) score++
    if (/[0-9]/.test(val)) score++
    if (/[^A-Za-z0-9]/.test(val)) score++
    setStrength(score)
  }

  const strengthLabel = ['', 'Weak', 'Fair', 'Good', 'Strong'][strength]
  const strengthColor = ['', 'bg-error', 'bg-amber-400', 'bg-amber-300', 'bg-green-500'][strength]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (password !== confirm) { setError('Passwords do not match.'); return }
    if (password.length < 8) { setError('Password must be at least 8 characters.'); return }
    setLoading(true)
    setError('')

    const { error: updateError } = await supabase.auth.updateUser({ password })
    if (updateError) {
      setError(updateError.message)
      setLoading(false)
      return
    }
    setSuccess(true)
    setTimeout(() => router.push('/auth/login'), 3000)
  }

  return (
    <div className="bg-background min-h-screen flex flex-col font-sans">
      <header className="fixed top-0 w-full z-50 bg-surface/80 backdrop-blur-md h-16 flex items-center px-8 justify-between border-b border-outline-variant/20">
        <Link href="/" className="flex items-center gap-2">
          <span className="material-symbols-outlined text-primary text-3xl">school</span>
          <span className="font-bold text-xl text-primary">Skill Junction</span>
        </Link>
      </header>

      <main className="flex-grow flex items-center justify-center px-4 pt-24 pb-12 relative overflow-hidden">
        <div className="absolute top-[-10%] left-[-5%] w-[40%] h-[40%] bg-primary/5 blur-[120px] rounded-full pointer-events-none" />
        <div className="absolute bottom-[-10%] right-[-5%] w-[40%] h-[40%] bg-tertiary/5 blur-[120px] rounded-full pointer-events-none" />

        <div className="w-full max-w-md z-10">
          <div className="glass-card rounded-[16px] p-8 md:p-10 border border-white/40">
            {success ? (
              <div className="text-center py-6">
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-100 text-green-600 mb-6">
                  <span className="material-symbols-outlined text-4xl">check_circle</span>
                </div>
                <h1 className="text-2xl font-bold text-on-surface mb-3">Password Updated!</h1>
                <p className="text-on-surface-variant text-sm mb-6">
                  Your password has been updated successfully. Redirecting you to login…
                </p>
                <Link href="/auth/login" className="text-primary font-semibold hover:underline">
                  Go to Login →
                </Link>
              </div>
            ) : (
              <>
                <div className="mb-8 text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 text-primary mb-4">
                    <span className="material-symbols-outlined text-3xl">lock_reset</span>
                  </div>
                  <h1 className="text-2xl font-bold text-on-surface mb-2">Set New Password</h1>
                  <p className="text-on-surface-variant text-sm">Create a strong, unique password to secure your account.</p>
                </div>

                {error && (
                  <div className="mb-5 p-4 rounded-xl bg-error-container text-on-error-container text-sm flex items-center gap-2">
                    <span className="material-symbols-outlined text-xl">error</span>
                    {error}
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-on-surface-variant ml-1">New Password</label>
                    <div className="relative">
                      <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline text-xl">key</span>
                      <input
                        type="password"
                        required
                        value={password}
                        onChange={e => { setPassword(e.target.value); calcStrength(e.target.value) }}
                        className="w-full pl-12 pr-4 py-3.5 bg-surface-dim/30 border border-outline-variant/40 focus:ring-2 focus:ring-primary focus:border-primary rounded-xl text-sm transition-all outline-none"
                        placeholder="Min. 8 characters"
                        minLength={8}
                      />
                    </div>
                    {password && (
                      <div className="px-1">
                        <div className="flex justify-between items-center mb-1.5">
                          <span className="text-xs text-on-surface-variant">Security Strength</span>
                          <span className="text-xs font-semibold text-on-surface-variant">{strengthLabel}</span>
                        </div>
                        <div className="h-1.5 w-full bg-surface-container-highest rounded-full overflow-hidden">
                          <div
                            className={`h-full transition-all duration-300 rounded-full ${strengthColor}`}
                            style={{ width: `${(strength / 4) * 100}%` }}
                          />
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-on-surface-variant ml-1">Confirm Password</label>
                    <div className="relative">
                      <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline text-xl">verified_user</span>
                      <input
                        type="password"
                        required
                        value={confirm}
                        onChange={e => setConfirm(e.target.value)}
                        className="w-full pl-12 pr-4 py-3.5 bg-surface-dim/30 border border-outline-variant/40 focus:ring-2 focus:ring-primary focus:border-primary rounded-xl text-sm transition-all outline-none"
                        placeholder="Repeat password"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-4 bg-primary text-on-primary font-semibold rounded-[12px] shadow-lg hover:shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:scale-100"
                  >
                    {loading
                      ? <span className="material-symbols-outlined animate-spin">progress_activity</span>
                      : 'Update Password'
                    }
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
