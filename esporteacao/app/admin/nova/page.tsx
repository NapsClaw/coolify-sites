import { getSession } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { sql } from '@/lib/db'
import Link from 'next/link'
import NewsForm from '@/components/NewsForm'

export default async function NovaNoticiaPage() {
  const session = await getSession()
  if (!session) redirect('/admin/login')

  const categories = await sql`SELECT * FROM categories ORDER BY name`

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-[#1e3a5f] text-white px-4 py-3 flex items-center gap-4">
        <Link href="/admin" className="text-blue-300 hover:text-white text-sm">← Voltar</Link>
        <h1 className="font-black text-lg italic uppercase">Nova Notícia</h1>
      </header>
      <div className="max-w-3xl mx-auto px-4 py-6">
        <div className="bg-white rounded-xl shadow-sm p-6">
          <NewsForm categories={categories as any[]} />
        </div>
      </div>
    </div>
  )
}
