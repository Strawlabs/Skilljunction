'use client'

import Link from 'next/link'
import { useParams } from 'next/navigation'
import GlassCard from '@/components/ui/GlassCard'

export default function EnrollSuccessPage() {
  const { id } = useParams()

  return (
    <div className="bg-background min-h-screen flex flex-col font-sans">
      <header className="fixed top-0 w-full z-50 bg-surface/80 backdrop-blur-md h-16 flex items-center px-8 justify-between border-b border-outline-variant/20">
        <Link href="/" className="font-extrabold text-xl text-primary flex items-center gap-2">
          <span className="material-symbols-outlined text-primary text-2xl">school</span>
          Skill Junction
        </Link>
      </header>

      <main className="flex-grow flex items-center justify-center px-4 relative overflow-hidden pt-24 pb-12">
        <div className="absolute top-[-10%] left-[-5%] w-[40%] h-[40%] bg-primary/5 blur-[120px] rounded-full pointer-events-none" />
        <div className="absolute bottom-[-10%] right-[-5%] w-[40%] h-[40%] bg-tertiary/5 blur-[120px] rounded-full pointer-events-none" />

        <div className="w-full max-w-md z-10">
          <GlassCard className="p-8 text-center border border-white/40">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-100 text-green-600 mb-6 shadow-sm">
              <span className="material-symbols-outlined text-4xl">check_circle</span>
            </div>
            <h1 className="text-2xl font-bold text-on-surface mb-3 leading-tight">Enrollment Request Placed!</h1>
            <p className="text-on-surface-variant text-sm mb-6 leading-relaxed">
              We&apos;ve added you to the class roster. Please complete the pending tuition fee payment in the Payment Portal to unlock study resources.
            </p>

            <div className="space-y-3">
              <Link
                href="/payments"
                className="w-full py-3.5 bg-primary text-on-primary text-sm font-bold rounded-xl shadow-lg hover:shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2"
              >
                <span className="material-symbols-outlined text-lg">credit_card</span>
                Open Payment Portal
              </Link>
              <Link
                href="/dashboard/learner"
                className="w-full py-3 border border-outline-variant hover:bg-surface-container text-on-surface text-sm font-bold rounded-xl transition-all flex items-center justify-center"
              >
                Go to Dashboard
              </Link>
            </div>
          </GlassCard>
        </div>
      </main>
    </div>
  )
}
