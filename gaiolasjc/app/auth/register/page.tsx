'use client'
import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

export default function RegisterPage() {
  const router = useRouter()
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '', confirm: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (form.password !== form.confirm) {
      setError('As senhas não conferem')
      return
    }
    setLoading(true)
    setError('')
    const res = await fetch('/api/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: form.name, email: form.email, phone: form.phone, password: form.password })
    })
    const data = await res.json()
    if (data.success) {
      router.push('/dashboard')
    } else {
      setError(data.error || 'Erro ao criar conta')
    }
    setLoading(false)
  }

  return (
    <>
      <Header />
      <main className="max-w-md mx-auto px-4 py-12">
        <div className="card p-6 md:p-8">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-black text-gray-800">Criar Conta</h1>
            <p className="text-gray-500 text-sm mt-1">Cadastre-se para comprar na GaiolasJC</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Nome completo</label>
              <input type="text" className="input-field" placeholder="Seu nome" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">E-mail</label>
              <input type="email" className="input-field" placeholder="seu@email.com" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} required />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">WhatsApp (opcional)</label>
              <input type="tel" className="input-field" placeholder="(81) 99999-9999" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Senha</label>
              <input type="password" className="input-field" placeholder="Mínimo 6 caracteres" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} required minLength={6} />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Confirmar senha</label>
              <input type="password" className="input-field" placeholder="Repita a senha" value={form.confirm} onChange={e => setForm({ ...form, confirm: e.target.value })} required />
            </div>
            {error && <p className="text-red-600 text-sm font-semibold bg-red-50 p-3 rounded-lg">{error}</p>}
            <button type="submit" disabled={loading} className="btn-secondary disabled:opacity-50">
              {loading ? 'Criando conta...' : 'Criar Conta'}
            </button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-6">
            Já tem conta?{' '}
            <Link href="/auth/login" className="text-brand-blue font-semibold hover:underline">Entrar</Link>
          </p>
        </div>
      </main>
      <Footer />
    </>
  )
}
