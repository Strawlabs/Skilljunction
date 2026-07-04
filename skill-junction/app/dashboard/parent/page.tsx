'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'
import Badge from '@/components/ui/Badge'
import GlassCard from '@/components/ui/GlassCard'

interface ChildItem {
  id: string
  full_name: string
  avatar_url?: string
}

interface QuizScore {
  id: string
  title: string
  score: number
  date: string
}

interface ScheduleItem {
  id: string
  title: string
  time: string
  tutor: string
  meeting_url: string
}

export default function ParentDashboardPage() {
  const [childrenList, setChildrenList] = useState<ChildItem[]>([])
  const [selectedChild, setSelectedChild] = useState<ChildItem | null>(null)
  const [scores, setScores] = useState<QuizScore[]>([])
  const [schedule, setSchedule] = useState<ScheduleItem[]>([])
  const [feeStatus, setFeeStatus] = useState({
    amount: 240,
    dueDate: 'Oct 30, 2026',
    status: 'Pending Payment',
  })
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  async function loadParentData() {
    setLoading(true)
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      // 1. Get linked children
      const { data: links } = await supabase
        .from('parent_children')
        .select(`
          child_id,
          profiles:child_id (id, full_name, avatar_url)
        `)
        .eq('parent_id', user.id)

      const mappedChildren = (links || []).map((l: any) => ({
        id: l.profiles?.id,
        full_name: l.profiles?.full_name || 'Child',
        avatar_url: l.profiles?.avatar_url
      })).filter(c => c.id)

      setChildrenList(mappedChildren)

      let activeChild = selectedChild
      if (mappedChildren.length > 0 && !activeChild) {
        activeChild = mappedChildren[0]
        setSelectedChild(mappedChildren[0])
      }

      if (activeChild) {
        // 2. Load child quiz scores
        const { data: attempts } = await supabase
          .from('quiz_attempts')
          .select(`
            id,
            score,
            attempted_at,
            quizzes:quiz_id (title)
          `)
          .eq('learner_id', activeChild.id)
          .order('attempted_at', { ascending: false })
          .limit(3)

        const mappedScores = (attempts || []).map((a: any) => ({
          id: a.id,
          title: a.quizzes?.title || 'Course Quiz',
          score: a.score || 0,
          date: new Date(a.attempted_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
        }))
        setScores(mappedScores)

        // 3. Load child schedule
        const { data: enrollments } = await supabase
          .from('enrollments')
          .select('course_id')
          .eq('learner_id', activeChild.id)

        const courseIds = (enrollments || []).map(e => e.course_id)

        if (courseIds.length > 0) {
          const { data: sessData } = await supabase
            .from('sessions')
            .select(`
              id,
              starts_at,
              meeting_url,
              courses:course_id (
                title,
                profiles:tutor_id (full_name)
              )
            `)
            .in('course_id', courseIds)
            .gte('starts_at', new Date().toISOString())
            .order('starts_at', { ascending: true })
            .limit(3)

          const mappedSchedule = (sessData || []).map((s: any) => {
            const date = new Date(s.starts_at)
            return {
              id: s.id,
              title: s.courses?.title || 'Session Class',
              time: date.toLocaleString('en-US', { weekday: 'short', hour: '2-digit', minute: '2-digit' }),
              tutor: s.courses?.profiles?.full_name || 'Tutor',
              meeting_url: s.meeting_url || '#'
            }
          })
          setSchedule(mappedSchedule)
        }

        // 4. Load child fee status
        const { data: payments } = await supabase
          .from('payments')
          .select('amount, due_date, status')
          .eq('learner_id', activeChild.id)
          .order('due_date', { ascending: true })
          .limit(1)

        if (payments && payments.length > 0) {
          const pay = payments[0]
          setFeeStatus({
            amount: Number(pay.amount),
            dueDate: pay.due_date ? new Date(pay.due_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'Soon',
            status: pay.status === 'verified' ? 'Paid' : 'Pending Payment'
          })
        }
      }

    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadParentData()
  }, [selectedChild])

  const defaultChild: ChildItem = { id: 'default', full_name: 'Oliver Vance' }
  const currentChild = selectedChild || defaultChild

  // Mock data fallbacks for showcase
  const displayScores = scores.length > 0 ? scores : [
    { id: '1', title: 'Algebra Basics', score: 92, date: '2 days ago' },
    { id: '2', title: 'Grammar Mastery', score: 85, date: 'Yesterday' },
    { id: '3', title: 'Cell Biology', score: 78, date: '4 days ago' },
  ]

  const displaySchedule = schedule.length > 0 ? schedule : [
    { id: '1', title: 'Advanced Mathematics', time: 'Today, 4:00 PM', tutor: 'Dr. Aris Thorne', meeting_url: 'https://meet.google.com/abc-defg-hij' },
    { id: '2', title: 'History & Civilization', time: 'Tomorrow, 10:00 AM', tutor: 'Sarah Jenkins', meeting_url: '#' },
    { id: '3', title: 'Creative Writing Workshop', time: 'Oct 26, 2:30 PM', tutor: 'Marcus Aurel', meeting_url: '#' },
  ]

  return (
    <div className="space-y-8">
      {/* Header */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-on-surface">Parent Dashboard</h1>
          <p className="text-sm text-on-surface-variant mt-1">Here is your child&apos;s academic and fee tracking overview.</p>
        </div>

        {/* Profile Switcher */}
        <div className="relative w-full md:w-auto">
          <label className="text-[10px] font-bold text-on-surface-variant uppercase mb-1 block ml-1 tracking-wider">
            Active Child Profile
          </label>
          <div className="flex items-center gap-3 bg-white border border-outline-variant px-4 py-2.5 rounded-xl cursor-pointer hover:border-primary hover:shadow-sm transition-all group">
            <div className="w-8 h-8 rounded-full bg-secondary/10 text-secondary flex items-center justify-center">
              <span className="material-symbols-outlined text-lg">face</span>
            </div>
            <div className="flex-1 pr-4 min-w-[120px]">
              {childrenList.length > 0 ? (
                <select
                  value={selectedChild?.id || ''}
                  onChange={(e) => {
                    const found = childrenList.find(c => c.id === e.target.value)
                    if (found) setSelectedChild(found)
                  }}
                  className="bg-transparent border-none text-sm font-semibold text-on-surface outline-none w-full p-0 cursor-pointer"
                >
                  {childrenList.map(c => (
                    <option key={c.id} value={c.id}>{c.full_name}</option>
                  ))}
                </select>
              ) : (
                <span className="text-sm font-semibold text-on-surface">{currentChild.full_name}</span>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Bento Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Recent Attendance */}
        <section className="lg:col-span-8 bg-surface-container-lowest rounded-2xl border border-outline-variant/30 p-6 flex flex-col justify-between">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-secondary/10 text-secondary rounded-lg">
                <span className="material-symbols-outlined text-[20px]">verified</span>
              </div>
              <h2 className="text-lg font-bold text-on-surface">Recent Attendance</h2>
            </div>
            <Link href="/calendar" className="text-primary text-xs font-semibold hover:underline">
              View History
            </Link>
          </div>

          <div className="grid grid-cols-5 gap-3">
            {[
              { day: 'Mon', date: 'Oct 21', attended: true, current: false },
              { day: 'Tue', date: 'Oct 22', attended: true, current: false },
              { day: 'Wed', date: 'Oct 23', attended: true, current: false },
              { day: 'Thu', date: 'Oct 24', attended: false, current: false },
              { day: 'Fri', date: 'Today', attended: true, current: true }
            ].map((day, idx) => (
              <div key={idx} className={`flex flex-col items-center gap-2 p-3 rounded-xl border border-outline-variant/30 hover:border-secondary transition-all ${day.current ? 'bg-primary/5 border-primary/20' : 'bg-surface-container-low'}`}>
                <span className="text-xs text-on-surface-variant font-medium uppercase">{day.day}</span>
                {day.current ? (
                  <div className="w-9 h-9 rounded-full bg-primary-container text-primary flex items-center justify-center animate-pulse">
                    <span className="material-symbols-outlined text-lg">today</span>
                  </div>
                ) : day.attended ? (
                  <div className="w-9 h-9 rounded-full bg-secondary text-on-secondary flex items-center justify-center shadow-sm">
                    <span className="material-symbols-outlined text-lg">check</span>
                  </div>
                ) : (
                  <div className="w-9 h-9 rounded-full bg-error text-on-error flex items-center justify-center shadow-sm">
                    <span className="material-symbols-outlined text-lg">close</span>
                  </div>
                )}
                <span className={`text-[10px] font-semibold ${day.current ? 'text-primary' : 'text-on-surface-variant'}`}>{day.date}</span>
              </div>
            ))}
          </div>

          <div className="mt-6 p-4 bg-tertiary/5 border border-tertiary/10 rounded-xl flex items-start gap-2">
            <span className="material-symbols-outlined text-tertiary text-lg mt-0.5">info</span>
            <p className="text-xs text-on-tertiary-fixed-variant leading-relaxed">
              {currentChild.full_name} was excused on Thursday for a doctor appointment. Leave note uploaded.
            </p>
          </div>
        </section>

        {/* Fee Status Card */}
        <section className="lg:col-span-4 bg-surface-container-lowest rounded-2xl border border-outline-variant/30 p-6 flex flex-col justify-between relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-error/5 rounded-full -mr-16 -mt-16 transition-transform group-hover:scale-110 pointer-events-none" />
          <div className="flex justify-between items-start mb-6 relative z-10">
            <div>
              <h2 className="text-lg font-bold text-on-surface">Fee Status</h2>
              <Badge variant={feeStatus.status === 'Paid' ? 'success' : 'error'} className="mt-2 uppercase tracking-wider text-[9px] font-bold">
                {feeStatus.status}
              </Badge>
            </div>
            <div className="p-2 bg-surface-container-high rounded-lg text-on-surface-variant">
              <span className="material-symbols-outlined text-[22px]">payments</span>
            </div>
          </div>

          <div className="mb-6 relative z-10">
            <p className="text-xs text-on-surface-variant mb-1">Monthly Tuition Fees</p>
            <p className="text-4xl font-extrabold text-on-surface">${feeStatus.amount.toLocaleString()}</p>
            <div className="flex items-center gap-1.5 mt-2 text-on-surface-variant text-xs">
              <span className="material-symbols-outlined text-sm">event</span>
              <p>Due by {feeStatus.dueDate}</p>
            </div>
          </div>

          <div className="space-y-2 relative z-10">
            {feeStatus.status !== 'Paid' && (
              <Link
                href="/payments"
                className="w-full bg-primary text-on-primary py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 hover:shadow-lg hover:brightness-110 transition-all active:scale-[0.98]"
              >
                <span className="material-symbols-outlined text-lg">credit_card</span>
                Pay Tuition Fee
              </Link>
            )}
            <button className="w-full text-on-surface-variant font-semibold text-xs py-2 hover:text-primary transition-colors flex items-center justify-center gap-1">
              <span className="material-symbols-outlined text-base">download</span>
              Download Fee Invoice
            </button>
          </div>
        </section>

        {/* Latest Quiz Scores */}
        <section className="lg:col-span-7 bg-surface-container-lowest rounded-2xl border border-outline-variant/30 p-6">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-primary/10 text-primary rounded-lg">
                <span className="material-symbols-outlined text-[20px]">grade</span>
              </div>
              <h2 className="text-lg font-bold text-on-surface">Latest Quiz Scores</h2>
            </div>
            <Link href="/dashboard/parent/monitor" className="text-primary text-xs font-semibold hover:underline">
              See All
            </Link>
          </div>

          <div className="space-y-4">
            {displayScores.map((score) => (
              <div key={score.id} className="flex items-center justify-between p-3 hover:bg-surface-container-low rounded-xl border border-transparent hover:border-outline-variant transition-all">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-surface-container-highest flex items-center justify-center text-primary">
                    <span className="material-symbols-outlined text-2xl">functions</span>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-on-surface">{score.title}</p>
                    <p className="text-xs text-on-surface-variant flex items-center gap-1.5 mt-0.5">
                      <span className="material-symbols-outlined text-sm">schedule</span> {score.date}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-secondary">{score.score}%</p>
                  <p className="text-[9px] uppercase font-bold text-secondary/80 tracking-widest">
                    {score.score >= 90 ? 'Excellent' : score.score >= 80 ? 'Good' : 'Average'}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Learning Milestone radial */}
        <section className="lg:col-span-5 bg-surface-container-lowest rounded-2xl border border-outline-variant/30 p-6 flex flex-col items-center">
          <div className="w-full text-left mb-4">
            <h2 className="text-lg font-bold text-on-surface">Learning Milestone</h2>
          </div>
          <div className="relative flex items-center justify-center py-4">
            <svg className="w-36 h-36 transform -rotate-90">
              <circle className="text-surface-container-high" cx="72" cy="72" fill="transparent" r="62" stroke="currentColor" strokeWidth="10" />
              <circle className="text-secondary transition-all duration-1000 ease-out" cx="72" cy="72" fill="transparent" r="62" stroke="currentColor" stroke-dasharray="389.5" stroke-dashoffset="97" strokeLinecap="round" strokeWidth="10" />
            </svg>
            <div className="absolute flex flex-col items-center">
              <span className="text-3xl font-bold text-on-surface">75%</span>
              <span className="text-[10px] text-on-surface-variant uppercase tracking-widest font-bold">Path</span>
            </div>
          </div>
          <div className="text-center w-full mt-4">
            <div className="flex items-center justify-center gap-2 mb-4 text-secondary text-sm">
              <span className="material-symbols-outlined">stars</span>
              <p className="font-semibold text-on-surface">5 levels away from &quot;Pro Coder&quot; badge!</p>
            </div>
            <Link
              href="/dashboard/parent/monitor"
              className="w-full py-3 border border-outline-variant text-on-surface font-semibold text-sm rounded-xl hover:bg-surface-container-high transition-all flex items-center justify-center gap-2"
            >
              View Learning Path
              <span className="material-symbols-outlined text-lg">arrow_forward</span>
            </Link>
          </div>
        </section>

        {/* Upcoming Schedule */}
        <section className="col-span-12 bg-surface-container-lowest rounded-2xl border border-outline-variant/30 p-6">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-tertiary/10 text-tertiary rounded-lg">
                <span className="material-symbols-outlined text-[20px]">event_note</span>
              </div>
              <h2 className="text-lg font-bold text-on-surface">Upcoming Schedule</h2>
            </div>
            <Link href="/calendar" className="text-primary text-xs font-semibold flex items-center gap-1 hover:underline">
              Open Calendar
              <span className="material-symbols-outlined text-sm">open_in_new</span>
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {displaySchedule.map((item) => (
              <div key={item.id} className="group bg-primary-container/10 p-5 rounded-xl border-l-4 border-l-primary hover:shadow-md transition-all cursor-pointer">
                <div className="flex justify-between items-start mb-2">
                  <p className="text-primary font-bold text-[10px] uppercase tracking-wider">{item.time}</p>
                  {item.meeting_url !== '#' && (
                    <span className="material-symbols-outlined text-primary text-lg">videocam</span>
                  )}
                </div>
                <h3 className="font-bold text-sm text-on-surface mb-1 group-hover:text-primary transition-colors">{item.title}</h3>
                <p className="text-xs text-on-surface-variant mb-4">Tutor: {item.tutor}</p>
                {item.meeting_url !== '#' ? (
                  <a href={item.meeting_url} target="_blank" rel="noreferrer" className="text-primary font-bold text-xs flex items-center gap-1 group-hover:gap-2 transition-all">
                    Join Session <span className="material-symbols-outlined text-sm">arrow_forward</span>
                  </a>
                ) : (
                  <span className="inline-flex items-center gap-1 text-on-surface-variant/50 text-[10px] font-bold uppercase">
                    <span className="material-symbols-outlined text-sm">lock</span> Waiting
                  </span>
                )}
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}
