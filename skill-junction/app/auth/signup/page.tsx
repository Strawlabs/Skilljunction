'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Suspense } from 'react'

function SignupForm() {
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState<'learner' | 'tutor' | 'parent'>('learner')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const router = useRouter()
  const searchParams = useSearchParams()
  const supabase = createClient()

  // Pre-select role from URL param
  useEffect(() => {
    const defaultRole = searchParams.get('role') as 'tutor' | 'parent' | null
    if (defaultRole && (defaultRole === 'tutor' || defaultRole === 'parent')) {
      setRole(defaultRole)
    }
  }, [searchParams])

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: fullName, role },
      },
    })

    if (error) {
      setError(error.message)
      setLoading(false)
      return
    }

    setSuccess(true)
    setLoading(false)
  }

  if (success) {
    return (
      <div className="text-center py-8">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-secondary-container text-primary mb-6 animate-bounce">
          <span className="material-symbols-outlined text-4xl">mark_email_read</span>
        </div>
        <h2 className="font-headline-lg text-headline-lg text-on-surface mb-3">Check your inbox!</h2>
        <p className="text-on-surface-variant font-body-md">
          We sent a confirmation link to <strong className="text-on-surface">{email}</strong>. Please verify your email to continue.
        </p>
        <Link href="/auth/login" className="mt-8 inline-block text-primary font-label-md hover:underline underline-offset-4">
          ← Back to Login
        </Link>
      </div>
    )
  }

  const roles = [
    { value: 'learner', label: 'Learner', icon: 'school', desc: 'Access courses & tutors' },
    { value: 'tutor', label: 'Tutor', icon: 'person_chalkboard', desc: 'Teach & earn revenue' },
    { value: 'parent', label: 'Parent', icon: 'family_restroom', desc: 'Monitor child progress' },
  ]

  return (
    <form onSubmit={handleSignup} className="space-y-5">
      {/* Role selector */}
      <div className="space-y-2">
        <label className="block font-label-md text-label-md text-on-surface-variant ml-1">I am joining as a...</label>
        <div className="grid grid-cols-3 gap-3">
          {roles.map(r => (
            <button
              key={r.value}
              type="button"
              onClick={() => setRole(r.value as typeof role)}
              className={`flex flex-col items-center p-3 rounded-xl border-2 transition-all ${
                role === r.value
                  ? 'border-primary bg-primary/10 text-primary'
                  : 'border-outline-variant/40 text-on-surface-variant hover:border-primary/40'
              }`}
            >
              <span className="material-symbols-outlined text-2xl mb-1">{r.icon}</span>
              <span className="font-label-md text-label-md font-bold">{r.label}</span>
              <span className="text-[10px] text-center leading-tight mt-0.5 opacity-70">{r.desc}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <label className="block font-label-md text-label-md text-on-surface-variant ml-1" htmlFor="fullName">Full Name</label>
        <div className="relative">
          <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline text-xl">person</span>
          <input
            id="fullName" type="text" required value={fullName}
            onChange={e => setFullName(e.target.value)}
            className="w-full pl-12 pr-4 py-3.5 bg-surface-dim/30 border border-outline-variant/40 focus:ring-2 focus:ring-primary focus:border-primary rounded-xl text-body-md font-body-md transition-all outline-none placeholder:text-outline/60"
            placeholder="Jane Doe"
          />
        </div>
      </div>

      <div className="space-y-2">
        <label className="block font-label-md text-label-md text-on-surface-variant ml-1" htmlFor="signup-email">Email Address</label>
        <div className="relative">
          <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline text-xl">mail</span>
          <input
            id="signup-email" type="email" required value={email}
            onChange={e => setEmail(e.target.value)}
            className="w-full pl-12 pr-4 py-3.5 bg-surface-dim/30 border border-outline-variant/40 focus:ring-2 focus:ring-primary focus:border-primary rounded-xl text-body-md font-body-md transition-all outline-none placeholder:text-outline/60"
            placeholder="name@company.com"
          />
        </div>
      </div>

      <div className="space-y-2">
        <label className="block font-label-md text-label-md text-on-surface-variant ml-1" htmlFor="signup-password">Password</label>
        <div className="relative">
          <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline text-xl">lock</span>
          <input
            id="signup-password" type="password" required value={password}
            onChange={e => setPassword(e.target.value)} minLength={8}
            className="w-full pl-12 pr-4 py-3.5 bg-surface-dim/30 border border-outline-variant/40 focus:ring-2 focus:ring-primary focus:border-primary rounded-xl text-body-md font-body-md transition-all outline-none placeholder:text-outline/60"
            placeholder="Min. 8 characters"
          />
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-error-container text-on-error-container font-label-md text-label-md flex items-center gap-2">
          <span className="material-symbols-outlined text-xl">error</span>
          {error}
        </div>
      )}

      <button
        type="submit" disabled={loading}
        className="w-full py-4 bg-primary text-on-primary font-label-md text-label-md rounded-[12px] shadow-lg hover:shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 group disabled:opacity-70 disabled:cursor-not-allowed"
      >
        {loading ? (
          <span className="material-symbols-outlined animate-spin">progress_activity</span>
        ) : (
          <>
            <span>Create Account</span>
            <span className="material-symbols-outlined text-xl group-hover:translate-x-1 transition-transform">arrow_forward</span>
          </>
        )}
      </button>
    </form>
  )
}

export default function SignupPage() {
  return (
    <div className="bg-background min-h-screen flex flex-col font-sans">
      <header className="fixed top-0 w-full z-50 bg-surface/80 backdrop-blur-md h-16 flex items-center px-gutter justify-between border-b border-outline-variant/20">
        <Link href="/" className="flex items-center gap-2">
          <span className="material-symbols-outlined text-primary text-3xl">school</span>
          <span className="font-headline-md text-headline-md font-bold text-primary">Skill Junction</span>
        </Link>
        <Link href="/auth/login" className="text-on-surface-variant font-label-md text-label-md hover:text-primary transition-colors">
          Already have an account? Sign in →
        </Link>
      </header>

      <main className="flex-grow flex items-center justify-center p-margin-mobile md:p-margin-desktop relative overflow-hidden pt-24 pb-12">
        <div className="absolute top-[-10%] left-[-5%] w-[40%] h-[40%] bg-primary/5 blur-[120px] rounded-full pointer-events-none" />
        <div className="absolute bottom-[-10%] right-[-5%] w-[40%] h-[40%] bg-tertiary/5 blur-[120px] rounded-full pointer-events-none" />

        <div className="w-full max-w-md z-10">
          <div className="glass-card rounded-[16px] p-8 md:p-10 border border-white/40">
            <div className="mb-8 text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 text-primary mb-4">
                <span className="material-symbols-outlined text-3xl">person_add</span>
              </div>
              <h1 className="font-headline-lg text-headline-lg text-on-surface mb-2">Join Skill Junction</h1>
              <p className="text-on-surface-variant font-body-md text-body-md">Start your learning journey today</p>
            </div>

            <Suspense fallback={<div className="animate-pulse h-64 bg-surface-container rounded-xl" />}>
              <SignupForm />
            </Suspense>

            <div className="mt-6 text-center">
              <p className="text-on-surface-variant font-body-md text-body-md">
                Already have an account?{' '}
                <Link href="/auth/login" className="text-primary font-label-md hover:underline underline-offset-4 font-semibold">
                  Sign in
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
        <div className="flex justify-center items-center px-margin-desktop">
          <span className="font-label-md text-label-md text-on-surface-variant">© 2024 Skill Junction. All rights reserved.</span>
        </div>
      </footer>
    </div>
  )
}
