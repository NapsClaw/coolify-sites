import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { sql } from '@/lib/db'
import { signToken } from '@/lib/auth'
import { cookies } from 'next/headers'

export async function POST(req: NextRequest) {
  try {
    const { name, email, phone, password } = await req.json()

    if (!name || !email || !password) {
      return NextResponse.json({ success: false, error: 'Dados obrigatórios faltando' }, { status: 400 })
    }

    if (password.length < 6) {
      return NextResponse.json({ success: false, error: 'Senha deve ter pelo menos 6 caracteres' }, { status: 400 })
    }

    const existing = await sql`SELECT id FROM users WHERE email = ${email}`
    if (existing.length > 0) {
      return NextResponse.json({ success: false, error: 'E-mail já cadastrado' }, { status: 400 })
    }

    const hash = await bcrypt.hash(password, 10)
    const [user] = await sql`
      INSERT INTO users (name, email, phone, password_hash, role)
      VALUES (${name}, ${email}, ${phone || null}, ${hash}, 'customer')
      RETURNING id, name, email, role
    `

    const token = await signToken({ userId: user.id, email: user.email, role: user.role })
    const cookieStore = await cookies()
    cookieStore.set('auth_token', token, { httpOnly: true, maxAge: 60 * 60 * 24 * 7, path: '/' })

    return NextResponse.json({ success: true, data: user })
  } catch (err: any) {
    return NextResponse.json({ success: false, error: 'Erro interno' }, { status: 500 })
  }
}
