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
  coordinator_name: string
  has_voted: boolean
  created_at: string
}

interface Coordinator {
  id: string
  name: string
  email: string
  is_active: boolean
  voter_count: number
  created_at: string
}

interface Stats {
  total_voters: number
  total_coordinators: number
  today_voters: number
}

type Tab = 'overview' | 'voters' | 'coordinators'

export default function AdminPage() {
  const router = useRouter()
  const [tab, setTab] = useState<Tab>('overview')
  const [stats, setStats] = useState<Stats>({ total_voters: 0, total_coordinators: 0, today_voters: 0 })
  const [voters, setVoters] = useState<Voter[]>([])
  const [coordinators, setCoordinators] = useState<Coordinator[]>([])
  const [selectedCoordinator, setSelectedCoordinator] = useState('')
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)
  const [sessionName, setSessionName] = useState('')

  // New coordinator form
  const [showNewCoord, setShowNewCoord] = useState(false)
  const [newCoord, setNewCoord] = useState({ name: '', email: '', password: '' })
  const [coordError, setCoordError] = useState('')
  const [coordSuccess, setCoordSuccess] = useState(false)
  const [coordLoading, setCoordLoading] = useState(false)

  useEffect(() => {
    fetch('/api/me').then(r => r.json()).then(d => {
      if (!d.success || d.data.role !== 'admin') { router.push('/auth/login'); return }
      setSessionName(d.data.name)
      setLoading(false)
    })
  }, [router])

  const loadStats = useCallback(async () => {
    const res = await fetch('/api/stats')
    const data = await res.json()
    if (data.success) setStats(data.data)
  }, [])

  const loadVoters = useCallback(async () => {
    const params = new URLSearchParams({ search, page: String(page) })
    if (selectedCoordinator) params.set('coordinator_id', selectedCoordinator)
    const res = await fetch(`/api/voters?${params}`)
    const data = await res.json()
    if (data.success) { setVoters(data.data); setTotal(data.total) }
  }, [search, page, selectedCoordinator])

  const loadCoordinators = useCallback(async () => {
    const res = await fetch('/api/coordinators')
    const data = await res.json()
    if (data.success) setCoordinators(data.data)
  }, [])

  useEffect(() => {
    if (!loading) {
      loadStats()
      loadCoordinators()
    }
  }, [loading, loadStats, loadCoordinators])

  useEffect(() => {
    if (tab === 'voters' && !loading) loadVoters()
  }, [tab, loading, loadVoters])

  async function handleLogout() {
    await fetch('/api/logout', { method: 'POST' })
    router.push('/auth/login')
  }

  async function handleDeleteVoter(id: string) {
    if (!confirm('Excluir este eleitor?')) return
    await fetch(`/api/voters/${id}`, { method: 'DELETE' })
    loadVoters()
    loadStats()
  }

  async function handleToggleVoted(id: string, current: boolean) {
    await fetch(`/api/voters/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ has_voted: !current }),
    })
    loadVoters()
  }

  async function handleToggleCoordinator(id: string, active: boolean) {
    await fetch(`/api/coordinators/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ is_active: !active })
    })
    loadCoordinators()
  }

  async function handleDeleteCoordinator(id: string) {
    if (!confirm('Excluir coordenador e todos os eleitores cadastrados por ele?')) return
    await fetch(`/api/coordinators/${id}`, { method: 'DELETE' })
    loadCoordinators()
    loadStats()
  }

  async function handleCreateCoordinator(e: React.FormEvent) {
    e.preventDefault()
    setCoordError('')
    setCoordLoading(true)
    try {
      const res = await fetch('/api/coordinators', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newCoord)
      })
      const data = await res.json()
      if (!res.ok) { setCoordError(data.error || 'Erro'); return }
      setCoordSuccess(true)
      setNewCoord({ name: '', email: '', password: '' })
      loadCoordinators()
      setTimeout(() => { setCoordSuccess(false); setShowNewCoord(false) }, 2000)
    } catch {
      setCoordError('Erro de conexão')
    } finally {
      setCoordLoading(false)
    }
  }

  const totalPages = Math.ceil(total / 20)

  if (loading) {
    return (
      <div className="min-h-screen bg-blue-50 flex items-center justify-center">
        <div className="text-blue-700 font-semibold">Carregando...</div>
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
            <p className="font-bold text-sm leading-tight">Painel Admin</p>
            <p className="text-blue-200 text-xs">{sessionName}</p>
          </div>
        </div>
        <button onClick={handleLogout} className="text-blue-200 text-sm hover:text-white">Sair</button>
      </header>

      {/* Tabs */}
      <div className="bg-white border-b sticky top-[57px] z-40">
        <div className="max-w-3xl mx-auto flex">
          {(['overview', 'voters', 'coordinators'] as Tab[]).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`flex-1 py-3 text-sm font-medium border-b-2 transition-colors ${tab === t ? 'border-blue-700 text-blue-700' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
            >
              {t === 'overview' ? '📊 Resumo' : t === 'voters' ? '👥 Eleitores' : '🤝 Coordenadores'}
            </button>
          ))}
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-6">

        {/* OVERVIEW TAB */}
        {tab === 'overview' && (
          <div className="space-y-4">
            <div className="grid grid-cols-3 gap-3">
              <div className="card text-center">
                <p className="text-3xl font-bold text-blue-800">{stats.total_voters}</p>
                <p className="text-xs text-gray-500 mt-1">Total eleitores</p>
              </div>
              <div className="card text-center">
                <p className="text-3xl font-bold text-yellow-600">{stats.total_coordinators}</p>
                <p className="text-xs text-gray-500 mt-1">Coordenadores</p>
              </div>
              <div className="card text-center">
                <p className="text-3xl font-bold text-green-600">{stats.today_voters}</p>
                <p className="text-xs text-gray-500 mt-1">Hoje</p>
              </div>
            </div>

            <div className="card">
              <h2 className="font-bold text-blue-900 mb-4">Ranking de coordenadores</h2>
              {coordinators.length === 0 ? (
                <p className="text-gray-500 text-sm">Nenhum coordenador cadastrado.</p>
              ) : (
                <div className="space-y-3">
                  {[...coordinators].sort((a, b) => b.voter_count - a.voter_count).map((c, i) => (
                    <div key={c.id} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-700 text-xs font-bold flex items-center justify-center">
                          {i + 1}
                        </span>
                        <div>
                          <p className="font-medium text-sm text-gray-900">{c.name}</p>
                          <p className="text-xs text-gray-400">{c.email}</p>
                        </div>
                      </div>
                      <span className="font-bold text-blue-700">{c.voter_count}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* VOTERS TAB */}
        {tab === 'voters' && (
          <div>
            <div className="flex flex-col gap-3 mb-4">
              <input
                className="input-field"
                placeholder="Buscar por nome, CPF ou telefone..."
                value={search}
                onChange={e => { setSearch(e.target.value); setPage(1) }}
              />
              <select
                className="input-field"
                value={selectedCoordinator}
                onChange={e => { setSelectedCoordinator(e.target.value); setPage(1) }}
              >
                <option value="">Todos os coordenadores</option>
                {coordinators.map(c => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>

            <p className="text-sm text-gray-500 mb-3">{total} eleitor(es) encontrado(s)</p>

            <div className="space-y-3">
              {voters.length === 0 ? (
                <div className="card text-center text-gray-500">Nenhum eleitor encontrado.</div>
              ) : (
                voters.map(v => (
                  <div key={v.id} className="card">
                    <div className="flex items-start justify-between gap-2 mb-3">
                      <div className="min-w-0 flex-1">
                        <p className="font-semibold text-blue-900 truncate">{v.full_name}</p>
                        <div className="flex flex-wrap gap-2 mt-1">
                          {v.phone && <span className="text-xs text-gray-500">{v.phone}</span>}
                          {v.city && <span className="text-xs text-gray-400">📍 {v.city}{v.neighborhood ? `, ${v.neighborhood}` : ''}</span>}
                        </div>
                        <div className="flex flex-wrap gap-2 mt-1">
                          {v.zone && <span className="text-xs bg-blue-50 text-blue-600 px-2 py-0.5 rounded">Z{v.zone} S{v.section}</span>}
                          <span className="text-xs text-gray-400">por {v.coordinator_name}</span>
                        </div>
                        <p className="text-xs text-gray-400 mt-1">
                          {new Date(v.created_at).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                      <button onClick={() => handleDeleteVoter(v.id)} className="text-red-400 hover:text-red-600 text-sm shrink-0">
                        Excluir
                      </button>
                    </div>
                    <button
                      onClick={() => handleToggleVoted(v.id, v.has_voted)}
                      className={`w-full py-2 rounded-lg text-sm font-bold transition-colors ${
                        v.has_voted
                          ? 'bg-green-500 hover:bg-green-600 text-white'
                          : 'bg-red-500 hover:bg-red-600 text-white'
                      }`}
                    >
                      {v.has_voted ? 'Já votou' : 'Não votou'}
                    </button>
                  </div>
                ))
              )}
            </div>

            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-4 mt-6">
                <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="px-4 py-2 rounded-lg bg-white border text-sm font-medium disabled:opacity-40">← Anterior</button>
                <span className="text-sm text-gray-600">{page} / {totalPages}</span>
                <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages} className="px-4 py-2 rounded-lg bg-white border text-sm font-medium disabled:opacity-40">Próxima →</button>
              </div>
            )}
          </div>
        )}

        {/* COORDINATORS TAB */}
        {tab === 'coordinators' && (
          <div>
            <button onClick={() => setShowNewCoord(!showNewCoord)} className="btn-secondary mb-4">
              {showNewCoord ? '✕ Cancelar' : '+ Novo Coordenador'}
            </button>

            {showNewCoord && (
              <div className="card mb-4">
                <h3 className="font-bold text-blue-900 mb-4">Novo Coordenador</h3>
                {coordSuccess && <div className="bg-green-50 border border-green-200 text-green-700 rounded-lg px-4 py-2 mb-3 text-sm">✓ Coordenador criado!</div>}
                {coordError && <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-2 mb-3 text-sm">{coordError}</div>}
                <form onSubmit={handleCreateCoordinator} className="flex flex-col gap-3">
                  <input className="input-field" placeholder="Nome completo" value={newCoord.name} onChange={e => setNewCoord(f => ({ ...f, name: e.target.value }))} required />
                  <input type="email" className="input-field" placeholder="E-mail" value={newCoord.email} onChange={e => setNewCoord(f => ({ ...f, email: e.target.value }))} required />
                  <input type="password" className="input-field" placeholder="Senha" value={newCoord.password} onChange={e => setNewCoord(f => ({ ...f, password: e.target.value }))} required minLength={6} />
                  <button type="submit" disabled={coordLoading} className="btn-primary disabled:opacity-60">{coordLoading ? 'Criando...' : 'Criar Coordenador'}</button>
                </form>
              </div>
            )}

            <div className="space-y-3">
              {coordinators.length === 0 ? (
                <div className="card text-center text-gray-500">Nenhum coordenador cadastrado.</div>
              ) : (
                coordinators.map(c => (
                  <div key={c.id} className="card">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <p className="font-semibold text-gray-900">{c.name}</p>
                          <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${c.is_active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'}`}>
                            {c.is_active ? 'Ativo' : 'Inativo'}
                          </span>
                        </div>
                        <p className="text-sm text-gray-500">{c.email}</p>
                        <p className="text-xs text-blue-600 font-semibold mt-1">{c.voter_count} eleitor(es)</p>
                      </div>
                      <div className="flex flex-col gap-2 shrink-0">
                        <button
                          onClick={() => handleToggleCoordinator(c.id, c.is_active)}
                          className={`text-xs px-3 py-1.5 rounded-lg font-medium ${c.is_active ? 'bg-gray-100 text-gray-600 hover:bg-gray-200' : 'bg-green-100 text-green-700 hover:bg-green-200'}`}
                        >
                          {c.is_active ? 'Desativar' : 'Ativar'}
                        </button>
                        <button onClick={() => handleDeleteCoordinator(c.id)} className="text-xs px-3 py-1.5 rounded-lg bg-red-50 text-red-500 hover:bg-red-100">
                          Excluir
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
