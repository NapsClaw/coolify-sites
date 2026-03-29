import { NextRequest, NextResponse } from 'next/server'
import { sql } from '@/lib/db'
import { getSession } from '@/lib/auth'

export async function GET(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const [product] = await sql`
    SELECT p.*, c.name as category_name FROM products p
    LEFT JOIN categories c ON p.category_id = c.id
    WHERE p.id = ${id} AND p.active = true
  `
  if (!product) return NextResponse.json({ success: false, error: 'Produto não encontrado' }, { status: 404 })
  return NextResponse.json({ success: true, data: product })
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession()
  if (!session || session.role !== 'admin') {
    return NextResponse.json({ success: false, error: 'unauthorized' }, { status: 401 })
  }
  const { id } = await params
  const body = await req.json()
  const { name, description, price, stock, image_url, featured, active, category_id } = body

  const [product] = await sql`
    UPDATE products SET
      name = COALESCE(${name}, name),
      description = COALESCE(${description}, description),
      price = COALESCE(${price}, price),
      stock = COALESCE(${stock}, stock),
      image_url = COALESCE(${image_url}, image_url),
      featured = COALESCE(${featured}, featured),
      active = COALESCE(${active}, active),
      category_id = COALESCE(${category_id}, category_id),
      updated_at = NOW()
    WHERE id = ${id}
    RETURNING *
  `
  return NextResponse.json({ success: true, data: product })
}

export async function DELETE(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession()
  if (!session || session.role !== 'admin') {
    return NextResponse.json({ success: false, error: 'unauthorized' }, { status: 401 })
  }
  const { id } = await params
  await sql`UPDATE products SET active = false WHERE id = ${id}`
  return NextResponse.json({ success: true })
}
