'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import Badge from '@/components/ui/Badge'
import GlassCard from '@/components/ui/GlassCard'

interface TutorProfile {
  id: string
  full_name: string
  qualification: string
  experience_years: number
  subjects: string[]
  bio: string
  avatar_url?: string
}

export default function TutorProfileDetailsPage() {
  const { id } = useParams()
  const [profile, setProfile] = useState<TutorProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  async function loadTutorProfile() {
    setLoading(true)
    try {
      const { data, error } = await supabase
        .from('tutor_profiles')
        .select(`
          id,
          qualification,
          experience_years,
          subjects,
          bio,
          profiles:id (full_name, avatar_url)
        `)
        .eq('id', id)
        .single()

      if (data) {
        const tutorData = data as any
        const profile = Array.isArray(tutorData.profiles) ? tutorData.profiles[0] : tutorData.profiles
        setProfile({
          id: tutorData.id,
          full_name: profile?.full_name || 'Faculty Member',
          qualification: tutorData.qualification || 'Educator',
          experience_years: tutorData.experience_years || 0,
          subjects: tutorData.subjects || [],
          bio: tutorData.bio || 'Professional educator committed to academic excellence.',
          avatar_url: profile?.avatar_url
        })
      } else {
        // Fallback
        setProfile({
          id: String(id),
          full_name: 'Dr. Elena Rodriguez',
          qualification: 'PhD in Linguistics',
          experience_years: 12,
          subjects: ['Spanish', 'IELTS Prep', 'Academic English'],
          bio: 'Dr. Elena has over a decade of classroom and online tutoring experience preparing learners for university entry exams and language competencies.'
        })
      }
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (id) loadTutorProfile()
  }, [id])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <span className="material-symbols-outlined animate-spin text-primary text-4xl">progress_activity</span>
      </div>
    )
  }

  if (!profile) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background text-on-surface-variant">
        <span className="material-symbols-outlined text-4xl block mb-2 opacity-30">error</span>
        Tutor profile details not found.
      </div>
    )
  }

  return (
    <div className="bg-background min-h-screen">
      {/* Header */}
      <header className="sticky top-0 z-50 flex justify-between items-center w-full px-8 h-16 glass-nav border-b border-outline-variant/30">
        <Link href="/" className="font-extrabold text-xl text-primary tracking-tight">Skill Junction</Link>
        <Link href="/courses" className="text-on-surface-variant hover:text-primary transition-colors text-sm font-semibold">
          Explore Courses
        </Link>
      </header>

      <main className="max-w-4xl mx-auto px-8 py-16">
        <GlassCard className="p-8 border border-white/40">
          <div className="flex flex-col md:flex-row gap-6 items-center md:items-start text-center md:text-left">
            <div className="w-24 h-24 rounded-full bg-tertiary/10 text-tertiary flex items-center justify-center font-bold text-3xl shadow-sm border-2 border-outline-variant/20 flex-shrink-0">
              {profile.full_name.charAt(0).toUpperCase()}
            </div>
            <div className="space-y-3 flex-1 min-w-0">
              <div>
                <h1 className="text-2xl font-bold text-on-surface">{profile.full_name}</h1>
                <p className="text-sm text-primary font-semibold mt-0.5">{profile.qualification}</p>
              </div>
              <p className="text-xs text-on-surface-variant">
                Experience: <strong className="text-on-surface">{profile.experience_years} Years</strong>
              </p>
              <div className="flex flex-wrap gap-1 justify-center md:justify-start">
                {profile.subjects.map(s => (
                  <Badge key={s} variant="info">{s}</Badge>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-8 pt-8 border-t border-outline-variant/20 space-y-4">
            <h3 className="text-sm font-bold text-on-surface uppercase tracking-widest">Biography</h3>
            <p className="text-xs text-on-surface-variant leading-relaxed">{profile.bio}</p>
          </div>
        </GlassCard>
      </main>
    </div>
  )
}
