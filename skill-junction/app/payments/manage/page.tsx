'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import DataTable, { Column } from '@/components/ui/DataTable'
import Badge from '@/components/ui/Badge'
import Modal from '@/components/ui/Modal'

interface PendingPayment {
  id: string
  amount: number
  learner_name: string
  learner_id: string
  course_title: string
  payment_proof_url: string
  proof_uploaded_at: string
}

export default function AdminManagePaymentsPage() {
  const [payments, setPayments] = useState<PendingPayment[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedPayment, setSelectedPayment] = useState<PendingPayment | null>(null)
  const [verifyModalOpen, setVerifyModalOpen] = useState(false)
  const [rejectReason, setRejectReason] = useState('')
  const [processing, setProcessing] = useState(false)
  const supabase = createClient()

  async function loadPendingPayments() {
    setLoading(true)
    try {
      const { data } = await supabase
        .from('payments')
        .select(`
          id,
          learner_id,
          amount,
          payment_proof_url,
          proof_uploaded_at,
          profiles:learner_id (full_name),
          courses:course_id (title)
        `)
        .eq('status', 'pending_verification')

      if (data) {
        const mapped: PendingPayment[] = data.map((p: any) => ({
          id: p.id,
          amount: Number(p.amount),
          learner_name: p.profiles?.full_name || 'Anonymous',
          learner_id: p.learner_id,
          course_title: p.courses?.title || 'Tuition Fee',
          payment_proof_url: p.payment_proof_url || '',
          proof_uploaded_at: p.proof_uploaded_at ? new Date(p.proof_uploaded_at).toLocaleString() : '—'
        }))
        setPayments(mapped)
      }
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadPendingPayments()
  }, [])

  const handleVerify = async (approved: boolean) => {
    if (!selectedPayment) return
    setProcessing(true)
    try {
      const status = approved ? 'verified' : 'rejected'
      
      // Update payment record status
      const { error } = await supabase
        .from('payments')
        .update({
          status,
          paid_at: approved ? new Date().toISOString() : null,
          verification_note: approved ? 'Audited successfully' : rejectReason
        })
        .eq('id', selectedPayment.id)

      if (error) throw error

      // Notify learner
      await supabase.from('notifications').insert({
        user_id: selectedPayment.learner_id,
        title: approved ? 'Payment Verified' : 'Payment Proof Rejected',
        message: approved 
          ? `Your tuition fee of $${selectedPayment.amount} has been successfully verified. Study resources unlocked!`
          : `We could not verify your receipt. Reason: ${rejectReason}. Please re-upload in the portal.`,
        type: approved ? 'success' : 'error'
      })

      // If approved, update enrollment progress or status
      if (approved) {
        await supabase
          .from('enrollments')
          .update({ status: 'active' })
          .eq('learner_id', selectedPayment.learner_id)
          .eq('course_id', selectedPayment.id) // or match course
      }

      setVerifyModalOpen(false)
      setSelectedPayment(null)
      setRejectReason('')
      loadPendingPayments()
    } catch (err) {
      console.error(err)
    } finally {
      setProcessing(false)
    }
  }

  const columns: Column<PendingPayment>[] = [
    {
      key: 'learner_name',
      header: 'Learner Profile',
      sortable: true,
      render: (row) => (
        <div>
          <p className="font-semibold text-on-surface text-sm">{row.learner_name}</p>
          <p className="text-[10px] text-on-surface-variant font-medium">Tx ID: #{row.id.slice(0, 8)}</p>
        </div>
      )
    },
    { key: 'course_title', header: 'Tuition Course', sortable: true },
    {
      key: 'amount',
      header: 'Amount Paid',
      sortable: true,
      render: (row) => <span className="font-bold text-on-surface">${row.amount}</span>
    },
    { key: 'proof_uploaded_at', header: 'Upload Date', sortable: true },
    {
      key: 'actions',
      header: 'Receipt Review',
      className: 'text-right',
      render: (row) => (
        <button
          onClick={() => { setSelectedPayment(row); setVerifyModalOpen(true) }}
          className="px-3.5 py-1.5 bg-primary text-on-primary text-xs font-bold rounded-lg hover:opacity-90 transition-opacity"
        >
          Audit Proof
        </button>
      )
    }
  ]

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-bold text-on-surface">Payment Audit Control</h2>
        <p className="text-sm text-on-surface-variant mt-1">
          Verify and audit transaction screenshot receipts uploaded by learners.
        </p>
      </div>

      {/* Main Table */}
      <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/30 p-6 shadow-sm">
        <DataTable
          columns={columns}
          data={payments}
          keyField="id"
          pageSize={10}
          loading={loading}
          emptyMessage="No pending payment proofs awaiting verification review."
        />
      </div>

      {/* Audit Modal */}
      <Modal
        open={verifyModalOpen}
        onClose={() => setVerifyModalOpen(false)}
        title="Audit Receipt Screenshot"
        actions={
          <>
            <button
              onClick={() => handleVerify(false)}
              disabled={processing || !rejectReason}
              className="px-4 py-2 bg-error text-on-error text-xs font-semibold rounded-xl hover:opacity-90 disabled:opacity-50 transition-opacity"
            >
              Reject Proof
            </button>
            <button
              onClick={() => handleVerify(true)}
              disabled={processing}
              className="px-5 py-2.5 bg-primary text-on-primary text-xs font-semibold rounded-xl hover:opacity-90 disabled:opacity-50 transition-opacity"
            >
              {processing ? 'Auditing...' : 'Approve & Verify'}
            </button>
          </>
        }
      >
        {selectedPayment && (
          <div className="space-y-5">
            <div className="space-y-1">
              <p className="text-xs text-on-surface-variant font-medium">Uploaded Receipt Image</p>
              <div className="border border-outline-variant/50 rounded-xl overflow-hidden bg-surface-container-low max-h-64 flex justify-center p-2">
                <img
                  src={selectedPayment.payment_proof_url}
                  alt="Receipt"
                  className="max-h-full object-contain cursor-zoom-in"
                  onClick={() => window.open(selectedPayment.payment_proof_url, '_blank')}
                />
              </div>
              <p className="text-[10px] text-on-surface-variant text-center mt-1">Click image to open full resolution in new tab</p>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-on-surface-variant">Rejection Note (Required only on Reject)</label>
              <textarea
                value={rejectReason}
                onChange={e => setRejectReason(e.target.value)}
                placeholder="State the discrepancy found (e.g. Transaction ID match failure, wrong amount uploaded)..."
                className="w-full px-4 py-2.5 bg-surface border border-outline-variant/60 rounded-xl text-sm focus:ring-2 focus:ring-primary outline-none h-20 resize-none"
              />
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}
