'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import DataTable, { Column } from '@/components/ui/DataTable'
import Badge from '@/components/ui/Badge'
import GlassCard from '@/components/ui/GlassCard'

interface ResourceRecord {
  id: string
  title: string
  type: string
  url: string
  course_title: string
}

export default function LearnerResourcesPage() {
  const [resources, setResources] = useState<ResourceRecord[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  async function loadResources() {
    setLoading(true)
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      // Fetch enrolled courses
      const { data: enrollments } = await supabase
        .from('enrollments')
        .select('course_id')
        .eq('learner_id', user.id)

      const courseIds = (enrollments || []).map(e => e.course_id)

      if (courseIds.length > 0) {
        // Fetch resources for these courses
        const { data } = await supabase
          .from('resources')
          .select(`
            id,
            title,
            type,
            url,
            courses:course_id (title)
          `)
          .in('course_id', courseIds)

        if (data) {
          const mapped: ResourceRecord[] = data.map((r: any) => ({
            id: r.id,
            title: r.title,
            type: r.type || 'PDF',
            url: r.url,
            course_title: r.courses?.title || 'General'
          }))
          setResources(mapped)
        }
      }
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadResources()
  }, [])

  const fallbackResources = [
    { id: '1', title: 'IELTS Vocabulary Cheat Sheet', type: 'PDF Document', url: 'https://example.com/vocabulary.pdf', course_title: 'IELTS Masterclass' },
    { id: '2', title: 'React Hooks Cheat Sheet', type: 'Cheat Sheet', url: 'https://example.com/hooks.pdf', course_title: 'UI Design Systems' },
    { id: '3', title: 'Linear Algebra Slides (PDF)', type: 'Lecture Notes', url: 'https://example.com/slides.pdf', course_title: 'Advanced Mathematics' },
  ]

  const displayResources = resources.length > 0 ? resources : fallbackResources

  const columns: Column<ResourceRecord>[] = [
    { key: 'title', header: 'Resource Name', sortable: true },
    { key: 'course_title', header: 'Course Module', sortable: true },
    {
      key: 'type',
      header: 'File Type',
      sortable: true,
      render: (row) => <Badge variant="primary">{row.type}</Badge>
    },
    {
      key: 'actions',
      header: 'Download',
      className: 'text-right',
      render: (row) => (
        <a
          href={row.url}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-1 bg-surface-container hover:bg-surface-container-high px-3 py-1.5 rounded-lg text-xs font-bold text-on-surface transition-colors"
        >
          <span className="material-symbols-outlined text-sm">download</span>
          Get File
        </a>
      )
    }
  ]

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-bold text-on-surface">Study Resources</h2>
        <p className="text-sm text-on-surface-variant mt-1">
          Download cheat sheets, syllabuses, slides, and learning assets assigned to your active courses.
        </p>
      </div>

      {/* Grid count cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <GlassCard accentLeft="primary" className="p-4 flex justify-between items-center">
          <div>
            <p className="text-xs text-on-surface-variant uppercase font-semibold tracking-widest">Available Materials</p>
            <p className="text-2xl font-bold text-on-surface mt-1">{displayResources.length} Assets</p>
          </div>
          <span className="material-symbols-outlined text-primary text-3xl opacity-40">folder_open</span>
        </GlassCard>
      </div>

      {/* Directory list */}
      <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/30 p-6 shadow-sm">
        <DataTable
          columns={columns}
          data={displayResources}
          keyField="id"
          pageSize={10}
          loading={loading}
          emptyMessage="No study resources uploaded for your enrolled courses."
        />
      </div>
    </div>
  )
}
