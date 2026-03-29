import { NextRequest, NextResponse } from 'next/server'
import { sql } from '@/lib/db'
import { getSession } from '@/lib/auth'
import bcrypt from 'bcryptjs'

export async function GET() {
  const session = await getSession()
  if (!session || session.role !== 'admin') {
    return NextResponse.json({ success: false, error: 'Acesso negado' }, { status: 403 })
  }

  try {
    const coordinators = await sql`
      SELECT u.id, u.name, u.email, u.is_active, u.created_at,
        COUNT(v.id)::int AS voter_count
      FROM idealeleitor.users u
      LEFT JOIN idealeleitor.voters v ON v.coordinator_id = u.id
      WHERE u.role = 'coordinator'
      GROUP BY u.id, u.name, u.email, u.is_active, u.created_at
      ORDER BY u.name
    `
    return NextResponse.json({ success: true, data: coordinators })
  } catch (err) {
    console.error('GET coordinators error:', err)
    return NextResponse.json({ success: false, error: 'Erro ao buscar coordenadores' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  const session = await getSession()
  if (!session || session.role !== 'admin') {
    return NextResponse.json({ success: false, error: 'Acesso negado' }, { status: 403 })
  }

  try {
    const { name, email, password } = await req.json()

    if (!name || !email || !password) {
      return NextResponse.json({ success: false, error: 'Nome, e-mail e senha são obrigatórios' }, { status: 400 })
    }

    const existing = await sql`SELECT id FROM idealeleitor.users WHERE email = ${email.toLowerCase().trim()} LIMIT 1`
    if (existing.length > 0) {
      return NextResponse.json({ success: false, error: 'E-mail já cadastrado' }, { status: 409 })
    }

    const hash = await bcrypt.hash(password, 10)
    const result = await sql`
      INSERT INTO idealeleitor.users (name, email, password_hash, role)
      VALUES (${name}, ${email.toLowerCase().trim()}, ${hash}, 'coordinator')
      RETURNING id, name, email, role, is_active, created_at
    `

    return NextResponse.json({ success: true, data: result[0] }, { status: 201 })
  } catch (err) {
    console.error('POST coordinator error:', err)
    return NextResponse.json({ success: false, error: 'Erro ao criar coordenador' }, { status: 500 })
  }
}
