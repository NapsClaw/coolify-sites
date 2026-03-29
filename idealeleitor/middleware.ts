import { NextRequest, NextResponse } from 'next/server'
import { verifyToken } from '@/lib/auth'
import { cookies } from 'next/headers'

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl

  // Public routes
  if (
    pathname === '/' ||
    pathname.startsWith('/auth/') ||
    pathname.startsWith('/api/login') ||
    pathname.startsWith('/_next') ||
    pathname.startsWith('/favicon')
  ) {
    return NextResponse.next()
  }

  const cookieStore = await cookies()
  const token = cookieStore.get('auth_token')?.value

  if (!token) {
    return NextResponse.redirect(new URL('/auth/login', req.url))
  }

  const session = await verifyToken(token)
  if (!session) {
    return NextResponse.redirect(new URL('/auth/login', req.url))
  }

  // Admin-only routes
  if (pathname.startsWith('/admin') && session.role !== 'admin') {
    return NextResponse.redirect(new URL('/dashboard', req.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}
