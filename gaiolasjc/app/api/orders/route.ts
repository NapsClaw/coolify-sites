import { NextRequest, NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { sql } from '@/lib/db'

export async function GET() {
  const session = await getSession()
  if (!session) return NextResponse.json({ success: false, error: 'unauthorized' })

  let orders
  if (session.role === 'admin') {
    orders = await sql`
      SELECT o.*, u.name as user_name, u.email as user_email, COUNT(oi.id) as item_count
      FROM orders o
      JOIN users u ON u.id = o.user_id
      LEFT JOIN order_items oi ON oi.order_id = o.id
      WHERE o.status != 'cart'
      GROUP BY o.id, u.name, u.email
      ORDER BY o.created_at DESC
    `
  } else {
    orders = await sql`
      SELECT o.*, COUNT(oi.id) as item_count
      FROM orders o
      LEFT JOIN order_items oi ON oi.order_id = o.id
      WHERE o.user_id = ${session.userId} AND o.status != 'cart'
      GROUP BY o.id
      ORDER BY o.created_at DESC
    `
  }
  return NextResponse.json({ success: true, data: orders })
}

export async function POST(req: NextRequest) {
  const session = await getSession()
  if (!session) return NextResponse.json({ success: false, error: 'unauthorized' })

  const { shipping_address, notes } = await req.json()

  // Get cart
  const [cart] = await sql`SELECT * FROM orders WHERE user_id = ${session.userId} AND status = 'cart'`
  if (!cart) return NextResponse.json({ success: false, error: 'Carrinho vazio' })

  const items = await sql`SELECT * FROM order_items WHERE order_id = ${cart.id}`
  if (items.length === 0) return NextResponse.json({ success: false, error: 'Carrinho vazio' })

  // Convert cart to order
  const [order] = await sql`
    UPDATE orders SET
      status = 'pending',
      shipping_address = ${shipping_address || null},
      notes = ${notes || null},
      updated_at = NOW()
    WHERE id = ${cart.id}
    RETURNING *
  `

  // Reduce stock
  for (const item of items) {
    await sql`UPDATE products SET stock = stock - ${item.quantity} WHERE id = ${item.product_id}`
  }

  return NextResponse.json({ success: true, data: order })
}
