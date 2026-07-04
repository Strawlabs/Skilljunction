'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'
import Badge from '@/components/ui/Badge'
import GlassCard from '@/components/ui/GlassCard'

interface CourseItem {
  id: string
  title: string
  description: string
  price: number
  category: string
  level: string
  thumbnail_url: string
  tutor_name: string
}

export default function CoursesCatalogPage() {
  const [courses, setCourses] = useState<CourseItem[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('All')
  const [sort, setSort] = useState('Newest')
  const supabase = createClient()

  async function loadCourses() {
    setLoading(true)
    try {
      const { data } = await supabase
        .from('courses')
        .select(`
          id,
          title,
          description,
          price,
          category,
          level,
          thumbnail_url,
          profiles:tutor_id (full_name)
        `)
      
      if (data) {
        const mapped = data.map((c: any) => ({
          id: c.id,
          title: c.title,
          description: c.description || '',
          price: Number(c.price || 0),
          category: c.category || 'General',
          level: c.level || 'Intermediate',
          thumbnail_url: c.thumbnail_url || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=500',
          tutor_name: c.profiles?.full_name || 'Expert Faculty'
        }))
        setCourses(mapped)
      }
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadCourses()
  }, [])

  const fallbackCourses = [
    { id: '1', title: 'Advanced Data Architecture', description: 'Master the complexities of modern database systems and scalable architecture.', price: 129, category: 'Technology', level: 'Advanced', thumbnail_url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCo0Se2XhQS0tYQJzG0p2fiAaGAYIPza0Kqgf5TjMRJxVvS2ebHv3OFrkop7OJc-C-x0k8-al0g9zFzZFo3DL9Iaed-F9wZsdwAqsCxshtevNHw8IbtfNkVa6KHgYa3D8OSwJD6-OH29oHszH26Q9MfwreJkpZ3U2sMmIQbSztIM2t9QUwn5kMHxQ0YINZFLm3imYisIS_fV_jP2UOLwYuUAS00g87Dzc6sbxX2BCo3OcSDo5Lo8AOzNAkJnJUMOy4rx6HhTsyTeU0', tutor_name: 'Elena Vance' },
    { id: '2', title: 'Strategic Leadership Dynamics', description: 'Develop the frameworks necessary for leading global teams in a volatile economy.', price: 199, category: 'Business', level: 'Intermediate', thumbnail_url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBU0A-pKsqzRT3PuEH8fPf_aCG29SyD8nFwJ_o0qkfuPFDRN1noxEgMgPj3GAOeygBsrQWQsnOAKIlto24AZwQY1eR12_yjKSYGHnC0v1DYMyB95KhvqBPQN8XS9IeuJPec1mObjjo8OLNcsiqvKzunyhQW3UpJ1CcUejkVMeS-vPasMhlSEbSdRBkQVg6tW2Fs6NfjguKe3PtsPKLh5bAw5yROP7zvL1e_6b37A6UZvfU9ZBQ881KMA_zIoNKf_Mrktcr6F1Mo9B0', tutor_name: 'Dr. Aris Thorne' },
    { id: '3', title: 'UI Design Systems Mastery', description: 'Learn to build comprehensive, scalable design systems for enterprise-grade applications.', price: 149, category: 'Design', level: 'Advanced', thumbnail_url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDOafUIQazqulVJCH2A1CneUBfZmp4DbEVpoUVbTlClKLAhiwjw4ykUn5iObIh5vmprN2Pxyg55bH9AIfssazMS2VOE81iWN7HxrDYOFTWqZQI-We80bPS3uIFUEr6l73nHDKfxXuCeHIWJiGxvrzVqUfNb3EkJ9jrs9PCRuxVA7Ps0iHvVElCsK8Ln4Sc2627OjmnflNdJZ6BXUpYMh1UpxuaQePCq98GXdayJhBxQqdUG9afL_uxfrWFmdxbhty37mqCzqhCoWaw', tutor_name: 'Marcus Chen' },
    { id: '4', title: 'IELTS Masterclass (Summer Course)', description: 'Complete study syllabus to achieve an 8.5+ band score in reading, writing and speaking.', price: 240, category: 'Languages', level: 'Advanced', thumbnail_url: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=500', tutor_name: 'Dr. Elena Rodriguez' }
  ]

  const displayCourses = courses.length > 0 ? courses : fallbackCourses

  // Filtering
  const filtered = displayCourses.filter(c => {
    const searchMatches = c.title.toLowerCase().includes(search.toLowerCase()) || 
                          c.description.toLowerCase().includes(search.toLowerCase()) ||
                          c.tutor_name.toLowerCase().includes(search.toLowerCase())
    const categoryMatches = category === 'All' || c.category === category
    return searchMatches && categoryMatches
  })

  // Sorting
  const sorted = [...filtered].sort((a, b) => {
    if (sort === 'Price: Low to High') return a.price - b.price
    if (sort === 'Price: High to Low') return b.price - a.price
    return b.title.localeCompare(a.title) // default alphabetical/mock newest
  })

  return (
    <div className="bg-background min-h-screen">
      {/* Sticky Header */}
      <header className="sticky top-0 z-50 flex justify-between items-center w-full px-8 h-16 glass-nav border-b border-outline-variant/30">
        <div className="flex items-center gap-10">
          <Link href="/" className="font-extrabold text-xl text-primary tracking-tight">Skill Junction</Link>
          <nav className="hidden md:flex gap-6 items-center">
            <Link className="text-primary font-bold text-sm border-b-2 border-primary pb-0.5" href="/courses">Courses</Link>
            <Link className="text-on-surface-variant hover:text-primary transition-colors text-sm font-semibold" href="/#tutors">Tutors</Link>
          </nav>
        </div>
        <div className="flex items-center gap-4">
          <Link href="/auth/login" className="text-on-surface-variant font-semibold hover:text-primary text-sm transition-colors">Sign In</Link>
          <Link href="/auth/signup" className="bg-primary text-on-primary px-5 py-2.5 rounded-xl font-bold hover:shadow-lg transition-all text-xs">Join Class</Link>
        </div>
      </header>

      <main className="pb-16">
        {/* Banner with filters */}
        <div className="bg-surface border-b border-outline-variant/30 px-8 py-12">
          <div className="max-w-container-max mx-auto space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-on-surface">Course Syllabus Catalog</h1>
              <p className="text-sm text-on-surface-variant mt-1">Explore our expert-led tracks designed for modern professionals.</p>
            </div>

            {/* Inputs */}
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline">search</span>
                <input
                  type="text"
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  placeholder="Search courses, tutors, topics..."
                  className="w-full pl-12 pr-4 py-3 bg-white border border-outline-variant/50 focus:border-primary focus:ring-2 focus:ring-primary/10 rounded-xl outline-none text-sm transition-all"
                />
              </div>
              <select
                value={sort}
                onChange={e => setSort(e.target.value)}
                className="py-3 px-4 rounded-xl bg-white border border-outline-variant/50 focus:border-primary outline-none text-xs font-semibold text-on-surface-variant min-w-[180px]"
              >
                <option>Newest</option>
                <option>Price: Low to High</option>
                <option>Price: High to Low</option>
              </select>
            </div>

            {/* Pills */}
            <div className="flex gap-2 flex-wrap">
              {['All', 'Technology', 'Business', 'Design', 'Languages'].map(cat => (
                <button
                  key={cat}
                  onClick={() => setCategory(cat)}
                  className={`px-4 py-2 rounded-full text-xs font-bold transition-all ${cat === category ? 'bg-primary text-on-primary shadow-md shadow-primary/20' : 'bg-surface-container text-on-surface-variant hover:bg-primary/10 hover:text-primary'}`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Catalog Grid */}
        <div className="px-8 py-12 max-w-container-max mx-auto">
          {sorted.length === 0 ? (
            <div className="py-20 text-center text-on-surface-variant">
              <span className="material-symbols-outlined text-4xl block mb-2 opacity-30">search_off</span>
              No courses matching your criteria.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {sorted.map(course => (
                <Link
                  key={course.id}
                  href={`/courses/${course.id}`}
                  className="glass-card rounded-xl overflow-hidden shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all group block"
                >
                  <div className="aspect-video w-full relative overflow-hidden">
                    <img
                      alt={course.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      src={course.thumbnail_url}
                    />
                    <span className="absolute top-4 left-4 bg-on-surface/80 text-surface-bright px-3 py-1 rounded-full text-[10px] font-bold tracking-wide uppercase backdrop-blur-sm">
                      {course.category}
                    </span>
                  </div>
                  <div className="p-6 flex flex-col gap-3">
                    <span className="text-[10px] text-primary font-bold uppercase tracking-widest">{course.level}</span>
                    <h3 className="text-base font-bold text-on-surface group-hover:text-primary transition-colors truncate">{course.title}</h3>
                    <p className="text-xs text-on-surface-variant line-clamp-2 leading-relaxed">{course.description}</p>
                    
                    <div className="flex items-center gap-1.5 text-xs text-on-surface-variant mt-2">
                      <span className="material-symbols-outlined text-sm">person</span>
                      <span>By {course.tutor_name}</span>
                    </div>

                    <div className="flex justify-between items-center mt-4 pt-4 border-t border-outline-variant/20">
                      <span className="text-lg font-extrabold text-primary">${course.price}</span>
                      <span className="text-xs font-bold text-primary bg-primary/5 px-2.5 py-1 rounded-lg">View syllabus</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
