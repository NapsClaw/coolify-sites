import { redirect } from 'next/navigation'
import Link from 'next/link'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { getSession } from '@/lib/auth'
import { sql } from '@/lib/db'

export default async function AdminPage() {
  const session = await getSession()
  if (!session || session.role !== 'admin') redirect('/auth/login')

  const [{ count: totalOrders }] = await sql`SELECT COUNT(*) as count FROM orders WHERE status != 'cart'`
  const [{ count: pendingOrders }] = await sql`SELECT COUNT(*) as count FROM orders WHERE status = 'pending'`
  const [{ count: totalProducts }] = await sql`SELECT COUNT(*) as count FROM products WHERE active = true`
  const [{ count: totalUsers }] = await sql`SELECT COUNT(*) as count FROM users WHERE role = 'customer'`

  const recentOrders = await sql`
    SELECT o.*, u.name as user_name FROM orders o
    JOIN users u ON u.id = o.user_id
    WHERE o.status != 'cart'
    ORDER BY o.created_at DESC LIMIT 5
  `

  const statusLabel: Record<string, string> = {
    pending: 'Aguardando',
    confirmed: 'Confirmado',
    shipped: 'Enviado',
    delivered: 'Entregue',
    cancelled: 'Cancelado',
  }

  return (
    <>
      <Header />
      <main className="max-w-6xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-black text-gray-800 mb-6">Painel Admin</h1>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Pedidos', value: totalOrders, color: 'text-brand-blue' },
            { label: 'Aguardando', value: pendingOrders, color: 'text-yellow-600' },
            { label: 'Produtos', value: totalProducts, color: 'text-green-600' },
            { label: 'Clientes', value: totalUsers, color: 'text-brand-orange' },
          ].map(s => (
            <div key={s.label} className="card p-4 text-center">
              <p className={`text-3xl font-black ${s.color}`}>{s.value}</p>
              <p className="text-gray-500 text-sm mt-1">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Quick links */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <Link href="/admin/produtos" className="card p-5 hover:shadow-lg transition-shadow flex items-center gap-4">
            <span className="text-4xl">📦</span>
            <div>
              <h2 className="font-black text-gray-800 text-lg">Gerenciar Produtos</h2>
              <p className="text-gray-500 text-sm">Adicionar, editar e remover produtos do catálogo</p>
            </div>
          </Link>
          <Link href="/admin/pedidos" className="card p-5 hover:shadow-lg transition-shadow flex items-center gap-4">
            <span className="text-4xl">📋</span>
            <div>
              <h2 className="font-black text-gray-800 text-lg">Gerenciar Pedidos</h2>
              <p className="text-gray-500 text-sm">Ver e atualizar status dos pedidos</p>
            </div>
          </Link>
        </div>

        {/* Recent orders */}
        <h2 className="text-xl font-bold text-gray-800 mb-4">Pedidos Recentes</h2>
        {recentOrders.length > 0 ? (
          <div className="space-y-2">
            {recentOrders.map((o: any) => (
              <Link key={o.id} href={`/admin/pedidos/${o.id}`} className="card p-4 flex items-center justify-between hover:shadow-md transition-shadow">
                <div>
                  <p className="font-bold text-gray-800 text-sm">#{o.id.slice(0, 8).toUpperCase()} — {o.user_name}</p>
                  <p className="text-gray-400 text-xs">{new Date(o.created_at).toLocaleDateString('pt-BR')}</p>
                </div>
                <div className="text-right">
                  <p className="font-black text-brand-orange">R$ {Number(o.total).toFixed(2).replace('.', ',')}</p>
                  <p className="text-xs text-gray-500">{statusLabel[o.status] || o.status}</p>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-center py-8">Nenhum pedido ainda.</p>
        )}
      </main>
      <Footer />
    </>
  )
}
