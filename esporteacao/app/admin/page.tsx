import { getSession } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { sql } from '@/lib/db'
import Link from 'next/link'
import AdminNewsTable from '@/components/AdminNewsTable'

export default async function AdminPage() {
  const session = await getSession()
  if (!session) redirect('/admin/login')

  const news = await sql`
    SELECT n.*, c.name as cat_name
    FROM news n
    LEFT JOIN categories c ON n.category_id = c.id
    ORDER BY n.created_at DESC
    LIMIT 50
  `

  const categories = await sql`SELECT * FROM categories ORDER BY name`

  const stats = await sql`
    SELECT
      COUNT(*) FILTER (WHERE published = true) as published,
      COUNT(*) FILTER (WHERE published = false) as drafts,
      SUM(views) as total_views
    FROM news
  `

  const s = stats[0] || {}

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Admin header */}
      <header className="bg-[#1e3a5f] text-white px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-white rounded flex items-center justify-center">
            <span className="text-[#1e3a5f] font-black text-lg italic">E</span>
          </div>
          <div>
            <div className="font-black italic uppercase text-sm">EsporteAção</div>
            <div className="text-blue-300 text-xs">Painel Administrativo</div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-blue-200 text-sm hidden sm:block">Olá, {session.name}</span>
          <Link
            href="/"
            target="_blank"
            className="text-xs bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded transition-colors"
          >
            Ver site
          </Link>
          <Link
            href="/api/admin/logout"
            className="text-xs bg-red-500 hover:bg-red-600 px-3 py-1.5 rounded transition-colors"
          >
            Sair
          </Link>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 py-6">
        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="bg-white rounded-xl p-4 shadow-sm text-center">
            <div className="text-2xl font-black text-green-600">{String(s.published ?? 0)}</div>
            <div className="text-xs text-gray-500 mt-1">Publicadas</div>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm text-center">
            <div className="text-2xl font-black text-yellow-500">{String(s.drafts ?? 0)}</div>
            <div className="text-xs text-gray-500 mt-1">Rascunhos</div>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm text-center">
            <div className="text-2xl font-black text-blue-600">{Number(s.total_views ?? 0).toLocaleString('pt-BR')}</div>
            <div className="text-xs text-gray-500 mt-1">Visualizações</div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-black text-[#1e3a5f] text-xl">Notícias</h2>
          <Link
            href="/admin/nova"
            className="bg-[#1e3a5f] text-white font-bold px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm"
          >
            + Nova Notícia
          </Link>
        </div>

        <AdminNewsTable news={news as any[]} categories={categories as any[]} />
      </div>
    </div>
  )
}
