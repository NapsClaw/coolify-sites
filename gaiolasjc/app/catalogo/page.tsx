import Link from 'next/link'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { sql } from '@/lib/db'

async function getProducts(cat?: string) {
  try {
    if (cat) {
      return await sql`
        SELECT p.*, c.name as category_name, c.slug as category_slug
        FROM products p
        LEFT JOIN categories c ON p.category_id = c.id
        WHERE p.active = true AND c.slug = ${cat}
        ORDER BY p.featured DESC, p.created_at DESC
      `
    }
    return await sql`
      SELECT p.*, c.name as category_name, c.slug as category_slug
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      WHERE p.active = true
      ORDER BY p.featured DESC, p.created_at DESC
    `
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

export default async function CatalogoPage({ searchParams }: { searchParams: Promise<{ cat?: string }> }) {
  const params = await searchParams
  const [products, categories] = await Promise.all([
    getProducts(params.cat),
    getCategories()
  ])

  return (
    <>
      <Header />
      <main className="max-w-6xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-black text-gray-800 mb-6">Catálogo de Gaiolas</h1>

        {/* Category filter */}
        <div className="flex gap-3 flex-wrap mb-8">
          <Link
            href="/catalogo"
            className={`px-4 py-2 rounded-full font-semibold text-sm transition-colors ${
              !params.cat ? 'bg-brand-blue text-white' : 'bg-white border border-gray-300 text-gray-700 hover:border-brand-blue'
            }`}
          >
            Todos
          </Link>
          {categories.map((c: any) => (
            <Link
              key={c.id}
              href={`/catalogo?cat=${c.slug}`}
              className={`px-4 py-2 rounded-full font-semibold text-sm transition-colors ${
                params.cat === c.slug ? 'bg-brand-blue text-white' : 'bg-white border border-gray-300 text-gray-700 hover:border-brand-blue'
              }`}
            >
              {c.name}
            </Link>
          ))}
        </div>

        {/* Products grid */}
        {products.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {products.map((p: any) => (
              <Link key={p.id} href={`/catalogo/${p.id}`} className="card hover:shadow-lg transition-shadow">
                <div className="bg-gray-100 h-48 flex items-center justify-center overflow-hidden">
                  {p.image_url ? (
                    <img src={p.image_url} alt={p.name} className="h-full w-full object-cover" />
                  ) : (
                    <span className="text-5xl">🏗️</span>
                  )}
                </div>
                <div className="p-4">
                  <p className="text-xs text-brand-blue font-semibold uppercase mb-1">{p.category_name}</p>
                  <h3 className="font-bold text-gray-800 mb-2">{p.name}</h3>
                  {p.description && (
                    <p className="text-gray-500 text-sm mb-3 line-clamp-2">{p.description}</p>
                  )}
                  <div className="flex items-center justify-between">
                    <p className="text-2xl font-black text-brand-orange">
                      R$ {Number(p.price).toFixed(2).replace('.', ',')}
                    </p>
                    <span className={`text-xs px-2 py-1 rounded-full font-semibold ${p.stock > 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                      {p.stock > 0 ? 'Em estoque' : 'Indisponível'}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 card">
            <p className="text-5xl mb-4">🔍</p>
            <h2 className="text-xl font-bold text-gray-700 mb-2">Nenhum produto encontrado</h2>
            <p className="text-gray-500">Tente outra categoria ou fale conosco!</p>
          </div>
        )}
      </main>
      <Footer />
    </>
  )
}
