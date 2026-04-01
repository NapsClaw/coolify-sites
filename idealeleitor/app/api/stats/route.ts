import { NextResponse } from 'next/server'
import { sql } from '@/lib/db'
import { getSession } from '@/lib/auth'

export async function GET() {
  const session = await getSession()
  if (!session) {
    return NextResponse.json({ success: false, error: 'Não autenticado' }, { status: 401 })
  }

  try {
    if (session.role === 'admin') {
      const [totalVoters, totalCoordinators, todayVoters, votedCount] = await Promise.all([
        sql`SELECT COUNT(*)::int AS count FROM idealeleitor.voters`,
        sql`SELECT COUNT(*)::int AS count FROM idealeleitor.users WHERE role = 'coordinator' AND is_active = true`,
        sql`SELECT COUNT(*)::int AS count FROM idealeleitor.voters WHERE created_at >= CURRENT_DATE`,
        sql`SELECT COUNT(*)::int AS count FROM idealeleitor.voters WHERE has_voted = true`,
      ])
      return NextResponse.json({
        success: true,
        data: {
          total_voters: totalVoters[0].count,
          total_coordinators: totalCoordinators[0].count,
          today_voters: todayVoters[0].count,
          voted_count: votedCount[0].count,
        },
      })
    } else {
      const [myVoters, todayVoters, votedCount] = await Promise.all([
        sql`SELECT COUNT(*)::int AS count FROM idealeleitor.voters WHERE coordinator_id = ${session.userId}`,
        sql`SELECT COUNT(*)::int AS count FROM idealeleitor.voters WHERE coordinator_id = ${session.userId} AND created_at >= CURRENT_DATE`,
        sql`SELECT COUNT(*)::int AS count FROM idealeleitor.voters WHERE coordinator_id = ${session.userId} AND has_voted = true`,
      ])
      return NextResponse.json({
        success: true,
        data: {
          total_voters: myVoters[0].count,
          today_voters: todayVoters[0].count,
          voted_count: votedCount[0].count,
        },
      })
    }
  } catch (err) {
    console.error('Stats error:', err)
    return NextResponse.json({ success: false, error: 'Erro ao buscar estatísticas' }, { status: 500 })
  }
}
