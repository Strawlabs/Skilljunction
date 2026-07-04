'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import DataTable, { Column } from '@/components/ui/DataTable'
import Badge from '@/components/ui/Badge'
import Modal from '@/components/ui/Modal'
import GlassCard from '@/components/ui/GlassCard'

interface CourseRecord {
  id: string
  title: string
  description: string
  price: number
  category: string
  level: string
  enrollment_count: number
}

export default function TutorCoursesPage() {
  const [courses, setCourses] = useState<CourseRecord[]>([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [saving, setSaving] = useState(false)
  
  // Form fields
  const [title, setTitle] = useState('')
  const [desc, setDesc] = useState('')
  const [price, setPrice] = useState(99)
  const [category, setCategory] = useState('Technology')
  const [level, setLevel] = useState('Intermediate')
  const [thumbUrl, setThumbUrl] = useState('')

  const supabase = createClient()

  async function loadTutorCourses() {
    setLoading(true)
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      // Fetch tutor's courses
      const { data: courseData } = await supabase
        .from('courses')
        .select('*')
        .eq('tutor_id', user.id)

      if (courseData) {
        // Fetch enrollments counts for each
        const { data: enrollData } = await supabase
          .from('enrollments')
          .select('course_id')

        const mapped: CourseRecord[] = courseData.map((c: any) => {
          const enrollCount = (enrollData || []).filter(e => e.course_id === c.id).length
          return {
            id: c.id,
            title: c.title,
            description: c.description || '',
            price: Number(c.price || 0),
            category: c.category || 'General',
            level: c.level || 'Intermediate',
            enrollment_count: enrollCount
          }
        })
        setCourses(mapped)
      }
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadTutorCourses()
  }, [])

  const handleCreateCourse = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const { error } = await supabase.from('courses').insert({
        title,
        description: desc,
        price,
        category,
        level,
        thumbnail_url: thumbUrl || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=500',
        tutor_id: user.id
      })

      if (error) throw error

      setModalOpen(false)
      setTitle('')
      setDesc('')
      setPrice(99)
      setThumbUrl('')
      loadTutorCourses()
    } catch (err) {
      console.error(err)
    } finally {
      setSaving(false)
    }
  }

  const columns: Column<CourseRecord>[] = [
    {
      key: 'title',
      header: 'Course Detail',
      sortable: true,
      render: (row) => (
        <div>
          <p className="font-bold text-on-surface text-sm leading-snug">{row.title}</p>
          <p className="text-xs text-on-surface-variant line-clamp-1 mt-0.5">{row.description}</p>
        </div>
      )
    },
    { key: 'category', header: 'Category', sortable: true },
    {
      key: 'level',
      header: 'Level',
      sortable: true,
      render: (row) => <Badge variant="info">{row.level}</Badge>
    },
    {
      key: 'price',
      header: 'Price',
      sortable: true,
      render: (row) => <span className="font-bold text-on-surface">${row.price}</span>
    },
    {
      key: 'enrollment_count',
      header: 'Enrolled Students',
      sortable: true,
      render: (row) => (
        <span className="font-semibold text-primary">{row.enrollment_count} learners</span>
      )
    }
  ]

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h2 className="text-3xl font-bold text-on-surface">Course Management</h2>
          <p className="text-sm text-on-surface-variant mt-1">
            Build and audit syllabus courses, set prices, and track student enrollments.
          </p>
        </div>
        <button
          onClick={() => setModalOpen(true)}
          className="flex items-center justify-center gap-2 px-5 py-2.5 bg-primary text-on-primary font-semibold rounded-xl hover:opacity-90 shadow-md shadow-primary/20 transition-all active:scale-95 text-xs w-full md:w-auto"
        >
          <span className="material-symbols-outlined text-[20px]">add</span>
          Create Course
        </button>
      </div>

      {/* Stats summary banner */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <GlassCard accentLeft="primary" className="p-4 flex justify-between items-center">
          <div>
            <p className="text-xs text-on-surface-variant uppercase tracking-widest font-semibold">Total Courses</p>
            <p className="text-2xl font-bold text-on-surface mt-1">{courses.length}</p>
          </div>
          <span className="material-symbols-outlined text-primary text-3xl opacity-40">menu_book</span>
        </GlassCard>
        <GlassCard accentLeft="success" className="p-4 flex justify-between items-center">
          <div>
            <p className="text-xs text-on-surface-variant uppercase tracking-widest font-semibold">Total Enrolled</p>
            <p className="text-2xl font-bold text-on-surface mt-1">
              {courses.reduce((sum, c) => sum + c.enrollment_count, 0)}
            </p>
          </div>
          <span className="material-symbols-outlined text-green-600 text-3xl opacity-40">group</span>
        </GlassCard>
        <GlassCard accentLeft="tertiary" className="p-4 flex justify-between items-center">
          <div>
            <p className="text-xs text-on-surface-variant uppercase tracking-widest font-semibold">Average Course Price</p>
            <p className="text-2xl font-bold text-on-surface mt-1">
              ${courses.length > 0 ? Math.round(courses.reduce((sum, c) => sum + c.price, 0) / courses.length) : 0}
            </p>
          </div>
          <span className="material-symbols-outlined text-tertiary text-3xl opacity-40">payments</span>
        </GlassCard>
      </div>

      {/* Directory Table */}
      <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/30 p-6 shadow-sm">
        <h3 className="text-lg font-bold text-on-surface mb-6">Course Syllabus Directory</h3>
        <DataTable
          columns={columns}
          data={courses}
          keyField="id"
          pageSize={10}
          loading={loading}
          emptyMessage="No courses published yet. Click 'Create Course' to add one."
        />
      </div>

      {/* Create Course Modal */}
      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Create New Course"
        actions={
          <>
            <button
              onClick={() => setModalOpen(false)}
              className="px-4 py-2 text-xs font-semibold text-on-surface-variant hover:bg-surface-container rounded-xl transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleCreateCourse}
              disabled={saving || !title}
              className="px-5 py-2.5 bg-primary text-on-primary text-xs font-semibold rounded-xl hover:opacity-90 disabled:opacity-50 transition-opacity"
            >
              {saving ? 'Creating...' : 'Create Course'}
            </button>
          </>
        }
      >
        <form onSubmit={handleCreateCourse} className="space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-semibold text-on-surface-variant">Course Title</label>
            <input
              type="text"
              required
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="e.g. Advanced UI Design Systems"
              className="w-full px-4 py-2.5 bg-surface border border-outline-variant/60 rounded-xl text-sm focus:ring-2 focus:ring-primary focus:border-primary outline-none"
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-semibold text-on-surface-variant">Description</label>
            <textarea
              required
              value={desc}
              onChange={e => setDesc(e.target.value)}
              placeholder="Provide a comprehensive course summary syllabus..."
              className="w-full px-4 py-2.5 bg-surface border border-outline-variant/60 rounded-xl text-sm focus:ring-2 focus:ring-primary focus:border-primary outline-none h-24 resize-none"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-on-surface-variant">Price ($)</label>
              <input
                type="number"
                required
                value={price}
                onChange={e => setPrice(Number(e.target.value))}
                className="w-full px-4 py-2.5 bg-surface border border-outline-variant/60 rounded-xl text-sm focus:ring-2 focus:ring-primary focus:border-primary outline-none"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold text-on-surface-variant">Intake Category</label>
              <select
                value={category}
                onChange={e => setCategory(e.target.value)}
                className="w-full px-4 py-2.5 bg-surface border border-outline-variant/60 rounded-xl text-sm focus:ring-2 focus:ring-primary focus:border-primary outline-none"
              >
                <option value="Technology">Technology</option>
                <option value="Business">Business</option>
                <option value="Design">Design</option>
                <option value="Languages">Languages</option>
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-on-surface-variant">Syllabus Level</label>
              <select
                value={level}
                onChange={e => setLevel(e.target.value)}
                className="w-full px-4 py-2.5 bg-surface border border-outline-variant/60 rounded-xl text-sm focus:ring-2 focus:ring-primary focus:border-primary outline-none"
              >
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced</option>
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold text-on-surface-variant">Thumbnail URL</label>
              <input
                type="text"
                value={thumbUrl}
                onChange={e => setThumbUrl(e.target.value)}
                placeholder="https://..."
                className="w-full px-4 py-2.5 bg-surface border border-outline-variant/60 rounded-xl text-sm focus:ring-2 focus:ring-primary focus:border-primary outline-none"
              />
            </div>
          </div>
        </form>
      </Modal>
    </div>
  )
}
