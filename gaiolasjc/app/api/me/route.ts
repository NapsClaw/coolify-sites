import { NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { sql } from '@/lib/db'

export async function GET() {
  const session = await getSession()
  if (!session) return NextResponse.json({ success: false, error: 'unauthorized' })

  const [user] = await sql`SELECT id, name, email, role, phone FROM users WHERE id = ${session.userId}`
  if (!user) return NextResponse.json({ success: false, error: 'unauthorized' })

  return NextResponse.json({ success: true, data: user })
}
