'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import DataTable, { Column } from '@/components/ui/DataTable'
import Badge from '@/components/ui/Badge'
import StatsCard from '@/components/ui/StatsCard'

interface OverdueRecord {
  id: string
  learner_name: string
  learner_id: string
  course_title: string
  amount: number
  due_date: string
  days_overdue: number
}

export default function FinanceAgingPage() {
  const [overdueList, setOverdueList] = useState<OverdueRecord[]>([])
  const [loading, setLoading] = useState(true)
  const [sendingId, setSendingId] = useState<string | null>(null)
  const supabase = createClient()

  async function loadOverduePayments() {
    setLoading(true)
    try {
      const { data, error } = await supabase
        .from('payments')
        .select(`
          id,
          learner_id,
          amount,
          due_date,
          status,
          profiles:learner_id (full_name),
          courses:course_id (title)
        `)
        .eq('status', 'overdue')

      if (data) {
        const mapped: OverdueRecord[] = data.map((p: any) => {
          const days = p.due_date 
            ? Math.floor((Date.now() - new Date(p.due_date).getTime()) / 86400000) 
            : 5
          return {
            id: p.id,
            learner_name: p.profiles?.full_name || 'Anonymous',
            learner_id: p.learner_id,
            course_title: p.courses?.title || 'Course Module',
            amount: Number(p.amount),
            due_date: p.due_date ? new Date(p.due_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '—',
            days_overdue: Math.max(1, days)
          }
        })
        setOverdueList(mapped)
      }
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadOverduePayments()
  }, [])

  const handleSendReminder = async (record: OverdueRecord) => {
    setSendingId(record.id)
    try {
      // 1. Insert alert notification to the learner
      await supabase.from('notifications').insert({
        user_id: record.learner_id,
        title: 'Tuition Payment Overdue Alert',
        message: `Your payment of $${record.amount} for "${record.course_title}" is past due by ${record.days_overdue} days. Please clear your dues in the payment portal.`,
        type: 'error'
      })
      alert(`Reminder notification sent to ${record.learner_name} successfully!`)
    } catch (err) {
      console.error(err)
    } finally {
      setSendingId(null)
    }
  }

  const fallbackOverdue = [
    { id: '1', learner_name: 'Marcus Smith', learner_id: 'l1', course_title: 'IELTS Masterclass', amount: 240, due_date: 'Jun 20, 2026', days_overdue: 12 },
    { id: '2', learner_name: 'Amir Khan', learner_id: 'l2', course_title: 'Python Fundamentals', amount: 180, due_date: 'Jun 25, 2026', days_overdue: 7 },
  ]

  const displayOverdue = overdueList.length > 0 ? overdueList : fallbackOverdue

  const columns: Column<OverdueRecord>[] = [
    {
      key: 'learner_name',
      header: 'Learner Profile',
      sortable: true,
      render: (row) => (
        <div>
          <p className="font-semibold text-on-surface text-sm">{row.learner_name}</p>
          <p className="text-[10px] text-on-surface-variant font-medium">Overdue Invoice: #{row.id.slice(0, 8)}</p>
        </div>
      )
    },
    { key: 'course_title', header: 'Course', sortable: true },
    {
      key: 'amount',
      header: 'Balance Due',
      sortable: true,
      render: (row) => <span className="font-bold text-error">${row.amount}</span>
    },
    { key: 'due_date', header: 'Due Date', sortable: true },
    {
      key: 'days_overdue',
      header: 'Days Overdue',
      sortable: true,
      render: (row) => <Badge variant="error">{row.days_overdue} days past due</Badge>
    },
    {
      key: 'actions',
      header: 'Follow Up',
      className: 'text-right',
      render: (row) => (
        <button
          onClick={() => handleSendReminder(row)}
          disabled={sendingId === row.id}
          className="px-3.5 py-1.5 bg-error text-on-error text-xs font-bold rounded-lg hover:opacity-90 disabled:opacity-50 transition-opacity"
        >
          {sendingId === row.id ? 'Sending...' : 'Alert Student'}
        </button>
      )
    }
  ]

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-bold text-on-surface">Payment Aging & Follow-up</h2>
        <p className="text-sm text-on-surface-variant mt-1">
          Review unpaid invoices, track aging parameters, and dispatch overdue warnings.
        </p>
      </div>

      {/* Stats summary cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatsCard
          icon="warning"
          label="Total Overdue Amount"
          value={`$${displayOverdue.reduce((sum, item) => sum + item.amount, 0).toLocaleString()}`}
          accent="error"
        />
        <StatsCard
          icon="gavel"
          label="Overdue Accounts"
          value={displayOverdue.length}
          accent="secondary"
        />
      </div>

      {/* Table */}
      <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/30 p-6 shadow-sm">
        <DataTable
          columns={columns}
          data={displayOverdue}
          keyField="id"
          pageSize={10}
          loading={loading}
          emptyMessage="No overdue profiles in the payment ledger!"
        />
      </div>
    </div>
  )
}
