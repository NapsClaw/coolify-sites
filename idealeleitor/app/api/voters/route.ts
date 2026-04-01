import { NextRequest, NextResponse } from 'next/server'
import { sql } from '@/lib/db'
import { getSession } from '@/lib/auth'

export async function GET(req: NextRequest) {
  const session = await getSession()
  if (!session) {
    return NextResponse.json({ success: false, error: 'Não autenticado' }, { status: 401 })
  }

  const { searchParams } = new URL(req.url)
  const coordinatorId = searchParams.get('coordinator_id')
  const search = searchParams.get('search') || ''
  const page = parseInt(searchParams.get('page') || '1')
  const limit = 20
  const offset = (page - 1) * limit

  try {
    let voters
    let countResult

    if (session.role === 'admin') {
      if (coordinatorId) {
        voters = await sql`
          SELECT v.*, u.name AS coordinator_name
          FROM idealeleitor.voters v
          JOIN idealeleitor.users u ON v.coordinator_id = u.id
          WHERE v.coordinator_id = ${coordinatorId}
          AND (v.full_name ILIKE ${'%' + search + '%'} OR v.cpf ILIKE ${'%' + search + '%'} OR v.phone ILIKE ${'%' + search + '%'})
          ORDER BY v.created_at DESC
          LIMIT ${limit} OFFSET ${offset}
        `
        countResult = await sql`
          SELECT COUNT(*) FROM idealeleitor.voters
          WHERE coordinator_id = ${coordinatorId}
          AND (full_name ILIKE ${'%' + search + '%'} OR cpf ILIKE ${'%' + search + '%'} OR phone ILIKE ${'%' + search + '%'})
        `
      } else {
        voters = await sql`
          SELECT v.*, u.name AS coordinator_name
          FROM idealeleitor.voters v
          JOIN idealeleitor.users u ON v.coordinator_id = u.id
          WHERE (v.full_name ILIKE ${'%' + search + '%'} OR v.cpf ILIKE ${'%' + search + '%'} OR v.phone ILIKE ${'%' + search + '%'})
          ORDER BY v.created_at DESC
          LIMIT ${limit} OFFSET ${offset}
        `
        countResult = await sql`
          SELECT COUNT(*) FROM idealeleitor.voters
          WHERE (full_name ILIKE ${'%' + search + '%'} OR cpf ILIKE ${'%' + search + '%'} OR phone ILIKE ${'%' + search + '%'})
        `
      }
    } else {
      voters = await sql`
        SELECT v.*, u.name AS coordinator_name
        FROM idealeleitor.voters v
        JOIN idealeleitor.users u ON v.coordinator_id = u.id
        WHERE v.coordinator_id = ${session.userId}
        AND (v.full_name ILIKE ${'%' + search + '%'} OR v.cpf ILIKE ${'%' + search + '%'} OR v.phone ILIKE ${'%' + search + '%'})
        ORDER BY v.created_at DESC
        LIMIT ${limit} OFFSET ${offset}
      `
      countResult = await sql`
        SELECT COUNT(*) FROM idealeleitor.voters
        WHERE coordinator_id = ${session.userId}
        AND (full_name ILIKE ${'%' + search + '%'} OR cpf ILIKE ${'%' + search + '%'} OR phone ILIKE ${'%' + search + '%'})
      `
    }

    return NextResponse.json({
      success: true,
      data: voters,
      total: parseInt(countResult[0].count),
      page,
      limit,
    })
  } catch (err) {
    console.error('GET voters error:', err)
    return NextResponse.json({ success: false, error: 'Erro ao buscar eleitores' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  const session = await getSession()
  if (!session) {
    return NextResponse.json({ success: false, error: 'Não autenticado' }, { status: 401 })
  }

  try {
    const body = await req.json()
    const {
      full_name, cpf, birth_date, phone,
      street, number, neighborhood, city, state, zip_code,
      zone, section, school, has_voted, notes,
    } = body

    if (!full_name) {
      return NextResponse.json({ success: false, error: 'Nome completo é obrigatório' }, { status: 400 })
    }

    const coordinatorId = session.role === 'admin' && body.coordinator_id
      ? body.coordinator_id
      : session.userId

    const result = await sql`
      INSERT INTO idealeleitor.voters (
        coordinator_id, full_name, cpf, birth_date, phone,
        street, number, neighborhood, city, state, zip_code,
        zone, section, school, has_voted, notes
      ) VALUES (
        ${coordinatorId}, ${full_name}, ${cpf || null}, ${birth_date || null}, ${phone || null},
        ${street || null}, ${number || null}, ${neighborhood || null}, ${city || null},
        ${state || null}, ${zip_code || null},
        ${zone || null}, ${section || null}, ${school || null},
        ${has_voted === true}, ${notes || null}
      )
      RETURNING *
    `

    return NextResponse.json({ success: true, data: result[0] }, { status: 201 })
  } catch (err) {
    console.error('POST voter error:', err)
    return NextResponse.json({ success: false, error: 'Erro ao cadastrar eleitor' }, { status: 500 })
  }
}
