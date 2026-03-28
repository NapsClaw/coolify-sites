'use client'
import { useState } from 'react'
import Link from 'next/link'

const CATS = ['Futebol', 'Atletismo', 'Basquete', 'Vôlei', 'Outros']

export default function Header() {
  const [open, setOpen] = useState(false)

  return (
    <header className="bg-[#1e3a5f] text-white shadow-lg sticky top-0 z-50">
      {/* Top bar */}
      <div className="bg-[#0a1929] px-4 py-1 text-xs text-blue-200 text-center hidden md:block">
        Portal de Notícias Esportivas de Curitiba
      </div>

      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 flex-shrink-0">
          <div className="w-10 h-10 bg-white rounded flex items-center justify-center">
            <span className="text-[#1e3a5f] font-black text-xl italic">E</span>
          </div>
          <div className="leading-tight">
            <div className="font-black text-lg uppercase italic tracking-tight">EsporteAção</div>
            <div className="text-blue-300 text-[10px] uppercase tracking-widest hidden sm:block">Curitiba</div>
          </div>
        </Link>

        {/* Search desktop */}
        <form action="/busca" className="flex-1 max-w-sm hidden md:flex">
          <input
            name="q"
            type="search"
            placeholder="Buscar notícias..."
            className="w-full px-3 py-2 rounded-l text-gray-900 text-sm outline-none"
          />
          <button className="bg-blue-500 hover:bg-blue-600 px-3 rounded-r text-sm font-semibold">
            🔍
          </button>
        </form>

        {/* Hamburger */}
        <button
          onClick={() => setOpen(!open)}
          className="md:hidden p-2 rounded"
          aria-label="Menu"
        >
          <div className="space-y-1">
            <span className="block w-6 h-0.5 bg-white" />
            <span className="block w-6 h-0.5 bg-white" />
            <span className="block w-6 h-0.5 bg-white" />
          </div>
        </button>
      </div>

      {/* Nav categorias */}
      <nav className="bg-[#243b53] hidden md:block">
        <div className="max-w-7xl mx-auto px-4 flex gap-1">
          <Link href="/" className="px-4 py-2 text-sm font-semibold hover:bg-blue-600 transition-colors">
            Início
          </Link>
          {CATS.map(cat => (
            <Link
              key={cat}
              href={`/categoria/${cat.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/\s+/g, '-')}`}
              className="px-4 py-2 text-sm hover:bg-blue-600 transition-colors"
            >
              {cat}
            </Link>
          ))}
        </div>
      </nav>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden bg-[#243b53] px-4 pb-4 space-y-1">
          <form action="/busca" className="flex mb-3 pt-3">
            <input
              name="q"
              type="search"
              placeholder="Buscar notícias..."
              className="flex-1 px-3 py-2 rounded-l text-gray-900 text-sm outline-none"
            />
            <button className="bg-blue-500 px-3 rounded-r text-sm">🔍</button>
          </form>
          <Link href="/" className="block py-2 text-sm font-semibold border-b border-navy-700">Início</Link>
          {CATS.map(cat => (
            <Link
              key={cat}
              href={`/categoria/${cat.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/\s+/g, '-')}`}
              className="block py-2 text-sm border-b border-navy-700"
            >
              {cat}
            </Link>
          ))}
        </div>
      )}
    </header>
  )
}
