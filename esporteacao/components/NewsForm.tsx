'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { makeSlug } from '@/lib/utils'

interface Props {
  news?: {
    id: string
    title: string
    slug: string
    summary: string
    content: string
    cover_url: string
    category_id: string
    author: string
    published: boolean
  }
  categories: { id: string; name: string; slug: string }[]
}

export default function NewsForm({ news, categories }: Props) {
  const router = useRouter()
  const isEdit = !!news

  const [form, setForm] = useState({
    title: news?.title || '',
    slug: news?.slug || '',
    summary: news?.summary || '',
    content: news?.content || '',
    cover_url: news?.cover_url || '',
    category_id: news?.category_id || '',
    author: news?.author || 'Redação EsporteAção',
    published: news?.published ?? false,
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  function handleTitleChange(title: string) {
    setForm(f => ({ ...f, title, slug: isEdit ? f.slug : makeSlug(title) }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!form.title.trim() || !form.content.trim()) {
      setError('Título e conteúdo são obrigatórios')
      return
    }
    setLoading(true)
    setError('')

    const res = await fetch('/api/admin/news', {
      method: isEdit ? 'PUT' : 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...form, ...(isEdit ? { id: news!.id } : {}) })
    })
    const data = await res.json()
    setLoading(false)

    if (data.success) {
      router.push('/admin')
      router.refresh()
    } else {
      setError(data.error || 'Erro ao salvar')
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {error && <p className="text-red-600 text-sm bg-red-50 p-3 rounded-lg">{error}</p>}

      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-1">Título *</label>
        <input
          value={form.title}
          onChange={e => handleTitleChange(e.target.value)}
          required
          className="w-full h-12 px-3 border border-gray-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Ex: Curitiba FC vence campeonato estadual"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Slug (URL)</label>
          <input
            value={form.slug}
            onChange={e => setForm(f => ({ ...f, slug: e.target.value }))}
            className="w-full h-11 px-3 border border-gray-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500 font-mono"
            placeholder="curitiba-fc-vence-estadual"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Categoria</label>
          <select
            value={form.category_id}
            onChange={e => setForm(f => ({ ...f, category_id: e.target.value }))}
            className="w-full h-11 px-3 border border-gray-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500 bg-white"
          >
            <option value="">Sem categoria</option>
            {categories.map(cat => (
              <option key={cat.id} value={cat.id}>{cat.name}</option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-1">Resumo</label>
        <textarea
          value={form.summary}
          onChange={e => setForm(f => ({ ...f, summary: e.target.value }))}
          rows={2}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500 resize-none"
          placeholder="Breve descrição da notícia (aparece nos cards e no lead)"
        />
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-1">Conteúdo *</label>
        <textarea
          value={form.content}
          onChange={e => setForm(f => ({ ...f, content: e.target.value }))}
          rows={12}
          required
          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500 resize-y font-mono"
          placeholder="Conteúdo completo da notícia..."
        />
        <p className="text-xs text-gray-400 mt-1">Você pode usar HTML básico: &lt;b&gt;, &lt;i&gt;, &lt;p&gt;, &lt;h2&gt;, &lt;ul&gt;, &lt;img&gt;</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">URL da imagem de capa</label>
          <input
            value={form.cover_url}
            onChange={e => setForm(f => ({ ...f, cover_url: e.target.value }))}
            type="url"
            className="w-full h-11 px-3 border border-gray-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="https://..."
          />
          {form.cover_url && (
            <img src={form.cover_url} alt="preview" className="mt-2 h-24 w-full object-cover rounded-lg" />
          )}
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Autor</label>
          <input
            value={form.author}
            onChange={e => setForm(f => ({ ...f, author: e.target.value }))}
            className="w-full h-11 px-3 border border-gray-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      <div className="flex items-center gap-3 bg-gray-50 p-3 rounded-lg">
        <input
          type="checkbox"
          id="published"
          checked={form.published}
          onChange={e => setForm(f => ({ ...f, published: e.target.checked }))}
          className="w-5 h-5 rounded accent-blue-600"
        />
        <label htmlFor="published" className="text-sm font-medium text-gray-700">
          Publicar agora
        </label>
        {!form.published && <span className="text-xs text-gray-400">(salva como rascunho)</span>}
      </div>

      <div className="flex gap-3 pt-2">
        <button
          type="submit"
          disabled={loading}
          className="flex-1 h-12 bg-[#1e3a5f] text-white font-bold rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {loading ? 'Salvando...' : isEdit ? 'Salvar alterações' : 'Criar notícia'}
        </button>
        <button
          type="button"
          onClick={() => router.push('/admin')}
          className="h-12 px-6 bg-gray-100 text-gray-700 font-semibold rounded-lg hover:bg-gray-200 transition-colors"
        >
          Cancelar
        </button>
      </div>
    </form>
  )
}
