'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [user, setUser] = useState<{ name: string; role: string } | null>(null)
  const pathname = usePathname()

  useEffect(() => {
    fetch('/api/me')
      .then(r => r.json())
      .then(d => { if (d.success) setUser(d.data) })
      .catch(() => {})
  }, [])

  const navLinks = [
    { href: '/', label: 'Início' },
    { href: '/catalogo', label: 'Catálogo' },
    { href: '/contato', label: 'Contato' },
  ]

  return (
    <header className="bg-brand-blue text-white sticky top-0 z-40 shadow-lg">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="bg-brand-orange rounded-lg w-9 h-9 flex items-center justify-center font-black text-lg">JC</div>
            <span className="font-bold text-xl">GaiolasJC</span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-6">
            {navLinks.map(link => (
              <Link
                key={link.href}
                href={link.href}
                className={`hover:text-brand-orange transition-colors font-medium ${pathname === link.href ? 'text-brand-orange' : ''}`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Auth */}
          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <>
                {user.role === 'admin' && (
                  <Link href="/admin" className="text-sm hover:text-brand-orange">Admin</Link>
                )}
                <Link href="/dashboard" className="text-sm hover:text-brand-orange">Minha Conta</Link>
                <button
                  onClick={async () => {
                    await fetch('/api/logout', { method: 'POST' })
                    window.location.href = '/'
                  }}
                  className="text-sm bg-white/20 px-3 py-1 rounded hover:bg-white/30"
                >
                  Sair
                </button>
              </>
            ) : (
              <>
                <Link href="/auth/login" className="text-sm hover:text-brand-orange">Entrar</Link>
                <Link href="/auth/register" className="bg-brand-orange text-white text-sm font-bold px-4 py-2 rounded-lg hover:bg-brand-orange-dark">
                  Cadastrar
                </Link>
              </>
            )}
          </div>

          {/* Mobile hamburger */}
          <button className="md:hidden p-2" onClick={() => setMenuOpen(!menuOpen)} aria-label="Menu">
            <div className={`w-6 h-0.5 bg-white transition-all ${menuOpen ? 'rotate-45 translate-y-1.5' : ''}`} />
            <div className={`w-6 h-0.5 bg-white my-1 transition-all ${menuOpen ? 'opacity-0' : ''}`} />
            <div className={`w-6 h-0.5 bg-white transition-all ${menuOpen ? '-rotate-45 -translate-y-1.5' : ''}`} />
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden bg-brand-blue-dark px-4 py-4 flex flex-col gap-4">
          {navLinks.map(link => (
            <Link key={link.href} href={link.href} className="text-lg font-medium" onClick={() => setMenuOpen(false)}>
              {link.label}
            </Link>
          ))}
          <hr className="border-white/20" />
          {user ? (
            <>
              {user.role === 'admin' && <Link href="/admin" className="text-lg" onClick={() => setMenuOpen(false)}>Admin</Link>}
              <Link href="/dashboard" className="text-lg" onClick={() => setMenuOpen(false)}>Minha Conta</Link>
              <button onClick={async () => { await fetch('/api/logout', { method: 'POST' }); window.location.href = '/' }} className="text-left text-lg text-red-300">
                Sair
              </button>
            </>
          ) : (
            <>
              <Link href="/auth/login" className="text-lg" onClick={() => setMenuOpen(false)}>Entrar</Link>
              <Link href="/auth/register" className="bg-brand-orange text-white font-bold px-4 py-3 rounded-lg text-center text-lg" onClick={() => setMenuOpen(false)}>
                Cadastrar
              </Link>
            </>
          )}
        </div>
      )}
    </header>
  )
}
