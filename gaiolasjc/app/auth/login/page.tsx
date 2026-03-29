'use client'
export const dynamic = 'force-dynamic'
import { useState, Suspense } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

function LoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')
    const res = await fetch('/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form)
    })
    const data = await res.json()
    if (data.success) {
      const redirect = searchParams.get('redirect') || (data.data.role === 'admin' ? '/admin' : '/dashboard')
      router.push(redirect)
    } else {
      setError(data.error || 'Email ou senha incorretos')
    }
    setLoading(false)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-1">E-mail</label>
        <input
          type="email"
          className="input-field"
          placeholder="seu@email.com"
          value={form.email}
          onChange={e => setForm({ ...form, email: e.target.value })}
          required
        />
      </div>
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-1">Senha</label>
        <input
          type="password"
          className="input-field"
          placeholder="Sua senha"
          value={form.password}
          onChange={e => setForm({ ...form, password: e.target.value })}
          required
        />
      </div>
      {error && <p className="text-red-600 text-sm font-semibold bg-red-50 p-3 rounded-lg">{error}</p>}
      <button
        type="submit"
        disabled={loading}
        className="btn-secondary disabled:opacity-50"
      >
        {loading ? 'Entrando...' : 'Entrar'}
      </button>
    </form>
  )
}

export default function LoginPage() {
  return (
    <>
      <Header />
      <main className="max-w-md mx-auto px-4 py-12">
        <div className="card p-6 md:p-8">
          <div className="text-center mb-8">
            <div className="bg-brand-blue rounded-xl w-14 h-14 flex items-center justify-center mx-auto mb-3">
              <div className="bg-brand-orange rounded-lg w-9 h-9 flex items-center justify-center font-black text-lg text-white">JC</div>
            </div>
            <h1 className="text-2xl font-black text-gray-800">Entrar</h1>
            <p className="text-gray-500 text-sm mt-1">Acesse sua conta GaiolasJC</p>
          </div>

          <Suspense fallback={<div className="text-center text-gray-400">Carregando...</div>}>
            <LoginForm />
          </Suspense>

          <p className="text-center text-sm text-gray-500 mt-6">
            Não tem conta?{' '}
            <Link href="/auth/register" className="text-brand-blue font-semibold hover:underline">
              Cadastre-se
            </Link>
          </p>
        </div>
      </main>
      <Footer />
    </>
  )
}
