import { NextRequest, NextResponse } from 'next/server'
import { sql } from '@/lib/db'
import bcrypt from 'bcryptjs'
import { signToken, COOKIE_NAME } from '@/lib/auth'

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json()
    if (!email || !password) {
      return NextResponse.json({ success: false, error: 'E-mail e senha são obrigatórios' })
    }

    const rows = await sql`SELECT * FROM admins WHERE email = ${email.toLowerCase().trim()} LIMIT 1`
    const admin = rows[0]

    if (!admin) {
      return NextResponse.json({ success: false, error: 'Credenciais inválidas' })
    }

    const valid = await bcrypt.compare(password, admin.password_hash)
    if (!valid) {
      return NextResponse.json({ success: false, error: 'Credenciais inválidas' })
    }

    const token = await signToken({ id: admin.id, email: admin.email, name: admin.name })

    const res = NextResponse.json({ success: true })
    res.cookies.set(COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24, // 24h
      path: '/'
    })
    return res
  } catch (e) {
    console.error(e)
    return NextResponse.json({ success: false, error: 'Erro interno' }, { status: 500 })
  }
}
