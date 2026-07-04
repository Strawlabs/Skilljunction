'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()
  const supabase = createClient()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    const { data, error: authError } = await supabase.auth.signInWithPassword({ email, password })

    if (authError) {
      setError(authError.message)
      setLoading(false)
      return
    }

    if (data.user) {
      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', data.user.id)
        .single()

      const role = profile?.role ?? 'learner'
      router.push(`/dashboard/${role}`)
      router.refresh()
    }
  }

  return (
    <div className="bg-background min-h-screen flex flex-col font-sans">
      <header className="fixed top-0 w-full z-50 bg-surface/80 backdrop-blur-md h-16 flex items-center px-gutter justify-between border-b border-outline-variant/20">
        <Link href="/" className="flex items-center gap-2">
          <span className="material-symbols-outlined text-primary text-3xl">school</span>
          <span className="font-bold text-xl text-primary">Skill Junction</span>
        </Link>
        <Link href="/auth/signup" className="text-on-surface-variant font-semibold text-sm hover:text-primary transition-colors">
          New here? Join free →
        </Link>
      </header>

      <main className="flex-grow flex items-center justify-center px-4 relative overflow-hidden pt-24 pb-12">
        <div className="absolute top-[-10%] left-[-5%] w-[40%] h-[40%] bg-primary/5 blur-[120px] rounded-full pointer-events-none" />
        <div className="absolute bottom-[-10%] right-[-5%] w-[40%] h-[40%] bg-tertiary/5 blur-[120px] rounded-full pointer-events-none" />

        <div className="w-full max-w-md z-10">
          <div className="glass-card rounded-[16px] p-8 md:p-10 border border-white/40">
            {/* Header */}
            <div className="mb-8 text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 text-primary mb-4">
                <span className="material-symbols-outlined text-3xl">lock_open</span>
              </div>
              <h1 className="text-[28px] font-bold text-on-surface mb-2 leading-tight">Welcome back</h1>
              <p className="text-on-surface-variant text-sm">Sign in to your Skill Junction account</p>
            </div>

            {/* Error */}
            {error && (
              <div className="mb-6 p-4 rounded-xl bg-error-container text-on-error-container text-sm flex items-center gap-2">
                <span className="material-symbols-outlined text-xl">error</span>
                {error}
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-5">
              {/* Email */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-on-surface-variant ml-1" htmlFor="login-email">
                  Email Address
                </label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline text-xl">mail</span>
                  <input
                    id="login-email"
                    type="email"
                    required
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    className="w-full pl-12 pr-4 py-3.5 bg-surface-dim/30 border border-outline-variant/40 focus:ring-2 focus:ring-primary focus:border-primary rounded-xl text-sm transition-all outline-none placeholder:text-outline/60"
                    placeholder="name@company.com"
                    autoComplete="email"
                  />
                </div>
              </div>

              {/* Password */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-on-surface-variant ml-1" htmlFor="login-password">
                  Password
                </label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline text-xl">lock</span>
                  <input
                    id="login-password"
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    className="w-full pl-12 pr-12 py-3.5 bg-surface-dim/30 border border-outline-variant/40 focus:ring-2 focus:ring-primary focus:border-primary rounded-xl text-sm transition-all outline-none placeholder:text-outline/60"
                    placeholder="••••••••"
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-outline hover:text-on-surface transition-colors"
                  >
                    <span className="material-symbols-outlined text-xl">
                      {showPassword ? 'visibility_off' : 'visibility'}
                    </span>
                  </button>
                </div>
                <div className="flex justify-end mt-1">
                  <Link href="/auth/reset" className="text-primary text-xs font-semibold hover:underline underline-offset-4">
                    Forgot password?
                  </Link>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 bg-gradient-to-b from-[#4e63e7] to-primary text-on-primary font-semibold rounded-[12px] shadow-lg hover:shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 group disabled:opacity-70 disabled:cursor-not-allowed disabled:scale-100"
              >
                {loading ? (
                  <span className="material-symbols-outlined animate-spin">progress_activity</span>
                ) : (
                  <>
                    <span>Sign In</span>
                    <span className="material-symbols-outlined text-xl group-hover:translate-x-1 transition-transform">arrow_forward</span>
                  </>
                )}
              </button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-on-surface-variant text-sm">
                Don&apos;t have an account?{' '}
                <Link href="/auth/signup" className="text-primary font-semibold hover:underline underline-offset-4">
                  Join for free
                </Link>
              </p>
            </div>

            <div className="mt-8 opacity-80">
              <div className="grid grid-cols-3 gap-4">
                <div className="h-1 bg-gradient-to-r from-transparent via-primary-fixed-dim/30 to-transparent rounded-full" />
                <div className="h-1 bg-gradient-to-r from-transparent via-primary/40 to-transparent rounded-full" />
                <div className="h-1 bg-gradient-to-r from-transparent via-tertiary-fixed-dim/30 to-transparent rounded-full" />
              </div>
            </div>
          </div>
        </div>
      </main>

      <footer className="py-8 border-t border-outline-variant bg-surface-container-lowest">
        <div className="flex justify-center items-center px-8">
          <span className="text-on-surface-variant text-sm">© 2024 Skill Junction. All rights reserved.</span>
        </div>
      </footer>
    </div>
  )
}
