'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import DataTable, { Column } from '@/components/ui/DataTable'
import Badge from '@/components/ui/Badge'
import Modal from '@/components/ui/Modal'

interface TutorRecord {
  id: string
  full_name: string
  qualification: string
  experience_years: number
  subjects: string[]
  approval_status: 'pending' | 'approved' | 'rejected'
  rejection_reason?: string
}

export default function AdminTutorsPage() {
  const [tutors, setTutors] = useState<TutorRecord[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedTutor, setSelectedTutor] = useState<TutorRecord | null>(null)
  const [rejectReason, setRejectReason] = useState('')
  const [actionModalOpen, setActionModalOpen] = useState(false)
  const [actionType, setActionType] = useState<'approve' | 'reject'>('approve')
  const [updating, setUpdating] = useState(false)
  const [selectedDept, setSelectedDept] = useState('All')

  const supabase = createClient()

  async function loadTutors() {
    setLoading(true)
    try {
      const { data: tpData, error } = await supabase
        .from('tutor_profiles')
        .select(`
          id,
          qualification,
          experience_years,
          subjects,
          approval_status,
          rejection_reason,
          profiles:id (full_name)
        `)

      if (tpData) {
        const mapped: TutorRecord[] = tpData.map((tp: any) => ({
          id: tp.id,
          full_name: tp.profiles?.full_name || 'Anonymous',
          qualification: tp.qualification || 'Educator',
          experience_years: tp.experience_years || 0,
          subjects: tp.subjects || [],
          approval_status: tp.approval_status,
          rejection_reason: tp.rejection_reason
        }))
        setTutors(mapped)
      }
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadTutors()
  }, [])

  const handleStatusChange = async () => {
    if (!selectedTutor) return
    setUpdating(true)
    try {
      const status = actionType === 'approve' ? 'approved' : 'rejected'
      
      // 1. Update tutor status
      const { error } = await supabase
        .from('tutor_profiles')
        .update({
          approval_status: status,
          rejection_reason: status === 'rejected' ? rejectReason : null
        })
        .eq('id', selectedTutor.id)

      if (error) throw error

      // 2. Create notification for the tutor
      await supabase.from('notifications').insert({
        user_id: selectedTutor.id,
        title: status === 'approved' ? 'Profile Approved' : 'Application Rejected',
        message: status === 'approved' 
          ? 'Congratulations! Your tutor profile has been approved. You now have full dashboard access.'
          : `Your application was not approved. Reason: ${rejectReason}`,
        type: status === 'approved' ? 'success' : 'error'
      })

      setActionModalOpen(false)
      setSelectedTutor(null)
      setRejectReason('')
      loadTutors()
    } catch (err) {
      console.error(err)
    } finally {
      setUpdating(false)
    }
  }

  const pendingTutors = tutors.filter(t => t.approval_status === 'pending')
  const approvedTutors = tutors.filter(t => {
    const deptMatches = selectedDept === 'All' || t.subjects.includes(selectedDept)
    return t.approval_status === 'approved' && deptMatches
  })

  // Gather unique subjects/departments
  const departments = Array.from(new Set(tutors.flatMap(t => t.subjects)))

  const columns: Column<TutorRecord>[] = [
    {
      key: 'full_name',
      header: 'Tutor Name',
      sortable: true,
      render: (row) => (
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-tertiary/10 text-tertiary flex items-center justify-center font-bold text-xs">
            {row.full_name.charAt(0).toUpperCase()}
          </div>
          <div>
            <p className="font-semibold text-on-surface leading-snug">{row.full_name}</p>
            <p className="text-[10px] text-on-surface-variant font-medium">{row.qualification}</p>
          </div>
        </div>
      )
    },
    {
      key: 'subjects',
      header: 'Subjects / Dept.',
      render: (row) => (
        <div className="flex flex-wrap gap-1">
          {row.subjects.length > 0 ? (
            row.subjects.map(s => <span key={s} className="px-2 py-0.5 bg-surface-container text-on-surface-variant rounded text-[10px] font-semibold">{s}</span>)
          ) : (
            <span className="text-xs text-on-surface-variant">—</span>
          )}
        </div>
      )
    },
    { key: 'experience_years', header: 'Exp. Years', sortable: true },
    {
      key: 'rating',
      header: 'Rating',
      render: () => <span className="flex items-center gap-1 font-bold text-xs text-on-surface"><span className="material-symbols-outlined text-amber-400 text-sm">star</span>4.9</span>
    },
    {
      key: 'attendance',
      header: 'Attendance',
      render: () => <span className="text-xs font-semibold">96.8%</span>
    },
    {
      key: 'actions',
      header: 'Actions',
      className: 'text-right',
      render: (row) => (
        <div className="flex justify-end gap-2">
          {row.approval_status === 'pending' && (
            <>
              <button
                onClick={() => { setSelectedTutor(row); setActionType('approve'); setActionModalOpen(true) }}
                className="px-3 py-1 bg-green-100 text-green-700 rounded-lg text-xs font-bold hover:bg-green-200 transition-colors"
              >
                Approve
              </button>
              <button
                onClick={() => { setSelectedTutor(row); setActionType('reject'); setActionModalOpen(true) }}
                className="px-3 py-1 bg-error-container text-on-error-container rounded-lg text-xs font-bold hover:brightness-95 transition-colors"
              >
                Reject
              </button>
            </>
          )}
          {row.approval_status === 'approved' && (
            <span className="text-xs text-green-600 font-bold flex items-center gap-0.5">
              <span className="material-symbols-outlined text-sm">check_circle</span> Approved
            </span>
          )}
        </div>
      )
    }
  ]

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h2 className="text-3xl font-bold text-on-surface">Tutor Management</h2>
          <p className="text-sm text-on-surface-variant mt-1">
            Review faculty metrics, credentials, and approve pending tutor accounts.
          </p>
        </div>
      </div>

      {/* Pending Tutors Approvals Board */}
      {pendingTutors.length > 0 && (
        <section className="bg-amber-50/50 border border-amber-200 rounded-2xl p-6 shadow-sm space-y-4">
          <div className="flex items-center gap-2 text-amber-800">
            <span className="material-symbols-outlined">gavel</span>
            <h3 className="font-bold text-base">Pending Applications ({pendingTutors.length})</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {pendingTutors.map(t => (
              <div key={t.id} className="bg-white border border-outline-variant/30 rounded-xl p-5 shadow-sm flex flex-col justify-between gap-4">
                <div>
                  <h4 className="font-bold text-on-surface text-sm">{t.full_name}</h4>
                  <p className="text-xs text-on-surface-variant font-medium mt-1">Quals: {t.qualification}</p>
                  <p className="text-xs text-on-surface-variant font-medium">Exp: {t.experience_years} years</p>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {t.subjects.map(s => (
                      <span key={s} className="px-2 py-0.5 bg-surface-container text-on-surface-variant rounded text-[9px] font-bold">{s}</span>
                    ))}
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => { setSelectedTutor(t); setActionType('approve'); setActionModalOpen(true) }}
                    className="flex-1 py-2 bg-primary text-on-primary text-xs font-semibold rounded-lg hover:opacity-90 transition-opacity"
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => { setSelectedTutor(t); setActionType('reject'); setActionModalOpen(true) }}
                    className="flex-1 py-2 border border-outline text-on-surface text-xs font-semibold rounded-lg hover:bg-surface-container transition-colors"
                  >
                    Reject
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Faculty Directory Table */}
      <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/30 p-6 shadow-sm">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-bold text-on-surface">Faculty Directory</h3>
          <select
            value={selectedDept}
            onChange={(e) => setSelectedDept(e.target.value)}
            className="bg-surface-container-low border-none rounded-xl px-4 py-2.5 text-xs text-on-surface font-semibold focus:ring-2 focus:ring-primary focus:outline-none"
          >
            <option value="All">All Departments</option>
            {departments.map(d => (
              <option key={d} value={d}>{d}</option>
            ))}
          </select>
        </div>

        <DataTable
          columns={columns}
          data={approvedTutors}
          keyField="id"
          pageSize={10}
          loading={loading}
          emptyMessage="No approved tutors found."
        />
      </div>

      {/* Approve/Reject confirmation dialog */}
      <Modal
        open={actionModalOpen}
        onClose={() => setActionModalOpen(false)}
        title={actionType === 'approve' ? 'Approve Tutor Profile' : 'Reject Tutor Profile'}
        actions={
          <>
            <button
              onClick={() => setActionModalOpen(false)}
              className="px-4 py-2 text-xs font-semibold text-on-surface-variant hover:bg-surface-container rounded-xl transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleStatusChange}
              disabled={updating || (actionType === 'reject' && !rejectReason)}
              className={`px-5 py-2.5 text-on-primary text-xs font-semibold rounded-xl transition-opacity ${actionType === 'approve' ? 'bg-primary' : 'bg-error'}`}
            >
              {updating ? 'Processing...' : actionType === 'approve' ? 'Confirm Approval' : 'Confirm Rejection'}
            </button>
          </>
        }
      >
        <div className="space-y-4">
          <p className="text-sm text-on-surface-variant leading-relaxed">
            Are you sure you want to {actionType} the application for <strong className="text-on-surface">{selectedTutor?.full_name}</strong>?
          </p>
          {actionType === 'reject' && (
            <div className="space-y-1">
              <label className="text-xs font-semibold text-on-surface-variant">Reason for Rejection</label>
              <textarea
                value={rejectReason}
                onChange={e => setRejectReason(e.target.value)}
                placeholder="Please state why the application is rejected (this will be sent to the tutor)..."
                required
                className="w-full px-4 py-2.5 bg-surface border border-outline-variant/60 rounded-xl text-sm focus:ring-2 focus:ring-primary focus:border-primary outline-none h-24 resize-none"
              />
            </div>
          )}
        </div>
      </Modal>
    </div>
  )
}
