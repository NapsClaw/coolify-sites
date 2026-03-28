import { sql } from '@/lib/db'
import { notFound } from 'next/navigation'
import NewsCard from '@/components/NewsCard'
import Link from 'next/link'
import type { Metadata } from 'next'

interface Props {
  params: Promise<{ slug: string }>
  searchParams: Promise<{ page?: string }>
}

const PAGE_SIZE = 12

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const cats = await sql`SELECT * FROM categories WHERE slug = ${slug} LIMIT 1`
  const cat = cats[0]
  if (!cat) return { title: 'Categoria não encontrada' }
  return { title: `${cat.name} — EsporteAção` }
}

export default async function CategoryPage({ params, searchParams }: Props) {
  const { slug } = await params
  const { page = '1' } = await searchParams
  const pageNum = Math.max(1, parseInt(page))
  const offset = (pageNum - 1) * PAGE_SIZE

  const cats = await sql`SELECT * FROM categories WHERE slug = ${slug} LIMIT 1`
  const category = cats[0]
  if (!category) notFound()

  const news = await sql`
    SELECT n.*, c.name as cat_name, c.slug as cat_slug
    FROM news n
    LEFT JOIN categories c ON n.category_id = c.id
    WHERE n.category_id = ${category.id} AND n.published = true
    ORDER BY n.published_at DESC NULLS LAST, n.created_at DESC
    LIMIT ${PAGE_SIZE} OFFSET ${offset}
  `

  const countRows = await sql`
    SELECT COUNT(*) as total FROM news WHERE category_id = ${category.id} AND published = true
  `
  const total = parseInt(String(countRows[0]?.total ?? 0))
  const totalPages = Math.ceil(total / PAGE_SIZE)

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <div className="flex items-center gap-3 mb-6">
        <span className="w-1 h-8 bg-blue-500 rounded-full inline-block" />
        <h1 className="text-2xl font-black text-[#1e3a5f] uppercase tracking-wide">{category.name}</h1>
        <span className="text-gray-400 text-sm">({total} notícias)</span>
      </div>

      {news.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-xl">
          <p className="text-gray-500">Nenhuma notícia publicada nesta categoria ainda.</p>
          <Link href="/" className="text-blue-600 font-semibold mt-2 inline-block hover:underline">← Voltar ao início</Link>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {(news as any[]).map((item: any) => (
              <NewsCard
                key={item.id}
                {...item}
                category={{ name: item.cat_name, slug: item.cat_slug }}
              />
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center gap-2 mt-8">
              {pageNum > 1 && (
                <Link href={`?page=${pageNum - 1}`} className="px-4 py-2 bg-white border rounded-lg text-sm font-medium hover:bg-gray-50">← Anterior</Link>
              )}
              <span className="px-4 py-2 text-sm text-gray-500">Página {pageNum} de {totalPages}</span>
              {pageNum < totalPages && (
                <Link href={`?page=${pageNum + 1}`} className="px-4 py-2 bg-[#1e3a5f] text-white rounded-lg text-sm font-medium hover:bg-blue-700">Próxima →</Link>
              )}
            </div>
          )}
        </>
      )}
    </div>
  )
}
