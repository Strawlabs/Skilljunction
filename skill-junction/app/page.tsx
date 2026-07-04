'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';

function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header className={`fixed top-0 z-50 w-full transition-all duration-300 ${scrolled ? 'glass-nav shadow-md' : 'bg-transparent'}`}>
      <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="font-extrabold text-xl text-primary tracking-tight flex items-center gap-2">
          <span className="material-symbols-outlined text-primary text-[28px]">school</span>
          Skill Junction
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex gap-8 items-center">
          <Link href="#courses" className="text-label-md font-semibold text-on-surface-variant hover:text-primary transition-colors">Courses</Link>
          <Link href="#tutors" className="text-label-md font-semibold text-on-surface-variant hover:text-primary transition-colors">Tutors</Link>
          <Link href="/calendar" className="text-label-md font-semibold text-on-surface-variant hover:text-primary transition-colors">Calendar</Link>
        </nav>

        {/* Auth buttons */}
        <div className="hidden md:flex items-center gap-3">
          <Link href="/auth/login" className="text-label-md font-semibold text-on-surface-variant hover:text-primary transition-colors px-4 py-2">
            Sign In
          </Link>
          <Link href="/auth/signup" className="bg-primary text-on-primary px-5 py-2.5 rounded-xl font-semibold text-label-md hover:shadow-lg hover:shadow-primary/20 transition-all active:scale-95">
            Join Free
          </Link>
        </div>

        {/* Mobile hamburger */}
        <button className="md:hidden text-on-surface" onClick={() => setMenuOpen(!menuOpen)}>
          <span className="material-symbols-outlined">{menuOpen ? 'close' : 'menu'}</span>
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden glass-nav border-t border-outline-variant/30 px-6 py-4 flex flex-col gap-4">
          <Link href="#courses" className="font-semibold text-on-surface-variant" onClick={() => setMenuOpen(false)}>Courses</Link>
          <Link href="#tutors" className="font-semibold text-on-surface-variant" onClick={() => setMenuOpen(false)}>Tutors</Link>
          <Link href="/auth/login" className="font-semibold text-on-surface-variant" onClick={() => setMenuOpen(false)}>Sign In</Link>
          <Link href="/auth/signup" className="bg-primary text-on-primary px-4 py-2 rounded-xl font-semibold text-center" onClick={() => setMenuOpen(false)}>Join Free</Link>
        </div>
      )}
    </header>
  );
}

interface CourseItem {
  id: string
  title: string
  description: string
  price: number
  category: string
  tutor_name: string
  rating: number
  students: number
  badge: string
  img: string
}

interface TutorItem {
  id: string
  name: string
  role: string
  rating: number
  students: number
  img: string
}

export default function HomePage() {
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const [coursesList, setCoursesList] = useState<CourseItem[]>([]);
  const [tutorsList, setTutorsList] = useState<TutorItem[]>([]);
  const supabase = createClient();

  useEffect(() => {
    async function fetchData() {
      // 1. Fetch courses joined with tutor profile
      const { data: coursesData } = await supabase
        .from('courses')
        .select(`
          id,
          title,
          description,
          price,
          category,
          thumbnail_url,
          level,
          tutor_id,
          profiles:tutor_id (full_name, avatar_url)
        `)
        .limit(3);

      if (coursesData && coursesData.length > 0) {
        const mappedCourses = coursesData.map((c: any) => ({
          id: c.id,
          title: c.title,
          description: c.description || 'No description available',
          price: c.price || 99,
          category: c.category || 'General',
          tutor_name: c.profiles?.full_name || 'Expert Tutor',
          rating: 4.8, // default rating mockup
          students: 120,
          badge: c.level || 'Best Seller',
          img: c.thumbnail_url || 'https://lh3.googleusercontent.com/aida-public/AB6AXuCo0Se2XhQS0tYQJzG0p2fiAaGAYIPza0Kqgf5TjMRJxVvS2ebHv3OFrkop7OJc-C-x0k8-al0g9zFzZFo3DL9Iaed-F9wZsdwAqsCxshtevNHw8IbtfNkVa6KHgYa3D8OSwJD6-OH29oHszH26Q9MfwreJkpZ3U2sMmIQbSztIM2t9QUwn5kMHxQ0YINZFLm3imYisIS_fV_jP2UOLwYuUAS00g87Dzc6sbxX2BCo3OcSDo5Lo8AOzNAkJnJUMOy4rx6HhTsyTeU0'
        }));
        setCoursesList(mappedCourses);
      } else {
        // Fallback seed data
        setCoursesList([
          { id: '1', title: 'Advanced Data Architecture', description: 'Master modern database systems and scalable architecture.', price: 129, category: 'Technology', tutor_name: 'Elena Vance', rating: 4.9, students: 342, badge: 'Best Seller', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCo0Se2XhQS0tYQJzG0p2fiAaGAYIPza0Kqgf5TjMRJxVvS2ebHv3OFrkop7OJc-C-x0k8-al0g9zFzZFo3DL9Iaed-F9wZsdwAqsCxshtevNHw8IbtfNkVa6KHgYa3D8OSwJD6-OH29oHszH26Q9MfwreJkpZ3U2sMmIQbSztIM2t9QUwn5kMHxQ0YINZFLm3imYisIS_fV_jP2UOLwYuUAS00g87Dzc6sbxX2BCo3OcSDo5Lo8AOzNAkJnJUMOy4rx6HhTsyTeU0' },
          { id: '2', title: 'Strategic Leadership Dynamics', description: 'Frameworks for leading global teams in a volatile economy.', price: 199, category: 'Business', tutor_name: 'Dr. Aris Thorne', rating: 4.8, students: 215, badge: 'Popular', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBU0A-pKsqzRT3PuEH8fPf_aCG29SyD8nFwJ_o0qkfuPFDRN1noxEgMgPj3GAOeygBsrQWQsnOAKIlto24AZwQY1eR12_yjKSYGHnC0v1DYMyB95KhvqBPQN8XS9IeuJPec1mObjjo8OLNcsiqvKzunyhQW3UpJ1CcUejkVMeS-vPasMhlSEbSdRBkQVg6tW2Fs6NfjguKe3PtsPKLh5bAw5yROP7zvL1e_6b37A6UZvfU9ZBQ881KMA_zIoNKf_Mrktcr6F1Mo9B0' },
          { id: '3', title: 'UI Design Systems Mastery', description: 'Build comprehensive design systems for enterprise-grade apps.', price: 149, category: 'Design', tutor_name: 'Marcus Chen', rating: 5.0, students: 189, badge: 'New', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDOafUIQazqulVJCH2A1CneUBfZmp4DbEVpoUVbTlClKLAhiwjw4ykUn5iObIh5vmprN2Pxyg55bH9AIfssazMS2VOE81iWN7HxrDYOFTWqZQI-We80bPS3uIFUEr6l73nHDKfxXuCeHIWJiGxvrzVqUfNb3EkJ9jrs9PCRuxVA7Ps0iHvVElCsK8Ln4Sc2627OjmnflNdJZ6BXUpYMh1UpxuaQePCq98GXdayJhBxQqdUG9afL_uxfrWFmdxbhty37mqCzqhCoWaw' },
        ]);
      }

      // 2. Fetch tutors
      const { data: tutorsData } = await supabase
        .from('profiles')
        .select('id, full_name, avatar_url')
        .eq('role', 'tutor')
        .limit(4);

      if (tutorsData && tutorsData.length > 0) {
        const mappedTutors = tutorsData.map((t: any) => ({
          id: t.id,
          name: t.full_name || 'Tutor',
          role: 'Professional Educator',
          rating: 4.9,
          students: 240,
          img: t.avatar_url || 'https://lh3.googleusercontent.com/aida-public/AB6AXuAkwHthVntMd9wEfi9j5FhvIZmihyW6V2YYcAjx4xu8tUq0InLnFZz8N11P_BDLtL5Rp2OULQLOlYWEYeSvQm3mtU4EOfrWECl3ns1IVj3fnzRTGaP9iIXGHymgYCGe4yQZ890ut_U6Jn61cn7uX9Obn0ydG01HUn5tEk0bfIEkD52lzmNZAw5bMwGn1UrNZAZrfsl_RAUlTtcDXe3ZksS_zoARowFSVAYsXe1-ube4cY6F4YhObzr1rNTK5SnESqYDzJukl39y2qA'
        }));
        setTutorsList(mappedTutors);
      } else {
        setTutorsList([
          { id: '1', name: 'Dr. Aris Thorne', role: 'Strategic Management', rating: 4.9, students: 1240, img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAkwHthVntMd9wEfi9j5FhvIZmihyW6V2YYcAjx4xu8tUq0InLnFZz8N11P_BDLtL5Rp2OULQLOlYWEYeSvQm3mtU4EOfrWECl3ns1IVj3fnzRTGaP9iIXGHymgYCGe4yQZ890ut_U6Jn61cn7uX9Obn0ydG01HUn5tEk0bfIEkD52lzmNZAw5bMwGn1UrNZAZrfsl_RAUlTtcDXe3ZksS_zoARowFSVAYsXe1-ube4cY6F4YhObzr1rNTK5SnESqYDzJukl39y2qA' },
          { id: '2', name: 'Elena Vance', role: 'Data Science', rating: 4.8, students: 980, img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAi_Sy7JWxGwunf7C-cUhoYSp8aByiVOB9ZFzO_tx6I7CrrsHUNYhAxIWNSDE8sZkdukYnjLfAhexx4JO67JyoS0UnuXuN4fmRMH3w9uxL-Y5-XmeLS3hsRpust1JwsqAwKF51XNTf9V4OzaVdoOYyMhfIBxb7yOooINOeEe8yzO_an5DlftuD3_ztDGWSBiszYPxV8vUt2NEafXQ6KZ1gTatRgpVZlABLHv4ZQRwaVpv6BzWK5aV3wcUglfDzEFJ9jXm8qOmDN5x8' },
          { id: '3', name: 'Marcus Chen', role: 'UI/UX Design', rating: 5.0, students: 750, img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDPS6OGJ9QIKI3eKmsdJm7NuGM_hsZSFFHAGDC1hbFWyq1x_j3w5z9Sji22zEF5sUE4CdInsBczSUkpixivTTOSuLfULU7ZfPINBpJ8E4rQFBJUTuMqc9QakSJoHRD7utv6tF2h_RhYAR8mMAmoKI5TuAsjKe6S_36R2i8gkZqXC0jjagAnRByANkXfWVInH1Vzeq6kOq7OFfVwdmDIrBpGHr6NLWr9YtHtEWNYS6Ulb75iVQtm4zHYgIpxVq5tq199n8WvCo3u0O4' },
          { id: '4', name: 'Sarah Jenkins', role: 'Cybersecurity', rating: 4.7, students: 620, img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA9acdcfIFqQiWbZDJ_-0OYp0EjN5TCGNLmg10l8pzXhN8tSFMNH-lH0-yraGSpkCvANEHLmZzmsHhKWh8DH47UBzCMbo-ITdsAMt0uhHkXxfLU39RelOCkWJk1UI7qAXk6uaGDMb3rxlfODdVdyCPl1hw4qZqPPnYuPWX--0FhIVJ6IgPQfS0adrfpsappaQE3PsCg5IJ_fqs9A8VFObcaExzUSEN64t7vN45iL5ZWLtMayAQef97ukBU6a13JOvPEF-RpMX388fE' },
        ]);
      }
    }

    fetchData();
  }, []);

  const testimonials = [
    { quote: '"The information architecture of Skill Junction is unparalleled. It provided exactly the structured environment I needed to pivot into Enterprise Architecture."', name: 'Julian Pierce', role: 'Solutions Architect at TechFlow' },
    { quote: '"I went from zero to landing a senior data engineering role in 8 months. The tutors here are genuinely world-class."', name: 'Priya Sharma', role: 'Senior Data Engineer at FinFirst' },
    { quote: '"The UI Design Systems course gave me the vocabulary and frameworks I was missing. My work quality improved overnight."', name: 'Alex Mercer', role: 'Product Designer at Novara' },
  ];

  return (
    <>
      <Navbar />

      {/* Hero */}
      <section className="relative w-full min-h-screen flex items-center px-margin-mobile md:px-margin-desktop bg-surface overflow-hidden pt-16">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-primary/5 to-transparent pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-1/3 h-1/2 bg-gradient-to-tr from-teal/5 to-transparent pointer-events-none" />

        <div className="relative z-10 grid grid-cols-1 md:grid-cols-12 gap-gutter w-full max-w-container-max mx-auto py-20">
          <div className="md:col-span-7 flex flex-col justify-center gap-stack-lg">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-label-sm w-fit font-semibold">
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              Modern Professional Education
            </div>
            <h1 className="text-display-lg font-bold text-on-surface leading-[1.1]">
              Elevate Your Skills with <br /><span className="text-primary">Academic Precision</span>
            </h1>
            <p className="text-body-lg text-on-surface-variant max-w-xl">
              A curated learning ecosystem designed for modern professionals. Master complex subjects through world-class tutoring.
            </p>
            <div className="flex flex-wrap gap-4 pt-4">
              <Link href="/auth/signup" className="bg-primary text-on-primary px-10 py-4 rounded-xl font-semibold text-headline-md hover:shadow-xl hover:shadow-primary/30 transition-all active:scale-95">
                Start Learning
              </Link>
              <Link href="/auth/signup?role=tutor" className="border-2 border-primary/20 text-primary px-10 py-4 rounded-xl font-semibold text-headline-md hover:bg-primary/5 hover:border-primary transition-all active:scale-95">
                Join as Tutor
              </Link>
            </div>
            {/* Quick stats */}
            <div className="flex flex-wrap gap-8 pt-8 border-t border-outline-variant/30">
              <div>
                <p className="text-2xl font-extrabold text-primary">12,000+</p>
                <p className="text-label-md text-on-surface-variant">Active Learners</p>
              </div>
              <div>
                <p className="text-2xl font-extrabold text-primary">350+</p>
                <p className="text-label-md text-on-surface-variant">Expert Courses</p>
              </div>
              <div>
                <p className="text-2xl font-extrabold text-primary">98%</p>
                <p className="text-label-md text-on-surface-variant">Satisfaction Rate</p>
              </div>
              <div>
                <p className="text-2xl font-extrabold text-primary">180+</p>
                <p className="text-label-md text-on-surface-variant">Verified Tutors</p>
              </div>
            </div>
          </div>

          <div className="md:col-span-5 hidden md:block">
            <div className="relative h-[550px] w-full rounded-2xl overflow-hidden shadow-2xl premium-shadow rotate-1 transform-gpu">
              <img
                alt="Student learning"
                className="w-full h-full object-cover"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuB2DSmyNIJmnob_aXm7HYb1azWOF5z8MvwybvYEZGTUj-1HPX3x0FuzGmgXQ3OLe7CHqQO8AjJiTgQofCI3ZK-2sKvMF-hOaTeHjPKXhQkYjNYfPEA2VUVUTJv9BwOPgGjagKsF0dAtWmdN7VjDT6TKXvKiujVolDIv5xTyzoSQgkl0p83UzYgY5vK5JY05zl_FNLXt6evDSqKPc2KQSPJBaM0ajTeX6tz_H8Siqpwop6L1YNbLTvwsEMhP3_u9Tpj3YuZzsRJo-P4"
              />
              {/* Floating card */}
              <div className="absolute bottom-6 left-6 right-6 glass-card rounded-xl p-4 flex items-center gap-3">
                <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuAi_Sy7JWxGwunf7C-cUhoYSp8aByiVOB9ZFzO_tx6I7CrrsHUNYhAxIWNSDE8sZkdukYnjLfAhexx4JO67JyoS0UnuXuN4fmRMH3w9uxL-Y5-XmeLS3hsRpust1JwsqAwKF51XNTf9V4OzaVdoOYyMhfIBxb7yOooINOeEe8yzO_an5DlftuD3_ztDGWSBiszYPxV8vUt2NEafXQ6KZ1gTatRgpVZlABLHv4ZQRwaVpv6BzWK5aV3wcUglfDzEFJ9jXm8qOmDN5x8" className="w-10 h-10 rounded-full object-cover" alt="Tutor" />
                <div>
                  <p className="text-label-md font-bold text-on-surface">Elena Vance</p>
                  <p className="text-label-sm text-on-surface-variant">Data Science · 980 students</p>
                </div>
                <div className="ml-auto flex items-center gap-1">
                  <span className="material-symbols-outlined text-amber-400 text-[18px]">star</span>
                  <span className="font-bold text-label-md">4.8</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Courses */}
      <section id="courses" className="py-section-gap px-margin-mobile md:px-margin-desktop bg-background">
        <div className="max-w-container-max mx-auto">
          <div className="flex justify-between items-end mb-12">
            <div>
              <span className="text-primary font-semibold text-label-md tracking-[0.15em] uppercase">Expertise</span>
              <h2 className="text-headline-lg font-bold text-on-surface mt-2">Featured Courses</h2>
            </div>
            <Link href="/courses" className="text-primary font-semibold text-label-md flex items-center gap-2 hover:gap-3 transition-all">
              View All <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {coursesList.map((course) => (
              <Link key={course.id} href={`/courses/${course.id}`} className="glass-card rounded-xl overflow-hidden shadow-sm course-card-hover group block">
                <div className="aspect-video w-full relative overflow-hidden">
                  <img alt={course.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" src={course.img} />
                  <span className="absolute top-4 right-4 bg-primary text-on-primary px-3 py-1 rounded-full text-label-sm font-semibold shadow-lg">{course.badge}</span>
                </div>
                <div className="p-8 flex flex-col gap-3">
                  <p className="text-primary text-label-sm font-bold uppercase tracking-wider">{course.category}</p>
                  <h3 className="text-headline-md font-bold text-on-surface">{course.title}</h3>
                  <p className="text-on-surface-variant text-body-md line-clamp-2">{course.description}</p>
                  <div className="flex items-center gap-2 text-label-sm text-on-surface-variant mt-1">
                    <span className="material-symbols-outlined text-[16px]">person</span>
                    {course.tutor_name} · {course.students} students
                  </div>
                  <div className="flex justify-between items-center mt-4 pt-4 border-t border-outline-variant/30">
                    <span className="text-headline-md font-bold text-primary">${course.price}</span>
                    <div className="flex items-center gap-1">
                      <span className="material-symbols-outlined text-amber-400 text-[18px]">star</span>
                      <span className="font-bold text-label-md text-on-surface">{course.rating}</span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Tutors */}
      <section id="tutors" className="py-section-gap px-margin-mobile md:px-margin-desktop bg-surface-container-low">
        <div className="max-w-container-max mx-auto">
          <div className="text-center mb-16">
            <span className="text-primary font-semibold text-label-md tracking-[0.15em] uppercase">Faculty</span>
            <h2 className="text-headline-lg font-bold text-on-surface mt-2">Taught by Industry Authorities</h2>
            <p className="text-on-surface-variant max-w-2xl mx-auto mt-4 text-body-lg">Learn from professionals who bring real-world experience to your screen.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {tutorsList.map((tutor) => (
              <Link key={tutor.id} href={`/tutors/${tutor.id}`} className="glass-card p-8 rounded-xl text-center flex flex-col items-center gap-5 shadow-sm hover:shadow-xl transition-all border border-outline-variant/30 group block">
                <div className="relative">
                  <img alt={tutor.name} className="w-24 h-24 rounded-full object-cover border-4 border-surface shadow-md group-hover:scale-105 transition-transform" src={tutor.img} />
                  <div className="absolute bottom-1 right-1 bg-primary text-on-primary rounded-full p-1.5">
                    <span className="material-symbols-outlined text-[14px]">verified</span>
                  </div>
                </div>
                <div>
                  <h3 className="font-bold text-on-surface text-headline-md">{tutor.name}</h3>
                  <p className="text-primary font-semibold text-label-md mt-1">{tutor.role}</p>
                </div>
                <div className="flex gap-4 text-label-sm text-on-surface-variant">
                  <span className="flex items-center gap-1"><span className="material-symbols-outlined text-amber-400 text-[16px]">star</span>{tutor.rating}</span>
                  <span className="flex items-center gap-1"><span className="material-symbols-outlined text-[16px]">group</span>{tutor.students}</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-section-gap px-margin-mobile md:px-margin-desktop bg-on-surface text-surface overflow-hidden relative">
        <div className="relative z-10 max-w-4xl mx-auto text-center px-4">
          <span className="text-primary font-semibold text-label-md uppercase tracking-[0.3em] mb-6 block">Success Stories</span>
          <div className="min-h-[280px] flex items-center justify-center">
            <div className="transition-opacity duration-500">
              <blockquote className="text-headline-lg md:text-4xl italic leading-snug font-medium">{testimonials[activeTestimonial].quote}</blockquote>
              <div className="mt-10 flex flex-col items-center gap-2">
                <p className="text-xl font-bold text-primary">{testimonials[activeTestimonial].name}</p>
                <p className="text-surface-variant text-label-md opacity-70 tracking-wide uppercase">{testimonials[activeTestimonial].role}</p>
              </div>
            </div>
          </div>
          <div className="flex justify-center gap-3 mt-8">
            {testimonials.map((_, i) => (
              <button key={i} onClick={() => setActiveTestimonial(i)} className={`w-3 h-3 rounded-full transition-all ${i === activeTestimonial ? 'bg-primary scale-125' : 'bg-surface-variant/40 hover:bg-primary/50'}`} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="py-section-gap px-margin-mobile md:px-margin-desktop bg-primary text-on-primary">
        <div className="max-w-container-max mx-auto text-center">
          <h2 className="text-headline-lg font-bold mb-4">Ready to Elevate Your Career?</h2>
          <p className="text-on-primary/80 text-body-lg max-w-2xl mx-auto mb-10">Join thousands of professionals already learning on Skill Junction. Start your journey today.</p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link href="/auth/signup" className="bg-on-primary text-primary px-10 py-4 rounded-xl font-bold text-headline-md hover:shadow-xl hover:scale-105 transition-all active:scale-95">
              Enroll Now — It's Free
            </Link>
            <Link href="/courses" className="border-2 border-on-primary/30 text-on-primary px-10 py-4 rounded-xl font-bold text-headline-md hover:bg-on-primary/10 transition-all active:scale-95">
              Browse Courses
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-on-surface text-surface py-16 px-margin-mobile md:px-margin-desktop">
        <div className="max-w-container-max mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
          <div>
            <div className="font-extrabold text-xl text-primary mb-4 flex items-center gap-2">
              <span className="material-symbols-outlined">school</span>
              Skill Junction
            </div>
            <p className="text-surface-variant text-body-md leading-relaxed">A curated learning ecosystem for modern professionals.</p>
          </div>
          <div>
            <h4 className="font-bold text-label-md uppercase tracking-wider mb-4">Platform</h4>
            <ul className="space-y-3 text-surface-variant">
              <li><Link href="/courses" className="hover:text-primary transition-colors">Courses</Link></li>
              <li><Link href="#tutors" className="hover:text-primary transition-colors">Tutors</Link></li>
              <li><Link href="/calendar" className="hover:text-primary transition-colors">Calendar</Link></li>
              <li><Link href="/payments" className="hover:text-primary transition-colors">Payments</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-label-md uppercase tracking-wider mb-4">Dashboards</h4>
            <ul className="space-y-3 text-surface-variant">
              <li><Link href="/dashboard/learner" className="hover:text-primary transition-colors">Learner Dashboard</Link></li>
              <li><Link href="/dashboard/tutor" className="hover:text-primary transition-colors">Tutor Portal</Link></li>
              <li><Link href="/dashboard/parent" className="hover:text-primary transition-colors">Parent Dashboard</Link></li>
              <li><Link href="/dashboard/admin" className="hover:text-primary transition-colors">Admin Panel</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-label-md uppercase tracking-wider mb-4">Account</h4>
            <ul className="space-y-3 text-surface-variant">
              <li><Link href="/auth/login" className="hover:text-primary transition-colors">Sign In</Link></li>
              <li><Link href="/auth/signup" className="hover:text-primary transition-colors">Create Account</Link></li>
              <li><Link href="/auth/reset" className="hover:text-primary transition-colors">Reset Password</Link></li>
            </ul>
          </div>
        </div>
        <div className="max-w-container-max mx-auto mt-12 pt-8 border-t border-surface-variant/20 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-surface-variant text-label-md">© 2024 Skill Junction. All rights reserved.</p>
          <p className="text-surface-variant text-label-md">Built with Next.js & Supabase</p>
        </div>
      </footer>
    </>
  );
}
