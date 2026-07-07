'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'

export default function ResetPasswordPage() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState('')
  const supabase = createClient()

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/update-password`,
    })
    if (error) {
      setError(error.message)
    } else {
      setSent(true)
    }
    setLoading(false)
  }

  return (
    <div className="bg-background min-h-screen flex flex-col font-sans">
      <header className="fixed top-0 w-full z-50 bg-surface/80 backdrop-blur-md h-16 flex items-center px-gutter justify-between border-b border-outline-variant/20">
        <Link href="/" className="flex items-center gap-2">
          <span className="material-symbols-outlined text-primary text-3xl">school</span>
          <span className="font-headline-md text-headline-md font-bold text-primary">Skill Junction</span>
        </Link>
        <Link href="#" className="text-on-surface-variant font-label-md text-label-md hover:text-primary transition-colors">Help Center</Link>
      </header>

      <main className="flex-grow flex items-center justify-center p-margin-mobile md:p-margin-desktop relative overflow-hidden pt-20">
        <div className="absolute top-[-10%] left-[-5%] w-[40%] h-[40%] bg-primary/5 blur-[120px] rounded-full pointer-events-none" />
        <div className="absolute bottom-[-10%] right-[-5%] w-[40%] h-[40%] bg-tertiary/5 blur-[120px] rounded-full pointer-events-none" />

        <div className="w-full max-w-md z-10">
          <div className="glass-card rounded-[16px] p-8 md:p-10 border border-white/40">
            {!sent ? (
              <>
                <div className="mb-8 text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 text-primary mb-4">
                    <span className="material-symbols-outlined text-3xl">lock_reset</span>
                  </div>
                  <h1 className="font-headline-lg text-headline-lg text-on-surface mb-2">Forgot Password?</h1>
                  <p className="text-on-surface-variant font-body-md text-body-md">
                    Enter your registered email to receive a reset link.
                  </p>
                </div>

                {error && (
                  <div className="mb-6 p-4 rounded-xl bg-error-container text-on-error-container font-label-md text-label-md flex items-center gap-2">
                    <span className="material-symbols-outlined text-xl">error</span>
                    {error}
                  </div>
                )}

                <form onSubmit={handleReset} className="space-y-6">
                  <div className="space-y-2">
                    <label className="block font-label-md text-label-md text-on-surface-variant ml-1" htmlFor="reset-email">
                      Email Address
                    </label>
                    <div className="relative">
                      <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline text-xl">mail</span>
                      <input
                        id="reset-email" type="email" required value={email}
                        onChange={e => setEmail(e.target.value)}
                        className="w-full pl-12 pr-4 py-3.5 bg-surface-dim/30 border border-outline-variant/40 focus:ring-2 focus:ring-primary focus:border-primary rounded-xl text-body-md font-body-md transition-all outline-none placeholder:text-outline/60"
                        placeholder="name@company.com"
                      />
                    </div>
                  </div>

                  <button
                    type="submit" disabled={loading}
                    className="w-full py-4 bg-primary text-on-primary font-label-md text-label-md rounded-[12px] shadow-lg hover:shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 group disabled:opacity-70"
                  >
                    {loading ? (
                      <span className="material-symbols-outlined animate-spin">progress_activity</span>
                    ) : (
                      <>
                        <span>Send Reset Link</span>
                        <span className="material-symbols-outlined text-xl group-hover:translate-x-1 transition-transform">arrow_forward</span>
                      </>
                    )}
                  </button>
                </form>

                <div className="mt-8 text-center">
                  <Link href="/auth/login" className="text-primary font-label-md text-label-md hover:underline underline-offset-4 flex items-center justify-center gap-1">
                    <span className="material-symbols-outlined text-sm">arrow_back</span>
                    Back to Login
                  </Link>
                </div>
              </>
            ) : (
              <div className="text-center py-4">
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-secondary-container text-primary mb-6 animate-bounce">
                  <span className="material-symbols-outlined text-4xl">mark_email_read</span>
                </div>
                <h1 className="font-headline-lg text-headline-lg text-on-surface mb-3">Check your Inbox</h1>
                <p className="text-on-surface-variant font-body-md mb-6">
                  We&apos;ve sent a secure password reset link to <strong className="text-on-surface">{email}</strong>.
                </p>
                <div className="bg-surface-container-low p-5 rounded-xl border border-outline-variant/30 mb-8 text-left">
                  <p className="font-label-sm text-label-sm text-on-surface-variant flex items-start gap-2">
                    <span className="material-symbols-outlined text-primary text-lg">info</span>
                    Link expires in 15 minutes. If you don&apos;t see the email, check your spam folder.
                  </p>
                </div>
                <Link href="/auth/login" className="text-primary font-label-md text-label-md hover:underline underline-offset-4 flex items-center justify-center gap-1">
                  <span className="material-symbols-outlined text-sm">arrow_back</span>
                  Back to Login
                </Link>
              </div>
            )}

            <div className="mt-10 opacity-80">
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
