'use client'

import { useState, useEffect, useRef } from 'react'
import { createClient } from '@/lib/supabase/client'
import DataTable, { Column } from '@/components/ui/DataTable'
import Badge from '@/components/ui/Badge'
import GlassCard from '@/components/ui/GlassCard'

interface PaymentItem {
  id: string
  amount: number
  status: 'pending' | 'pending_verification' | 'verified' | 'rejected' | 'overdue'
  due_date: string
  paid_at: string | null
  course_title: string
}

export default function LearnerPaymentPage() {
  const [payments, setPayments] = useState<PaymentItem[]>([])
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [selectedPaymentId, setSelectedPaymentId] = useState<string>('')
  const fileInputRef = useRef<HTMLInputElement>(null)
  const supabase = createClient()

  async function loadPayments() {
    setLoading(true)
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      // Fetch student payments
      const { data } = await supabase
        .from('payments')
        .select(`
          id,
          amount,
          status,
          due_date,
          paid_at,
          courses:course_id (title)
        `)
        .eq('learner_id', user.id)
        .order('due_date', { ascending: true })

      if (data) {
        const mapped: PaymentItem[] = data.map((p: any) => ({
          id: p.id,
          amount: Number(p.amount),
          status: p.status,
          due_date: p.due_date ? new Date(p.due_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'Soon',
          paid_at: p.paid_at ? new Date(p.paid_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : null,
          course_title: p.courses?.title || 'Tuition Fee'
        }))
        setPayments(mapped)

        // Select the first pending payment by default
        const pendingPayment = mapped.find(m => m.status === 'pending')
        if (pendingPayment) setSelectedPaymentId(pendingPayment.id)
      }
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadPayments()
  }, [])

  const handleUploadClick = () => {
    if (!selectedPaymentId) {
      alert('Please select which course fee you are uploading proof for.')
      return
    }
    fileInputRef.current?.click()
  }

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file || !selectedPaymentId) return
    setUploading(true)

    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      // 1. Upload proof file to Supabase Storage bucket 'payment-proofs'
      const fileExt = file.name.split('.').pop()
      const filePath = `${user.id}/${selectedPaymentId}-${Date.now()}.${fileExt}`

      const { data: uploadData, error: uploadErr } = await supabase.storage
        .from('payment-proofs')
        .upload(filePath, file, { cacheControl: '3600', upsert: true })

      if (uploadErr) throw uploadErr

      const publicUrl = supabase.storage.from('payment-proofs').getPublicUrl(filePath).data.publicUrl

      // 2. Update payment record
      const { error: updateErr } = await supabase
        .from('payments')
        .update({
          status: 'pending_verification',
          payment_proof_url: publicUrl,
          proof_uploaded_at: new Date().toISOString()
        })
        .eq('id', selectedPaymentId)

      if (updateErr) throw updateErr

      // 3. Notify admin
      const { data: admins } = await supabase.from('profiles').select('id').in('role', ['admin', 'super_admin'])
      if (admins && admins.length > 0) {
        const notificationsToInsert = admins.map(admin => ({
          user_id: admin.id,
          title: 'New Payment Receipt Uploaded',
          message: `A student has uploaded a payment proof of receipt for evaluation.`,
          type: 'info'
        }))
        await supabase.from('notifications').insert(notificationsToInsert)
      }

      alert('Payment proof uploaded successfully! Our administration will review and verify it shortly.')
      loadPayments()
    } catch (err: any) {
      console.error(err)
      alert(`Upload failed: ${err.message}`)
    } finally {
      setUploading(false)
    }
  }

  const outstandingAmt = payments.filter(p => p.status === 'pending' || p.status === 'overdue').reduce((sum, p) => sum + p.amount, 0)
  const inReviewAmt = payments.filter(p => p.status === 'pending_verification').reduce((sum, p) => sum + p.amount, 0)

  const columns: Column<PaymentItem>[] = [
    { key: 'course_title', header: 'Course', sortable: true },
    {
      key: 'amount',
      header: 'Amount',
      sortable: true,
      render: (row) => <span className="font-bold text-on-surface">${row.amount}</span>
    },
    { key: 'due_date', header: 'Due Date', sortable: true },
    {
      key: 'status',
      header: 'Status',
      sortable: true,
      render: (row) => {
        const variants: Record<string, 'success' | 'warning' | 'error' | 'neutral'> = {
          verified: 'success',
          pending: 'neutral',
          pending_verification: 'warning',
          overdue: 'error',
          rejected: 'error'
        }
        const labels: Record<string, string> = {
          verified: 'Verified',
          pending: 'Pending',
          pending_verification: 'Awaiting Verification',
          overdue: 'Overdue',
          rejected: 'Proof Rejected'
        }
        return <Badge variant={variants[row.status]}>{labels[row.status]}</Badge>
      }
    }
  ]

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-on-surface">Tuition Payment Portal</h1>
        <p className="text-sm text-on-surface-variant mt-1">Track your course fees, scan to pay, and upload verification records.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Outstanding Card */}
          <div className="relative overflow-hidden rounded-3xl p-6 bg-primary text-on-primary shadow-xl group">
            <div className="absolute -right-12 -top-12 w-48 h-48 bg-on-primary/10 rounded-full blur-3xl" />
            <div className="relative z-10 flex flex-col justify-between h-full min-h-[140px]">
              <div>
                <p className="text-xs text-on-primary/70 uppercase tracking-widest mb-1">Total Outstanding</p>
                <h2 className="text-3xl font-bold">${loading ? '...' : outstandingAmt.toLocaleString()}</h2>
              </div>
            </div>
          </div>

          {/* In Review Card */}
          <div className="relative overflow-hidden rounded-3xl p-6 glass-card border border-outline-variant/30 shadow-sm flex flex-col justify-between min-h-[140px]">
            <div>
              <p className="text-xs text-on-surface-variant uppercase tracking-widest mb-1">In Verification Review</p>
              <h2 className="text-3xl font-bold text-primary">${loading ? '...' : inReviewAmt.toLocaleString()}</h2>
            </div>
            <div className="flex items-center gap-1.5 mt-2 text-on-surface-variant text-xs font-semibold">
              <span className="material-symbols-outlined text-sm">verified_user</span>
              <span>Awaiting admin check</span>
            </div>
          </div>
        </div>

        {/* QR Scan to Pay */}
        <div className="lg:col-span-4 bg-surface-container-lowest p-6 rounded-3xl border border-outline-variant/30 shadow-sm flex flex-col items-center text-center space-y-4">
          <div className="text-sm font-bold text-on-surface">Scan Institution UPI QR</div>
          <div className="p-2 bg-white rounded-2xl border border-outline-variant/50">
            {/* Standard static mock UPI payment QR code */}
            <img alt="UPI QR" className="w-24 h-24 object-contain" src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=upi://pay?pa=skilljunction@bank" />
          </div>
          <p className="text-xs text-on-surface-variant">Instant processing via UPI, GPay, or Net Banking</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Upload Proof */}
        <div className="lg:col-span-7 bg-surface-container-lowest p-6 rounded-3xl border border-outline-variant/30 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-bold text-on-surface">Upload Proof of Payment</h3>
            <span className="material-symbols-outlined text-outline cursor-help text-sm" title="Upload receipt screenshot/PDF (Max 10MB)">info</span>
          </div>

          <div className="space-y-4">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-on-surface-variant">Select Fee Statement to pay</label>
              <select
                value={selectedPaymentId}
                onChange={e => setSelectedPaymentId(e.target.value)}
                className="w-full px-4 py-2.5 bg-surface border border-outline-variant/60 rounded-xl text-sm focus:ring-2 focus:ring-primary outline-none"
              >
                <option value="">Choose Pending Invoice...</option>
                {payments.filter(p => p.status === 'pending' || p.status === 'overdue').map(p => (
                  <option key={p.id} value={p.id}>{p.course_title} — ${p.amount}</option>
                ))}
              </select>
            </div>

            <div
              onClick={handleUploadClick}
              className="border-2 border-dashed border-outline-variant hover:border-primary hover:bg-primary/5 rounded-2xl p-8 flex flex-col items-center justify-center space-y-3 transition-all cursor-pointer group"
            >
              <div className="w-12 h-12 bg-surface-container rounded-2xl flex items-center justify-center group-hover:bg-primary group-hover:text-on-primary transition-all duration-300">
                <span className="material-symbols-outlined text-2xl">upload_file</span>
              </div>
              <div className="text-center">
                <p className="text-sm font-bold text-on-surface">Click to browse transaction receipt</p>
                <p className="text-xs text-on-surface-variant">Accepts JPG, PNG, or PDF files</p>
              </div>
              <input
                ref={fileInputRef}
                onChange={handleFileChange}
                className="hidden"
                type="file"
                accept="image/*,application/pdf"
              />
              <button
                type="button"
                className="px-6 py-2 bg-primary text-on-primary rounded-xl text-xs font-bold hover:shadow-lg transition-all"
              >
                {uploading ? 'Uploading...' : 'Select File'}
              </button>
            </div>
          </div>
        </div>

        {/* Promo Cover */}
        <div className="lg:col-span-5 relative rounded-3xl overflow-hidden shadow-sm group">
          <img alt="Promo" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000" src="https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=500" />
          <div className="absolute inset-0 bg-gradient-to-t from-on-surface/90 via-on-surface/40 to-transparent p-6 flex flex-col justify-end">
            <div className="bg-primary/25 backdrop-blur-md border border-white/10 p-5 rounded-2xl">
              <h4 className="text-sm font-bold text-white mb-1">Upfront Semester Discount</h4>
              <p className="text-xs text-white/80 mb-3">Clear full tuition fees ahead of intake to save 15% immediately.</p>
              <button className="w-full py-2 bg-white text-primary rounded-xl text-xs font-bold hover:bg-surface-container-lowest transition-colors">
                Apply Offer
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-surface-container-lowest rounded-3xl shadow-sm border border-outline-variant/30 overflow-hidden">
        <div className="p-6 border-b border-outline-variant/30">
          <h3 className="text-base font-bold text-on-surface">Payment History Log</h3>
        </div>
        <DataTable
          columns={columns}
          data={payments}
          keyField="id"
          pageSize={10}
          loading={loading}
          emptyMessage="No billing ledger entries listed."
        />
      </div>
    </div>
  )
}
