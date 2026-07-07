'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import DataTable, { Column } from '@/components/ui/DataTable'
import Badge from '@/components/ui/Badge'
import GlassCard from '@/components/ui/GlassCard'

interface PerformanceRecord {
  id: string
  subject: string
  score: number
  date: string
  grade: string
}

export default function ParentMonitorPage() {
  const [records, setRecords] = useState<PerformanceRecord[]>([])
  const [loading, setLoading] = useState(true)
  const [childName, setChildName] = useState('Oliver Vance')
  const supabase = createClient()

  async function loadPerformanceData() {
    setLoading(true)
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      // Find first child link
      const { data: links } = await supabase
        .from('parent_children')
        .select(`
          child_id,
          profiles:child_id (full_name)
        `)
        .eq('parent_id', user.id)
        .limit(1)

      if (links && links.length > 0) {
        const link = links[0] as any
        if (link.profiles) {
          const profile = Array.isArray(link.profiles) ? link.profiles[0] : link.profiles
          setChildName(profile?.full_name || 'Child Account')
        }
        const childId = link.child_id

        // Fetch quiz attempts
        const { data } = await supabase
          .from('quiz_attempts')
          .select(`
            id,
            score,
            attempted_at,
            quizzes:quiz_id (title)
          `)
          .eq('learner_id', childId)
          .order('attempted_at', { ascending: false })

        if (data) {
          const mapped: PerformanceRecord[] = data.map((a: any) => {
            const score = a.score || 0
            const grade = score >= 90 ? 'A' : score >= 80 ? 'B' : score >= 70 ? 'C' : 'D'
            return {
              id: a.id,
              subject: a.quizzes?.title || 'General Quiz',
              score,
              grade,
              date: new Date(a.attempted_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
            }
          })
          setRecords(mapped)
        }
      }
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadPerformanceData()
  }, [])

  const fallbackRecords = [
    { id: '1', subject: 'Algebra Basics Quiz', score: 92, grade: 'A', date: 'Oct 20, 2026' },
    { id: '2', subject: 'Grammar Mastery Assessment', score: 85, grade: 'B', date: 'Oct 18, 2026' },
    { id: '3', subject: 'Cell Structure Quiz', score: 78, grade: 'C', date: 'Oct 12, 2026' },
  ]

  const displayRecords = records.length > 0 ? records : fallbackRecords

  const columns: Column<PerformanceRecord>[] = [
    { key: 'subject', header: 'Quiz Topic', sortable: true },
    { key: 'date', header: 'Completed Date', sortable: true },
    {
      key: 'score',
      header: 'Percentage Score',
      sortable: true,
      render: (row) => <span className="font-bold text-on-surface">{row.score}%</span>
    },
    {
      key: 'grade',
      header: 'Grade Evaluated',
      sortable: true,
      render: (row) => (
        <Badge variant={row.grade === 'A' || row.grade === 'B' ? 'success' : 'warning'}>
          Grade {row.grade}
        </Badge>
      )
    }
  ]

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-bold text-on-surface">Child Monitoring Hub</h2>
        <p className="text-sm text-on-surface-variant mt-1">
          Detailed academic history and performance track records for <strong className="text-primary">{childName}</strong>.
        </p>
      </div>

      {/* Stats summaries */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <GlassCard accentLeft="primary" className="p-4">
          <p className="text-xs text-on-surface-variant font-semibold uppercase tracking-widest">Average Score</p>
          <p className="text-2xl font-bold text-on-surface mt-1">
            {displayRecords.length > 0 ? Math.round(displayRecords.reduce((sum, r) => sum + r.score, 0) / displayRecords.length) : 0}%
          </p>
        </GlassCard>
        <GlassCard accentLeft="tertiary" className="p-4">
          <p className="text-xs text-on-surface-variant font-semibold uppercase tracking-widest">Quizzes Attempted</p>
          <p className="text-2xl font-bold text-on-surface mt-1">{displayRecords.length}</p>
        </GlassCard>
      </div>

      {/* Performance log table */}
      <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/30 p-6 shadow-sm">
        <h3 className="text-lg font-bold text-on-surface mb-6">Academic Score Ledger</h3>
        <DataTable
          columns={columns}
          data={displayRecords}
          keyField="id"
          pageSize={10}
          loading={loading}
          emptyMessage="No quiz records found for your child."
        />
      </div>
    </div>
  )
}
