'use client'
import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

const statusOptions = [
  { value: 'pending', label: 'Aguardando confirmação' },
  { value: 'confirmed', label: 'Confirmado' },
  { value: 'shipped', label: 'Enviado' },
  { value: 'delivered', label: 'Entregue' },
  { value: 'cancelled', label: 'Cancelado' },
]

export default function AdminOrderDetailPage() {
  const { id } = useParams()
  const router = useRouter()
  const [data, setData] = useState<any>(null)
  const [status, setStatus] = useState('')
  const [saving, setSaving] = useState(false)
  const [msg, setMsg] = useState('')

  useEffect(() => {
    fetch(`/api/orders/${id}`)
      .then(r => r.json())
      .then(d => {
        if (d.success) {
          setData(d.data)
          setStatus(d.data.order.status)
        }
      })
  }, [id])

  async function updateStatus() {
    setSaving(true)
    const res = await fetch(`/api/orders/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status })
    })
    const d = await res.json()
    if (d.success) {
      setMsg('Status atualizado!')
      setData((prev: any) => ({ ...prev, order: { ...prev.order, status } }))
    }
    setSaving(false)
    setTimeout(() => setMsg(''), 2000)
  }

  if (!data) return (
    <>
      <Header />
      <main className="max-w-2xl mx-auto px-4 py-12 text-center text-gray-400">Carregando...</main>
      <Footer />
    </>
  )

  const { order, items } = data

  return (
    <>
      <Header />
      <main className="max-w-2xl mx-auto px-4 py-8">
        <div className="flex items-center gap-4 mb-6">
          <Link href="/admin/pedidos" className="text-brand-blue hover:underline text-sm">← Pedidos</Link>
          <h1 className="text-xl font-black text-gray-800">Pedido #{order.id.slice(0, 8).toUpperCase()}</h1>
        </div>

        <div className="card p-5 mb-4">
          <h2 className="font-bold text-gray-700 mb-2">Cliente</h2>
          <p className="font-semibold text-gray-800">{order.user_name}</p>
          <p className="text-sm text-gray-500">{order.user_email}</p>
          {order.user_phone && (
            <a href={`https://wa.me/55${order.user_phone.replace(/\D/g, '')}`} target="_blank" rel="noopener noreferrer" className="text-sm text-green-600 hover:underline">
              WhatsApp: {order.user_phone}
            </a>
          )}
        </div>

        {order.shipping_address && (
          <div className="card p-5 mb-4">
            <h2 className="font-bold text-gray-700 mb-2">Endereço de Entrega</h2>
            <p className="text-gray-700">{order.shipping_address}</p>
          </div>
        )}

        <div className="card p-5 mb-4">
          <h2 className="font-bold text-gray-700 mb-3">Itens do Pedido</h2>
          {items.map((item: any) => (
            <div key={item.id} className="flex gap-3 items-center mb-3">
              <div className="bg-gray-100 rounded w-10 h-10 flex items-center justify-center flex-shrink-0">
                {item.image_url ? <img src={item.image_url} alt={item.name} className="w-full h-full object-cover rounded" /> : '🏗️'}
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold">{item.name}</p>
                <p className="text-xs text-gray-500">Qtd: {item.quantity}</p>
              </div>
              <p className="font-bold">R$ {(item.quantity * item.unit_price).toFixed(2).replace('.', ',')}</p>
            </div>
          ))}
          <div className="border-t pt-3 flex justify-between mt-2">
            <span className="font-bold text-gray-700">Total</span>
            <span className="font-black text-xl text-brand-orange">R$ {Number(order.total).toFixed(2).replace('.', ',')}</span>
          </div>
        </div>

        <div className="card p-5">
          <h2 className="font-bold text-gray-700 mb-3">Status do Pedido</h2>
          <select className="input-field mb-3" value={status} onChange={e => setStatus(e.target.value)}>
            {statusOptions.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
          </select>
          {msg && <p className="text-green-600 text-sm font-semibold mb-2">{msg}</p>}
          <button onClick={updateStatus} disabled={saving} className="bg-brand-blue text-white font-bold px-6 py-3 rounded-lg hover:bg-brand-blue-dark disabled:opacity-50 w-full">
            {saving ? 'Salvando...' : 'Atualizar Status'}
          </button>
        </div>
      </main>
      <Footer />
    </>
  )
}
