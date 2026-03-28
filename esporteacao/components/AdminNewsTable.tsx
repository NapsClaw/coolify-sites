'use client'
import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { formatDateShort } from '@/lib/utils'

interface NewsItem {
  id: string
  title: string
  slug: string
  published: boolean
  views: number
  cat_name?: string
  created_at: string
  published_at?: string
}

export default function AdminNewsTable({ news, categories }: { news: NewsItem[]; categories: any[] }) {
  const router = useRouter()
  const [deleting, setDeleting] = useState<string | null>(null)

  async function togglePublish(id: string, current: boolean) {
    await fetch('/api/admin/news', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, published: !current })
    })
    router.refresh()
  }

  async function deleteNews(id: string, title: string) {
    if (!confirm(`Deletar "${title}"? Esta ação não pode ser desfeita.`)) return
    setDeleting(id)
    await fetch('/api/admin/news', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id })
    })
    setDeleting(null)
    router.refresh()
  }

  if (news.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm p-8 text-center">
        <div className="text-4xl mb-3">📰</div>
        <p className="text-gray-500 mb-4">Nenhuma notícia ainda.</p>
        <Link href="/admin/nova" className="bg-[#1e3a5f] text-white font-bold px-4 py-2 rounded-lg text-sm hover:bg-blue-700">
          + Criar primeira notícia
        </Link>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
      {/* Mobile: card list */}
      <div className="divide-y divide-gray-100 md:hidden">
        {news.map(item => (
          <div key={item.id} className="p-4">
            <div className="flex items-start justify-between gap-2 mb-2">
              <h3 className="font-semibold text-sm text-gray-900 flex-1">{item.title}</h3>
              <span className={`flex-shrink-0 text-xs px-2 py-0.5 rounded-full font-medium ${item.published ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                {item.published ? 'Pub.' : 'Rascunho'}
              </span>
            </div>
            <div className="flex items-center gap-3 text-xs text-gray-500 mb-3">
              {item.cat_name && <span className="bg-blue-50 text-blue-600 px-2 py-0.5 rounded">{item.cat_name}</span>}
              <span>{item.views} views</span>
              <span>{formatDateShort(item.created_at)}</span>
            </div>
            <div className="flex gap-2">
              <Link href={`/admin/editar/${item.id}`} className="text-xs bg-gray-100 hover:bg-gray-200 px-3 py-1.5 rounded font-medium transition-colors">Editar</Link>
              <button onClick={() => togglePublish(item.id, item.published)} className={`text-xs px-3 py-1.5 rounded font-medium transition-colors ${item.published ? 'bg-yellow-100 hover:bg-yellow-200 text-yellow-700' : 'bg-green-100 hover:bg-green-200 text-green-700'}`}>
                {item.published ? 'Despublicar' : 'Publicar'}
              </button>
              <button onClick={() => deleteNews(item.id, item.title)} disabled={deleting === item.id} className="text-xs bg-red-50 hover:bg-red-100 text-red-600 px-3 py-1.5 rounded font-medium transition-colors disabled:opacity-50">
                {deleting === item.id ? '...' : 'Deletar'}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Desktop: table */}
      <table className="w-full hidden md:table">
        <thead className="bg-gray-50 border-b border-gray-200">
          <tr>
            <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Título</th>
            <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Categoria</th>
            <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Status</th>
            <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Views</th>
            <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Data</th>
            <th className="text-right px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Ações</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {news.map(item => (
            <tr key={item.id} className="hover:bg-gray-50 transition-colors">
              <td className="px-4 py-3">
                <span className="font-medium text-sm text-gray-900 line-clamp-1 max-w-xs block">{item.title}</span>
              </td>
              <td className="px-4 py-3">
                {item.cat_name && (
                  <span className="text-xs bg-blue-50 text-blue-600 px-2 py-0.5 rounded">{item.cat_name}</span>
                )}
              </td>
              <td className="px-4 py-3">
                <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${item.published ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                  {item.published ? 'Publicada' : 'Rascunho'}
                </span>
              </td>
              <td className="px-4 py-3 text-sm text-gray-500">{item.views}</td>
              <td className="px-4 py-3 text-sm text-gray-500">{formatDateShort(item.created_at)}</td>
              <td className="px-4 py-3">
                <div className="flex items-center justify-end gap-2">
                  <Link href={`/admin/editar/${item.id}`} className="text-xs bg-gray-100 hover:bg-gray-200 px-3 py-1.5 rounded font-medium transition-colors">Editar</Link>
                  <button onClick={() => togglePublish(item.id, item.published)} className={`text-xs px-3 py-1.5 rounded font-medium transition-colors ${item.published ? 'bg-yellow-100 hover:bg-yellow-200 text-yellow-700' : 'bg-green-100 hover:bg-green-200 text-green-700'}`}>
                    {item.published ? 'Despublicar' : 'Publicar'}
                  </button>
                  <button onClick={() => deleteNews(item.id, item.title)} disabled={deleting === item.id} className="text-xs bg-red-50 hover:bg-red-100 text-red-600 px-3 py-1.5 rounded font-medium transition-colors disabled:opacity-50">
                    {deleting === item.id ? '...' : 'Deletar'}
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
