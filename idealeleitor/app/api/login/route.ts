import { NextRequest, NextResponse } from 'next/server'
import { sql } from '@/lib/db'
import { signToken } from '@/lib/auth'
import bcrypt from 'bcryptjs'
import { cookies } from 'next/headers'

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json()

    if (!email || !password) {
      return NextResponse.json({ success: false, error: 'E-mail e senha são obrigatórios' }, { status: 400 })
    }

    const users = await sql`
      SELECT id, name, email, password_hash, role, is_active
      FROM idealeleitor.users
      WHERE email = ${email.toLowerCase().trim()}
      LIMIT 1
    `

    const user = users[0]

    if (!user || !user.is_active) {
      return NextResponse.json({ success: false, error: 'E-mail ou senha inválidos' }, { status: 401 })
    }

    const valid = await bcrypt.compare(password, user.password_hash)
    if (!valid) {
      return NextResponse.json({ success: false, error: 'E-mail ou senha inválidos' }, { status: 401 })
    }

    const token = await signToken({
      userId: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    })

    const cookieStore = await cookies()
    cookieStore.set('auth_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7,
      path: '/',
    })

    return NextResponse.json({
      success: true,
      data: { name: user.name, role: user.role },
    })
  } catch (err) {
    console.error('Login error:', err)
    return NextResponse.json({ success: false, error: 'Erro interno' }, { status: 500 })
  }
}
