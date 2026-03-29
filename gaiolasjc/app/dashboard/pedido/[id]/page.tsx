'use client'
import { useEffect, useState } from 'react'
import { useParams, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

const statusLabel: Record<string, string> = {
  pending: 'Aguardando confirmação',
  confirmed: 'Confirmado',
  shipped: 'Enviado',
  delivered: 'Entregue',
  cancelled: 'Cancelado',
}

const statusColor: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-700',
  confirmed: 'bg-blue-100 text-blue-700',
  shipped: 'bg-purple-100 text-purple-700',
  delivered: 'bg-green-100 text-green-700',
  cancelled: 'bg-red-100 text-red-700',
}

export default function OrderDetailPage() {
  const { id } = useParams()
  const searchParams = useSearchParams()
  const success = searchParams.get('success')
  const [data, setData] = useState<any>(null)

  useEffect(() => {
    fetch(`/api/orders/${id}`)
      .then(r => r.json())
      .then(d => { if (d.success) setData(d.data) })
  }, [id])

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
        <Link href="/dashboard" className="text-brand-blue hover:underline text-sm mb-4 inline-block">← Meus pedidos</Link>

        {success && (
          <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-6 text-center">
            <p className="text-2xl mb-1">✅</p>
            <p className="font-bold text-green-700">Pedido realizado com sucesso!</p>
            <p className="text-green-600 text-sm">Entraremos em contato pelo WhatsApp para confirmar.</p>
          </div>
        )}

        <div className="card p-5 mb-4">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h1 className="font-black text-gray-800">Pedido #{order.id.slice(0, 8).toUpperCase()}</h1>
              <p className="text-gray-500 text-sm">{new Date(order.created_at).toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' })}</p>
            </div>
            <span className={`text-sm px-3 py-1 rounded-full font-semibold ${statusColor[order.status] || 'bg-gray-100 text-gray-600'}`}>
              {statusLabel[order.status] || order.status}
            </span>
          </div>

          {order.shipping_address && (
            <div className="bg-gray-50 rounded-lg p-3 mb-4">
              <p className="text-xs font-semibold text-gray-500 uppercase mb-1">Endereço de entrega</p>
              <p className="text-sm text-gray-700">{order.shipping_address}</p>
            </div>
          )}

          <div className="space-y-3">
            {items.map((item: any) => (
              <div key={item.id} className="flex gap-3 items-center">
                <div className="bg-gray-100 rounded-lg w-12 h-12 flex items-center justify-center flex-shrink-0">
                  {item.image_url
                    ? <img src={item.image_url} alt={item.name} className="w-full h-full object-cover rounded-lg" />
                    : <span className="text-xl">🏗️</span>}
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-gray-800 text-sm">{item.name}</p>
                  <p className="text-gray-500 text-xs">Qtd: {item.quantity} × R$ {Number(item.unit_price).toFixed(2).replace('.', ',')}</p>
                </div>
                <p className="font-bold text-gray-800 text-sm">R$ {(item.quantity * item.unit_price).toFixed(2).replace('.', ',')}</p>
              </div>
            ))}
          </div>

          <div className="border-t mt-4 pt-4 flex justify-between">
            <span className="font-bold text-gray-700">Total</span>
            <span className="font-black text-xl text-brand-orange">R$ {Number(order.total).toFixed(2).replace('.', ',')}</span>
          </div>
        </div>

        <a href="https://wa.me/5581993539150" target="_blank" rel="noopener noreferrer" className="bg-green-500 text-white font-bold py-3 px-6 rounded-xl text-lg text-center block hover:bg-green-600 transition-colors">
          Falar no WhatsApp sobre este pedido
        </a>
      </main>
      <Footer />
    </>
  )
}
