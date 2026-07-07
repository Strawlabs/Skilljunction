'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { createClient } from '@/lib/supabase/client'
import { loginSchema, type LoginInput } from '@/lib/validations/auth'
import { logSecurityEvent } from '@/lib/auth/logger'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [serverError, setServerError] = useState('')
  const router = useRouter()
  const supabase = createClient()

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
  })

  const onSubmit = async (data: LoginInput) => {
    setServerError('')

    // Determine if identifier is email or mobile
    const isEmail = data.identifier.includes('@')
    let email = data.identifier

    // If mobile, look up the associated email
    if (!isEmail) {
      const { data: profileData, error: profileErr } = await supabase
        .from('profiles')
        .select('id')
        .eq('mobile', data.identifier)
        .maybeSingle()

      if (profileErr || !profileData) {
        setServerError('No account found with that mobile number.')
        await logSecurityEvent(supabase, 'login_failure', {
          reason: 'mobile_not_found',
          identifier: '[REDACTED]',
        })
        return
      }

      // Get email from auth.users via profiles id — use a server action in a real app.
      // For now, ask user to use email for mobile-based accounts.
      setServerError(
        'Mobile sign-in is not yet supported. Please use your registered email address.'
      )
      return
    }

    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password: data.password,
    })

    if (authError) {
      const isInvalidCreds =
        authError.message.toLowerCase().includes('invalid') ||
        authError.message.toLowerCase().includes('credentials')
      setServerError(
        isInvalidCreds
          ? 'Incorrect email or password. Please try again.'
          : authError.message
      )
      await logSecurityEvent(supabase, 'login_failure', {
        reason: authError.message,
        email: '[REDACTED]',
      })
      return
    }

    if (authData.user) {
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('role, is_active')
        .eq('id', authData.user.id)
        .single()

      if (profileError || !profile) {
        setServerError('Account profile not found. Please contact support.')
        return
      }

      // Check disabled account
      if (profile.is_active === false) {
        await supabase.auth.signOut()
        await logSecurityEvent(supabase, 'login_disabled_account', {
          user_id: authData.user.id,
        })
        setServerError(
          'Your account has been disabled. Please contact support for assistance.'
        )
        return
      }

      await logSecurityEvent(supabase, 'login_success', { role: profile.role })

      // Role-based redirect
      const role = profile.role
      const dest =
        role === 'super_admin' || role === 'admin'
          ? '/dashboard/admin'
          : `/dashboard/${role}`
      router.push(dest)
      router.refresh()
    }
  }

  return (
    <div className="bg-background min-h-screen flex flex-col font-sans">
      {/* Header */}
      <header className="fixed top-0 w-full z-50 bg-surface/80 backdrop-blur-md h-16 flex items-center px-gutter justify-between border-b border-outline-variant/20">
        <Link href="/" className="flex items-center gap-2">
          <span className="material-symbols-outlined text-primary text-3xl">school</span>
          <span className="font-bold text-xl text-primary">Skill Junction</span>
        </Link>
        <Link
          href="/auth/signup"
          className="text-on-surface-variant font-semibold text-sm hover:text-primary transition-colors"
        >
          New here? Join free →
        </Link>
      </header>

      <main className="flex-grow flex items-center justify-center px-4 relative overflow-hidden pt-24 pb-12">
        {/* Background blobs */}
        <div className="absolute top-[-10%] left-[-5%] w-[40%] h-[40%] bg-primary/5 blur-[120px] rounded-full pointer-events-none" />
        <div className="absolute bottom-[-10%] right-[-5%] w-[40%] h-[40%] bg-tertiary/5 blur-[120px] rounded-full pointer-events-none" />

        <div className="w-full max-w-md z-10">
          <div className="glass-card rounded-[16px] p-8 md:p-10 border border-white/40">
            {/* Header */}
            <div className="mb-8 text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 text-primary mb-4">
                <span className="material-symbols-outlined text-3xl">lock_open</span>
              </div>
              <h1 className="text-[28px] font-bold text-on-surface mb-2 leading-tight">
                Welcome back
              </h1>
              <p className="text-on-surface-variant text-sm">
                Sign in to your Skill Junction account
              </p>
            </div>

            {/* Server error */}
            {serverError && (
              <div className="mb-6 p-4 rounded-xl bg-error-container text-on-error-container text-sm flex items-start gap-2">
                <span className="material-symbols-outlined text-xl shrink-0">error</span>
                <span>{serverError}</span>
              </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
              {/* Email / Mobile */}
              <div className="space-y-1.5">
                <label
                  className="block text-sm font-semibold text-on-surface-variant ml-1"
                  htmlFor="login-identifier"
                >
                  Email Address
                </label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline text-xl">
                    mail
                  </span>
                  <input
                    id="login-identifier"
                    type="text"
                    autoComplete="email"
                    placeholder="name@company.com"
                    {...register('identifier')}
                    className={`w-full pl-12 pr-4 py-3.5 bg-surface-dim/30 border rounded-xl text-sm transition-all outline-none placeholder:text-outline/60 ${
                      errors.identifier
                        ? 'border-error focus:ring-2 focus:ring-error'
                        : 'border-outline-variant/40 focus:ring-2 focus:ring-primary focus:border-primary'
                    }`}
                  />
                </div>
                {errors.identifier && (
                  <p className="text-error text-xs ml-1 flex items-center gap-1">
                    <span className="material-symbols-outlined text-sm">error</span>
                    {errors.identifier.message}
                  </p>
                )}
              </div>

              {/* Password */}
              <div className="space-y-1.5">
                <label
                  className="block text-sm font-semibold text-on-surface-variant ml-1"
                  htmlFor="login-password"
                >
                  Password
                </label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline text-xl">
                    lock
                  </span>
                  <input
                    id="login-password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="current-password"
                    placeholder="••••••••"
                    {...register('password')}
                    className={`w-full pl-12 pr-12 py-3.5 bg-surface-dim/30 border rounded-xl text-sm transition-all outline-none placeholder:text-outline/60 ${
                      errors.password
                        ? 'border-error focus:ring-2 focus:ring-error'
                        : 'border-outline-variant/40 focus:ring-2 focus:ring-primary focus:border-primary'
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-outline hover:text-on-surface transition-colors"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    <span className="material-symbols-outlined text-xl">
                      {showPassword ? 'visibility_off' : 'visibility'}
                    </span>
                  </button>
                </div>
                {errors.password && (
                  <p className="text-error text-xs ml-1 flex items-center gap-1">
                    <span className="material-symbols-outlined text-sm">error</span>
                    {errors.password.message}
                  </p>
                )}
                <div className="flex justify-end mt-1">
                  <Link
                    href="/auth/reset"
                    className="text-primary text-xs font-semibold hover:underline underline-offset-4"
                  >
                    Forgot password?
                  </Link>
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 bg-gradient-to-b from-[#4e63e7] to-primary text-on-primary font-semibold rounded-[12px] shadow-lg hover:shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 group disabled:opacity-70 disabled:cursor-not-allowed disabled:scale-100"
              >
                {isSubmitting ? (
                  <span className="material-symbols-outlined animate-spin">progress_activity</span>
                ) : (
                  <>
                    <span>Sign In</span>
                    <span className="material-symbols-outlined text-xl group-hover:translate-x-1 transition-transform">
                      arrow_forward
                    </span>
                  </>
                )}
              </button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-on-surface-variant text-sm">
                Don&apos;t have an account?{' '}
                <Link
                  href="/auth/signup"
                  className="text-primary font-semibold hover:underline underline-offset-4"
                >
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
        <div className="flex justify-center items-center gap-6 px-8 flex-wrap">
          <span className="text-on-surface-variant text-sm">
            © 2024 Skill Junction. All rights reserved.
          </span>
          <Link href="/privacy" className="text-on-surface-variant text-sm hover:text-primary transition-colors">
            Privacy Policy
          </Link>
          <Link href="/terms" className="text-on-surface-variant text-sm hover:text-primary transition-colors">
            Terms & Conditions
          </Link>
        </div>
      </footer>
    </div>
  )
}
