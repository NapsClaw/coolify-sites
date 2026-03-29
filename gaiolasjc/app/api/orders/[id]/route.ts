import { NextRequest, NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { sql } from '@/lib/db'

export async function GET(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession()
  if (!session) return NextResponse.json({ success: false, error: 'unauthorized' })

  const { id } = await params

  const [order] = session.role === 'admin'
    ? await sql`SELECT o.*, u.name as user_name, u.email as user_email, u.phone as user_phone FROM orders o JOIN users u ON u.id = o.user_id WHERE o.id = ${id} AND o.status != 'cart'`
    : await sql`SELECT * FROM orders WHERE id = ${id} AND user_id = ${session.userId} AND status != 'cart'`

  if (!order) return NextResponse.json({ success: false, error: 'Pedido não encontrado' }, { status: 404 })

  const items = await sql`
    SELECT oi.*, p.name, p.image_url FROM order_items oi
    JOIN products p ON p.id = oi.product_id
    WHERE oi.order_id = ${id}
  `
  return NextResponse.json({ success: true, data: { order, items } })
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession()
  if (!session || session.role !== 'admin') {
    return NextResponse.json({ success: false, error: 'unauthorized' }, { status: 401 })
  }
  const { id } = await params
  const { status } = await req.json()
  const [order] = await sql`UPDATE orders SET status = ${status}, updated_at = NOW() WHERE id = ${id} RETURNING *`
  return NextResponse.json({ success: true, data: order })
}
