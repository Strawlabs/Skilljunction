'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'
import Badge from '@/components/ui/Badge'
import GlassCard from '@/components/ui/GlassCard'

interface ClassItem {
  id: string
  title: string
  date: string
  time: string
  tutor: string
  meeting_url: string
  day: number
  month: string
}

interface NotificationItem {
  id: string
  title: string
  message: string
  type: string
  time: string
}

export default function LearnerDashboardPage() {
  const [profile, setProfile] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [upcomingClasses, setUpcomingClasses] = useState<ClassItem[]>([])
  const [notifications, setNotifications] = useState<NotificationItem[]>([])
  const [stats, setStats] = useState({
    attendanceRate: 90,
    attendedCount: 18,
    totalCount: 20,
    avgQuizScore: 88,
  })
  const supabase = createClient()

  async function loadDashboard() {
    setLoading(true)
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      // 1. Fetch user profile
      const { data: prof } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()
      setProfile(prof)

      // 2. Fetch enrolled course sessions
      const { data: enrollments } = await supabase
        .from('enrollments')
        .select('course_id')
        .eq('learner_id', user.id)

      const courseIds = (enrollments || []).map(e => e.course_id)

      if (courseIds.length > 0) {
        // Fetch upcoming sessions for these courses
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

        const mapped: ClassItem[] = (sessData || []).map((s: any) => {
          const sDate = new Date(s.starts_at)
          return {
            id: s.id,
            title: s.courses?.title || 'Course Session',
            date: sDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
            time: sDate.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
            tutor: s.courses?.profiles?.full_name || 'Expert Tutor',
            meeting_url: s.meeting_url || '#',
            day: sDate.getDate(),
            month: sDate.toLocaleDateString('en-US', { month: 'short' })
          }
        })
        setUpcomingClasses(mapped)

        // 3. Fetch quiz score average
        const { data: attempts } = await supabase
          .from('quiz_attempts')
          .select('score')
          .eq('learner_id', user.id)

        if (attempts && attempts.length > 0) {
          const avg = Math.round(attempts.reduce((sum, a) => sum + (a.score || 0), 0) / attempts.length)
          setStats(prev => ({ ...prev, avgQuizScore: avg }))
        }
      }

      // 4. Fetch notifications
      const { data: notifData } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(3)

      const mappedNotifs: NotificationItem[] = (notifData || []).map((n: any) => {
        const timeDiff = Date.now() - new Date(n.created_at).getTime()
        const hrs = Math.floor(timeDiff / 3600000)
        return {
          id: n.id,
          title: n.title,
          message: n.message,
          type: n.type || 'info',
          time: hrs < 1 ? 'Just now' : `${hrs} hours ago`
        }
      })
      setNotifications(mappedNotifs)

    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadDashboard()
  }, [])

  const displayClasses = upcomingClasses.length > 0 ? upcomingClasses : [
    { id: '1', title: 'Advanced UI/UX Principles', date: 'Oct 24', time: '14:00 - 15:30', tutor: 'Dr. Sarah Jenkins', meeting_url: 'https://meet.google.com/abc-defg-hij', day: 24, month: 'Oct' },
    { id: '2', title: 'User Psychology & Behavior', date: 'Oct 26', time: '10:00 - 11:30', tutor: 'Prof. Mark Gable', meeting_url: 'https://meet.google.com/abc-defg-hij', day: 26, month: 'Oct' },
  ]

  const displayNotifs = notifications.length > 0 ? notifications : [
    { id: '1', title: 'New Quiz Assigned', message: '"Design Systems Mastery" due in 48 hours.', type: 'info', time: '2 hours ago' },
    { id: '2', title: 'Payment Verification Successful', message: 'Invoice #INV-2024-089 has been marked as paid.', type: 'success', time: '1 day ago' },
    { id: '3', title: 'Tutor Rescheduled Class', message: 'Spoken English class moved to Friday 3:00 PM.', type: 'warning', time: '2 days ago' },
  ]

  const notifIcon: Record<string, string> = {
    info: 'assignment',
    success: 'check_circle',
    warning: 'warning',
    error: 'error'
  }

  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-primary tracking-tight">
            Welcome back, {profile?.full_name || 'Learner'}!
          </h2>
          <p className="text-sm text-on-surface-variant max-w-xl mt-1">
            Keep track of your course progress, attempts, payments and schedule in real time.
          </p>
        </div>
        <div className="flex items-center gap-3 bg-surface-container-lowest p-2 rounded-2xl border border-outline-variant/30 shadow-sm">
          <div className="relative w-12 h-12">
            <div className="rounded-full bg-primary/10 text-primary w-full h-full flex items-center justify-center font-bold border-2 border-primary-fixed">
              {(profile?.full_name || 'L').charAt(0).toUpperCase()}
            </div>
            <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-surface-container-lowest" />
          </div>
          <div className="hidden md:block pr-2">
            <p className="text-sm font-semibold text-on-surface leading-tight">{profile?.full_name}</p>
            <p className="text-[10px] text-on-surface-variant uppercase tracking-wider">Level 3 Learner</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Weekly Performance graph */}
        <div className="md:col-span-8 bg-surface-container-lowest rounded-2xl border border-outline-variant/30 p-6 flex flex-col h-[340px] justify-between">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-lg font-bold text-on-surface">My Academic Performance</h3>
              <p className="text-sm text-on-surface-variant">Average Quiz Score: {stats.avgQuizScore}%</p>
            </div>
            <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-xs font-bold border border-primary/20">
              +4% from last week
            </span>
          </div>

          <div className="flex-grow flex items-end gap-4 h-40 px-2 mt-4">
            {[
              { day: 'Mon', val: 60 },
              { day: 'Tue', val: 75 },
              { day: 'Wed', val: 65 },
              { day: 'Thu', val: 88 },
              { day: 'Fri', val: stats.avgQuizScore, active: true }
            ].map((bar, idx) => (
              <div key={idx} className="flex-1 flex flex-col items-center gap-2 h-full justify-end group relative">
                <div className="absolute -top-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-primary text-white text-[10px] px-2 py-1 rounded font-bold">
                  {bar.val}%
                </div>
                <div className="w-full flex items-end justify-center h-full">
                  <div
                    className={`w-full rounded-t-lg transition-all duration-300 ${
                      bar.active
                        ? 'bg-primary shadow-lg shadow-primary/20 hover:opacity-90'
                        : 'bg-primary/10 hover:bg-primary/20'
                    }`}
                    style={{ height: `${bar.val}%` }}
                  />
                </div>
                <span className={`text-xs ${bar.active ? 'text-primary font-bold' : 'text-on-surface-variant font-medium'}`}>
                  {bar.day}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Attendance dial */}
        <div className="md:col-span-4 bg-surface-container-lowest rounded-2xl border border-outline-variant/30 p-6 flex flex-col items-center justify-center text-center">
          <h3 className="text-lg font-bold text-on-surface self-start mb-4">Attendance</h3>
          <div className="relative w-36 h-36 mb-4">
            <svg className="w-full h-full transform -rotate-90">
              <circle className="text-surface-container-high" cx="72" cy="72" fill="transparent" r="62" stroke="currentColor" strokeWidth="10" />
              <circle
                className="text-primary transition-all duration-1000 ease-out"
                cx="72"
                cy="72"
                fill="transparent"
                r="62"
                stroke="currentColor"
                strokeDasharray="389.5"
                strokeDashoffset={389.5 - (389.5 * stats.attendanceRate) / 100}
                strokeLinecap="round"
                strokeWidth="10"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-3xl font-bold text-on-surface tracking-tighter">{stats.attendanceRate}%</span>
              <span className="text-[10px] text-primary font-bold uppercase tracking-widest">Present</span>
            </div>
          </div>
          <p className="text-xs text-on-surface-variant">
            {stats.attendedCount}/{stats.totalCount} Sessions attended <br />
            <span className="font-semibold text-primary">Great tracking streak!</span>
          </p>
        </div>

        {/* Upcoming Classes */}
        <div className="md:col-span-6 bg-surface-container-lowest rounded-2xl border border-outline-variant/30 p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold text-on-surface">Upcoming Classes</h3>
            <Link href="/calendar" className="text-primary text-xs font-semibold hover:underline">
              View Schedule
            </Link>
          </div>
          <div className="space-y-4">
            {displayClasses.map((item) => (
              <div key={item.id} className="flex items-center gap-4 p-3 rounded-2xl bg-surface-container-low border border-outline-variant/20 hover:border-primary/30 transition-all group">
                <div className="bg-primary text-on-primary p-2.5 rounded-xl text-center min-w-[72px] shadow-sm">
                  <p className="text-[9px] uppercase font-bold opacity-80">{item.month}</p>
                  <p className="text-lg font-bold leading-none mt-0.5">{item.day}</p>
                </div>
                <div className="flex-grow min-w-0">
                  <h4 className="text-sm font-semibold text-on-surface truncate">{item.title}</h4>
                  <p className="text-xs text-on-surface-variant truncate">{item.time} • {item.tutor}</p>
                </div>
                <a
                  href={item.meeting_url}
                  target="_blank"
                  rel="noreferrer"
                  className="bg-primary/5 p-2 rounded-full text-primary hover:bg-primary/10 transition-colors"
                >
                  <span className="material-symbols-outlined text-[20px] block">video_call</span>
                </a>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Notifications */}
        <div className="md:col-span-6 bg-surface-container-lowest rounded-2xl border border-outline-variant/30 p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold text-on-surface">Recent Notifications</h3>
            <Badge variant="error">{displayNotifs.length} NEW</Badge>
          </div>
          <div className="space-y-4 relative pl-3">
            <div className="absolute left-[18px] top-2 bottom-2 w-0.5 bg-outline-variant/30" />
            {displayNotifs.map((notif) => (
              <div key={notif.id} className="flex gap-4 items-start relative">
                <div className="w-8 h-8 flex items-center justify-center bg-primary/10 text-primary rounded-xl z-10 flex-shrink-0">
                  <span className="material-symbols-outlined text-[18px]">{notifIcon[notif.type]}</span>
                </div>
                <div className="flex-grow pb-3 border-b border-outline-variant/10 min-w-0 last:border-b-0">
                  <p className="text-sm font-semibold text-on-surface truncate">{notif.title}</p>
                  <p className="text-xs text-on-surface-variant leading-snug mt-0.5">{notif.message}</p>
                  <p className="text-[9px] text-outline font-bold mt-1 uppercase">{notif.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
