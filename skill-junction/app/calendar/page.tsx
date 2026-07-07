'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'
import Badge from '@/components/ui/Badge'
import Modal from '@/components/ui/Modal'

interface CalendarEvent {
  id: string
  title: string
  starts_at: string
  ends_at: string
  meeting_url: string
  tutor_name: string
  course_id: string
}

export default function CalendarPage() {
  const [events, setEvents] = useState<CalendarEvent[]>([])
  const [loading, setLoading] = useState(true)
  const [userRole, setUserRole] = useState('')
  const [addOpen, setAddOpen] = useState(false)
  const [courses, setCourses] = useState<{ id: string; title: string }[]>([])
  
  // Form fields
  const [title, setTitle] = useState('')
  const [selectedCourseId, setSelectedCourseId] = useState('')
  const [date, setDate] = useState('')
  const [startTime, setStartTime] = useState('09:00')
  const [endTime, setEndTime] = useState('10:30')
  const [meetUrl, setMeetUrl] = useState('')
  const [saving, setSaving] = useState(false)

  const supabase = createClient()

  async function loadCalendar() {
    setLoading(true)
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single()
      
      setUserRole(profile?.role || 'learner')

      // Fetch sessions
      let query = supabase
        .from('sessions')
        .select(`
          id,
          starts_at,
          ends_at,
          meeting_url,
          course_id,
          tutor_id,
          courses:course_id (
            title,
            profiles:tutor_id (full_name)
          )
        `)

      if (profile?.role === 'tutor') {
        query = query.eq('tutor_id', user.id)
      } else if (profile?.role === 'learner') {
        const { data: enrollments } = await supabase
          .from('enrollments')
          .select('course_id')
          .eq('learner_id', user.id)
        
        const courseIds = (enrollments || []).map(e => e.course_id)
        if (courseIds.length > 0) {
          query = query.in('course_id', courseIds)
        }
      }

      const { data: sessions } = await query

      if (sessions) {
        const mapped: CalendarEvent[] = sessions.map((s: any) => ({
          id: s.id,
          title: s.courses?.title || 'Academic Session',
          starts_at: s.starts_at,
          ends_at: s.ends_at,
          meeting_url: s.meeting_url || '#',
          tutor_name: s.courses?.profiles?.full_name || 'Faculty Member',
          course_id: s.course_id
        }))
        setEvents(mapped)
      }

      // If tutor, load their courses for dropdown
      if (profile?.role === 'tutor' || profile?.role === 'admin' || profile?.role === 'super_admin') {
        const coursesQuery = profile.role === 'tutor' 
          ? supabase.from('courses').select('id, title').eq('tutor_id', user.id)
          : supabase.from('courses').select('id, title')
        
        const { data: courseList } = await coursesQuery
        if (courseList) setCourses(courseList)
      }

    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadCalendar()
  }, [])

  const handleAddSession = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedCourseId || !date) return
    setSaving(true)
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const startsAt = new Date(`${date}T${startTime}:00`).toISOString()
      const endsAt = new Date(`${date}T${endTime}:00`).toISOString()

      const { error } = await supabase.from('sessions').insert({
        course_id: selectedCourseId,
        starts_at: startsAt,
        ends_at: endsAt,
        meeting_url: meetUrl || 'https://meet.google.com/new',
        tutor_id: user.id
      })

      if (error) throw error

      setAddOpen(false)
      setTitle('')
      setSelectedCourseId('')
      setMeetUrl('')
      loadCalendar()
    } catch (err) {
      console.error(err)
    } finally {
      setSaving(false)
    }
  }

  // Get current date calendar grid details
  const daysInMonth = 31
  const startDayOffset = 4 // Thursday start for July 2026

  const renderDays = () => {
    const list = []
    // Add offset days
    for (let i = 0; i < startDayOffset; i++) {
      list.push(<div key={`offset-${i}`} className="min-h-[100px] p-2 bg-surface-container-low/40 text-outline-variant/40" />)
    }
    // Add active days
    for (let d = 1; d <= daysInMonth; d++) {
      const dayStr = `2026-07-${String(d).padStart(2, '0')}`
      const dayEvents = events.filter(e => e.starts_at.startsWith(dayStr))

      list.push(
        <div key={d} className="min-h-[100px] p-2 hover:bg-surface-container-low transition-colors border border-outline-variant/10 relative">
          <span className="text-xs font-semibold text-on-surface-variant">{d}</span>
          <div className="mt-1 space-y-1 overflow-hidden">
            {dayEvents.map(e => (
              <a
                key={e.id}
                href={e.meeting_url}
                target="_blank"
                rel="noreferrer"
                className="block px-1.5 py-1 bg-primary/10 text-primary text-[10px] font-bold rounded border-l-2 border-primary truncate hover:bg-primary/20 transition-colors"
                title={`${e.title} by ${e.tutor_name}`}
              >
                {new Date(e.starts_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - {e.title}
              </a>
            ))}
          </div>
        </div>
      )
    }
    return list
  }

  return (
    <div className="bg-background min-h-screen">
      {/* Top Navbar */}
      <header className="sticky top-0 z-50 flex justify-between items-center w-full px-8 h-16 glass-nav border-b border-outline-variant/30">
        <div className="flex items-center gap-10">
          <Link href="/" className="font-extrabold text-xl text-primary tracking-tight">Skill Junction</Link>
          <span className="text-xs font-bold text-on-surface-variant bg-surface-container px-2.5 py-1 rounded-full uppercase tracking-wider">
            Academic Calendar
          </span>
        </div>
        <div className="flex items-center gap-4">
          <Link href="/auth/login" className="text-on-surface-variant font-semibold hover:text-primary text-sm transition-colors">Dashboard</Link>
        </div>
      </header>

      <main className="max-w-container-max mx-auto p-8 space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
          <div>
            <h1 className="text-3xl font-bold text-on-surface">July 2026</h1>
            <p className="text-sm text-on-surface-variant mt-1">Manage scheduled lectures and tutoring sessions.</p>
          </div>
          {(userRole === 'tutor' || userRole === 'admin' || userRole === 'super_admin') && (
            <button
              onClick={() => setAddOpen(true)}
              className="flex items-center justify-center gap-2 px-5 py-2.5 bg-primary text-on-primary font-semibold rounded-xl hover:opacity-90 shadow-md shadow-primary/20 transition-all active:scale-95 text-xs w-full md:w-auto"
            >
              <span className="material-symbols-outlined text-[20px]">add</span>
              Schedule Class
            </button>
          )}
        </div>

        {/* Calendar Frame */}
        <div className="border border-outline-variant/20 rounded-2xl overflow-hidden bg-white shadow-sm flex flex-col">
          {/* Days of Week Header */}
          <div className="grid grid-cols-7 bg-surface-container-low border-b border-outline-variant/20 text-center font-bold text-xs text-on-surface-variant py-3 uppercase tracking-wider">
            <div>Sun</div>
            <div>Mon</div>
            <div>Tue</div>
            <div>Wed</div>
            <div>Thu</div>
            <div>Fri</div>
            <div>Sat</div>
          </div>
          {/* Grid Cells */}
          <div className="grid grid-cols-7 divide-x divide-y divide-outline-variant/10">
            {renderDays()}
          </div>
        </div>
      </main>

      {/* Add Session Modal */}
      <Modal
        open={addOpen}
        onClose={() => setAddOpen(false)}
        title="Schedule Lecturing Class"
        actions={
          <>
            <button
              onClick={() => setAddOpen(false)}
              className="px-4 py-2 text-xs font-semibold text-on-surface-variant hover:bg-surface-container rounded-xl transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleAddSession}
              disabled={saving || !selectedCourseId || !date}
              className="px-5 py-2.5 bg-primary text-on-primary text-xs font-semibold rounded-xl hover:opacity-90 disabled:opacity-50 transition-opacity"
            >
              {saving ? 'Scheduling...' : 'Confirm Class'}
            </button>
          </>
        }
      >
        <form onSubmit={handleAddSession} className="space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-semibold text-on-surface-variant">Select Course</label>
            <select
              required
              value={selectedCourseId}
              onChange={e => setSelectedCourseId(e.target.value)}
              className="w-full px-4 py-2.5 bg-surface border border-outline-variant/60 rounded-xl text-sm focus:ring-2 focus:ring-primary outline-none"
            >
              <option value="">Choose syllabus course...</option>
              {courses.map(c => (
                <option key={c.id} value={c.id}>{c.title}</option>
              ))}
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-on-surface-variant">Date</label>
            <input
              type="date"
              required
              value={date}
              onChange={e => setDate(e.target.value)}
              className="w-full px-4 py-2.5 bg-surface border border-outline-variant/60 rounded-xl text-sm focus:ring-2 focus:ring-primary outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-on-surface-variant">Start Time</label>
              <input
                type="time"
                required
                value={startTime}
                onChange={e => setStartTime(e.target.value)}
                className="w-full px-4 py-2.5 bg-surface border border-outline-variant/60 rounded-xl text-sm focus:ring-2 focus:ring-primary outline-none"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold text-on-surface-variant">End Time</label>
              <input
                type="time"
                required
                value={endTime}
                onChange={e => setEndTime(e.target.value)}
                className="w-full px-4 py-2.5 bg-surface border border-outline-variant/60 rounded-xl text-sm focus:ring-2 focus:ring-primary outline-none"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-on-surface-variant">Google Meet Link</label>
            <input
              type="url"
              value={meetUrl}
              onChange={e => setMeetUrl(e.target.value)}
              placeholder="https://meet.google.com/..."
              className="w-full px-4 py-2.5 bg-surface border border-outline-variant/60 rounded-xl text-sm focus:ring-2 focus:ring-primary outline-none"
            />
          </div>
        </form>
      </Modal>
    </div>
  )
}
