'use client'
export const dynamic = 'force-dynamic'
import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

export default function ProductPage() {
  const { id } = useParams()
  const [product, setProduct] = useState<any>(null)
  const [qty, setQty] = useState(1)
  const [loading, setLoading] = useState(true)
  const [adding, setAdding] = useState(false)
  const [msg, setMsg] = useState('')

  useEffect(() => {
    fetch(`/api/products/${id}`)
      .then(r => r.json())
      .then(d => { if (d.success) setProduct(d.data) })
      .finally(() => setLoading(false))
  }, [id])

  async function addToCart() {
    setAdding(true)
    const res = await fetch('/api/cart', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ productId: id, quantity: qty })
    })
    const data = await res.json()
    if (data.success) {
      setMsg('Produto adicionado ao carrinho!')
    } else if (data.error === 'unauthorized') {
      window.location.href = '/auth/login?redirect=/catalogo/' + id
    } else {
      setMsg(data.error || 'Erro ao adicionar')
    }
    setAdding(false)
    setTimeout(() => setMsg(''), 3000)
  }

  if (loading) return (
    <>
      <Header />
      <main className="max-w-4xl mx-auto px-4 py-12 text-center">
        <div className="animate-pulse text-gray-400">Carregando...</div>
      </main>
      <Footer />
    </>
  )

  if (!product) return (
    <>
      <Header />
      <main className="max-w-4xl mx-auto px-4 py-12 text-center">
        <p className="text-5xl mb-4">😕</p>
        <h1 className="text-2xl font-bold text-gray-700 mb-4">Produto não encontrado</h1>
        <Link href="/catalogo" className="text-brand-blue hover:underline">← Voltar ao catálogo</Link>
      </main>
      <Footer />
    </>
  )

  return (
    <>
      <Header />
      <main className="max-w-4xl mx-auto px-4 py-8">
        <Link href="/catalogo" className="text-brand-blue hover:underline text-sm mb-6 inline-block">← Voltar ao catálogo</Link>

        <div className="card overflow-hidden">
          <div className="md:flex">
            <div className="md:w-1/2 bg-gray-100 h-64 md:h-auto flex items-center justify-center">
              {product.image_url ? (
                <img src={product.image_url} alt={product.name} className="w-full h-full object-cover" />
              ) : (
                <span className="text-7xl">🏗️</span>
              )}
            </div>
            <div className="md:w-1/2 p-6 flex flex-col">
              <p className="text-xs text-brand-blue font-semibold uppercase mb-2">{product.category_name}</p>
              <h1 className="text-2xl font-black text-gray-800 mb-3">{product.name}</h1>
              {product.description && (
                <p className="text-gray-600 mb-4 leading-relaxed">{product.description}</p>
              )}
              <p className="text-3xl font-black text-brand-orange mb-4">
                R$ {Number(product.price).toFixed(2).replace('.', ',')}
              </p>
              <div className="flex items-center gap-3 mb-4">
                <span className="text-sm font-medium text-gray-700">Quantidade:</span>
                <div className="flex items-center border rounded-lg overflow-hidden">
                  <button onClick={() => setQty(Math.max(1, qty - 1))} className="px-3 py-2 bg-gray-100 hover:bg-gray-200 font-bold">−</button>
                  <span className="px-4 py-2 font-bold">{qty}</span>
                  <button onClick={() => setQty(qty + 1)} className="px-3 py-2 bg-gray-100 hover:bg-gray-200 font-bold">+</button>
                </div>
              </div>
              {msg && <p className={`text-sm mb-3 font-semibold ${msg.includes('Erro') ? 'text-red-600' : 'text-green-600'}`}>{msg}</p>}
              <button
                onClick={addToCart}
                disabled={adding || product.stock === 0}
                className="bg-brand-orange text-white font-bold py-3 px-6 rounded-xl text-lg hover:bg-brand-orange-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {adding ? 'Adicionando...' : product.stock > 0 ? 'Adicionar ao Carrinho' : 'Indisponível'}
              </button>
              <span className={`text-xs mt-2 font-semibold ${product.stock > 0 ? 'text-green-600' : 'text-red-500'}`}>
                {product.stock > 0 ? `${product.stock} unidades disponíveis` : 'Sem estoque'}
              </span>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
