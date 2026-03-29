import { NextRequest, NextResponse } from 'next/server'
import { sql } from '@/lib/db'
import { getSession } from '@/lib/auth'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const cat = searchParams.get('cat')
  const featured = searchParams.get('featured')

  let products
  if (cat) {
    products = await sql`
      SELECT p.*, c.name as category_name FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      WHERE p.active = true AND c.slug = ${cat}
      ORDER BY p.featured DESC, p.created_at DESC
    `
  } else if (featured) {
    products = await sql`
      SELECT p.*, c.name as category_name FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      WHERE p.active = true AND p.featured = true
      LIMIT 6
    `
  } else {
    products = await sql`
      SELECT p.*, c.name as category_name FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      WHERE p.active = true
      ORDER BY p.featured DESC, p.created_at DESC
    `
  }
  return NextResponse.json({ success: true, data: products })
}

export async function POST(req: NextRequest) {
  const session = await getSession()
  if (!session || session.role !== 'admin') {
    return NextResponse.json({ success: false, error: 'unauthorized' }, { status: 401 })
  }

  const body = await req.json()
  const { name, category_id, description, price, stock, image_url, featured } = body
  const slug = name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')

  const [product] = await sql`
    INSERT INTO products (name, slug, category_id, description, price, stock, image_url, featured)
    VALUES (${name}, ${slug + '-' + Date.now()}, ${category_id}, ${description || null}, ${price}, ${stock || 0}, ${image_url || null}, ${featured || false})
    RETURNING *
  `
  return NextResponse.json({ success: true, data: product })
}
