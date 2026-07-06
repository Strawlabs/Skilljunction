'use client'

import { useState, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import Link from 'next/link'
import { INTERESTED_COURSES } from '@/lib/validations/auth'
import { createClient } from '@/lib/supabase/client'

// Learner Registration Schema
const registrationSchema = z.object({
  learnerName: z.string().min(2, 'Learner name must be at least 2 characters').max(100),
  parentName: z.string().min(2, 'Parent name must be at least 2 characters').max(100),
  mobile: z.string().regex(/^[6-9]\d{9}$/, 'Enter a valid 10-digit Indian mobile number'),
  email: z.string().email('Enter a valid email address'),
  interestedCourse: z.enum(INTERESTED_COURSES as [string, ...string[]], {
    errorMap: () => ({ message: 'Please select a course' }),
  }),
  profilePhoto: z.any().optional(),
  aadhaar: z.string().min(1, 'Aadhaar is required for verification (will not be stored)'),
  termsAccepted: z.literal(true, {
    errorMap: () => ({ message: 'You must accept the Terms & Conditions' }),
  }),
})

type RegistrationInput = z.infer<typeof registrationSchema>

function LearnerOnboarding() {

  const supabase = createClient()
  const [serverError, setServerError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<RegistrationInput>({
    resolver: zodResolver(registrationSchema),
    defaultValues: {
      aadhaar: '[Aadhaar Redacted]', // Default masked value
    }
  })

  // Watch profile photo to show preview if needed
  const profilePhotoList = watch('profilePhoto')
  const profilePhotoFile = profilePhotoList && profilePhotoList.length > 0 ? profilePhotoList[0] : null

  const onSubmit = async (data: RegistrationInput) => {
    setIsSubmitting(true)
    setServerError('')

    try {
      // 1. Check for duplicate mobile
      const { data: mobileCheck } = await supabase
        .from('profiles')
        .select('id')
        .eq('mobile', data.mobile)
        .maybeSingle()
        
      if (mobileCheck) {
        setServerError('This mobile number is already registered.')
        setIsSubmitting(false)
        return
      }

      // 2. Sign up the user
      // Note: We're passing the redacted aadhaar string to satisfy the prompt's
      // requirement to use a placeholder string for state tracking/backend communication.
      const { error: signUpError } = await supabase.auth.signUp({
        email: data.email,
        password: 'TemporaryPassword123!', // In a real flow they might set this or get a magic link
        options: {
          data: {
            full_name: data.learnerName,
            parent_name: data.parentName,
            mobile: data.mobile,
            interested_course: data.interestedCourse,
            role: 'learner',
            aadhaar_status: data.aadhaar, // Will just be [Aadhaar Redacted]
            terms_accepted: true,
          }
        }
      })

      if (signUpError) throw signUpError

      setSuccess(true)
    } catch (err: any) {
      setServerError(err.message || 'An error occurred during registration.')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (success) {
    return (
      <div className="bg-background min-h-screen flex items-center justify-center font-sans p-4">
        <div className="bg-surface-container-low rounded-2xl p-8 max-w-md w-full text-center border border-outline-variant/30">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-secondary-container text-primary mb-6 animate-bounce">
            <span className="material-symbols-outlined text-4xl">check_circle</span>
          </div>
          <h2 className="text-headline-lg font-bold text-on-background mb-3">Registration Complete!</h2>
          <p className="text-on-surface-variant text-body-md mb-6">
            Welcome to your Learning Journey. Your profile has been set up successfully.
          </p>
          <Link href="/" className="inline-block px-6 py-3 bg-primary text-white rounded-xl font-bold hover:bg-primary/90 transition-all">
            Go to Dashboard
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-background text-on-background min-h-screen font-sans">
      {/* TopNavBar */}
      <header className="sticky top-0 z-50 flex justify-between items-center w-full px-margin-mobile md:px-margin-desktop h-12 md:h-16 bg-surface/90 backdrop-blur-md border-b border-outline-variant">
        <div className="flex items-center gap-4">
          <h1 className="font-headline-md text-headline-md font-bold text-primary">Skill Junction</h1>
        </div>
        <div className="flex items-center gap-4">
          <Link href="/auth/login" className="text-primary font-label-md text-label-md hover:underline">
            Already have an account? Sign in
          </Link>
        </div>
      </header>

      <main className="flex min-h-[calc(100vh-64px)]">
        {/* SideNavBar (Hidden on Mobile) */}
        <aside className="hidden md:flex flex-col fixed left-0 top-16 h-[calc(100vh-64px)] w-64 bg-surface-container-low border-r border-outline-variant py-4 px-2 overflow-y-auto">
          <div className="flex flex-col gap-1 mb-8">
            <div className="flex items-center gap-3 bg-primary-container text-on-primary-container rounded-lg px-3 py-2 font-semibold">
              <span className="material-symbols-outlined">how_to_reg</span>
              <span className="font-label-md text-label-md">Registration</span>
            </div>
            <div className="flex items-center gap-3 text-on-surface-variant px-3 py-2 rounded-lg opacity-50 cursor-not-allowed">
              <span className="material-symbols-outlined">dashboard</span>
              <span className="font-label-md text-label-md">Dashboard</span>
            </div>
            <div className="flex items-center gap-3 text-on-surface-variant px-3 py-2 rounded-lg opacity-50 cursor-not-allowed">
              <span className="material-symbols-outlined">school</span>
              <span className="font-label-md text-label-md">Classes</span>
            </div>
          </div>
          <div className="mt-auto flex flex-col gap-1 border-t border-outline-variant pt-4">
            <Link href="/help" className="flex items-center gap-3 text-on-surface-variant hover:bg-surface-container-high px-3 py-2 rounded-lg transition-all">
              <span className="material-symbols-outlined">help</span>
              <span className="font-label-md text-label-md">Help</span>
            </Link>
          </div>
        </aside>

        {/* Content Area */}
        <div className="flex-1 md:ml-64 px-margin-mobile md:px-margin-desktop py-8">
          {/* Hero Header Section */}
          <section className="mb-16">
            <div className="relative overflow-hidden rounded-3xl p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-8 bg-surface-container">
              <div className="absolute -right-20 -top-20 w-80 h-80 rounded-full bg-primary-fixed/30 blur-3xl"></div>
              <div className="absolute -left-20 -bottom-20 w-80 h-80 rounded-full bg-secondary-fixed/30 blur-3xl"></div>
              
              <div className="relative z-10 max-w-xl">
                <h2 className="font-display-lg text-[32px] md:text-[48px] font-bold text-on-background mb-2 leading-tight">Welcome to your Learning Journey</h2>
                <p className="font-body-lg text-[18px] text-on-surface-variant">We're excited to have you here! Let's get your profile set up so you can start mastering new skills today.</p>
                <div className="mt-8 flex flex-wrap gap-4">
                  <div className="flex items-center gap-2 bg-surface-container-highest px-4 py-2 rounded-full">
                    <span className="material-symbols-outlined text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>stars</span>
                    <span className="font-label-md text-[14px] font-medium">Level 1 Novice</span>
                  </div>
                </div>
              </div>

              {/* Quick Start Widget (Static UI from HTML) */}
              <div className="relative z-10 bg-white/70 backdrop-blur-xl p-8 rounded-2xl w-full md:w-80 border border-white/40 shadow-[0_4px_20px_-2px_rgba(0,0,0,0.05)]">
                <h3 className="font-headline-md text-[24px] font-semibold text-on-background mb-4">Quick Start</h3>
                <div className="space-y-4">
                  <div className="flex items-start gap-4">
                    <div className="bg-primary/10 p-2 rounded-lg">
                      <span className="material-symbols-outlined text-primary">campaign</span>
                    </div>
                    <div>
                      <p className="font-label-md text-[14px] font-medium text-on-background">Orientation Session</p>
                      <p className="text-xs text-on-surface-variant">Available after registration</p>
                    </div>
                  </div>
                  <button disabled className="w-full py-2 bg-outline-variant text-white font-semibold rounded-xl cursor-not-allowed">
                    Locked
                  </button>
                </div>
              </div>
            </div>
          </section>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Registration Form (Taking place of Set Up Profile) */}
            <section className="lg:col-span-2">
              <div className="bg-surface-container-low rounded-2xl p-8 h-full shadow-[0_0_40px_0_rgba(32,54,189,0.04)] border border-outline-variant/30">
                <div className="flex items-center justify-between mb-8">
                  <h3 className="font-headline-md text-[24px] font-semibold text-on-background">Learner Registration</h3>
                  <span className="text-primary font-bold text-[20px]">Step 1/1</span>
                </div>

                {serverError && (
                  <div className="mb-6 p-4 rounded-xl bg-error-container text-on-error-container text-sm flex items-start gap-2">
                    <span className="material-symbols-outlined text-xl shrink-0">error</span>
                    <span>{serverError}</span>
                  </div>
                )}

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" noValidate>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Learner Name */}
                    <div className="space-y-1.5">
                      <label className="block text-sm font-semibold text-on-surface-variant ml-1">Learner Name</label>
                      <div className="relative">
                        <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline text-xl">person</span>
                        <input
                          type="text"
                          placeholder="Student Name"
                          {...register('learnerName')}
                          className={`w-full pl-12 pr-4 py-3.5 bg-surface-dim/30 border rounded-xl text-sm transition-all outline-none ${errors.learnerName ? 'border-error focus:ring-2 focus:ring-error' : 'border-outline-variant/40 focus:ring-2 focus:ring-primary focus:border-primary'}`}
                        />
                      </div>
                      {errors.learnerName && <p className="text-error text-xs ml-1 flex items-center gap-1 mt-1"><span className="material-symbols-outlined text-sm">error</span>{errors.learnerName.message}</p>}
                    </div>

                    {/* Parent Name */}
                    <div className="space-y-1.5">
                      <label className="block text-sm font-semibold text-on-surface-variant ml-1">Parent/Guardian Name</label>
                      <div className="relative">
                        <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline text-xl">family_restroom</span>
                        <input
                          type="text"
                          placeholder="Parent Name"
                          {...register('parentName')}
                          className={`w-full pl-12 pr-4 py-3.5 bg-surface-dim/30 border rounded-xl text-sm transition-all outline-none ${errors.parentName ? 'border-error focus:ring-2 focus:ring-error' : 'border-outline-variant/40 focus:ring-2 focus:ring-primary focus:border-primary'}`}
                        />
                      </div>
                      {errors.parentName && <p className="text-error text-xs ml-1 flex items-center gap-1 mt-1"><span className="material-symbols-outlined text-sm">error</span>{errors.parentName.message}</p>}
                    </div>

                    {/* Email */}
                    <div className="space-y-1.5">
                      <label className="block text-sm font-semibold text-on-surface-variant ml-1">Email Address</label>
                      <div className="relative">
                        <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline text-xl">mail</span>
                        <input
                          type="email"
                          placeholder="name@example.com"
                          {...register('email')}
                          className={`w-full pl-12 pr-4 py-3.5 bg-surface-dim/30 border rounded-xl text-sm transition-all outline-none ${errors.email ? 'border-error focus:ring-2 focus:ring-error' : 'border-outline-variant/40 focus:ring-2 focus:ring-primary focus:border-primary'}`}
                        />
                      </div>
                      {errors.email && <p className="text-error text-xs ml-1 flex items-center gap-1 mt-1"><span className="material-symbols-outlined text-sm">error</span>{errors.email.message}</p>}
                    </div>

                    {/* Mobile */}
                    <div className="space-y-1.5">
                      <label className="block text-sm font-semibold text-on-surface-variant ml-1">Mobile Number</label>
                      <div className="relative">
                        <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline text-xl">phone</span>
                        <input
                          type="tel"
                          placeholder="98XXXXXXXX"
                          {...register('mobile')}
                          className={`w-full pl-12 pr-4 py-3.5 bg-surface-dim/30 border rounded-xl text-sm transition-all outline-none ${errors.mobile ? 'border-error focus:ring-2 focus:ring-error' : 'border-outline-variant/40 focus:ring-2 focus:ring-primary focus:border-primary'}`}
                        />
                      </div>
                      {errors.mobile && <p className="text-error text-xs ml-1 flex items-center gap-1 mt-1"><span className="material-symbols-outlined text-sm">error</span>{errors.mobile.message}</p>}
                    </div>
                  </div>

                  {/* Interested Course */}
                  <div className="space-y-1.5">
                    <label className="block text-sm font-semibold text-on-surface-variant ml-1">Interested Course</label>
                    <div className="relative">
                      <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline text-xl">auto_stories</span>
                      <select
                        {...register('interestedCourse')}
                        className={`w-full pl-12 pr-4 py-3.5 bg-surface-dim/30 border rounded-xl text-sm transition-all outline-none appearance-none ${errors.interestedCourse ? 'border-error focus:ring-2 focus:ring-error' : 'border-outline-variant/40 focus:ring-2 focus:ring-primary focus:border-primary'}`}
                      >
                        <option value="">Select a course...</option>
                        {INTERESTED_COURSES.map((c) => (
                          <option key={c} value={c}>{c}</option>
                        ))}
                      </select>
                    </div>
                    {errors.interestedCourse && <p className="text-error text-xs ml-1 flex items-center gap-1 mt-1"><span className="material-symbols-outlined text-sm">error</span>{errors.interestedCourse.message}</p>}
                  </div>

                  {/* Profile Photo Upload */}
                  <div className="space-y-1.5">
                    <label className="block text-sm font-semibold text-on-surface-variant ml-1">Profile Photo (Optional)</label>
                    <div className="flex items-center gap-4 group">
                      <div className="w-16 h-16 rounded-full border-2 border-outline-variant flex items-center justify-center overflow-hidden bg-surface-dim/30 relative">
                        {profilePhotoFile ? (
                          <img src={URL.createObjectURL(profilePhotoFile)} alt="Preview" className="w-full h-full object-cover" />
                        ) : (
                          <span className="material-symbols-outlined text-outline-variant text-2xl">add_a_photo</span>
                        )}
                      </div>
                      <div className="flex-1">
                        <input
                          type="file"
                          accept="image/*"
                          id="profilePhoto"
                          className="hidden"
                          {...register('profilePhoto')}
                        />
                        <label htmlFor="profilePhoto" className="inline-flex items-center gap-2 px-4 py-2 border border-outline-variant/40 rounded-xl text-sm font-medium hover:bg-surface-dim/30 cursor-pointer transition-colors text-on-surface">
                          <span className="material-symbols-outlined text-[18px]">upload</span>
                          Choose Photo
                        </label>
                        <p className="text-xs text-on-surface-variant mt-2 ml-1">JPG, PNG or GIF (Max 2MB)</p>
                      </div>
                    </div>
                  </div>

                  {/* Aadhaar (Masked & Disabled) */}
                  <div className="space-y-1.5 p-4 rounded-xl border border-primary/20 bg-primary/5">
                    <label className="block text-sm font-semibold text-primary ml-1 flex items-center gap-2">
                      <span className="material-symbols-outlined text-base">verified_user</span>
                      Aadhaar Verification
                    </label>
                    <p className="text-xs text-on-surface-variant ml-1 mb-2">For your security, this value is completely masked and will not be stored in our database.</p>
                    <div className="relative">
                      <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline text-xl">badge</span>
                      <input
                        type="text"
                        disabled
                        value="•••• •••• ••••"
                        className="w-full pl-12 pr-4 py-3.5 bg-surface-dim/50 border border-outline-variant/20 rounded-xl text-sm text-outline/50 cursor-not-allowed"
                      />
                      {/* Hidden field that tracks the actual form value which is always the redacted string */}
                      <input type="hidden" {...register('aadhaar')} value="[Aadhaar Redacted]" />
                    </div>
                  </div>

                  {/* Terms */}
                  <div className="flex items-start gap-3 mt-4">
                    <input
                      type="checkbox"
                      {...register('termsAccepted')}
                      className="mt-1 w-4 h-4 accent-primary cursor-pointer"
                    />
                    <label className="text-sm text-on-surface-variant">
                      I agree to the <Link href="/terms" className="text-primary hover:underline">Terms & Conditions</Link> and <Link href="/privacy" className="text-primary hover:underline">Privacy Policy</Link>.
                    </label>
                  </div>
                  {errors.termsAccepted && <p className="text-error text-xs ml-1 flex items-center gap-1 mt-1"><span className="material-symbols-outlined text-sm">error</span>{errors.termsAccepted.message}</p>}

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-4 mt-4 bg-primary text-white font-semibold rounded-[12px] shadow-lg hover:shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? (
                      <span className="material-symbols-outlined animate-spin">progress_activity</span>
                    ) : (
                      <>
                        <span>Complete Registration</span>
                        <span className="material-symbols-outlined text-xl">arrow_forward</span>
                      </>
                    )}
                  </button>
                </form>
              </div>
            </section>

            {/* Recommended Courses (Static from HTML) */}
            <section className="lg:col-span-1">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-headline-md text-[24px] font-semibold text-on-background">Explore Programs</h3>
              </div>
              <div className="space-y-4">
                <div className="group bg-surface-container-lowest rounded-2xl overflow-hidden shadow-[0_0_40px_0_rgba(32,54,189,0.04)] hover:-translate-y-1 transition-all duration-300 border border-outline-variant/20">
                  <div className="h-32 w-full relative overflow-hidden bg-primary/10 flex items-center justify-center">
                    <span className="material-symbols-outlined text-4xl text-primary">language</span>
                    <div className="absolute top-3 left-3 bg-primary text-white text-[10px] font-bold px-2 py-1 rounded-full uppercase">Top Rated</div>
                  </div>
                  <div className="p-4">
                    <h4 className="font-headline-sm text-[18px] font-semibold text-on-background mb-1">IELTS Masterclass</h4>
                    <p className="text-sm text-on-surface-variant mb-4 line-clamp-2">Master the Academic & General training modules with expert tutors.</p>
                  </div>
                </div>

                <div className="group bg-surface-container-lowest rounded-2xl overflow-hidden shadow-[0_0_40px_0_rgba(32,54,189,0.04)] hover:-translate-y-1 transition-all duration-300 border border-outline-variant/20">
                  <div className="h-32 w-full relative overflow-hidden bg-secondary/10 flex items-center justify-center">
                    <span className="material-symbols-outlined text-4xl text-secondary">record_voice_over</span>
                    <div className="absolute top-3 left-3 bg-secondary text-white text-[10px] font-bold px-2 py-1 rounded-full uppercase">New</div>
                  </div>
                  <div className="p-4">
                    <h4 className="font-headline-sm text-[18px] font-semibold text-on-background mb-1">Spoken English Pro</h4>
                    <p className="text-sm text-on-surface-variant mb-4 line-clamp-2">Build confidence in public speaking and everyday conversations.</p>
                  </div>
                </div>
              </div>
            </section>

          </div>
        </div>
      </main>
    </div>
  )
}

function TutorOnboarding() {
  return (
    <div className="text-on-surface bg-background font-sans">
      
{/* Top Navigation Bar */}
<header className="sticky top-0 z-50 flex justify-between items-center w-full px-margin-mobile md:px-margin-desktop h-12 md:h-16 bg-surface/90 backdrop-blur-md border-b border-outline-variant">
<div className="flex items-center gap-stack-md">
<span className="font-headline-md text-headline-md font-bold text-primary">Skill Junction</span>
<div className="hidden md:flex items-center gap-gutter ml-stack-lg">
<a className="font-label-md text-label-md text-primary border-b-2 border-primary pb-1" href="#">Dashboard</a>
<a className="font-label-md text-label-md text-on-surface-variant hover:text-primary transition-colors" href="#">Resources</a>
<a className="font-label-md text-label-md text-on-surface-variant hover:text-primary transition-colors" href="#">Support</a>
</div>
</div>
<div className="flex items-center gap-stack-md">
<span className="material-symbols-outlined text-on-surface-variant cursor-pointer">notifications</span>
<div className="w-8 h-8 rounded-full bg-primary-container flex items-center justify-center text-on-primary-container font-bold text-xs">JD</div>
</div>
</header>
<div className="flex min-h-[calc(100vh-64px)] overflow-hidden">
{/* Sidebar (Hidden on mobile) */}
<aside className="hidden md:flex flex-col fixed left-0 top-16 h-[calc(100vh-64px)] w-64 bg-surface-container-low border-r border-outline-variant p-stack-md overflow-y-auto">
<div className="mb-stack-lg px-xs">
<p className="font-label-sm text-label-sm text-outline uppercase tracking-widest mb-stack-sm">Management</p>
<nav className="space-y-1">
<a className="flex items-center gap-stack-sm bg-primary-container text-on-primary-container rounded-lg px-stack-md py-stack-sm font-semibold" href="#">
<span className="material-symbols-outlined">dashboard</span>
<span className="font-label-md text-label-md">Dashboard</span>
</a>
<a className="flex items-center gap-stack-sm text-on-surface-variant hover:bg-surface-container-high transition-all rounded-lg px-stack-md py-stack-sm" href="#">
<span className="material-symbols-outlined">school</span>
<span className="font-label-md text-label-md">Classes</span>
</a>
<a className="flex items-center gap-stack-sm text-on-surface-variant hover:bg-surface-container-high transition-all rounded-lg px-stack-md py-stack-sm" href="#">
<span className="material-symbols-outlined">calendar_today</span>
<span className="font-label-md text-label-md">Calendar</span>
</a>
<a className="flex items-center gap-stack-sm text-on-surface-variant hover:bg-surface-container-high transition-all rounded-lg px-stack-md py-stack-sm" href="#">
<span className="material-symbols-outlined">payments</span>
<span className="font-label-md text-label-md">Earnings</span>
</a>
<a className="flex items-center gap-stack-sm text-on-surface-variant hover:bg-surface-container-high transition-all rounded-lg px-stack-md py-stack-sm" href="#">
<span className="material-symbols-outlined">trending_up</span>
<span className="font-label-md text-label-md">Progress</span>
</a>
<a className="flex items-center gap-stack-sm text-on-surface-variant hover:bg-surface-container-high transition-all rounded-lg px-stack-md py-stack-sm" href="#">
<span className="material-symbols-outlined">settings</span>
<span className="font-label-md text-label-md">Settings</span>
</a>
</nav>
</div>
{/* Tutor Community Widget */}
<div className="mt-auto glass-card p-stack-md border border-outline-variant">
<p className="font-label-md text-label-md font-bold mb-stack-sm">Tutor Community</p>
<p className="font-body-sm text-xs text-on-surface-variant mb-stack-md">Connect with 12k+ expert educators worldwide.</p>
<button className="w-full py-stack-sm bg-primary text-on-primary rounded-lg font-label-md text-label-md hover:opacity-90 transition-opacity">Join Discussion</button>
</div>
<div className="mt-stack-lg pt-stack-md border-t border-outline-variant space-y-1">
<a className="flex items-center gap-stack-sm text-on-surface-variant px-stack-md py-stack-sm" href="#">
<span className="material-symbols-outlined">help</span>
<span className="font-label-md text-label-md">Help Center</span>
</a>
<a className="flex items-center gap-stack-sm text-on-surface-variant px-stack-md py-stack-sm" href="#">
<span className="material-symbols-outlined text-error">logout</span>
<span className="font-label-md text-label-md text-error">Logout</span>
</a>
</div>
</aside>
{/* Main Content Canvas */}
<main className="flex-1 md:ml-64 p-margin-mobile md:p-margin-desktop bg-background min-h-screen">
{/* Header Section */}
<section className="mb-stack-lg">
<h1 className="font-headline-lg text-headline-lg md:font-display-lg md:text-display-lg text-on-background mb-stack-sm">Welcome, Educator</h1>
<p className="font-body-lg text-body-lg text-on-surface-variant max-w-2xl">Your journey to empowering students starts here. Let's get your profile verified and your classroom ready for your first students.</p>
</section>
{/* Grid Layout */}
<div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter items-start">
{/* Left Column: Progress & Setup */}
<div className="lg:col-span-8 space-y-gutter">
{/* Multi-step Verification Progress */}
<div className="glass-card p-stack-lg">
<div className="flex justify-between items-center mb-stack-lg">
<h2 className="font-headline-md text-headline-md text-on-background">Verification Status</h2>
<span className="px-stack-md py-1 bg-secondary-container text-on-secondary-container rounded-full text-xs font-bold">Action Required</span>
</div>
<div className="relative flex items-center justify-between mb-8">
{/* Progress Line */}
<div className="absolute top-1/2 left-0 w-full h-[2px] bg-surface-variant -translate-y-1/2 z-0"></div>
<div className="absolute top-1/2 left-0 w-1/3 h-[2px] bg-primary -translate-y-1/2 z-0"></div>
{/* Steps */}
<div className="relative z-10 flex flex-col items-center gap-stack-sm bg-background px-4">
<div className="w-10 h-10 rounded-full bg-primary text-on-primary flex items-center justify-center shadow-lg">
<span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
</div>
<span className="font-label-md text-label-md font-bold text-primary">ID Verified</span>
</div>
<div className="relative z-10 flex flex-col items-center gap-stack-sm bg-background px-4">
<div className="w-10 h-10 rounded-full border-2 border-primary bg-primary-container text-primary flex items-center justify-center">
<span className="material-symbols-outlined">upload_file</span>
</div>
<span className="font-label-md text-label-md font-bold text-on-surface">Certification</span>
</div>
<div className="relative z-10 flex flex-col items-center gap-stack-sm bg-background px-4">
<div className="w-10 h-10 rounded-full border-2 border-outline bg-surface-container text-outline flex items-center justify-center opacity-50">
<span className="material-symbols-outlined">verified_user</span>
</div>
<span className="font-label-md text-label-md font-bold text-outline">Background</span>
</div>
</div>
<div className="bg-surface-container-low rounded-xl p-stack-md border border-outline-variant flex items-center justify-between">
<div className="flex items-center gap-stack-md">
<span className="material-symbols-outlined text-primary-container bg-primary p-2 rounded-lg">description</span>
<div>
<p className="font-label-md text-label-md font-bold">Pending: Teaching Certificate</p>
<p className="font-body-sm text-xs text-on-surface-variant">Please upload your most recent certification document.</p>
</div>
</div>
<button className="px-stack-lg py-stack-sm bg-primary text-on-primary rounded-lg font-label-md hover:bg-primary/90 transition-colors">Upload</button>
</div>
</div>
{/* Classroom Setup Guide */}
<div className="glass-card overflow-hidden">
<div className="p-stack-lg">
<h2 className="font-headline-md text-headline-md mb-stack-md">Classroom Setup</h2>
<div className="grid grid-cols-1 md:grid-cols-2 gap-stack-md">
<div className="p-stack-md rounded-xl border border-outline-variant hover:border-primary transition-colors cursor-pointer group">
<span className="material-symbols-outlined text-primary-container bg-primary/10 p-3 rounded-xl mb-stack-md group-hover:scale-110 transition-transform">video_camera_front</span>
<h3 className="font-label-md text-label-md font-bold mb-xs">Configure Audio &amp; Video</h3>
<p className="font-body-sm text-sm text-on-surface-variant">Ensure your lighting and camera settings meet professional standards.</p>
</div>
<div className="p-stack-md rounded-xl border border-outline-variant hover:border-primary transition-colors cursor-pointer group">
<span className="material-symbols-outlined text-primary-container bg-primary/10 p-3 rounded-xl mb-stack-md group-hover:scale-110 transition-transform">edit_note</span>
<h3 className="font-label-md text-label-md font-bold mb-xs">Draft First Curriculum</h3>
<p className="font-body-sm text-sm text-on-surface-variant">Use our AI-assisted tool to build your course syllabus in minutes.</p>
</div>
<div className="p-stack-md rounded-xl border border-outline-variant hover:border-primary transition-colors cursor-pointer group">
<span className="material-symbols-outlined text-primary-container bg-primary/10 p-3 rounded-xl mb-stack-md group-hover:scale-110 transition-transform">schedule</span>
<h3 className="font-label-md text-label-md font-bold mb-xs">Set Teaching Hours</h3>
<p className="font-body-sm text-sm text-on-surface-variant">Define your weekly availability for automated booking.</p>
</div>
<div className="p-stack-md rounded-xl border border-outline-variant hover:border-primary transition-colors cursor-pointer group">
<span className="material-symbols-outlined text-primary-container bg-primary/10 p-3 rounded-xl mb-stack-md group-hover:scale-110 transition-transform">payments</span>
<h3 className="font-label-md text-label-md font-bold mb-xs">Payout Details</h3>
<p className="font-body-sm text-sm text-on-surface-variant">Connect your bank account to receive weekly tuition payouts.</p>
</div>
</div>
</div>
<div className="bg-primary/5 py-stack-md px-stack-lg flex justify-between items-center">
<span className="font-body-sm text-sm font-medium text-primary">Need a personalized walkthrough?</span>
<button className="text-primary font-bold hover:underline">Start Tutorial</button>
</div>
</div>
</div>
{/* Right Column: Schedule & Community */}
<div className="lg:col-span-4 space-y-gutter">
{/* Teaching Schedule Preview */}
<div className="glass-card p-stack-lg">
<div className="flex justify-between items-center mb-stack-lg">
<h2 className="font-label-md text-label-md font-bold text-on-background">Teaching Schedule</h2>
<span className="material-symbols-outlined text-on-surface-variant cursor-pointer">open_in_new</span>
</div>
<div className="space-y-stack-md">
{/* Date Item */}
<div className="flex gap-stack-md pb-stack-md border-b border-outline-variant last:border-0 last:pb-0">
<div className="flex flex-col items-center justify-center w-12 h-12 rounded-lg bg-secondary-container text-on-secondary-container">
<span className="text-[10px] font-bold uppercase">Oct</span>
<span className="text-lg font-bold leading-none">14</span>
</div>
<div>
<p className="font-label-md text-label-md font-bold">Orientation Session</p>
<p className="font-body-sm text-xs text-on-surface-variant">09:00 AM — 10:30 AM</p>
</div>
</div>
<div className="flex gap-stack-md pb-stack-md border-b border-outline-variant last:border-0 last:pb-0">
<div className="flex flex-col items-center justify-center w-12 h-12 rounded-lg bg-surface-container text-on-surface-variant">
<span className="text-[10px] font-bold uppercase">Oct</span>
<span className="text-lg font-bold leading-none">15</span>
</div>
<div>
<p className="font-label-md text-label-md font-bold">First Trial Lesson</p>
<p className="font-body-sm text-xs text-on-surface-variant">02:00 PM — 03:00 PM</p>
</div>
</div>
<div className="flex gap-stack-md pb-stack-md border-b border-outline-variant last:border-0 last:pb-0">
<div className="flex flex-col items-center justify-center w-12 h-12 rounded-lg bg-surface-container text-on-surface-variant">
<span className="text-[10px] font-bold uppercase">Oct</span>
<span className="text-lg font-bold leading-none">17</span>
</div>
<div>
<p className="font-label-md text-label-md font-bold">Group Workshop</p>
<p className="font-body-sm text-xs text-on-surface-variant">11:00 AM — 12:30 PM</p>
</div>
</div>
</div>
<button className="w-full mt-stack-lg py-stack-sm bg-surface-container-high text-on-surface-variant rounded-lg font-label-md hover:bg-surface-dim transition-all">View Full Calendar</button>
</div>
{/* Community Highlight Image */}
<div className="relative overflow-hidden rounded-2xl h-64 group cursor-pointer">
<div className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-110" data-alt="A diverse group of professional educators collaborating in a modern, sunlit shared workspace. They are using high-end laptops and digital tablets, surrounded by minimalist wooden furniture and vibrant green indoor plants. The lighting is bright and natural, creating a warm, encouraging atmosphere. The aesthetic is clean and professional with a soft depth of field focusing on their engaged expressions." style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuBRNalgf99scjLCYMU8o1PJtruR0ymasZ8rwQsjQaADRjzdIT8j5oB-HrPzgx0-SpEAugIaiSZUo2jHn5traW38dGEM2rLfq3VKoAqY7QHporGe4pP8C8lxG5QpD9kR9zuWUV3SjN_U0zn04f7BmSDkqZkZkTddX2FERX64UK7iUNqtSQlks0UusAnCw44Da25FXF1UXNxC-BJK-wVKmZA0DnQLpLDg-KfgfUX75gbfoMPRP-9_cPnLcAzQ5yvdcdPhRL3s--Pu9t-8')" }}>
</div>
<div className="absolute inset-0 bg-gradient-to-t from-primary/80 to-transparent"></div>
<div className="absolute bottom-0 left-0 p-stack-lg text-on-primary">
<p className="font-label-md text-label-md font-bold mb-xs">Featured Resource</p>
<h3 className="font-headline-sm text-headline-sm mb-stack-md">Top 10 Virtual Classroom Engagement Tips</h3>
<button className="px-stack-md py-stack-sm bg-white/20 backdrop-blur-md border border-white/30 rounded-lg text-xs font-bold hover:bg-white/40 transition-all">Read Guide</button>
</div>
</div>
</div>
</div>
</main>
</div>
{/* Mobile Navigation (Visible only on small screens) */}
<nav className="md:hidden fixed bottom-0 left-0 w-full bg-surface border-t border-outline-variant flex justify-around items-center h-16 z-50">
<button className="flex flex-col items-center gap-1 text-primary">
<span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>dashboard</span>
<span className="text-[10px] font-bold">Home</span>
</button>
<button className="flex flex-col items-center gap-1 text-on-surface-variant">
<span className="material-symbols-outlined">school</span>
<span className="text-[10px] font-bold">Classes</span>
</button>
<button className="flex flex-col items-center gap-1 text-on-surface-variant">
<span className="material-symbols-outlined">calendar_today</span>
<span className="text-[10px] font-bold">Calendar</span>
</button>
<button className="flex flex-col items-center gap-1 text-on-surface-variant">
<span className="material-symbols-outlined">group</span>
<span className="text-[10px] font-bold">Community</span>
</button>
</nav>
{/* Footer (Standard for Desktop) */}
<footer className="hidden md:flex w-full py-xl px-margin-desktop bg-on-surface text-surface-bright flex-row justify-between items-center gap-md">
<div className="flex flex-col gap-xs">
<span className="font-headline-sm text-headline-sm font-bold text-surface-bright">Skill Junction</span>
<p className="font-body-sm text-body-sm opacity-80">© 2024 Skill Junction. Academic Modernism in Learning.</p>
</div>
<div className="flex gap-gutter">
<a className="font-label-md text-label-md text-surface-variant opacity-80 hover:opacity-100 transition-opacity" href="#">Courses</a>
<a className="font-label-md text-label-md text-surface-variant opacity-80 hover:opacity-100 transition-opacity" href="#">Tutors</a>
<a className="font-label-md text-label-md text-surface-variant opacity-80 hover:opacity-100 transition-opacity" href="#">Privacy Policy</a>
<a className="font-label-md text-label-md text-surface-variant opacity-80 hover:opacity-100 transition-opacity" href="#">Contact</a>
</div>
</footer>


    </div>
  )
}

function RegisterContent() {
  const searchParams = useSearchParams()
  const role = searchParams.get('role')

  if (role === 'tutor') {
    return <TutorOnboarding />
  }

  return <LearnerOnboarding />
}

export default function RegisterPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    }>
      <RegisterContent />
    </Suspense>
  )
}
