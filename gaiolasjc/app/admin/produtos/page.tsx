'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

export default function AdminProdutosPage() {
  const [products, setProducts] = useState<any[]>([])
  const [categories, setCategories] = useState<any[]>([])
  const [form, setForm] = useState({ name: '', category_id: '', description: '', price: '', stock: '', image_url: '', featured: false })
  const [loading, setLoading] = useState(false)
  const [msg, setMsg] = useState('')

  async function fetchAll() {
    const [pr, cat] = await Promise.all([
      fetch('/api/products').then(r => r.json()),
      fetch('/api/categories').then(r => r.json())
    ])
    if (pr.success) setProducts(pr.data)
    if (cat.success) setCategories(cat.data)
  }

  useEffect(() => { fetchAll() }, [])

  async function addProduct(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    const res = await fetch('/api/products', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...form, price: parseFloat(form.price), stock: parseInt(form.stock) || 0 })
    })
    const data = await res.json()
    if (data.success) {
      setMsg('Produto adicionado!')
      setForm({ name: '', category_id: '', description: '', price: '', stock: '', image_url: '', featured: false })
      fetchAll()
    } else {
      setMsg(data.error || 'Erro')
    }
    setLoading(false)
    setTimeout(() => setMsg(''), 3000)
  }

  async function toggleActive(id: string, active: boolean) {
    await fetch(`/api/products/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ active: !active })
    })
    fetchAll()
  }

  return (
    <>
      <Header />
      <main className="max-w-5xl mx-auto px-4 py-8">
        <div className="flex items-center gap-4 mb-6">
          <Link href="/admin" className="text-brand-blue hover:underline text-sm">← Admin</Link>
          <h1 className="text-2xl font-black text-gray-800">Produtos</h1>
        </div>

        {/* Add product form */}
        <div className="card p-5 mb-8">
          <h2 className="font-bold text-gray-800 text-lg mb-4">Adicionar Produto</h2>
          <form onSubmit={addProduct} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-semibold text-gray-700 block mb-1">Nome*</label>
              <input className="input-field" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required />
            </div>
            <div>
              <label className="text-sm font-semibold text-gray-700 block mb-1">Categoria*</label>
              <select className="input-field" value={form.category_id} onChange={e => setForm({ ...form, category_id: e.target.value })} required>
                <option value="">Selecione...</option>
                {categories.map((c: any) => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
            <div>
              <label className="text-sm font-semibold text-gray-700 block mb-1">Preço (R$)*</label>
              <input type="number" step="0.01" className="input-field" value={form.price} onChange={e => setForm({ ...form, price: e.target.value })} required />
            </div>
            <div>
              <label className="text-sm font-semibold text-gray-700 block mb-1">Estoque</label>
              <input type="number" className="input-field" value={form.stock} onChange={e => setForm({ ...form, stock: e.target.value })} />
            </div>
            <div className="md:col-span-2">
              <label className="text-sm font-semibold text-gray-700 block mb-1">Descrição</label>
              <textarea className="input-field h-20 resize-none" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} />
            </div>
            <div>
              <label className="text-sm font-semibold text-gray-700 block mb-1">URL da imagem</label>
              <input type="url" className="input-field" value={form.image_url} onChange={e => setForm({ ...form, image_url: e.target.value })} />
            </div>
            <div className="flex items-center gap-2">
              <input type="checkbox" id="featured" checked={form.featured} onChange={e => setForm({ ...form, featured: e.target.checked })} className="w-4 h-4" />
              <label htmlFor="featured" className="text-sm font-semibold text-gray-700">Destaque na home</label>
            </div>
            {msg && <p className={`md:col-span-2 text-sm font-semibold ${msg.includes('Erro') ? 'text-red-600' : 'text-green-600'}`}>{msg}</p>}
            <div className="md:col-span-2">
              <button type="submit" disabled={loading} className="bg-brand-blue text-white font-bold px-6 py-3 rounded-lg hover:bg-brand-blue-dark disabled:opacity-50">
                {loading ? 'Salvando...' : 'Adicionar Produto'}
              </button>
            </div>
          </form>
        </div>

        {/* Products list */}
        <div className="space-y-2">
          {products.map((p: any) => (
            <div key={p.id} className={`card p-4 flex items-center gap-4 ${!p.active ? 'opacity-50' : ''}`}>
              <div className="bg-gray-100 rounded-lg w-12 h-12 flex items-center justify-center flex-shrink-0">
                {p.image_url ? <img src={p.image_url} alt={p.name} className="w-full h-full object-cover rounded-lg" /> : <span className="text-xl">🏗️</span>}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-bold text-gray-800">{p.name}</p>
                <p className="text-xs text-gray-500">{p.category_name} · Estoque: {p.stock}</p>
              </div>
              <div className="text-right flex-shrink-0">
                <p className="font-black text-brand-orange">R$ {Number(p.price).toFixed(2).replace('.', ',')}</p>
                <button onClick={() => toggleActive(p.id, p.active)} className={`text-xs mt-1 ${p.active ? 'text-red-500 hover:text-red-700' : 'text-green-600 hover:text-green-800'}`}>
                  {p.active ? 'Desativar' : 'Ativar'}
                </button>
              </div>
            </div>
          ))}
        </div>
      </main>
      <Footer />
    </>
  )
}
