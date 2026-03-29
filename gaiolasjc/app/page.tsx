import Link from 'next/link'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { sql } from '@/lib/db'

async function getFeaturedProducts() {
  try {
    const products = await sql`
      SELECT p.*, c.name as category_name
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      WHERE p.featured = true AND p.active = true
      LIMIT 6
    `
    return products
  } catch {
    return []
  }
}

export default async function HomePage() {
  const featured = await getFeaturedProducts()

  const categories = [
    { name: 'Codornas', icon: '🐦', href: '/catalogo?cat=codornas' },
    { name: 'Galinhas', icon: '🐓', href: '/catalogo?cat=galinhas' },
    { name: 'Coelhos', icon: '🐇', href: '/catalogo?cat=coelhos' },
    { name: 'Galos', icon: '🐔', href: '/catalogo?cat=galos' },
    { name: 'Aves Médio Porte', icon: '🦜', href: '/catalogo?cat=aves-medio-porte' },
  ]

  return (
    <>
      <Header />
      <main>
        {/* Hero */}
        <section className="bg-gradient-to-br from-brand-blue to-brand-blue-dark text-white">
          <div className="max-w-6xl mx-auto px-4 py-16 md:py-24">
            <div className="max-w-2xl">
              <h1 className="text-4xl md:text-5xl font-black leading-tight mb-4">
                Gaiolas de qualidade para seus animais
              </h1>
              <p className="text-xl text-white/80 mb-8">
                Codornas, galinhas, coelhos, galos e aves de médio porte. Fabricação própria em Belo Jardim - PE.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/catalogo" className="bg-brand-orange text-white font-bold px-8 py-4 rounded-xl text-lg text-center hover:bg-brand-orange-dark transition-colors">
                  Ver Catálogo
                </Link>
                <a href="https://wa.me/5581993539150" target="_blank" rel="noopener noreferrer" className="bg-green-500 text-white font-bold px-8 py-4 rounded-xl text-lg text-center hover:bg-green-600 transition-colors">
                  Falar no WhatsApp
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Categories */}
        <section className="max-w-6xl mx-auto px-4 py-12">
          <h2 className="text-2xl font-black text-gray-800 mb-6">Produtos por animal</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
            {categories.map(cat => (
              <Link key={cat.name} href={cat.href} className="card p-5 text-center hover:shadow-lg transition-shadow group">
                <div className="text-4xl mb-2">{cat.icon}</div>
                <p className="font-bold text-gray-700 text-sm group-hover:text-brand-blue">{cat.name}</p>
              </Link>
            ))}
          </div>
        </section>

        {/* Featured products */}
        {featured.length > 0 && (
          <section className="max-w-6xl mx-auto px-4 pb-12">
            <h2 className="text-2xl font-black text-gray-800 mb-6">Destaques</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {featured.map((p: any) => (
                <Link key={p.id} href={`/catalogo/${p.id}`} className="card hover:shadow-lg transition-shadow">
                  <div className="bg-gray-100 h-48 flex items-center justify-center">
                    {p.image_url ? (
                      <img src={p.image_url} alt={p.name} className="h-full w-full object-cover" />
                    ) : (
                      <span className="text-5xl">🏗️</span>
                    )}
                  </div>
                  <div className="p-4">
                    <p className="text-xs text-brand-blue font-semibold uppercase mb-1">{p.category_name}</p>
                    <h3 className="font-bold text-gray-800 mb-2">{p.name}</h3>
                    <p className="text-2xl font-black text-brand-orange">
                      R$ {Number(p.price).toFixed(2).replace('.', ',')}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* No products yet */}
        {featured.length === 0 && (
          <section className="max-w-6xl mx-auto px-4 pb-12">
            <div className="card p-10 text-center">
              <p className="text-5xl mb-4">🏗️</p>
              <h2 className="text-2xl font-bold text-gray-700 mb-2">Catálogo em breve</h2>
              <p className="text-gray-500 mb-6">Nossos produtos estão sendo cadastrados. Fale conosco pelo WhatsApp!</p>
              <a href="https://wa.me/5581993539150" target="_blank" rel="noopener noreferrer" className="inline-block bg-green-500 text-white font-bold px-8 py-3 rounded-xl hover:bg-green-600">
                Falar no WhatsApp
              </a>
            </div>
          </section>
        )}

        {/* Why us */}
        <section className="bg-brand-blue text-white py-12">
          <div className="max-w-6xl mx-auto px-4">
            <h2 className="text-2xl font-black mb-8 text-center">Por que escolher a GaiolasJC?</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { icon: '🏭', title: 'Fabricação Própria', desc: 'Produzimos tudo em Belo Jardim - PE com materiais de qualidade.' },
                { icon: '💪', title: 'Durabilidade', desc: 'Gaiolas resistentes, feitas para durar muitos anos.' },
                { icon: '🚚', title: 'Entrega para todo Brasil', desc: 'Enviamos para qualquer lugar do país.' },
              ].map(item => (
                <div key={item.title} className="text-center">
                  <div className="text-5xl mb-3">{item.icon}</div>
                  <h3 className="font-bold text-xl mb-2">{item.title}</h3>
                  <p className="text-white/70">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
