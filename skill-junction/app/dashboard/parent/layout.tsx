import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Sidebar from '@/components/Sidebar'
import NotificationBell from '@/components/ui/NotificationBell'

const navItems = [
  { label: 'Dashboard', icon: 'dashboard', href: '/dashboard/parent' },
  { label: 'Child Performance', icon: 'monitoring', href: '/dashboard/parent/monitor' },
  { label: 'Payments History', icon: 'credit_card', href: '/payments' },
  { label: 'Platform Calendar', icon: 'calendar_month', href: '/calendar' },
]

export default async function ParentLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/auth/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('full_name, role')
    .eq('id', user.id)
    .single()

  if (profile?.role && profile.role !== 'parent' && profile.role !== 'admin' && profile.role !== 'super_admin') {
    redirect(`/dashboard/${profile.role}`)
  }

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar
        navItems={navItems}
        role="parent"
        userName={profile?.full_name || user.email || 'Parent'}
        userId={user.id}
      />
      <div className="flex-1 md:ml-64">
        <header className="h-16 bg-surface/80 backdrop-blur-md border-b border-outline-variant/30 flex items-center justify-between px-6 sticky top-0 z-20">
          <div className="pl-12 md:pl-0">
            <span className="font-semibold text-on-surface-variant uppercase tracking-wider text-xs">Parent Portal</span>
          </div>
          <div className="flex items-center gap-3">
            <NotificationBell userId={user.id} />
            <div className="flex items-center gap-2 pl-3 border-l border-outline-variant/30">
              <div className="w-8 h-8 rounded-full bg-secondary/10 text-secondary flex items-center justify-center font-bold text-sm">
                {(profile?.full_name || 'P').charAt(0).toUpperCase()}
              </div>
              <div className="hidden md:block">
                <p className="text-xs font-semibold text-on-surface">{profile?.full_name || 'Parent'}</p>
                <p className="text-[10px] text-on-surface-variant">Parent</p>
              </div>
            </div>
          </div>
        </header>
        <main className="p-6">{children}</main>
      </div>
    </div>
  )
}
