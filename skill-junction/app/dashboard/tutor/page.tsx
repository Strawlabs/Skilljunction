'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'
import Badge from '@/components/ui/Badge'
import GlassCard from '@/components/ui/GlassCard'

interface SessionItem {
  id: string
  title: string
  description: string
  starts_at: string
  ends_at: string
  meeting_url: string
  learner_count: number
  status: string
}

interface QuizItem {
  id: string
  title: string
  status: 'Active' | 'Draft'
  course_title: string
}

export default function TutorDashboardPage() {
  const [profile, setProfile] = useState<any>(null)
  const [sessions, setSessions] = useState<SessionItem[]>([])
  const [quizzes, setQuizzes] = useState<QuizItem[]>([])
  const [stats, setStats] = useState({
    earnings: 4280.50,
    activeLearners: 0,
    avgGrade: 'A-',
    sessionCount: 0,
  })
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  async function loadDashboard() {
    setLoading(true)
    try {
      // 1. Get user profile
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const { data: prof } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()
      setProfile(prof)

      // 2. Fetch today's sessions
      const todayStart = new Date()
      todayStart.setHours(0, 0, 0, 0)
      const todayEnd = new Date()
      todayEnd.setHours(23, 59, 59, 999)

      const { data: sessData } = await supabase
        .from('sessions')
        .select(`
          id,
          starts_at,
          ends_at,
          meeting_url,
          status,
          courses:course_id (title, description)
        `)
        .eq('tutor_id', user.id)
        .gte('starts_at', todayStart.toISOString())
        .lte('starts_at', todayEnd.toISOString())
        .order('starts_at', { ascending: true })

      const mappedSessions: SessionItem[] = (sessData || []).map((s: any) => ({
        id: s.id,
        title: s.courses?.title || 'Private Session',
        description: s.courses?.description || 'Curated module review session',
        starts_at: new Date(s.starts_at).toLocaleTimeString('en-US', {
          hour: '2-digit',
          minute: '2-digit',
          hour12: true
        }),
        ends_at: new Date(s.ends_at).toLocaleTimeString('en-US', {
          hour: '2-digit',
          minute: '2-digit',
          hour12: true
        }),
        meeting_url: s.meeting_url || '#',
        learner_count: 12, // Default mockup participants
        status: s.status || 'scheduled'
      }))
      setSessions(mappedSessions)

      // 3. Fetch active learners (unique learners enrolled in this tutor's courses)
      const { data: coursesData } = await supabase
        .from('courses')
        .select('id')
        .eq('tutor_id', user.id)

      const courseIds = (coursesData || []).map(c => c.id)

      let totalLearners = 0
      if (courseIds.length > 0) {
        const { count } = await supabase
          .from('enrollments')
          .select('*', { count: 'exact', head: true })
          .in('course_id', courseIds)
        totalLearners = count || 0
      }

      // 4. Fetch recent quizzes
      const { data: quizData } = await supabase
        .from('quizzes')
        .select(`
          id,
          title,
          courses:course_id (title)
        `)
        .eq('created_by', user.id)
        .limit(3)

      const mappedQuizzes: QuizItem[] = (quizData || []).map((q: any) => ({
        id: q.id,
        title: q.title,
        status: 'Active',
        course_title: q.courses?.title || 'General'
      }))
      setQuizzes(mappedQuizzes)

      setStats({
        earnings: 1480.00 + (totalLearners * 80),
        activeLearners: totalLearners,
        avgGrade: 'B+',
        sessionCount: mappedSessions.length,
      })

    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadDashboard()
  }, [])

  const displaySessions = sessions.length > 0 ? sessions : [
    { id: '1', title: 'Advanced Linear Algebra', description: 'Module 4: Matrix Transformations · 12 Learners', starts_at: '09:00 AM', ends_at: '10:30 AM', meeting_url: 'https://meet.google.com/abc-defg-hij', learner_count: 12, status: 'scheduled' },
    { id: '2', title: 'Introduction to Python', description: 'Workshop: List Comprehensions · 8 Learners', starts_at: '11:30 AM', ends_at: '01:00 PM', meeting_url: 'https://meet.google.com/abc-defg-hij', learner_count: 8, status: 'scheduled' },
    { id: '3', title: 'Quantum Physics Foundations', description: 'Intro: Wave-Particle Duality · 24 Learners', starts_at: '02:00 PM', ends_at: '03:30 PM', meeting_url: 'https://meet.google.com/abc-defg-hij', learner_count: 24, status: 'scheduled' },
  ]

  const displayQuizzes = quizzes.length > 0 ? quizzes : [
    { id: '1', title: 'Algebra Quiz #2', status: 'Active' as const, course_title: 'Math' },
    { id: '2', title: 'Python Loops Draft', status: 'Draft' as const, course_title: 'Computer Science' },
  ]

  return (
    <div className="space-y-8">
      {/* Header */}
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-on-surface">
            Good Morning, {profile?.full_name || 'Professor'}
          </h1>
          <p className="text-on-surface-variant mt-1 text-sm">
            You have <span className="font-semibold text-primary">{sessions.length || displaySessions.length} classes</span> scheduled for today.
          </p>
        </div>
        <div>
          <div className="glass-card px-6 py-4 rounded-2xl flex items-center gap-4 shadow-sm">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
              <span className="material-symbols-outlined">account_balance_wallet</span>
            </div>
            <div>
              <p className="text-[10px] text-on-surface-variant uppercase tracking-wider font-semibold">Monthly Earnings</p>
              <p className="text-2xl font-bold text-primary">${stats.earnings.toLocaleString('en-US', { minimumFractionDigits: 2 })}</p>
            </div>
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Main session list */}
        <section className="lg:col-span-8 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-on-surface">Today&apos;s Classes</h2>
            <Link href="/calendar" className="text-primary text-xs font-semibold hover:underline flex items-center gap-1">
              View Full Calendar
              <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
            </Link>
          </div>
          <div className="space-y-4">
            {displaySessions.map((session) => (
              <GlassCard key={session.id} accentLeft="primary" hover className="p-6">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                  <div className="flex items-center gap-6">
                    <div className="bg-primary text-on-primary w-16 h-16 rounded-2xl flex flex-col items-center justify-center shadow-md">
                      <span className="text-[10px] uppercase font-bold tracking-widest opacity-80">Time</span>
                      <span className="text-lg font-bold leading-tight">
                        {session.starts_at.split(' ')[0]}
                      </span>
                      <span className="text-[10px] font-bold uppercase">
                        {session.starts_at.split(' ')[1] || 'PM'}
                      </span>
                    </div>
                    <div>
                      <span className="inline-block px-2.5 py-0.5 rounded bg-primary/10 text-primary text-[10px] font-bold mb-1.5 uppercase tracking-wider">
                        Next Session
                      </span>
                      <h3 className="text-lg font-bold text-on-surface">{session.title}</h3>
                      <p className="text-sm text-on-surface-variant">{session.description}</p>
                    </div>
                  </div>
                  <a
                    href={session.meeting_url}
                    target="_blank"
                    rel="noreferrer"
                    className="w-full md:w-auto bg-orange-cta text-white px-6 py-3 rounded-xl font-bold flex items-center justify-center gap-2 hover:opacity-90 shadow-lg shadow-orange-500/20 active:scale-95 transition-all text-sm"
                  >
                    <span className="material-symbols-outlined">videocam</span>
                    Join Meet
                  </a>
                </div>
              </GlassCard>
            ))}
          </div>
        </section>

        {/* Sidebar panels */}
        <aside className="lg:col-span-4 space-y-6">
          {/* Learner progress tracker */}
          <section className="glass-card rounded-2xl p-6 shadow-sm border border-outline-variant/30">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xs font-bold text-on-surface uppercase tracking-widest">Learner Progress</h2>
              <span className="material-symbols-outlined text-outline text-[20px]">trending_up</span>
            </div>
            <div className="flex flex-col gap-6">
              <div className="flex items-center gap-6">
                <div className="relative w-20 h-20 flex items-center justify-center">
                  <svg className="w-full h-full -rotate-90">
                    <circle cx="40" cy="40" fill="transparent" r="34" stroke="#E0E3E5" strokeWidth="8"></circle>
                    <circle cx="40" cy="40" fill="transparent" r="34" stroke="#2036bd" stroke-dasharray="213" stroke-dashoffset="53" strokeLinecap="round" strokeWidth="8"></circle>
                  </svg>
                  <span className="absolute font-bold text-primary text-lg">75%</span>
                </div>
                <div>
                  <p className="font-bold text-on-surface">Target Met</p>
                  <p className="text-xs text-on-surface-variant leading-tight">Course Completion Rate</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 pt-6 border-t border-outline-variant/30">
                <div className="p-4 bg-surface-container-low rounded-xl">
                  <p className="text-[10px] text-on-surface-variant font-bold uppercase mb-1">Active Students</p>
                  <p className="text-xl font-bold text-primary">{loading ? '...' : stats.activeLearners}</p>
                </div>
                <div className="p-4 bg-surface-container-low rounded-xl">
                  <p className="text-[10px] text-on-surface-variant font-bold uppercase mb-1">Avg. Grade</p>
                  <p className="text-xl font-bold text-primary">{stats.avgGrade}</p>
                </div>
              </div>
            </div>
          </section>

          {/* Recent Quizzes */}
          <section className="glass-card rounded-2xl p-6 shadow-sm border border-outline-variant/30">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xs font-bold text-on-surface uppercase tracking-widest">Recent Quizzes</h2>
              <Link
                href="/dashboard/tutor/quizzes"
                className="text-on-primary bg-primary w-8 h-8 rounded-lg flex items-center justify-center hover:shadow-md transition-all"
              >
                <span className="material-symbols-outlined text-[20px]">add</span>
              </Link>
            </div>
            <div className="space-y-3">
              {displayQuizzes.map((quiz) => (
                <Link
                  key={quiz.id}
                  href="/dashboard/tutor/quizzes"
                  className="flex items-center justify-between p-4 rounded-xl bg-white border border-outline-variant/50 hover:bg-surface-container transition-colors group"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                      <span className="material-symbols-outlined text-[20px]">task_alt</span>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-on-surface">{quiz.title}</p>
                      <p className="text-[10px] text-primary font-bold uppercase tracking-widest">
                        {quiz.status}
                      </p>
                    </div>
                  </div>
                  <span className="material-symbols-outlined text-outline group-hover:text-primary group-hover:translate-x-1 transition-all text-[20px]">chevron_right</span>
                </Link>
              ))}
            </div>
          </section>

          {/* Insights CTA */}
          <div className="h-44 rounded-2xl overflow-hidden relative group shadow-md border border-outline-variant/30">
            <img alt="Insights cover" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBm4hn3Wf1ErF5RJ6WAYM9U9M0uXCt1sUmtNhM7Ar1gLvi3M-p7vZYeR8hBevwObAlDBUPmy_2Gs5M7e_tO5q_jMM8yy8ZcLOjZ2SX_WFBgaR9O2y00tbS64GOH5jkrhfPi8v5LtSUA7sk8UTEZ9TjlETepyNW-aQSrz8KO_gCVVwGAofH_wGO70s1NFjyRtAzQighfGRnZ8nAx9ZYnvh31FHOCmeIRCKNm8QmrEMGAXaA_QO0Hh96U7HYLJBOJDX-e2Izxcrm3VQY" />
            <div className="absolute inset-0 bg-gradient-to-t from-primary/95 via-primary/30 to-transparent flex flex-col justify-end p-6">
              <span className="text-[10px] font-bold text-on-primary/70 uppercase tracking-widest mb-1">Insights</span>
              <p className="text-on-primary font-bold text-base leading-tight">Weekly Student Engagement Analysis</p>
              <Link href="/dashboard/tutor/courses" className="mt-3 text-on-primary/90 text-xs font-semibold flex items-center gap-1 hover:text-white transition-colors">
                Explore Data
                <span className="material-symbols-outlined text-[16px]">open_in_new</span>
              </Link>
            </div>
          </div>
        </aside>
      </div>
    </div>
  )
}
