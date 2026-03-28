import { sql } from '@/lib/db'
import NewsCard from '@/components/NewsCard'
import Link from 'next/link'

async function getNews() {
  try {
    const news = await sql`
      SELECT n.*, c.name as cat_name, c.slug as cat_slug, c.color as cat_color
      FROM news n
      LEFT JOIN categories c ON n.category_id = c.id
      WHERE n.published = true
      ORDER BY n.published_at DESC NULLS LAST, n.created_at DESC
      LIMIT 13
    `
    return news
  } catch {
    return []
  }
}

async function getCategories() {
  try {
    return await sql`SELECT * FROM categories ORDER BY name`
  } catch {
    return []
  }
}

export const revalidate = 60

export default async function Home() {
  const [news, categories] = await Promise.all([getNews(), getCategories()])

  const featured = news[0]
  const secondary = news.slice(1, 4)
  const rest = news.slice(4)

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">

      {/* Breaking / categoria badges */}
      <div className="flex flex-wrap gap-2 mb-6">
        {(categories as any[]).map((cat: any) => (
          <Link
            key={cat.id}
            href={`/categoria/${cat.slug}`}
            className="px-3 py-1 bg-[#1e3a5f] text-white text-xs font-bold rounded-full hover:bg-blue-600 transition-colors uppercase tracking-wide"
          >
            {cat.name}
          </Link>
        ))}
      </div>

      {/* Hero section */}
      {news.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-xl shadow-sm">
          <div className="text-5xl mb-4">🏟️</div>
          <h2 className="text-2xl font-black text-[#1e3a5f] mb-2">EsporteAção está no ar!</h2>
          <p className="text-gray-500">Em breve as primeiras notícias do esporte curitibano.</p>
        </div>
      ) : (
        <>
          {/* Featured + secondary grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-8">
            {featured && (
              <div className="lg:col-span-2">
                <NewsCard
                  id={featured.id}
                  title={featured.title}
                  slug={featured.slug}
                  summary={featured.summary}
                  cover_url={featured.cover_url}
                  created_at={featured.created_at}
                  published_at={featured.published_at}
                  category={featured.cat_name ? { name: featured.cat_name, slug: featured.cat_slug, color: featured.cat_color } : undefined}
                  size="lg"
                />
              </div>
            )}
            <div className="flex flex-col gap-4">
              {(secondary as any[]).map((item: any) => (
                <Link
                  key={item.id}
                  href={`/noticia/${item.slug}`}
                  className="group flex gap-3 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow p-3"
                >
                  <div className="w-20 h-20 flex-shrink-0 bg-gradient-to-br from-[#1e3a5f] to-[#243b53] rounded-lg overflow-hidden relative">
                    {item.cover_url && (
                      <img src={item.cover_url} alt={item.title} className="w-full h-full object-cover" />
                    )}
                    {!item.cover_url && (
                      <div className="w-full h-full flex items-center justify-center text-white/20 font-black text-2xl italic">EA</div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    {item.cat_name && (
                      <span className="text-blue-600 text-[10px] font-bold uppercase tracking-wide">{item.cat_name}</span>
                    )}
                    <h3 className="text-sm font-bold text-gray-900 line-clamp-3 group-hover:text-[#1e3a5f] leading-snug">
                      {item.title}
                    </h3>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Mais notícias */}
          {rest.length > 0 && (
            <>
              <h2 className="text-xl font-black text-[#1e3a5f] mb-4 flex items-center gap-2">
                <span className="w-1 h-6 bg-blue-500 rounded-full inline-block" />
                Mais Notícias
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {(rest as any[]).map((item: any) => (
                  <NewsCard
                    key={item.id}
                    {...item}
                    category={item.cat_name ? { name: item.cat_name, slug: item.cat_slug } : undefined}
                  />
                ))}
              </div>
            </>
          )}
        </>
      )}
    </div>
  )
}
