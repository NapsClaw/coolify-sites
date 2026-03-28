import { NextRequest, NextResponse } from 'next/server'
import { sql } from '@/lib/db'
import { getSession } from '@/lib/auth'
import { makeSlug } from '@/lib/utils'

async function auth(req: NextRequest) {
  const session = await getSession()
  if (!session) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
  return null
}

// Create
export async function POST(req: NextRequest) {
  const unauth = await auth(req)
  if (unauth) return unauth

  try {
    const { title, slug, summary, content, cover_url, category_id, author, published } = await req.json()
    if (!title?.trim() || !content?.trim()) {
      return NextResponse.json({ success: false, error: 'Título e conteúdo são obrigatórios' })
    }

    const finalSlug = (slug?.trim() || makeSlug(title)) + '-' + Date.now().toString(36)

    const rows = await sql`
      INSERT INTO news (title, slug, summary, content, cover_url, category_id, author, published, published_at)
      VALUES (
        ${title.trim()},
        ${finalSlug},
        ${summary?.trim() || null},
        ${content.trim()},
        ${cover_url?.trim() || null},
        ${category_id || null},
        ${author?.trim() || 'Redação EsporteAção'},
        ${!!published},
        ${published ? new Date().toISOString() : null}
      )
      RETURNING *
    `
    return NextResponse.json({ success: true, data: rows[0] })
  } catch (e: any) {
    console.error(e)
    return NextResponse.json({ success: false, error: e.message }, { status: 500 })
  }
}

// Update (full or partial)
export async function PUT(req: NextRequest) {
  const unauth = await auth(req)
  if (unauth) return unauth

  try {
    const { id, title, slug, summary, content, cover_url, category_id, author, published } = await req.json()
    if (!id) return NextResponse.json({ success: false, error: 'ID obrigatório' })

    const rows = await sql`
      UPDATE news SET
        title = ${title.trim()},
        slug = ${slug.trim()},
        summary = ${summary?.trim() || null},
        content = ${content.trim()},
        cover_url = ${cover_url?.trim() || null},
        category_id = ${category_id || null},
        author = ${author?.trim() || 'Redação EsporteAção'},
        published = ${!!published},
        published_at = CASE WHEN ${!!published} AND published_at IS NULL THEN NOW() ELSE published_at END,
        updated_at = NOW()
      WHERE id = ${id}
      RETURNING *
    `
    return NextResponse.json({ success: true, data: rows[0] })
  } catch (e: any) {
    return NextResponse.json({ success: false, error: e.message }, { status: 500 })
  }
}

// Partial update (publish/unpublish)
export async function PATCH(req: NextRequest) {
  const unauth = await auth(req)
  if (unauth) return unauth

  try {
    const { id, published } = await req.json()
    await sql`
      UPDATE news SET
        published = ${!!published},
        published_at = CASE WHEN ${!!published} AND published_at IS NULL THEN NOW() ELSE published_at END,
        updated_at = NOW()
      WHERE id = ${id}
    `
    return NextResponse.json({ success: true })
  } catch (e: any) {
    return NextResponse.json({ success: false, error: e.message }, { status: 500 })
  }
}

// Delete
export async function DELETE(req: NextRequest) {
  const unauth = await auth(req)
  if (unauth) return unauth

  try {
    const { id } = await req.json()
    await sql`DELETE FROM news WHERE id = ${id}`
    return NextResponse.json({ success: true })
  } catch (e: any) {
    return NextResponse.json({ success: false, error: e.message }, { status: 500 })
  }
}
