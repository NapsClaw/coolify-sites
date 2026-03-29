import { redirect } from 'next/navigation'
import Link from 'next/link'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { getSession } from '@/lib/auth'
import { sql } from '@/lib/db'

export default async function DashboardPage() {
  const session = await getSession()
  if (!session) redirect('/auth/login?redirect=/dashboard')

  const orders = await sql`
    SELECT o.*, COUNT(oi.id) as item_count
    FROM orders o
    LEFT JOIN order_items oi ON oi.order_id = o.id
    WHERE o.user_id = ${session.userId}
    GROUP BY o.id
    ORDER BY o.created_at DESC
    LIMIT 10
  `

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

  return (
    <>
      <Header />
      <main className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-black text-gray-800 mb-6">Minha Conta</h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="card p-5 text-center">
            <p className="text-3xl font-black text-brand-blue">{orders.length}</p>
            <p className="text-gray-500 text-sm mt-1">Pedidos</p>
          </div>
          <div className="card p-5 text-center">
            <p className="text-3xl font-black text-green-600">
              {orders.filter((o: any) => o.status === 'delivered').length}
            </p>
            <p className="text-gray-500 text-sm mt-1">Entregues</p>
          </div>
          <div className="card p-5 text-center">
            <p className="text-3xl font-black text-brand-orange">
              {orders.filter((o: any) => ['pending', 'confirmed', 'shipped'].includes(o.status)).length}
            </p>
            <p className="text-gray-500 text-sm mt-1">Em andamento</p>
          </div>
        </div>

        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-800">Meus Pedidos</h2>
          <Link href="/catalogo" className="text-brand-blue font-semibold text-sm hover:underline">Fazer novo pedido →</Link>
        </div>

        {orders.length > 0 ? (
          <div className="space-y-3">
            {orders.map((order: any) => (
              <Link key={order.id} href={`/dashboard/pedido/${order.id}`} className="card p-4 flex items-center justify-between hover:shadow-md transition-shadow">
                <div>
                  <p className="font-bold text-gray-800 text-sm">Pedido #{order.id.slice(0, 8).toUpperCase()}</p>
                  <p className="text-gray-500 text-xs mt-0.5">
                    {order.item_count} {Number(order.item_count) === 1 ? 'item' : 'itens'} •{' '}
                    {new Date(order.created_at).toLocaleDateString('pt-BR')}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-black text-brand-orange">R$ {Number(order.total).toFixed(2).replace('.', ',')}</p>
                  <span className={`text-xs px-2 py-1 rounded-full font-semibold mt-1 inline-block ${statusColor[order.status] || 'bg-gray-100 text-gray-600'}`}>
                    {statusLabel[order.status] || order.status}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="card p-8 text-center">
            <p className="text-4xl mb-3">🛒</p>
            <p className="text-gray-600 mb-4">Você ainda não fez nenhum pedido.</p>
            <Link href="/catalogo" className="btn-secondary inline-block w-auto px-8">Ver Catálogo</Link>
          </div>
        )}
      </main>
      <Footer />
    </>
  )
}
