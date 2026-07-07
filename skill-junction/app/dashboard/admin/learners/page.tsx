'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import DataTable, { Column } from '@/components/ui/DataTable'
import Badge from '@/components/ui/Badge'
import Modal from '@/components/ui/Modal'

interface LearnerData {
  id: string
  full_name: string
  email: string
  created_at: string
  course_title: string
  attendance: string
  quiz_score: string
  payment_status: 'Paid' | 'Overdue' | 'Pending'
}

export default function AdminLearnersPage() {
  const [learners, setLearners] = useState<LearnerData[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedCohort, setSelectedCohort] = useState('All')
  const [selectedPayment, setSelectedPayment] = useState('All')
  const [coursesList, setCoursesList] = useState<string[]>([])
  
  // Modal state for adding a new student link
  const [addOpen, setAddOpen] = useState(false)
  const [newEmail, setNewEmail] = useState('')
  const [newName, setNewName] = useState('')
  const [selectedCourseId, setSelectedCourseId] = useState('')
  const [allCourses, setAllCourses] = useState<{ id: string; title: string }[]>([])
  const [saving, setSaving] = useState(false)

  const supabase = createClient()

  async function loadLearners() {
    setLoading(true)
    try {
      // 1. Get all learners profiles
      const { data: profiles } = await supabase
        .from('profiles')
        .select('*')
        .eq('role', 'learner')

      if (!profiles) return

      // 2. Get enrollments and courses
      const { data: enrollData } = await supabase
        .from('enrollments')
        .select(`
          learner_id,
          status,
          courses:course_id (title)
        `)

      // 3. Get payments to compute payment status
      const { data: paymentData } = await supabase
        .from('payments')
        .select('learner_id, status')

      // Map profiles to full table records
      const mappedList: LearnerData[] = profiles.map((p) => {
        const enrolls = enrollData?.filter(e => e.learner_id === p.id) || []
        const courseTitle = enrolls.map((e: any) => e.courses?.title).filter(Boolean).join(', ') || 'Not Enrolled'
        
        const childPayments = paymentData?.filter(pay => pay.learner_id === p.id) || []
        let paymentStatus: 'Paid' | 'Overdue' | 'Pending' = 'Paid'
        if (childPayments.some(pay => pay.status === 'overdue')) {
          paymentStatus = 'Overdue'
        } else if (childPayments.some(pay => pay.status === 'pending' || pay.status === 'pending_verification')) {
          paymentStatus = 'Pending'
        }

        return {
          id: p.id,
          full_name: p.full_name || 'Anonymous',
          email: p.email || 'learner@company.com',
          created_at: new Date(p.created_at).toLocaleDateString('en-US', {
            day: '2-digit',
            month: 'short',
            year: 'numeric'
          }),
          course_title: courseTitle,
          attendance: '94.2%', // Mock standard
          quiz_score: '84/100', // Mock standard
          payment_status: paymentStatus
        }
      })

      setLearners(mappedList)

      // Gather unique course titles for the select options filter
      const uniqueCourses = Array.from(new Set(mappedList.map(item => item.course_title).filter(title => title !== 'Not Enrolled')))
      setCoursesList(uniqueCourses)

    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  async function loadCourses() {
    const { data } = await supabase.from('courses').select('id, title')
    if (data) setAllCourses(data)
  }

  useEffect(() => {
    loadLearners()
    loadCourses()
  }, [])

  const handleAddLearner = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    try {
      // Create user and enroll
      // Note: Typically you'd create via admin API, here we create profile or seed it directly for UX
      const { data: newProfile, error: profileErr } = await supabase
        .from('profiles')
        .insert({
          id: crypto.randomUUID(), // for mockup/testing DB
          role: 'learner',
          full_name: newName,
        })
        .select()
        .single()

      if (profileErr) throw profileErr

      if (selectedCourseId && newProfile) {
        await supabase.from('enrollments').insert({
          learner_id: newProfile.id,
          course_id: selectedCourseId,
          status: 'active'
        })
      }

      setAddOpen(false)
      setNewName('')
      setNewEmail('')
      setSelectedCourseId('')
      loadLearners()
    } catch (err) {
      console.error(err)
    } finally {
      setSaving(false)
    }
  }

  // Filter list
  const filteredLearners = learners.filter(l => {
    const cohortMatches = selectedCohort === 'All' || l.course_title.includes(selectedCohort)
    const paymentMatches = selectedPayment === 'All' || l.payment_status === selectedPayment
    return cohortMatches && paymentMatches
  })

  const columns: Column<LearnerData>[] = [
    {
      key: 'full_name',
      header: 'Learner Profile',
      sortable: true,
      render: (row) => (
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-bold text-xs">
            {row.full_name.charAt(0).toUpperCase()}
          </div>
          <div>
            <p className="font-semibold text-on-surface leading-snug">{row.full_name}</p>
            <p className="text-[10px] text-on-surface-variant font-medium">Reg: {row.created_at}</p>
          </div>
        </div>
      )
    },
    {
      key: 'course_title',
      header: 'Enrollment',
      sortable: true,
      render: (row) => (
        <div>
          <p className="font-semibold text-on-surface text-xs">{row.course_title}</p>
          <p className="text-[10px] text-on-surface-variant">General Intake</p>
        </div>
      )
    },
    { key: 'attendance', header: 'Attendance', sortable: true },
    { key: 'quiz_score', header: 'Quiz Score', sortable: true },
    {
      key: 'payment_status',
      header: 'Payment Status',
      sortable: true,
      render: (row) => {
        const variants: Record<string, 'success' | 'error' | 'warning'> = {
          Paid: 'success',
          Overdue: 'error',
          Pending: 'warning'
        }
        return <Badge variant={variants[row.payment_status]}>{row.payment_status}</Badge>
      }
    }
  ]

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h2 className="text-3xl font-bold text-on-surface">Learner Management</h2>
          <p className="text-sm text-on-surface-variant mt-1">
            Manage {learners.length} registered learners across all course catalogs.
          </p>
        </div>
        <div className="flex gap-2 w-full md:w-auto">
          <button
            onClick={() => setAddOpen(true)}
            className="flex-1 md:flex-none flex items-center justify-center gap-2 px-5 py-2.5 bg-primary text-on-primary font-semibold rounded-xl hover:opacity-90 shadow-md shadow-primary/20 transition-all active:scale-95 text-sm"
          >
            <span className="material-symbols-outlined text-[20px]">add</span>
            Add Learner
          </button>
        </div>
      </div>

      {/* Stats row */}
      <div className="bg-surface-container-lowest p-6 rounded-2xl border border-outline-variant/30 flex justify-between items-center shadow-sm">
        <div className="flex gap-12">
          <div>
            <p className="text-xs text-on-surface-variant font-medium mb-1">Total Learners</p>
            <p className="text-2xl font-bold text-on-surface">{loading ? '...' : learners.length}</p>
          </div>
          <div>
            <p className="text-xs text-on-surface-variant font-medium mb-1">Avg. Attendance</p>
            <p className="text-2xl font-bold text-on-surface">92.4%</p>
          </div>
          <div>
            <p className="text-xs text-on-surface-variant font-medium mb-1">Avg. Quiz Score</p>
            <p className="text-2xl font-bold text-on-surface">84/100</p>
          </div>
        </div>
      </div>

      {/* DataTable Container */}
      <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/30 p-6 shadow-sm">
        {/* Quick select filters */}
        <div className="flex gap-4 mb-6">
          <select
            value={selectedCohort}
            onChange={(e) => setSelectedCohort(e.target.value)}
            className="bg-surface-container-low border-none rounded-xl px-4 py-2.5 text-xs text-on-surface font-semibold focus:ring-2 focus:ring-primary focus:outline-none"
          >
            <option value="All">Cohort: All</option>
            {coursesList.map(c => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>

          <select
            value={selectedPayment}
            onChange={(e) => setSelectedPayment(e.target.value)}
            className="bg-surface-container-low border-none rounded-xl px-4 py-2.5 text-xs text-on-surface font-semibold focus:ring-2 focus:ring-primary focus:outline-none"
          >
            <option value="All">Payment: All</option>
            <option value="Paid">Paid</option>
            <option value="Pending">Pending</option>
            <option value="Overdue">Overdue</option>
          </select>
        </div>

        <DataTable
          columns={columns}
          data={filteredLearners}
          keyField="id"
          pageSize={10}
          loading={loading}
          emptyMessage="No learners found. Click 'Add Learner' to introduce database records."
        />
      </div>

      {/* Add Learner Modal */}
      <Modal
        open={addOpen}
        onClose={() => setAddOpen(false)}
        title="Register New Learner"
        actions={
          <>
            <button
              onClick={() => setAddOpen(false)}
              className="px-4 py-2 text-xs font-semibold text-on-surface-variant hover:bg-surface-container rounded-xl transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleAddLearner}
              disabled={saving}
              className="px-5 py-2.5 bg-primary text-on-primary text-xs font-semibold rounded-xl hover:opacity-90 disabled:opacity-50 transition-opacity"
            >
              {saving ? 'Saving...' : 'Register Learner'}
            </button>
          </>
        }
      >
        <form onSubmit={handleAddLearner} className="space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-semibold text-on-surface-variant">Full Name</label>
            <input
              type="text"
              required
              value={newName}
              onChange={e => setNewName(e.target.value)}
              placeholder="e.g. Jordan Davies"
              className="w-full px-4 py-2.5 bg-surface border border-outline-variant/60 rounded-xl text-sm focus:ring-2 focus:ring-primary focus:border-primary outline-none"
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-semibold text-on-surface-variant">Email</label>
            <input
              type="email"
              required
              value={newEmail}
              onChange={e => setNewEmail(e.target.value)}
              placeholder="jordan.davies@company.com"
              className="w-full px-4 py-2.5 bg-surface border border-outline-variant/60 rounded-xl text-sm focus:ring-2 focus:ring-primary focus:border-primary outline-none"
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-semibold text-on-surface-variant">Select Enrollment Course</label>
            <select
              value={selectedCourseId}
              onChange={e => setSelectedCourseId(e.target.value)}
              className="w-full px-4 py-2.5 bg-surface border border-outline-variant/60 rounded-xl text-sm focus:ring-2 focus:ring-primary focus:border-primary outline-none"
            >
              <option value="">No enrollment (Register profile only)</option>
              {allCourses.map(course => (
                <option key={course.id} value={course.id}>{course.title}</option>
              ))}
            </select>
          </div>
        </form>
      </Modal>
    </div>
  )
}
