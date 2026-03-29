import { NextRequest, NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { sql } from '@/lib/db'

// Cart is stored as a pending order per user
async function getOrCreateCart(userId: string) {
  let [cart] = await sql`SELECT * FROM orders WHERE user_id = ${userId} AND status = 'cart' LIMIT 1`
  if (!cart) {
    ;[cart] = await sql`
      INSERT INTO orders (user_id, status, total)
      VALUES (${userId}, 'cart', 0)
      RETURNING *
    `
  }
  return cart
}

export async function GET() {
  const session = await getSession()
  if (!session) return NextResponse.json({ success: false, error: 'unauthorized' })

  const cart = await getOrCreateCart(session.userId)
  const items = await sql`
    SELECT oi.*, p.name, p.image_url, p.stock
    FROM order_items oi
    JOIN products p ON p.id = oi.product_id
    WHERE oi.order_id = ${cart.id}
  `
  return NextResponse.json({ success: true, data: { cart, items } })
}

export async function POST(req: NextRequest) {
  const session = await getSession()
  if (!session) return NextResponse.json({ success: false, error: 'unauthorized' })

  const { productId, quantity } = await req.json()
  const [product] = await sql`SELECT * FROM products WHERE id = ${productId} AND active = true`
  if (!product) return NextResponse.json({ success: false, error: 'Produto não encontrado' })
  if (product.stock < quantity) return NextResponse.json({ success: false, error: 'Estoque insuficiente' })

  const cart = await getOrCreateCart(session.userId)

  const [existing] = await sql`SELECT * FROM order_items WHERE order_id = ${cart.id} AND product_id = ${productId}`
  if (existing) {
    await sql`UPDATE order_items SET quantity = quantity + ${quantity} WHERE id = ${existing.id}`
  } else {
    await sql`INSERT INTO order_items (order_id, product_id, quantity, unit_price) VALUES (${cart.id}, ${productId}, ${quantity}, ${product.price})`
  }

  // Recalc total
  await sql`
    UPDATE orders SET total = (
      SELECT COALESCE(SUM(unit_price * quantity), 0) FROM order_items WHERE order_id = ${cart.id}
    ) WHERE id = ${cart.id}
  `

  return NextResponse.json({ success: true })
}

export async function DELETE(req: NextRequest) {
  const session = await getSession()
  if (!session) return NextResponse.json({ success: false, error: 'unauthorized' })

  const { itemId } = await req.json()
  const cart = await getOrCreateCart(session.userId)
  await sql`DELETE FROM order_items WHERE id = ${itemId} AND order_id = ${cart.id}`
  await sql`
    UPDATE orders SET total = (
      SELECT COALESCE(SUM(unit_price * quantity), 0) FROM order_items WHERE order_id = ${cart.id}
    ) WHERE id = ${cart.id}
  `
  return NextResponse.json({ success: true })
}
