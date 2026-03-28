import { sql } from '@/lib/db'
import NewsCard from '@/components/NewsCard'
import type { Metadata } from 'next'

interface Props {
  searchParams: Promise<{ q?: string }>
}

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const { q = '' } = await searchParams
  return { title: q ? `Busca: "${q}" — EsporteAção` : 'Busca — EsporteAção' }
}

export default async function SearchPage({ searchParams }: Props) {
  const { q = '' } = await searchParams
  const query = q.trim()

  const news = query.length >= 2
    ? await sql`
        SELECT n.*, c.name as cat_name, c.slug as cat_slug
        FROM news n
        LEFT JOIN categories c ON n.category_id = c.id
        WHERE n.published = true
          AND (n.title ILIKE ${`%${query}%`} OR n.summary ILIKE ${`%${query}%`} OR n.content ILIKE ${`%${query}%`})
        ORDER BY n.published_at DESC NULLS LAST
        LIMIT 24
      `
    : []

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <h1 className="text-2xl font-black text-[#1e3a5f] mb-2">
        {query ? `Resultados para "${query}"` : 'Buscar notícias'}
      </h1>
      {query && (
        <p className="text-gray-500 text-sm mb-6">{news.length} resultado(s) encontrado(s)</p>
      )}

      {query.length >= 2 && news.length === 0 && (
        <div className="text-center py-16 bg-white rounded-xl">
          <p className="text-gray-500">Nenhuma notícia encontrada para "{query}".</p>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {(news as any[]).map((item: any) => (
          <NewsCard key={item.id} {...item} category={item.cat_name ? { name: item.cat_name, slug: item.cat_slug } : undefined} />
        ))}
      </div>
    </div>
  )
}
