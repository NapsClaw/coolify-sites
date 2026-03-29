'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'

interface Voter {
  id: string
  full_name: string
  cpf: string
  phone: string
  city: string
  neighborhood: string
  zone: string
  section: string
  created_at: string
}

interface Stats {
  total_voters: number
  today_voters: number
}

interface Session {
  name: string
  role: string
}

export default function DashboardPage() {
  const router = useRouter()
  const [session, setSession] = useState<Session | null>(null)
  const [voters, setVoters] = useState<Voter[]>([])
  const [stats, setStats] = useState<Stats>({ total_voters: 0, today_voters: 0 })
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)

  // Form state
  const [form, setForm] = useState({
    full_name: '', cpf: '', birth_date: '', phone: '',
    street: '', number: '', neighborhood: '', city: '',
    zone: '', section: '', notes: ''
  })
  const [submitting, setSubmitting] = useState(false)
  const [formError, setFormError] = useState('')
  const [formSuccess, setFormSuccess] = useState(false)

  useEffect(() => {
    fetch('/api/me').then(r => r.json()).then(d => {
      if (!d.success) { router.push('/auth/login'); return }
      if (d.data.role === 'admin') { router.push('/admin'); return }
      setSession(d.data)
    })
  }, [router])

  const loadVoters = useCallback(async () => {
    const res = await fetch(`/api/voters?search=${encodeURIComponent(search)}&page=${page}`)
    const data = await res.json()
    if (data.success) {
      setVoters(data.data)
      setTotal(data.total)
    }
    setLoading(false)
  }, [search, page])

  const loadStats = useCallback(async () => {
    const res = await fetch('/api/stats')
    const data = await res.json()
    if (data.success) setStats(data.data)
  }, [])

  useEffect(() => {
    if (session) {
      loadVoters()
      loadStats()
    }
  }, [session, loadVoters, loadStats])

  async function handleLogout() {
    await fetch('/api/logout', { method: 'POST' })
    router.push('/auth/login')
  }

  async function handleSubmitVoter(e: React.FormEvent) {
    e.preventDefault()
    setFormError('')
    setSubmitting(true)
    try {
      const res = await fetch('/api/voters', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const data = await res.json()
      if (!res.ok) { setFormError(data.error || 'Erro ao cadastrar'); return }
      setFormSuccess(true)
      setForm({ full_name: '', cpf: '', birth_date: '', phone: '', street: '', number: '', neighborhood: '', city: '', zone: '', section: '', notes: '' })
      loadVoters()
      loadStats()
      setTimeout(() => { setFormSuccess(false); setShowForm(false) }, 2000)
    } catch {
      setFormError('Erro de conexão')
    } finally {
      setSubmitting(false)
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Excluir este eleitor?')) return
    await fetch(`/api/voters/${id}`, { method: 'DELETE' })
    loadVoters()
    loadStats()
  }

  const totalPages = Math.ceil(total / 20)

  if (loading) {
    return (
      <div className="min-h-screen bg-blue-50 flex items-center justify-center">
        <div className="text-blue-700 font-semibold text-lg">Carregando...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-blue-50">
      {/* Header */}
      <header className="bg-blue-900 text-white px-4 py-4 flex items-center justify-between sticky top-0 z-50 shadow-lg">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-yellow-400 flex items-center justify-center text-blue-900 font-bold text-sm">
            JF
          </div>
          <div>
            <p className="font-bold leading-tight text-sm">Idealeleitor</p>
            <p className="text-blue-200 text-xs">{session?.name}</p>
          </div>
        </div>
        <button onClick={handleLogout} className="text-blue-200 text-sm hover:text-white">
          Sair
        </button>
      </header>

      <div className="max-w-2xl mx-auto px-4 py-6">
        {/* Stats */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="card text-center">
            <p className="text-3xl font-bold text-blue-800">{stats.total_voters}</p>
            <p className="text-sm text-gray-500 mt-1">Total de eleitores</p>
          </div>
          <div className="card text-center">
            <p className="text-3xl font-bold text-green-600">{stats.today_voters}</p>
            <p className="text-sm text-gray-500 mt-1">Cadastrados hoje</p>
          </div>
        </div>

        {/* Add voter button */}
        <button
          onClick={() => setShowForm(!showForm)}
          className="btn-secondary mb-6"
        >
          {showForm ? '✕ Cancelar' : '+ Cadastrar Eleitor'}
        </button>

        {/* Form */}
        {showForm && (
          <div className="card mb-6">
            <h2 className="font-bold text-blue-900 text-lg mb-4">Novo Eleitor</h2>

            {formSuccess && (
              <div className="bg-green-50 border border-green-200 text-green-700 rounded-lg px-4 py-3 mb-4 text-sm">
                ✓ Eleitor cadastrado com sucesso!
              </div>
            )}
            {formError && (
              <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-3 mb-4 text-sm">
                {formError}
              </div>
            )}

            <form onSubmit={handleSubmitVoter} className="flex flex-col gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nome completo *</label>
                <input className="input-field" value={form.full_name} onChange={e => setForm(f => ({ ...f, full_name: e.target.value }))} required />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">CPF</label>
                  <input className="input-field" value={form.cpf} onChange={e => setForm(f => ({ ...f, cpf: e.target.value }))} placeholder="000.000.000-00" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nascimento</label>
                  <input type="date" className="input-field" value={form.birth_date} onChange={e => setForm(f => ({ ...f, birth_date: e.target.value }))} />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">WhatsApp / Telefone</label>
                <input className="input-field" value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} placeholder="(00) 00000-0000" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Rua</label>
                <input className="input-field" value={form.street} onChange={e => setForm(f => ({ ...f, street: e.target.value }))} />
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nº</label>
                  <input className="input-field" value={form.number} onChange={e => setForm(f => ({ ...f, number: e.target.value }))} />
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Bairro</label>
                  <input className="input-field" value={form.neighborhood} onChange={e => setForm(f => ({ ...f, neighborhood: e.target.value }))} />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Cidade</label>
                <input className="input-field" value={form.city} onChange={e => setForm(f => ({ ...f, city: e.target.value }))} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Zona eleitoral</label>
                  <input className="input-field" value={form.zone} onChange={e => setForm(f => ({ ...f, zone: e.target.value }))} placeholder="Ex: 001" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Seção</label>
                  <input className="input-field" value={form.section} onChange={e => setForm(f => ({ ...f, section: e.target.value }))} placeholder="Ex: 0025" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Observações</label>
                <textarea className="input-field resize-none" rows={3} value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} />
              </div>
              <button type="submit" disabled={submitting} className="btn-primary disabled:opacity-60">
                {submitting ? 'Salvando...' : 'Salvar Eleitor'}
              </button>
            </form>
          </div>
        )}

        {/* Search */}
        <div className="mb-4">
          <input
            className="input-field"
            placeholder="Buscar por nome, CPF ou telefone..."
            value={search}
            onChange={e => { setSearch(e.target.value); setPage(1) }}
          />
        </div>

        {/* List */}
        <div className="space-y-3">
          {voters.length === 0 ? (
            <div className="card text-center text-gray-500">
              {search ? 'Nenhum eleitor encontrado.' : 'Nenhum eleitor cadastrado ainda.'}
            </div>
          ) : (
            voters.map((v) => (
              <div key={v.id} className="card flex items-start justify-between gap-4">
                <div className="min-w-0 flex-1">
                  <p className="font-semibold text-blue-900 truncate">{v.full_name}</p>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {v.phone && <span className="text-xs text-gray-500">{v.phone}</span>}
                    {v.city && <span className="text-xs text-gray-400">📍 {v.city}</span>}
                    {v.zone && <span className="text-xs text-gray-400">Z{v.zone} S{v.section}</span>}
                  </div>
                  <p className="text-xs text-gray-400 mt-1">
                    {new Date(v.created_at).toLocaleDateString('pt-BR')}
                  </p>
                </div>
                <button
                  onClick={() => handleDelete(v.id)}
                  className="text-red-400 hover:text-red-600 text-sm shrink-0 mt-1"
                >
                  Excluir
                </button>
              </div>
            ))
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-4 mt-6">
            <button
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
              className="px-4 py-2 rounded-lg bg-white border text-sm font-medium disabled:opacity-40"
            >
              ← Anterior
            </button>
            <span className="text-sm text-gray-600">{page} / {totalPages}</span>
            <button
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="px-4 py-2 rounded-lg bg-white border text-sm font-medium disabled:opacity-40"
            >
              Próxima →
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
