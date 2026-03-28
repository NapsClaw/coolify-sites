import { sql } from '@/lib/db'
import { notFound } from 'next/navigation'
import { formatDate } from '@/lib/utils'
import Link from 'next/link'
import Image from 'next/image'
import type { Metadata } from 'next'

interface Props {
  params: Promise<{ slug: string }>
}

async function getNews(slug: string) {
  const rows = await sql`
    SELECT n.*, c.name as cat_name, c.slug as cat_slug
    FROM news n
    LEFT JOIN categories c ON n.category_id = c.id
    WHERE n.slug = ${slug} AND n.published = true
    LIMIT 1
  `
  return rows[0] || null
}

async function getRelated(categoryId: string | null, currentId: string) {
  if (!categoryId) return []
  return await sql`
    SELECT id, title, slug, cover_url, published_at, created_at
    FROM news
    WHERE category_id = ${categoryId} AND id != ${currentId} AND published = true
    ORDER BY published_at DESC NULLS LAST
    LIMIT 3
  `
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const news = await getNews(slug)
  if (!news) return { title: 'Notícia não encontrada' }
  return {
    title: `${news.title} — EsporteAção`,
    description: news.summary || news.title,
    openGraph: {
      title: news.title,
      description: news.summary || '',
      images: news.cover_url ? [news.cover_url] : [],
    }
  }
}

// Increment views
async function incrementViews(id: string) {
  await sql`UPDATE news SET views = views + 1 WHERE id = ${id}`
}

export default async function NewsPage({ params }: Props) {
  const { slug } = await params
  const news = await getNews(slug)
  if (!news) notFound()

  // fire and forget
  incrementViews(news.id).catch(() => {})

  const related = await getRelated(news.category_id, news.id)
  const date = news.published_at || news.created_at

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-gray-500 mb-4 flex-wrap">
        <Link href="/" className="hover:text-[#1e3a5f]">Início</Link>
        {news.cat_name && (
          <>
            <span>/</span>
            <Link href={`/categoria/${news.cat_slug}`} className="hover:text-[#1e3a5f]">{news.cat_name}</Link>
          </>
        )}
        <span>/</span>
        <span className="text-gray-400 line-clamp-1 max-w-xs">{news.title}</span>
      </div>

      <article>
        {/* Category badge */}
        {news.cat_name && (
          <Link href={`/categoria/${news.cat_slug}`}>
            <span className="inline-block bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-full mb-3 uppercase tracking-wide hover:bg-blue-700 transition-colors">
              {news.cat_name}
            </span>
          </Link>
        )}

        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-[#1e3a5f] leading-tight mb-4">
          {news.title}
        </h1>

        {news.summary && (
          <p className="text-lg text-gray-600 border-l-4 border-blue-500 pl-4 mb-4 italic">{news.summary}</p>
        )}

        <div className="flex items-center gap-3 text-sm text-gray-500 mb-6 flex-wrap">
          <span className="font-medium text-gray-700">{news.author}</span>
          <span>·</span>
          <span>{formatDate(date)}</span>
          <span>·</span>
          <span>{news.views} visualizações</span>
        </div>

        {news.cover_url && (
          <div className="relative w-full h-64 sm:h-96 rounded-xl overflow-hidden mb-6">
            <Image
              src={news.cover_url}
              alt={news.title}
              fill
              className="object-cover"
              priority
            />
          </div>
        )}

        <div
          className="prose max-w-none text-gray-800 leading-relaxed"
          dangerouslySetInnerHTML={{ __html: news.content.replace(/\n/g, '<br/>') }}
        />
      </article>

      {/* Related */}
      {related.length > 0 && (
        <div className="mt-12 border-t border-gray-200 pt-8">
          <h2 className="text-xl font-black text-[#1e3a5f] mb-4 flex items-center gap-2">
            <span className="w-1 h-6 bg-blue-500 rounded-full inline-block" />
            Mais em {news.cat_name}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {(related as any[]).map((item: any) => (
              <Link key={item.id} href={`/noticia/${item.slug}`} className="group flex gap-3 bg-white rounded-lg p-3 shadow-sm hover:shadow-md transition-shadow">
                <div className="w-16 h-16 flex-shrink-0 rounded-lg overflow-hidden bg-[#1e3a5f] relative">
                  {item.cover_url && <img src={item.cover_url} alt={item.title} className="w-full h-full object-cover" />}
                </div>
                <h3 className="text-sm font-bold text-gray-900 line-clamp-3 group-hover:text-blue-600">{item.title}</h3>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
