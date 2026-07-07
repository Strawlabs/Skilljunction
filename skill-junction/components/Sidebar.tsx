'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

interface NavItem {
  label: string
  icon: string
  href: string
}

interface SidebarProps {
  navItems: NavItem[]
  role: 'learner' | 'tutor' | 'admin' | 'super_admin' | 'parent' | 'finance'
  userName?: string
  userId?: string
}

export default function Sidebar({ navItems, role, userName = 'User', userId }: SidebarProps) {
  const pathname = usePathname()
  const router = useRouter()
  const supabase = createClient()
  const [mobileOpen, setMobileOpen] = useState(false)

  const roleColors: Record<string, string> = {
    learner:     'bg-primary/10 text-primary',
    tutor:       'bg-tertiary/10 text-tertiary',
    admin:       'bg-error/10 text-error',
    super_admin: 'bg-error/10 text-error',
    parent:      'bg-secondary/10 text-secondary',
    finance:     'bg-amber-100 text-amber-700',
  }

  const roleLabels: Record<string, string> = {
    learner:     'Learner',
    tutor:       'Tutor',
    admin:       'Administrator',
    super_admin: 'Super Admin',
    parent:      'Parent',
    finance:     'Finance',
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/')
    router.refresh()
  }

  const NavContent = () => (
    <>
      {/* Logo */}
      <div className="h-16 flex items-center px-6 border-b border-outline-variant/30 flex-shrink-0">
        <Link href="/" className="flex items-center gap-2" onClick={() => setMobileOpen(false)}>
          <span className="material-symbols-outlined text-primary text-2xl">school</span>
          <span className="font-extrabold text-[18px] text-primary">Skill Junction</span>
        </Link>
      </div>

      {/* User chip */}
      <div className="p-4 border-b border-outline-variant/20 flex-shrink-0">
        <div className="flex items-center gap-3 p-3 rounded-xl bg-surface-container-low">
          <div className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0 ${roleColors[role]}`}>
            {userName.charAt(0).toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-on-surface truncate">{userName}</p>
            <p className="text-[11px] text-on-surface-variant">{roleLabels[role]}</p>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {navItems.map(item => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + '/')
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setMobileOpen(false)}
              className={`sidebar-link flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                isActive
                  ? 'bg-primary/10 text-primary font-semibold'
                  : 'text-on-surface-variant hover:bg-surface-container hover:text-on-surface'
              }`}
            >
              <span
                className="material-symbols-outlined text-[20px]"
                style={{ fontVariationSettings: isActive ? "'FILL' 1" : "'FILL' 0" }}
              >
                {item.icon}
              </span>
              {item.label}
            </Link>
          )
        })}
      </nav>

      {/* Logout */}
      <div className="p-4 border-t border-outline-variant/20 flex-shrink-0">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-on-surface-variant hover:bg-error/10 hover:text-error transition-all w-full"
        >
          <span className="material-symbols-outlined text-[20px]">logout</span>
          Sign Out
        </button>
      </div>
    </>
  )

  return (
    <>
      {/* Mobile hamburger */}
      <button
        className="fixed top-4 left-4 z-50 md:hidden p-2 bg-surface rounded-xl shadow-md border border-outline-variant/20 text-on-surface"
        onClick={() => setMobileOpen(true)}
        aria-label="Open navigation"
      >
        <span className="material-symbols-outlined">menu</span>
      </button>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-inverse-surface/40 backdrop-blur-sm md:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Mobile drawer */}
      <aside
        className={`fixed top-0 left-0 h-full z-50 w-64 bg-surface border-r border-outline-variant/30 flex flex-col
          transition-transform duration-300 md:hidden
          ${mobileOpen ? 'translate-x-0' : '-translate-x-full'}`}
      >
        <button
          className="absolute top-4 right-4 p-1 text-on-surface-variant hover:text-on-surface"
          onClick={() => setMobileOpen(false)}
        >
          <span className="material-symbols-outlined">close</span>
        </button>
        <NavContent />
      </aside>

      {/* Desktop fixed sidebar */}
      <aside className="hidden md:flex w-64 min-h-screen bg-surface border-r border-outline-variant/30 flex-col fixed top-0 left-0 z-30">
        <NavContent />
      </aside>
    </>
  )
}
