'use client'

import { useState, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'

const COURSES = [
  'Spoken English',
  'Spoken Hindi',
  'Advanced Hindi',
  'IELTS',
  'TOEFL',
  'Stress Counselling',
] as const

// ─── Schema ───────────────────────────────────────────────────────────────────
const learnerSchema = z.object({
  learnerName: z.string().min(2, 'At least 2 characters required').max(100),
  parentName: z.string().min(2, 'At least 2 characters required').max(100),
  mobile: z.string().regex(/^[6-9]\d{9}$/, 'Enter a valid 10-digit Indian mobile number'),
  email: z.string().email('Enter a valid email address'),
  interestedCourse: z.enum(COURSES, { message: 'Please select a course' }),
  profilePhoto: z.any().optional(),
  aadhaar: z.string().default('[Aadhaar Redacted]'),
  termsAccepted: z.boolean().refine((v) => v === true, {
    message: 'You must accept the Terms & Conditions',
  }),
})

type LearnerInput = z.infer<typeof learnerSchema>

// ─── Shared Nav ───────────────────────────────────────────────────────────────
function TopNav({ role }: { role: string }) {
  return (
    <header className="sticky top-0 z-50 w-full flex justify-between items-center px-4 md:px-10 h-14 md:h-16 bg-[#f7f9fb]/90 backdrop-blur-md border-b border-[#c5c5d7]">
      <Link href="/" className="text-[#2036bd] font-bold text-xl tracking-tight">
        Skill Junction
      </Link>
      <div className="flex items-center gap-3">
        <span className="text-sm text-[#454654]">
          {role === 'tutor' ? 'Joining as Educator' : 'Joining as Learner'}
        </span>
        <Link
          href="/register?role={role === 'tutor' ? 'learner' : 'tutor'}"
          className="text-sm text-[#2036bd] font-semibold hover:underline"
        >
          Switch to {role === 'tutor' ? 'Learner' : 'Tutor'}
        </Link>
      </div>
    </header>
  )
}

// ─── Learner Onboarding ───────────────────────────────────────────────────────
function LearnerOnboarding() {
  const supabase = createClient()
  const [serverError, setServerError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<LearnerInput>({
    resolver: zodResolver(learnerSchema),
    defaultValues: { aadhaar: '[Aadhaar Redacted]' },
  })

  const profilePhotoList = watch('profilePhoto')
  const profilePhotoFile =
    profilePhotoList && profilePhotoList.length > 0 ? profilePhotoList[0] : null

  const onSubmit = async (data: LearnerInput) => {
    setIsSubmitting(true)
    setServerError('')
    try {
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

      const { error: signUpError } = await supabase.auth.signUp({
        email: data.email,
        password: 'TemporaryPassword123!',
        options: {
          data: {
            full_name: data.learnerName,
            parent_name: data.parentName,
            mobile: data.mobile,
            interested_course: data.interestedCourse,
            role: 'learner',
            aadhaar_status: '[Aadhaar Redacted]',
            terms_accepted: true,
          },
        },
      })

      if (signUpError) throw signUpError
      setSuccess(true)
    } catch (err: unknown) {
      setServerError(
        err instanceof Error ? err.message : 'An error occurred during registration.'
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  if (success) {
    return (
      <div className="min-h-screen bg-[#f7f9fb] flex items-center justify-center p-6">
        <div className="bg-white rounded-3xl p-10 max-w-md w-full text-center shadow-[0_4px_24px_-1px_rgba(0,0,0,0.06)] border border-[#c5c5d7]/40">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-[#d0e1fb] text-[#2036bd] mb-6">
            <span className="material-symbols-outlined text-5xl" style={{ fontVariationSettings: "'FILL' 1" }}>
              check_circle
            </span>
          </div>
          <h2 className="text-2xl font-bold text-[#191c1e] mb-3">You&apos;re all set!</h2>
          <p className="text-[#454654] mb-8 leading-relaxed">
            Welcome to your Learning Journey. Check your email to verify your account and get started.
          </p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-8 py-3.5 bg-[#2036bd] text-white rounded-xl font-semibold hover:bg-[#1d34ba] transition-all hover:shadow-lg hover:shadow-[#2036bd]/20"
          >
            Back to Home
            <span className="material-symbols-outlined text-lg">arrow_forward</span>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#f7f9fb]">
      <TopNav role="learner" />

      {/* Hero Banner */}
      <div className="relative overflow-hidden bg-[#eceef0] border-b border-[#c5c5d7]/30">
        <div className="absolute -right-24 -top-24 w-96 h-96 rounded-full bg-[#dfe0ff]/40 blur-3xl pointer-events-none" />
        <div className="absolute -left-24 -bottom-24 w-96 h-96 rounded-full bg-[#d3e4fe]/30 blur-3xl pointer-events-none" />
        <div className="relative z-10 max-w-5xl mx-auto px-6 md:px-10 py-10 md:py-14 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="max-w-xl">
            <h1 className="text-3xl md:text-5xl font-bold text-[#191c1e] leading-tight mb-3">
              Welcome to your<br className="hidden md:block" /> Learning Journey
            </h1>
            <p className="text-lg text-[#454654] leading-relaxed">
              We&apos;re excited to have you here! Let&apos;s get your profile set up so you can start mastering new skills today.
            </p>
            <div className="flex gap-3 mt-6">
              <div className="flex items-center gap-2 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full border border-[#c5c5d7]/40 shadow-sm">
                <span className="material-symbols-outlined text-[#2036bd] text-base" style={{ fontVariationSettings: "'FILL' 1" }}>stars</span>
                <span className="text-sm font-medium text-[#191c1e]">Level 1 Novice</span>
              </div>
              <div className="flex items-center gap-2 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full border border-[#c5c5d7]/40 shadow-sm">
                <span className="material-symbols-outlined text-[#505f76] text-base" style={{ fontVariationSettings: "'FILL' 1" }}>local_fire_department</span>
                <span className="text-sm font-medium text-[#191c1e]">0 Day Streak</span>
              </div>
            </div>
          </div>
          {/* Quick-start widget */}
          <div className="w-full md:w-72 flex-shrink-0 bg-white/70 backdrop-blur-xl rounded-2xl p-6 border border-white/60 shadow-[0_4px_20px_-2px_rgba(0,0,0,0.06)]">
            <h3 className="font-semibold text-[#191c1e] mb-4">Quick Start</h3>
            <div className="flex items-start gap-3 mb-5">
              <div className="bg-[#2036bd]/10 p-2 rounded-lg flex-shrink-0">
                <span className="material-symbols-outlined text-[#2036bd] text-xl">campaign</span>
              </div>
              <div>
                <p className="text-sm font-medium text-[#191c1e]">Orientation Session</p>
                <p className="text-xs text-[#454654]">Available after registration</p>
              </div>
            </div>
            <button
              disabled
              className="w-full py-2.5 bg-[#c5c5d7] text-[#454654] rounded-xl text-sm font-semibold cursor-not-allowed"
            >
              Complete form to unlock
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-5xl mx-auto px-6 md:px-10 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">

          {/* ── Registration Form ── */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl p-8 shadow-[0_0_40px_0_rgba(32,54,189,0.04)] border border-[#c5c5d7]/30">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-xl font-bold text-[#191c1e]">Learner Registration</h2>
                <span className="text-[#2036bd] font-bold text-sm bg-[#dfe0ff] px-3 py-1 rounded-full">Step 1 of 1</span>
              </div>

              {serverError && (
                <div className="mb-6 p-4 rounded-xl bg-[#ffdad6] text-[#93000a] text-sm flex items-start gap-2">
                  <span className="material-symbols-outlined text-base flex-shrink-0">error</span>
                  <span>{serverError}</span>
                </div>
              )}

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
                {/* Name row */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="space-y-1.5">
                    <label className="block text-sm font-semibold text-[#454654]">Learner Name</label>
                    <div className="relative">
                      <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-[#757686] text-[18px]">person</span>
                      <input
                        type="text"
                        placeholder="Student Name"
                        {...register('learnerName')}
                        className={`w-full pl-11 pr-4 py-3 bg-[#f2f4f6] border rounded-xl text-sm outline-none transition-all ${errors.learnerName ? 'border-[#ba1a1a] focus:ring-2 focus:ring-[#ba1a1a]/30' : 'border-[#c5c5d7] focus:border-[#2036bd] focus:ring-2 focus:ring-[#2036bd]/20'}`}
                      />
                    </div>
                    {errors.learnerName && (
                      <p className="text-[#ba1a1a] text-xs flex items-center gap-1">
                        <span className="material-symbols-outlined text-sm">error</span>
                        {errors.learnerName.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-sm font-semibold text-[#454654]">Parent / Guardian Name</label>
                    <div className="relative">
                      <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-[#757686] text-[18px]">family_restroom</span>
                      <input
                        type="text"
                        placeholder="Parent Name"
                        {...register('parentName')}
                        className={`w-full pl-11 pr-4 py-3 bg-[#f2f4f6] border rounded-xl text-sm outline-none transition-all ${errors.parentName ? 'border-[#ba1a1a] focus:ring-2 focus:ring-[#ba1a1a]/30' : 'border-[#c5c5d7] focus:border-[#2036bd] focus:ring-2 focus:ring-[#2036bd]/20'}`}
                      />
                    </div>
                    {errors.parentName && (
                      <p className="text-[#ba1a1a] text-xs flex items-center gap-1">
                        <span className="material-symbols-outlined text-sm">error</span>
                        {errors.parentName.message}
                      </p>
                    )}
                  </div>
                </div>

                {/* Contact row */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="space-y-1.5">
                    <label className="block text-sm font-semibold text-[#454654]">Email Address</label>
                    <div className="relative">
                      <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-[#757686] text-[18px]">mail</span>
                      <input
                        type="email"
                        placeholder="name@example.com"
                        {...register('email')}
                        className={`w-full pl-11 pr-4 py-3 bg-[#f2f4f6] border rounded-xl text-sm outline-none transition-all ${errors.email ? 'border-[#ba1a1a] focus:ring-2 focus:ring-[#ba1a1a]/30' : 'border-[#c5c5d7] focus:border-[#2036bd] focus:ring-2 focus:ring-[#2036bd]/20'}`}
                      />
                    </div>
                    {errors.email && (
                      <p className="text-[#ba1a1a] text-xs flex items-center gap-1">
                        <span className="material-symbols-outlined text-sm">error</span>
                        {errors.email.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-sm font-semibold text-[#454654]">Mobile Number</label>
                    <div className="relative">
                      <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-[#757686] text-[18px]">phone</span>
                      <input
                        type="tel"
                        placeholder="98XXXXXXXX"
                        {...register('mobile')}
                        className={`w-full pl-11 pr-4 py-3 bg-[#f2f4f6] border rounded-xl text-sm outline-none transition-all ${errors.mobile ? 'border-[#ba1a1a] focus:ring-2 focus:ring-[#ba1a1a]/30' : 'border-[#c5c5d7] focus:border-[#2036bd] focus:ring-2 focus:ring-[#2036bd]/20'}`}
                      />
                    </div>
                    {errors.mobile && (
                      <p className="text-[#ba1a1a] text-xs flex items-center gap-1">
                        <span className="material-symbols-outlined text-sm">error</span>
                        {errors.mobile.message}
                      </p>
                    )}
                  </div>
                </div>

                {/* Course */}
                <div className="space-y-1.5">
                  <label className="block text-sm font-semibold text-[#454654]">Interested Course</label>
                  <div className="relative">
                    <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-[#757686] text-[18px]">auto_stories</span>
                    <select
                      {...register('interestedCourse')}
                      className={`w-full pl-11 pr-4 py-3 bg-[#f2f4f6] border rounded-xl text-sm outline-none transition-all appearance-none ${errors.interestedCourse ? 'border-[#ba1a1a] focus:ring-2 focus:ring-[#ba1a1a]/30' : 'border-[#c5c5d7] focus:border-[#2036bd] focus:ring-2 focus:ring-[#2036bd]/20'}`}
                    >
                      <option value="">Select a course…</option>
                      {COURSES.map((c) => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  </div>
                  {errors.interestedCourse && (
                    <p className="text-[#ba1a1a] text-xs flex items-center gap-1">
                      <span className="material-symbols-outlined text-sm">error</span>
                      {errors.interestedCourse.message}
                    </p>
                  )}
                </div>

                {/* Photo */}
                <div className="space-y-1.5">
                  <label className="block text-sm font-semibold text-[#454654]">Profile Photo <span className="font-normal text-[#757686]">(Optional)</span></label>
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-full border-2 border-[#c5c5d7] bg-[#f2f4f6] flex items-center justify-center overflow-hidden flex-shrink-0">
                      {profilePhotoFile ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={URL.createObjectURL(profilePhotoFile)} alt="Preview" className="w-full h-full object-cover" />
                      ) : (
                        <span className="material-symbols-outlined text-[#757686] text-2xl">add_a_photo</span>
                      )}
                    </div>
                    <div>
                      <input type="file" accept="image/*" id="profilePhoto" className="hidden" {...register('profilePhoto')} />
                      <label
                        htmlFor="profilePhoto"
                        className="inline-flex items-center gap-2 px-4 py-2 border border-[#c5c5d7] rounded-xl text-sm font-medium hover:bg-[#f2f4f6] cursor-pointer transition-colors text-[#191c1e]"
                      >
                        <span className="material-symbols-outlined text-base">upload</span>
                        Choose Photo
                      </label>
                      <p className="text-xs text-[#757686] mt-1.5">JPG, PNG or GIF · Max 2 MB</p>
                    </div>
                  </div>
                </div>

                {/* Aadhaar — masked, privacy-safe */}
                <div className="p-4 rounded-xl border border-[#2036bd]/20 bg-[#2036bd]/5 space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-[#2036bd] text-base">verified_user</span>
                    <span className="text-sm font-semibold text-[#2036bd]">Aadhaar Verification</span>
                  </div>
                  <p className="text-xs text-[#454654]">
                    For your security, this field is fully masked and will not be stored in our systems.
                  </p>
                  <div className="relative">
                    <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-[#757686] text-[18px]">badge</span>
                    <input
                      type="text"
                      disabled
                      value="•••• •••• ••••"
                      className="w-full pl-11 pr-4 py-3 bg-[#e6e8ea] border border-[#c5c5d7]/40 rounded-xl text-sm text-[#757686] cursor-not-allowed"
                    />
                    {/* Hidden field — always sends the safe placeholder */}
                    <input type="hidden" {...register('aadhaar')} value="[Aadhaar Redacted]" />
                  </div>
                </div>

                {/* Terms */}
                <div className="flex items-start gap-3 pt-1">
                  <input
                    type="checkbox"
                    id="terms"
                    {...register('termsAccepted')}
                    className="mt-0.5 w-4 h-4 accent-[#2036bd] cursor-pointer"
                  />
                  <label htmlFor="terms" className="text-sm text-[#454654] cursor-pointer">
                    I agree to the{' '}
                    <Link href="/terms" className="text-[#2036bd] hover:underline font-medium">Terms & Conditions</Link>
                    {' '}and{' '}
                    <Link href="/privacy" className="text-[#2036bd] hover:underline font-medium">Privacy Policy</Link>.
                  </label>
                </div>
                {errors.termsAccepted && (
                  <p className="text-[#ba1a1a] text-xs flex items-center gap-1 -mt-3">
                    <span className="material-symbols-outlined text-sm">error</span>
                    {errors.termsAccepted.message}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-4 bg-[#2036bd] text-white font-semibold rounded-xl shadow-lg shadow-[#2036bd]/20 hover:bg-[#1d34ba] hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100"
                >
                  {isSubmitting ? (
                    <>
                      <span className="material-symbols-outlined animate-spin text-xl">progress_activity</span>
                      Registering…
                    </>
                  ) : (
                    <>
                      <span>Complete Registration</span>
                      <span className="material-symbols-outlined text-xl">arrow_forward</span>
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>

          {/* ── Sidebar: Explore Programs ── */}
          <div className="space-y-5">
            <h3 className="text-lg font-bold text-[#191c1e]">Explore Programs</h3>

            {/* Card 1 */}
            <div className="group bg-white rounded-2xl overflow-hidden border border-[#c5c5d7]/20 hover:-translate-y-1 transition-all duration-300 shadow-[0_0_20px_0_rgba(32,54,189,0.04)]">
              <div className="h-28 relative bg-[#2036bd]/10 flex items-center justify-center">
                <span className="material-symbols-outlined text-5xl text-[#2036bd]">language</span>
                <div className="absolute top-3 left-3 bg-[#2036bd] text-white text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">Top Rated</div>
              </div>
              <div className="p-4">
                <h4 className="font-semibold text-[#191c1e] mb-1">IELTS Masterclass</h4>
                <p className="text-xs text-[#454654] leading-relaxed">Master Academic & General training modules with expert tutors.</p>
              </div>
            </div>

            {/* Card 2 */}
            <div className="group bg-white rounded-2xl overflow-hidden border border-[#c5c5d7]/20 hover:-translate-y-1 transition-all duration-300 shadow-[0_0_20px_0_rgba(32,54,189,0.04)]">
              <div className="h-28 relative bg-[#505f76]/10 flex items-center justify-center">
                <span className="material-symbols-outlined text-5xl text-[#505f76]">record_voice_over</span>
                <div className="absolute top-3 left-3 bg-[#505f76] text-white text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">New</div>
              </div>
              <div className="p-4">
                <h4 className="font-semibold text-[#191c1e] mb-1">Spoken English Pro</h4>
                <p className="text-xs text-[#454654] leading-relaxed">Build confidence in public speaking and everyday conversations.</p>
              </div>
            </div>

            {/* Assessment banner */}
            <div className="bg-[#191c1e] rounded-2xl p-5 text-white">
              <h4 className="font-semibold text-[#f7f9fb] mb-1.5">Not sure where to start?</h4>
              <p className="text-xs text-[#757686] mb-4 leading-relaxed">Take our 5-minute Skills Assessment to find your perfect path.</p>
              <button className="w-full py-2.5 bg-[#2036bd] text-white text-sm font-semibold rounded-xl hover:bg-[#3e52d5] transition-colors">
                Start Assessment
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}

// ─── Tutor Onboarding ─────────────────────────────────────────────────────────
function TutorOnboarding() {
  return (
    <div className="min-h-screen bg-[#f7f9fb]">
      <TopNav role="tutor" />

      {/* Header */}
      <div className="max-w-6xl mx-auto px-6 md:px-10 py-10">
        <h1 className="text-3xl md:text-5xl font-bold text-[#191c1e] mb-3">Welcome, Educator</h1>
        <p className="text-lg text-[#454654] max-w-2xl leading-relaxed">
          Your journey to empowering students starts here. Let&apos;s get your profile verified and your classroom ready.
        </p>
      </div>

      {/* Grid */}
      <div className="max-w-6xl mx-auto px-6 md:px-10 pb-16 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

        {/* Left column */}
        <div className="lg:col-span-8 space-y-8">

          {/* Verification Status */}
          <div className="bg-white rounded-2xl p-8 shadow-[0_4px_24px_-1px_rgba(0,0,0,0.04)] border border-[#c5c5d7]/30">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-xl font-bold text-[#191c1e]">Verification Status</h2>
              <span className="px-3 py-1 bg-[#d0e1fb] text-[#505f76] rounded-full text-xs font-bold">Action Required</span>
            </div>

            {/* Progress stepper */}
            <div className="relative flex items-center justify-between mb-8">
              <div className="absolute top-5 left-0 right-0 h-[2px] bg-[#e0e3e5] z-0" />
              <div className="absolute top-5 left-0 w-1/3 h-[2px] bg-[#2036bd] z-0" />

              {[
                { icon: 'check_circle', label: 'ID Verified', done: true },
                { icon: 'upload_file', label: 'Certification', done: false, active: true },
                { icon: 'verified_user', label: 'Background', done: false },
              ].map((step, i) => (
                <div key={i} className="relative z-10 flex flex-col items-center gap-2 bg-[#f7f9fb] px-4">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center shadow-sm ${step.done ? 'bg-[#2036bd] text-white' : step.active ? 'border-2 border-[#2036bd] bg-[#dfe0ff] text-[#2036bd]' : 'border-2 border-[#c5c5d7] bg-[#eceef0] text-[#757686] opacity-50'}`}>
                    <span className="material-symbols-outlined text-lg" style={step.done ? { fontVariationSettings: "'FILL' 1" } : {}}>{step.icon}</span>
                  </div>
                  <span className={`text-xs font-semibold ${step.done ? 'text-[#2036bd]' : step.active ? 'text-[#191c1e]' : 'text-[#757686]'}`}>{step.label}</span>
                </div>
              ))}
            </div>

            <div className="bg-[#f2f4f6] rounded-xl p-4 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <span className="material-symbols-outlined text-white bg-[#2036bd] p-2 rounded-lg">description</span>
                <div>
                  <p className="text-sm font-bold text-[#191c1e]">Pending: Teaching Certificate</p>
                  <p className="text-xs text-[#454654]">Please upload your most recent certification document.</p>
                </div>
              </div>
              <button className="px-5 py-2.5 bg-[#2036bd] text-white rounded-lg text-sm font-semibold hover:bg-[#1d34ba] transition-colors">
                Upload
              </button>
            </div>
          </div>

          {/* Classroom Setup */}
          <div className="bg-white rounded-2xl overflow-hidden shadow-[0_4px_24px_-1px_rgba(0,0,0,0.04)] border border-[#c5c5d7]/30">
            <div className="p-8">
              <h2 className="text-xl font-bold text-[#191c1e] mb-6">Classroom Setup</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  { icon: 'video_camera_front', title: 'Configure Audio & Video', desc: 'Ensure your lighting and camera settings meet professional standards.' },
                  { icon: 'edit_note', title: 'Draft First Curriculum', desc: 'Use our AI-assisted tool to build your course syllabus in minutes.' },
                  { icon: 'schedule', title: 'Set Teaching Hours', desc: 'Define your weekly availability for automated booking.' },
                  { icon: 'payments', title: 'Payout Details', desc: 'Connect your bank account to receive weekly tuition payouts.' },
                ].map((item, i) => (
                  <div key={i} className="group p-5 rounded-xl border border-[#c5c5d7]/40 hover:border-[#2036bd] transition-colors cursor-pointer">
                    <span className="material-symbols-outlined text-[#2036bd] bg-[#2036bd]/10 p-3 rounded-xl text-2xl mb-3 block w-fit group-hover:scale-110 transition-transform">{item.icon}</span>
                    <h3 className="text-sm font-bold text-[#191c1e] mb-1">{item.title}</h3>
                    <p className="text-xs text-[#454654] leading-relaxed">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-[#2036bd]/5 py-4 px-8 flex justify-between items-center">
              <span className="text-sm font-medium text-[#2036bd]">Need a personalized walkthrough?</span>
              <button className="text-[#2036bd] font-bold text-sm hover:underline">Start Tutorial</button>
            </div>
          </div>
        </div>

        {/* Right column */}
        <div className="lg:col-span-4 space-y-8">

          {/* Teaching Schedule */}
          <div className="bg-white rounded-2xl p-6 shadow-[0_4px_24px_-1px_rgba(0,0,0,0.04)] border border-[#c5c5d7]/30">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-sm font-bold text-[#191c1e]">Teaching Schedule</h2>
              <span className="material-symbols-outlined text-[#454654] text-lg cursor-pointer">open_in_new</span>
            </div>
            <div className="space-y-4">
              {[
                { month: 'Oct', day: '14', title: 'Orientation Session', time: '09:00 AM — 10:30 AM', active: true },
                { month: 'Oct', day: '15', title: 'First Trial Lesson', time: '02:00 PM — 03:00 PM', active: false },
                { month: 'Oct', day: '17', title: 'Group Workshop', time: '11:00 AM — 12:30 PM', active: false },
              ].map((ev, i) => (
                <div key={i} className="flex gap-4 pb-4 border-b border-[#e6e8ea] last:border-0 last:pb-0">
                  <div className={`flex-shrink-0 flex flex-col items-center justify-center w-12 h-12 rounded-lg ${ev.active ? 'bg-[#d0e1fb] text-[#505f76]' : 'bg-[#eceef0] text-[#454654]'}`}>
                    <span className="text-[9px] font-bold uppercase">{ev.month}</span>
                    <span className="text-lg font-bold leading-none">{ev.day}</span>
                  </div>
                  <div>
                    <p className="text-sm font-bold text-[#191c1e]">{ev.title}</p>
                    <p className="text-xs text-[#454654]">{ev.time}</p>
                  </div>
                </div>
              ))}
            </div>
            <button className="w-full mt-5 py-2.5 bg-[#eceef0] text-[#454654] rounded-lg text-sm font-semibold hover:bg-[#e6e8ea] transition-colors">
              View Full Calendar
            </button>
          </div>

          {/* Tutor Community */}
          <div className="bg-white rounded-2xl p-6 border border-[#c5c5d7]/30 shadow-[0_4px_24px_-1px_rgba(0,0,0,0.04)]">
            <p className="text-sm font-bold text-[#191c1e] mb-1.5">Tutor Community</p>
            <p className="text-xs text-[#454654] mb-4 leading-relaxed">Connect with 12k+ expert educators worldwide.</p>
            <button className="w-full py-2.5 bg-[#2036bd] text-white rounded-lg text-sm font-semibold hover:bg-[#1d34ba] transition-colors">
              Join Discussion
            </button>
          </div>

        </div>
      </div>
    </div>
  )
}

// ─── Router ───────────────────────────────────────────────────────────────────
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
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#f7f9fb] flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#2036bd]" />
        </div>
      }
    >
      <RegisterContent />
    </Suspense>
  )
}
