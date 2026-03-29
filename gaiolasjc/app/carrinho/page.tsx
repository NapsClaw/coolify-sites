'use client'
export const dynamic = 'force-dynamic'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

export default function CarrinhoPage() {
  const router = useRouter()
  const [cart, setCart] = useState<any>(null)
  const [items, setItems] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [checkingOut, setCheckingOut] = useState(false)
  const [address, setAddress] = useState('')

  async function fetchCart() {
    const res = await fetch('/api/cart')
    const data = await res.json()
    if (data.success) {
      setCart(data.data.cart)
      setItems(data.data.items)
    } else {
      router.push('/auth/login?redirect=/carrinho')
    }
    setLoading(false)
  }

  useEffect(() => { fetchCart() }, [])

  async function removeItem(itemId: string) {
    await fetch('/api/cart', { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ itemId }) })
    fetchCart()
  }

  async function checkout() {
    if (!address.trim()) { alert('Informe o endereço de entrega'); return }
    setCheckingOut(true)
    const res = await fetch('/api/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ shipping_address: address })
    })
    const data = await res.json()
    if (data.success) {
      router.push(`/dashboard/pedido/${data.data.id}?success=1`)
    } else {
      alert(data.error || 'Erro ao finalizar pedido')
    }
    setCheckingOut(false)
  }

  if (loading) return (
    <>
      <Header />
      <main className="max-w-2xl mx-auto px-4 py-12 text-center text-gray-400">Carregando carrinho...</main>
      <Footer />
    </>
  )

  return (
    <>
      <Header />
      <main className="max-w-2xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-black text-gray-800 mb-6">🛒 Carrinho</h1>

        {items.length === 0 ? (
          <div className="card p-8 text-center">
            <p className="text-4xl mb-3">🛒</p>
            <p className="text-gray-600 mb-4">Seu carrinho está vazio.</p>
            <Link href="/catalogo" className="btn-secondary inline-block w-auto px-8">Ver Catálogo</Link>
          </div>
        ) : (
          <>
            <div className="space-y-3 mb-6">
              {items.map((item: any) => (
                <div key={item.id} className="card p-4 flex gap-4 items-center">
                  <div className="bg-gray-100 rounded-lg w-16 h-16 flex items-center justify-center flex-shrink-0">
                    {item.image_url
                      ? <img src={item.image_url} alt={item.name} className="w-full h-full object-cover rounded-lg" />
                      : <span className="text-2xl">🏗️</span>}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-gray-800 truncate">{item.name}</p>
                    <p className="text-sm text-gray-500">Qtd: {item.quantity} × R$ {Number(item.unit_price).toFixed(2).replace('.', ',')}</p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="font-black text-brand-orange">R$ {(item.quantity * item.unit_price).toFixed(2).replace('.', ',')}</p>
                    <button onClick={() => removeItem(item.id)} className="text-xs text-red-500 hover:text-red-700 mt-1">Remover</button>
                  </div>
                </div>
              ))}
            </div>

            <div className="card p-5 mb-4">
              <div className="flex justify-between items-center mb-4">
                <span className="font-bold text-gray-700 text-lg">Total</span>
                <span className="font-black text-2xl text-brand-orange">R$ {Number(cart?.total).toFixed(2).replace('.', ',')}</span>
              </div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Endereço de entrega</label>
              <textarea
                className="input-field h-20 resize-none"
                placeholder="Rua, número, bairro, cidade, estado, CEP"
                value={address}
                onChange={e => setAddress(e.target.value)}
              />
              <button onClick={checkout} disabled={checkingOut} className="btn-primary mt-4 disabled:opacity-50">
                {checkingOut ? 'Finalizando...' : 'Finalizar Pedido'}
              </button>
              <p className="text-xs text-gray-500 text-center mt-2">Pagamento combinado pelo WhatsApp após confirmação do pedido</p>
            </div>
          </>
        )}
      </main>
      <Footer />
    </>
  )
}
