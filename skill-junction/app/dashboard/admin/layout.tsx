import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Sidebar from '@/components/Sidebar'
import NotificationBell from '@/components/ui/NotificationBell'

const navItems = [
  { label: 'Dashboard', icon: 'dashboard', href: '/dashboard/admin' },
  { label: 'Learner Database', icon: 'group', href: '/dashboard/admin/learners' },
  { label: 'Tutor Management', icon: 'person_chalkboard', href: '/dashboard/admin/tutors' },
  { label: 'Financial Analytics', icon: 'analytics', href: '/dashboard/admin/finance' },
  { label: 'Platform Calendar', icon: 'calendar_month', href: '/calendar' },
  { label: 'Courses', icon: 'menu_book', href: '/courses' },
  { label: 'Payments', icon: 'credit_card', href: '/payments/manage' },
]

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/auth/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('full_name, role')
    .eq('id', user.id)
    .single()

  if (profile?.role !== 'admin' && profile?.role !== 'super_admin') {
    redirect(`/dashboard/${profile?.role ?? 'learner'}`)
  }

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar
        navItems={navItems}
        role={profile.role as 'admin' | 'super_admin'}
        userName={profile?.full_name || user.email || 'Admin'}
        userId={user.id}
      />
      <div className="flex-1 md:ml-64">
        <header className="h-16 bg-surface/80 backdrop-blur-md border-b border-outline-variant/30 flex items-center justify-between px-6 sticky top-0 z-20">
          <div className="flex items-center gap-3 pl-12 md:pl-0">
            <div className="relative hidden md:block">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-[20px]">search</span>
              <input
                type="text"
                placeholder="Search learners, tutors, data..."
                className="pl-10 pr-6 py-2 bg-surface-container-low border border-outline-variant/50 rounded-full text-sm w-80 focus:ring-2 focus:ring-primary/20 focus:border-primary focus:outline-none transition-all"
              />
            </div>
          </div>
          <div className="flex items-center gap-3">
            <NotificationBell userId={user.id} />
            <div className="flex items-center gap-2 pl-3 border-l border-outline-variant/30">
              <div className="w-8 h-8 rounded-full bg-error/10 text-error flex items-center justify-center font-bold text-sm">
                {(profile?.full_name || 'A').charAt(0).toUpperCase()}
              </div>
              <div className="hidden md:block">
                <p className="text-xs font-semibold text-on-surface">{profile?.full_name || 'Admin'}</p>
                <p className="text-[10px] text-on-surface-variant">{profile.role === 'super_admin' ? 'Super Admin' : 'Administrator'}</p>
              </div>
            </div>
          </div>
        </header>
        <main className="p-6">{children}</main>
      </div>
    </div>
  )
}
