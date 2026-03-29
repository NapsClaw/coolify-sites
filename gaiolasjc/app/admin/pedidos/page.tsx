import { redirect } from 'next/navigation'
import Link from 'next/link'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { getSession } from '@/lib/auth'
import { sql } from '@/lib/db'

export default async function AdminPedidosPage() {
  const session = await getSession()
  if (!session || session.role !== 'admin') redirect('/auth/login')

  const orders = await sql`
    SELECT o.*, u.name as user_name, u.email as user_email, u.phone as user_phone,
           COUNT(oi.id) as item_count
    FROM orders o
    JOIN users u ON u.id = o.user_id
    LEFT JOIN order_items oi ON oi.order_id = o.id
    WHERE o.status != 'cart'
    GROUP BY o.id, u.name, u.email, u.phone
    ORDER BY o.created_at DESC
  `

  const statusLabel: Record<string, string> = {
    pending: 'Aguardando',
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
      <main className="max-w-5xl mx-auto px-4 py-8">
        <div className="flex items-center gap-4 mb-6">
          <Link href="/admin" className="text-brand-blue hover:underline text-sm">← Admin</Link>
          <h1 className="text-2xl font-black text-gray-800">Pedidos</h1>
        </div>

        {orders.length > 0 ? (
          <div className="space-y-2">
            {orders.map((o: any) => (
              <Link key={o.id} href={`/admin/pedidos/${o.id}`} className="card p-4 flex items-center justify-between hover:shadow-md transition-shadow">
                <div>
                  <p className="font-bold text-gray-800">#{o.id.slice(0, 8).toUpperCase()} — {o.user_name}</p>
                  <p className="text-gray-500 text-sm">{o.user_email} · {o.item_count} {Number(o.item_count) === 1 ? 'item' : 'itens'}</p>
                  <p className="text-gray-400 text-xs">{new Date(o.created_at).toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' })}</p>
                </div>
                <div className="text-right">
                  <p className="font-black text-brand-orange text-lg">R$ {Number(o.total).toFixed(2).replace('.', ',')}</p>
                  <span className={`text-xs px-2 py-1 rounded-full font-semibold inline-block mt-1 ${statusColor[o.status] || 'bg-gray-100 text-gray-600'}`}>
                    {statusLabel[o.status] || o.status}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="card p-10 text-center">
            <p className="text-4xl mb-3">📋</p>
            <p className="text-gray-500">Nenhum pedido ainda.</p>
          </div>
        )}
      </main>
      <Footer />
    </>
  )
}
