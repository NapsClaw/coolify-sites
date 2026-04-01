import { NextRequest, NextResponse } from 'next/server'
import { sql } from '@/lib/db'
import { getSession } from '@/lib/auth'

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSession()
  if (!session) {
    return NextResponse.json({ success: false, error: 'Não autenticado' }, { status: 401 })
  }

  const { id } = await params
  const body = await req.json()

  try {
    const { has_voted } = body
    if (session.role === 'admin') {
      await sql`UPDATE idealeleitor.voters SET has_voted = ${has_voted}, updated_at = NOW() WHERE id = ${id}`
    } else {
      await sql`UPDATE idealeleitor.voters SET has_voted = ${has_voted}, updated_at = NOW() WHERE id = ${id} AND coordinator_id = ${session.userId}`
    }
    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('PATCH voter error:', err)
    return NextResponse.json({ success: false, error: 'Erro ao atualizar' }, { status: 500 })
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSession()
  if (!session) {
    return NextResponse.json({ success: false, error: 'Não autenticado' }, { status: 401 })
  }

  const { id } = await params

  try {
    if (session.role === 'admin') {
      await sql`DELETE FROM idealeleitor.voters WHERE id = ${id}`
    } else {
      await sql`DELETE FROM idealeleitor.voters WHERE id = ${id} AND coordinator_id = ${session.userId}`
    }
    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('DELETE voter error:', err)
    return NextResponse.json({ success: false, error: 'Erro ao excluir' }, { status: 500 })
  }
}
