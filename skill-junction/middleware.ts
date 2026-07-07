import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  const { data: { user } } = await supabase.auth.getUser()

  // All dashboard routes and sub-pages are protected
  const protectedPrefixes = [
    '/dashboard',
    '/courses/enroll',
    '/payments',
    '/calendar',
    '/tutors',
  ]
  const isProtected = protectedPrefixes.some(p => request.nextUrl.pathname.startsWith(p))

  if (isProtected && !user) {
    const url = request.nextUrl.clone()
    url.pathname = '/auth/login'
    url.searchParams.set('next', request.nextUrl.pathname)
    return NextResponse.redirect(url)
  }

  // Redirect authenticated users away from auth pages to their role dashboard
  if (user && request.nextUrl.pathname.startsWith('/auth/') && !request.nextUrl.pathname.startsWith('/auth/update-password')) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()

    const role = profile?.role ?? 'learner'
    const url = request.nextUrl.clone()
    // super_admin and admin both go to /dashboard/admin
    url.pathname = role === 'super_admin' ? '/dashboard/admin' : `/dashboard/${role}`
    return NextResponse.redirect(url)
  }

  // Role-based access control for dashboard sub-paths
  if (user && request.nextUrl.pathname.startsWith('/dashboard/')) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()

    const role = profile?.role ?? 'learner'
    const path = request.nextUrl.pathname

    // Prevent cross-role access
    const rolePathMap: Record<string, string[]> = {
      super_admin: ['/dashboard/admin', '/dashboard/finance'],
      admin: ['/dashboard/admin', '/dashboard/finance'],
      tutor: ['/dashboard/tutor'],
      learner: ['/dashboard/learner'],
      parent: ['/dashboard/parent'],
      finance: ['/dashboard/finance', '/dashboard/admin/finance'],
    }

    const allowedPaths = rolePathMap[role] ?? []
    const isAllowed = allowedPaths.some(allowed => path.startsWith(allowed))

    if (!isAllowed) {
      const url = request.nextUrl.clone()
      url.pathname = role === 'super_admin' || role === 'admin'
        ? '/dashboard/admin'
        : `/dashboard/${role}`
      return NextResponse.redirect(url)
    }
  }

  return supabaseResponse
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
