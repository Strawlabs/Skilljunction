'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import DataTable, { Column } from '@/components/ui/DataTable'
import Badge from '@/components/ui/Badge'
import StatsCard from '@/components/ui/StatsCard'

interface PaymentRecord {
  id: string
  learner_name: string
  course_title: string
  amount: number
  status: 'pending' | 'pending_verification' | 'verified' | 'rejected' | 'overdue'
  due_date: string
  paid_at: string | null
}

export default function AdminFinancePage() {
  const [payments, setPayments] = useState<PaymentRecord[]>([])
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    totalEarned: 0,
    pendingCollection: 0,
    verifiedCount: 0,
    pendingCount: 0
  })
  const supabase = createClient()

  async function loadFinancialData() {
    setLoading(true)
    try {
      // Fetch all payments joined with profiles and courses
      const { data, error } = await supabase
        .from('payments')
        .select(`
          id,
          amount,
          status,
          due_date,
          paid_at,
          profiles:learner_id (full_name),
          courses:course_id (title)
        `)
        .order('due_date', { ascending: false })

      if (data) {
        const mapped: PaymentRecord[] = data.map((p: any) => ({
          id: p.id,
          learner_name: p.profiles?.full_name || 'Anonymous Learner',
          course_title: p.courses?.title || 'Unknown Course',
          amount: Number(p.amount),
          status: p.status,
          due_date: p.due_date ? new Date(p.due_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '—',
          paid_at: p.paid_at ? new Date(p.paid_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : null
        }))
        setPayments(mapped)

        // Calculate statistics
        const verified = mapped.filter(m => m.status === 'verified')
        const pending = mapped.filter(m => m.status === 'pending' || m.status === 'pending_verification')
        
        const totalEarned = verified.reduce((sum, item) => sum + item.amount, 0)
        const pendingCollection = pending.reduce((sum, item) => sum + item.amount, 0)

        setStats({
          totalEarned,
          pendingCollection,
          verifiedCount: verified.length,
          pendingCount: pending.length
        })
      }
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadFinancialData()
  }, [])

  const columns: Column<PaymentRecord>[] = [
    {
      key: 'learner_name',
      header: 'Learner',
      sortable: true,
      render: (row) => (
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-secondary/10 text-secondary flex items-center justify-center font-bold text-xs">
            {row.learner_name.charAt(0).toUpperCase()}
          </div>
          <div>
            <p className="font-semibold text-on-surface leading-snug">{row.learner_name}</p>
            <p className="text-[10px] text-on-surface-variant font-medium">Inv ID: #{row.id.slice(0, 8)}</p>
          </div>
        </div>
      )
    },
    { key: 'course_title', header: 'Course', sortable: true },
    {
      key: 'amount',
      header: 'Amount',
      sortable: true,
      render: (row) => <span className="font-bold text-on-surface">${row.amount.toLocaleString()}</span>
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
          pending_verification: 'Unverified Upload',
          overdue: 'Overdue',
          rejected: 'Rejected'
        }
        return <Badge variant={variants[row.status]}>{labels[row.status]}</Badge>
      }
    }
  ]

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h2 className="text-3xl font-bold text-on-surface">Financial Analytics</h2>
          <p className="text-sm text-on-surface-variant mt-1">
            Overview of total tuition fees collected, pending balances, and invoice audit log.
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <StatsCard
          icon="account_balance"
          label="Total Collected"
          value={loading ? '...' : `$${stats.totalEarned.toLocaleString()}`}
          delta={`${stats.verifiedCount} paid invoices`}
          accent="success"
        />
        <StatsCard
          icon="credit_card"
          label="Pending Collection"
          value={loading ? '...' : `$${stats.pendingCollection.toLocaleString()}`}
          delta={`${stats.pendingCount} unpaid invoices`}
          accent="secondary"
        />
        <StatsCard
          icon="savings"
          label="Projected Revenue"
          value={loading ? '...' : `$${(stats.totalEarned + stats.pendingCollection).toLocaleString()}`}
          accent="primary"
        />
        <StatsCard
          icon="analytics"
          label="Collection Rate"
          value={loading ? '...' : `${stats.verifiedCount + stats.pendingCount > 0 ? Math.round((stats.verifiedCount / (stats.verifiedCount + stats.pendingCount)) * 100) : 100}%`}
          accent="tertiary"
        />
      </div>

      {/* Chart and distribution mockups */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Monthly Revenue chart */}
        <div className="lg:col-span-8 bg-surface-container-lowest rounded-2xl border border-outline-variant/30 p-6 flex flex-col h-[340px] justify-between">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-bold text-on-surface">Monthly Collection Curve</h3>
            <span className="text-xs text-on-surface-variant font-medium">Jan - Jun 2026</span>
          </div>
          <div className="flex-grow flex items-end gap-4 h-40 px-2 mt-4">
            {[
              { label: 'Jan', val: 4000 },
              { label: 'Feb', val: 5500 },
              { label: 'Mar', val: 6200 },
              { label: 'Apr', val: 8900 },
              { label: 'May', val: stats.totalEarned || 12400, active: true }
            ].map((bar, idx) => (
              <div key={idx} className="flex-1 flex flex-col items-center gap-2 h-full justify-end group relative">
                <div className="absolute -top-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-primary text-white text-[10px] px-2 py-1 rounded font-bold">
                  ${bar.val.toLocaleString()}
                </div>
                <div className="w-full flex items-end justify-center h-full">
                  <div
                    className={`w-full rounded-t-lg transition-all duration-300 ${
                      bar.active
                        ? 'bg-primary shadow-lg shadow-primary/20 hover:opacity-90'
                        : 'bg-primary/10 hover:bg-primary/20'
                    }`}
                    style={{ height: `${(bar.val / 15000) * 100}%` }}
                  />
                </div>
                <span className={`text-xs ${bar.active ? 'text-primary font-bold' : 'text-on-surface-variant font-medium'}`}>
                  {bar.label}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Payment breakdown indicator */}
        <div className="lg:col-span-4 bg-surface-container-lowest rounded-2xl border border-outline-variant/30 p-6 flex flex-col justify-between">
          <h3 className="text-lg font-bold text-on-surface">Audited Status</h3>
          <div className="space-y-4 my-auto">
            <div className="flex justify-between items-center text-xs">
              <span className="text-on-surface-variant">Verified Receipts</span>
              <span className="font-bold text-on-surface">{stats.verifiedCount}</span>
            </div>
            <div className="h-2 bg-surface-container-high rounded-full overflow-hidden">
              <div className="h-full bg-green-500 rounded-full" style={{ width: `${stats.verifiedCount + stats.pendingCount > 0 ? (stats.verifiedCount / (stats.verifiedCount + stats.pendingCount)) * 100 : 100}%` }} />
            </div>
            <div className="flex justify-between items-center text-xs pt-2">
              <span className="text-on-surface-variant">Unverified Proof Uploads</span>
              <span className="font-bold text-on-surface">
                {payments.filter(p => p.status === 'pending_verification').length}
              </span>
            </div>
            <div className="h-2 bg-surface-container-high rounded-full overflow-hidden">
              <div className="h-full bg-amber-500 rounded-full" style={{ width: `${payments.length > 0 ? (payments.filter(p => p.status === 'pending_verification').length / payments.length) * 100 : 0}%` }} />
            </div>
          </div>
          <button
            onClick={loadFinancialData}
            className="w-full py-2.5 bg-surface-container hover:bg-surface-container-high text-on-surface font-semibold text-xs rounded-xl transition-all"
          >
            Revalidate Ledger
          </button>
        </div>
      </div>

      {/* Invoice Ledger Table */}
      <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/30 p-6 shadow-sm">
        <h3 className="text-lg font-bold text-on-surface mb-6">Payment Ledger</h3>
        <DataTable
          columns={columns}
          data={payments}
          keyField="id"
          pageSize={10}
          loading={loading}
          emptyMessage="No ledger transactions recorded in the payments table."
        />
      </div>
    </div>
  )
}
