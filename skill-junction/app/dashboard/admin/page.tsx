'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import StatsCard from '@/components/ui/StatsCard'
import Link from 'next/link'
import Badge from '@/components/ui/Badge'

interface Registration {
  id: string
  full_name: string
  course_title: string
  enrolled_at: string
  payment_status: string
}

export default function AdminDashboardPage() {
  const [stats, setStats] = useState({
    learners: 0,
    tutors: 0,
    revenue: 0,
    attendance: '92%',
    pendingFees: 0,
  })
  const [registrations, setRegistrations] = useState<Registration[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  async function loadDashboardData() {
    setLoading(true)
    try {
      // 1. Get learners count
      const { count: learnerCount } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true })
        .eq('role', 'learner')

      // 2. Get tutors count
      const { count: tutorCount } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true })
        .eq('role', 'tutor')

      // 3. Get total revenue (verified payments)
      const { data: verifiedPayments } = await supabase
        .from('payments')
        .select('amount')
        .eq('status', 'verified')

      const totalRevenue = (verifiedPayments || []).reduce((sum, p) => sum + Number(p.amount), 0)

      // 4. Get pending fees
      const { data: pendingPayments } = await supabase
        .from('payments')
        .select('amount')
        .in('status', ['pending', 'pending_verification'])

      const totalPending = (pendingPayments || []).reduce((sum, p) => sum + Number(p.amount), 0)

      // 5. Get recent learner registrations
      const { data: enrollments } = await supabase
        .from('enrollments')
        .select(`
          id,
          enrolled_at,
          status,
          profiles:learner_id (full_name),
          courses:course_id (title)
        `)
        .order('enrolled_at', { ascending: false })
        .limit(5)

      const mappedRegs: Registration[] = (enrollments || []).map((e: any) => ({
        id: e.id,
        full_name: e.profiles?.full_name || 'Anonymous',
        course_title: e.courses?.title || 'Unknown Course',
        enrolled_at: new Date(e.enrolled_at).toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric'
        }),
        payment_status: e.status === 'active' ? 'completed' : 'pending'
      }))

      setStats({
        learners: learnerCount || 0,
        tutors: tutorCount || 0,
        revenue: totalRevenue || 0,
        attendance: '95%',
        pendingFees: totalPending || 0,
      })
      setRegistrations(mappedRegs)
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadDashboardData()
  }, [])

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-on-surface tracking-tight">Academic Overview</h2>
          <p className="text-on-surface-variant text-sm mt-1">Real-time performance metrics for Skill Junction.</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={loadDashboardData}
            className="flex items-center gap-2 px-4 py-2 border border-outline text-on-surface rounded-xl text-sm font-semibold hover:bg-surface-container transition-colors"
          >
            <span className="material-symbols-outlined text-[20px]">refresh</span>
            Refresh Stats
          </button>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
        <StatsCard
          icon="group"
          label="Learners"
          value={loading ? '...' : stats.learners}
          delta="+12%"
          accent="primary"
        />
        <StatsCard
          icon="record_voice_over"
          label="Tutors"
          value={loading ? '...' : stats.tutors}
          delta="+3%"
          accent="secondary"
        />
        <StatsCard
          icon="payments"
          label="Total Revenue"
          value={loading ? '...' : `$${stats.revenue.toLocaleString()}`}
          delta="+18%"
          accent="success"
        />
        <StatsCard
          icon="check_circle"
          label="Attendance"
          value={stats.attendance}
          delta="Steady"
          accent="tertiary"
        />
        <StatsCard
          icon="warning"
          label="Pending Fees"
          value={loading ? '...' : `$${stats.pendingFees.toLocaleString()}`}
          delta="-5%"
          accent="error"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Quiz chart mockup matching Stitch styling */}
        <div className="lg:col-span-8 bg-surface-container-lowest rounded-2xl shadow-sm border border-outline-variant/30 p-6 flex flex-col h-[400px]">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold text-on-surface">Quiz Pass Statistics</h3>
            <div className="relative">
              <select className="appearance-none bg-surface-container-low border border-outline-variant/50 rounded-xl text-xs pl-3 pr-8 py-2 focus:outline-none focus:ring-2 focus:ring-primary/20">
                <option>Last 7 Days</option>
                <option>Last 30 Days</option>
              </select>
              <span className="material-symbols-outlined absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-on-surface-variant text-[16px]">expand_more</span>
            </div>
          </div>
          <div className="flex-1 flex items-end gap-4 px-2">
            {[
              { day: 'Mon', height: 'h-[40%]', active: false },
              { day: 'Tue', height: 'h-[65%]', active: false },
              { day: 'Wed', height: 'h-[85%]', active: false },
              { day: 'Thu', height: 'h-[55%]', active: false },
              { day: 'Fri', height: 'h-[95%]', active: true },
              { day: 'Sat', height: 'h-[30%]', active: false },
              { day: 'Sun', height: 'h-[45%]', active: false },
            ].map((bar, idx) => (
              <div key={idx} className="flex-1 flex flex-col items-center gap-2 h-full justify-end">
                <div className="w-full flex items-end justify-center h-full">
                  <div
                    className={`w-8 rounded-t-lg transition-all duration-300 ${
                      bar.active
                        ? 'bg-primary shadow-lg shadow-primary/20 hover:opacity-90'
                        : 'bg-primary/10 hover:bg-primary/20'
                    } ${bar.height}`}
                  />
                </div>
                <span className={`text-xs ${bar.active ? 'text-primary font-bold' : 'text-on-surface-variant font-medium'}`}>
                  {bar.day}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Engagement hub panel */}
        <div className="lg:col-span-4 bg-primary text-on-primary rounded-2xl p-6 flex flex-col justify-between shadow-xl relative overflow-hidden">
          <div className="relative z-10">
            <h3 className="text-xl font-bold mb-1">Engagement Hub</h3>
            <p className="text-xs opacity-80">Students active in the last 24h.</p>
          </div>
          <div className="relative z-10 flex flex-col items-center justify-center my-6">
            <div className="relative w-36 h-36">
              <svg className="w-full h-full transform -rotate-90">
                <circle className="text-on-primary/10" cx="72" cy="72" fill="transparent" r="64" stroke="currentColor" strokeWidth="12"></circle>
                <circle className="text-on-primary transition-all duration-1000" cx="72" cy="72" fill="transparent" r="64" stroke="currentColor" stroke-dasharray="402.1" stroke-dashoffset="80.4" strokeLinecap="round" strokeWidth="12"></circle>
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-3xl font-bold">85%</span>
                <span className="text-[10px] uppercase tracking-widest opacity-70">Active</span>
              </div>
            </div>
          </div>
          <Link
            href="/dashboard/admin/learners"
            className="relative z-10 w-full py-3 bg-on-primary/10 hover:bg-on-primary/20 rounded-xl text-xs font-semibold text-center transition-colors border border-on-primary/20 backdrop-blur-sm"
          >
            Manage Learners
          </Link>
          <div className="absolute -bottom-16 -right-16 w-56 h-56 bg-white/10 rounded-full blur-3xl pointer-events-none" />
        </div>
      </div>

      {/* Recent registrations list */}
      <div className="bg-surface-container-lowest rounded-2xl shadow-sm border border-outline-variant/30 overflow-hidden">
        <div className="p-6 border-b border-outline-variant/30 flex justify-between items-center">
          <h3 className="text-lg font-bold text-on-surface">Recent Learner Registrations</h3>
          <Link href="/dashboard/admin/learners" className="text-primary text-xs font-bold hover:underline">
            View All Records
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-surface-container-low text-on-surface-variant text-xs">
              <tr>
                <th className="px-6 py-4 font-semibold">Learner Name</th>
                <th className="px-6 py-4 font-semibold">Enrolled Course</th>
                <th className="px-6 py-4 font-semibold">Registration Date</th>
                <th className="px-6 py-4 font-semibold">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/20">
              {loading ? (
                Array.from({ length: 3 }).map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td className="px-6 py-4"><div className="h-4 bg-surface-container rounded w-32" /></td>
                    <td className="px-6 py-4"><div className="h-4 bg-surface-container rounded w-48" /></td>
                    <td className="px-6 py-4"><div className="h-4 bg-surface-container rounded w-24" /></td>
                    <td className="px-6 py-4"><div className="h-6 bg-surface-container rounded-full w-16" /></td>
                  </tr>
                ))
              ) : registrations.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-8 text-center text-on-surface-variant text-xs">
                    No registrations found. Add some learners or seed the database.
                  </td>
                </tr>
              ) : (
                registrations.map(reg => (
                  <tr key={reg.id} className="hover:bg-surface-container-low/50 transition-colors">
                    <td className="px-6 py-4 flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-xs">
                        {reg.full_name.charAt(0).toUpperCase()}
                      </div>
                      <span className="font-semibold text-on-surface">{reg.full_name}</span>
                    </td>
                    <td className="px-6 py-4 text-on-surface-variant">{reg.course_title}</td>
                    <td className="px-6 py-4 text-on-surface-variant">{reg.enrolled_at}</td>
                    <td className="px-6 py-4">
                      <Badge variant={reg.payment_status === 'completed' ? 'success' : 'warning'}>
                        {reg.payment_status}
                      </Badge>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
