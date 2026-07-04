'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import Badge from '@/components/ui/Badge'
import GlassCard from '@/components/ui/GlassCard'

interface CourseDetail {
  id: string
  title: string
  description: string
  price: number
  category: string
  level: string
  thumbnail_url: string
  tutor_name: string
  tutor_id: string
}

export default function CourseDetailsPage() {
  const { id } = useParams()
  const router = useRouter()
  const [course, setCourse] = useState<CourseDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [enrolling, setEnrolling] = useState(false)
  const supabase = createClient()

  async function loadCourseDetails() {
    setLoading(true)
    try {
      const { data, error } = await supabase
        .from('courses')
        .select(`
          id,
          title,
          description,
          price,
          category,
          level,
          thumbnail_url,
          tutor_id,
          profiles:tutor_id (full_name)
        `)
        .eq('id', id)
        .single()

      if (data) {
        const courseData = data as any
        setCourse({
          id: courseData.id,
          title: courseData.title,
          description: courseData.description || '',
          price: Number(courseData.price || 0),
          category: courseData.category || 'General',
          level: courseData.level || 'Intermediate',
          thumbnail_url: courseData.thumbnail_url || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=500',
          tutor_name: courseData.profiles?.full_name || 'Faculty Member',
          tutor_id: courseData.tutor_id || ''
        })
      } else {
        // Fallback mockup
        setCourse({
          id: String(id),
          title: 'IELTS Masterclass',
          description: 'A comprehensive, tech-driven approach to mastering the International English Language Testing System. Achieve Band 8.5+ with precision-guided strategies.',
          price: 299,
          category: 'Languages',
          level: 'Advanced',
          thumbnail_url: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=500',
          tutor_name: 'Dr. Elena Rodriguez',
          tutor_id: 'default_tutor'
        })
      }
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (id) loadCourseDetails()
  }, [id])

  const handleEnroll = async () => {
    if (!course) return
    setEnrolling(true)
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push('/auth/login')
        return
      }

      // Create enrollment in active state (or pending payment proof)
      const { error: enrollErr } = await supabase.from('enrollments').insert({
        learner_id: user.id,
        course_id: course.id,
        status: 'active'
      })

      // Create a pending payment log for this enrollment
      await supabase.from('payments').insert({
        learner_id: user.id,
        course_id: course.id,
        amount: course.price,
        status: 'pending',
        due_date: new Date(Date.now() + 7 * 86400000).toISOString() // 7 days from now
      })

      // Redirect to enrollment success screen
      router.push(`/courses/${course.id}/enroll-success`)
    } catch (err) {
      console.error(err)
    } finally {
      setEnrolling(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <span className="material-symbols-outlined animate-spin text-primary text-4xl">progress_activity</span>
      </div>
    )
  }

  if (!course) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background text-on-surface-variant">
        <span className="material-symbols-outlined text-4xl block mb-2 opacity-30">error</span>
        Course details not found.
      </div>
    )
  }

  return (
    <div className="bg-background min-h-screen">
      {/* Header */}
      <header className="sticky top-0 z-50 flex justify-between items-center w-full px-8 h-16 glass-nav border-b border-outline-variant/30">
        <Link href="/" className="font-extrabold text-xl text-primary tracking-tight">Skill Junction</Link>
        <Link href="/courses" className="text-on-surface-variant hover:text-primary transition-colors text-sm font-semibold">
          ← Back to Catalog
        </Link>
      </header>

      {/* Hero */}
      <section className="relative bg-surface border-b border-outline-variant/20 py-16 px-8 overflow-hidden">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-primary/5 to-transparent pointer-events-none" />
        <div className="max-w-container-max mx-auto grid grid-cols-1 md:grid-cols-12 gap-10 items-center">
          <div className="md:col-span-7 space-y-6">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-primary/10 text-primary rounded-full text-xs font-bold uppercase tracking-wider">
              <span className="material-symbols-outlined text-sm">verified</span>
              {course.level} Track
            </span>
            <h1 className="text-4xl font-extrabold text-on-surface leading-tight">{course.title}</h1>
            <p className="text-sm text-on-surface-variant leading-relaxed max-w-xl">{course.description}</p>
            
            <div className="flex gap-6 text-xs text-on-surface-variant font-semibold">
              <span className="flex items-center gap-1.5"><span className="material-symbols-outlined text-amber-400 text-sm">star</span>4.8 (240 reviews)</span>
              <span className="flex items-center gap-1.5"><span className="material-symbols-outlined text-sm">group</span>1.2k+ Enrolled</span>
            </div>

            <div className="flex flex-wrap gap-4 pt-2">
              <button
                onClick={handleEnroll}
                disabled={enrolling}
                className="px-8 py-4 bg-primary text-on-primary font-bold rounded-xl shadow-lg hover:shadow-primary/20 transition-all text-sm active:scale-95 disabled:opacity-50"
              >
                {enrolling ? 'Enrolling...' : `Enroll Now — $${course.price}`}
              </button>
              <button className="px-8 py-4 border border-outline-variant font-bold text-sm text-primary hover:bg-white/50 rounded-xl transition-all">
                Download Syllabus
              </button>
            </div>
          </div>

          <div className="md:col-span-5 flex justify-center">
            <div className="w-full aspect-video rounded-2xl overflow-hidden shadow-2xl relative group cursor-pointer border border-outline-variant/30">
              <img alt="Course preview" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" src={course.thumbnail_url} />
              <div className="absolute inset-0 bg-black/25 flex items-center justify-center">
                <div className="w-14 h-14 rounded-full bg-white/90 flex items-center justify-center text-primary shadow-xl group-hover:scale-110 transition-transform">
                  <span className="material-symbols-outlined text-3xl">play_arrow</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Curriculum & Specs */}
      <section className="px-8 py-16 max-w-container-max mx-auto grid grid-cols-1 md:grid-cols-12 gap-10">
        <div className="md:col-span-8 space-y-12">
          {/* Syllabus Section */}
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-on-surface">Curriculum Breakdown</h2>
            <div className="space-y-3">
              {[
                { title: 'Introductory Core Concepts', desc: 'Understanding testing formats, scoring criteria, and initial diagnostic drills.' },
                { title: 'Advanced Grammar & Composition', desc: 'Lexical resource enrichment, essay structural templates, and prompt parsing.' },
                { title: 'Oral Fluency & Accent Reduction', desc: 'Speaking task simulations, pacing drills, and pronunciation confidence.' }
              ].map((mod, idx) => (
                <div key={idx} className="bg-surface-container-lowest p-5 rounded-xl border border-outline-variant/30">
                  <h4 className="text-sm font-semibold text-on-surface">Module {idx + 1}: {mod.title}</h4>
                  <p className="text-xs text-on-surface-variant mt-1 leading-relaxed">{mod.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Info panel */}
        <div className="md:col-span-4 space-y-6">
          <div className="bg-surface-container-lowest p-6 rounded-2xl border border-outline-variant/30 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-on-surface uppercase tracking-widest">Tutor Profile</h3>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-sm">
                {course.tutor_name.charAt(0).toUpperCase()}
              </div>
              <div>
                <p className="text-sm font-semibold text-on-surface">{course.tutor_name}</p>
                <p className="text-[10px] text-on-surface-variant">Senior Faculty Member</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
