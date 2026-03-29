import { NextRequest, NextResponse } from 'next/server'
import { sql } from '@/lib/db'
import { getSession } from '@/lib/auth'

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSession()
  if (!session || session.role !== 'admin') {
    return NextResponse.json({ success: false, error: 'Acesso negado' }, { status: 403 })
  }

  const { id } = await params
  const body = await req.json()

  try {
    const { is_active } = body
    const result = await sql`
      UPDATE idealeleitor.users SET is_active = ${is_active}, updated_at = NOW()
      WHERE id = ${id} AND role = 'coordinator'
      RETURNING id, name, email, is_active
    `
    return NextResponse.json({ success: true, data: result[0] })
  } catch (err) {
    console.error('PATCH coordinator error:', err)
    return NextResponse.json({ success: false, error: 'Erro ao atualizar' }, { status: 500 })
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSession()
  if (!session || session.role !== 'admin') {
    return NextResponse.json({ success: false, error: 'Acesso negado' }, { status: 403 })
  }

  const { id } = await params

  try {
    await sql`DELETE FROM idealeleitor.voters WHERE coordinator_id = ${id}`
    await sql`DELETE FROM idealeleitor.users WHERE id = ${id} AND role = 'coordinator'`
    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('DELETE coordinator error:', err)
    return NextResponse.json({ success: false, error: 'Erro ao excluir coordenador' }, { status: 500 })
  }
}
