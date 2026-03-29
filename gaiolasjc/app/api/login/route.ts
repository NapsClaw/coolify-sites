import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { sql } from '@/lib/db'
import { signToken } from '@/lib/auth'
import { cookies } from 'next/headers'

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json()

    const [user] = await sql`SELECT * FROM users WHERE email = ${email}`
    if (!user) {
      return NextResponse.json({ success: false, error: 'Email ou senha incorretos' }, { status: 401 })
    }

    const match = await bcrypt.compare(password, user.password_hash)
    if (!match) {
      return NextResponse.json({ success: false, error: 'Email ou senha incorretos' }, { status: 401 })
    }

    const token = signToken({ userId: user.id, email: user.email, role: user.role })
    const cookieStore = await cookies()
    cookieStore.set('auth_token', token, { httpOnly: true, maxAge: 60 * 60 * 24 * 7, path: '/' })

    return NextResponse.json({ success: true, data: { id: user.id, name: user.name, email: user.email, role: user.role } })
  } catch {
    return NextResponse.json({ success: false, error: 'Erro interno' }, { status: 500 })
  }
}
